import Component from "../../../core/Component.js";
import h from "../../../core/VdomNode.js";
import { apiFetch } from "../../../lib/api.js";
import { getPageState, savePageState } from "../../../localCache.js";
import PostItem from "../components/PostItem.js";

export default class PostListPage extends Component {

   setup() {

      this.state = { page: 0, size: 4, isLast: false, pages: {}, lastViewedPage: 0, isLoading: false };
      this.observer = null;
      this._isLoading = false;
      this._bind = false;

   }
 
   template() {

      const pageNumber = Object.keys(this.state.pages).map(Number).sort((a, b) => a - b);

      const pageGroups = pageNumber.map((pageIdx) => {

         const posts = this.state.pages[pageIdx] || [];

         const items = posts.map((post) =>
            h(PostItem, {
               componentName: 'post-item',
               postId: post.postId ?? post.id,
               userId: post.author.userId,
               title: post.title,
               pick1: post.pick1.pickTitle,
               pick2: post.pick2.pickTitle,
               pickCount: post.pickCount,
               nickname: post.author?.nickname ?? "",
            }));

         return h("div", { class: "post-items-group" }, ...items);
      });

      const postListPage = h('div', { class: 'post-list-page' },
         h('div', { class: 'post-list-page-title-wrapper' },
            h('div', { class: 'post-list-page-title' }, 'H m m m . .'),
         ),
         h('div', { class: 'post-list' }, 
            ...pageGroups,
            h('div', { class: 'post-list-scroll-sentinel' }),
         ),
      );

      return postListPage;

   }

   setEvent() {

      if(this._bind) return;
      this._bind = true;

   }

   async afterMount() {

      const key = window.location.pathname;
      const cache = getPageState(key);

      console.log('postlistafterMount');

      if(cache) {

         console.log('cache hit');

         this.setState({ page: cache.lastFetchedPage, isLast: !!cache.isLast, pages: cache.pages, lastViewedPage: cache.lastViewedPage ?? 0 });

         const container = this.$target.querySelector('.post-list');
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

      const { page, size, isLast } = this.state;

      if(this._isLoading || isLast ) return;
      this._isLoading = true;

      try {

         const response = await apiFetch(`/posts?page=${page}&size=${size}`, {
            method: 'GET',
            withAuth: false,
         });

         const posts = response.data.content;
         const newPages = { ...this.state.pages, [page]: posts };

         this.setState({ page: page + 1, isLast: response.data.last, pages: newPages });

         const key = window.location.pathname;
         const prevCache = getPageState(key) || {};

         savePageState(key, {
            isLast: this.state.isLast,
            lastFetchedPage: this.state.page,
            lastViewedPage: prevCache.lastViewedPage ?? this.state.lastViewedPage ?? 0,
            pages: newPages,
         });

      }
      catch(error) {
         console.log(error);
      }
      finally {
         this._isLoading = false;
         console.log('finally');
      }
   }

   initObserver() {

      const list = this.$target.querySelector('.post-list');
      const scrollSentinel = this.$target.querySelector('.post-list-scroll-sentinel');

      if (!list || !scrollSentinel) return;

      const callback = (entries, observer) => {
         entries.forEach((entry) => {

            if (this._isLoading || this.state.isLast) return;

            if (entry.isIntersecting) {
               console.log('API 호출 트리거');
               this.loadPostItems();
               const newSentinel = this.$target.querySelector('.post-list-scroll-sentinel');
               if (newSentinel && !this.state.isLast) this.observer.observe(newSentinel);
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
      this.observer.observe(scrollSentinel);

   }

   initScrollSave() {

      const list = this.$target.querySelector('.post-list');
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
