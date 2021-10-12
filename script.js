window.addEventListener("load", initMaterialize);

let highestModalIndex = 1;
let nextToPlay = 0;
let idleTimeout;

function initMaterialize() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {
        onOpenStart: function() {
            suspendIdlePlay();
        },
        onOpenEnd: function() {
            this.el.querySelector('video').play();
        },
        onCloseStart: function() {
            this.el.querySelector('video').pause();
        },
        onCloseEnd: function() {
            this.el.querySelector('video').load();
            idlePlay();
        }
    });
    console.log(instances);
}

const videos = document.querySelectorAll('video');

videos.forEach((video) => {
    video.addEventListener("ended", (event => {
        let instance = M.Modal.getInstance(event.target.closest(".modal"));
        instance.close();
        isPlaying = false;
    }))
});

function idlePlay() {
    idleTimeout = setTimeout(() => {
        let instance = M.Modal.getInstance(document.querySelectorAll(".modal")[nextToPlay]);
        instance.open();
        if (nextToPlay < highestModalIndex) {
            nextToPlay++;
        } else {
            nextToPlay = 0;
        }
    }, (5 * 60 * 1000))  // 5 fois 60 secondes (1000 ms)
}

function suspendIdlePlay() {
    clearTimeout(idleTimeout);
}

idlePlay();