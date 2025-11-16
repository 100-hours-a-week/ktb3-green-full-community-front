import { apiFetch } from "../../../lib/api.js";
import Component from "../../../core/Component.js";

export default class CommentInput extends Component {
   setup() {
      this.state = {
         mode: 'create',
         content: '',
         commentId: '',
      }
   }

   template() {

      const frag = document.createDocumentFragment();

      const $wrapper = document.createElement('div');
      $wrapper.className = 'comment-input-wrapper';

      const $form = document.createElement('form');
      $form.className = 'comment-form';

      const $inputWrapper = document.createElement('div');
      $inputWrapper.className = 'input-wrapper';

      const $commentInput = document.createElement('textarea');
      $commentInput.name = 'comment';
      $commentInput.placeholder = '댓글을 남겨주세요!';
      if(this.state.mode === 'edit') $commentInput.value = this.state.content;

      const $buttonWrapper = document.createElement('div');
      $buttonWrapper.className = 'button-wrapper';

      const $button = document.createElement('button');
      $button.className = 'comment-submit-button';
      $button.type = 'submit';
      $button.textContent = this.state.mode === 'edit' ? '댓글 수정' : '댓글 등록';

      $inputWrapper.append($commentInput);
      $buttonWrapper.append($button);

      $form.append($inputWrapper, $buttonWrapper);
      $wrapper.append($form);
      frag.append($wrapper);

      this.$refs = { wrapper: $wrapper, form: $form, commentInput: $commentInput };

      return frag
   }

   setEvent() {

      const { postId } = this.props;
      const { wrapper, form, commentInput } = this.$refs;


      form.addEventListener('submit', async(e) => {
         e.preventDefault();

         const payload = {
            content: commentInput.value
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

      wrapper.addEventListener('comment:edit', (e) => {
         const { id, content } = e.detail;
         this.editMode({ id, content});
      })

   }

   editMode({ id, content }) {
      this.setState({ mode: 'edit', content: content, commentId: id});
   }
}