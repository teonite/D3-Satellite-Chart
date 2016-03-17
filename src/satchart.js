export class SatChart {

  constructor(element, data, {
    width = element.offsetWidth,
    height = element.offsetHeight,
    valueRange = [1, 5.5, 10],
    colorRange = ['#fc2d2d', '#ffffff', '#2979f2'],
    strokeWidth = .5,
    distanceRatio = 4, // sun-to-planets / planets-to-moons,
    animationDuration = 2000
    }) {

    // config
    const outerSunRadius = Math.min(width, height) / 10;
    const innerSunRadius = outerSunRadius * 0.8;
    const planetRadius = height / 20;
    const moonRadius = height / 40;
    const sunToPlanet = (height / 2 - moonRadius) / (1 + 1 / distanceRatio);
    const planetToMoon = sunToPlanet / distanceRatio;

    this.element = element;
    this.data = data;
    const [cx, cy] = [width / 2, height / 2];
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
      valueRange,
      colorRange,
      outerSunRadius,
      innerSunRadius,
      animationDuration
    };

    // draw chart
    this.initChart();
    this.animate();

  }

  initChart() {
    this.computeLayout();
    this.scale = d3.scale.linear()
      .domain(this.config.valueRange)
      .range(this.config.colorRange);

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
        stroke: 'white',
        'stroke-width': this.config.strokeWidth,
        fill: 'white',
        'stroke-dasharray': [5, 10]
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
        stroke: 'white',
        'stroke-width': this.config.strokeWidth,
        fill: 'white'
      });

    // planets
    this.planets = this.svg.append('g')
      .attr('class', 'planets');

    this.planets.selectAll('circle')
      .data(this.data.satellites)
      .enter()
      .append('circle')
      .attr({
        cx: this.data.position.x,
        cy: this.data.position.y,
        r: 0,
        stroke: 'black',
        'stroke-width': this.config.strokeWidth,
        fill: (d) => this.scale(d.value)
      });

    this.planets.selectAll('text')
      .data(this.data.satellites)
      .enter()
      .append('text')
      .attr({
        x: (d) => d.position.x,
        y: (d) => d.position.y,
        'font-family': 'sans-serif',
        'font-size': 20,
        'text-anchor': 'middle',
        'alignment-baseline': 'middle',
        fill: 'black',
        'fill-opacity': 0
      })
      .text((d) => d.label);

    // outer sun
    this.outerSun = this.svg.append('g')
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
    this.innerSun = this.svg.append('g')
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
        'font-size': 100,
        'text-anchor': 'middle',
        'alignment-baseline': 'middle',
        fill: 'black',
        'fill-opacity': 0
      })
      .text(this.data.label);

    // moons
    const moons = this.data.satellites
      .map((planet) => planet.satellites) // extract moon arrays
      .reduce((acc, moons) => acc.concat(moons), []); // concatenate moon arrays

    this.moons = this.svg.append('g')
      .attr('class', 'moons');

    this.moons.selectAll('circle')
      .data(moons)
      .enter()
      .append('circle')
      .attr({
        cx: (d) => d.position.parent.x,
        cy: (d) => d.position.parent.y,
        r: 0,
        stroke: 'black',
        'stroke-width': this.config.strokeWidth,
        fill: (d) => this.scale(d.value)
      });

    this.moons.selectAll('text')
      .data(moons)
      .enter()
      .append('text')
      .attr({
        x: (d) => d.position.x,
        y: (d) => d.position.y,
        'font-family': 'sans-serif',
        'font-size': 12,
        'text-anchor': 'middle',
        'alignment-baseline': 'middle',
        fill: 'black',
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
        stroke: 'gray'
      });

     //outer sun
    const outerSunArc = d3.svg.arc()
      .innerRadius(this.config.outerSunRadius * 0.9)
      .outerRadius(this.config.outerSunRadius)
      .startAngle((d, i) => (i * 2 * Math.PI / this.data.satellites.length))
      .endAngle((d, i) => (i + 1) * 2 * Math.PI / this.data.satellites.length);

    this.outerSun.selectAll('path')
      .transition()
      .duration(this.config.animationDuration * 0.5)
      .ease('elastic')
      .delay(this.config.animationDuration * 0.1)
      .attr('d', outerSunArc);

    // inner sun
    this.innerSun.selectAll('circle')
      .transition()
      .duration(this.config.animationDuration * 0.5)
      .ease('elastic')
      .attr({
        r: this.config.innerSunRadius
      });

    this.innerSun.selectAll('text')
      .transition()
      .duration(this.config.animationDuration * 0.3)
      .delay(this.config.animationDuration * 0.7)
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
        stroke: (d) => this.scale(d.value)
      });

    // planets
    this.planets.selectAll('circle')
      .transition()
      .duration(this.config.animationDuration * 0.5)
      .delay(this.config.animationDuration * 0.3)
      .ease('elastic')
      .attr({
        cx: (d) => d.position.x,
        cy: (d) => d.position.y,
        r: this.config.planetRadius,
      });

    this.planets.selectAll('text')
      .transition()
      .duration(this.config.animationDuration * 0.3)
      .delay(this.config.animationDuration * 0.7)
      .attr({
        'fill-opacity': 1
      });

    // moons
    this.moons.selectAll('circle')
      .transition()
      .duration(this.config.animationDuration * 0.5)
      .delay(this.config.animationDuration * 0.5)
      .ease('elastic')
      .attr({
        cx: (d) => d.position.x,
        cy: (d) => d.position.y,
        r: this.config.moonRadius
      });

    this.moons.selectAll('text')
      .transition()
      .duration(this.config.animationDuration * 0.3)
      .delay(this.config.animationDuration * 0.7)
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
        y: this.config.cy - this.config.sunToPlanet * Math.cos(planetAngle * (plenetIndex + 0.5))
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
