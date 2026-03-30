import { apiFetch } from "../../../lib/api.js";
import Component from "../../../core/Component.js";

export default class WithdrawModal extends Component {

   template() {

      const frag = document.createDocumentFragment();

      const $wrapper = document.createElement('div');
      $wrapper.className = 'modal-wrapper';

      const $modal = document.createElement('div');
      $modal.className = 'modal';

      const $title = document.createElement('div');
      $title.className = 'modal-title';
      $title.textContent = '회원탈퇴 하시겠습니까?';

      const $text = document.createElement('div');
      $text.className = 'modal-text';
      $text.textContent = '작성된 게시글과 댓글은 삭제됩니다.';

      const $buttons = document.createElement('div');
      $buttons.className = 'modal-buttons';

      const $cancle = document.createElement('button');
      $cancle.className = 'modal-cancle-button';
      $cancle.type = 'button';
      $cancle.textContent = '취소';

      const $ok = document.createElement('button');
      $ok.className = 'modal-ok-button';
      $ok.type = 'button';
      $ok.textContent = '확인';

      $buttons.append($cancle, $ok);
      $modal.append($title, $text, $buttons);
      $wrapper.append($modal);

      frag.append($wrapper);

      this.$refs = { wrapper: $wrapper, cancleButton: $cancle, okButton: $ok};

      return frag;

   }

   setEvent() {

      const { wrapper, cancleButton, okButton } = this.$refs;

      cancleButton.addEventListener('click', () => {
         wrapper.remove();
      });   

      okButton.addEventListener('click', async () => {

         try {
            const response = await apiFetch('/users/active', {
               method: 'PATCH',
               withAuth: true,
            });

            console.log(response);

            window.history.pushState({}, '', `/`);
            window.dispatchEvent(new PopStateEvent('popstate'));
         }
         catch(error) {
            console.log(error);
         }

      });
      
   }

}