import Component from '../../core/Component.js';
import DropDownNav from './DropdownNav.js';

export default class Header extends Component {

   setup() {
      this.state = { 
         isLoggedIn: true,
         profileImg: null,
      };
   }

   template() {
      const frag = document.createDocumentFragment();
      const { isLoggedIn, profileImg } = this.state;

      const $header = document.createElement('header');
      $header.className = 'header';

      const $logo = document.createElement('div');
      $logo.className = 'header-logo';
      const $options = document.createElement('div');
      $options.className = 'header-options';

      const $addPostButton = document.createElement('button');
      $addPostButton.className = 'header-add-post-button';
      $addPostButton.textContent = '흠.. 주제 추가하기';
      $addPostButton.style.display = isLoggedIn ? 'block' : 'none';

      const $profile = document.createElement('div');
      $profile.className = 'header-profile-menu';

      const $dropdown = document.createElement('div');
      $dropdown.className = 'dropdown-nav';
      const dropdown = new DropDownNav({ $target: $dropdown });
      dropdown.render();

      const $profileImg = document.createElement('div');
      $profileImg.className = 'header-profile-img';
      $profileImg.style.backgroundImage = isLoggedIn ? `url("${profileImg}")` : '';
      
      $profile.append($profileImg, $dropdown);
      $options.append($addPostButton, $profile);

      $header.append($logo, $options);
      frag.appendChild($header);

      this.$refs = { logo: $logo, addPostButton: $addPostButton, profile: $profileImg, dropdown: dropdown };

      return frag;
   }

   setEvent() {

      const { logo, addPostButton, profile, dropdown } = this.$refs;

      logo.addEventListener('click', (e) => {
         window.history.pushState({}, '', '/posts');
         window.dispatchEvent(new PopStateEvent('popstate'));
      });

      addPostButton.addEventListener('click', (e) => {
         e.preventDefault();

         window.history.pushState({}, '', '/posts/new');
         window.dispatchEvent(new PopStateEvent('popstate'));
      });

      profile.addEventListener('click', (e) => {
         dropdown.toggle();
      });

   }


}