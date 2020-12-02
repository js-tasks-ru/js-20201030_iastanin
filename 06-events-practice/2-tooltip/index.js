class Tooltip {
  element = {};

  onMouseOver = event => {
    const el = event.target.closest('[data-tooltip]');
    if (el) {
      this.render(el.dataset.tooltip);
      this.changePosition(event);
      document.addEventListener('pointermove', this.onMouseMove);
    }
  }

  onMouseOut = () => {
    this.remove();
    document.removeEventListener('pointermove', this.onMouseMove);
  }

  onMouseMove = event => {
    this.changePosition(event);
  }

  initialize() {
    this.addListeners();
  }

  addListeners() {
    document.addEventListener('pointerover', this.onMouseOver);
    document.addEventListener('pointerout', this.onMouseOut);
  }

  changePosition({clientX: left = 0, clientY: top = 0}) {
    this.element.style.top = top + 'px';
    this.element.style.left = left + 'px';
  }

  render(tooltipData) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = tooltipData;
    document.body.append(this.element);
  }

  remove() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  destroy() {
    document.removeEventListener('pointerover', this.onMouseOver);
    document.removeEventListener('pointerout', this.onMouseOut);
    this.remove();
  }
}

const tooltip = new Tooltip();

export default tooltip;
