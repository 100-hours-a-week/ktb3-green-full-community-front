import Component from "../../../core/Component.js";
import Modal from "../../../shared/components/Modal.js";

export default class CommentItem extends Component {

   template() {

      const { nickname, profileImg, content, updatedAt, isSame, isOwner } = this.props;

      const [y, m, d] = updatedAt.slice(0, 10).split('-');
      
      const frag = document.createDocumentFragment();

      const $modal = document.createElement('div');
      $modal.className = 'comment-modal';

      const $wrapper = document.createElement('div');
      $wrapper.className = 'comment-item-wrapper';

      const $commentWrapper = document.createElement('div');
      $commentWrapper.className = 'comment-info-wrapper';

      const $profile = document.createElement('div');
      $profile.className = 'comment-profile';
      $profile.style.backgroundImage = `url("${profileImg}")`;

      const $nicknameAndDate = document.createElement('div');
      $nicknameAndDate.className = 'comment-nickname-date';

      const $nickname = document.createElement('div');
      $nickname.className = 'comment-author-nickname';
      $nickname.classList.toggle('is-same', isSame);
      $nickname.textContent = nickname;
      const $date = document.createElement('div');
      $date.className = 'comment-created-at';
      $date.textContent = `${y}년 ${Number(m)}월 ${Number(d)}일`;
      $nicknameAndDate.append($nickname, $date);

      const $actions = document.createElement('div');
      $actions.className = 'comment-actions';
      $actions.classList.toggle('is-hidden', !isOwner);
      const $edit = document.createElement('i');
      $edit.className = 'fa-solid fa-pen-to-square';
      const $delete = document.createElement('i');
      $delete.className = 'fa-solid fa-trash-can';
      
      $actions.append($edit, $delete);

      $commentWrapper.append($profile, $nicknameAndDate, $actions);

      const $contentWrapper = document.createElement('div');
      $contentWrapper.className = 'comment-content-wrapper';

      const $content = document.createElement('div');
      $content.className = 'comment-content';
      $content.textContent = content;

      $contentWrapper.append($content);

      $wrapper.append($commentWrapper, $contentWrapper);
      frag.append($modal, $wrapper);

      this.$refs = { modal: $modal, wrapper: $wrapper, editButton: $edit, deleteButton: $delete } ;

      return frag;
   }

   setEvent() {

      const { modal, wrapper, editButton, deleteButton } = this.$refs;
      const { commentId, postId, content } = this.props;

      editButton.addEventListener('click', (e) => {
         e.preventDefault();

         wrapper.dispatchEvent(
            new CustomEvent('comment:edit', {
               detail: { id: commentId , content: content },
               bubbles: true,
            })
         );
         
      });

      deleteButton.addEventListener('click', async(e) => {
         e.preventDefault();

         new Modal({
            $target: modal,
            target: 'comment',
            message: '댓글을 정말로 삭제하시겠습니까?',
            postId: postId,
            commentId: commentId,
         }).render();
      });

   }
}