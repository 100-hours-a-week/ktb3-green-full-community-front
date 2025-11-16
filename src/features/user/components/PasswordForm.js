import Component from "../../../core/Component.js";
import { isValidPassword } from "../../../lib/auth.js";
import CustomInput from "../../../shared/components/CustomInput.js";
import { apiFetch } from "../../../lib/api.js";

export default class PasswordForm extends Component {
   
   setup() {
      this.state = { isCompleted: false };
   }

   template() {
      const frag = document.createDocumentFragment();

      const $form = document.createElement('form');
      $form.className = 'password-edit-form';

      const $password = document.createElement('div');
      $password.className = 'password-edit-form-password';
      const $passwordCheck = document.createElement('div');
      $passwordCheck.className = 'password-edit-form-check';

      const password = new CustomInput({ $target: $password, label: '비밀번호', name: 'password', type: 'text', placeholder: '비밀번호를 입력하세요', required: true });
      const passwordCheck = new CustomInput({ $target: $passwordCheck, label: '비밀번호 확인', name: 'passwordCheck', type: 'text', placeholder: '비밀번호를 한번 더 입력하세요', required: true });

      password.render();
      passwordCheck.render();

      const $button = document.createElement('input');
      $button.className = 'form-submit-button';
      $button.type = 'submit';
      $button.value = '수정하기';
      $button.disabled = !this.state.isCompleted;

      const $complete = document.createElement('div');
      $complete.className = 'edit-complete-message';
      $complete.textContent = '수정완료';

      $form.append($password, $passwordCheck, $button, $complete);
      frag.append($form);

      this.$refs = { form: $form, password: password, passwordCheck: passwordCheck, button: $button, passwordInput: password.$refs.input, passwordCheckInput: passwordCheck.$refs.input, complete: $complete };      

      return frag;
   }

   setEvent() {
      const { form, password, passwordCheck, button, passwordInput, passwordCheckInput, complete } = this.$refs;

      passwordInput.addEventListener('input', () => {
         const input = passwordInput.value || '';
         if(!input) {
            password.setState({ isValidInput: false, errorText: '비밀번호를 입력해주세요.'});
         }
         else if (!isValidPassword(input)) {
            password.setState({ isValidInput: false, errorText: '비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.'});
         }
         else {
            password.setState({ isValidInput: true, errorText: ''});
            if(passwordCheck.state.isValidInput) {
               button.disabled = false;
               button.classList.toggle('is-active', true);
            }
         }
      });

      passwordCheckInput.addEventListener('input', () => {
         const input = passwordCheckInput.value || '';
         if (!input) {
            password.setState({ isValidInput: false, errorText: '비밀번호를 한번 더 입력해주세요.'});
         }
         else if(!(passwordInput.value === input)) {
            passwordCheck.setState({ isValidInput: false, errorText: '비밀번호와 다릅니다.' })
         } 
         else {
            passwordCheck.setState({ isValidInput: true, errorText: '' });
            if(password.state.isValidInput) {
               button.disabled = false;
               button.classList.toggle('is-active', true);
            }
         }
      });

      form.addEventListener('submit', async (e) => {
         e.preventDefault();
         
         const payload = {
            password: passwordInput.value
         }

         try {
            const response = await apiFetch('/users/password', {
               method: 'PATCH',
               body: payload,
               withAuth: true
            });

            console.log(response);
            
            complete.classList.add('is-visible');
            setTimeout(() => {
               complete.classList.remove('is-visible');
            }, 2000);
            
         } 
         catch(error) {
            password.setState({ isValidInput: false, errorText: '새 비밀번호는 기존 비밀번호와 달라야 합니다.'});
            button.disabled = true;
            button.classList.toggle('is-active', false);
         }

      });

   }

}