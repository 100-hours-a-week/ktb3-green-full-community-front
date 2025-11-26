import Component from "../../../core/Component.js";
import { apiFetch } from "../../../lib/api.js";
import Modal from "../../../shared/components/Modal.js";

export default class SelectionItem extends Component {

   setup() {
      this.state = { isSelected: false, pick1: false, pick2: false };
   }

   template() {

      const { postId, authorNickname, authorProfile, title, pick1Title, pick1Detail, pick2Title, pick2Detail, isPicked, isOwner  } = this.props;

      const canPick = !isPicked;
      const pick1On = canPick && this.state.pick1;
      const pick2On = canPick && this.state.pick2;
      
      const frag = document.createDocumentFragment();

      const $modal = document.createElement('div');
      $modal.className = 'post-modal';

      const $form = document.createElement('form');
      $form.className = 'main-format post-view';

      const $post = document.createElement('div');
      $post.className = 'main-format-post';

      const $profile = document.createElement('div');
      $profile.className = 'main-format-author-info';

      const $profileImg = document.createElement('div');
      $profileImg.className = 'main-format-profile-img';
      $profileImg.style.backgroundImage = `url("${authorProfile}")`;

      const $nicknameAndDate = document.createElement('div');
      $nicknameAndDate.className = 'main-format-nickname-date';

      const $nickname = document.createElement('div');
      $nickname.className = 'main-format-author-nickname';
      $nickname.textContent = authorNickname;
      const $date = document.createElement('div');
      $date.className = 'main-format-created-at';
      $date.textContent = '2025년 11월 21일';

      const $actions = document.createElement('div');
      $actions.className = 'main-format-post-actions';
      $actions.classList.toggle('is-hidden', !isOwner);
      const $edit = document.createElement('i');
      $edit.className = 'fa-solid fa-pen-to-square';
      const $delete = document.createElement('i');
      $delete.className = 'fa-solid fa-trash-can';
      
      $actions.append($edit, $delete);

      $nicknameAndDate.append($nickname, $date);
      $profile.append($profileImg, $nicknameAndDate, $actions);

      const $postHeader = document.createElement('div');
      $postHeader.className = 'main-format-header post-view';

      const $title = document.createElement('div');
      $title.className = 'main-format-title post-view';
      $title.textContent = title;

      $postHeader.append($title);

      const $picks = document.createElement('div');
      $picks.className = 'main-format-picks post-view';

      const $pick1Wrapper = document.createElement('div');
      $pick1Wrapper.className = 'main-format-pick-wrapper pick-1';
      $pick1Wrapper.classList.toggle('is-picked', pick1On);
      const $pick1Number = document.createElement('div');
      $pick1Number.className = 'main-format-pick-number';
      $pick1Number.classList.toggle('is-picked', pick1On);
      $pick1Number.textContent = 'A';
      const $pick1 = document.createElement('div');
      $pick1.className = 'main-format-pick-title'
      $pick1.classList.toggle('is-picked', pick1On);
      $pick1.textContent = pick1Title;
      const $pick1Detail = document.createElement('div');
      $pick1Detail.className = 'main-format-pick-detail';
      $pick1Detail.textContent = pick1Detail;
      $pick1Wrapper.append($pick1Number, $pick1, $pick1Detail);

      const $pick2Wrapper = document.createElement('div');
      $pick2Wrapper.className = 'main-format-pick-wrapper pick-2';
      $pick2Wrapper.classList.toggle('is-picked', pick2On);
      const $pick2Number = document.createElement('div');
      $pick2Number.className = 'main-format-pick-number';
      $pick2Number.classList.toggle('is-picked', pick2On);
      $pick2Number.textContent = 'B';
      const $pick2 = document.createElement('div');
      $pick2.className = 'main-format-pick-title';
      $pick2.classList.toggle('is-picked', pick2On);
      $pick2.textContent = pick2Title;
      const $pick2Detail = document.createElement('div');
      $pick2Detail.className = 'main-format-pick-detail';
      $pick2Detail.textContent = pick2Detail;
      $pick2Wrapper.append($pick2Number, $pick2, $pick2Detail);

      const $submitButton = document.createElement('button');
      $submitButton.className = 'main-format-button selection-button';
      $submitButton.type = 'submit';
      $submitButton.textContent = this.state.isSelected ? '선택 완료' : 'Hmmm..';
      $submitButton.classList.toggle('is-hidden', !canPick);
      
      $picks.append($pick1Wrapper, $pick2Wrapper);
      $post.append($profile, $postHeader, $picks);
      $form.append($post, $submitButton);
      frag.append($modal, $form);

      this.$refs = { form: $form, title: $title, pick1Wrapper: $pick1Wrapper, pick1: $pick1, pick2Wrapper: $pick2Wrapper, pick2: $pick2, submitButton: $submitButton, editButton: $edit, deleteButton: $delete, modal: $modal };

      return frag;

   }

   setEvent() {

      const { postId, title, pick1Title, pick1Detail, pick2Title, pick2Detail, isPicked } = this.props;
      const { form, pick1Wrapper, pick1, pick2Wrapper, pick2, submitButton, editButton, deleteButton, modal } = this.$refs;

      pick1Wrapper.addEventListener('click', (e) => {
         e.preventDefault();

         if(isPicked) return;
         this.setState({ isSelected: true, pick1: true, pick2: false });
      });

      pick2Wrapper.addEventListener('click', (e) => {
         e.preventDefault();

         if(isPicked) return;
         this.setState({ isSelected: true, pick1: false, pick2: true });
      });

      form.addEventListener('submit', async(e) => {
         e.preventDefault();

         if(!this.state.isSelected) return;
         const number = this.state.pick1 ? 1 : 2;

         submitButton.classList.toggle('is-hidden', true);

         const payload = {
            postId: postId,
            pickNumber: number,
         }
         
         try {

            const response = await apiFetch(`/posts/${postId}/picks`, {
               method: 'POST',
               body: payload,
               withAuth: true,
            });

            console.log(response);

            form.dispatchEvent(
               new CustomEvent('post:pick', {
                  detail: { pickNumber: number },
                  bubbles: true,
               })
            );

         }
         catch(error) {
            console.log(error);
         }
         
      });

      editButton.addEventListener('click', (e) => {
         const editProps = {
            mode: 'edit',
            title: title,
            pick1Title: pick1Title,
            pick1Detail: pick1Detail,
            pick2Title: pick2Title,
            pick2Detail: pick2Detail,
         }

         window.history.pushState(editProps, '', `/posts/${postId}/edit`);
         window.dispatchEvent(new PopStateEvent('popstate'));
         
      });

      deleteButton.addEventListener('click', async(e) => {
         e.preventDefault();
         new Modal({ $target: modal, target: 'post', postId: postId, message: '게시글을 삭제하시겠습니까?' }).render();
      });

   }

}