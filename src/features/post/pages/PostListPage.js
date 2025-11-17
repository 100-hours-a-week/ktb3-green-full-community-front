import Component from '../../../core/Component.js';
import PostItem from '../components/PostItem.js';
import { apiFetch } from '../../../lib/api.js';

export default class PostListPage extends Component {

   setup() {
      this.state = { page: 0, size: 5, isLoading: false, isLast: false };
      this.observer = null;
   }

   template() {

      const frag = document.createDocumentFragment();

      const $page = document.createElement('div');
      $page.className = 'post-list-page';

      const $title = document.createElement('div');
      $title.className = 'post-list-title';
      $title.textContent = '안녕하세요,';
      const $title2 = document.createElement('div');
      $title2.className = 'post-list-title';
      $title2.textContent = '아무 말 대잔치 게시판 입니다.';

      const $button = document.createElement('button');
      $button.className = 'post-add-button';
      $button.textContent = '게시글 작성';

      const $postList = document.createElement('div');
      $postList.className = 'post-list-items';

      const $scrollSentinel = document.createElement('div');
      $scrollSentinel.className = 'post-list-scroll-sentinel';
      
      $page.append($title, $title2, $button, $postList, $scrollSentinel);
      frag.appendChild($page);

      this.$refs = { postList: $postList, addButton: $button, scrollSentinel: $scrollSentinel };

      return frag;

   }

   async afterMount() {

      await this.loadPostItems();
      this.initObserver();
      
   }

   async loadPostItems() {

      const { page, size, isLoading, isLast } = this.state;

      if(isLoading || isLast ) return;
      this.state.isLoading = true;

      try {

         const response = await apiFetch(`/posts?page=${page}&size=${size}`, {
            method: 'GET',
            withAuth: false
         });

         const posts = response.data.content;
         
         const frag = document.createDocumentFragment();

         posts.forEach((post) => {
            
            const props = {
               postId: post.postId,
               userId: post.author.userId,
               profileImg: post.author.profileImg,
               title: post.title ?? '',
               nickname: post.author?.nickname ?? '',
               counts: [post.likes ?? 0, post.comments ?? 0, post.views ?? 0],
               createdAt: post.createdAt ?? '',
            };

            const postItem = new PostItem(props).render();
            frag.appendChild(postItem);

         });

         this.$refs.postList.append(frag);

         this.state.page = page + 1;
         this.state.isLast = response.data.last;

      }
      catch(error) {
         console.log(error);
      }
      finally {
         this.state.isLoading = false;
      }
   }

   initObserver() {

      if (!this.$refs.scrollSentinel) return;

      const callback = (entries, observer) => {
         entries.forEach((entry) => {
            if (entry.isIntersecting) {
               this.loadPostItems();
            }
            if (this.state.isLast) {
               observer.unobserve(entry.target);
            }
         });
      }

      const options = {
         threshold: 1,
      }
      
      this.observer = new IntersectionObserver(callback, options);
      this.observer.observe(this.$refs.scrollSentinel);

   }

   setEvent() {

      const { addButton } = this.$refs;

      addButton.addEventListener('click', (e) => {
         e.preventDefault();

         window.history.pushState({}, '', '/posts/new');
         window.dispatchEvent(new PopStateEvent('popstate'));
      });

   }
}