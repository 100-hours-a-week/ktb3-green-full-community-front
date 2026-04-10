import Component from "../../../core/Component.js";
import h from "../../../core/VdomNode.js";
import { getAuthUser } from "../../../lib/api.js";
import Modal from "../../../shared/components/Modal.js";
import CommentInput from "./CommentInput.js";
import CommentItem from "./CommentItem.js";

export default class Comments extends Component {

   setup() {

      this.state = { isCommentOpen: false, isModalOpen: false, isEditMode: false, editingCommentId: null, editingContent: '' };
      this._openQueued = false;

   }

   template() {

      const { postId, commentList = [], pickNumber, updateComments, isOpen } = this.props;


      const commentItems = commentList.map((comment) => 
         h(CommentItem, {
            componentName: 'comment-item',
            convertToEditMode: ({ commentId, content }) => this.setState({ isEditMode: true, editingCommentId: commentId, editingContent: content }),
            updateComments: updateComments,
            postId: postId,
            commentId: comment.commentId,
            nickname: comment.author.nickname,
            profileImg: comment.author.profileImg,
            content: comment.content,
            updatedAt: comment.updatedAt,
            isSame: comment.pickNumber === pickNumber,
            isOwner: Number(getAuthUser().userId) === Number(comment.author.userId),
         })
      );

      const comments = h('div', { class: 'post-detail-comment-wrapper' },
         h(CommentInput, { componentName: 'commnet-input', class: 'post-detail-comment-input', postId: postId, pickNumber: pickNumber, mode: this.state.isEditMode ? 'edit' : 'create', commentId: this.state.editingCommentId, content: this.state.editingContent, updateComments: updateComments }),
         h('div', { class: 'post-detail-comment-list' }, ...commentItems),
      );

      return (isOpen && this.state.isCommentOpen ) ? comments: null;

   }

   setEvent() {
      const { isOpen, isDelay } = this.props;
      if (!isOpen || this.state.isCommentOpen || this._openQueued) return;

      this._openQueued = true;

      const openComments = () => {
         this._openQueued = false;
         if (!this.props.isOpen || this.state.isCommentOpen) return;
         this.setState({ isCommentOpen: true });
      };

      if (isDelay) {
         setTimeout(openComments, 1500);
         return;
      }

      openComments();
   }
}
