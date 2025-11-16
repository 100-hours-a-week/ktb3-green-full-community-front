import Component from "../../../core/Component.js";
import Modal from "../../../shared/components/Modal.js";

export default class CommentItem extends Component {

   template() {

      const { nickname, content, updatedAt, isOwner } = this.props;

      const frag = document.createDocumentFragment();

      const $modal = document.createElement('div');
      $modal.className = 'comment-modal';

      const $wrapper = document.createElement('div');
      $wrapper.className = 'comment-wrapper';

      const $commentWrapper = document.createElement('div');
      $commentWrapper.className = 'comment-info-wrapper';

      const $contentWrapper = document.createElement('div');
      $contentWrapper.className = 'comment-content-wrapper';

      const $content = document.createElement('div');
      $content.className = 'comment-content';
      $content.textContent = content;

      $contentWrapper.append($content);

      const $metaWrapper = document.createElement('div');
      $metaWrapper.className = 'comment-meta-wrapper';

      const $profileImg = document.createElement('div');
      $profileImg.className = 'author-profile-img';
      $profileImg.style.backgroundImage = isOwner ? 'url(/img/profile_img_ham.JPG)' : 'url(/img/profile_img_pms.JPG)'; //추후 수정 필요
      const $nickname = document.createElement('div');
      $nickname.className = 'author-profile-nickname';
      $nickname.textContent = nickname;
      const $date = document.createElement('div');
      $date.textContent = updatedAt.replace('T', ' ').replace('Z', '');

      $metaWrapper.append($profileImg, $nickname, $date);

      const $buttons = document.createElement('div');
      $buttons.className = 'options-button';
      $buttons.classList.toggle('is-owner', isOwner);
      const $edit = document.createElement('button');
      $edit.textContent = '수정';
      const $delete = document.createElement('button');
      $delete.textContent = '삭제';

      $buttons.append($edit, $delete);

      $commentWrapper.append($metaWrapper, $buttons);

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
            target: '댓글',
            postId: postId,
            commentId: commentId,
         }).render();
      });

   }
}