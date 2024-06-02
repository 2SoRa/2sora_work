var swiperKvBanner = (function(){
    // swiper
    var swiperContainer;
    var swiperEl;
    var swiper;
    var swiperPagination;
    var swiperPageFraction;
    var swiperBtnPrev;
    var swiperBtnNext;

    var eventSwiper;
    var btnClose;

    // option custom
    var swiperEffect;
    var swiperSpeed = 300;
    var isSwiperLoop = true;
    var isSwiperAuto = false;
    var swiperDelay = 3000;
    var swiperPerView = 1;
    var isSwiperCenter = false;
    var isPagingTypeFraction = false;
    var swiperPagingType = "bullets";

    // 사용자 액션 없이 스와이퍼 셋팅 필요할 경우 : swiperControl.init('swiper-content');
    // class name을 인자값으로 전달받아야 함 (전달 방식에 따라 init, creatSwiper 둘다 사용 가능)
    var _init = function(el){
        swiperContainer = document.getElementsByClassName(el)[0];
        setSwiperEl();
    };

    function setSwiperEl() {
        // elements setting
        swiperEl = swiperContainer.querySelector('.swiper');
        swiperPagination = swiperContainer.querySelector('.swiper-pagination');
        swiperBtnPrev = swiperContainer.querySelector('.swiper-btn-prev');
        swiperBtnNext = swiperContainer.querySelector('.swiper-btn-next');

        // fraction pagination setting
        var isFraction = swiperContainer.querySelectorAll('.swiper-pagination-fraction').length;
        isPagingTypeFraction = isFraction >= 1;
        if(isPagingTypeFraction === true) {
            swiperPageFraction = swiperContainer.querySelector('.swiper-pagination-fraction');
        }

        // ===> create Swiper
        makeSwiper();
    }

    var makeSwiper = function() {

        // create auto swiper
        swiper = new Swiper(swiperEl, {
            loop: isSwiperLoop,
            slidesPerView: swiperPerView,
            centeredSlides: isSwiperCenter,
            effect: swiperEffect,
            watchOverflow: true,
            pagination: {
                el: swiperPagination,
                clickable: true,
                type:swiperPagingType
            },
            navigation: {
                nextEl: swiperBtnNext,
                prevEl: swiperBtnPrev,
            },
            autoplay : {
                delay : swiperDelay,
            },
            on: {
                slideChange:function() {
                    if(isPagingTypeFraction) {
                        swiperPageFraction.querySelector('.swiper-pagination-current').innerText = this.realIndex+1;
                        swiperPageFraction.querySelector('.swiper-pagination-total').innerText = this.slides.length;
                    }
                }
            }
        });
        swiper.update();
    };

    var _destroySwiper = function(el) {
        // swiper.removeAllSlides();
        swiper.destroy(true, true);
    };

    return {
        init : _init,
        destroySwiper : _destroySwiper,
    }
})();
// swiperControl.init('swiper-content');
