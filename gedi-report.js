require([
	
	'jquery',
	'domReady'

], function($, domReady){
	domReady(function(){
    // this nested require was the only way I could get owl carousel to load locally
    require(['owl.carousel'], function(owlCarousel) {
      $(".report-carousel").owlCarousel({
        nav: true,
          loop: true,
          items: 1,
          dots: true,
          lazyLoad: true,
          smartSpeed: 550,
          autoplay: false,
          navClass: ['arrow left', 'arrow right'],
        navText:['<span class="sr-only">previous</span>','<span class="sr-only">next</span>'],
          responsive: {
            0: {
              nav: false
            },
            960: {
              nav: true
            }
          }
      });
      
      // converts an array of data-hashes to a class on a section element, then removes hash by default
      function convertHashToClass(arr,removeHash){
        'use strict';
        var rem = removeHash === false ? false : true;
        for(var i = 0; i<arr.length; i++){
          var el = document.body.querySelector('section[data-hash="'+arr[i]+'"]');
          if(el){
            el.classList.add(arr[i]);
            if(rem){
              el.removeAttribute('data-hash');
            }
          }
        }
      }
      convertHashToClass(['report-hotspots']);
    });
    
    

	});

});