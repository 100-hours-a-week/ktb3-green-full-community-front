import Component from "../../../core/Component.js";
import h from "../../../core/VdomNode.js";
import { apiFetch } from "../../../lib/api.js";
import { getRouter } from "../../../router/Router.js";

export default class PostItem extends Component {

   setup() {
      
      this._bind = false;
      this.router = getRouter();

      this._onClick = (e) => {
   
         const postItem = e.target.closest('.post-item');
         if(!postItem) return;

         const postId = this.props.postId ?? this.props.id;
         if (postId === undefined || postId === null) {
            console.error('postId가 없습니다.', this.props);
            return;
         }

         e.preventDefault();

         try {
            this.router.navigate(`/posts/${postId}`);
         }
         catch(error) {
            console.log(error);
         }

      }
   }

   template() {

      const { postId, title, pick1, pick2, pickCount, nickname } = this.props;

      const postItem = h('div', { class: 'post-item' },
         h('div', { class: 'post-item-title'}, 
            h('div', { class: 'post-item-title-top' },
               h('div', { class: 'post-item-title-question' }, title),
               h('div', { class: 'post-item-title-type'}, '🔥 HOT'),
            ),
            h('div', { class: 'post-item-title-bottom' },
               h('div', { class: 'post-item-title-viewing' }, `${pickCount}명이 흠...에 참여하고 있어요!`),
               h('div', { class: 'post-item-title-author' }, `by ${nickname}`),
            ),
         ),
         h('div', { class: 'post-item-picks' },
            h('div', { class: 'post-item-pick pick-1' }, pick1),
            h('div', { class: 'post-item-pick pick-2' }, pick2),
          ),
      );

      return postItem;

   }

   setEvent() {
      
      if(this._bind) return;
      this._bind = true;

      this.$target.querySelector('.post-item').addEventListener('click', this._onClick);

   }

}
