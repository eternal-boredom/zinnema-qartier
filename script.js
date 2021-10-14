window.addEventListener("load", () => {
    initMaterialize();
    // idlePlay();
});

window.addEventListener("contextmenu", e => e.preventDefault());

let highestModalIndex = document.querySelectorAll(".modal").length - 1;
let nextToPlay = 0;
let idleTimeout;

function initMaterialize() {
    var modals = document.querySelectorAll('.modal');
    var materializedModals = M.Modal.init(modals, {
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
            // idlePlay();
        }
    });

    var carousel = document.querySelectorAll('.carousel');
    const carouselOptions = {
        numVisible: 5,
        shift: 100,
        padding: 100
    }
    let materializedCarousel = M.Carousel.init(carousel, carouselOptions);
}

const videos = document.querySelectorAll('video');

videos.forEach((video) => {
    video.addEventListener("ended", (event => {
        let instance = M.Modal.getInstance(event.target.closest(".modal"));
        instance.close();
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

