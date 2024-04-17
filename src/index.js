import Suggestions from './suggestions';
import List from './list';
import './suggestions.css';

if (typeof window !== 'undefined') {
  window.Suggestions = Suggestions;
}

export default Suggestions;
