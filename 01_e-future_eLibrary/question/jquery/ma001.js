$(function(){
        $('.card_back').click(function(){
            $(this).removeClass('turn3').addClass('turn2');
            $(this).siblings('.card_front').removeClass('turn1').addClass('turn3');
        });
    
        $('.card_front').click(function(){
                $(this).find('.inner-inner').animate({'backgroundColor':'rgba(255,255,255,0.7)'},300).animate({'backgroundColor':'rgba(0,0,0,0)'},300,function(){
   
                    $(this).parents('.card_front').removeClass('turn3').addClass('turn1'); $(this).parents('.card_front').siblings('.card_back').removeClass('turn2').addClass('turn3');
                });

});});
