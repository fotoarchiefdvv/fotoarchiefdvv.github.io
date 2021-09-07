$(document).ready(function(){
  loadAlbumsMap(displayAlbums);
});

function displayAlbums(data) {
  var albums = data.map(function(albumInfo) {
    return {
      name: albumInfo.Name,
      pictureCount: albumInfo.Pictures.length
    }
  })
  for (var i = 0; i < albums.length; i++) {
    var htmlAsString = '<div class="border d-flex align-items-center justify-content-between w-100 my-4"><p id="albumName" class="mb-0 ms-2"></p><a target="_blank" href="#" id="browse" class="btn btn-primary">Bladeren</a></div>';
    var toInsert = $($.parseHTML(htmlAsString));
    $(toInsert.find('#albumName')[0]).text(albums[i].name+" ("+albums[i].pictureCount+" foto's)");
    $(toInsert.find('#browse')[0]).attr('href', "albumBrowser.html?a="+albums[i].name);
    $('#albums').append(toInsert);
  }
  $('#loading').remove();
}
