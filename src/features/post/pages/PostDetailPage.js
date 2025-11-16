import Component from '../../../core/Component.js';
import { apiFetch } from '../../../lib/api.js';
import Comments from '../../comment/components/Comments.js';
import PostDetail from '../components/PostDetail.js';

export default class PostDetailPage extends Component {

   setup() {
      this.state = { isLiked: false };
   }

   template() {
      const frag = document.createDocumentFragment();

      const $page = document.createElement('div');
      $page.className = 'post-detail-wrapper';

      const $post = document.createElement('div');
      $post.className = 'post-detail-post'

      const $comment = document.createElement('div');
      $comment.className = 'post-detail-comment'

      $page.append($post, $comment);
      frag.appendChild($page);

      this.$refs = { postDetail: $post, comment: $comment };

      return frag;
   }

   async afterMount() {

      const { postId } = this.props;
      const { postDetail, comment } = this.$refs;

      try {

         const postResponse = await apiFetch(`/posts/${postId}`, {
            method: 'GET',
            withAuth: false
         });

         const commentResponse = await apiFetch(`/posts/${postId}/comments`, {
            method: 'GET',
            withAuth: false
         });

         const likeResponse = await apiFetch(`/posts/${postId}/likes`, {
            method: 'GET',
            withAuth: true,
         });

         const post = postResponse.data;
         const comments = commentResponse.data;
         const isLiked = likeResponse.data;

         const postDetailProps = {
            $target: postDetail,
            postId: post.postId,
            authorId: post.author.userId,
            title: post.title,
            content: post.content,
            postImg: post.postImg,
            nickname: post.author.nickname,
            profileImg: post.profileImg,
            createdAt: post.createdAt,
            likes: post.likes,
            views: post.views,
            comments: post.comments,
            isLiked: isLiked,
         }
      
         const commentsProps = {
            $target: comment,
            postId: post.postId,
            commentList: comments
         }

         new PostDetail(postDetailProps).render();
         new Comments(commentsProps).render();

         console.log(post);
         console.log(comments);

      } 
      catch (error) {
         console.log(error);
      }
   }

}