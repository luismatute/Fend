/*
// Modal JS
// Date: August 2015
// Developers:
//  Luis Matute      - lmatute@sanservices.hn
// Description:
//
// ---------------------------------------------------------
*/

define('modal',[], function(){

	// Defaults
		var pluginName = "modal",
			defaults = {
				title: 'SSG',
				body_class: 'has-modal',
				show_title: true,
				show_close: true,
				close_btn: false,
				modal_container: 'modal-container',
				inner_container: 'modal-content',
			};

	// Plugin Constructor
		function Plugin( element, options ) {
			this.$el        = $(element);
			this._defaults  = defaults;
			this._name      = pluginName;
			this.options    = $.extend( {}, defaults, options); // Merging defaults with parametes received

			// Fire up the plugin
			this.init();
			return false;
		}

	// Plugin methods
		Plugin.prototype = {
			init: function() {
				var self = this;
				console.log("[" + this._name + "-plugin]: Initiated");
				self.$el.off('click').on('click',function(e){
					e.preventDefault();
					self.create_template(self.$el, self.options);
				});
			},
			create_template: function($el, options) {
				"use strict";
				var self = this,
					$mainWrap	= $('.main-wrap'),
					$tpl        =  $('<div />', {'class': 'modal-container'}),
					$inner      =  $('<div />', {'class': 'modal-content container' }),
					$row        =  $('<div />', {'class': 'row'}),
					$title      =  $('<h1 />',  {'class': 'modal-title'}),
					$exit_btn   =  $('<a />',   {'class': 'modal-exit-btn close-modal'}),
					$exit_icon  =  $('<i />',   {'class': 'icon-cross close-modal'}),
					$content    =  $('<div />', {'class': 'modal-message'}),
					$button_row =  $row.clone(),
					$button_col =  $('<div />', {'class': 'col l12 m12 s12 center-text'}),
					$close_btn  =  $('<a />' ,  {'class': 'btn-green btn-lg flt-none close-modal'}),
					hr          =  '<hr>',
					$lb;

				// Check for href
				if( $el.attr('href') !== ''){
					if( $el.attr('href').indexOf('#') === 0 ){
						$lb = $($el.attr('href'));
						$content.html( $lb.html() );
					}else{
						$.get($el.attr('href'), function(data){
							$content.html(data);
						});
					}
				}

				if( options.show_close === true){
					$exit_btn.append($exit_icon);
					$inner.append($exit_btn);
				}

				if(typeof $lb !== 'undefined') {
					$inner.attr('id', $lb.attr('id'));
				}

				$inner.append($content);
				// Build button
				// $close_btn.text('Aceptar');
				// $button_col.append($close_btn).appendTo($button_row);
				// if(options.close_btn) $inner.append($button_col);

				$tpl.append($inner);
				$mainWrap.addClass(options.body_class);
				$('body').addClass(options.body_class).append($tpl);

				$tpl.add($tpl.find('.close-modal')).off('click').on('click', close_evt);
				$(document).off('keyup').on('keyup',function(e) {
					if (e.keyCode == 27) { // escape key maps to keycode `27`
						close_evt(e);
					}
				});

				function close_evt (evt) {
					evt.stopPropagation();
					if( typeof self !== 'undefined' && evt.target !== self ) return false;
					$tpl.remove();
					$mainWrap.add('body').removeClass(options.body_class);
					$(document).off('keyup');
				}
			}
		};

	// Plugin instantiation
		$.fn[pluginName] = function ( options ) {

			if ( typeof options === 'string' ) {
				var args = Array.prototype.slice.call( arguments, 1 );

				this.each(function() {
					var instance = $.data( this, pluginName );

					if ( !instance ) {
						console.error( "cannot call methods on " + pluginName + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
						return;
					}

					if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
						console.error( "no such method '" + options + "' for " + pluginName + " instance" );
						return;
					}

					instance[ options ].apply( instance, args );
				});
			}
			else {
				this.each(function() {
					var instance = $.data( this, pluginName );
					if ( !instance ) {
						$.data( this, pluginName, new Plugin( this, options ));
					}
				});
			}

			return this;
		};
});