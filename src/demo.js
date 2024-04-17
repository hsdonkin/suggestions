import Suggestions from './suggestions';

var inputSimple = document.querySelector('.js-simple-example');
var inputOptions = document.querySelector('.js-example-with-options');
var inputNoFiltering = document.querySelector('.js-no-filtering-example');
var inputCustomRender = document.querySelector('.js-custom-render-example');

var simpleData = [
  'Roy Eldridge',
  'Roy Hargrove',
  'Tim Hagans',
  'Tom Harrell',
  'Freddie Hubbard',
  'Nicholas Payton',
  'Miles Davis',
  'Dizzy Gillespie',
  'Rex Stewart',
];

var objectData = [
  {
    name: 'Roy Eldridge',
    year: 1911,
  },
  {
    name: 'Roy Hargrove',
    year: 1969,
  },
  {
    name: 'Tim Hagans',
    year: 1954,
  },
  {
    name: 'Tom Harrell',
    year: 1946,
  },
  {
    name: 'Freddie Hubbard',
    year: 1938,
  },
  {
    name: 'Nicholas Payton',
    year: 1973,
  },
  {
    name: 'Miles Davis',
    year: 1926,
  },
  {
    name: 'Dizzy Gillespie',
    year: 1917,
  },
  {
    name: 'Rex Stewart',
    year: 1907,
  },
];

new Suggestions(inputSimple, simpleData);
new Suggestions(inputNoFiltering, simpleData, { filter: false });
var typeahead = new Suggestions(inputOptions, objectData, {
  minLength: 3, // Number of characters typed into an input to trigger suggestions.
  limit: 3, //  Max number of results to display.
  hideOnBlur: false, // Don't hide results when input loses focus
});

typeahead.getItemValue = function (item) {
  return item.name;
};

inputOptions.addEventListener('change', function () {
  console.log(typeahead.selected); // Current selected item.
});

var customRenderSuggestion = new Suggestions(inputCustomRender, objectData, {
  render: function (item) {
    return `<div><b>${item.name}</b> <i>(${item.year})</i></div>`;
  },
  getItemValue: function (item) {
    return item.name;
  },
});
