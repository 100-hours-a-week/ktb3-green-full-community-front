import Component from "../../core/Component.js";
import h from "../../core/VdomNode.js";
import Modal from "./Modal.js";

export default class DropDownNav extends Component {

   setup() {

      this.state = { isLogoutModalOpen: false };

      this._bound = false;

      this._routeEditPage = (e) => {
         const nav = e.target.closest('li[data-route]');
         if(!nav) return;

         const path = nav.dataset.route;
         window.history.pushState({}, '', path);
         window.dispatchEvent(new PopStateEvent('popstate'));
      }

      this._openLogoutModal = (e) => {
         const logout = e.target.closest('.go-logout');
         if(!logout) return;

         this.setState({ isLogoutModalOpen: !this.state.isLogoutModalOpen });
      }

   }

   template() {

      const dropdownNav = h('div', { class: `dropdown-nav ${this.props.isOpen ? 'is-open' : ''}` },
         h(Modal, { componentName: 'modal', class: 'logout-modal', target: 'logout', message: '로그아웃 하시겠습니까?', isOpen: this.state.isLogoutModalOpen, onCloseDone: () => this.setState({ isLogoutModalOpen: false }) }, ),
         h('div', { class: 'drop-nav-wrapper' },
            h('ul', { class: `drop-nav-menu-list ${this.props.isOpen ? 'is-visible' : ''}` }, 
               h('li', { class: 'go-profile-edit profile', 'data-route': '/users/profile/edit' }, '회원정보수정'),
               h('li', { class: 'go-password-edit password', 'data-route': '/users/password/edit' }, '비밀번호수정'),
               h('li', { class: 'go-logout' }, '로그아웃'),
            )
         )
      );

      return dropdownNav;

   }

   setEvent() {

      if(this._bound) return;
      this._bound = true;

      this.$target.querySelector('.go-profile-edit').addEventListener('click', this._routeEditPage);
      this.$target.querySelector('.go-password-edit').addEventListener('click', this._routeEditPage);
      
      this.$target.querySelector('.go-logout').addEventListener('click', this._openLogoutModal);

   }
}