export default class SortableTable {
  element = {};
  constructor(headerColumns = [], {data = []} = {}) {
    this.headerCols = headerColumns;
    this.data = data;
    this.render();
  }

  render() {
    const el = document.createElement('div');
    el.innerHTML = this.template;
    this.element = el.firstElementChild;
  }

  remove() {
    this.element.remove();
  }

  destroy() {

  }

  get template() {
    return `
      <div class="sortable-table">
        ${this.tableHeader}
        ${this.tableBody}
      </div>
    `;
  }

  get tableHeader() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerColumns}
      </div>
    `;
  }

  get headerColumns() {
    return this.headerCols.map((headerCol) =>
      `<div class="sortable-table__cell" data-id="${headerCol.id}" data-sortable="${headerCol.sortable}" data-order="asc">
        <span>${headerCol.title}</span>
        ${headerCol.sortable ?
            `<span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>`
            : ''
          }
      </div>`
    ).join('');
  }

  get tableBody() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.tableBodyRow}
      </div>
    `;
  }

  get tableBodyRows() {
    return this.data.map((row) =>
      `
      <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
        <div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="http://magazilla.ru/jpg_zoom1/246743.jpg">
        </div>
        <div class="sortable-table__cell">3D очки Epson ELPGS03</div>

        <div class="sortable-table__cell">16</div>
        <div class="sortable-table__cell">91</div>
        <div class="sortable-table__cell">6</div>
      </a>
    `
    ).join('');
  }
}

