export default class NotificationMessage {
  element = {};
  static showedNotification;

  constructor(message = '', {duration = '20', type = ''} = {}) {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.checkNotifications();
    this.render();
  }

  checkNotifications() {
    if (NotificationMessage.showedNotification) {
      NotificationMessage.showedNotification.remove();
    }
  }

  render() {
    const el = document.createElement('div');
    el.innerHTML = this.notification;
    this.element = el.firstElementChild;
  }

  show(parentEl = document.body) {
    parentEl.append(this.element);
    NotificationMessage.showedMessage = this.element;
    setTimeout(() => this.remove(), +this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    NotificationMessage.showedNotification = null;
  }

  get notification() {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration + 'ms'}">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">success</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }
}
