export class SatChart {

  constructor(element, data, {
    width = 600,
    height = 300,
    valueRange = [1, 5.5, 10],
    strokeWidth = .5,
    distanceRatio = 4 // sun-to-planets / planets-to-moons
    }) {

    // config
    const outerSunRadius = height / 10;
    const innerSunRadius = outerSunRadius / 2;
    const planetRadius = height / 20;
    const moonRadius = height / 40;
    const sunToPlanet = (height / 2 - moonRadius) / (1 + 1 / distanceRatio);
    const planetToMoon = sunToPlanet / distanceRatio;

    this.element = element;
    this.data = data;
    const [cx, cy] = [width / 2, height / 2];
    this.config = {
      width,
      cx,
      cy,
      planetRadius,
      moonRadius,
      sunToPlanet,
      planetToMoon,
      strokeWidth,
      height,
      valueRange,
      outerSunRadius,
      innerSunRadius
    };

    // draw chart
    this.drawChart();

  }

  drawChart() {

    this.computeLayout();
    this.scale = d3.scale.linear()
      .domain(this.config.valueRange)
      .range(['#ff0000', '#ffff00', '#00ff00']);

    // svg
    this.svg = d3.select(this.element)
      .append('svg')
      .attr('width', this.config.width)
      .attr('height', this.config.height);

    // outer sun
    this.outerSun = this.svg.append('g')
      .attr('class', 'sun outer');
    this.outerSun
      .append('circle')
      .attr({
        cx: this.data.position.x,
        cy: this.data.position.y,
        r: this.config.outerSunRadius,
        stroke: 'black',
        'stroke-width': this.config.strokeWidth,
        fill: 'white'
      });

    this.outerSun.selectAll('line')
      .data(this.data.satellites)
      .enter()
      .append('line')
      .attr('x1', (d, i) => this.config.cx + this.config.outerSunRadius * Math.sin(i * 2*Math.PI / this.data.satellites.length))
      .attr('y1', (d, i) => this.config.cy + this.config.outerSunRadius * Math.cos(i * 2*Math.PI / this.data.satellites.length))
      .attr('x2', this.config.cx)
      .attr('y2', this.config.cy)
      .attr('stroke', 'black')
      .attr('stroke-width', this.config.strokeWidth);

    // inner sun
    this.innerSun = this.svg.append('g')
      .attr('class', 'sun inner');

    this.innerSun
      .append('circle')
      .attr({
        cx: this.data.position.x,
        cy: this.data.position.y,
        r: this.config.innerSunRadius,
        stroke: 'black',
        'stroke-width': this.config.strokeWidth,
        fill: this.scale(this.data.value)
      });

    this.innerSun.append('text')
      .attr({
        x: this.data.position.x,
        y: this.data.position.y,
        'font-family': 'sans-serif',
        'font-size': 50,
        'text-anchor': 'middle',
        'alignment-baseline': 'middle',
        fill: 'black',
      })
      .text(this.data.label);

    // planets
    this.planets = this.svg.append('g')
      .attr('class', 'planets');

    this.planets.selectAll('circle')
      .data(this.data.satellites)
      .enter()
      .append('circle')
      .attr({
        cx: (d) => d.position.x,
        cy: (d) => d.position.y,
        r: this.config.planetRadius,
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
      })
      .text((d) => d.label);


    // moons
    const moons = this.data.satellites
      .map(function(planet) {return planet.satellites}) // extract moon arrays
      .reduce(function(acc, moons) {return acc.concat(moons)}, []); // concatenate moon arrays

    this.moons = this.svg.append('g')
      .attr('class', 'moons');

    this.moons.selectAll('circle')
      .data(moons)
      .enter()
      .append('circle')
      .attr({
        cx: (d) => d.position.x,
        cy: (d) => d.position.y,
        r: this.config.moonRadius,
        stroke: 'black',
        'stroke-width': this.config.strokeWidth,
        fill: (d) => this.scale(d.value)
      })

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
      })
      .text((d) => d.label);

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
        y: this.config.cy + this.config.sunToPlanet * Math.cos(planetAngle * (plenetIndex + 0.5))
      };

      // satellite positions
      const satelliteAngle = 2 * Math.PI / planet.satellites.length;
      planet.satellites.forEach((satellite, satelliteIndex) => {
        satellite.position = {
          x: planet.position.x + this.config.planetToMoon * Math.sin(satelliteAngle * satelliteIndex),
          y: planet.position.y + this.config.planetToMoon * Math.cos(satelliteAngle * satelliteIndex),
        }
      })
    })
  }
}