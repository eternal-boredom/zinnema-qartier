let time;
let highestModalIndex = document.querySelectorAll(".modal").length - 1;
let nextToPlay = 0;
let globalIdle;
let idleVideoTimeout;
let idleCarouselTimeout;
let idleCarouselInterval;

window.addEventListener("load", () => {
    initMaterialize();
    interruptAutomation();
    idleCarouselPlay();
});

function interruptAutomation() {  
    document.addEventListener("touchstart", () => {
        suspendIdleCarouselPlay();
        suspendIdleVideoPlay();
        
        // clearTimeout(globalIdle);
        // globalIdle = setTimeout(idleCarouselPlay, 5000);
    });
}

// window.addEventListener("contextmenu", e => e.preventDefault());


function initMaterialize() {
    var modals = document.querySelectorAll('.modal');
    var materializedModals = M.Modal.init(modals, {
        onOpenStart: function() {
            suspendIdleVideoPlay();
            suspendIdleCarouselPlay();
            hideHands();
        },
        onOpenEnd: function() {
            this.el.querySelector('video').play();
        },
        onCloseStart: function() {
            this.el.querySelector('video').pause();
        },
        onCloseEnd: function() {
            this.el.querySelector('video').load();
            showHands();
            idleCarouselPlay();
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
        }, 1000)
    }, (5 * 1000))  // 20 secondes (de 1000 ms)
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