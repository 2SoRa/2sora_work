var readingUi = (function() {
    // var tabEl;
    // var tabBtns;
    // var tabContents;

    var _init = function() {

        // 231204 nature : GNB SAM 이용권 팝업 내 탭 컨텐츠 생성
        // _tabContents('2. .pop-coupon .tab-contents-coupon');
    };

    // tab contents : 이용권(SAM) 팝업 내 탭 컨텐츠
    var _tabContents = function($el) {
        var tabEl = document.querySelector($el);
        var tabBtns = tabEl.querySelectorAll('.btn-tab');
        var tabContents = tabEl.querySelectorAll('.tab-content');

        // document.querySelector($el).dataset.tabCont = $el;
        // console.log(document.querySelector($el).dataset);

        for(var i=0; i<tabBtns.length; i++) {
            tabBtns[i].addEventListener('click', toggleTabContents);
        }
    };
    function toggleTabContents(e) {
        var activeTarget = e.currentTarget.getAttribute('active-target');

        // var targetParent = document.querySelector('.'+activeTarget).parentElement;
        // var tabContents = targetParent.querySelectorAll('.tab-content');

        var tabEl = e.currentTarget.closest('.tab-contents');
        var tabBtns = tabEl.querySelectorAll('.btn-tab');
        var tabContents = tabEl.querySelectorAll('.tab-content');

        tabContents.forEach(function (target, index) {
            if(target.classList.contains(activeTarget)) {
                target.classList.add('active');
                tabBtns[index].classList.add('active');
                if(tabEl.querySelector('.popup-scroll-area')) {
                    tabEl.querySelector('.popup-scroll-area').scrollTop = 0;
                }
            } else {
                target.classList.remove('active');
                tabBtns[index].classList.remove('active');
            }
        });
    }
    function _setTabContents($el) {
        var tabEl = document.querySelector($el);
        var tabBtns = tabEl.querySelectorAll('.btn-tab');
        var tabContents = tabEl.querySelectorAll('.tab-content');

        tabBtns.forEach(function (target, index) {
            console.log(index);
            if(index!==0 && target.classList.contains('active')) {
                // 최초 액티브 객체(0)이 아닐 경우 active 클래스 제거
                target.classList.remove('active');
                tabContents[index].classList.remove('active');
                // 객체(0) active
                tabBtns[0].classList.add('active');
                tabContents[0].classList.add('active');
            }
        });
    }

    return {
        init : _init,
        tabContents : _tabContents,
        setTabContents : _setTabContents,
    }
})();
readingUi.init();