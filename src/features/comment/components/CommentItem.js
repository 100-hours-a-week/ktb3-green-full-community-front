import Component from "../../../core/Component.js";
import h from "../../../core/VdomNode.js";
import EditDeleteActions from "../../../shared/components/EditDeleteActions.js";
import AuthorInfo from "../../user/components/AuthorInfo.js";

export default class CommentItem extends Component {

   template() {

      const { postId, commentId, nickname, profileImg, content, updatedAt, isSame, isOwner, updateComments } = this.props;

      const [y, m, d] = updatedAt.slice(0, 10).split('-');

      const commentInput = h('div', { class: 'comment-item' }, 
         h('div', { class: 'comment-item-wrapper'},
            h('div', { class: 'comment-info-wrapper' },
               h(AuthorInfo, { componentName: 'author-info', nickname: nickname, profileImg: profileImg, date: `${y}년 ${Number(m)}월 ${Number(d)}일`, samePick: isSame ? 'same' : 'different' } ),
               isOwner ? h(EditDeleteActions, { componentName: 'edit-delete-actions', target: 'comment', postId: postId, commentId: commentId, commentContent: content, convertToEditMode: () => this.props.convertToEditMode({ commentId, content }), updateComments: updateComments }) : null,
            ),
            h('div', { class: 'comment-content-wrapper' },
               h('div', { class: 'comment-content' }, content),
            ),
         ),
      );

      return commentInput;
   }

}