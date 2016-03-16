export class SatChart {

  constructor(element, data, {
    width = 600,
    height = 300,
    valueRange = [1, 10],
    strokeWidth = 2,
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
    this.init();

  }

  init() {

    this.computeLayout();

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
      .attr('class', 'sun outer')
      .append('circle')
      .attr({
        cx: this.data.position.x,
        cy: this.data.position.y,
        r: this.config.innerSunRadius,
        stroke: 'black',
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
        cx: (d) => d.position.x,
        cy: (d) => d.position.y,
        r: this.config.planetRadius,
        stroke: 'black',
        'stroke-width': this.config.strokeWidth,
        fill: 'white'
      })
  }

  computeLayout() {

    // sun position
    this.data.position = {
      x: this.config.cx,
      y: this.config.cy
    };

    const planetAngle = 2 * Math.PI / this.data.satellites.length;
    this.data.satellites.forEach((planet, index) => {
      planet.position = {
        x: this.config.cx + this.config.sunToPlanet * Math.sin(planetAngle * (index + 0.5)),
        y: this.config.cy + this.config.sunToPlanet * Math.cos(planetAngle * (index + 0.5))
      };
      // TODO: moons
    })
  }
}