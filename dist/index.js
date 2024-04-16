import * as $5OpyM$xtend from "xtend";
import {filter as $5OpyM$filter} from "fuzzy";


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
var $4459fe2e485752c1$exports = {};
"use strict";


var $2651df716b8fd793$exports = {};
class $2651df716b8fd793$var$List {
    constructor(component){
        this.component = component;
        this.id = "suggestions-" + Math.random().toString(36).substr(2, 16);
        this.items = [];
        this.active = 0;
        this.wrapper = document.createElement("div");
        this.wrapper.className = "suggestions-wrapper";
        this.element = document.createElement("ul");
        this.element.className = "suggestions";
        this.element.id = this.id;
        this.element.setAttribute("role", "listbox");
        this.element.setAttribute("aria-label", "Results");
        this.wrapper.appendChild(this.element);
        this.selectingListItem = false;
        component.el.parentNode.insertBefore(this.wrapper, component.el.nextSibling);
    }
    show() {
        this.element.style.display = "block";
    }
    hide() {
        this.element.style.display = "none";
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
        return this.element.style.display === "block";
    }
    draw() {
        this.element.innerHTML = "";
        if (this.items.length === 0) {
            this.hide();
            return;
        }
        for(let i = 0; i < this.items.length; i++)this.drawItem(this.items[i], this.active === i);
        this.show();
    }
    drawItem(item, active) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        const id = this.id + "-" + this.items.indexOf(item);
        li.setAttribute("id", id);
        li.setAttribute("role", "option");
        if (active) {
            this.component.el.setAttribute("aria-activedescendant", id);
            li.className += " active";
            li.setAttribute("aria-selected", "true");
        }
        a.innerHTML = item.string;
        a.setAttribute("aria-label", a.textContent);
        li.appendChild(a);
        this.element.appendChild(li);
        li.addEventListener("mousedown", ()=>{
            this.selectingListItem = true;
        });
        li.addEventListener("mouseup", ()=>{
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
        const li = document.createElement("li");
        li.innerHTML = msg;
        this.element.appendChild(li);
        this.show();
    }
}
$2651df716b8fd793$exports = $2651df716b8fd793$var$List;


class $4459fe2e485752c1$var$Suggestions {
    constructor(el, data, options){
        options = options || {};
        this.options = $5OpyM$xtend({
            minLength: 2,
            limit: 5,
            filter: true,
            hideOnBlur: true
        }, options);
        this.el = el;
        this.data = data || [];
        this.list = new $2651df716b8fd793$exports(this);
        // set aria attribuets on el
        this.el.setAttribute("role", "combobox");
        this.el.setAttribute("aria-autocomplete", "list");
        this.el.setAttribute("aria-controls", this.list.id);
        this.query = "";
        this.selected = null;
        this.list.draw();
        this.el.addEventListener("keyup", (function(e) {
            this.handleKeyUp(e.keyCode);
        }).bind(this), false);
        this.el.addEventListener("keydown", (function(e) {
            this.handleKeyDown(e);
        }).bind(this));
        this.el.addEventListener("focus", (function() {
            this.handleFocus();
        }).bind(this));
        this.el.addEventListener("blur", (function() {
            this.handleBlur();
        }).bind(this));
        this.el.addEventListener("paste", (function(e) {
            this.handlePaste(e);
        }).bind(this));
        // use user-provided render function if given, otherwise just use the default
        this.render = this.options.render ? this.options.render.bind(this) : this.render.bind(this);
        this.getItemValue = this.options.getItemValue ? this.options.getItemValue.bind(this) : this.getItemValue.bind(this);
    }
    handleKeyUp = function(keyCode) {
        // 40 - DOWN
        // 38 - UP
        // 27 - ESC
        // 13 - ENTER
        // 9 - TAB
        if (keyCode === 40 || keyCode === 38 || keyCode === 27 || keyCode === 13 || keyCode === 9) return;
        this.handleInputChange(this.el.value);
    };
    handleKeyDown = function(e) {
        switch(e.keyCode){
            case 13:
            case 9:
                if (!this.list.isEmpty()) {
                    if (this.list.isVisible()) e.preventDefault();
                    this.value(this.list.items[this.list.active].original);
                    this.list.hide();
                }
                break;
            case 27:
                if (!this.list.isEmpty()) this.list.hide();
                break;
            case 38:
                this.list.previous();
                break;
            case 40:
                this.list.next();
                break;
        }
    };
    handleBlur = function() {
        if (!this.list.selectingListItem && this.options.hideOnBlur) this.list.hide();
    };
    handlePaste = function(e) {
        if (e.clipboardData) this.handleInputChange(e.clipboardData.getData("Text"));
        else {
            var self = this;
            setTimeout(function() {
                self.handleInputChange(e.target.value);
            }, 100);
        }
    };
    handleInputChange = function(query) {
        this.query = this.normalize(query);
        this.list.clear();
        if (this.query.length < this.options.minLength) {
            this.list.draw();
            return;
        }
        this.getCandidates((function(data) {
            for(var i = 0; i < data.length; i++){
                this.list.add(data[i]);
                if (i === this.options.limit - 1) break;
            }
            this.list.draw();
        }).bind(this));
    };
    handleFocus = function() {
        if (!this.list.isEmpty()) this.list.show();
        this.list.selectingListItem = false;
    };
    /**
   * Update data previously passed
   *
   * @param {Array} revisedData
   */ update = function(revisedData) {
        this.data = revisedData;
        this.handleKeyUp();
    };
    /**
   * Clears data
   */ clear = function() {
        this.data = [];
        this.list.clear();
    };
    /**
   * Normalize the results list and input value for matching
   *
   * @param {String} value
   * @return {String}
   */ normalize = function(value) {
        value = value.toLowerCase();
        return value;
    };
    /**
   * Evaluates whether an array item qualifies as a match with the current query
   *
   * @param {String} candidate a possible item from the array passed
   * @param {String} query the current query
   * @return {Boolean}
   */ match = function(candidate, query) {
        return candidate.indexOf(query) > -1;
    };
    value = function(value) {
        this.selected = value;
        this.el.value = this.getItemValue(value);
        if (document.createEvent) {
            var e = document.createEvent("HTMLEvents");
            e.initEvent("change", true, false);
            this.el.dispatchEvent(e);
        } else this.el.fireEvent("onchange");
    };
    getCandidates = function(callback) {
        var options = {
            pre: "<strong>",
            post: "</strong>",
            extract: (function(d) {
                return this.getItemValue(d);
            }).bind(this)
        };
        var results;
        if (this.options.filter) {
            results = $5OpyM$filter(this.query, this.data, options);
            results = results.map((function(item) {
                return {
                    original: item.original,
                    string: this.render(item.original, item.string)
                };
            }).bind(this));
        } else results = this.data.map((function(d) {
            var renderedString = this.render(d);
            return {
                original: d,
                string: renderedString
            };
        }).bind(this));
        callback(results);
    };
    /**
   * For a given item in the data array, return what should be used as the candidate string
   *
   * @param {Object|String} item an item from the data array
   * @return {String} item
   */ getItemValue = function(item) {
        return item;
    };
    /**
   * For a given item in the data array, return a string of html that should be rendered in the dropdown
   * @param {Object|String} item an item from the data array
   * @param {String} sourceFormatting a string that has pre-formatted html that should be passed directly through the render function
   * @return {String} html
   */ render = function(item, sourceFormatting) {
        if (sourceFormatting) // use existing formatting on the source string
        return sourceFormatting;
        var boldString = item.original ? this.getItemValue(item.original) : this.getItemValue(item);
        var indexString = this.normalize(boldString);
        var indexOfQuery = indexString.lastIndexOf(this.query);
        while(indexOfQuery > -1){
            var endIndexOfQuery = indexOfQuery + this.query.length;
            boldString = boldString.slice(0, indexOfQuery) + "<strong>" + boldString.slice(indexOfQuery, endIndexOfQuery) + "</strong>" + boldString.slice(endIndexOfQuery);
            indexOfQuery = indexString.slice(0, indexOfQuery).lastIndexOf(this.query);
        }
        return boldString;
    };
    /**
   * Render an custom error message in the suggestions list
   * @param {String} msg An html string to render as an error message
   */ renderError = function(msg) {
        this.list.drawError(msg);
    };
}
$4459fe2e485752c1$exports = $4459fe2e485752c1$var$Suggestions;



if (typeof window !== "undefined") window.Suggestions = (0, (/*@__PURE__*/$parcel$interopDefault($4459fe2e485752c1$exports)));
var $cf838c15c8b009ba$export$2e2bcd8739ae039 = (0, (/*@__PURE__*/$parcel$interopDefault($4459fe2e485752c1$exports)));


export {$cf838c15c8b009ba$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=index.js.map
