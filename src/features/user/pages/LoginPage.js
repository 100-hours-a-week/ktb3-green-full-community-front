import Component from '../../../core/Component.js';
import LoginForm from '../components/LoginForm.js';

export default class LoginPage extends Component {

   template() {

      const frag = document.createDocumentFragment();

      const $page = document.createElement('div');
      $page.className = 'login-page';

      const $title = document.createElement('div');
      $title.className = 'login-title';
      $title.textContent = '로그인';

      const $formWrapper = document.createElement('div');
      $formWrapper.className = 'login-form-wrapper';

      new LoginForm({ $target: $formWrapper }).render();

      const $signUp = document.createElement('div');
      $signUp.className = 'signup-button';
      $signUp.textContent = '회원가입';
      $signUp.setAttribute('data-route', '/users/new');

      $page.append($title, $formWrapper, $signUp);
      frag.appendChild($page);

      return frag;

   }
}