function loadLargeFile(file, callback, progressCallback){
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
        if(typeof progressCallback == 'function'){
          progressCallback();
        }
        loadTree(urlTree, file, callback, progressCallback);
    }
 });
}

function loadTree(urlTree, file, callback, progressCallback) {
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
      if(typeof progressCallback == 'function'){
        progressCallback();
      }
      for (var i = 0; i < data.tree.length; i++) {
        if(data.tree[i].type == "tree" && data.tree[i].path == splitted[0]){//is folder and found
          loadTree(data.tree[i].url, file.substring(file.indexOf('/')+1), callback, progressCallback);
          break;
        }else{//is file
          var fileName = data.tree[i].path.split('.').shift();
          var extension = data.tree[i].path.split('.').pop();
          if(fileName.length && file.includes(fileName)){
            downloadFile(data.tree[i].url, extension, callback, progressCallback);
            break;
          }
        }
      }
    }
  });
}

function downloadFile(url, extension, callback, progressCallback){
  if(typeof progressCallback == 'function'){
    progressCallback();
  }
  $.ajax({
    type: "GET",
    headers : {
      'Authorization': "Bearer "+getGithubToken(),
      'Accept': 'application/vnd.github.v3.raw'
    },
    url: url,
    success: function (data) {
      if(typeof callback == 'function'){
        callback(data);
      }
    }
  });
}
