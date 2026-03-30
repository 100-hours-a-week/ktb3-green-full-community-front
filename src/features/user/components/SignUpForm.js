import Component from '../../../core/Component.js';
import CustomInput from '../../../shared/components/CustomInput.js';
import ImageUploader from '../../../shared/components/ImageUploader.js';
import { isValidEmail, isValidPassword } from '../../../lib/auth.js';
import { apiFetch } from '../../../lib/api.js';

export default class SignUpForm extends Component {
   
   setup() {
      this.state = { isCompleted: false };
   }

   template() {

      const frag = document.createDocumentFragment();

      const $form = document.createElement('form');
      $form.className = 'signup-form';

      const $image = document.createElement('div');
      $image.className = 'signup-image';
      const image = new ImageUploader({ $target: $image });
      image.setState({ isUploaded: false, imageUrl: '', text: '업로드' });

      const $emailLabel = document.createElement('div');
      $emailLabel.className = 'email-label form-input-label';
      $emailLabel.textContent = '이메일*';
      const $passwordLabel = document.createElement('div');
      $passwordLabel.className = 'password-label form-input-label';
      $passwordLabel.textContent = '비밀번호*';
      const $checkLabel = document.createElement('div');
      $checkLabel.className = 'check-label form-input-label';
      $checkLabel.textContent = '비밀번호 확인*';
      const $nicknameLabel = document.createElement('div');
      $nicknameLabel.className = 'nickname-label form-input-label';
      $nicknameLabel.textContent = '닉네임*';

      const $email = document.createElement('div');
      $email.className = 'signup-form-email input';
      const $password = document.createElement('div');
      $password.className = 'signup-form-password input';
      const $passwordCheck = document.createElement('div');
      $passwordCheck.className = 'signup-form-password-check input';
      const $nickname = document.createElement('div');
      $nickname.className = 'signup-from-nickname input';

      const email = new CustomInput({ $target: $email, label: '이메일*', name: 'email', type: 'email', required: true});
      const password = new CustomInput({ $target: $password, label: '비밀번호*', name: 'password', type: 'password', required: true });
      const passwordCheck = new CustomInput({ $target: $passwordCheck, label: '비밀번호 확인*', name: 'passwordCheck', type: 'password', required: true });
      const nickname = new CustomInput({ $target: $nickname, label: '닉네임*', name: 'nickname', type: 'text', required: true });

      email.render();
      password.render();
      passwordCheck.render();
      nickname.render();

      const $button = document.createElement('input');
      $button.className = 'form-submit-button';
      $button.type = 'submit';
      $button.text = '수정하기';
      $button.disabled = !this.state.isCompleted;

      $form.append($image, $emailLabel, $email, $passwordLabel, $password, $checkLabel, $passwordCheck, $nicknameLabel, $nickname, $button);
      frag.append($form);

      this.$refs = { form: $form, email: email, password: password, passwordCheck: passwordCheck, nickname: nickname, button: $button, 
         emailInput: email.$refs.input, passwordInput: password.$refs.input, passwordCheckInput: passwordCheck.$refs.input, nicknameInput: nickname.$refs.input, imageInput: image.$refs.input };      

      return frag;
   }

   setEvent() {
      const { form, email, password, passwordCheck, nickname, button, 
         emailInput, passwordInput, passwordCheckInput, nicknameInput, imageInput } = this.$refs;
   
      emailInput.addEventListener('input', () => {
         const input = emailInput.value || '';
         if(!input) {
            email.setState({ isValidInput: false, errorText: '*이메일을 입력해주세요.'});
            console.log('이메일을 입력해주세요.');
         }
         else if(!isValidEmail(input)) {
            email.setState({ isValidInput: false, errorText: '*올바른 이메일 주소 형식을 입력해주세요.'})
            console.log('이메일 형식을 확인해주세요.');
         }
         else {
            email.setState({ isValidInput: true, errorText: ''});
            if(email.state.isValidInput && passwordCheck.state.isValidInput && nickname.state.isValidInput) {
               button.disabled = false;
               button.classList.toggle('is-active', true);
            }
         }
      });
      
      passwordInput.addEventListener('input', () => {
         const input = passwordInput.value || '';
         if(!input) {
            password.setState({ isValidInput: false, errorText: '*비밀번호를 입력해주세요.'});
            console.log('비밀번호를 입력해주세요.');
         }
         else if (!isValidPassword(input)) {
            password.setState({ isValidInput: false, errorText: '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.'});
            console.log('비밀번호 유효성 검사 실패');
         }
         else {
            password.setState({ isValidInput: true, errorText: ''});
         }
      });

      passwordCheckInput.addEventListener('input', () => {
         const input = passwordCheckInput.value || '';
         if(!(passwordInput.value === input)) {
            passwordCheck.setState({ isValidInput: false, errorText: '*비밀번호와 다릅니다.' })
         } else {
            passwordCheck.setState({ isValidInput: true, errorText: '' });
            if(email.state.isValidInput && password.state.isValidInput && nickname.state.isValidInput) {
               button.disabled = false;
               button.classList.toggle('is-active', true);
            }
         }
      });
   
      nicknameInput.addEventListener('input', () => {
         const input = nicknameInput.value || '';
         if(!input) {
            nickname.setState({ isValidInput: false, errorText: '*닉네임을 입력해주세요.' });
         }
         else if(input.length > 10) {
            nickname.setState({ isValidInput: false, errorText: '*닉네임은 최대 10자까지 입력 가능합니다.' });
         }
         else if(/\s/.test(input)) {
            nickname.setState({ isValidInput: false, errorText: '*띄어쓰기를 없애주세요.' });
         }
         else {
            nickname.setState({ isValidInput: true, errorText: '' });
            if(email.state.isValidInput && passwordCheck.state.isValidInput && nickname.state.isValidInput) {
               button.disabled = false;
               button.classList.toggle('is-active', true);
            }
         }
      });

      form.addEventListener('submit', async(e) => {
         e.preventDefault();

         const formData = new FormData();

         formData.append('email', emailInput.value);
         formData.append('password', passwordInput.value);
         formData.append('checkPassword', passwordCheckInput.value);
         formData.append('nickname', nicknameInput.value);

         const file = imageInput?.files?.[0];

         if (!file) {
            console.log('프로필 이미지를 선택해주세요.');
            return;
         }

         formData.append('profileImg', file);
         
         try {
            const response = await apiFetch('/users/new', {
               method: 'POST',
               body: formData,
               withAuth: false
            });

            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
         } 
         catch(error) {
            console.log(error);
            const errorCode = error.payload.code;
            if(errorCode === 'DUPLICATED_USER') {
               email.setState({ isValidInput: false, errorText: '*중복된 이메일입니다.'});
            }
            if(errorCode === 'DUPLICATED_NICKNAME') {
               nickname.setState({ isValidInput: false, errorText: '*중복된 닉네임입니다.' });
            }
            button.disabled = true;
            button.classList.toggle('is-active', false);
         }

      });

   }

}