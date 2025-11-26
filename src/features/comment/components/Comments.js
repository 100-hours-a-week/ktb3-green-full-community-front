import Component from "../../../core/Component.js";
import { getAuthUser } from "../../../lib/api.js";
import CommentInput from "./CommentInput.js";
import CommentItem from "./CommentItem.js";

export default class Comments extends Component {

   template() {

      const { postId, commentList, pickNumber } = this.props;

      const frag = document.createDocumentFragment();

      const $wrapper = document.createElement('div');
      $wrapper.className = 'post-detail-comment-wrapper';

      const $commentInput = document.createElement('div');
      $commentInput.className = 'post-detail-comment-input';

      const commentInputProps = {
         $target: $commentInput,
         postId: postId,
         pickNumber: pickNumber,
      };

      const commentInput = new CommentInput(commentInputProps);
      commentInput.render();

      const $commentList = document.createElement('div');
      $commentList.className = 'post-detail-comment-list';

      commentList.forEach((comment) => {
         const commentItemProps = {
            postId: postId,
            commentId: comment.commentId,
            nickname: comment.author.nickname,
            profileImg: comment.author.profileImg,
            content: comment.content,
            updatedAt: comment.updatedAt,
            isSame: comment.pickNumber === pickNumber,
            isOwner: Number(getAuthUser().userId) === Number(comment.author.userId),
         }
         console.log(comment);
         const commentItem = new CommentItem(commentItemProps).render();
         $commentList.appendChild(commentItem);
      })

      $wrapper.append($commentInput, $commentList);
      frag.append($wrapper);

      this.$refs = { commentList: $commentList, commentInput: commentInput };

      return frag;
   }

   setEvent() {
      const { commentList, commentInput } = this.$refs;

      commentList.addEventListener('comment:edit', (e) => {
         const { id, content } = e.detail;
         console.log(content);
         commentInput.editMode({ id, content });
      });
   }
}