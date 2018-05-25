import {history} from 'ufec';
// Em...
const origin = window.location.origin;

try {
  document.addEventListener('click', function(e) {
    if (e.target.getAttribute('data-type') === 'router') {
      e.preventDefault();
      history.push(e.target.href.replace(origin, ''));
    }
  });
} catch (e) {
  console.log('mock document');
}
