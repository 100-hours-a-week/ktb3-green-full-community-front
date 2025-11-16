import { apiFetch } from "../../../lib/api.js";
import ProfileForm from "../components/ProfileForm.js";
import Component from "../../../core/Component.js";

export default class ProfileEditPage extends Component {

   template() {

      const frag = document.createDocumentFragment();

      const $page = document.createElement('div');
      $page.className = 'profile-edit-page';

      const $title = document.createElement('div');
      $title.className = 'profile-edit-title';
      $title.textContent = '회원정보수정'

      const $form = document.createElement('div');
      $form.className = 'profile-edit-form';

      $page.append($title, $form);
      frag.append($page);

      this.$refs = { form: $form };

      return frag;
   }

   async afterMount() {

      const { form } = this.$refs;

      try {
         const response = await apiFetch('/users/profile', {
            method: 'GET',
            withAuth: true,
         })

         console.log(response);

         const userProfile = response.data;

         const profileEditFormProps = {
            $target: form,
            email: userProfile.email,
            currentNickname: userProfile.nickname,
            currentProfileImg: '/img/profile_img_ham.JPG', //추후 수정 필요
         }

         const profileForm = new ProfileForm(profileEditFormProps);
         profileForm.setState({ isUploaded: true, isCompleted: false });

      }
      catch(error) {
         console.log(error);
      }
   }



}