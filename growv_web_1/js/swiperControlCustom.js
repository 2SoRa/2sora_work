var swiperControl = (function(){
    // swiper
    var swiperContainer;
    var swiperEl;
    var swiper;
    var swiperPagination;
    // var swiperBtnPrev;
    // var swiperBtnNext;
    // var eventSwiper;
    // var btnClose;


    // 사용자 액션 없이 스와이퍼 셋팅 필요할 경우 : swiperControl.init('swiper-content');
    // class name을 인자값으로 전달받아야 함
    var _init = function(el){
        swiperContainer = document.getElementsByClassName(el)[0];
        swiperEl = swiperContainer.querySelector('.swiper');
        swiperPagination = swiperContainer.querySelector('.swiper-pagination');
        // swiperBtnPrev = swiperContainer.querySelector('.swiper-btn-prev');
        // swiperBtnNext = swiperContainer.querySelector('.swiper-btn-next');
        // console.log('init : ', swiperContainer);

        makeSwiper();
    };

    var _createSwiper = function(el) {
        swiperContainer = el[0];
        swiperEl = swiperContainer.querySelector('.swiper');
        swiperPagination = swiperContainer.querySelector('.swiper-pagination');
        // swiperBtnPrev = swiperContainer.querySelector('.swiper-btn-prev');
        // swiperBtnNext = swiperContainer.querySelector('.swiper-btn-next');

        makeSwiper();
    };

    var makeSwiper = function() {
        swiper = new Swiper(swiperEl, {
            // 속도
            speed: 1500,
            // 반복
            loop: true,
            // 전환 효과
            effect: 'fade',
            fadeEffect: { crossFade: true },
            // 슬라이드 1개 일 경우, 페이지 등 동작 안하도록 함
            watchOverflow: true,
            // 자동 재생
            touchRatio: 0,
            autoplay: {
                delay: 3000,
                // 마우스 올리면 멈춤
                pauseOnMouseEnter: true,
                disableOnInteraction: false,
            },
            pagination: {
                el: swiperPagination,
                clickable: false,
            },
            on: {
                // slideChange : function(){
                //     console.log(swiperEl, this.realIndex);
                //
                //
                //     swiperContainer.classList.remove('bg-on-01','bg-on-02');
                //
                //     var activeClass = 'bg-on-0'+(this.realIndex+1);
                //     swiperContainer.classList.add(activeClass);
                // },
                // Index 바뀔 때
                realIndexChange : function(){
                    // console.log(swiperEl, this.realIndex);
                    const bgList = document.querySelectorAll('.swiper-bg-content div');
                        bgList.forEach((el, index) => {
                            if(el.classList.contains('active')){
                                el.classList.remove('active');
                            }
                        });
                    bgList[this.realIndex].classList.add('active');
                }
            }
            // navigation: {
            //     nextEl: swiperBtnNext,
            //     prevEl: swiperBtnPrev,
            // },
        });

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
