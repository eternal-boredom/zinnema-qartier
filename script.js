let highestModalIndex = document.querySelectorAll(".modal").length - 1;
let nextToPlay = 0;
let globalIdle;
let isPlaying = false;
let idleVideoTimeout;
let idleCarouselTimeout;
let idleCarouselInterval;

window.addEventListener("load", () => {
    initMaterialize();
    interruptAutomation();
    idleCarouselPlay();
    closeModalHandler();
});

function interruptAutomation() {  
    document.addEventListener("touchstart", () => {
        suspendIdleCarouselPlay();
        suspendIdleVideoPlay();
        
        clearTimeout(globalIdle);
        globalIdle = setTimeout(() => {
            if (!isPlaying) {
                idleCarouselPlay();
            }
        }, 15000); // temps de relance après activité de l'utilisateur
    });
}

// window.addEventListener("contextmenu", e => e.preventDefault());


function initMaterialize() {
    var modals = document.querySelectorAll('.modal');
    var materializedModals = M.Modal.init(modals, {
        onOpenStart: function() {
            isPlaying = true;
            suspendIdleVideoPlay();
            suspendIdleCarouselPlay();
            videoCloserTransition();
            hideHands();
        },
        onOpenEnd: function() {
            this.el.querySelector('video').play();
        },
        onCloseStart: function() {
            this.el.querySelector('video').pause();
            videoCloserTransition();
        },
        onCloseEnd: function() {
            isPlaying = false;
            this.el.querySelector('video').load();
            idleCarouselPlay();
            showHands();
        }
    });

    var carousel = document.querySelectorAll('.carousel');
    const carouselOptions = {
        numVisible: 5
    }
    let materializedCarousels = M.Carousel.init(carousel, carouselOptions);

    document.querySelector("#left_arrow").addEventListener("click", (event) => {
        suspendIdleVideoPlay();
        suspendIdleCarouselPlay();
        materializedCarousels[0].prev();
    })

    document.querySelector("#right_arrow").addEventListener("click", (event) => {
        suspendIdleVideoPlay();
        suspendIdleCarouselPlay();
        materializedCarousels[0].next();
    })
}

const videos = document.querySelectorAll('video');

videos.forEach((video) => {
    video.addEventListener("ended", (event => {
        let instance = M.Modal.getInstance(event.target.closest(".modal"));
        instance.close();
    }))
});

function idleVideoPlay() {
    idleVideoTimeout = setTimeout(() => {
        let instance = M.Modal.getInstance(document.querySelectorAll(".modal")[nextToPlay]);
        instance.open();
        if (nextToPlay < highestModalIndex) {
            nextToPlay++;
        } else {
            nextToPlay = 0;
        }
    }, (10 * 1000))  // 10 secondes (de 1000 ms)
}

function idleCarouselPlay() {
    idleCarouselTimeout = setTimeout(() => {
        let rotationCount = 0;
        let instance = M.Carousel.getInstance(document.querySelector("#carousel"));
        idleCarouselInterval = setInterval(() => {
            instance.next();
            if (++rotationCount === 19) {
                idleVideoPlay();
                suspendIdleCarouselPlay();
            }
        }, 10000)
    }, (20 * 1000))  // 20 secondes (de 1000 ms)
}

function suspendIdleVideoPlay() {
    clearTimeout(idleVideoTimeout);
}

function suspendIdleCarouselPlay() {
    clearTimeout(idleCarouselTimeout);
    clearInterval(idleCarouselInterval);
}

function hideHands() {
    const hands = document.querySelectorAll(".hand");
    hands.forEach((hand) => {hand.style.display = "none"});
}

function showHands() {
    const hands = document.querySelectorAll(".hand");
    hands.forEach((hand) => {hand.style.display = "block"});
}

function closeModalHandler() {
    const videoCloser = document.querySelector("#videoClose");
    videoCloser.addEventListener("click", (event) => {
        let modal = document.querySelector(".modal.open");
        let instance = M.Modal.getInstance(modal);
        instance.close();
    })
}

function videoCloserTransition() {
    const videoCloser = document.querySelector("#videoClose");

    if (videoCloser.classList.contains('hide-element')) {
        // show
        videoCloser.classList.add('element-transition');
        videoCloser.clientWidth; // force layout to ensure the now display: block and opacity: 0 values are taken into account when the CSS transition starts.
        videoCloser.classList.remove('hide-element');
    } else {
        // hide
        videoCloser.classList.add('element-transition');
        videoCloser.classList.add('hide-element');
    }
}