import fetchJson from './utils/fetch-json.js';

export default class ColumnChart {
  data = {}
  element = {};
  subElements = {};
  chartHeight = 50;
  constructor({url = '', range = {from: new Date(), to: new Date()}, label = '', link = '', formatHeading = data => data} = {}) {
    this.url = url;
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.chart;
    this.element = element.firstElementChild;
    this.getChartElements();
    this.updateChartValues();
  }

  async update(dateFrom, dateTo) {
    this.range.from = dateFrom;
    this.range.to = dateTo;
    await this.updateChartValues();
  }

  async updateChartValues() {
    this.element.classList.add('column-chart_loading');
    const url = `https://course-js.javascript.ru/${this.url}?from=${this.range.from.toJSON()}&to=${this.range.to.toJSON()}`;
    this.data = await fetchJson(url);
    if (this.data && Object.values(this.data).length) {
      this.subElements.header.textContent = this.totalValue;
      this.subElements.body.innerHTML = this.columns;
      this.element.classList.remove('column-chart_loading');
    }
    console.log(this.subElements.body.children.length, Object.values(this.data).length)
  }

  getChartElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    this.subElements = [...elements].reduce((accum, element) => {
      accum[element.dataset.element] = element;
      return accum;
    }, {});
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }

  get chart() {
    return `
      <div class="column-chart column-chart_loading"  style="--chart-height: ${this.chartHeight}">
        ${this.title}
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
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
    return this.formatHeading(Object.values(this.data).reduce((accum, value) => accum += value, 0));
  }

  get columns() {
    const max = Math.max(...Object.values(this.data));
    const scale = this.chartHeight / max;
    return Object.entries(this.data).map(([key, val]) => {
      const percent = (val / max * 100).toFixed(0);
        return `<div style="--value: ${Math.floor(val * scale)}" data-tooltip="${percent}%"></div>`;
    }).join('');
  }
}
