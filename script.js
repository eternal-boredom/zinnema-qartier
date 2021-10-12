let req = new XMLHttpRequest();
req.open('GET', './assets/videos/manuel-murillo-tropez.mp4', true);
req.responseType = 'blob';
console.log('before onload')

req.onload = () => {
    console.log('onload, req.status: ', req.status);
    if (req.status === 200) {
        let videoBlob = req.response;
        console.log('req.response: ', req.response);
        console.log('videoBlob typeof: ', typeof videoBlob);

        // let vid = URL.createObjectURL(videoBlob);
        // console.log('vid: ', vid);
        // document.querySelector('#m9 > source').src = vid;

        const video = document.createElement('video');
        video.srcObject = videoBlob;
        document.querySelector('#m9 > div').appendChild(video);
    }
}

req.onerror = () => {
    console.log('error');
}

req.send();

window.addEventListener("load", () => {
    initMaterialize();
    // idlePlay();
});

let highestModalIndex = document.querySelectorAll(".modal").length - 1;
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
    }, (10 * 1000))  // 5 fois 60 secondes (1000 ms)
}

function suspendIdlePlay() {
    clearTimeout(idleTimeout);
}

