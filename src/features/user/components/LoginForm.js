import Component from '../../../core/Component.js';
import { createInputWrapper } from '../../../shared/components/formInput.js';
import { apiFetch, setAccessToken, setRefreshToken, setAuthUser } from '../../../lib/api.js';
import CustomInput from '../../../shared/components/CustomInput.js';
import { isValidEmail, isValidPassword } from '../../../lib/auth.js';

export default class LoginForm extends Component {
   
   setup() {
      this.state = { isCompleted: false };
   }

   template() {

      const frag = document.createDocumentFragment();

      const $form = document.createElement('form');
      $form.className = 'login-form';

      const $email = document.createElement('div');
      $email.className = 'login-form-email';
      const $password = document.createElement('div');
      $password.className = 'login-form-password';

      const email = new CustomInput({ $target: $email, label: '이메일', name: 'email', type: 'email', placeholder: '이메일을 입력하세요.',required: true });
      const password = new CustomInput({ $target: $password, label: '비밀번호', name: 'password', type: 'password', placeholder: '비밀번호를 입력하세요', required: true });

      email.render();
      password.render();

      const $submit = document.createElement('button');
      $submit.className = 'form-submit-button';
      $submit.type = 'submit';
      $submit.textContent = '로그인'
      $submit.disabled = !this.state.isCompleted;

      $form.append($email, $password, $submit);
      frag.appendChild($form);

      this.$refs = { form: $form, email: email, password: password, submit: $submit, emailInput: email.$refs.input, passwordInput: password.$refs.input };

      return frag;
   }

   setEvent() {
      const { form, email, password, submit, emailInput, passwordInput } = this.$refs;

      emailInput.addEventListener('input', () => {
         const input = emailInput.value || '';
         if (!input || !isValidEmail(input)) {
            email.setState({ isValidInput: false, errorText: '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)'});
            console.log('*올바른 이메일 주소 형식을 입력해주세요.');
            submit.disabled = true;
            submit.classList.toggle('is-active', false);
         }
         else {
            email.setState({ isValidInput: true, errorText: ''});
            if(password.state.isValidInput) {
               submit.disabled = false;
               submit.classList.toggle('is-active', true);
            }
         }
      });

      passwordInput.addEventListener('input', () => {
         const input = passwordInput.value || '';
         if(!input) {
            password.setState({ isValidInput: false, errorText: '*비밀번호를 입력해주세요.'});
            submit.disabled = true;
            submit.classList.toggle('is-active', false);
         }
         else if(!isValidPassword(input)) {
            password.setState({ isValidInput: false, errorText: '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.'});
            submit.disabled = true;
            submit.classList.toggle('is-active', false);
         }
         else {
            password.setState({ isValidInput: true, errorText: ''});
            if(email.state.isValidInput) {
               submit.disabled = false;
               submit.classList.toggle('is-active', true);
            }
         }
      });

      form.addEventListener('submit', async(e) => {
         e.preventDefault();

         const payload = {
            email: emailInput.value,
            password: passwordInput.value,      
         };

         try {
            const response = await apiFetch('/auth/token', {
               method: 'POST',
               body: payload,
               withAuth: false
            });

            //추후 이미지 처리 시 구현 필요 
            const profileImg = response.data.userId === 53 ? '/img/profile_img_dog.JPG' : '/img/profile_img_ms.JPG';

            setAccessToken(response.data.accessToken);
            setRefreshToken(response.data.refreshToken);
            setAuthUser({ userId: response.data.userId, profileImg: profileImg });

            window.history.pushState({}, '', '/posts');
            window.dispatchEvent(new PopStateEvent('popstate'));
         } 
         catch (error) {
            if(error.status === 401 || error.status === 404) {
               password.setState({ isValidInput: false, errorText: '*아이디 또는 비밀번호를 확인해주세요'});
            }
         }
      })
   }
}