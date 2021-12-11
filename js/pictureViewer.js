function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

$(document).ready(function() {
  var file = getParameterByName("f");
  loadPhoto(file);
  $($('#preview img')[0]).click(function(){
    var imgTag = $($('#preview img')[0]);
    imgTag.toggleClass('img-fluid').toggleClass('h-100');
    if(imgTag.hasClass('img-fluid')){
      imgTag.css('cursor', 'zoom-out');
    }
    if(imgTag.hasClass('h-100')){
      imgTag.css('cursor', 'zoom-in');
    }
  });

});

function loadPhoto(file){
  //1. get latest commit
  $.ajax({
    type: "GET",
    headers : {
      'Authorization': "Bearer "+getGithubToken(),
      'Accept': 'application/vnd.github.v3+json'
      //Accept: "application/vnd.github.v3.raw"
    },
    url: "https://api.github.com/repos/JValck/lojplmb_fa/commits",
    success: function (data) {
        var urlTree = data[0].commit.tree.url;
        $('#progress').text('Even geduld... [Foto zoeken in archief...]')
        loadTree(urlTree, file);
    }
 });
}

function loadTree(urlTree, file) {
  // 2. Get the sha of the file in the tree
  $.ajax({
    type: "GET",
    headers : {
      'Authorization': "Bearer "+getGithubToken(),
      'Accept': 'application/vnd.github.v3+json'
      //Accept: "application/vnd.github.v3.raw"
    },
    url: urlTree,
    success: function (data) {
      var splitted = file.split('/');
      $('#progress').text('Even geduld... [Foto uit archiefmap halen...]')
      for (var i = 0; i < data.tree.length; i++) {
        if(data.tree[i].type == "tree" && data.tree[i].path == splitted[0]){//is folder and found
          loadTree(data.tree[i].url, file.substring(file.indexOf('/')+1));
          break;
        }else{//is file
          var fileName = data.tree[i].path.split('.').shift();
          var extension = data.tree[i].path.split('.').pop();
          if(fileName == file){
            downloadFile(data.tree[i].url, extension);
            break;
          }
        }
      }
    }
  });
}

function downloadFile(url, extension){
  $('#progress').text('Even geduld... [Foto inladen...]')
  $.ajax({
    type: "GET",
    headers : {
      'Authorization': "Bearer "+getGithubToken(),
      'Accept': 'application/vnd.github.v3+json'
    },
    url: url,
    success: function (data) {
      $($('#preview img')[0]).attr('src', 'data:image/'+extension.toLowerCase()+';base64,'+data.content);
      $('#preview').removeClass('d-none');
      $('#loading').addClass('d-none');
      loadDescription();
    }
  });
}

function loadDescription(){
  loadJsonMap(function (fotoMap) {
    var file = getParameterByName("f");
    var album = file.substring(0, file.lastIndexOf('/'));
    var fileName = file.substring(file.lastIndexOf('/')+1);
    var photoData = fotoMap.filter(function(photo) {
      return photo.Album == album;
    }).filter(function(fileNameInAlbum){
      return fileNameInAlbum.Bestandsnaam == fileName;
    });
    $('#description').html(photoData[0].Info.replaceAll('||', '<br />'));
    loadRequestEditButton(album, fileName);
    loadDownloadButton(fileName);
  });
}

function loadRequestEditButton(album, fileName) {
  var link = "https://docs.google.com/forms/d/e/1FAIpQLSeF1Qolc1o_ud1gqCHUbUpS-eYbQgizrHdmvB6GnuA1hFZ3Xg/viewform?usp=pp_url&entry.1519987025="+album+"&entry.399706837="+fileName;
  $('#requestEditButton').attr('href', link).removeClass('d-none');
}

function loadDownloadButton(fileName) {
  var encodedImage = $($('#preview img')[0]).attr('src');
  var extension = encodedImage.substring(encodedImage.indexOf('/')+1, encodedImage.indexOf(';'))
  $('#requestDownloadButton').attr('download', fileName+'.'+extension);
  $('#requestDownloadButton').attr('href', encodedImage).removeClass('d-none');
}
