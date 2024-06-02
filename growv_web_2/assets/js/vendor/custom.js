$(document).ready(function () {
	$('.custom-select').on('change', function () {
        $(this).css('color', 'var(--input_text)');
    });

    /*상단으로 가는버튼*/
    $('.top_btn').on('click', function () {
        $('html, body').animate(
        {
            scrollTop: 0,
        },
        400
        );
        return false;
    });

    // 찜버튼
    $('.wish_btn2').on('click', function () {
        $(this).toggleClass('on');
    });

    $('.sel_wrap').on('click', function () {
        $(this).toggleClass('active');
    });

    // 모바일 메뉴
	/*해당으로 js 먼저 발생될경우 인식 안될 경우 있음*/
	$(document).on("click", ".hd_menu_btn", function (){
		openMobileNav();
	});
	$(document).on("click", ".close_btn_wr", function (){
		closeMobileNav();
	});
	// 231129 nature 추가 (이용권 버튼 클릭 시 모바일 네비만 닫히고 팝업 등장)
	$(document).on("click", '.btn-close-nav', function() {
		closeMobileNav();
	});
	
	// 240105 nature 추가 (리사이징 시 메뉴 닫힘, open, close 함수 분리)
	var winWidth = $(window).width();
	var isMobileCheck = winWidth < 992;
	isMobileCheck = !isMobileCheck;
	setMobile();

	$(window).on("resize", function() {
		setMobile();
	});

	function setMobile() {
		winWidth = $(window).width();

		if (winWidth >= 992 && isMobileCheck) {	// pc
			// console.log('web');
			closeMobileNav();
		} else if(winWidth < 992  && !isMobileCheck) {				// mobile
			// console.log('mobile');
		}
		isMobileCheck = winWidth < 992;
	}
	function openMobileNav() {
		$('body').addClass('menu_on');
		// 231129 nature 추가
		document.querySelector('body').style.overflow = 'hidden';
	}
	function closeMobileNav() {
		$('body').removeClass('menu_on');
		$('body').removeClass('filter_on');
		// 231129 nature 추가
		document.querySelector('body').style.overflow = 'auto';
	}

    // 모바일 메뉴 닫기
    /*$('.close_btn_wr').on('click', function () {
        $('body').removeClass('menu_on');
        $('body').removeClass('filter_on');
    });*/
    // 검은색 배경 눌러도 메뉴 닫기
    $('.menu_bg').on('click', function () {
        $('body').removeClass('menu_on');
    });

    // 모바일 필터 열기
    $('.filter_btn').on('click', function () {
        $('body').addClass('filter_on');
    });
    // 검은색 배경 눌러도 필터 닫기
    $('.filter_bg').on('click', function () {
        $('body').removeClass('filter_on');
    });

    // 찜, 장바구니 버튼 클릭시 페이지 이동 안되도록
    $('.item_btn_wr .btn').on('click', function (e) {
        e.preventDefault();
    });

    // 리스트 이미지 max-height 조절
    var boxWidth = $('.item_list1 .item_img').width();

    if (winWidth >= 992 && boxWidth <= 300) {
        $('.item_list1 .item_img img').css('max-height', boxWidth * 1.85);
    } else if (boxWidth <= 300) {
        $('.item_list1 .item_img img').css('max-height', boxWidth * 1.7);
    }
});


//하단메뉴 스크롤따라 움직이게하기
let lastScroll = 0;
$(window).on('scroll', function(){
    let scrollTop = $(this).scrollTop();
    if(scrollTop > lastScroll) {
        //down
        $('.mo_menu').removeClass('fixed');
    } else {
        // up
        $('.mo_menu').addClass('fixed');
    }
    lastScroll = scrollTop;
}); 


$(document).ready(function () {
	$('.form-password img').on('click',function(){
		$('input').toggleClass('active');
		if($('input').hasClass('active')){
			$(this).attr('src',"./resources/img/icon_blind_on.png")
			.prev('input').attr('type',"text");
		}else{
			$(this).attr('src',"./resources/img/icon_blind.png")
			.prev('input').attr('type','password');
		}
	});//패스워드 눈가리기/눈 보이기
});



$(document).ready(function () {
	//테이블 가로스크롤 마우스로 터치
	window.onload = function () {
		if ($(".touch_scroll").length) {
			touchScroll(".touch_scroll");
		}
	};

	function touchScroll($bind = "") {
		const slider = document.querySelector($bind);
		let isDown = false;
		let startX;
		let scrollLeft;

		slider.addEventListener("mousedown", (e) => {
			isDown = true;
			slider.classList.add("active");
			startX = e.pageX - slider.offsetLeft;
			scrollLeft = slider.scrollLeft;
			cancelMomentumTracking();
		});

		slider.addEventListener("mouseleave", () => {
			isDown = false;
			slider.classList.remove("active");
		});

		slider.addEventListener("mouseup", () => {
			isDown = false;
			slider.classList.remove("active");
			beginMomentumTracking();
		});

		slider.addEventListener("mousemove", (e) => {
			if (!isDown) return;
			e.preventDefault();
			const x = e.pageX - slider.offsetLeft;
			const walk = (x - startX) * 3; //scroll-fast
			var prevScrollLeft = slider.scrollLeft;
			slider.scrollLeft = scrollLeft - walk;
			velX = slider.scrollLeft - prevScrollLeft;
		});

		slider.addEventListener("wheel", (e) => {
			cancelMomentumTracking();
		});

		var velX = 0;
		var momentumID;

		function beginMomentumTracking() {
			cancelMomentumTracking();
			momentumID = requestAnimationFrame(momentumLoop);
		}
		function cancelMomentumTracking() {
			cancelAnimationFrame(momentumID);
		}
		function momentumLoop() {
			slider.scrollLeft += velX;
			velX *= 0.95;
			if (Math.abs(velX) > 0.5) {
				momentumID = requestAnimationFrame(momentumLoop);
			}
		}
	}
});

