// Validation Plugin
// Date: August 2015
// Developers:
//  Luis Matute      	- lmatute@sanservices.hn
//  Jean-Pierre Sierens	- jpsierens@sanservices.hn
// Description:
//
// ------------------------------------------------------------------

define(['jquery'], function ($) {
	'use strict';

	var pluginName = 'fend';

	$.extend($.fn, {
		// Instantiating Plugins
		fend: function (options) {

			if (!this.length) {
				console.warn("Please give me a selector");
				return;
			}

			var fend = $.data( this[ 0 ], pluginName );
			if ( fend ) {
				return fend;
			}

			// No validate to prevent HTML5 native validation system
			this.prop('novalidate', true);

			fend = new $.validator( options, this [0] );
			$.data( this[ 0 ], pluginName, fend );

			if (fend.settings.onsubmit) {}
			else if (fend.settings.onkeypress) {
				this.on('keydown', function (evt) {
					if ( fend.settings.debug ) {
						// prevent form submit to be able to see console output
						evt.preventDefault();
					}
				});
			}

			return this;
		}
	});

	// Constructor
	$.validator = function ( settings, form ) {
		this.settings = $.extend( true, {}, $.validator.defaults, settings );
		this.currentForm = form;
		this.init();
	};

	$.validator.format = function( source, params ) {
		if ( arguments.length === 1 ) {
			return function() {
				var args = $.makeArray( arguments );
				args.unshift( source );
				return $.validator.format.apply( this, args );
			};
		}
		if ( arguments.length > 2 && params.constructor !== Array  ) {
			params = $.makeArray( arguments ).slice( 1 );
		}
		if ( params.constructor !== Array ) {
			params = [ params ];
		}
		$.each( params, function( i, n ) {
			source = source.replace( new RegExp( "\\{" + i + "\\}", "g" ), function() {
				return n;
			});
		});
		return source;
	};

	$.extend( $.validator, {
		defaults: {
			// Avoid revalidate the field when pressing one of the following keys
			// Shift       => 16
			// Ctrl        => 17
			// Alt/Option  => 18
			// Caps lock   => 20
			// End         => 35
			// Home        => 36
			// Left arrow  => 37
			// Up arrow    => 38
			// Right arrow => 39
			// Down arrow  => 40
			// Insert      => 45
			// Cmd         => 91
			// Num lock    => 144
			// AltGr key   => 225
			excludedKeys: [ 16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 91,144, 225 ],
			messages: {},
			errorClass: 'error',
			validClass: 'valid',
			inputWrap: 'input-wrap',
			focusInvalid: true,
			errorFields: $( [] ),
			onsubmit: false,
			onkeypress: true,
			debug: false,
			ignore: ':hidden',
			onfocusin: function ( element ) {
				// Remove error class on focus
				if ( this.settings.unhighlight ) {
					this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
				}
			},
			onfocusout: function ( element ) {
				// if ( !this.checkable( element ) && ( element.name in this.submitted || !this.optional( element ) ) ) {
				// 	this.element( element );
				// }
			},
			onkeyup: function (element, evt) {
				if ( event.which === 9 && this.elementValue( element ) === "" || $.inArray( event.keyCode, excludedKeys ) !== -1 ) {
					return;
				} else {
					this.check( element );
					// this.element( element );
				}
			},
			onkeydown: function (element, evt) {
				console.log(1);
			},
			// TODO: highlighting
			highlight: function( element, errorClass, validClass ) {
				if ( element.type === "radio" ) {
					this.findByName( element.name ).addClass( errorClass ).removeClass( validClass );
				} else {
					$( element ).addClass( errorClass ).removeClass( validClass );
				}
			},
			unhighlight: function( element, errorClass, validClass ) {
				if ( element.type === "radio" ) {
					this.findByName( element.name ).removeClass( errorClass ).addClass( validClass );
				} else {
					$( element ).removeClass( errorClass ).addClass( validClass );
				}
			}
		},

		// Override Defaults
		setDefaults: function (settings) {
			$.extend( $.validator.defaults, settings );
		},

		// Change a setting after initialization
		option: function ( key, myvalue ) {
			if (typeof myvalue !== 'undefined') {
				this.settings[key] = myvalue;
			} else {
				return this.settings[key];
			}
		},

		// Error messages to be returned
		messages: {
			required: "This field is required.",
			remote: "Please fix this field.",
			email: "Please enter a valid email address.",
			url: "Please enter a valid URL.",
			date: "Please enter a valid date.",
			dateISO: "Please enter a valid date ( ISO ).",
			number: "Please enter a valid number.",
			digits: "Please enter only digits.",
			creditcard: "Please enter a valid credit card number.",
			equalTo: "Please enter the same value again.",
			maxlength: $.validator.format( "Please enter no more than {0} characters." ),
			minlength: $.validator.format( "Please enter at least {0} characters." ),
			rangelength: $.validator.format( "Please enter a value between {0} and {1} characters long." ),
			range: $.validator.format( "Please enter a value between {0} and {1}." ),
			max: $.validator.format( "Please enter a value less than or equal to {0}." ),
			min: $.validator.format( "Please enter a value greater than or equal to {0}." )
		},

		prototype: {
			init: function () {
				var _this = this;
				this.submitted = {};
				this.pendingRequest = 0;
				this.pending = {};
				this.invalid = {};
				this.reset();

				function delegate( event ) {
					var fend = $.data( _this.form, pluginName ),
						eventType = "on" + event.type.replace( /^validate/, "" ),
						settings = fend.settings;

					if ( settings[ eventType ] && !$( _this ).is( settings.ignore ) ) {
						settings[ eventType ].call( fend, _this, event );
					}
				}

				$( this.currentForm )
					.on( "focusin.validate focusout.validate keyup.validate onkeydown.validate",
						":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " +
						"[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " +
						"[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " +
						"[type='radio'], [type='checkbox']", delegate)
					// Support: Chrome, oldIE
					// "select" is provided as event.target when clicking a option
					.on("click.validate", "select, option, [type='radio'], [type='checkbox']", delegate);
			},

			reset: function() {
				this.successList = [];
				this.errorList = [];
				this.errorMap = {};
				this.toShow = $( [] );
				this.toHide = $( [] );
				this.currentElements = $( [] );
			},

			resetForm: function() {
				if ( $.fn.resetForm ) {
					$( this.currentForm ).resetForm();
				}
				this.submitted = {};
				this.lastElement = null;
				// this.prepareForm();
				// this.hideErrors();
				var i, elements = this.elements()
					.removeData( "previousValue" )
					.removeAttr( "aria-invalid" );

				if ( this.settings.unhighlight ) {
					for ( i = 0; elements[ i ]; i++ ) {
						this.settings.unhighlight.call( this, elements[ i ],
							this.settings.errorClass, "" );
					}
				} else {
					elements.removeClass( this.settings.errorClass );
				}
			},

			optional: function( element ) {
				var val = this.elementValue( element );
				return !$.validator.methods.required.call( this, val, element ) && "dependency-mismatch";
			},

			check: function ( element ) {
				// Here the logic
			},

			destroy: function() {
				this.resetForm();

				$( this.currentForm )
					.off( ".validate" )
					.removeData( "validator" );
			}
		},

		methods: {
			required: function ( value, element, param ) {
				// check if dependency is met
				if ( !this.depend( param, element ) ) {
					return "dependency-mismatch";
				}
				if ( element.nodeName.toLowerCase() === "select" ) {
					// could be an array for select-multiple or a string, both are fine this way
					var val = $( element ).val();
					return val && val.length > 0;
				}
				if ( this.checkable( element ) ) {
					return this.getLength( value, element ) > 0;
				}
				return value.length > 0;
				}
			},

			email: function ( value, element ) {
				// From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
				// Retrieved 2015-09-05
				// If you have a problem with this implementation, report a bug against the above spec
				// Or use custom methods to implement your own email validation
				return this.optional( element ) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
			},

			url: function ( value, element ) {
				// https://gist.github.com/dperini/729294
				// see also https://mathiasbynens.be/demo/url-regex
				// modified to allow protocol-relative URLs
				return this.optional( element ) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
			},

			date: function ( value, element ) {
				return this.optional( element ) || !/Invalid|NaN/.test( new Date( value ).toString() );
			},

			number: function ( value, element ) {
				return this.optional( element ) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
			},

			digits: function ( value, element ) {
				return this.optional( element ) || /^\d+$/.test( value );
			},

			minlength: function ( value, element, param ) {
				var length = $.isArray( value ) ? value.length : this.getLength( value, element );
				return this.optional( element ) || length >= param;
			},

			maxlength: function ( value, element, param ) {
				var length = $.isArray( value ) ? value.length : this.getLength( value, element );
				return this.optional( element ) || length <= param;
			},

			equalTo: function ( value, element, param ) {
				// bind to the blur event of the target in order to revalidate whenever the target field is updated
				// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
				var target = $( param );
				if ( this.settings.onfocusout ) {
					target.off( ".validate-equalTo" ).on( "blur.validate-equalTo", function () {
						$( element ).valid();
					});
				}
				return value === target.val();
			},

			remote: function ( value, element, param ) {
				var data, validator;

				// this will handle remote validations
				if ( this.optional( element ) ) {
					return "dependency-mismatch";
				}

				if (!this.settings.messages[ element.name ] ) {
					this.settings.messages[ element.name ] = {};
				}

				validator = this;
				data = {};
				data[ element.name ] = value;

				$.ajax( $.extend(true, {
					port: "validate" + element.name,
					type: 'POST',
					data: data,
					dataType: 'json',
					context: validator.currentForm,
					success: function (json) {
						console.log(json);
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log(jqXHR);
						console.log(textStatus);
						console.log(errorThrown);
					}
				}, param) );

				return "pending";
			}
	});

});
