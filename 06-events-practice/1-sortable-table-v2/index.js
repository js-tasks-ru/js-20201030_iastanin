export default class SortableTable {
  element = {};
  subElements = {};
  sortDirections = {'asc': 'desc', 'desc': 'asc', '': 'asc'};

  onSort = event => {
    const sortTarget = event.target.closest('[data-sortable="true"]');
    if (sortTarget) {
      const id = sortTarget.dataset.id;
      const sortDirection = this.sortDirections[sortTarget.dataset.order];
      this.sort(id, sortDirection);
    }
  }

  constructor(headerColumns = [], {
    data = [],
    sortedBy = {
      id: headerColumns.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}) {
    this.headersData = headerColumns;
    this.data = data;
    this.sorted = sortedBy;
    this.render();
  }

  render() {
    const el = document.createElement('div');
    el.innerHTML = this.template;
    this.element = el.firstElementChild;
    this.subElements = this.getSubElements(el);
    this.sort(this.sorted.id, this.sorted.order);
    this.subElements.header.addEventListener('pointerdown', this.onSort);
  }

  sort(id, order) {
    this.updateHeadersSortArrow(id, order);
    this.subElements.body.innerHTML = this.getTableBodyRows(this.sortRows(id, order));
  }

  updateHeadersSortArrow(id, order) {
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${id}"]`);
    allColumns.forEach(column => {
      column.dataset.order = '';
    });
    currentColumn.dataset.order = order;
  }

  sortRows(id, order) {
    const {sortType, customSort} = this.headersData.find(item => item.id === id);
    const sortDirection = order === 'asc' ? 1 : -1;

    return [...this.data].sort((a, b) => {
      switch (sortType) {
        case 'number':
          return sortDirection * (a[id] - b[id]);
        case 'string':
          return sortDirection * a[id].localeCompare(b[id], ['ru', 'en']);
        case 'custom':
          return sortDirection * customSort(a[id], b[id]);
        default:
          return sortDirection * (a[id] - b[id]);
      }
    });
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }

  get template() {
    return `<div class="sortable-table">
              ${this.tableHeader}
              ${this.tableBody}
            </div>`;
  }

  get tableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
              ${this.headerColumns}
            </div>`;
  }

  get headerColumns() {
    return this.headersData.map((headerCol) =>
      `<div class="sortable-table__cell" data-id="${headerCol.id}" data-sortable="${headerCol.sortable}" data-order="">
        <span>${headerCol.title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>`
    ).join('');
  }

  get tableBody() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableBodyRows()}
      </div>`;
  }

  getTableBodyRows(data = this.data) {
    return data.map((row) =>
      `<a href="/products/${row.id}" class="sortable-table__row">
        ${this.getTableRowColumns(row)}
      </a>`
    ).join('');
  }

  getTableRowColumns(value) {
    const columns = this.headersData.map(({id, template}) => {
      return {id, template};
    });

    return columns.map(({id, template}) =>
      template
        ? template(value[id])
        : `<div class="sortable-table__cell">${value[id]}</div>`
    ).join('');
  }
}
