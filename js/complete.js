$(document).ready(function() {
  loadJsonMap(displayResults)
});

function displayResults(data){
  var photosWithUnknownPeople = [];
  for (var i = 0; i < data.length; i++) {
    if(data[i].Info && typeof data[i].Info === 'string' && data[i].Info.includes('?')){
      photosWithUnknownPeople.push(data[i]);
    }
  }
  $('#toComplete').empty();
  for (var i = 0; i < photosWithUnknownPeople.length; i++) {
    displayPhotoCompletion(photosWithUnknownPeople[i]);
  }
  $('#loading').addClass('d-none');
}

function displayPhotoCompletion(photoInfo) {
  var htmlAsString = '<div class="border d-flex align-items-center justify-content-between w-100 my-4"><div class="d-flex flex-column py-2"><p id="photoInfo" class="mb-0"></p><div><span class="badge rounded-pill bg-secondary" id="album"></span><span class="badge rounded-pill bg-secondary" id="jaar"></span></div></div><a target="_blank" href="#" id="identifyLink" class="btn btn-primary">Identificeren</a></div>';
  var toInsert = $($.parseHTML(htmlAsString));
  $(toInsert.find('#photoInfo')[0]).text(photoInfo.Info);
  $(toInsert.find('#album')[0]).text(photoInfo.Album);
  $(toInsert.find('#identifyLink')[0]).attr('href', "pictureViewer.html?f="+photoInfo.Album+'/'+photoInfo.Bestandsnaam);
  if(photoInfo.Jaar > 0) $(toInsert.find('#jaar')[0]).text(photoInfo.Jaar);
  $('#toComplete').append(toInsert);
}
