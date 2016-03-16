export class SatChart {

  constructor(element, {
    width = 600,
    height = 300,
    valueRange = [1, 10]
    }) {

    // config
    const outerSunRadius = height / 10;
    const innerSunRadius = outerSunRadius / 2;

    this.element = element;
    this.config = {
      width,
      height,
      valueRange,
      outerSunRadius,
      innerSunRadius
    };

    // draw chart
    this.init();

  }

  init() {
    this.svg = d3.select(this.element)
      .append('svg')
      .attr('width', this.config.width)
      .attr('height', this.config.height);

    this.outerSun = this.svg.append('g')
      .attr('class', 'sun outer')
      .append('circle')
      .attr({
        cx: this.config.width / 2,
        cy: this.config.height / 2,
        r: this.config.outerSunRadius,
        stroke: 'black',
        'stroke-width': 2,
        fill: 'white'
      });

    this.innerSun = this.svg.append('g')
      .attr('class', 'sun outer')
      .append('circle')
      .attr({
        cx: this.config.width / 2,
        cy: this.config.height / 2,
        r: this.config.innerSunRadius,
        stroke: 'black',
        'stroke-width': 2,
        fill: 'white'
      });



  }
}