  $(function(){
        num = 0;
        rotate = 0;
        left = 100;
        rt = -30;
        
//        톱니바퀴 & 박스 움직임
        var interval = setInterval(function(){
            rotate = rotate + 20;
            left = left-2;
            $('.gear').css('transform','rotate('+rotate+'deg)');
            if(left<=0){
                clearInterval(interval);
            }
        $('.q_wrap').animate({'left':left+'%'},500);
        },300);
        
//        로봇 움직임
        var interval2 = setInterval(function(){
            num = num + 1;
            if(num >= 5){
                num=1;
            }
            $('.robot img').attr('src','../images/robot'+num+'.png');
        },1000);
        

//        rail line 움직임
        var interval3 = setInterval(function(){
            rt = rt - 20;
            $('.line').css('left',rt+'px');
            if(rt<=-80){
                rt = 0;
                $(this).css('left','0px');
            }
        },300);
    });