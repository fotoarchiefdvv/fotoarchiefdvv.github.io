function verifyToken(){
  window.localStorage.setItem('token', $('#token').val());

  window.location.href = 'opening.html';
  return false;
}
