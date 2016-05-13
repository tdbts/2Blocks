/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _twoBlocks = __webpack_require__(1);

	var _twoBlocks2 = _interopRequireDefault(_twoBlocks);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(0, _twoBlocks2.default)();

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	/* global document, google */

	/*=================================
	=            twoBlocks()            =
	=================================*/

	var twoBlocks = function twoBlocks() {

		// CHANGE THE BELOW URL BETWEEN THE QUOTES
		// var embedUrl = "https://maps.google.com/maps?q=1516+W+Arthur+Ave,+Chicago,+IL&hl=en&ll=41.999942,-87.668645&spn=0.010796,0.020363&sll=41.999949,-87.668677&layer=c&cbp=13,289.04,,0,13.77&cbll=41.999936,-87.668635&hnear=1516+W+Arthur+Ave,+Chicago,+Illinois+60626&t=m&z=16&iwloc=A&panoid=HAvjga5mCucRKAGYvRxy0g

		// ALL YOU NEED IS LONGITUDE AND LATITUDE
		// Lat / Long will be randomly chosen within pre-defined NYC bounds
		var embedUrl = "https://maps.google.com/maps?ll=40.6291566,-74.0287341";
		// CHANGE THE ABOVE URL BETWEEN THE QUOTES

		/*----------  getUrlParameters()  ----------*/

		function getUrlParameters(url) {

			// The original author of this code was not very experienced with Javascript. 
			// I changed 'vars' from an array to an object to make it make sense for how
			// the author has used it. 
			var vars = {},
			    hash;

			// Get the string of everything after the '?' in the url,
			// and split it into an array of parameter key/value pairs
			var hashes = url.slice(url.indexOf('?') + 1).split('&');

			// For each parameter key/value pair, split the pair at the '='
			// character and add the key / value pair to the 'vars' object 
			for (var i = 0; i < hashes.length; i++) {

				hash = hashes[i].split('=');

				vars[hash[0]] = hash[1];
			}

			return vars;
		}

		// Create embed url parameter object
		var embedUrlParams = getUrlParameters(embedUrl);

		/*----------  getUrlParameter()  ----------*/

		function getUrlParameter(obj, name) {

			return obj[name];
		}

		// Convert the latlong string into an array
		var latlong = getUrlParameter(embedUrlParams, 'll').split(',');

		// #################
		// LOCATION SETTINGS
		// #################
		var latitude = parseFloat(latlong[0]);
		var longitude = parseFloat(latlong[1]);
		var panoid = getUrlParameter(embedUrlParams, 'panoid');

		// #############
		// MORE SETTINGS
		// #############

		var zoom = 1.1;
		// increment controls the speed of panning
		// positive values pan to the right, negatives values pan to the left
		var increment = 1.2;
		var interval = 30;
		var chevrons = false;
		var closebutton = false;
		var clickToGo = false;
		var address = "";
		var pan = "";
		var doubleClickZoom = false;
		var imageDateControl = false;
		var scrollwheel = false;
		var zoomPos = "";
		var zoomSize = "";
		var zoomStart = 1.1;
		var fullscreen = false;
		//

		var fullscreenWidth;
		var fullscreenHeight;
		var panorama;
		var timer;

		var spinner = void 0;

		if (!mode) {

			var mode = "undefined";
		}

		/*----------  initGl()  ----------*/

		function initGl() {

			if (mode === "webgl") {

				var c = document.getElementsByTagName("canvas_streetviewpanorama").item(0);

				if (c) {

					c.addEventListener("webglcontextrestored", spinner.spin, false);
				}
			}
		}

		/*----------  init()  ----------*/

		function init() {
			var _panoramaOptions;

			if (mode === "undefined") {

				mode = "html4";

				if (window.WebGLRenderingContext) {

					var testCanvas = document.createElement("canvas_streetviewpanorama");

					if (testCanvas) {
						//mode = "html5";
						document.getElementsByTagName("body").item(0).appendChild(testCanvas);

						var webGlNames = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"];

						for (var i = 0; i < webGlNames.length; i++) {

							try {

								var context = testCanvas.getContext(webGlNames[i]);

								if (context && typeof context.getParameter === "function") {

									mode = "webgl";

									break;
								}
							} catch (e) {}
						}

						testCanvas.parentNode.removeChild(testCanvas);
					}
				}
			}

			var gps = new google.maps.LatLng(latitude, longitude);

			/*----------  Options Processing  ----------*/

			// Address control shows a box with basic information about the
			// location, as well as a link to see the map on Google Maps
			var addressControl = false;

			var addressControlOptions = {

				position: addressControl && address ? address : google.maps.ControlPosition.TOP_LEFT

			};

			// Pan Control shows a UI element that allows you to rotate the pano
			var panControl = false;

			var panControlOptions = {

				position: panControl && pan ? pan : google.maps.ControlPosition.TOP_LEFT

			};

			// Zoom control functionality is obvious
			var zoomControl = false;

			var zoomControlOptions = {
				position: zoomControl && zoomPos ? zoomPos : google.maps.ControlPosition.TOP_LEFT,
				style: zoomControl && zoomSize ? zoomSize : google.maps.ZoomControlStyle.DEFAULT
			};

			/*----------  End of Options Processing  ----------*/

			var panoramaOptions = (_panoramaOptions = {
				pano: panoid,
				pov: {
					heading: 0,
					pitch: 0,
					zoom: zoom
				},
				clickToGo: clickToGo,
				scrollwheel: scrollwheel,
				zoomControl: zoomControl,
				zoomControlOptions: zoomControlOptions,
				panControl: panControl,
				panControlOptions: panControlOptions,
				visible: true,
				mode: mode,
				addressControl: addressControl,
				addressControlOptions: addressControlOptions,
				linksControl: chevrons,
				disableDoubleClickZoom: !doubleClickZoom,
				imageDateControl: imageDateControl
			}, _defineProperty(_panoramaOptions, 'scrollwheel', scrollwheel), _defineProperty(_panoramaOptions, 'enableCloseButton', closebutton), _defineProperty(_panoramaOptions, 'position', gps), _panoramaOptions);

			var canvas = document.getElementById("canvas_streetviewpanorama");
			// Documentation on streetViewPanorama class:
			// https://developers.google.com/maps/documentation/javascript/reference#StreetViewPanorama
			panorama = new google.maps.StreetViewPanorama(canvas, panoramaOptions);

			google.maps.event.addListener(panorama, 'closeclick', showMap);

			panorama.setPano(panoid);

			google.maps.event.addListener(panorama, 'pano_changed', function () {
				// getPano() --> [string] Returns the current panorama ID
				// for the Street View panorama. This id is stable within
				// the browser's current session only.
				panoid = panorama.getPano();
			});

			spinner = createSpinner(panorama, interval);

			if (canvas.onmouseover === null) {

				// startSpin();
				spinner.start();
				setTimeout(initGl, 1000);
			}

			canvas.onmouseover = function () {
				return spinner.stop();
			};
			canvas.onmouseout = function () {
				return spinner.start();
			};
		}

		/*----------  showMap()  ----------*/

		/**
	  *
	  * It does not lie.  It shows the map.  
	  *
	  */

		function showMap() {

			var canvas = document.getElementById("canvas_streetviewpanorama");

			canvas.onmouseover = function () {};
			canvas.onmouseout = function () {};

			// stopSpin();
			spinner.stop();

			var gps = new google.maps.LatLng(latitude, longitude);
			var mapOptions = {
				center: gps,
				zoom: 16,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			panorama = new google.maps.Map(canvas, mapOptions);

			var markerOptions = {
				map: panorama,
				position: gps,
				visible: true
			};

			var marker = new google.maps.Marker(markerOptions);

			google.maps.event.addListener(marker, 'click', init);
		}

		var createSpinner = function createSpinner(panorma, interval) {

			var timer = void 0;

			return {
				spin: function spin() {

					try {

						var pov = panorma.getPov();

						pov.heading += increment;

						while (pov.heading > 360.0) {
							pov.heading -= 360.0;
						}

						while (pov.heading < 0.0) {
							pov.heading += 360.0;
						}

						panorma.setPov(pov);
					} catch (e) {}
				},
				start: function start() {

					clearInterval(timer);

					timer = setInterval(this.spin, interval);
				},
				stop: function stop() {

					clearInterval(timer);
				}
			};
		};

		/*----------  injectGapiScript()  ----------*/

		function injectGapiScript(MAPS_API_KEY) {

			var script = document.createElement("script");
			var source = "https://maps.googleapis.com/maps/api/js";

			script.type = "text/javascript";

			if (MAPS_API_KEY) {

				source += "&key=" + MAPS_API_KEY;
			}

			script.src = source;
			script.onload = init;

			document.body.appendChild(script);
		}

		injectGapiScript();
	};

	/*=====  End of twoBlocks()  ======*/

	exports.default = twoBlocks;

/***/ }
/******/ ]);