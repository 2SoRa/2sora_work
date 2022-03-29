$(function(){
//    차 선택 노란차 클릭
    $('.car_l').click(function(){
        $(this).css({'box-shadow':'0 2px 0 0 #1a8b85, 0 6px 0 0 #ddddc4','margin-top':'6px'});
        $(this).siblings().css({'box-shadow':'0 6px 0 0 #d39133, 0 15px 0 0 #ddddc4','margin-top':'0'});
    });
    
//    차 선택 빨간차 클릭
     $('.car_r').click(function(){
        $(this).css({'box-shadow':'0 2px 0 0 #d39133, 0 6px 0 0 #ddddc4','margin-top':'6px'});
        $(this).siblings.css({'box-shadow':'0 6px 0 0 #1a8b85, 0 15px 0 0 #ddddc4','margin-top':'0'});
    });
    
//    스타트 버튼 누른 후 화면 전환
    $('.start').click(function(){
        $('.choice').fadeOut();
        $('.ready').delay(300).fadeIn();
        $('.car_wrap').delay(300).fadeIn();
    });
    
//    신호등 불 변경 후 화면전환  
    $('.r_light').delay(2000).animate({'opacity':'0.3'},500,function(){
        $('.y_light').animate({'opacity':'1'},500,function(){
            $(this).delay(1000).animate({'opacity':'0.3'},500,function(){
                $('.g_light').animate({'opacity':'1'},500,function(){
                    $('.ready').delay(1500).fadeOut();
                    $('.q_wrap').delay(1500).fadeIn();
                });
            });
        });
    });
 });