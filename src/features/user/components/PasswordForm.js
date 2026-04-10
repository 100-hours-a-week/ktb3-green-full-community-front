import Component from "../../../core/Component.js";
import { isValidPassword } from "../../../lib/validateInput.js";
import CustomInput from "../../../shared/components/CustomInput.js";
import { apiFetch } from "../../../lib/api.js";
import h from "../../../core/VdomNode.js";

export default class PasswordForm extends Component {
   
   setup() {

      this.state = { isCompleted: false, isToastMessageOpen: false };
      this._bind = false;
      this._toastTimer = null;

      this._onSubmit = async (e) => {
         const form = e.target.closest('.password-edit-form');
         if(!form) return;
         e.preventDefault();

         const newPassword = form.querySelector('.password-input').value;
         const passwordCheck = form.querySelector('.password-check-input').value;
         if(newPassword !== passwordCheck) {
            console.log('비밀번호가 다름');
            return;
         }

         const payload = {
            password: form.querySelector('.password-input').value
         }

         try {
            const response = await apiFetch('/users/password', {
               method: 'PATCH',
               body: payload,
               withAuth: true
            });

            console.log(response);
            
            this.setState({ isToastMessageOpen: true });

            if (this._toastTimer) clearTimeout(this._toastTimer);
            this._toastTimer = setTimeout(() => {
               this.setState({ isToastMessageOpen: false });
               this._toastTimer = null;
            }, 2000);
            
         } 
         catch(error) {
            //동일한 비밀번호로 수정하는 경우
            console.log('동일한 비밀번호로는 수정이 불가합니다!');
            // password.setState({ isValidInput: false, errorText: '새 비밀번호는 기존 비밀번호와 달라야 합니다.'});
            // button.disabled = true;
            // button.classList.toggle('is-active', false);
         }



      }

   }

   template() {

      const passwordForm = h('form', { class: 'password-edit-form' },
         h('div', { class: 'password-edit-label form-input-label' }, '비밀번호*'),
         h(CustomInput, { componentName: 'custom-input', placeholder: '새로운 비밀번호를 입력하세요.', name: 'password', type: 'password', required: true, checkValidation: isValidPassword }),
         h('div', { class: 'password-check-label form-input-label' }, '비밀번호 확인*'),
         h(CustomInput, { componentName: 'custom-input', placeholder: '확인을 위해 비밀번호를 한번 더 입력해주세요.', name: 'password-check', type: 'password', required: true, checkValidation: isValidPassword }),
         h('button', { class: 'form-submit-button', type: 'submit' }, '수정하기'),
         h('div', { class: `edit-complete-message ${this.state.isToastMessageOpen ? 'is-visible' : ''}` }, '수정완료'),
      );

      return passwordForm;

   }

   setEvent() {

      if(this._bind) return;
      this._bind = true;

      this.$target.querySelector('.password-edit-form').addEventListener('submit', this._onSubmit);

   }

}