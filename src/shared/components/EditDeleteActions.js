import Component from "../../core/Component.js";
import h from "../../core/VdomNode.js";
import { getRouter } from "../../router/Router.js";
import Modal from "./Modal.js";

export default class EditDeleteActions extends Component {

   setup() {

      this.state = { isModalOpen: false }
      this.router = getRouter();
      this._bind = false;

      this._onClickEdit = (e) => {
         const editIcon = e.target.closest('.edit-icon');
         if(!editIcon) return;

         switch (this.props.target) {
            case 'post':
               console.log('게시글 수정');
               this.router.navigate(`/posts/${this.props.postId}/edit`, this.props.postState);
               break;
            case 'comment':
               this.props.convertToEditMode(this.props.commentId, this.props.commentContent);
               console.log('댓글 수정');
               break;
         }
      }

      this._onClickDelete = (e) => {
         const deleteIcon = e.target.closest('.delete-icon');
         if(!deleteIcon) return;

         switch (this.props.target) {
            case 'post':
               console.log('게시글 삭제');
               this.setState( { isModalOpen: true });
            case 'comment':
               console.log('댓글 삭제');
               this.setState( { isModalOpen: true });
         }

      }

   }

   template() {

      const { target, postId, commentId, updateComments } = this.props;

      let type;
      switch(target) {
         case 'post':
            type = { target: 'post', postId: postId, message: '게시글을 삭제 하시겠습니까?' };
            break;
         case 'comment':
            type = { target: 'comment', postId: postId, commentId: commentId, message: '댓글을 삭제 하시겠습니까?' };
      }

      const actions = h('div', { class: 'main-format-post-actions' },
         h(Modal, { componentName: 'modal', class: 'delete-modal', ...type , isOpen: this.state.isModalOpen, onCloseDone: () => this.setState({ isModalOpen: false }), updateComments: updateComments }, ),
         h('i', { class: 'fa-solid fa-pen-to-square edit-icon' }),
         h('i', { class: 'fa-solid fa-trash-can delete-icon' })
      );

      return actions;

   }

   setEvent() {

      if(this._bind) return;
      this._bind = true;

      this.$target.querySelector('.edit-icon').addEventListener('click', this._onClickEdit);
      this.$target.querySelector('.delete-icon').addEventListener('click', this._onClickDelete);

   }
}