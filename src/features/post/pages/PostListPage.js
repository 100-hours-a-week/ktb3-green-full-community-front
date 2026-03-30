import Component from "../../../core/Component.js";
import { apiFetch } from "../../../lib/api.js";
import { getPageState, savePageState } from "../../../localCache.js";
import HmmItem from "../components/HmmItem.js";

export default class PostListPage extends Component {

   setup() {
      this.state = { page: 0, size: 4, isLast: false, pages: {}, lastViewedPage: 0, isLoading: false };
      this.observer = null;
   }

   template() {

      const frag = document.createDocumentFragment();

      const $page = document.createElement('div');
      $page.className = 'post-list-page';

      const $titleWrapper = document.createElement('div');
      $titleWrapper.className = 'post-list-page-title-wrapper';

      const $title = document.createElement('div');
      $title.className = 'post-list-page-title';
      $title.textContent = 'H m m m . .';

      $titleWrapper.append($title);

      const $list = document.createElement('div');
      $list.className = 'post-list';

      const $scrollSentinel = document.createElement('div');
      $scrollSentinel.className = 'post-list-scroll-sentinel';

      $list.append($scrollSentinel);
      $page.append($titleWrapper, $list);
      frag.append($page);

      this.$refs = { list: $list, scrollSentinel: $scrollSentinel };

      return frag;

   }

   async afterMount() {

      const key = window.location.pathname;
      const cache = getPageState(key);

      if(cache) {

         console.log('cache hit');

         this.state.page = cache.lastFetchedPage ?? 0;
         this.state.isLast = !!cache.isLast;
         this.state.pages = cache.pages;
         this.state.lastViewdPage = cache.lastViewdPage ?? 0;

         Object.values(cache.pages).forEach((posts) => {
            this.renderPosts(posts);
         });

         const container = this.$refs.list;
         const pageWidth = container.clientWidth;
         const { lastViewedPage } = cache;

         requestAnimationFrame(() => {
            container.scrollLeft = pageWidth * lastViewedPage;
         });

         if(!this.state.isLast) this.initObserver();
         this.initScrollSave();

         return;
      }

      await this.loadPostItems();
      this.initObserver();
      this.initScrollSave();
      
   }

   async loadPostItems() {

      const { page, size, isLast, pages, isLoading } = this.state;

      if(isLoading || isLast ) return;
      this.state.isLoading = true;

      try {

         const response = await apiFetch(`/posts?page=${page}&size=${size}`, {
            method: 'GET',
            withAuth: false,
         });

         console.log('[fetch]', { reqPage: page, size, len: response.data.content?.length, last: response.data.last });
         console.log('API 호출');

         const posts = response.data.content;
         this.renderPosts(posts);

         const updatedPages = { ...pages, [page]: posts };
         this.state.pages = updatedPages;
         this.state.page = page + 1;
         this.state.isLast = response.data.last;

         const key = window.location.pathname;
         const prevCache = getPageState(key) || {};

         savePageState(key, {
            isLast: this.state.isLast,
            lastFetchedPage: this.state.page,
            lastViewedPage: prevCache.lastViewedPage ?? this.state.lastViewedPage ?? 0,
            pages: updatedPages,
         });

      }
      catch(error) {
         console.log(error);
      }
      finally {
         this.state.isLoading = false;
      }
   }

   initObserver() {

      const { list, scrollSentinel } = this.$refs;

      if (!scrollSentinel) return;

      const callback = (entries, observer) => {
         entries.forEach((entry) => {
            if (entry.isIntersecting) {
               console.log('API 호출 트리거');
               this.loadPostItems();
            }
            if (this.state.isLast) {
               observer.unobserve(entry.target);
            }
         });
      }

      const options = {
         root: list, 
         rootMargin: '0px 200px 0px 0px',          
         threshold: 0.5,   
      }
      
      this.observer = new IntersectionObserver(callback, options);
      this.observer.observe(this.$refs.scrollSentinel);

   }

   renderPosts(posts) {

      const { list, scrollSentinel } = this.$refs;

      const $postPage = document.createElement('div');
      $postPage.className = 'post-items-group';

      posts.forEach((post) => {
         const props = {
         postId: post.postId,
         userId: post.author.userId,
         title: post.title,
         pick1: post.pick1.pickTitle,
         pick2: post.pick2.pickTitle,
         pickCount: post.pickCount,
         nickname: post.author?.nickname ?? '',
         };

         const postItem = new HmmItem(props).render();
         $postPage.appendChild(postItem);
      });

      list.insertBefore($postPage, scrollSentinel);

   }

   initScrollSave() {

      const { list } = this.$refs;

      const key = window.location.pathname;

      list.addEventListener('scroll', () => {
         const pageWidth = list.clientWidth;
         const lastViewedPage = Math.round(list.scrollLeft / pageWidth);

         this.state.lastViewedPage = lastViewedPage;

         savePageState(key, {
            lastViewedPage: lastViewedPage,
         });
      });

   }
   
}