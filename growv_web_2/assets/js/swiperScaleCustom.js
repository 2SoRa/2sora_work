var swiperScaleCustom = (function(){
    // swiper
    var swiperContainer;
    var swiperEl;
    var swiper;

    // 사용자 액션 없이 스와이퍼 셋팅 필요할 경우 : swiperScaleCustom.init('swiper-content');
    // class name을 인자값으로 전달받아야 함
    var _init = function(el){
        swiperContainer = document.getElementsByClassName(el)[0];
        swiperEl = swiperContainer.querySelector('.swiper');

        makeSwiper();
    };

    var makeSwiper = function() {
        swiper = new Swiper(swiperEl, {
            loop: true,
            slidesPerView:7,
            loopFillGroupWithBlank:true,
            centeredSlides: true,
            allowTouchMove: false,
            autoplay: {
                delay: 2000,
            },
            on: {
                realIndexChange : function(){
                    this.slides.forEach((el) => {
                        el.classList.remove('swiper-slide-prev-2', 'swiper-slide-next-2');
                    });

                    var prevEl = this.slides[this.activeIndex-2];
                    var nextEl = this.slides[this.activeIndex+2];

                    if(prevEl) {
                        prevEl.classList.add('swiper-slide-prev-2');
                    }
                    if(nextEl) {
                        nextEl.classList.add('swiper-slide-next-2');
                    }
                }
            },
        });

        swiper.update();
    };

    return {
        init : _init,
    }
})();
