/*
// Common JS
// Date: January 2015
// Developers:
// 	Luis Matute			- lmatute@sanservices.hn
// Description:
//	Code here is available site wide
// 	Note: jQuery is available, so we dont need to
//	declare it as a dependency
// --------------------------------------------------
*/

// This is the definition of the module
define('common' ,['fend'], function (){
	'use strict';

	$(document).ready(function (){
		ajaxSetup();
		bindEvents();
		_.log("[" + _conf.name + "]: Initiated");
	});

	// Global configurations for ajax
	function ajaxSetup () {
		var $animationWrap = $('.loading-wrap');

		$.ajaxSetup({
			method: 'POST',
			dataType: 'json',
		});

		$(document)
			.ajaxStart(function() {
				$animationWrap.addClass('active');
			}).ajaxSend(function (event, jqXHR, settings) {
				// settings.url = 'https://localhost:3000'+settings.url;
			}).ajaxComplete(function() {
				$animationWrap.removeClass('active');
			});
	}

	// General event binding
	function bindEvents () {
		var fend = $('.de').fend();
	}
});