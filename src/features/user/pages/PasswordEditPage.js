import PasswordForm from "../components/PasswordForm.js";
import Component from "../../../core/Component.js";

export default class PasswordEditPage extends Component {

   template() {

      const frag = document.createDocumentFragment();

      const $page = document.createElement('div');
      $page.className = 'password-edit-page';

      const $title = document.createElement('div');
      $title.className = 'password-edit-title';
      $title.textContent = '비밀번호 수정'

      const $form = new PasswordForm().render();

      $page.append($title, $form);
      frag.append($page);

      return frag;

   }

}