
    $(function(){
        $('.stlist li').mouseover(function(){
            $(this).addClass('active1');
        });
        $('.stlist li').mouseleave(function(){
            $(this).not('.click').removeClass('active1');
        });
        $('.stlist li').click(function(){        
            $(this).addClass('active1 click');
            $(this).siblings().removeClass('click active1');
        });
    });
