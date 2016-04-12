import d3 from 'd3'
import tooltip from 'd3-tip'

export class SatChart {

  constructor(element, data, {
    width = element.offsetWidth,
    height = element.offsetHeight,
    valueRange = [0, 5, 10],
    colorRange = ['#EF3300', '#F4A429', '#46BE1F'],
    strokeWidth = 0,
    sunOrbitWidth = 0.3,
    planetOrbitWidth= 0.3,
    orbitColor = 'gray',
    fontColor = 'black',
    distanceRatio = 4, // sun-to-planets / planets-to-moons,
    animationDuration = 2000,
    transitionDuration = 750,
    clampScale = true,
    intervaledValues = false,
    ease = 'elastic'
    }) {

    // config
    const minDim = Math.min(width, height);
    const outerSunRadius = minDim / 6.5;
    const innerSunRadius = outerSunRadius * 0.8;
    const planetRadius = minDim / 20;
    const moonRadius = minDim / 30;
    const sunToPlanet = (minDim / 2 - moonRadius) / (1 + 1 / distanceRatio);
    const planetToMoon = sunToPlanet / distanceRatio;

    this.element = element;
    this.data = data;
    this.config = {
      width,
      height,
      cx,
      cy,
      planetRadius,
      moonRadius,
      sunToPlanet,
      planetToMoon,
      strokeWidth,
      sunOrbitWidth,
      planetOrbitWidth,
      orbitColor,
      fontColor,
      valueRange,
      colorRange,
      outerSunRadius,
      innerSunRadius,
      animationDuration,
      transitionDuration,
      clampScale,
      intervaledValues,
      ease
    };

    // draw chart
    this.initChart();
    this.animate();

  }

  scale(value) {
    const {valueRange, colorRange, intervaledValues} = this.config;
    if(intervaledValues) {
      // find interval in valueRange array and return corresponding color from colorRange array
      // clamp values above and below valueRange
      for(var i = 1; i < valueRange.length; i++) {
        if(value < valueRange[i]) {
          return colorRange[i-1];
        }
      }
      return colorRange[colorRange.length-1]; // clamp values above
    } else {
      // regular linear scale
      return this._scale(value);
    }

  }

