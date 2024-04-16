import * as Suggestions from './Suggestions';
import * as List from './list';

if (typeof window !== 'undefined') {
  window.Suggestions = Suggestions;
}

export { Suggestions, List };
