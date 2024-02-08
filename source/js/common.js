(function ($) {
  'use strict';

  jQuery(document).ready(function () {
    // menu trigger
    function menuTrigger() {
      const trigger = $('.hamburger');

      if (!trigger.length) return;

      $('.hamburger').on('click', function () {
        $('body').toggleClass('body--static');
        $('.menu-dropdown').toggleClass('menu-dropdown--active');
      });
    }

    menuTrigger();
    // mobile menu
    function mobileMenu() {
      $('.screen--trigger').on('click', function () {
        const triggerValue = $(this).data('category');

        $('.screen--start').addClass('screen--inactive');

        $('.menu-dropdown__inner').each(function () {
          if ($(this).data('value') === triggerValue) {
            $(this).addClass('menu-dropdown__inner--active');
          }
        });
      });

      $('.screen__back').on('click', function () {
        $('.menu-dropdown__inner').removeClass('menu-dropdown__inner--active');
        $('.screen--start').removeClass('screen--inactive');
      });
    }

    mobileMenu();
    // ajax form
    function ajaxForm() {
      const jsform = $('#ajax-form');

      if (!jsform.length) return;

      jsform.validate({
        rules: {
          name: {
            required: true,
            minlength: 2,
          },
          email: {
            required: true,
            email: true,
          },
          phone: {
            required: true,
          },
          message: {
            required: true,
          },
        },

        messages: {
          name: {
            required: 'Please enter your name',
            minlength: 'Your name must consist of at least 2 characters',
          },
          email: {
            required: 'Please enter your email',
          },
          phone: {
            required: 'Please enter your phone number',
          },
          message: {
            required: 'Please enter your message',
          },
        },

        submitHandler: function (form) {
          $(form).ajaxSubmit({
            type: 'POST',
            data: $(form).serialize(),
            url: 'form.php',

            success: function () {
              $('.alert--success').fadeIn();
              jsform.each(function () {
                this.reset();
              });
            },

            error: function () {
              $('.alert--error').fadeIn();
            },
          });
        },
      });
    }

    ajaxForm();
  });
})(jQuery);
