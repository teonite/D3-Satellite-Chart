var satchart =
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
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SatChart = exports.SatChart = function () {
	  function SatChart(element, data, _ref) // sun-to-planets / planets-to-moons
	  {
	    var _ref$width = _ref.width;
	    var width = _ref$width === undefined ? element.offsetWidth : _ref$width;
	    var _ref$height = _ref.height;
	    var height = _ref$height === undefined ? element.offsetHeight : _ref$height;
	    var _ref$valueRange = _ref.valueRange;
	    var valueRange = _ref$valueRange === undefined ? [1, 5.5, 10] : _ref$valueRange;
	    var _ref$colorRange = _ref.colorRange;
	    var colorRange = _ref$colorRange === undefined ? ['#fc2d2d', '#ffffff', '#2979f2'] : _ref$colorRange;
	    var _ref$strokeWidth = _ref.strokeWidth;
	    var strokeWidth = _ref$strokeWidth === undefined ? .5 : _ref$strokeWidth;
	    var _ref$distanceRatio = _ref.distanceRatio;
	    var distanceRatio = _ref$distanceRatio === undefined ? 4 : _ref$distanceRatio;

	    _classCallCheck(this, SatChart);

	    // config
	    var outerSunRadius = Math.min(width, height) / 10;
	    var innerSunRadius = outerSunRadius * 0.8;
	    var planetRadius = height / 20;
	    var moonRadius = height / 40;
	    var sunToPlanet = (height / 2 - moonRadius) / (1 + 1 / distanceRatio);
	    var planetToMoon = sunToPlanet / distanceRatio;

	    this.element = element;
	    this.data = data;
	    var cx = width / 2;
	    var cy = height / 2;

	    this.config = {
	      width: width,
	      cx: cx,
	      cy: cy,
	      planetRadius: planetRadius,
	      moonRadius: moonRadius,
	      sunToPlanet: sunToPlanet,
	      planetToMoon: planetToMoon,
	      strokeWidth: strokeWidth,
	      height: height,
	      valueRange: valueRange,
	      colorRange: colorRange,
	      outerSunRadius: outerSunRadius,
	      innerSunRadius: innerSunRadius
	    };

	    // draw chart
	    this.drawChart();
	  }

	  _createClass(SatChart, [{
	    key: 'drawChart',
	    value: function drawChart() {
	      var _this = this;

	      this.computeLayout();
	      this.scale = d3.scale.linear().domain(this.config.valueRange).range(this.config.colorRange);

	      // svg
	      this.svg = d3.select(this.element).append('svg').attr('width', this.config.width).attr('height', this.config.height);

	      // outer sun
	      this.outerSun = this.svg.append('g').attr('class', 'sun outer');

	      var outerSunArc = d3.svg.arc().innerRadius(this.config.outerSunRadius * 0.9).outerRadius(this.config.outerSunRadius).startAngle(function (d, i) {
	        return i * 2 * Math.PI / _this.data.satellites.length;
	      }).endAngle(function (d, i) {
	        return (i + 1) * 2 * Math.PI / _this.data.satellites.length;
	      });

	      this.outerSun.selectAll('path').data(this.data.satellites).enter().append('path').attr('d', outerSunArc).attr({
	        transform: 'translate(' + this.data.position.x + ', ' + this.data.position.y + ')',
	        fill: function fill(d) {
	          return _this.scale(d.value);
	        },
	        stroke: 'black',
	        'stroke-width': this.config.strokeWidth
	      });

	      // inner sun
	      this.innerSun = this.svg.append('g').attr('class', 'sun inner');

	      this.innerSun.append('circle').attr({
	        cx: this.data.position.x,
	        cy: this.data.position.y,
	        r: this.config.innerSunRadius,
	        stroke: 'black',
	        'stroke-width': this.config.strokeWidth,
	        fill: this.scale(this.data.value)
	      });

	      this.innerSun.append('text').attr({
	        x: this.data.position.x,
	        y: this.data.position.y,
	        'font-family': 'sans-serif',
	        'font-size': 100,
	        'text-anchor': 'middle',
	        'alignment-baseline': 'middle',
	        fill: 'black'
	      }).text(this.data.label);

	      // planets
	      this.planets = this.svg.append('g').attr('class', 'planets');

	      this.planets.selectAll('circle').data(this.data.satellites).enter().append('circle').attr({
	        cx: function cx(d) {
	          return d.position.x;
	        },
	        cy: function cy(d) {
	          return d.position.y;
	        },
	        r: this.config.planetRadius,
	        stroke: 'black',
	        'stroke-width': this.config.strokeWidth,
	        fill: function fill(d) {
	          return _this.scale(d.value);
	        }
	      });

	      this.planets.selectAll('text').data(this.data.satellites).enter().append('text').attr({
	        x: function x(d) {
	          return d.position.x;
	        },
	        y: function y(d) {
	          return d.position.y;
	        },
	        'font-family': 'sans-serif',
	        'font-size': 20,
	        'text-anchor': 'middle',
	        'alignment-baseline': 'middle',
	        fill: 'black'
	      }).text(function (d) {
	        return d.label;
	      });

	      // moons
	      var moons = this.data.satellites.map(function (planet) {
	        return planet.satellites;
	      }) // extract moon arrays
	      .reduce(function (acc, moons) {
	        return acc.concat(moons);
	      }, []); // concatenate moon arrays

	      this.moons = this.svg.append('g').attr('class', 'moons');

	      this.moons.selectAll('circle').data(moons).enter().append('circle').attr({
	        cx: function cx(d) {
	          return d.position.x;
	        },
	        cy: function cy(d) {
	          return d.position.y;
	        },
	        r: this.config.moonRadius,
	        stroke: 'black',
	        'stroke-width': this.config.strokeWidth,
	        fill: function fill(d) {
	          return _this.scale(d.value);
	        }
	      });

	      this.moons.selectAll('text').data(moons).enter().append('text').attr({
	        x: function x(d) {
	          return d.position.x;
	        },
	        y: function y(d) {
	          return d.position.y;
	        },
	        'font-family': 'sans-serif',
	        'font-size': 12,
	        'text-anchor': 'middle',
	        'alignment-baseline': 'middle',
	        fill: 'black'
	      }).text(function (d) {
	        return d.label;
	      });
	    }
	  }, {
	    key: 'computeLayout',
	    value: function computeLayout() {
	      var _this2 = this;

	      // sun position
	      this.data.position = {
	        x: this.config.cx,
	        y: this.config.cy
	      };

	      // planet positions
	      var planetAngle = 2 * Math.PI / this.data.satellites.length;
	      this.data.satellites.forEach(function (planet, plenetIndex) {
	        planet.position = {
	          x: _this2.config.cx + _this2.config.sunToPlanet * Math.sin(planetAngle * (plenetIndex + 0.5)),
	          y: _this2.config.cy - _this2.config.sunToPlanet * Math.cos(planetAngle * (plenetIndex + 0.5))
	        };

	        // satellite positions
	        var satelliteAngle = 2 * Math.PI / planet.satellites.length;
	        planet.satellites.forEach(function (satellite, satelliteIndex) {
	          satellite.position = {
	            x: planet.position.x + _this2.config.planetToMoon * Math.sin(satelliteAngle * satelliteIndex),
	            y: planet.position.y + _this2.config.planetToMoon * Math.cos(satelliteAngle * satelliteIndex)
	          };
	        });
	      });
	    }
	  }]);

	  return SatChart;
	}();

/***/ }
/******/ ]);