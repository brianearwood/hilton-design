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
      this.timer;
      this.ofi();
      this.megamenu();
      this.search();
      this.fullpage();
      this.modals();
      // this.pjax();
      this.resizeModals();
    },

    resize: function() {
        var self = this;
        
        // do something once after resize is complete
        clearTimeout(HH.timer);
        HH.timer = setTimeout(HH.doneResizing, 500);

        if( $('body').height() < $(window).height() ) {
          $('.page-nav').addClass('extended');
          $('body').css({'overflow': 'hidden'});
        } else {
          $('.page-nav').removeClass('extended');
          $('body').css({'overflow': 'visible'});
        }
    },

    doneResizing: function () {
      HH.resizeModals();
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
          /* the viewport is 576 pixels wide or 400 px tall or less */
          $(".megamenu__chapter").addClass('collapsed');
          $(".megamenu__heading").on("click", function (event) {
            event.preventDefault();
            $('.megamenu__chapter').each(function() { $(this).addClass('collapsed'); })
            $(this).parent().removeClass("collapsed");
          });
        } else {
          /* the viewport is more than than 576 pixels wide or 400 tall */
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
        paddingTop: '72px',
        // paddingBottom: '32px',
        lazyLoading: false,
        menu: '#section-menu',
        // scrollOverflow: true,
        responsiveWidth: 992,
        responsiveHeight: 800,
        bigSectionsDestination: 'top',
        fitToSection: true,
        afterResponsive:  function(isResponsive){
          if (isResponsive) {
            $.fn.fullpage.setAutoScrolling(false);
            $('.global__header').appendTo( $('.global:first-child') );
          }
          else {
            $.fn.fullpage.setAutoScrolling(true);
            $('.global__header').insertBefore( $('.global__footer') );
          }
          
        }
      });
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
    },

    modals: function () {
      // Type 1 Modal (Defined Zones)

      // media query for determining if a modal should open or if 
      // we shouldgo to a new content page
      var mql = window.matchMedia('(max-width: 768px)');
      function screenTest(_mql) {
        if (_mql.matches) {
          /* the viewport is narrow */
          // remove the data attribs for BS Modals to work
          // Defined 
          $('.modal-link').each( function (index, elem) {
            $(this).removeAttr('data-target');
            $(this).removeAttr('data-toggle');
          });
        } else {
          /* the viewport is wider */
          // add them back from the data-backup attr on each link
          $('.modal-link').each( function (index, elem) {
            var backup = $(this).data('backup');
            $(this).attr('data-target', backup);
            $(this).attr('data-toggle', 'modal');
          });
        }
      }
      mql.addListener(screenTest);
      screenTest(mql);


      // capture events from Bootstrap Modal js 
      $(document).on('shown.bs.modal', function (e) {
        $(".modal:visible .modal-nav a").first().trigger('click');
        $.fn.fullpage.setAutoScrolling(false);
        $('body').addClass('overflow-hidden-imp');
      });
      $(document).on('hidden.bs.modal', function (e) {
        $.fn.fullpage.setAutoScrolling(true);
        $('body').removeClass('overflow-hidden-imp');
      })

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
      });


      // Type 2 Modal (Case Studies)
      function start_case_study_modal() {
        var image_list, prev_btn, next_btn, show_tooltip;

        $(document).on('shown.bs.modal', function (e) {
          image_list = $('.modal.type-2:visible .image');
          image_list.each( function (index,elem) {
            $(elem).removeClass('active');
            console.log(elem);
          });
          image_list.first().addClass('active');

          prev_btn = $('.modal.type-2:visible .modal-nav-arrow-prev');
          next_btn = $('.modal.type-2:visible .modal-nav-arrow-next');

          prev_btn.on('click', function (event) {
            if ( $('.modal.type-2:visible .image.active').prev().length != 0 ) {
              $('.modal.type-2:visible .image.active').removeClass('active').prev().addClass('active');
            } 
            else {
              $('.modal.type-2:visible .image.active').removeClass('active').siblings().last().addClass('active');
            }
          });

          next_btn.on('click', function (event) {
            if ( $('.modal.type-2:visible .image.active').next().length != 0 ) {
              $('.modal.type-2:visible .image.active').removeClass('active').next().addClass('active');
            }
            else {
              $('.modal.type-2:visible .image.active').removeClass('active').siblings().first().addClass('active');
            }
          });

          show_tooltip = $("svg .svg-showtip");
          show_tooltip.on("click", function(event){
            $("#" + event.currentTarget.id.replace("plus","tooltip")).fadeToggle();
          });
        });
        $(document).on('hide.bs.modal', function (e) {
          image_list = "";
          prev_btn.off('click');
          next_btn.off('click');
          show_tooltip.off("click");
        })
        
        
        
        
      }
      start_case_study_modal();


      // Defined Zones hover effect buttons
      // rolling over the buttons:
      $('.zone-map .modal-link').on('mouseover', function () {
        // add .hovered state to button so we keep the hover style once we mouseout
        $(this).parent().siblings().children().removeClass('active');
        $(this).addClass('active');

        var link_id = $(this).data('link');
        $('.zone').each( function (index, elem) {
          if ( $(elem).data('zone') == link_id ) {
            $('.zone').removeClass('active');
            $(elem).addClass('active');
          }
        });

        $('.zone-circle').each( function (index, elem) {
          $(elem).removeClass('active');
        });
        $('.zone-circle').each( function (index, elem) {
          if ( $(elem).data('svg') == link_id ) {
            $(elem).addClass('active');
          }
        });
      });

      // rolling over the svg circles:
      $('.zone-circle').on('mouseover', function () {
        var link_id = $(this).data('svg');

        $('.zone-circle').each( function (index, elem) {
          $(elem).removeClass('active');
        });
        $('.zone-circle').each( function (index, elem) {
          if ( $(elem).data('svg') == link_id ) {
            $(elem).addClass('active');
          }
        });

        $('.zone').each( function (index, elem) {
          if ( $(elem).data('zone') == link_id ) {
            $('.zone').removeClass('active');
            $(elem).addClass('active');
          }
        });

        $('.zone-map .modal-link').each( function (index, elem) {
          if ( $(elem).data('link') == link_id ) {
            $('.zone-map .modal-link').removeClass('active');
            $(elem).addClass('active');
          }
        });
      });

      // clicking the svg circles:
      $('.zone-circle').on('click', function () {
        var link_id = $(this).data('svg');
        $('.zone-map .modal-link').each( function (index, elem) {
          if ( $(elem).data('link') == link_id ) {
            $(this).trigger('click');
          }
        });
      });


      // inset carousel
      function start_inset_carousel () {
        var carousel = $('.inset-carousel');
        var images = $('.carousel-image');
        var prev_btn = carousel.find('.modal-nav-arrow-prev');
        var next_btn = carousel.find('.modal-nav-arrow-next');
        prev_btn.on('click', function (event) {
          var current_image = $('.carousel-image.active');
          var prev_image = current_image.prev();
          if ( prev_image.length != 0 ) {
            current_image.removeClass('active');
            prev_image.addClass('active');
          } 
          else {
            current_image.removeClass('active').siblings().last().addClass('active');
          }
        });
        next_btn.on('click', function (event) {
          var current_image = $('.carousel-image.active');
          var next_image = current_image.next();
          if ( next_image.length != 0 ) {
            current_image.removeClass('active');
            next_image.addClass('active');
          }
          else {
            current_image.removeClass('active').siblings().first().addClass('active');
          }
        });
      }
      start_inset_carousel();
      
    },

    resizeModals: function (modal) {
      $('.hilton-modal').each( function (index, elem) {
        var $_elem = $(this);
        $_elem.addClass('resizing');

        var nav_height = $_elem.find(".modal-nav").outerHeight();
        var image_height = $_elem.find("img").first().height();
        var modal_height = nav_height + image_height;

        // console.log("Nav: " + nav_height + ", Image: " + image_height + ", Total: " + modal_height);
        $_elem.find(".modal-body").height( modal_height );
        $_elem.find(".modal-descriptions").height( image_height );
        $_elem.removeClass('resizing');
      });
    }
  }

  HH.init();

  $(window).resize(function() {
      HH.resize();
  });

  $(window).trigger('resize');

})(jQuery);

