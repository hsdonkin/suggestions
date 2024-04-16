class List {
  constructor(component) {
    this.component = component;
    this.id = 'suggestions-' + Math.random().toString(36).substr(2, 16);
    this.items = [];
    this.active = 0;
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'suggestions-wrapper';

    this.element = document.createElement('ul');
    this.element.className = 'suggestions';
    this.element.id = this.id;
    this.element.setAttribute('role', 'listbox');
    this.element.setAttribute('aria-label', 'Results');

    this.wrapper.appendChild(this.element);
    this.selectingListItem = false;
    component.el.parentNode.insertBefore(this.wrapper, component.el.nextSibling);
  }

  show() {
    this.element.style.display = 'block';
  }

  hide() {
    this.element.style.display = 'none';
  }

  add(item) {
    this.items.push(item);
  }

  clear() {
    this.items = [];
    this.active = 0;
  }

  isEmpty() {
    return !this.items.length;
  }

  isVisible() {
    return this.element.style.display === 'block';
  }

  draw() {
    this.element.innerHTML = '';

    if (this.items.length === 0) {
      this.hide();
      return;
    }

    for (let i = 0; i < this.items.length; i++) {
      this.drawItem(this.items[i], this.active === i);
    }

    this.show();
  }

  drawItem(item, active) {
    const li = document.createElement('li');
    const a = document.createElement('a');

    const id = this.id + '-' + this.items.indexOf(item);
    li.setAttribute('id', id);
    li.setAttribute('role', 'option');

    if (active) {
      this.component.el.setAttribute('aria-activedescendant', id);
      li.className += ' active';
      li.setAttribute('aria-selected', 'true');
    }

    a.innerHTML = item.string;
    a.setAttribute('aria-label', a.textContent);

    li.appendChild(a);
    this.element.appendChild(li);

    li.addEventListener('mousedown', () => {
      this.selectingListItem = true;
    });

    li.addEventListener('mouseup', () => {
      this.handleMouseUp(item);
    });
  }

  handleMouseUp(item) {
    this.selectingListItem = false;
    this.component.value(item.original);
    this.clear();
    this.draw();
  }

  move(index) {
    this.active = index;
    this.draw();
  }

  previous() {
    this.move(this.active === 0 ? this.items.length - 1 : this.active - 1);
  }

  next() {
    this.move(this.active === this.items.length - 1 ? 0 : this.active + 1);
  }

  drawError(msg) {
    const li = document.createElement('li');
    li.innerHTML = msg;
    this.element.appendChild(li);
    this.show();
  }
}

module.exports = List;
