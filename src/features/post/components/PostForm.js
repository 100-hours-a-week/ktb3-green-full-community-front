import Component from "../../../core/Component.js";
import h from "../../../core/VdomNode.js";
import { apiFetch } from "../../../lib/api.js";
import { clearPageState } from "../../../localCache.js";
import { getRouter } from "../../../router/Router.js";
import PickForm from "./PickForm.js";

export default class PostForm extends Component {

   setup() {

      this.state = {
         mode: 'create',
      }

      this._bind = false;
      this._router = getRouter();

      this._onSubmit = async(e) => {

         const form = e.target.closest('form');
         const pick1 = form.querySelector('.pick-1');
         const pick2 = form.querySelector('.pick-2');
         if(!form) return;
         e.preventDefault();

         const payload = {
            title: form.querySelector('.title-input').value,
            pick1Title: pick1.querySelector('.pick-title-input').value,
            pick1Detail: pick1.querySelector('.pick-detail-input').value,
            pick2Title: pick2.querySelector('.pick-title-input').value,
            pick2Detail:  pick2.querySelector('.pick-detail-input').value,
         }

         try {
            if(this.props.mode === 'edit') {
               await apiFetch(`/posts/${this.props.postId}`, {
                  method: 'PATCH',
                  body: payload,
                  withAuth: true,
               });

               this._router.navigate(`/posts/${this.props.postId}`);
            }
            else {
               await apiFetch('/posts', {
                  method: 'POST',
                  body: payload,
                  withAuth: true,
               });

               clearPageState();
               this._router.navigate('/posts');
            }
         }
         catch (error) {
            console.log(error);
         }
      }

   }

   template() {

      const { mode, title, pick1Title, pick1Detail, pick2Title, pick2Detail } = this.props;
      console.log('점검: ', this.props);

      const postForm = h('form', { class: 'main-format post-add' },
         mode === 'create' ? h('div', { class: 'post-format-help' }, '작성 방법을 모르겠어요!') : null,
         h('input', { class: 'main-format-title title-input', type: 'text', placeholder: '질문의 제목을 입력해주세요!', value: mode === 'create' ? '' : title }),
         h('div', { class: 'main-format-picks' }, 
            h(PickForm, { componentName: 'pick-form', mode: this.props.mode, number: 1, title: pick1Title, detail: pick1Detail }),
            h(PickForm, { componentName: 'pick-form', mode: this.props.mode, number: 2, title: pick2Title, detail: pick2Detail }),
         ),
         h('div', { class: 'post-form-bottom' },
            h('div', { class: 'add-post-message' }, '투표자들의 심도 깊은 흠...을 위해서\n선택지과 설명을 최대한 자세히 작성해주세요!'),
            h('button', { class: 'post-submit-button', type: 'submit' }, `${this.props.mode === 'edit' ? '수정하기' : '등록하기'}`),
         ),
      )

      return postForm;

   }

   setEvent() {

      if(this._bind) return;
      this._bind = true;

      this.$target.querySelector('form').addEventListener('submit', this._onSubmit);

   }
}