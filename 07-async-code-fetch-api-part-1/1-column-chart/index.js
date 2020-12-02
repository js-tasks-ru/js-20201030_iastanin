export default class ColumnChart {
  element = {};
  chartHeight = 50;
  data = [];
  constructor({url = '', range = {from: new Date(), to: new Date()}, label = '', link = ''} = {}) {
    this.url = url;
    this.range = range;
    this.label = label;
    this.link = link;
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.chart;
    this.element = element.firstElementChild;
  }

  async update(begin, end) {
    this.data = await this.getData(begin, end);
    const columns = this.element.querySelector('.column-chart__chart');
    // columns.innerHTML = this.columns;
  }

  async getData(begin = new Date(), end = new Date()) {
    try {
      const url = `https://course-js.javascript.ru/${this.url}?from=${begin.toJSON()}&to=${end.toJSON()}`;
      return await fetch(url).then(response => response.json());
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
  }

  get chart() {
    return `
      <div class="column-chart ${!this.data.length ? 'column-chart_loading' : ''}"  style="--chart-height: ${this.chartHeight}">
        ${this.title}
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
             ${this.totalValue}
          </div>
          <div data-element="body" class="column-chart__chart" >
          </div>
        </div>
      </div>
    `;
  }

  get title() {
    return `
      <div class="column-chart__title">
        Total ${this.label}
        <span class="column-chart__link">
          ${this.linkItem}
        </span>
      </div>
    `;
  }

  get linkItem() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  get totalValue() {
    return this.data.reduce((accum, value) => accum += value, 0);
  }

  get columns() {
    const max = Math.max(...this.data);
    const scale = this.chartHeight / max;
    return [...this.data].map(x => {
      const percent = (x / max * 100).toFixed(0);
      return `<div style="--value: ${Math.floor(x * scale)}" data-tooltip="${percent}%"></div>`;
    }).join('');
  }
}
