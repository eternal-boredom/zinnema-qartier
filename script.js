window.addEventListener("load", initMaterialize);

let isPlaying = false;

function initMaterialize() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {
        onOpenEnd: function() {
            this.el.querySelector('video').play();
            isPlaying = true;
        },
        onCloseStart: function() {
            this.el.querySelector('video').pause();
            isPlaying = false;
        },
        onCloseEnd: function() {
            this.el.querySelector('video').load();
        }
    });
    console.log(instances);
}

const videos = document.querySelectorAll('video');

videos.forEach((video) => {
    video.addEventListener("ended", (event => {
        // console.log(event.target.closest(".modal"));
        let instance = M.Modal.getInstance(event.target.closest(".modal"));
        instance.close();
    }))
})
