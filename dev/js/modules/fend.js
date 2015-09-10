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

			// Check if a fend instance for this form was already created
			var fend = $.data( this[ 0 ], pluginName );
			if ( fend ) {
				return fend;
			}

			// No validate to prevent HTML5 native validation system
			this.prop('novalidate', true);

			fend = new $.validator( options, this [0] );
			$.data( this[ 0 ], pluginName, fend );

			// Maskings
			this.on('onkeydown', function (evt) {
				// Prevent maskings
				if ( fend.settings.debug ) evt.preventDefault();
			});

			// Validations
			this.on('onkeyup', function (evt) {
				// Prevent Validations
				if ( fend.settings.debug || !fend.settings.validate ) evt.preventDefault();
			});

			// Validations on submit
			this.on('onsubmit', function (evt) {
				// Prevent Validations
				if ( fend.settings.debug || !fend.settings.submit ) evt.preventDefault();
			});

			return fend;
		},

		rules: function( command, argument ) {
			var element = this[ 0 ],
				settings, staticRules, existingRules, data, param, filtered;

			if ( command ) {
				settings = $.data( element.form, pluginName ).settings;
				staticRules = settings.rules;
				existingRules = $.validator.staticRules( element );
				switch ( command ) {
				case "add":
					$.extend( existingRules, $.validator.normalizeRule( argument ) );
					// remove messages from rules, but allow them to be set separately
					delete existingRules.messages;
					staticRules[ element.name ] = existingRules;
					if ( argument.messages ) {
						settings.messages[ element.name ] = $.extend( settings.messages[ element.name ], argument.messages );
					}
					break;
				case "remove":
					if ( !argument ) {
						delete staticRules[ element.name ];
						return existingRules;
					}
					filtered = {};
					$.each( argument.split( /\s/ ), function( index, method ) {
						filtered[ method ] = existingRules[ method ];
						delete existingRules[ method ];
						if ( method === "required" ) {
							$( element ).removeAttr( "aria-required" );
						}
					});
					return filtered;
				}
			}

			data = $.validator.normalizeRules(
				$.extend(
					{},
					$.validator.classRules( element ),
					$.validator.attributeRules( element ),
					$.validator.dataRules( element ),
					$.validator.staticRules( element )
				), element
			);

			console.log(data);
			// make sure required is at front
			if ( data.required ) {
				param = data.required;
				delete data.required;
				data = $.extend( { required: param }, data );
				$( element ).attr( "aria-required", "true" );
			}

			// make sure remote is at back
			if ( data.remote ) {
				param = data.remote;
				delete data.remote;
				data = $.extend( data, { remote: param });
			}

			return data;
		}
	});

	// Constructor
	$.validator = function ( settings, form ) {
		this.settings = $.extend( true, {}, $.validator.defaults, settings );
		this.currentForm = form;
		this.init();
	};

	// Small template engine, used to replace {n} placeholders
	// with parameters provided
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
			submit: true,
			isAJAX: true,
			validate: true,
			errorClass: 'error',
			validClass: 'valid',
			fieldWrap: 'field-wrap',
			debug: false,
			focusInvalid: true,
			onkeydown: function( element ) {
				// if ( fend.settings.debug ) evt.preventDefault();
			},
			onkeyup: function( element ) {
				// if ( fend.settings.debug ) evt.preventDefault();
				this.check.call( this, element );
			},
			onsubmit: function( element ) {
				// if ( fend.settings.debug ) evt.preventDefault();
			},
			highlight: function ( element ) {
				var _this = this;
				var $element = $( element );

				$element
					.closest( '.'+_this.settings.fieldWrap )
					.addClass( _this.settings.errorClass )
					.removeClass( _this.settings.validClass );
			},
			unhighlight: function ( element ) {
				var _this = this;
				var $element = $( element );

				$element
					.closest( '.'+_this.settings.fieldWrap )
					.addClass( _this.settings.validClass )
					.removeClass( _this.settings.errorClass );
			}
		},

		getDefault: function ( key ) {
			if ($.validator.defaults[key])
				return $.validator.defaults[key];
			else
				return undefined;
		},

		// Change a setting after initialization
		optionAccessor: function ( key, myvalue ) {
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
			number: "Please enter a valid number.",
			digits: "Please enter only digits.",
			equalTo: "Please enter the same value again.",
			maxlength: $.validator.format( "Please enter no more than {0} characters." ),
			minlength: $.validator.format( "Please enter at least {0} characters." ),
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

				// delegate gets the event and calls it (if avail), sending fend as context
				function delegate( event ) {
					var fend = $.data( _this.currentForm, pluginName ),
						eventType = "on" + event.type.replace( /^validate/, "" ),
						settings = fend.settings;

					if ( settings[ eventType ] && !$( _this ).is( settings.ignore ) ) {
						try	{
							settings[ eventType ].call( fend, event.target, event );
						} catch(error) {
							console.log(error);
						}
					}
				}

				$( this.currentForm )
					.on( "focusin.validate focusout.validate keyup.validate keydown.validate",
						":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " +
						"[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " +
						"[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " +
						"[type='radio'], [type='checkbox']", delegate)
					// Support: Chrome, oldIE
					// "select" is provided as event.target when clicking a option
					.on("click.validate", "select, option, [type='radio'], [type='checkbox']", delegate);
			},

			reset: function() {
				// reset states
			},

			depend: function( param, element ) {
				return this.dependTypes[typeof param] ? this.dependTypes[typeof param]( param, element ) : true;
			},

			dependTypes: {
				"boolean": function( param ) {
					return param;
				},
				"string": function( param, element ) {
					return !!$( param, element.form ).length;
				},
				"function": function( param, element ) {
					return param( element );
				}
			},

			optional: function( element ) {
				var val = this.elementValue( element );
				return !$.validator.methods.required.call( this, val, element ) && "dependency-mismatch";
			},

			clean: function( selector ) {
				return $( selector )[ 0 ];
			},

			elementValue: function( element ) {
				var val,
					$element = $( element ),
					type = element.type;

				if ( type === "radio" || type === "checkbox" ) {
					return this.findByName( element.name ).filter(":checked").val();
				} else if ( type === "number" && typeof element.validity !== "undefined" ) {
					return element.validity.badInput ? false : $element.val();
				}

				val = $element.val();
				if ( typeof val === "string" ) {
					return val.replace(/\r/g, "" );
				}
				return val;
			},

			element: function( element ) {
				var $element = this.clean( element ),
					result = true;

				result = this.check( $element ) !== false;
				if ( result ) {
					delete this.invalid[ $element.name ];
				} else {
					this.invalid[ $element.name ] = true;
				}

				return result;
			},

			check: function ( element ) {
				element = this.clean( element );

				var rules = $( element ).rules(),
					rulesCount = $.map( rules, function( n, i ) {
						return i;
					}).length,
					dependencyMismatch = false,
					val = this.elementValue( element ),
					result, method, rule;

				for ( method in rules ) {
					rule = { method: method, parameters: rules[ method ] };

					try {
						result = $.validator.methods[ method ].call( this, val, element, rule.parameters );

						// if a method indicates that the field is optional and therefore valid,
						// don't mark it as valid when there are no other rules
						if ( result === "dependency-mismatch" && rulesCount === 1 ) {
							dependencyMismatch = true;
							continue;
						}
						dependencyMismatch = false;

						if ( !result ) {
							// this.formatAndAdd( element, rule );
							this.settings.highlight.call( this, element );
							return false;
						}
					} catch( e ) {
						if ( this.settings.debug && window.console ) {
							console.log( "Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
						}
						if ( e instanceof TypeError ) {
							e.message += ".  Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.";
						}

						throw e;
					}
				}

				this.settings.unhighlight.call( this, element );
				return true;
			},

			checkable: function( element ) {
				return ( /radio|checkbox/i ).test( element.type );
			},

			destroy: function() {
				this.resetForm();

				// destroy this shit
				$( this.currentForm )
					.off( ".validate" )
					.removeData( pluginName );
			}
		},

		classRuleSettings: {
			required: { required: true },
			email: { email: true },
			url: { url: true },
			date: { date: true },
			number: { number: true },
			digits: { digits: true },
			creditcard: { creditcard: true }
		},

		addClassRules: function( className, rules ) {
			if ( className.constructor === String ) {
				this.classRuleSettings[ className ] = rules;
			} else {
				$.extend( this.classRuleSettings, className );
			}
		},

		classRules: function( element ) {
			var rules = {},
				classes = $( element ).attr( "class" );

			if ( classes ) {
				$.each( classes.split( " " ), function() {
					if ( this in $.validator.classRuleSettings ) {
						$.extend( rules, $.validator.classRuleSettings[ this ]);
					}
				});
			}
			return rules;
		},

		normalizeAttributeRule: function( rules, type, method, value ) {

			// convert the value to a number for number inputs, and for text for backwards compability
			// allows type="date" and others to be compared as strings
			if ( /min|max/.test( method ) && ( type === null || /number|range|text/.test( type ) ) ) {
				value = Number( value );

				// Support Opera Mini, which returns NaN for undefined minlength
				if ( isNaN( value ) ) {
					value = undefined;
				}
			}

			if ( value || value === 0 ) {
				rules[ method ] = value;
			} else if ( type === method && type !== "range" ) {

				// exception: the jquery validate 'range' method
				// does not test for the html5 'range' type
				rules[ method ] = true;
			}
		},

		attributeRules: function( element ) {
			var rules = {},
				$element = $( element ),
				type = element.getAttribute( "type" ),
				method, value;

			for ( method in $.validator.methods ) {

				// support for <input required> in both html5 and older browsers
				if ( method === "required" ) {
					value = element.getAttribute( method );

					// Some browsers return an empty string for the required attribute
					// and non-HTML5 browsers might have required="" markup
					if ( value === "" ) {
						value = true;
					}

					// force non-HTML5 browsers to return bool
					value = !!value;
				} else {
					value = $element.attr( method );
				}

				this.normalizeAttributeRule( rules, type, method, value );
			}

			// maxlength may be returned as -1, 2147483647 ( IE ) and 524288 ( safari ) for text inputs
			if ( rules.maxlength && /-1|2147483647|524288/.test( rules.maxlength ) ) {
				delete rules.maxlength;
			}

			return rules;
		},

		dataRules: function( element ) {
			var rules = {},
				$element = $( element ),
				type = element.getAttribute( "type" ),
				method, value;

			for ( method in $.validator.methods ) {
				value = $element.data( "rule" + method.charAt( 0 ).toUpperCase() + method.substring( 1 ).toLowerCase() );
				this.normalizeAttributeRule( rules, type, method, value );
			}
			return rules;
		},

		staticRules: function( element ) {
			var rules = {},
				validator = $.data( element.form, pluginName );

			if ( validator.settings.rules ) {
				rules = $.validator.normalizeRule( validator.settings.rules[ element.name ] ) || {};
			}
			return rules;
		},

		normalizeRules: function( rules, element ) {
			// handle dependency check
			$.each( rules, function( prop, val ) {
				// ignore rule when param is explicitly false, eg. required:false
				if ( val === false ) {
					delete rules[ prop ];
					return;
				}
				if ( val.param || val.depends ) {
					var keepRule = true;
					switch ( typeof val.depends ) {
					case "string":
						keepRule = !!$( val.depends, element.form ).length;
						break;
					case "function":
						keepRule = val.depends.call( element, element );
						break;
					}
					if ( keepRule ) {
						rules[ prop ] = val.param !== undefined ? val.param : true;
					} else {
						delete rules[ prop ];
					}
				}
			});

			// evaluate parameters
			$.each( rules, function( rule, parameter ) {
				rules[ rule ] = $.isFunction( parameter ) ? parameter( element ) : parameter;
			});

			// clean number parameters
			$.each([ "minlength", "maxlength" ], function() {
				if ( rules[ this ] ) {
					rules[ this ] = Number( rules[ this ] );
				}
			});
			$.each([ "rangelength", "range" ], function() {
				var parts;
				if ( rules[ this ] ) {
					if ( $.isArray( rules[ this ] ) ) {
						rules[ this ] = [ Number( rules[ this ][ 0 ]), Number( rules[ this ][ 1 ] ) ];
					} else if ( typeof rules[ this ] === "string" ) {
						parts = rules[ this ].replace(/[\[\]]/g, "" ).split( /[\s,]+/ );
						rules[ this ] = [ Number( parts[ 0 ]), Number( parts[ 1 ] ) ];
					}
				}
			});

			if ( $.validator.autoCreateRanges ) {
				// auto-create ranges
				if ( rules.min !== null && rules.max !== null ) {
					rules.range = [ rules.min, rules.max ];
					delete rules.min;
					delete rules.max;
				}
				if ( rules.minlength !== null && rules.maxlength !== null ) {
					rules.rangelength = [ rules.minlength, rules.maxlength ];
					delete rules.minlength;
					delete rules.maxlength;
				}
			}

			return rules;
		},

		// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
		normalizeRule: function( data ) {
			if ( typeof data === "string" ) {
				var transformed = {};
				$.each( data.split( /\s/ ), function() {
					transformed[ this ] = true;
				});
				data = transformed;
			}
			return data;
		},

		methods: {

			required: function( value, element, param ) {
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
			},

			email: function( value, element ) {
				// From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
				// Retrieved 2014-01-14
				// If you have a problem with this implementation, report a bug against the above spec
				// Or use custom methods to implement your own email validation
				return this.optional( element ) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
			},

			url: function( value, element ) {

				// Copyright (c) 2010-2013 Diego Perini, MIT licensed
				// https://gist.github.com/dperini/729294
				// see also https://mathiasbynens.be/demo/url-regex
				// modified to allow protocol-relative URLs
				return this.optional( element ) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
			},

			date: function( value, element ) {
				return this.optional( element ) || !/Invalid|NaN/.test( new Date( value ).toString() );
			},

			number: function( value, element ) {
				return this.optional( element ) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
			},

			digits: function( value, element ) {
				return this.optional( element ) || /^\d+$/.test( value );
			},

			// based on http://en.wikipedia.org/wiki/Luhn_algorithm
			creditcard: function( value, element ) {
				if ( this.optional( element ) ) {
					return "dependency-mismatch";
				}
				// accept only spaces, digits and dashes
				if ( /[^0-9 \-]+/.test( value ) ) {
					return false;
				}
				var nCheck = 0,
					nDigit = 0,
					bEven = false,
					n, cDigit;

				value = value.replace( /\D/g, "" );

				// Basing min and max length on
				// http://developer.ean.com/general_info/Valid_Credit_Card_Types
				if ( value.length < 13 || value.length > 19 ) {
					return false;
				}

				for ( n = value.length - 1; n >= 0; n--) {
					cDigit = value.charAt( n );
					nDigit = parseInt( cDigit, 10 );
					if ( bEven ) {
						if ( ( nDigit *= 2 ) > 9 ) {
							nDigit -= 9;
						}
					}
					nCheck += nDigit;
					bEven = !bEven;
				}

				return ( nCheck % 10 ) === 0;
			},

			minlength: function( value, element, param ) {
				var length = $.isArray( value ) ? value.length : this.getLength( value, element );
				return this.optional( element ) || length >= param;
			},

			maxlength: function( value, element, param ) {
				var length = $.isArray( value ) ? value.length : this.getLength( value, element );
				return this.optional( element ) || length <= param;
			},

			rangelength: function( value, element, param ) {
				var length = $.isArray( value ) ? value.length : this.getLength( value, element );
				return this.optional( element ) || ( length >= param[ 0 ] && length <= param[ 1 ] );
			},

			min: function( value, element, param ) {
				return this.optional( element ) || value >= param;
			},

			max: function( value, element, param ) {
				return this.optional( element ) || value <= param;
			},

			range: function( value, element, param ) {
				return this.optional( element ) || ( value >= param[ 0 ] && value <= param[ 1 ] );
			},

			equalTo: function( value, element, param ) {
				// bind to the blur event of the target in order to revalidate whenever the target field is updated
				// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
				var target = $( param );
				if ( this.settings.onfocusout ) {
					target.off( ".validate-equalTo" ).on( "blur.validate-equalTo", function() {
						$( element ).valid();
					});
				}
				return value === target.val();
			},

			remote: function( value, element, param ) {
				if ( this.optional( element ) ) {
					return "dependency-mismatch";
				}

				var previous = this.previousValue( element ),
					validator, data;

				if (!this.settings.messages[ element.name ] ) {
					this.settings.messages[ element.name ] = {};
				}
				previous.originalMessage = this.settings.messages[ element.name ].remote;
				this.settings.messages[ element.name ].remote = previous.message;

				param = typeof param === "string" && { url: param } || param;

				if ( previous.old === value ) {
					return previous.valid;
				}

				previous.old = value;
				validator = this;
				this.startRequest( element );
				data = {};
				data[ element.name ] = value;
				$.ajax( $.extend( true, {
					mode: "abort",
					port: "validate" + element.name,
					dataType: "json",
					data: data,
					context: validator.currentForm,
					success: function( response ) {
						var valid = response === true || response === "true",
							errors, message, submitted;

						validator.settings.messages[ element.name ].remote = previous.originalMessage;
						if ( valid ) {
							submitted = validator.formSubmitted;
							validator.prepareElement( element );
							validator.formSubmitted = submitted;
							validator.successList.push( element );
							delete validator.invalid[ element.name ];
							validator.showErrors();
						} else {
							errors = {};
							message = response || validator.defaultMessage( element, "remote" );
							errors[ element.name ] = previous.message = $.isFunction( message ) ? message( value ) : message;
							validator.invalid[ element.name ] = true;
							validator.showErrors( errors );
						}
						previous.valid = valid;
						validator.stopRequest( element, valid );
					}
				}, param ) );
				return "pending";
			}
		}

	});
	console.log($.validator.methods);
});
