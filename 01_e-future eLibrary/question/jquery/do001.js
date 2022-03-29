    $(function(){
        $('.drag').click(function(){
            $(this).children('.drag_f').fadeToggle(200);
            $(this).children('.drag_d').fadeToggle(200);            
        });
 
        $('.drag').draggable({
            cursor:'grabbing',
            snapTolerance:80,
            snap: ".drop",
            snapMode: "inner" 
        });
    });