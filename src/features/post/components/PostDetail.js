import Component from "../../../core/Component.js";
import { getAuthUser } from "../../../lib/api.js";
import PostCounts from "./PostCounts.js";
import PostDetailHeader from "./PostDetailHeader.js";
import PostDetailMain from "./PostDetailMain.js";

export default class PostDetail extends Component {

   template() {

      const { postId, authorId, title, content, postImg, nickname, profileImg, createdAt, likes, views, comments, isLiked } = this.props;
      
      const frag = document.createDocumentFragment();

      const $wrapper = document.createElement('div');
      $wrapper.className = 'post-detail-post-wrapper';
      
      const $postHeader = document.createElement('div');
      $postHeader.className = 'post-detail-header';

      const $postMain = document.createElement('div');
      $postMain.className = 'post-detail-main';

      const $postCounts = document.createElement('div');
      $postCounts.className = 'post-detail-counts';
      
      const postHeaderProps = {
         $target: $postHeader,
         title: title,
         postId: postId,
         nickname: nickname,
         profileImg: profileImg,
         createdAt: createdAt,
         isOwner: Number(getAuthUser().userId) === Number(authorId),
      };

      const postMainProps = {
         $target: $postMain,
         postImg: postImg,
         content: content
      };

      const postCountProps = {
         $target: $postCounts,
         postId: postId,
         likes: likes,
         views: views,
         comments: comments,
      };

      new PostDetailHeader(postHeaderProps).render();
      new PostDetailMain(postMainProps).render();

      const postCount = new PostCounts(postCountProps);
      postCount.setState({ isLiked: isLiked, likes: likes });

      postCount.render();

      $wrapper.append($postHeader, $postMain, $postCounts);
      frag.append($wrapper);

      this.$refs = { postHeader: $postHeader };

      return frag;
   }

   setEvent() {

      const { title, content, postImg } = this.props;
      const { postHeader } = this.$refs;

      postHeader.addEventListener('post:edit', (e) => {
         const { postId } = e.detail;
         console.log(content);

         const editProps = {
            mode: 'edit',
            title: title,
            content: content,
            postImg: postImg
         }

         window.history.pushState(editProps, '', `/posts/${postId}/edit`);
         window.dispatchEvent(new PopStateEvent('popstate'));

      });

   }


}