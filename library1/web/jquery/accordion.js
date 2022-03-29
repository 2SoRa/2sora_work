jQuery(function() {
	jQuery('.sctit').on('click',function() {
		jQuery('.scbody').slideUp('fast');
		jQuery(this).next('.scbody').slideDown('fast');
	});
});

jQuery(function() {
	jQuery('.faqtit').on('click',function() {
		jQuery('.faqbody').slideUp('fast');
		jQuery(this).next('.faqbody').slideDown('fast');
	});
});

