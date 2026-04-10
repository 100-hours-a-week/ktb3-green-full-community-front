
import Component from "../../core/Component.js";
import h from "../../core/VdomNode.js";
import { apiFetch } from "../../lib/api.js";
import { clearPageState } from "../../localCache.js";
import { getRouter } from "../../router/Router.js";

export default class Modal extends Component {

   setup() {

      this.router = getRouter();
      this._bind = false;

      this._onCancleClick = (e) => {
         const button = e.target.closest('.modal-cancle-button');
         if(!button) return;
         e.preventDefault();

         this.closeWithAnimation();
      }

      this._onOkClick = async (e) => {
         const button = e.target.closest('.modal-ok-button');
         if(!button) return;

         e.preventDefault();

         switch(this.props.target) {
            case 'post':
               try {
                  const response = await apiFetch(`/posts/${this.props.postId}`, {
                     method: 'DELETE',
                     withAuth: true
                  });
                  console.log(response);

                  clearPageState();
                  this.router.navigate('/posts');
               }
               catch(error) {
                  console.log(error);
               }
               break;
            case 'comment':
               try {
                  const response = await apiFetch(`/posts/${this.props.postId}/comments/${this.props.commentId}`, {
                     method: 'DELETE',
                     withAuth: true
                  });
                  console.log(response);
                  this.props.updateComments();
               }
               catch(error) {
                  console.log(error);
               }
               break;
            case 'logout':
               this.router.navigate('/');
               break;
            case 'user':
               try {
                  const response = await apiFetch('/users/active', {
                     method: 'PATCH',
                     withAuth: true,
                  });

                  console.log(response);
                  this.router.navigate('/');
               }
               catch(error) {
                  console.log(error);
               }
               break;
         }
      }
   }

   closeWithAnimation() {
      if (this._closing) return;
      this._closing = true;

      const wrapper = this.$target.querySelector('.modal-wrapper');
      if (!wrapper) {
         this.props.onCloseDone?.();
         return;
      }

      wrapper.classList.add('out');
      wrapper.addEventListener('animationend', () => {
         this._closing = false;
         this.props.onCloseDone?.(); 
      }, { once: true });
   }

   template() {

      const { message, isOpen } = this.props;

      const modal = h('div', { class: 'modal-wrapper' },
         h('div', { class: 'modal' },
            h('div', { class: 'modal-title' }, message),
            h('div', { class: 'modal-buttons' },
               h('button', { class: 'modal-cancle-button', type: 'button' }, '취소'),
               h('button', { class: 'modal-ok-button', type: 'button' }, '확인'),
            )
         )
      );

      return isOpen ? modal : null;

   }

   setEvent() {

      if(this._bind) return;

      const cancelButton = this.$target.querySelector('.modal-cancle-button');
      const okButton = this.$target.querySelector('.modal-ok-button');
      if (!cancelButton || !okButton) return;

      this._bind = true;

      cancelButton.addEventListener('click', this._onCancleClick);
      okButton.addEventListener('click', this._onOkClick )
      
   }

}