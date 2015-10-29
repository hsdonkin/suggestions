'use strict';

var test = require('tape');
var suggestions = require('../');

test('basics', function(t) {
  var parent = document.createElement('div');
  var input = document.createElement('input');
  parent.appendChild(input);

  var data = ['bear', 'bearing', 'bar', 'ball'];
  var typeahead = suggestions(input, data);

  var suggestionsContainer = parent.querySelector('ul');

  t.ok(suggestionsContainer, 'suggestions container exists');
  t.equal(suggestionsContainer.style.display, 'none', 'suggestions container is initially hidden');
  t.equal(typeahead.data, data, 'data is set');

  input.value = 'bear';

  var keyUpEvent = document.createEvent('HTMLEvents');
  keyUpEvent.initEvent('keyup', true, false);

  var focusEvent = document.createEvent('HTMLEvents');
  focusEvent.initEvent('focus', true, false);

  input.dispatchEvent(keyUpEvent);
  input.dispatchEvent(focusEvent);

  t.equal(suggestionsContainer.style.display, 'block', 'suggestions container is displayed');

  var suggestionList = suggestionsContainer.querySelectorAll('li');
  var suggestionResults = [];
  Array.prototype.forEach.call(suggestionList, function(el){
    suggestionResults.push(el.textContent);
  });

  t.deepEqual(suggestionResults, ['bear', 'bearing'], 'populate a correct results');

  var blurEvent = document.createEvent('HTMLEvents');
  blurEvent.initEvent('blur', true, false);
  input.dispatchEvent(blurEvent);

  t.equal(suggestionsContainer.style.display, 'none', 'suggestions container hidden on blur');

  // Results are still present on focus
  input.dispatchEvent(focusEvent);
  t.ok(suggestionsContainer.querySelectorAll('li').length, 'results still present on focus');
  t.equal(suggestionList[0].classList.contains('active'), true, 'first item is active');

  // TODO test results hightlighting when keyboard events
  // emit up/down keystrokes.

  // TODO test that enter adds the result to the input containar
  t.end();
});

test('options', function(t) {
  var parent = document.createElement('div');
  var input = document.createElement('input');
  parent.appendChild(input);

  var data = ['bear', 'bearing', 'bar', 'ball'];
  suggestions(input, data, {
    minLength: 3,
    limit: 1
  });

  var suggestionsContainer = parent.querySelector('ul');

  var keyUpEvent = document.createEvent('HTMLEvents');
  keyUpEvent.initEvent('keyup', true, false);

  var focusEvent = document.createEvent('HTMLEvents');
  focusEvent.initEvent('focus', true, false);

  input.value = 'be';
  input.dispatchEvent(keyUpEvent);
  input.dispatchEvent(focusEvent);
  t.equal(suggestionsContainer.style.display, 'none', 'options.minLength passed by not populating a result');

  input.value = 'bea';
  input.dispatchEvent(keyUpEvent);
  input.dispatchEvent(focusEvent);
  t.equal(suggestionsContainer.style.display, 'block', 'options.minLength passed by populating results after 3 chars');

  t.equal(suggestionsContainer.querySelectorAll('li').length, 1, 'options.limit passed');
  t.end();
});

test('Suggestion.getItemValue', function(t) {
  var parent = document.createElement('div');
  var input = document.createElement('input');
  parent.appendChild(input);

  var data = [{
    name: 'bear',
    id: 0
  }, {
    name: 'bearing',
    id: 1
  }, {
    name: 'bar',
    id: 2
  }, {
    name: 'ball',
    id: 3
  }];

  var typeahead = suggestions(input, data);
  typeahead.getItemValue = function(item) { return item.name; };

  var keyUpEvent = document.createEvent('HTMLEvents');
  keyUpEvent.initEvent('keyup', true, false);

  var focusEvent = document.createEvent('HTMLEvents');
  focusEvent.initEvent('focus', true, false);

  input.value = 'bear';
  input.dispatchEvent(keyUpEvent);
  input.dispatchEvent(focusEvent);

  t.ok(parent.querySelectorAll('ul li').length, 'results populated when an object of arrays were passed');

  // TODO test that after enter, suggestions.selected works.
  t.end();
});

// close the smokestack window once tests are complete
test('shutdown', function(t) {
  t.end();
  setTimeout(function() {
    window.close();
  });
});