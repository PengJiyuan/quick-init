/**
 * @Author: PengJiyuan
 * @Description: Exports some global variables
 */

!(function (globalEvent) {
  if(!$ || !jQuery) {
    return;
  }
  var isMobile = function() {
    return navigator.userAgent.match(/(iphone|ipad|ipod|ios|android|mobile|blackberry|iemobile|mqqbrowser|juc|fennec|wosbrowser|browserng|Webos|symbian|windows phone)/i) || window.innerWidth <= 1024;
  };
  var isPad = function() {
    return window.innerWidth >= 1024 && window.innerWidth <= 1240;
  };
  var G = {
    viewWidth: document.body.offsetWidth,
    mobile: !!isMobile(),
    pad: !!isPad(),
    scrollbarWidth: window.innerWidth - document.body.offsetWidth,
    viewHeight: window.innerHeight,
    header: $('#volcano-global-header'),
    cloth: $('#cloth'),
    toTop: $('#volcano-totop'),
    bodyDir: 1,
    bodyCST: document.body.scrollTop || document.documentElement.scrollTop,
    // A json data about parameters in current link.
    getLocation: function() {
      var location = window.location.search.substr(1);
      if (!location) {
        return false;
      }
      location = location.split('&');
      location = location.map(function(ele){
        if(!/=/.test(ele)){
          ele += '=undefined';
        }
        return ele;
      });
      location = location.join('","');
      location = location.replace(/=/g, '":"');
      location = '{"' + location + '"}';
      location = JSON.parse(location);
      return location ? location : false;
    }()
  };
  G.bodyPST = G.bodyCST;

  G.getDeviceStatus = function(){
    var isOriginalMobile = G.mobile;
    G.viewWidth = document.body.offsetWidth;
    G.viewHeight = window.innerHeight;
    G.mobile = !!isMobile();
    G.pad = !!isPad();

    if( isOriginalMobile !== G.mobile ){
      if(G.mobile){
        // attach events to window for CSS type switches to phone version.
        $(window).trigger('switchCSSTypeToPhone');
      }else{
        // attach events to window for CSS type switches to pc version.
        $(window).trigger('switchCSSTypeToPc');
      }
    }
  };
  G.launchFullscreen = function(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };
  G.exitFullscreen = function() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  };
  globalEvent(G);
  return window.G = G;
})(globalEvent);

function globalEvent(G) {
  // check browser compatibility
  var userAgent = navigator.userAgent.toLowerCase();
  var browser = {
    version: (userAgent.match( /.+(?:rv|it|ra|ie)[/: ]([\d.]+)/ ) || [])[1],
    msie: /msie/.test(userAgent) && !/opera/.test(userAgent)
  };
  if (parseFloat(browser.version) < 10 && browser.msie) {
    window.location = '/browser';
  }
  G.getDeviceStatus();
  $(window).on({
    resize: function(){
      G.getDeviceStatus();
    },
    scroll: function() {
      G.bodyPST = G.bodyCST;
      G.bodyCST = document.body.scrollTop || document.documentElement.scrollTop;
      G.bodyDir = G.bodyPST > G.bodyCST ? -1 : 1;
      if (G.bodyCST > 40) {
        G.header.css({backgroundColor: 'rgba(9,31,63,0.86)'});
      } else {
        G.header.css({backgroundColor: 'rgba(9,31,63,0.8'});
      }
      if(G.bodyCST > 1500) {
        G.toTop.css({opacity: 1});
      } else {
        G.toTop.css({opacity: 0});
      }
    }
  });
  // header nav
  $('#header-center > li').mouseenter(function() {
    if(!G.mobile) {
      G.header.css({backgroundColor: 'rgba(9,31,63,0.8'});
    }
  }).mouseleave(function() {
    if(G.bodyCST <= 40 && !G.mobile) {
      G.header.css({backgroundColor: 'rgba(9,31,63,0.9'});
    }
  });
  // header mobile
  $('#x-open').click(function() {
    if(G.mobile) {
      G.header.toggleClass('open');
    }
  });
  $('#header-center > li > a').click(function() {
    if(G.mobile) {
      $(this).next().slideToggle(300);
      $(this).toggleClass('first-open');
    }
  });
  $('.multi > a').click(function() {
    if(G.mobile) {
      $(this).next().slideToggle(300);
      $(this).toggleClass('second-open');
    }
  });

  $('.multi-dropdown > .dropdown-wrapper > .dropdown > li').mouseenter(function() {
    if(!G.mobile) {
      $(this).siblings().removeClass('select');
      $(this).addClass('select');
      if($(this).hasClass('multi')) {
        $(this).parents('.dropdown-wrapper').css('width', '300px');
      } else {
        $(this).parents('.dropdown-wrapper').css('width', '150px');
      }
    }
  });

  $('.login-link').click(function(){
    window.location = ('https://console.tfcloud.com/');
  });
  $('.register-link').click(function(){
    window.location = ('https://console.tfcloud.com/register');
  });
  //footer totop
  $(G.toTop).click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 500);
  });
}
