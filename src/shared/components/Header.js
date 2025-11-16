import Component from '../../core/Component.js';
import DropDownNav from './DropdownNav.js';

export default class Header extends Component {

   setup() {
      this.state = { 
         isLoggedIn: true,
         isBack: false,
         profileImg: null,
      };
   }

   template() {
      const frag = document.createDocumentFragment();
      const { isLoggedIn, isBack } = this.state;

      const $header = document.createElement('header');
      $header.className = 'header';

      const $back = document.createElement('div');
      $back.className = 'header-back';
      const $title = document.createElement('div');
      $title.className = 'header-title';
      $title.textContent = '아무 말 대잔치';
      const $profile = document.createElement('div');
      $profile.className = 'header-profile';

      if(isLoggedIn) {
         const $profileImg = document.createElement('img');
         $profileImg.className = 'header-profile-img';
         $profileImg.src = isLoggedIn ? "../../img/profile_img_ham.JPG" : ''; //추후 구현 필요
         $profile.appendChild($profileImg);
      }
      if (isBack) {
         const $backArrow = document.createElement('i');
         $backArrow.className = 'fa-solid fa-chevron-left'
         $back.appendChild($backArrow);
      }

      const $dropdown = document.createElement('div');
      $dropdown.className = 'dropdown-nav';
      const dropdown = new DropDownNav({ $target: $dropdown });
      dropdown.render();

      $profile.appendChild($dropdown);
      $header.append($back, $title, $profile);

      frag.appendChild($header);

      this.$refs = { title: $title, back: $back, profile: $profile, dropdown: dropdown };

      return frag;
   }

   setEvent() {

      const { title, back, profile, dropdown } = this.$refs;

      title.addEventListener('click', (e) => {
         window.history.pushState({}, '', '/posts');
         window.dispatchEvent(new PopStateEvent('popstate'));
      });

      back.addEventListener('click', (e) => {
         window.history.back();
      });

      profile.addEventListener('click', (e) => {
         dropdown.toggle();
      });

   }


}