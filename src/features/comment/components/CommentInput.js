import { apiFetch } from "../../../lib/api.js";
import Component from "../../../core/Component.js";
import h from "../../../core/VdomNode.js";
import { getRouter } from "../../../router/Router.js";

export default class CommentInput extends Component {

   setup() {

      this.state = { mode: 'create', content: '', commentId: '' };
      this.router = getRouter();
      this._bind = false;

      this._onSubmit = async (e) => {

         const form = e.target.closest('.comment-input-form');
         if(!form) return;
         e.preventDefault();

         const payload = {
            content: form.querySelector('.comment-input').value,
            pickNumber: this.props.pickNumber,
         }

         try {
            switch(this.props.mode) {
               case 'edit':
                  await apiFetch(`/posts/${this.props.postId}/comments/${this.props.commentId}`, {
                     method: 'PATCH',
                     body: payload,
                     withAuth: true
                  });
                  break;
               case 'create':
                  await apiFetch(`/posts/${this.props.postId}/comments`, {
                     method: 'POST',
                     body: payload,
                     withAuth: true
                  });
                  break;
            }
         }
         catch(error) {
            console.log(error);
         }
         
         this.props.updateComments();
      }

   }

   template() {

      const { mode, content } = this.props;

      const commentInput = h('div', { class: 'comment'},
         h('form', { class: 'comment-input-form' },
            h('div', { class: 'comment-input-wrapper' },
               h('textarea', { class: 'comment-input', name: 'comment', placeholder: '선택의 이유에 대해 자유롭게 이야기를 나누어보세요!' }, mode === 'edit' ? content : null ),
            ),
            h('div', { class: 'comment-submit-button-wrapper' },
               h('button', { class: 'comment-submit-button', type: 'submit' }, mode === 'edit' ? '댓글 수정' : '댓글 등록'),
            ),
         ),
         h('div', { class: 'comment-info' },
            h('i', { class: 'fa-solid fa-circle-info' }),
            h('div', { class: 'comment-info-message' }, '나와 같은 선택지를 고른 유저의 이름은 초록색으로 표시돼요!'),
         )
      );

      return commentInput;

   }

   setEvent() {

      if(this._bind) return;
      this._bind = true;

      this.$target.querySelector('form').addEventListener('submit', this._onSubmit);

   }

}