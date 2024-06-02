var popupControl = (function(){
    // 공통 요소
    var secContainer;
    var popContainer;

    // video popup
    var popVideo;
    var popVideoWrap;
    var popVideoEl;
    var popYoutubeEl;

    // normal popup
    var popCommon;

    // buttons
    var btnVideo;
    var btnVideoClose;
    var btnPop;

    // current target
    var currentPopupTarget;
    var scrollTopFix;

    // swiper
    var swiperClass = '.swiper-content';
    var isSwiper = false;

    var _init = function(){
        // 공통 요소
        secContainer = $('section');
        popContainer = $('.popup-area');

        // video popup
        btnVideo = secContainer.find('.btn-main-play, .btn-play, .btn-sample');
        popVideo = $('.pop-video');
        popVideoWrap = popVideo.find('.popup-wrap');
        popVideoEl = popVideo.find('#media');
        popYoutubeEl = popVideo.find('#youtube');

        // normal popup
        btnPop = secContainer.find('.btn-pop');
        popCommon = $('.pop-common');

        // button close (.pop-dim을 누르게 되면 정보 입력 팝업의 경우 쉽게 꺼질 위험이 있음)
        btnVideoClose = popContainer.find('.close, .cancle, .popup-dim'); //.pop-dim

        eventHandler();

        // console.log('check popVideoTarget : ', popVideo);
        // popVideo.addClass('show');
    };

    // 231130 pop-video include 파일로 로드하면서 비디오 요소, 이벤트 추가 정의 필요 (추후 좀 더 단순한 방향으로 수정할 것)
    var setVideoEl = function($isVideo) {
        popContainer = $('.popup-area');
        popVideo = $('.pop-video');
        popVideoWrap = popVideo.find('.popup-wrap');
        popVideoEl = popVideo.find('#media');
        popYoutubeEl = popVideo.find('#youtube');

        // video
        if($isVideo) {
            popVideoEl.css('display', 'block');
            popYoutubeEl.css('display', 'none');

        }
        // youtube
        else {
            popVideoEl.css('display', 'none');
            popYoutubeEl.css('display', 'block');
        }

        btnVideoClose = popContainer.find('.close, .cancle, .popup-dim'); //.pop-dim
        $(btnVideoClose).on('click', popupClose);
    };

    var eventHandler = function() {
        $(btnPop).on('click', popupOpen);
        $(btnVideo).on('click', popupOpen);
        $(btnVideoClose).on('click', popupClose);
    };

    function popupOpen(e) {
        // video popup
        if($(e.currentTarget).attr('data-src')) {
            setVideoEl(true);
            popupVideoShow(e.currentTarget, true);

            popVideo = $('.pop-video'); // 팝업 객체 include로 바꾸면서 추가
            popVideo.addClass('active');
            currentPopupTarget = popVideo;
        }

        // youtube popup
        else if($(e.currentTarget).attr('data-youtube-src')) {   // video popup
            setVideoEl(false);
            popupVideoShow(e.currentTarget, false);

            popVideo = $('.pop-video'); // 팝업 객체 include로 바꾸면서 추가
            popVideo.addClass('active');
            currentPopupTarget = popVideo;
        }

        // 일반 팝업
        else if($(e.currentTarget).attr('popup-target')) {
            var targetClass = '.'+$(e.currentTarget).attr('popup-target');
            var popupTarget = $('body').find(targetClass);
            $(popupTarget).addClass('active');
            currentPopupTarget = $(popupTarget);
        }

        bodyScrollLock();
        isCheckSwiper();
    }

    function isCheckSwiper() {
        var swiperEl = currentPopupTarget.find(swiperClass);
        isSwiper = swiperEl.length>0 ? true : false;
        if(isSwiper) callCreateSwiper();
    }

    function callCreateSwiper() {
        // TODO : 동적으로 swiper 생성 시 createSwiper 호출
        // swiperControl.createSwiper(swiper target(.swiper-content));
        swiperControl.createSwiper(currentPopupTarget.find('.swiper-content'));
    }


    function popupVideoShow($el, $isVideo){
        popupVideoPlay($el, $isVideo);
    }

    function popupVideoPlay($el, $isVideo) {
        var mediaUrl;

        // video
        if($isVideo) {
            mediaUrl = $($el).data('src');
            setTimeout(function() {
                popVideoEl.attr("src", mediaUrl);
            }, 30);
        }
        // youtube
        else {
            mediaUrl = $($el).data('youtube-src');
            setTimeout(function() {
                popYoutubeEl.attr("src", mediaUrl);
            }, 30);
        }
        // console.log(mediaUrl);
    }

    function popupVideoHide(e) {
        popupVideoReset();
    }

    function popupVideoReset() {
        popYoutubeEl.attr('src', '');
        popVideoEl.attr('src', '');
    }

    function popupClose(e) {
        // console.log(currentPopupTarget);
        if(!common.isNull(currentPopupTarget)){
            currentPopupTarget.removeClass('active');
            currentPopupTarget = null;

            bodyScrollAuto();
            popupVideoHide(e);

            if(isSwiper) {
                swiperControl.destroySwiper(currentPopupTarget);
            }
        }
    }

    function bodyScrollLock() {
        // scrollTopFix = document.querySelector('html').scrollTop;
        document.querySelector('body').style.overflow = 'hidden';
    }

    function bodyScrollAuto() {
        document.querySelector('body').style.overflow = 'auto';
    }


    return {
        init : _init,
    }
})();
popupControl.init();