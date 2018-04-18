// @codekit-prepend quiet "../../bower_components/jquery/dist/jquery.min.js";
// @codekit-prepend quiet "../../node_modules/jquery-pjax/jquery.pjax.js";
// @codekit-prepend quiet "../../node_modules/object-fit-images/dist/ofi.js";
// @codekit-prepend quiet "./vendor/scrolloverflow.min.js";
// @codekit-prepend quiet "../../node_modules/fullpage.js/dist/jquery.fullpage.js";
// @codekit-prepend quiet "../../bower_components/bootstrap/js/dist/util.js";
// @codekit-prepend quiet "../../bower_components/bootstrap/js/dist/modal.js";


// @codekit-prepend quiet "./_plugins.js";

(function($) {

  var HH = {
    init: function () {
      this.ofi();
      this.megamenu();
      this.search();
      this.fullpage();
      this.modals();
      // this.pjax();
      // this.smartscroll();
      this.initListeners();
      this.resizeModals();
    },

    resize: function() {
        var self = this;
        $(window).resize(function() {
          self.resizeModals();
        });
    },

    megamenu: function () {
      var button = $(".js-megamenu-button");
      var menu = $(".megamenu");
      button.click( function(event) {
        event.preventDefault();
        menu.toggleClass("active");
      });
      $(document).click(function(event) { 
        if(!$(event.target).closest('.megamenu').length && !$(event.target).closest('.icon-link').length) {
          if(menu.hasClass("active")) {
            menu.removeClass("active");
          }
        }        
      });


      // mobile expandable menu
      var mql = window.matchMedia('(max-width: 576px)');
      function screenTest(e) {
        if (e.matches) {
          /* the viewport is 576 pixels wide or less */
          $(".megamenu__chapter").addClass('collapsed');
          $(".megamenu__heading").on("click", function (event) {
            $(this).parent().toggleClass("collapsed");
          });
        } else {
          /* the viewport is more than than 576 pixels wide */
          $(".megamenu__chapter").removeClass('collapsed');
          $(".megamenu__heading").off("click");
        }
      }
      mql.addListener(screenTest);
      screenTest(mql);
    },

    search: function () {
      var mobile_button = $(".mobile-search-link");
      var search_box = $(".mobile-search-form-container");
      mobile_button.click( function(event) {
        event.preventDefault();
        search_box.toggleClass("active");
        $(".mobile-search-form-container .required").focus();
      });
      $(document).click(function(event) { 
        if(!$(event.target).closest('.mobile-search-form-container').length && !$(event.target).closest('.mobile-search-link').length) {
          if(search_box.hasClass("active")) {
            search_box.removeClass("active");
          }
        }        
      });
    },

    fullpage: function () {
      $('.fullpage').fullpage({
        sectionSelector: '.fp-section',
        fixedElements: '.global__header, .global__footer',
        // paddingTop: '103px',
        // paddingBottom: '48px',
        lazyLoading: false,
        menu: '#section-menu',
        scrollOverflow: true,
        responsiveWidth: 992,
        responsiveHeight: 800,
        bigSectionsDestination: 'top',
        fitToSection: false,
        afterResponsive:  function(isResponsive){
          // $.fn.fullpage.destroy('all');
          if (isResponsive) {
            $.fn.fullpage.setAutoScrolling(false);
            $("#section-menu").addClass("no-display");
          }
          else {
            $.fn.fullpage.setAutoScrolling(true);
            $("#section-menu").removeClass("no-display");
          }
          
        }
      });

      $(document)
        .on('pjax:start', function() {
          console.log("pjax loading!");
          // $.fn.fullpage.destroy('all');
        })
        .on('pjax:end',   function() {
          console.log("pjax ended!");
        })
    },

    ofi: function () {
      objectFitImages();
    },

    pjax: function () {
      $(document).pjax('[data-pjax] a, a[data-pjax]', '#pjax-container', {
        fragment: '.fragment'
      });

      // $('#pjax-container')
      //   .on('pjax:start', function() { $('#loading').show() })
      //   .on('pjax:end',   function() { $('#loading').hide() })
      // $('#pjax-container')
      //   .on('mousedown', function () {

      //   })
      //   .on('pjax:start', function() {
      //     console.log("pjax loading!");
      //     $.fn.fullpage.destroy('all');
      //   })
      //   .on('pjax:end',   function() {
      //     console.log("pjax ended!");
      //   })
    },

    smartscroll: function () {
      // var lethargy = new Lethargy();
    },

    modals: function () {
      // Type 1 Modal (Defined Zones)

      // capture event from Bootstrap Modal js 
      $(document).on('shown.bs.modal', function (e) {
        HH.resizeModals();
      });

      // $(document).on('click', '[data-toggle="modal"]', function (event) {
        
      // });

      $(".modal-nav a").on('click', function (event) {
        event.preventDefault();
        var link = $(this).data('modal_link');
        
        $(this).parent().addClass('active');
        $(this).parent().siblings().removeClass('active');

        $(".modal-description").each( function () {
          if( $(this).data('modal_description') == link ) {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
          }
        });

        $(".modal-images .image").each( function () {
          if( $(this).data('modal_image') == link ) {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
          }
        });

        HH.resizeModals();
      });

      // Type 2 Modal (Case Studies)
      var image_list = $('.modal.type-2 .image');
      var prev_btn = $('.modal.type-2 .modal-nav-arrow-prev');
      var next_btn = $('.modal.type-2 .modal-nav-arrow-next');



      prev_btn.on('click', function (event) {
        // console.log($('.modal.type-2 .image.active').prev().length)
        if ( $('.modal.type-2 .image.active').prev().length != 0 ) {
          $('.modal.type-2 .image.active').removeClass('active').prev().addClass('active');
        } 
        else {
          $('.modal.type-2 .image.active').removeClass('active').siblings().last().addClass('active');
        }
      });
      next_btn.on('click', function (event) {
        if ( $('.modal.type-2 .image.active').next().length != 0 ) {
          $('.modal.type-2 .image.active').removeClass('active').next().addClass('active');
        }
        else {
          $('.modal.type-2 .image.active').removeClass('active').siblings().first().addClass('active');
        }
      });
    },

    resizeModals: function () {
      if( $('body').hasClass("modal-open") ) {
        var image_height = $(".image.active:visible").height();
        console.log(image_height);
        $(".hilton-modal .modal-body:visible").height( image_height );
        $(".hilton-modal .modal-descriptions:visible").height( image_height );
      }
    },

    initListeners: function () {
      // $(document).on('ready pjax:start', function(event) {
      //   // $.fn.fullpage.destroy();
      // })
      // $(document).on('ready pjax:end', function(event) {
      //   // $(event.target).ofi();
      //   $(event.target).fullpage();
      //   $.fn.fullpage.reBuild();
      // })
    }
  }

  HH.init();

  $(window).resize(function() {
      HH.resize();
  });

  $(window).trigger('resize');

})(jQuery);

