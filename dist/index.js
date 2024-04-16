var $c5L0i$xtend = require("xtend");
var $c5L0i$fuzzy = require("fuzzy");

"use strict";
var $f9636d502f8281bf$exports = {};
"use strict";


var $35db4a0a75680d5b$exports = {};
"use strict";
var $35db4a0a75680d5b$var$List = function(component) {
    this.component = component;
    this.items = [];
    this.active = 0;
    this.wrapper = document.createElement("div");
    this.wrapper.className = "suggestions-wrapper";
    this.element = document.createElement("ul");
    this.element.className = "suggestions";
    this.wrapper.appendChild(this.element);
    // selectingListItem is set to true in the time between the mousedown and mouseup when clicking an item in the list
    // mousedown on a list item will cause the input to blur which normally hides the list, so this flag is used to keep
    // the list open until the mouseup
    this.selectingListItem = false;
    component.el.parentNode.insertBefore(this.wrapper, component.el.nextSibling);
    return this;
};
$35db4a0a75680d5b$var$List.prototype.show = function() {
    this.element.style.display = "block";
};
$35db4a0a75680d5b$var$List.prototype.hide = function() {
    this.element.style.display = "none";
};
$35db4a0a75680d5b$var$List.prototype.add = function(item) {
    this.items.push(item);
};
$35db4a0a75680d5b$var$List.prototype.clear = function() {
    this.items = [];
    this.active = 0;
};
$35db4a0a75680d5b$var$List.prototype.isEmpty = function() {
    return !this.items.length;
};
$35db4a0a75680d5b$var$List.prototype.isVisible = function() {
    return this.element.style.display === "block";
};
$35db4a0a75680d5b$var$List.prototype.draw = function() {
    this.element.innerHTML = "";
    if (this.items.length === 0) {
        this.hide();
        return;
    }
    for(var i = 0; i < this.items.length; i++)this.drawItem(this.items[i], this.active === i);
    this.show();
};
$35db4a0a75680d5b$var$List.prototype.drawItem = function(item, active) {
    var li = document.createElement("li"), a = document.createElement("a");
    if (active) {
        li.className += " active";
        li.setAttribute("aria-selected", "true");
    }
    a.innerHTML = item.string;
    li.appendChild(a);
    this.element.appendChild(li);
    li.addEventListener("mousedown", (function() {
        this.selectingListItem = true;
    }).bind(this));
    li.addEventListener("mouseup", (function() {
        this.handleMouseUp.call(this, item);
    }).bind(this));
};
$35db4a0a75680d5b$var$List.prototype.handleMouseUp = function(item) {
    this.selectingListItem = false;
    this.component.value(item.original);
    this.clear();
    this.draw();
};
$35db4a0a75680d5b$var$List.prototype.move = function(index) {
    this.active = index;
    this.draw();
};
$35db4a0a75680d5b$var$List.prototype.previous = function() {
    this.move(this.active === 0 ? this.items.length - 1 : this.active - 1);
};
$35db4a0a75680d5b$var$List.prototype.next = function() {
    this.move(this.active === this.items.length - 1 ? 0 : this.active + 1);
};
$35db4a0a75680d5b$var$List.prototype.drawError = function(msg) {
    var li = document.createElement("li");
    li.innerHTML = msg;
    this.element.appendChild(li);
    this.show();
};
$35db4a0a75680d5b$exports = $35db4a0a75680d5b$var$List;


var $f9636d502f8281bf$var$Suggestions = function(el, data, options) {
    options = options || {};
    this.options = $c5L0i$xtend({
        minLength: 2,
        limit: 5,
        filter: true,
        hideOnBlur: true
    }, options);
    this.el = el;
    this.data = data || [];
    this.list = new $35db4a0a75680d5b$exports(this);
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
    return this;
};
$f9636d502f8281bf$var$Suggestions.prototype.handleKeyUp = function(keyCode) {
    // 40 - DOWN
    // 38 - UP
    // 27 - ESC
    // 13 - ENTER
    // 9 - TAB
    if (keyCode === 40 || keyCode === 38 || keyCode === 27 || keyCode === 13 || keyCode === 9) return;
    this.handleInputChange(this.el.value);
};
$f9636d502f8281bf$var$Suggestions.prototype.handleKeyDown = function(e) {
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
$f9636d502f8281bf$var$Suggestions.prototype.handleBlur = function() {
    if (!this.list.selectingListItem && this.options.hideOnBlur) this.list.hide();
};
$f9636d502f8281bf$var$Suggestions.prototype.handlePaste = function(e) {
    if (e.clipboardData) this.handleInputChange(e.clipboardData.getData("Text"));
    else {
        var self = this;
        setTimeout(function() {
            self.handleInputChange(e.target.value);
        }, 100);
    }
};
$f9636d502f8281bf$var$Suggestions.prototype.handleInputChange = function(query) {
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
$f9636d502f8281bf$var$Suggestions.prototype.handleFocus = function() {
    if (!this.list.isEmpty()) this.list.show();
    this.list.selectingListItem = false;
};
/**
 * Update data previously passed
 *
 * @param {Array} revisedData
 */ $f9636d502f8281bf$var$Suggestions.prototype.update = function(revisedData) {
    this.data = revisedData;
    this.handleKeyUp();
};
/**
 * Clears data
 */ $f9636d502f8281bf$var$Suggestions.prototype.clear = function() {
    this.data = [];
    this.list.clear();
};
/**
 * Normalize the results list and input value for matching
 *
 * @param {String} value
 * @return {String}
 */ $f9636d502f8281bf$var$Suggestions.prototype.normalize = function(value) {
    value = value.toLowerCase();
    return value;
};
/**
 * Evaluates whether an array item qualifies as a match with the current query
 *
 * @param {String} candidate a possible item from the array passed
 * @param {String} query the current query
 * @return {Boolean}
 */ $f9636d502f8281bf$var$Suggestions.prototype.match = function(candidate, query) {
    return candidate.indexOf(query) > -1;
};
$f9636d502f8281bf$var$Suggestions.prototype.value = function(value) {
    this.selected = value;
    this.el.value = this.getItemValue(value);
    if (document.createEvent) {
        var e = document.createEvent("HTMLEvents");
        e.initEvent("change", true, false);
        this.el.dispatchEvent(e);
    } else this.el.fireEvent("onchange");
};
$f9636d502f8281bf$var$Suggestions.prototype.getCandidates = function(callback) {
    var options = {
        pre: "<strong>",
        post: "</strong>",
        extract: (function(d) {
            return this.getItemValue(d);
        }).bind(this)
    };
    var results;
    if (this.options.filter) {
        results = $c5L0i$fuzzy.filter(this.query, this.data, options);
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
 */ $f9636d502f8281bf$var$Suggestions.prototype.getItemValue = function(item) {
    return item;
};
/**
 * For a given item in the data array, return a string of html that should be rendered in the dropdown
 * @param {Object|String} item an item from the data array
 * @param {String} sourceFormatting a string that has pre-formatted html that should be passed directly through the render function 
 * @return {String} html
 */ $f9636d502f8281bf$var$Suggestions.prototype.render = function(item, sourceFormatting) {
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
 */ $f9636d502f8281bf$var$Suggestions.prototype.renderError = function(msg) {
    this.list.drawError(msg);
};
$f9636d502f8281bf$exports = $f9636d502f8281bf$var$Suggestions;


module.exports = $f9636d502f8281bf$exports;
if (typeof window !== "undefined") window.Suggestions = $f9636d502f8281bf$exports;


//# sourceMappingURL=index.js.map
