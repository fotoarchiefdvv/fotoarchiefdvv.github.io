function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var currentPhoto = 0;
var activeAlbum = null;

$(document).ready(function() {
  loadAlbumsMap(prepareWindowStorage);
});

function prepareWindowStorage(albums) {
  activeAlbum = albums.filter(function (al) {
    return al.Name == getParameterByName("a");
  })[0];
  currentPhoto = -1;
  loadNextPhoto();
}

function loadNextPhoto() {
  currentPhoto++;
  $('#viewer').attr('src', 'pictureViewer.html?f='+activeAlbum.Pictures[currentPhoto].Album+"/"+activeAlbum.Pictures[currentPhoto].Bestandsnaam);
  updateNavigationButtonsVisibility();
  return  false;
}

function loadPreviousPhoto() {
  currentPhoto--;
  $('#viewer').attr('src', 'pictureViewer.html?f='+activeAlbum.Pictures[currentPhoto].Album+"/"+activeAlbum.Pictures[currentPhoto].Bestandsnaam);
  updateNavigationButtonsVisibility();
  return  false;
}

function updateNavigationButtonsVisibility() {
  console.log(currentPhoto < activeAlbum.Pictures.length, $('#next').hasClass('invisible'));
  if(currentPhoto === activeAlbum.Pictures.length - 1 && $('#next').hasClass('visible')){
    $('#next').removeClass('visible').addClass('invisible');
  }else if(currentPhoto < activeAlbum.Pictures.length && $('#next').hasClass('invisible')){
    $('#next').removeClass('invisible').addClass('visible');
  }
  if(currentPhoto === 0 && $('#previous').hasClass('visible')){
    $('#previous').removeClass('visible').addClass('invisible');
  }else if(currentPhoto != 0 && $('#previous').hasClass('invisible')){
    $('#previous').removeClass('invisible').addClass('visible');
  }
}
