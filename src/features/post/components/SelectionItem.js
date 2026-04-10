import Component from "../../../core/Component.js";
import h from "../../../core/VdomNode.js";
import { apiFetch } from "../../../lib/api.js";
import EditDeleteActions from "../../../shared/components/EditDeleteActions.js";
import Modal from "../../../shared/components/Modal.js";
import AuthorInfo from "../../user/components/AuthorInfo.js";
import PickContent from "./PickContent.js";

export default class SelectionItem extends Component {

   setup() {

      this.state = { isSelected: false, pick1: false, pick2: false, showResults: false };
      this._bind = false;

      this._onClick = (e) => {
         const pick = e.target.closest('.main-format-pick-wrapper');
         if(!pick || this.props.isPicked) return;
         e.preventDefault();

         const pickNumber = pick.classList.contains('pick-1') ? 1 : 2;
         const isPick1 = pickNumber === 1;
         const isPick2 = !isPick1;

         this.setState({ isSelected: true, pick1: isPick1, pick2: isPick2 });

      }

      this._onPick = async (e) => {
         const button = e.target.closest('.selection-button');
         if(!button || !this.state.isSelected) return;
         e.preventDefault();

         const number = this.state.pick1 ? 1 : 2;

         const payload = {
            postId: this.props.postId,
            pickNumber: number,
         }
         
         try {

            const response = await apiFetch(`/posts/${this.props.postId}/picks`, {
               method: 'POST',
               body: payload,
               withAuth: true,
            });

            console.log(response);
            this.props.showResults(number);

         }
         catch(error) {
            console.log(error);
         }


      }

   }

   template() {

      const { postId, authorNickname, authorProfile, updatedAt, title, pick1Title, pick1Detail, pick2Title, pick2Detail, isPicked, isOwner, showResults  } = this.props;
      const [y, m, d] = updatedAt?.slice(0, 10).split('-') ?? [];
      const formattedDate = y ? `${y}년 ${Number(m)}월 ${Number(d)}일` : '';

      const postState = {
         postId: postId,
         title: title,
         pick1Title: pick1Title,
         pick1Detail: pick1Detail,
         pick2Title: pick2Title,
         pick2Detail: pick2Detail,
      };

      const selectionItem = h('form', { class: 'main-format post-view'},
         h('div', { class: 'main-format-post' },
            h('div', { class: 'main-format-author' },
               h(AuthorInfo, { componentName: 'author-info', nickname: authorNickname, profileImg: authorProfile, date: formattedDate } ),
               isOwner ? h(EditDeleteActions, { componentName: 'edit-delete-actions', target: 'post', postId: postId, postState: postState }) : null,
            ),
            h('div', { class: 'main-format-header post-view' },
               h('div', { class: 'main-format-title post-view' }, title),
             ),
            h('div', { class: 'main-format-picks post-view' },
               h(PickContent, { componentName: 'pick-content', number: 1, title: pick1Title, detail: pick1Detail, isPicked: this.state.pick1 }),
               h(PickContent, { componentName: 'pick-content', number: 2, title: pick2Title, detail: pick2Detail, isPicked: this.state.pick2 }),
            )
         ),
         h('button', { class: `main-format-button selection-button ${!isPicked ? '' : 'is-hidden'}`, type: 'button' }, this.state.isSelected ? '선택 완료' : 'Hmmm..'),
      );

      return selectionItem;

   }

   setEvent() {
      
      if(this._bind) return;
      this._bind = true;

      const pick = this.$target.querySelector('.main-format-picks');
      const submitButton = this.$target.querySelector('.selection-button');

      pick.addEventListener('click', this._onClick);
      submitButton.addEventListener('click', this._onPick);

   }

}