  initChart() {
    this.computeLayout();

    this.tooltip = tooltip()
    .attr('class', 'd3-tip')
      .style({
        'line-height': 1,
        'font-weight': 'bold',
        'padding': '12px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        'border-radius': '4px',
      })
    .offset([-10, 0])
    .html((d) => {
      return `<strong>${d.tip}:</strong> <span style='color:${this.scale(d.value)}'>${d.value}</span>`;
    });

    // create scales
    const {colorRange, valueRange, intervaledValues, clampScale} = this.config;
    if(!intervaledValues) {
      this._scale = d3.scale.linear().domain(valueRange).range(colorRange).clamp(clampScale);
    }

    // svg
    this.svg = d3.select(this.element)
      .append('svg')
      .attr('width', this.config.width)
      .attr('height', this.config.height);

    // sun orbit
    this.sunOrbit = this.svg.append('g')
      .attr('class', 'sun-orbit');

    this.sunOrbit.append('circle')
      .attr({
        cx: this.data.position.x,
        cy: this.data.position.y,
        r: this.config.sunToPlanet,
        stroke: this.config.orbitColor,
        'stroke-opacity': 0,
        'stroke-width': this.config.sunOrbitWidth,
        'fill-opacity': 0
      });

    // planet orbits
    this.planetOrbits = this.svg.append('g')
      .attr('class', 'planet-orbits');

    this.planetOrbits.selectAll('circle')
      .data(this.data.satellites)
      .enter()
      .append('circle')
      .attr({
        cx: (d) => d.position.x,
        cy: (d) => d.position.y,
        r: this.config.planetToMoon,
        stroke: 'gray',
        'stroke-opacity': 0,
        'stroke-width': this.config.planetOrbitWidth,
        fill: 'white'
      });

    // planets
    this.planets = this.svg.append('g')
      .attr('class', 'planets');

    const planetGroups = this.planets.selectAll('g.planet')
      .data(this.data.satellites)
      .enter()
      .append('g')
      .attr('class', 'planet');

    planetGroups.append('circle')
      .attr({
        cx: this.data.position.x,
        cy: this.data.position.y,
        r: 0,
        stroke: 'black',
        'stroke-width': this.config.strokeWidth,
        fill: (d) => this.scale(d.value)
      });

    planetGroups.append('text')
      .attr({
        'class': 'planet-label',
        x: (d) => d.position.label.x,
        y: (d) => d.position.label.y,
        'font-family': 'sans-serif',
        'font-size': this.config.planetRadius * 0.6,
        'font-weight': 'bold',
        'text-anchor': 'middle',
        'alignment-baseline': 'middle',
        fill: (d) => this.scale(d.value),
        'fill-opacity': 0
      })
      .text((d) => d.label);

    planetGroups.append('text')
      .attr({
        'class': 'planet-value',
        x: (d) => d.position.x,
        y: (d) => d.position.y,
        'font-family': 'sans-serif',
        'font-size': this.config.planetRadius * 0.8,
        'font-weight': 'bold',
        'text-anchor': 'middle',
        'alignment-baseline': 'middle',
        fill: this.config.fontColor,
        'fill-opacity': 0
      })
      .text((d) => d3.format(".2f")(d.value));

    planetGroups.call(this.tooltip);

    // outer sun
    this.sun = this.svg.append('g')
      .attr('class', 'sun-group');

    this.sun.append('circle')
      .attr({
        cx: this.data.position.x,
        cy: this.data.position.y,
        r: this.config.outerSunRadius * 1.2,
        'fill-opacity': 0
      });

    this.outerSun = this.sun.append('g')
      .attr('class', 'sun outer');

    const outerSunArc = d3.svg.arc()
      .innerRadius(this.config.outerSunRadius * 0.002)
      .outerRadius(this.config.outerSunRadius * 0.001)
      .startAngle((d, i) => (i * 2 * Math.PI / this.data.satellites.length))
      .endAngle((d, i) => (i + 1) * 2 * Math.PI / this.data.satellites.length);

    this.outerSun.selectAll('path')
      .data(this.data.satellites)
      .enter()
      .append('path')
      .attr('d', outerSunArc)
      .attr({
        transform: `translate(${this.data.position.x}, ${this.data.position.y})`,
        fill: (d) => this.scale(d.value),
        stroke: 'white',
        'stroke-width': this.config.outerSunRadius * 0.05
      });

    // inner sun
    this.innerSun = this.sun.append('g')
      .attr('class', 'sun inner');

    this.innerSun
      .append('circle')
      .attr({
        cx: this.data.position.x,
        cy: this.data.position.y,
        r: 0,
        stroke: 'black',
        'stroke-width': this.config.strokeWidth,
        fill: this.scale(this.data.value)
      });

    this.innerSun.append('text')
      .attr({
        x: this.data.position.x,
        y: this.data.position.y,
        'font-family': 'sans-serif',
        'font-size': this.config.innerSunRadius,
        'font-weight': 'bold',
        'text-anchor': 'middle',
        'alignment-baseline': 'middle',
        fill: this.config.fontColor,
        'fill-opacity': 0
      })
      .text(this.data.label);

    // moons
    const moons = this.data.satellites
      .map((planet) => planet.satellites) // extract moon arrays
      .reduce((acc, moons) => acc.concat(moons), []); // concatenate moon arrays

    this.moons = this.svg.append('g')
      .attr('class', 'moons');

    const moonGroups = this.moons.selectAll('g.moon')
      .data(moons)
      .enter()
      .append('g')
      .attr('class', 'moon');

    moonGroups
      .append('circle')
      .attr({
        cx: (d) => d.position.parent.x,
        cy: (d) => d.position.parent.y,
        r: 0,
        stroke: (d) => this.scale(d.value),
        'stroke-width': 2,
        fill: 'white'
      });

    moonGroups
      .append('text')
      .attr({
        x: (d) => d.position.x,
        y: (d) => d.position.y,
        'font-family': 'sans-serif',
        'font-size': this.config.moonRadius * 0.5,
        'text-anchor': 'middle',
        'alignment-baseline': 'middle',
        fill: 'gray',
        'font-weight': 'bold',
        'fill-opacity': 0
      })
      .text((d) => d.label);
  }

