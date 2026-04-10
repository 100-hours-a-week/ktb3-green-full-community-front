import { apiFetch, setAuthUser, getAuthUser } from "../../../lib/api.js";
import Component from "../../../core/Component.js";
import CustomInput from "../../../shared/components/CustomInput.js";
import ImageUploader from "../../../shared/components/ImageUploader.js";
import h from "../../../core/VdomNode.js";
import { isValidNickname } from "../../../lib/validateInput.js";
import Modal from "../../../shared/components/Modal.js";

export default class ProfileForm extends Component {

   setup() {

      this.state = { isUploaded: false, isCompleted: false, isToastMessageOpen: false, isWithdrawModalOpen: false };
      this._bind = false;
      this._toastTimer = null;

      this._onSubmit = async (e) => {
         const form = e.target.closest('.profile-edit-form');
         if(!form) return;
         e.preventDefault();

         const formData = new FormData();
         formData.append('nickname', form.querySelector('.nickname-input').value);

         const file = form.querySelector('.image-input')?.files?.[0];

         if (!file) {
            console.log('프로필 이미지를 선택해주세요.');
            return;
         }

         formData.append('profileImg', file);

         try {
            const response = await apiFetch('/users/profile', {
               method: 'PATCH',
               body: formData,
               withAuth: true,
            });

            console.log(response);

            this.setState({ isToastMessageOpen: true });

            const authUser = getAuthUser();
            const updatedImg = URL.createObjectURL(file);
            setAuthUser({ userId: authUser.userId, profileImg: updatedImg });

            if (this._toastTimer) clearTimeout(this._toastTimer);
            this._toastTimer = setTimeout(() => {
               this.setState({ isToastMessageOpen: false });
               this._toastTimer = null;
            }, 2000);

         } 
         catch (error) {
            console.log(error);
         }


      }

   }

   template() {

      const { email, currentProfileImg } = this.props;

      const profileForm = h('form', { class: 'profile-edit-form' },
         h(ImageUploader, { componentName: 'image-uploader', isUploaded: true, imgUrl: currentProfileImg, text: '변경' }),
         h('div', { class: 'profile-edit-email'},
            h('div', { class: 'email-label form-label'}, '이메일'),
            h('div', { class: 'current-email'}, `${email} (수정 불가)`),
         ),
         h('div', { class: 'profile-edit-nickname' },
            h('div', { class: 'nickname-label form-label'}, '닉네임*'),
            h(CustomInput, { componentName: 'custom-input', name: 'nickname', type: 'text', placeholder: '닉네임을 입력하세요', required: true, checkValidation: isValidNickname }),
         ),
         h('button', { class: 'form-submit-button', type: 'submit'}, '수정하기'),
         h('div', { class: 'withdraw-text' }, '탈퇴하기'),
         h(Modal, { componentName: 'modal', class: 'withdraw-modal', target: 'user', message: '정말로 탈퇴 하시겠습니까?', isOpen: this.state.isWithdrawModalOpen, onCloseDone: () => this.setState({ isLogoutModalOpen: false }) }, ),
         h('div', { class: `edit-complete-message ${this.state.isToastMessageOpen ? 'is-visible' : ''}`}, '수정완료'),
      )

      return profileForm;

   }

   setEvent() {

      if(this._bind) return;
      this._bind = true;

      this.$target.querySelector('.profile-edit-form').addEventListener('submit', this._onSubmit);
      this.$target.querySelector('.withdraw-text').addEventListener('click', () => this.setState({ isWithdrawModalOpen: true }));

   }


}