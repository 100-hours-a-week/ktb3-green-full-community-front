import Component from "../../../core/Component.js";
import Modal from "../../../shared/components/Modal.js";

export default class PostDetailHeader extends Component {
   
   template() {

      const { title, nickname, createdAt, isOwner } = this.props;

      console.log('주인여부');
      console.log(isOwner);

      const frag = document.createDocumentFragment();

      const $modal = document.createElement('div');
      $modal.className = 'post-modal';

      const $wrapper = document.createElement('div');
      $wrapper.className = 'post-detail-header-wrapper';

      const $title = document.createElement('div');
      $title.className = 'post-detail-header-title'
      $title.textContent = title;
      
      const $info = document.createElement('div');
      $info.className = 'post-detail-header-info'

      const $profileImg = document.createElement('div');
      $profileImg.className = 'author-profile-img';
      const $nickname = document.createElement('div');
      $nickname.className = 'author-profile-nickname';
      $nickname.textContent = nickname;

      const $date = document.createElement('div');
      $date.textContent = createdAt.replace('T', ' ').replace('Z', '');

      const $buttons = document.createElement('div');
      $buttons.className = 'options-button';
      $buttons.classList.toggle('is-owner', isOwner);
      const $edit = document.createElement('button');
      $edit.textContent = '수정';
      const $delete = document.createElement('button');
      $delete.textContent = '삭제';

      $buttons.append($edit, $delete);

      $info.append($profileImg, $nickname, $date, $buttons);

      $wrapper.append($title, $info);

      frag.append($modal, $wrapper);

      this.$refs = { modal: $modal, wrapper: $wrapper, editButton: $edit, deleteButton: $delete };

      return frag;
   }

   setEvent() {

      const { modal, wrapper, editButton, deleteButton } = this.$refs;
      const { postId } = this.props; 

      editButton.addEventListener('click', (e) => {
         e.preventDefault();

         wrapper.dispatchEvent(
            new CustomEvent('post:edit', {
               detail: { postId: postId },
               bubbles: true,
            })
         );
      });

      deleteButton.addEventListener('click', async(e) => {
         e.preventDefault();

         new Modal({ $target: modal, target: '게시글', postId: postId }).render();
      });

   }

}