  animate() {

    // sun orbit
    this.sunOrbit.selectAll('circle')
      .transition()
      .duration(this.config.animationDuration * 0.3)
      .delay(this.config.animationDuration * 0.7)
      .attr({
        'stroke-opacity': 1
      });

    const that = this;

     // outer sun
    const outerSunArcDefault = d3.svg.arc()
      .innerRadius(this.config.outerSunRadius * 0.9)
      .outerRadius(this.config.outerSunRadius)
      .startAngle((d, i) => (i * 2 * Math.PI / this.data.satellites.length))
      .endAngle((d, i) => (i + 1) * 2 * Math.PI / this.data.satellites.length);

    const outerSunArcSelected = d3.svg.arc()
      .innerRadius(this.config.outerSunRadius * 1.05)
      .outerRadius(this.config.outerSunRadius * 1.15)
      .startAngle((d, i) => (i * 2 * Math.PI / this.data.satellites.length))
      .endAngle((d, i) => (i + 1) * 2 * Math.PI / this.data.satellites.length);

    this.outerSun.selectAll('path')
      .transition()
      .duration(this.config.animationDuration * 0.5)
      .ease(this.config.ease)
      .delay(this.config.animationDuration * 0.1)
      .attr('d', outerSunArcDefault);

    // inner sun
    this.innerSun.selectAll('circle')
      .transition()
      .duration(this.config.animationDuration * 0.5)
      .ease(this.config.ease)
      .attr({
        r: this.config.innerSunRadius
      })
      .each('end', () => {
        this.sun
          .on('mouseover', function (data) {
            d3.select(this).selectAll('g.outer').selectAll('path')
              .transition()
              .duration(that.config.transitionDuration)
              .ease(that.config.ease)
              .attr('d', outerSunArcSelected);

            d3.select(this).selectAll('g.inner').selectAll('circle')
              .transition()
              .duration(that.config.transitionDuration)
              .ease(that.config.ease)
              .attr('r', config.innerSunRadius * 0.95);
          })
          .on('mouseout', function (data) {
            d3.select(this).selectAll('g.outer').selectAll('path')
              .transition()
              .duration(that.config.transitionDuration)
              .ease(that.config.ease)
              .attr('d', outerSunArcDefault);

            d3.select(this).selectAll('g.inner').selectAll('circle')
              .transition()
              .duration(that.config.transitionDuration)
              .ease(that.config.ease)
              .attr('r', config.innerSunRadius)
          });
      });

    this.innerSun.selectAll('text')
      .transition()
      .duration(this.config.animationDuration * 0.5)
      .delay(this.config.animationDuration * 0.5)
      .attr({
        'fill-opacity': 1
      });

    // planet orbits
    this.planetOrbits.selectAll('circle')
      .transition()
      .duration(this.config.animationDuration * 0.3)
      .delay(this.config.animationDuration * 0.7)
      .attr({
        r: this.config.planetToMoon,
        'stroke-opacity': 1
      });

    // planets
    const outerSunArcPlanetSelected = (planetIndex) => d3.svg.arc()
        .innerRadius((d, i) => this.config.outerSunRadius * (i == planetIndex ? 1.05 : 0.9))
        .outerRadius((d, i) => this.config.outerSunRadius * (i == planetIndex ? 1.20 : 1))
        .startAngle((d, i) => (i * 2 * Math.PI / this.data.satellites.length))
        .endAngle((d, i) => (i + 1) * 2 * Math.PI / this.data.satellites.length);

    const config = this.config;
    this.planets.selectAll('circle')
      .transition()
      .duration(this.config.animationDuration * 0.5)
      .delay(this.config.animationDuration * 0.2)
      .ease(this.config.ease)
      .attr({
        cx: (d) => d.position.x,
        cy: (d) => d.position.y,
        r: this.config.planetRadius
      })
      .each('end', () => {
        this.planets.selectAll('g.planet')
          .on('mouseover', function (data, index) {
            d3.select(this).selectAll('circle')
              .transition()
              .duration(that.config.transitionDuration)
              .ease(that.config.ease)
              .attr('r', that.config.planetToMoon);

            that.outerSun.selectAll('path')
              .transition()
              .duration(that.config.transitionDuration)
              .ease(that.config.ease)
              .attr('d', outerSunArcPlanetSelected(index));

            that.tooltip.show(data);
          })
          .on('mouseout', function (data) {
            d3.select(this).selectAll('circle')
              .transition()
              .duration(that.config.transitionDuration)
              .ease(that.config.ease)
              .attr('r', config.planetRadius);

            that.outerSun.selectAll('path')
              .transition()
              .duration(that.config.transitionDuration)
              .ease(that.config.ease)
              .attr('d', outerSunArcDefault);

            that.tooltip.hide(data);
          });
      });

    this.planets.selectAll('text')
      .transition()
      .duration(this.config.animationDuration * 0.5)
      .delay(this.config.animationDuration * 0.5)
      .attr({
        'fill-opacity': 1
      });

    // moons
    this.moons.call(this.tooltip);
    this.moons.selectAll('circle')
      .transition()
      .duration(this.config.animationDuration * 0.5)
      .delay(this.config.animationDuration * 0.4)
      .ease(this.config.ease)
      .attr({
        cx: (d) => d.position.x,
        cy: (d) => d.position.y,
        r: this.config.moonRadius
      })
      .each('end', () => {
        this.moons.selectAll('g.moon')
          .on('mouseover', function (data) {
            d3.select(this).selectAll('circle')
              .transition()
              .duration(that.config.transitionDuration)
              .ease(that.config.ease)
              .attr({
                'r': config.moonRadius * 1.2,
                'stroke-width': 4
          });

            that.tooltip.show(data);
          })
          .on('mouseout', function (data) {
            d3.select(this).selectAll('circle')
              .transition()
              .duration(that.config.transitionDuration)
              .ease(that.config.ease)
              .attr({
                'r': config.moonRadius,
                'stroke-width': 2
              });

            that.tooltip.hide(data);
          });
      });

    this.moons.selectAll('text')
      .transition()
      .duration(this.config.animationDuration * 0.5)
      .delay(this.config.animationDuration * 0.5)
      .attr({
        'fill-opacity': 1
      });

  }

