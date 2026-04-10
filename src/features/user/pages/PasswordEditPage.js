import PasswordForm from "../components/PasswordForm.js";
import Component from "../../../core/Component.js";
import h from "../../../core/VdomNode.js";

export default class PasswordEditPage extends Component {

   template() {

      const passwordEditPage = h('div', { class: 'password-edit-page' },
         h('div', { class: 'password-edit-title' }, '비밀번호 수정'),
         h(PasswordForm, { componentName: 'password-form' }),
      );

      return passwordEditPage;

   }

}