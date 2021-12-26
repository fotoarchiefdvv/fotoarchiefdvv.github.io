$(document).ready(function() {
  setInterval(displayResults, 3000);
  $('#loadingResults').addClass('d-none');
  getThumbnail('', function(){}, null);
});
var loadedPhotos = [];
var photosToLoad = 0;

// observer for visibility of search result card
var observer = new IntersectionObserver(function(entries) {
  for (var i = 0; i < entries.length; i++) {
    if(entries[i]['isIntersecting'] === true) {
      loadThumbnail($(entries[i].target).data('path'), $(entries[i].target).find('img')[0].id);
      observer.unobserve(entries[i].target)
    }
  }
}, { threshold: [0.5] });

function toggleNameBox(){
  if($('#naamCheckbox:checked').length > 0){
    $('#naamBox').removeClass('d-none').addClass("d-block");
    $('#naam').attr('required', true);
  }else{
    $('#naamBox').removeClass('d-block').addClass("d-none");
    $('#naam').attr('required', false);
  }
}
function toggleYearBox(){
  if($('#jaartalCheckbox:checked').length > 0){
    $('#jaartalBox').removeClass('d-none').addClass("d-block");
    $('#jaartal').attr('required', true);
  }else{
    $('#jaartalBox').removeClass('d-block').addClass("d-none");
    $('#jaartal').attr('required', false);
  }
}
function bootSearch(){
 loadJsonMap(search);
 return false;
}

function search(fotoMap){
  $('#totalPhotoCount').text(fotoMap.length);
  var filtered = [];

  if($('#jaartal').is(':visible')){
    for (var i = 0; i < fotoMap.length; i++) {
      var info = getYear(fotoMap[i]);
      if(info && (parseInt(info) == parseInt($('#jaartal').val()))){
        filtered.push(fotoMap[i])
      }
    }
    fotoMap = filtered;
  }

  filtered = [];
  if($('#naam').is(':visible')){
    var querySanitized = $('#naam').val().trim().replaceAll('?', '\\?').replaceAll('*','\\*');
    var splittedQuery = querySanitized.split('+');
    var completeQuery = "";
    for (var i = 0; i < splittedQuery.length; i++) {//splitted for searching combinations
      completeQuery += "(?=.*\\b"+splittedQuery[i].trim()+"\\b)"
    }
    var nameRegex = new RegExp(completeQuery, 'i');
    for (var i = 0; i < fotoMap.length; i++) {
      var info = getInfo(fotoMap[i]);
      if(info && typeof info === 'string' && info.search(nameRegex) != -1){
        filtered.push(fotoMap[i])
      }
    }
    fotoMap = filtered;
  }
  loadResults(fotoMap);

  return false;
}

function getInfo(fotoData){
  if(typeof(fotoData.info) != 'undefined'){
    return fotoData.info;
  }
  if(typeof(fotoData.Info) != 'undefined'){
    return fotoData.Info;
  }
  return null;
}

function getYear(fotoData) {
  return fotoData.Jaar;
}

function loadResults(fotoMap){
  $('#resultCount').text(fotoMap.length);
  $('#searchResults').empty();
  $('#timeline').empty();

  photosToLoad = fotoMap.length;
  loadedPhotos = [];

  if(photosToLoad > 0) $('#loadingResults').removeClass('d-none');

  for (var i = 0; i < fotoMap.length; i++) {
    var current = fotoMap[i];
    $.ajax({
      url : "partial/found.html",
      type : "get",
      async: false,
      success : (function(response) {
        var partialContent = $(response);
        $(partialContent.find('h5')[0]).text(this.Bestandsnaam)
        $(partialContent.find('#description')[0]).text("Beschrijving en personen op de foto: "+getInfo(this));
        $(partialContent.find('#soort')[0]).text(this.Soort ? this.Soort : "Foto");
        $(partialContent.find('#viewer')[0]).attr('href', "pictureViewer.html?f="+this.Album+'/'+this.Bestandsnaam);
        $(partialContent.find('#album')[0]).text(this.Album ? this.Album : "Zonder album");
        $(partialContent.find('.year')[0]).text(this.Jaar);
        $(partialContent.find('.month')[0]).text(this.Maand);
        $(partialContent.find('.day')[0]).text(this.Dag);

        var datum = this.Jaar < 0 ? "Zonder datum":((this.Dag > 0 ? this.Dag+"/":"")+(this.Maand > 0 ? this.Maand+"/":(this.Dag > 0)?"??/":"")+this.Jaar);
        $(partialContent.find('.datum')[0]).text(datum);
        $(partialContent).data('path', this.Album+'/'+this.Bestandsnaam);

        var id = ('preview-'+this.Album.toString()+'_'+this.Bestandsnaam).replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "_");

        $(partialContent.find('img')[0]).attr('id', id);
        loadedPhotos.push({
          html: partialContent,
          data: this,
        });
      }).bind(current),
   });
  }
}

function displayResults() {
  if(loadedPhotos.length == photosToLoad && photosToLoad > 0){
    photosToLoad = 0;
    var sortedMap = loadedPhotos.sort(function (a, b) {
      if(a.data.Jaar < b.data.Jaar) return -1;
      if(a.data.Jaar > b.data.Jaar) return 1;

      if(a.data.Maand < b.data.Maand) return -1;
      if(a.data.Maand > b.data.Maand) return 1;

      if(a.data.Dag < b.data.Dag) return -1;
      if(a.data.Dag > b.data.Dag) return 1;

      return 0;
    });

    for (var i = 0; i < sortedMap.length; i++) {
      var id = ('preview-'+sortedMap[i].data.Album.toString()+'_'+sortedMap[i].data.Bestandsnaam).replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "_");
      $('#searchResults').append(sortedMap[i].html);
    }
    bindInScreenObserver();
    $('#loadingResults').addClass('d-none');
  }
}

function bindInScreenObserver() {
  var results = document.querySelectorAll('.resultColumn');
  for (var i = 0; i < results.length; i++) {
    observer.observe(results[i]);
  }
}


function loadThumbnail(filePath, id){
  getThumbnail(filePath, displayThumbnail, id);
}

function displayThumbnail(thumbnail, id) {
  $($('#'+id)[0]).attr('src', thumbnail);
}
