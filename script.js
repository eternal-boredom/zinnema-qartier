window.addEventListener("load", initMaterialize);

function initMaterialize() {
    M.AutoInit();
}

const video = document.querySelector('video');
var instance = M.Modal.getInstance(video);

instance.


video.addEventListener('canplaythrough', (event) => {
    video.play()
  console.log('I think I can play through the entire ' +
      'video without ever having to stop to buffer.');
});