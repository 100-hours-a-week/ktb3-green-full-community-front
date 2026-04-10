import Component from '../../../core/Component.js';
import { apiFetch, setAccessToken, setRefreshToken, setAuthUser } from '../../../lib/api.js';
import CustomInput from '../../../shared/components/CustomInput.js';
import { isValidEmail, isValidPassword } from '../../../lib/validateInput.js';
import h from '../../../core/VdomNode.js';
import { getRouter } from '../../../router/Router.js';

export default class LoginForm extends Component {
   
   setup() {

      this.state = { isCompleted: false, isChecked: false };

      this._bound = false;
      
      this._onToggle = (e) => {
         const icon = e.target.closest('.login-memory-icon');
         if(!icon) return;

         this.setState({ isChecked: !this.state.isChecked });
      }

   }

   template() {

      const loginForm = h('form', { class: 'login-form' },
         h(CustomInput, { componentName: 'custom-input', label: '이메일', name: 'email', type: 'email', placeholder: '이메일을 입력하세요.', required: true, checkValidation: isValidEmail }), 
         h(CustomInput, { componentName: 'custom-input', label: '비밀번호', name: 'password', type: 'password', placeholder: '비밀번호를 입력하세요', required: true, checkValidation: isValidPassword }),
         h('div', { class: 'login-memory-id'},
            h('i', { class: `${this.state.isChecked ? 'fa-solid' : 'fa-regular' } fa-square-check login-memory-icon`}, ''),
            h('div', { class: 'login-memory-id-text'}, '아이디 저장')
         ),
         h('button', { class: 'form-submit-button', type: 'submit' }, '로그인')
      );

      return loginForm;

   }

   setEvent() {

      if(this._bound) return;
      this._bound = true;

      this.$target.querySelector('.login-memory-icon').addEventListener('click', this._onToggle);
      this.$target.querySelector('.login-form').addEventListener('submit', async(e) => {
         
         e.preventDefault();

         const form = e.currentTarget;
         const emailInputValue = form.querySelector('.email-input').value;
         const passwordInputValue = form.querySelector('.password-input').value;

         const payload = {
            email: emailInputValue,
            password: passwordInputValue,      
         };

         try {
            const response = await apiFetch('/auth/token', {
               method: 'POST',
               body: payload,
               withAuth: false
            });

            setAccessToken(response.data.accessToken);
            setRefreshToken(response.data.refreshToken);
            setAuthUser({ userId: response.data.userId, profileImg: response.data.profileImg });
            
            console.log(response);

            getRouter().navigate('/posts');
         } 
         catch (error) {
            if(error.status === 401 || error.status === 404) {
               console.log('비번 틀리심여~'); //수정 필요
            }
         }

      });


   }
}