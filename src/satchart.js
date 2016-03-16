export class SatChart {

  constructor(element, data, {
    width = 600,
    height = 300,
    valueRange = [1, 10],
    strokeWidth = 2
    }) {

    // config
    const outerSunRadius = height / 10;
    const innerSunRadius = outerSunRadius / 2;

    this.element = element;
    this.data = data;
    const [cx, cy] = [width / 2, height / 2];
    this.config = {
      width,
      cx,
      cy,
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
        cx: this.config.cx,
        cy: this.config.cy,
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
        cx: this.config.width / 2,
        cy: this.config.height / 2,
        r: this.config.innerSunRadius,
        stroke: 'black',
        'stroke-width': this.config.strokeWidth,
        fill: 'white'
      });

  }
}