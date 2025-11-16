import { apiFetch } from "../../../lib/api.js";
import Component from "../../../core/Component.js";
import Count from "./Count.js";

export default class PostCounts extends Component {

   setup() {
      this.state = { isLiked: true, likes: 0 };
   }

   template() {

      const { views, comments } = this.props;
      const { isLiked, likes } = this.state;

      const frag = document.createDocumentFragment();

      const $wrapper = document.createElement('div');
      $wrapper.className = 'post-counts-wrapper';

      const $likeButton = document.createElement('div');
      $likeButton.className = 'counts-like';
      $likeButton.classList.toggle('is-liked', isLiked);
      const $view = document.createElement('div');
      const $comment = document.createElement('div');

      const like = new Count({ $target: $likeButton, type: "좋아요수", count: likes });
      like.render();
      const view = new Count({ $target: $view, type: "조회수", count: views });
      view.render(); 
      const comment = new Count({ $target: $comment, type: "댓글수", count: comments });
      comment.render();

      $wrapper.append($likeButton, $view, $comment);
      frag.append($wrapper);

      this.$refs = { likeButton: $likeButton, like: like };

      return frag;

   }

   setEvent() {
      
      const { postId } = this.props;
      const { likeButton, like } = this.$refs;

      likeButton.addEventListener('click', async (e) => {
         e.preventDefault();

         const likeState = !this.state.isLiked;

         try {

            if(likeState) {
               const response = await apiFetch(`/posts/${postId}/likes`, {
                  method: 'POST',
                  withAuth: true
               });
               this.setState({ isLiked: likeState, likes: this.state.likes + 1 });
            }
            else {
               const response = await apiFetch(`/posts/${postId}/likes`, {
                  method: 'DELETE',
                  withAuth: true
               });
               this.setState({ isLiked: likeState, likes: this.state.likes - 1});
            }

            likeButton.classList.toggle('is-liked', likeState);
         
         }
         catch(error) {
            console.log(error);
         }

      });

   }

}