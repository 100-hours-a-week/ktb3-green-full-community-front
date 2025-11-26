import Component from '../../../core/Component.js';
import SignUpForm from '../components/SignUpForm.js';
import Slogan from '../components/Slogan.js';

export default class SignUpPage extends Component {

   template() {

      const frag = document.createDocumentFragment();

      const $page = document.createElement('div');
      $page.className = 'signup-page';

      const $slogan = document.createElement('div');
      $slogan.className = 'signup-slogan';
      new Slogan({ $target: $slogan }).render();

      const $formWrapper = document.createElement('div');
      $formWrapper.className = 'signup-form-wrapper';

      new SignUpForm({ $target: $formWrapper }).render();
      
      $page.append($slogan, $formWrapper);
      frag.append($page);
      return frag;
   }
}