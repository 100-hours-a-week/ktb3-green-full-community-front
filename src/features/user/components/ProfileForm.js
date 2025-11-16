import { apiFetch } from "../../../lib/api.js";
import Component from "../../../core/Component.js";
import CustomInput from "../../../shared/components/CustomInput.js";
import { isValidNickname } from "../../../lib/auth.js";
import ImageUploader from "../../../shared/components/ImageUploader.js";
import Withdraw from "./Withdraw.js";

export default class ProfileForm extends Component {

   setup() {
      this.state = { isUploaded: false, isCompleted: false }
   }

   template() {

      const { email, currentProfileImg } = this.props;

      const frag = document.createDocumentFragment();

      const $form = document.createElement('form');
      $form.className = 'profile-edit-form';

      const $image = document.createElement('div');
      $image.className = 'profile-image';
      const image = new ImageUploader({ $target: $image });
      image.setState({ isUploaded: true, imgUrl: currentProfileImg, text: '변경'});

      const $emailWrapper = document.createElement('div');
      $emailWrapper.className = 'profile-edit-email';

      const $emailLabel = document.createElement('div');
      $emailLabel.className = 'label-email';
      $emailLabel.textContent = '이메일';
      const $email = document.createElement('div');
      $email.className = 'current-email';
      $email.textContent = email;

      $emailWrapper.append($emailLabel, $email);

      const $nickname = document.createElement('div');
      $nickname.className = 'profile-edit-nickname';

      const nickname = new CustomInput({ $target: $nickname, label: '닉네임', name: 'nickname', type: 'text', placeholder: '닉네임을 입력하세요', required: false });
      nickname.render();

      const $button = document.createElement('input');
      $button.className = 'form-submit-button';
      $button.type = 'submit';
      $button.value = '수정하기';

      const $withdraw = document.createElement('div');
      $withdraw.className = 'withdraw-button';
      
      const withdraw = new Withdraw({ $target: $withdraw });
      withdraw.render();

      const $complete = document.createElement('div');
      $complete.className = 'edit-complete-message';
      $complete.textContent = '수정완료';

      $form.append($image, $emailWrapper, $nickname, $button, $withdraw, $complete);
      frag.append($form);

      this.$refs = { form: $form, nickname: nickname, button: $button, nicknameInput: nickname.$refs.input, complete: $complete };      

      return frag;
   }

   setEvent() {
      const { form, nickname, button, nicknameInput, complete } = this.$refs;
      const { currentNickname } = this.props;

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
         else if (input === currentNickname) {
            nickname.setState({ isValidInput: false, errorText: '*중복된 닉네임입니다.' });
         }
         else {
            nickname.setState({ isValidInput: true, errorText: '' });
            button.disabled = false;
            button.classList.toggle('is-active', true);
         }
      });

      form.addEventListener('submit', async (e) => {
         e.preventDefault();

         const payload = {
            nickname: nicknameInput.value
            //profileImg: 추후 수정 필요!
         }

         try {
            const response = await apiFetch('/users/profile', {
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
         catch (error) {
            console.log(error);
         }

      })
   }


}