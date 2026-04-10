import Component from '../../../core/Component.js';
import CustomInput from '../../../shared/components/CustomInput.js';
import ImageUploader from '../../../shared/components/ImageUploader.js';
import { isValidEmail, isValidNickname, isValidPassword } from '../../../lib/validateInput.js';
import { apiFetch } from '../../../lib/api.js';
import h from '../../../core/VdomNode.js';
import { getRouter } from '../../../router/Router.js';

export default class SignUpForm extends Component {
   
   setup() {

      this.state = { isCompleted: false };
      this._router = getRouter();
      this._bind = false;

      this._onSubmit = async (e) => {
         const form = e.target.closest('.signup-form');
         if(!form) return;
         e.preventDefault();

         const formData = new FormData();

         formData.append('email', form.querySelector('.email-input').value);
         formData.append('password', form.querySelector('.password-input').value);
         formData.append('checkPassword', form.querySelector('.password-check-input').value);
         formData.append('nickname', form.querySelector('.nickname-input').value);

         const file = form.querySelector('.image-input')?.files?.[0];

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

            console.log(response);
            this._router.navigate('/');
            
         } 
         catch(error) {
            console.log(error);
            // const errorCode = error.payload.code;
            // if(errorCode === 'DUPLICATED_USER') {
            //    email.setState({ isValidInput: false, errorText: '*중복된 이메일입니다.'});
            // }
            // if(errorCode === 'DUPLICATED_NICKNAME') {
            //    nickname.setState({ isValidInput: false, errorText: '*중복된 닉네임입니다.' });
            // }
            // button.disabled = true;
            // button.classList.toggle('is-active', false);
         }

      }

   }

   template() {

      const signupForm = h('form', { class: 'signup-form' },
         h('div', { class: 'signup-image' },
            h(ImageUploader, { componentName: 'image-uploader', isUploaded: false }),
         ),
         h('div', { class: 'email-label form-input-label' }, '이메일*'),
         h(CustomInput, { componentName: 'custom-input', name: 'email', type: 'email', placeholder: '이메일을 입력하세요.', required: true, checkValidation: isValidEmail }), 
         h('div', { class: 'password-label form-input-label'}, '비밀번호*'),
         h(CustomInput, { componentName: 'custom-input', name: 'password', type: 'password', placeholder: '비밀번호를 입력하세요', required: true, checkValidation: isValidPassword }),
         h('div', { class: 'check-label form-input-label'}, '비밀번호 확인*'),
         h(CustomInput, { componentName: 'custom-input', name: 'password-check', type: 'password', placeholder: '비밀번호를 한 번 더 입력하세요', required: true, checkValidation: isValidPassword }),
         h('div', { class: 'nickname-label form-input-label'}, '닉네임*'),
         h(CustomInput, { componentName: 'custom-input', name: 'nickname', type: 'text', placeholder: '닉네임을 입력하세요', required: true, checkValidation: isValidNickname }),
         h('button', { class: 'form-submit-button', type: 'submit' }, '가입하기'),
      );

      return signupForm;

   }

   setEvent() {
     
      if(this._bind) return;
      this._bind = true;

      this.$target.querySelector('.signup-form').addEventListener('submit', this._onSubmit);

   }

}