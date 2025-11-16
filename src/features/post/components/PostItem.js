import { apiFetch } from '../../../lib/api.js';
import Component from '../../../core/Component.js';

export default class PostItem extends Component {

   template() {

      const { postId, userId, profileImg, title, nickname, counts, createdAt } = this.props;

      const frag = document.createDocumentFragment();
      
      const $postItem = document.createElement('div');
      $postItem.className = 'post-item-wrapper';
      $postItem.dataset.postId = String(postId);

      const $postMain = document.createElement('div');
      $postMain.className = 'post-main';

      const $postInfo = document.createElement('div');
      $postInfo.className = 'post-item-info';

      const $postTitle = document.createElement('div');
      $postTitle.className = 'post-item-title';
      $postTitle.textContent = title;

      const $postMeta = document.createElement('div');
      $postMeta.className = 'post-item-meta';

      const $postMetaCount = document.createElement('ul');

      const labels = [ '좋아요 ', '댓글 ', '조회수 ' ];
      labels.forEach((label, i) => {

         const $li = document.createElement('li');
         $li.className = 'post-item-meta-count';

         const $label = document.createElement('span');
         $label.className = 'count-label';
         $label.textContent = label;
         
         const $value = document.createElement('span');
         $value.textContent = counts[i];

         $li.append($label, $value);
         $postMetaCount.appendChild($li);

      });

      const $postCreatedAt = document.createElement('span');
      $postCreatedAt.className = 'post-created-at';
      $postCreatedAt.textContent = createdAt.replace('T', ' ').replace('Z', '');

      $postMeta.append($postMetaCount);
      $postInfo.append($postTitle, $postMeta);
      $postMain.append($postInfo, $postCreatedAt);

      const $postAuthor = document.createElement('div');
      $postAuthor.className = 'post-item-author';

      const $authorProfile = document.createElement('div');
      $authorProfile.className = 'post-author-profile';
      $authorProfile.style.backgroundImage = userId === 60 ? 'url(/img/profile_img_ham.JPG)' : 'url(/img/profile_img_pms.JPG)'; //추후 수정 필요
      const $authorNickname = document.createElement('div');
      $authorNickname.className = 'post-author-nickname';
      $authorNickname.textContent = nickname;

      $postAuthor.append($authorProfile, $authorNickname);

      $postItem.append($postMain, $postAuthor);
      frag.append($postItem);

      this.$refs = { postItem: $postItem };

      return frag;
   }

   setEvent() {

      const { postItem } = this.$refs;
      const { postId } = this.props;

      postItem.addEventListener('click', async (e) => {
         e.preventDefault();

         try {
            const response = await apiFetch(`/posts/${postId}`, {
               method: 'GET',
               withAuth: false
            });

            window.history.pushState({}, '', `/posts/${postId}`);
            window.dispatchEvent(new PopStateEvent('popstate'));
         } 
         catch (error) {
            window.history.pushState({}, '', '/error');
            window.dispatchEvent(new PopStateEvent('popstate'));
         }
         
      })
      
   }


}