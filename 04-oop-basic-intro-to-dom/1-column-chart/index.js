export default class ColumnChart {
  element = {};
  chartHeight = 50;
  constructor({data = [], value = 0, label = '', link = ''} = {}) {
    this.data = data;
    this.value = value;
    this.label = label;
    this.link = link.trim();
    this.render();
  }

  get chart() {
    return `
      <div class="column-chart ${!this.data.length ? 'column-chart_loading' : ''}"  style="--chart-height: ${this.chartHeight}">
        ${this.title}
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.value}
          </div>
          <div data-element="body" class="column-chart__chart" >
            ${this.columns}
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

  get columns() {
    const max = Math.max(...this.data);
    const scale = this.chartHeight / max;
    return [...this.data].map(x => {
      const percent = (x / max * 100).toFixed(0);
      return `<div style="--value: ${Math.floor(x * scale)}" data-tooltip="${percent}%"></div>`;
    }).join('');
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.chart;
    this.element = element.firstElementChild;
  }

  update(data) {
    this.data = data;
    const columns = this.element.querySelector('.column-chart__chart');
    columns.innerHTML = this.columns;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element = null;
  }
}
