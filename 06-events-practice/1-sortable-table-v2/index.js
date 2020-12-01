export default class SortableTable {
  element = {};
  subElements = {};
  sortDirections = {'asc': 'desc', 'desc': 'asc', '': 'asc'};

  onSort = event => {
    const sortTarget = event.target.closest('[data-sortable="true"]');
    if (sortTarget) {
      this.sorted = {id: sortTarget.dataset.id, order: this.sortDirections[sortTarget.dataset.order]};
      sortTarget.dataset.order = this.sorted.order;
      this.updateSortedArrow(sortTarget);
      this.sort();
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
    this.sort();
    this.subElements.header.addEventListener('pointerdown', this.onSort);
  }

  sort() {
    this.subElements.body.innerHTML = this.getTableBodyRows(this.sortRows());
  }

  updateSortedArrow(sortTarget) {
    const collWithArrow = this.element.querySelector('[data-element="arrow"]').closest('[data-sortable="true"]');
    if (sortTarget.dataset.id !== collWithArrow.dataset.id) {
      collWithArrow.querySelector('[data-element="arrow"]').remove();
      sortTarget.innerHTML += this.getSortedArrow(sortTarget.dataset.id);
    }
  }

  sortRows() {
    const {sortType, customSort} = this.headersData.find(item => item.id === this.sorted.id);
    const sortDirection = {'asc': 1, 'desc': -1};
    return [...this.data].sort((a, b) => {
      switch (sortType) {
        case 'number':
          return sortDirection[this.sorted.order] * (a[this.sorted.id] - b[this.sorted.id]);
        case 'string':
          return sortDirection[this.sorted.order] * a[this.sorted.id].localeCompare(b[this.sorted.id], ['ru', 'en']);
        case 'custom':
          return sortDirection[this.sorted.order] * customSort(a[this.sorted.id], b[this.sorted.id]);
        default:
          return sortDirection[this.sorted.order] * (a[this.sorted.id] - b[this.sorted.id]);
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
    this.element = null;
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
    return this.headersData.map((headerCol) => {
      const order = this.sorted.id === headerCol.id ? this.sorted.order : 'asc';
      return `<div class="sortable-table__cell" data-id="${headerCol.id}" data-sortable="${headerCol.sortable}" data-order="${order}">
        <span>${headerCol.title}</span>
        ${this.getSortedArrow(headerCol.id)}
      </div>`;
    }).join('');
  }

  getSortedArrow(headerColId) {
    return headerColId === this.sorted.id ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>` : '';
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
