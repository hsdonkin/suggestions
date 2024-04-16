var w = Object.defineProperty;
var y = (r, t, i) => t in r ? w(r, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : r[t] = i;
var a = (r, t, i) => (y(r, typeof t != "symbol" ? t + "" : t, i), i);
function p(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var E = L, I = Object.prototype.hasOwnProperty;
function L() {
  for (var r = {}, t = 0; t < arguments.length; t++) {
    var i = arguments[t];
    for (var e in i)
      I.call(i, e) && (r[e] = i[e]);
  }
  return r;
}
const x = /* @__PURE__ */ p(E);
var v = { exports: {} };
(function(r, t) {
  (function() {
    var i = {};
    r.exports = i, i.simpleFilter = function(e, s) {
      return s.filter(function(n) {
        return i.test(e, n);
      });
    }, i.test = function(e, s) {
      return i.match(e, s) !== null;
    }, i.match = function(e, s, n) {
      n = n || {};
      var h = 0, l = [], u = s.length, d = 0, o = 0, c = n.pre || "", b = n.post || "", g = n.caseSensitive && s || s.toLowerCase(), f;
      e = n.caseSensitive && e || e.toLowerCase();
      for (var m = 0; m < u; m++)
        f = s[m], g[m] === e[h] ? (f = c + f + b, h += 1, o += 1 + o) : o = 0, d += o, l[l.length] = f;
      return h === e.length ? (d = g === e ? 1 / 0 : d, { rendered: l.join(""), score: d }) : null;
    }, i.filter = function(e, s, n) {
      return !s || s.length === 0 ? [] : typeof e != "string" ? s : (n = n || {}, s.reduce(function(h, l, u, d) {
        var o = l;
        n.extract && (o = n.extract(l));
        var c = i.match(e, o, n);
        return c != null && (h[h.length] = {
          string: c.rendered,
          score: c.score,
          index: u,
          original: l
        }), h;
      }, []).sort(function(h, l) {
        var u = l.score - h.score;
        return u || h.index - l.index;
      }));
    };
  })();
})(v);
var C = v.exports;
const S = /* @__PURE__ */ p(C);
class z {
  constructor(t) {
    this.component = t, this.id = "suggestions-" + Math.random().toString(36).substr(2, 16), this.items = [], this.active = 0, this.wrapper = document.createElement("div"), this.wrapper.className = "suggestions-wrapper", this.element = document.createElement("ul"), this.element.className = "suggestions", this.element.id = this.id, this.element.setAttribute("role", "listbox"), this.element.setAttribute("aria-label", "Results"), this.wrapper.appendChild(this.element), this.selectingListItem = !1, t.el.parentNode.insertBefore(this.wrapper, t.el.nextSibling);
  }
  show() {
    this.element.style.display = "block";
  }
  hide() {
    this.element.style.display = "none";
  }
  add(t) {
    this.items.push(t);
  }
  clear() {
    this.items = [], this.active = 0;
  }
  isEmpty() {
    return !this.items.length;
  }
  isVisible() {
    return this.element.style.display === "block";
  }
  draw() {
    if (this.element.innerHTML = "", this.items.length === 0) {
      this.hide();
      return;
    }
    for (let t = 0; t < this.items.length; t++)
      this.drawItem(this.items[t], this.active === t);
    this.show();
  }
  drawItem(t, i) {
    const e = document.createElement("li"), s = document.createElement("a"), n = this.id + "-" + this.items.indexOf(t);
    e.setAttribute("id", n), e.setAttribute("role", "option"), i && (this.component.el.setAttribute("aria-activedescendant", n), e.className += " active", e.setAttribute("aria-selected", "true")), s.innerHTML = t.string, s.setAttribute("aria-label", s.textContent), e.appendChild(s), this.element.appendChild(e), e.addEventListener("mousedown", () => {
      this.selectingListItem = !0;
    }), e.addEventListener("mouseup", () => {
      this.handleMouseUp(t);
    });
  }
  handleMouseUp(t) {
    this.selectingListItem = !1, this.component.value(t.original), this.clear(), this.draw();
  }
  move(t) {
    this.active = t, this.draw();
  }
  previous() {
    this.move(this.active === 0 ? this.items.length - 1 : this.active - 1);
  }
  next() {
    this.move(this.active === this.items.length - 1 ? 0 : this.active + 1);
  }
  drawError(t) {
    const i = document.createElement("li");
    i.innerHTML = t, this.element.appendChild(i), this.show();
  }
}
class O {
  constructor(t, i, e) {
    a(this, "handleKeyUp", function(t) {
      t === 40 || t === 38 || t === 27 || t === 13 || t === 9 || this.handleInputChange(this.el.value);
    });
    a(this, "handleKeyDown", function(t) {
      switch (t.keyCode) {
        case 13:
        case 9:
          this.list.isEmpty() || (this.list.isVisible() && t.preventDefault(), this.value(this.list.items[this.list.active].original), this.list.hide());
          break;
        case 27:
          this.list.isEmpty() || this.list.hide();
          break;
        case 38:
          this.list.previous();
          break;
        case 40:
          this.list.next();
          break;
      }
    });
    a(this, "handleBlur", function() {
      !this.list.selectingListItem && this.options.hideOnBlur && this.list.hide();
    });
    a(this, "handlePaste", function(t) {
      if (t.clipboardData)
        this.handleInputChange(t.clipboardData.getData("Text"));
      else {
        var i = this;
        setTimeout(function() {
          i.handleInputChange(t.target.value);
        }, 100);
      }
    });
    a(this, "handleInputChange", function(t) {
      if (this.query = this.normalize(t), this.list.clear(), this.query.length < this.options.minLength) {
        this.list.draw();
        return;
      }
      this.getCandidates(
        (function(i) {
          for (var e = 0; e < i.length && (this.list.add(i[e]), e !== this.options.limit - 1); e++)
            ;
          this.list.draw();
        }).bind(this)
      );
    });
    a(this, "handleFocus", function() {
      this.list.isEmpty() || this.list.show(), this.list.selectingListItem = !1;
    });
    /**
     * Update data previously passed
     *
     * @param {Array} revisedData
     */
    a(this, "update", function(t) {
      this.data = t, this.handleKeyUp();
    });
    /**
     * Clears data
     */
    a(this, "clear", function() {
      this.data = [], this.list.clear();
    });
    /**
     * Normalize the results list and input value for matching
     *
     * @param {String} value
     * @return {String}
     */
    a(this, "normalize", function(t) {
      return t = t.toLowerCase(), t;
    });
    /**
     * Evaluates whether an array item qualifies as a match with the current query
     *
     * @param {String} candidate a possible item from the array passed
     * @param {String} query the current query
     * @return {Boolean}
     */
    a(this, "match", function(t, i) {
      return t.indexOf(i) > -1;
    });
    a(this, "value", function(t) {
      if (this.selected = t, this.el.value = this.getItemValue(t), document.createEvent) {
        var i = document.createEvent("HTMLEvents");
        i.initEvent("change", !0, !1), this.el.dispatchEvent(i);
      } else
        this.el.fireEvent("onchange");
    });
    a(this, "getCandidates", function(t) {
      var i = {
        pre: "<strong>",
        post: "</strong>",
        extract: (function(s) {
          return this.getItemValue(s);
        }).bind(this)
      }, e;
      this.options.filter ? (e = S.filter(this.query, this.data, i), e = e.map(
        (function(s) {
          return {
            original: s.original,
            string: this.render(s.original, s.string)
          };
        }).bind(this)
      )) : e = this.data.map(
        (function(s) {
          var n = this.render(s);
          return {
            original: s,
            string: n
          };
        }).bind(this)
      ), t(e);
    });
    /**
     * For a given item in the data array, return what should be used as the candidate string
     *
     * @param {Object|String} item an item from the data array
     * @return {String} item
     */
    a(this, "getItemValue", function(t) {
      return t;
    });
    /**
     * For a given item in the data array, return a string of html that should be rendered in the dropdown
     * @param {Object|String} item an item from the data array
     * @param {String} sourceFormatting a string that has pre-formatted html that should be passed directly through the render function
     * @return {String} html
     */
    a(this, "render", function(t, i) {
      if (i)
        return i;
      for (var e = t.original ? this.getItemValue(t.original) : this.getItemValue(t), s = this.normalize(e), n = s.lastIndexOf(this.query); n > -1; ) {
        var h = n + this.query.length;
        e = e.slice(0, n) + "<strong>" + e.slice(n, h) + "</strong>" + e.slice(h), n = s.slice(0, n).lastIndexOf(this.query);
      }
      return e;
    });
    /**
     * Render an custom error message in the suggestions list
     * @param {String} msg An html string to render as an error message
     */
    a(this, "renderError", function(t) {
      this.list.drawError(t);
    });
    e = e || {}, this.options = x(
      {
        minLength: 2,
        limit: 5,
        filter: !0,
        hideOnBlur: !0
      },
      e
    ), this.el = t, this.data = i || [], this.list = new z(this), this.el.setAttribute("role", "combobox"), this.el.setAttribute("aria-autocomplete", "list"), this.el.setAttribute("aria-controls", this.list.id), this.query = "", this.selected = null, this.list.draw(), this.el.addEventListener(
      "keyup",
      (function(s) {
        this.handleKeyUp(s.keyCode);
      }).bind(this),
      !1
    ), this.el.addEventListener(
      "keydown",
      (function(s) {
        this.handleKeyDown(s);
      }).bind(this)
    ), this.el.addEventListener(
      "focus",
      (function() {
        this.handleFocus();
      }).bind(this)
    ), this.el.addEventListener(
      "blur",
      (function() {
        this.handleBlur();
      }).bind(this)
    ), this.el.addEventListener(
      "paste",
      (function(s) {
        this.handlePaste(s);
      }).bind(this)
    ), this.render = this.options.render ? this.options.render.bind(this) : this.render.bind(this), this.getItemValue = this.options.getItemValue ? this.options.getItemValue.bind(this) : this.getItemValue.bind(this);
  }
}
typeof window < "u" && (window.Suggestions = O);
export {
  O as default
};