  computeLayout() {

    // sun position
    this.data.position = {
      x: this.config.cx,
      y: this.config.cy
    };

    // planet positions
    const planetAngle = 2 * Math.PI / this.data.satellites.length;
    this.data.satellites.forEach((planet, plenetIndex) => {
      planet.position = {
        x: this.config.cx + this.config.sunToPlanet * Math.sin(planetAngle * (plenetIndex + 0.5)),
        y: this.config.cy - this.config.sunToPlanet * Math.cos(planetAngle * (plenetIndex + 0.5)),
        label: {
          x: this.config.cx + this.config.sunToPlanet * 1.6 * Math.sin(planetAngle * (plenetIndex + 0.5)),
          y: this.config.cy - this.config.sunToPlanet * 1.6 * Math.cos(planetAngle * (plenetIndex + 0.5))
        }
      };

      // satellite positions
      const satelliteAngle = 2 * Math.PI / planet.satellites.length;
      planet.satellites.forEach((satellite, satelliteIndex) => {
        satellite.position = {
          x: planet.position.x + this.config.planetToMoon * Math.sin(satelliteAngle * satelliteIndex),
          y: planet.position.y + this.config.planetToMoon * Math.cos(satelliteAngle * satelliteIndex),
          parent: planet.position
        }
      })
    })
  }
}
