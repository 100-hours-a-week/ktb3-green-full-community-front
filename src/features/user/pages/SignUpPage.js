import Component from '../../../core/Component.js';
import SignUpForm from '../components/SignUpForm.js';

export default class SignUpPage extends Component {

   template() {

      const frag = document.createDocumentFragment();

      const $page = document.createElement('div');
      $page.className = 'signup-page';

      const $title = document.createElement('div');
      $title.className = 'signup-title';
      $title.textContent = '회원가입';

      const $formWrapper = document.createElement('div');
      $formWrapper.className = 'signup-form-wrapper';

      new SignUpForm({ $target: $formWrapper }).render();

      const $login = document.createElement('div');
      $login.className = 'login-button';
      $login.textContent = '로그인하러 가기';
      $login.setAttribute('data-route', '/');
      
      $page.append($title, $formWrapper, $login);
      frag.append($page);
      return frag;
   }
}