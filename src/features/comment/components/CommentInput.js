import { apiFetch } from "../../../lib/api.js";
import Component from "../../../core/Component.js";

export default class CommentInput extends Component {

   setup() {
      this.state = { mode: 'create', content: '', commentId: '' };
   }

   template() {

      const frag = document.createDocumentFragment();

      const $form = document.createElement('form');
      $form.className = 'comment-input-form';

      const $inputWrapper = document.createElement('div');
      $inputWrapper.className = 'comment-input-wrapper';

      const $commentInput = document.createElement('textarea');
      $commentInput.name = 'comment';
      $commentInput.placeholder = '선택의 이유에 대해 자유롭게 이야기를 나누어 보세요!';
      if(this.state.mode === 'edit') $commentInput.value = this.state.content;

      const $buttonWrapper = document.createElement('div');
      $buttonWrapper.className = 'comment-submit-button-wrapper';

      const $button = document.createElement('button');
      $button.className = 'comment-submit-button';
      $button.type = 'submit';
      $button.textContent = this.state.mode === 'edit' ? '댓글 수정' : '댓글 등록';

      const $info = document.createElement('div');
      $info.className = 'comment-info'

      const $infoIcon = document.createElement('i');
      $infoIcon.className = 'fa-solid fa-circle-info';

      const $infoMessage = document.createElement('div');
      $infoMessage.className = 'comment-info-message';
      $infoMessage.textContent = '나와 같은 선택지를 고른 유저의 이름은 초록색으로 표시돼요!';

      $inputWrapper.append($commentInput);
      $buttonWrapper.append($button);

      $info.append($infoIcon, $infoMessage);

      $form.append($inputWrapper, $buttonWrapper);
      frag.append($form, $info);

      this.$refs = { form: $form, commentInput: $commentInput };

      return frag
   }

   setEvent() {

      const { postId, pickNumber } = this.props;
      const { form, commentInput } = this.$refs;


      form.addEventListener('submit', async(e) => {
         e.preventDefault();

         const payload = {
            content: commentInput.value,
            pickNumber: pickNumber,
         }

         try {
            if(this.state.mode === 'edit') {
               const response = await apiFetch(`/posts/${postId}/comments/${this.state.commentId}`, {
                  method: 'PATCH',
                  body: payload,
                  withAuth: true
               });
            }

            if (this.state.mode === 'create') {
               const response = await apiFetch(`/posts/${postId}/comments`, {
                  method: 'POST',
                  body: payload,
                  withAuth: true
               });
            }
         }
         catch(error) {
            console.log(error);
         }

         window.history.pushState({}, '', `/posts/${postId}`);
         window.dispatchEvent(new PopStateEvent('popstate'));
      });

      form.addEventListener('comment:edit', (e) => {
         const { id, content } = e.detail;
         this.editMode({ id, content});
      })

   }

   editMode({ id, content }) {
      this.setState({ mode: 'edit', content: content, commentId: id});
   }
}