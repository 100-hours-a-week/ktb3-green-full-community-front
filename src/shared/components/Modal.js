import { apiFetch } from "../../lib/api.js";
import Component from "../../core/Component.js";
import { clearPageState } from "../../localCache.js";

export default class Modal extends Component {

   template() {

      const { target, message } = this.props;

      const frag = document.createDocumentFragment();

      const $wrapper = document.createElement('div');
      $wrapper.className = 'modal-wrapper';

      const $modal = document.createElement('div');
      $modal.className = 'modal';

      const $title = document.createElement('div');
      $title.className = 'modal-title';
      $title.textContent = message;

      const $buttons = document.createElement('div');
      $buttons.className = 'modal-buttons';

      const $cancle = document.createElement('button');
      $cancle.className = 'modal-cancle-button';
      $cancle.textContent = '취소';

      const $ok = document.createElement('button');
      $ok.className = 'modal-ok-button';
      $ok.textContent = '확인';

      $buttons.append($cancle, $ok);

      $modal.append($title, $buttons);

      $wrapper.append($modal);

      frag.append($wrapper);

      this.$refs = { wrapper: $wrapper, cancleButton: $cancle, okButton: $ok};

      return frag;

   }

   setEvent() {

      const { target, postId, commentId } = this.props;
      const { wrapper, cancleButton, okButton } = this.$refs;

      cancleButton.addEventListener('click', () => {
         wrapper.classList.add('out');
         wrapper.addEventListener('animationend', () => {
            wrapper.remove();
         }, {once: true});
      });   

      okButton.addEventListener('click', async () => {

         if (target === 'comment') {
            const api = `/posts/${postId}/comments/${commentId}`;
            try {
               const response = await apiFetch(api, {
                  method: 'DELETE',
                  withAuth: true
               });
               console.log(response);
               window.history.pushState({}, '', `/posts/${postId}`);
               window.dispatchEvent(new PopStateEvent('popstate'));
            }
            catch(error) {
               console.log(error);
            }
         }
         else if (target === 'post') {
            const api = `/posts/${postId}`;
            try {
               const response = await apiFetch(api, {
                  method: 'DELETE',
                  withAuth: true
               });
               console.log(response);

               clearPageState();

               window.history.pushState({}, '', '/posts');
               window.dispatchEvent(new PopStateEvent('popstate'));
            }
            catch(error) {
               console.log(error);
            }
         }
         else if (target === 'logout') {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
         }

      });
      
   }

}