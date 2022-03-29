<!--================나라 선택===================================-->

    $(function(){
        var selected = $('.selected').html();
        $('.show_country').click(function(){
            $('.country ul').slideToggle();
        });
        
        var allli = $('.country ul li');
        $('.country ul li').click(function(){
                allli.removeClass('selected');
                $(this).addClass('selected');
                
                $('.country ul').slideUp();
                $('.show_country p').html($(this).html());
           
        });
    });


//메뉴 고정
	$( function() {
	var jbOffset = $( '.jbMenu' ).offset();
		$( window ).scroll( function() {
		if ( $( document ).scrollTop() > jbOffset.top ) {
			$( '.jbMenu' ).addClass( 'jbFixed' );
		}
		else {
			$( '.jbMenu' ).removeClass( 'jbFixed' );
			}
		});
	});

//컬러박스
jQuery(function(){
	jQuery('#select_container').jqTransform();
	});
	jQuery(document).ready(function($){
		jQuery(".btn_policy").colorbox({inline:true, width:"640"});
	});
	jQuery(document).ready(function(){
		jQuery(".btn_personal").colorbox({inline:true, width:"640"});
	});
	jQuery(document).ready(function(){
		jQuery(".btn_email").colorbox({inline:true, width:"540"});
	});
	jQuery(document).ready(function(){
		jQuery(".btn_cs").colorbox({inline:true, width:"540"});
	});

function popup(url) 
{
 params  = 'width='+screen.width;
 params += ', height='+screen.height;
 params += ', top=0, left=0'
 params += ', fullscreen=yes';

 newwin=window.open(url,'windowname4', params);
 if (window.focus) {newwin.focus()}
 return false;
}