$(document).ready(function () {


    // 防止focus導致dropdown input menu消失
    $('.dropdown-menu input, .dropdown-menu label').click(function(e) {
        e.stopPropagation();
    });

    //
     $(window).resize(function(){
        var windowh = $(window).innerHeight(); 
        var windowwidth = $(window).innerWidth();       
       
        $(".mapinserthere").css('height', windowh + 'px');  
    });        
    $(window).resize();      
    //

    
    
    //modal middle
    function centerModals(){
      $('.modal').each(function(i){
        var $clone = $(this).clone().css('display', 'block').appendTo('body');
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top);
      });
    }
    $('.modal').on('show.bs.modal', centerModals);
    $(window).on('resize', centerModals);
    //
    

});