$(function () {
	$(this).scrollTop(0);

	//paralax injection
	if ($('body#mobile').length == 0 && $('.lt-ie8').length == 0) {
		var wheight = parseInt($(window).innerHeight());

		if (($('body').height() / wheight) > 10) {
			wheight = parseInt($('body').height());
		}

		var paralax =



		$('.mainContent').first().append(paralax);

		$('.shape').each(function () {
			var winWidth = $(window).width(),
				conWidth = $('.center').width(),
				shapeArea = (winWidth - conWidth) / 2,
				shapeWidth = $(this).width() * 0.5,
				startPos,
				randh = wheight * (Math.random()),
				direction = Math.random(),
				randRatio = Math.random() * 10 * 1.1 / 10 - .03;
			ex = 1;
			w = $(window).width();

			if ($(this).hasClass('fpl')) {
				var fh = Math.random() * shapeArea / 2 - shapeWidth;
				if (fh < 0) { fh = 0; };
				$(this).css('left', fh);
			} else {
				var fh = Math.random() * shapeArea / 2 - shapeWidth;
				if (fh < 0) { fh = 0; };
				$(this).css('right', fh);
			}

			if (direction > 0.5) {
				direction = false;
				$(this).css('top', randh);
				startPos = randh;
			} else {
				direction = true;
				$(this).css('bottom', randh);
				startPos = randh;
			}

			

			$(this).jamba_header({
				smoothing: true,
				ratio: randRatio,
				reverse: direction,
				vertical: false,
				shape: true,
				to: $(document).height() + 800,
				offsetTop: startPos,
				smoothRatio: 0.1
			});
		});
	}
	

});


