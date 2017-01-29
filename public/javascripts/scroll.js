$(function(){
    $('.btnMouse1').click(function(){
    	console.log('sehizoclick');
        $('html,body').animate({
            scrollTop: $("#2").offset().top
        }, 1000);
    });
    $('.btnMouse2').click(function(){
        console.log('sehizoclick');
        $('html,body').animate({
            scrollTop: $("#3").offset().top
        }, 1000);
    });
    $('.btnMouse3').click(function(){
        console.log('sehizoclick');
        $('html,body').animate({
            scrollTop: $("#4").offset().top
        }, 1000);
    });
    
})