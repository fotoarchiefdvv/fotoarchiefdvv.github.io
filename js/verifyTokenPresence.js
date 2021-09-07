$(document).ready(function() {
  checkToken();
});

function checkToken() {
  if(window.localStorage.getItem("token") === null){
    window.location.href="index.html"
  }
  console.log('Token found')
}

function getGithubToken(){
  return window.localStorage.getItem("token");
}
