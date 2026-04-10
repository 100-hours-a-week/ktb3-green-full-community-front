import Component from '../../core/Component.js';
import h from '../../core/VdomNode.js';
import { getRouter } from '../../router/Router.js';
import DropDownNav from './DropdownNav.js';

export default class Header extends Component {

   setup() {

      this.state = { isLoggedIn: true, profileImg: null, isOpen: false };
      this.router = getRouter();
      this._bound = false;

      this._routeHome = (e) => {
         const logo = e.target.closest('.header-logo');
         if(!logo) return;

         this.router.navigate('/posts');
      }

      this._routeAddPostPage = (e) => {
         const addButton = e.target.closest('.header-add-post-button');
         if(!addButton) return;

         this.router.navigate('/posts/new');
      }

      this._openModal = (e) => {
         const profile = e.target.closest('.header-profile-img');
         if(!profile) return;

         this.setState({ isOpen: !this.state.isOpen });
      }

   }

   template() {

      const { isAuthenticated, profileImg } = this.props;

      const header = h('header', { class: 'header' },
         h('div', { class: 'header-logo' }, ''),
         isAuthenticated ? (h('div', { class: 'header-options'}, 
            h('button', { class: 'header-add-post-button'}, '흠.. 주제 작성하기'),
               h('div', { class: 'header-profile-img', style: `background-image: url("${profileImg}")` }),
               h(DropDownNav, { componentName: 'dropdown', isOpen: this.state.isOpen }),
            )) : null,
         );

      return header;

   }

   setEvent() {

      if(this._bound) return;
      this._bound = true;

      const { isAuthenticated } = this.props;

      this.$target.querySelector('.header-logo').addEventListener('click', this._routeHome);
      if(isAuthenticated) {
         this.$target.querySelector('.header-add-post-button').addEventListener('click', this._routeAddPostPage);
         this.$target.querySelector('.header-profile-img').addEventListener('click', this._openModal);
      }

      // addPostButton.addEventListener('click', (e) => {
      //    e.preventDefault();

      //    window.history.pushState({}, '', '/posts/new');
      //    window.dispatchEvent(new PopStateEvent('popstate'));
      // });

      // profile.addEventListener('click', (e) => {
      //    dropdown.toggle();
      // });

   }


}