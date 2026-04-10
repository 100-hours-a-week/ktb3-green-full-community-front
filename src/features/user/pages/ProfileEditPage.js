import { apiFetch, getAccessToken, getAuthUser } from "../../../lib/api.js";
import ProfileForm from "../components/ProfileForm.js";
import Component from "../../../core/Component.js";
import h from "../../../core/VdomNode.js";

export default class ProfileEditPage extends Component {

   setup() {
      this.state = { profileEditFromProps: {} };
   }

   template() {

      const profileEditPage = h('div', { class: 'profile-edit-page' },
         h('div', { class: 'profile-edit-title' }, '회원정보수정'),
         h(ProfileForm, { componentName: 'profile-form', ...this.state.profileEditFormProps }),
      );

      return profileEditPage;

   }

   async afterMount() {

      try {
         const response = await apiFetch('/users/profile', {
            method: 'GET',
            withAuth: true,
         })

         console.log('사용자 정보 조회:', response);

         const userProfile = response.data;

         const profileEditFormProps = {
            email: userProfile.email,
            currentNickname: userProfile.nickname,
            currentProfileImg: getAuthUser().profileImg ?? null,
         }

         this.setState({ profileEditFormProps: profileEditFormProps });

         // const profileForm = new ProfileForm(profileEditFormProps);
         // profileForm.setState({ isUploaded: true, isCompleted: false });

      }
      catch(error) {
         console.log(error);
      }

   }



}