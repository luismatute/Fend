/*
// Common JS
// Date: July 2015
// Developers:
// 	Jean-Pierre Sierens	- jpsierens@sanservices.hn
// 	Luis Matute			- lmatute@sanservices.hn
// Description:
// 	This is the first JS file that's loaded.
// 	Takes care of the require.config which has
// 	the js paths and at the end calls the common module
// -----------------------------------------------------
*/

// Rule of thumb:
// 	Define: If you want to declare a module other parts of your application will depend on.
// 	Require: If you just want to load and use stuff.

// TODO:
// 1. Set the correct baseURL
// 2. Cache bust?

require.config({
	baseUrl: _conf.jsPath,
	waitSeconds: 0,
	// urlArgs: 'bust=2',
	paths: {
		// The Libraries we use
		jquery: [
			'https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min',
			'libs/jquery'
		],
		owl:		'libs/owl.carousel',

		// Modules
		util: 		'modules/util',
		common: 	'modules/common',
		fend: 		'modules/fend',
		modal: 		'modules/modal'
	},
	shim: {
		util: 		['jquery'],
		common: 	['jquery', 'util']
	}
});

// Defining global module with jQuery dependency and requiring the common js
define(['common'], function() {});