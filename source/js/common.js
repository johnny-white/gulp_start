(function($) {

	'use strict'

	jQuery(document).ready(function () {

		// menu trigger

		function menuTrigger() {

			const trigger = $('.hamburger')

			if (!trigger.length) return

			$('.hamburger').on('click', function() {

				$('body').toggleClass('body--static')
				$('.menu-dropdown').toggleClass('menu-dropdown--active')
	
			})
			
		}

		menuTrigger()

		// mobile menu

		function mobileMenu() {

			$('.screen--trigger').on('click', function() {

				const triggerValue = $(this).data('category')

				$('.screen--start').addClass('screen--inactive')

				$('.menu-dropdown__inner').each(function() {

					if ($(this).data('value') === triggerValue) {

						$(this).addClass('menu-dropdown__inner--active')

					}

				})

			})

			$('.screen__back').on('click', function() {

				$('.menu-dropdown__inner').removeClass('menu-dropdown__inner--active')
				$('.screen--start').removeClass('screen--inactive')

			})

		}

		mobileMenu()

	})

}(jQuery))