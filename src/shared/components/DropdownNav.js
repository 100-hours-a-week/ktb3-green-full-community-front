import Component from "../../core/Component.js";

export default class DropDownNav extends Component {

   setup() {
      this.state = { hidden: true };
   }

   template() {

      const frag = document.createDocumentFragment();

      const $wrapper = document.createElement('div');
      $wrapper.className = 'drop-nav-wrapper';
      $wrapper.hidden = this.state.hidden;

      const $nav = document.createElement('ul');

      const $profile = document.createElement('li');
      $profile.className = 'go-profile-edit';
      $profile.textContent = '회원정보수정';

      const $password = document.createElement('li');
      $password.className = 'go-password-edit';
      $password.textContent = '비밀번호수정';

      const $logout = document.createElement('li');
      $logout.className = 'go-logout';
      $logout.textContent = '로그아웃';

      $nav.append($profile, $password, $logout);
      $wrapper.append($nav);
      
      frag.append($wrapper);

      this.$refs = { profileEdit: $profile, passwordEdit: $password, logout: $logout };

      return frag;
   }

   toggle() {  
      this.setState({ hidden: !this.state.hidden });
   }

   setEvent() {
      const { profileEdit, passwordEdit, logout } = this.$refs;

      profileEdit.addEventListener('click', (e) => {
         window.history.pushState({}, '', '/users/profile/edit');
         window.dispatchEvent(new PopStateEvent('popstate'));
      });

      passwordEdit.addEventListener('click', (e) => {
         window.history.pushState({}, '', '/users/password/edit');
         window.dispatchEvent(new PopStateEvent('popstate'));
      });

      logout.addEventListener('click', (e) => {
         window.history.pushState({}, '', '/');
         window.dispatchEvent(new PopStateEvent('popstate'));
      });



   }
}