var swiperControl = (function(){
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

    // option default
    var defaultSpeed = 300;
    var defaultGap = 0;
    var defaultLoop = true;

    // option custom
    var swiperEffect;
    var swiperSpeed = 300;
    var swiperGap = 0;
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

    var _createSwiper = function(el) {
        swiperContainer = el[0];
        setSwiperEl();
    };

    function setSwiperEl() {
        // elements setting
        swiperEl = swiperContainer.querySelector('.swiper');
        swiperPagination = swiperContainer.querySelector('.swiper-pagination');
        swiperBtnPrev = swiperContainer.querySelector('.swiper-btn-prev');
        swiperBtnNext = swiperContainer.querySelector('.swiper-btn-next');

        // loop setting
        var isAttrLoop = JSON.parse(swiperContainer.getAttribute('swiper-loop'));
        isSwiperLoop = isAttrLoop !== false;

        // autoPlay setting
        var isAttrAuto = JSON.parse(swiperContainer.getAttribute('swiper-auto'));
        isSwiperAuto = !!isAttrAuto;

        // effect setting
        var attrEffect = swiperContainer.getAttribute('swiper-effect');
        swiperEffect = attrEffect ? attrEffect : swiperEffect;

        // slider gap(spaceBetween) setting
        var attrGap = Number(swiperContainer.getAttribute('swiper-gap'));
        swiperGap = attrGap > 0 ? attrGap : 0;

        // speed setting
        var attrSpeed = Number(swiperContainer.getAttribute('swiper-speed'));
        swiperSpeed = attrSpeed <= 0 ? swiperSpeed : attrSpeed;

        // delay setting
        var attrDelay = Number(swiperContainer.getAttribute('swiper-delay'));
        swiperDelay = attrDelay <= 0 ? swiperDelay : attrDelay;

        // view setting
        var attrPerView = Number(swiperContainer.getAttribute('swiper-perView'));
        swiperPerView = attrPerView <= 1 ? swiperPerView : attrPerView;

        // start center setting
        var isAttrCenter= JSON.parse(swiperContainer.getAttribute('swiper-center'));
        isSwiperCenter = !!isAttrCenter;

        // pagination type setting
        // var attrPagingType = swiperContainer.getAttribute('swiper-paging-type');
        // swiperPagingType = attrPagingType ? attrPagingType.toString():swiperPagingType;

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
        // console.log(
        //     'loop:', isSwiperLoop, ', autoPlay:', isSwiperAuto , ' , effect:', swiperEffect, ' , speed:', swiperSpeed,
        //     ' , paging type:', swiperPagingType
        // );

        // create auto swiper
        if(isSwiperAuto) {
            swiper = new Swiper(swiperEl, {
                loop: isSwiperLoop,
                slidesPerView: swiperPerView,
                centeredSlides: isSwiperCenter,
                effect: swiperEffect,
                watchOverflow: true,
                spaceBetween:swiperGap,
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
        } else {
            swiper = new Swiper(swiperEl, {
                loop: isSwiperLoop,
                slidesPerView: swiperPerView,
                centeredSlides: isSwiperCenter,
                effect: swiperEffect,
                watchOverflow: true,
                spaceBetween:swiperGap,
                pagination: {
                    el: swiperPagination,
                    clickable: true,
                    type:swiperPagingType
                },
                navigation: {
                    nextEl: swiperBtnNext,
                    prevEl: swiperBtnPrev,
                },
            });
        }

        swiper.update();
    };

    var _destroySwiper = function(el) {
        // console.log('destroySwiper', swiperEl);

        // swiper.removeAllSlides();
        swiper.destroy(true, true);
    };

    return {
        init : _init,
        createSwiper : _createSwiper,
        destroySwiper : _destroySwiper,
    }
})();
// swiperControl.init('swiper-content');
