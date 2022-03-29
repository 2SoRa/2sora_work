  count = 0;
    $(function(){
        var move = setInterval(function(){
            
            if(count<=-400){
                count = 0;
                $('.slide_wrap').css({'left':'0'});
            }
            count = count - 100;
            $('.slide_wrap').stop().animate({'left':count+'%'},1000);
        },2000);
        
         $('.slide_wrap li').mouseover(function(){
             clearInterval(move) ;
         }).mouseout(function(){
             move = setInterval(function(){
            
                if(count<=-400){
                    count = 0;
                    $('.slide_wrap').css({'left':'0'});
                }
                count = count - 100;
                $('.slide_wrap').stop().animate({'left':count+'%'},1000);
            },2000);
         });
    });