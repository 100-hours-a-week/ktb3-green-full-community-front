import Component from "../../../core/Component.js";
import { apiFetch } from "../../../lib/api.js";
import { clearPageState } from "../../../localCache.js";

export default class HmmForm extends Component {

   setup() {
      this.state = {
         mode: 'create'
      }
   }

   template() {

      const { mode, title, pick1Title, pick1Detail, pick2Title, pick2Detail } = this.props;

      const frag = document.createDocumentFragment();

      const $form = document.createElement('form');
      $form.className = 'main-format post-add';

      const $help = document.createElement('div');
      $help.className = 'hmm-format-help';
      $help.textContent = '작성 방법을 모르겠어요';

      const $title = document.createElement('input');
      $title.className = 'main-format-title title-input';
      $title.type = 'text';
      $title.placeholder = '질문의 제목을 입력해주세요!'

      const $picks = document.createElement('div');
      $picks.className = 'main-format-picks';

      const $pick1Wrapper = document.createElement('div');
      $pick1Wrapper.className = 'main-format-pick-wrapper pick-1';
      const $pick1Number = document.createElement('div');
      $pick1Number.className = 'main-format-pick-number';
      $pick1Number.textContent = 'A';
      const $pick1 = document.createElement('textarea');
      $pick1.className = 'main-format-pick-title pick-title-input'
      $pick1.placeholder= '선택지 A';
      const $pick1Detail = document.createElement('textarea');
      $pick1Detail.className = 'main-format-pick-detail pick-detail-input';
      $pick1Detail.placeholder = '선택지 A에 대한 상세한 설명을 작성해주세요 💬';
      $pick1Wrapper.append($pick1Number, $pick1, $pick1Detail);

      const $pick2Wrapper = document.createElement('div');
      $pick2Wrapper.className = 'main-format-pick-wrapper pick-2';
      const $pick2Number = document.createElement('div');
      $pick2Number.className = 'main-format-pick-number';
      $pick2Number.textContent = 'B';
      const $pick2 = document.createElement('textarea');
      $pick2.className = 'main-format-pick-title pick-title-input';
      $pick2.placeholder = '선택지 B';
      const $pick2Detail = document.createElement('textarea');
      $pick2Detail.className = 'main-format-pick-detail pick-detail-input';
      $pick2Detail.placeholder = '선택지 B에 대한 상세한 설명을 작성해주세요 💬';
      $pick2Wrapper.append($pick2Number, $pick2, $pick2Detail);

      if(mode === 'edit') {
         $title.value = title;
         $pick1.value = pick1Title;
         $pick1Detail.value = pick1Detail;
         $pick2.value = pick2Title;
         $pick2Detail.value = pick2Detail;
      }

      const $formBottom = document.createElement('div');
      $formBottom.className = 'hmm-post-form-bottom';

      const $message = document.createElement('div');
      $message.className = 'add-post-message';
      $message.textContent = '투표자들의 심도 깊은 흠...을 위해서\n선택지과 설명을 최대한 자세히 작성해주세요!'

      const $submitButton = document.createElement('button');
      $submitButton.className = 'hmm-submit-button';
      $submitButton.type = 'submit';
      $submitButton.textContent = mode === 'edit' ? '수정하기' : '등록하기';
      
      $picks.append($pick1Wrapper, $pick2Wrapper);
      $formBottom.append($message, $submitButton);

      $form.append($help, $title, $picks, $formBottom);
      frag.append($form);

      this.$refs = { form: $form, title: $title, pick1: $pick1, pick1Detail: $pick1Detail, pick2: $pick2, pick2Detail: $pick2Detail, submitButton: $submitButton };

      return frag;

   }

   setEvent() {

      const { mode, postId } = this.props;
      const { form, title, pick1, pick1Detail, pick2, pick2Detail, submitButton } = this.$refs;

      form.addEventListener('submit', async(e) => {
         e.preventDefault();

         const payload = {
            title: title.value,
            pick1Title: pick1.value,
            pick1Detail: pick1Detail.value,
            pick2Title: pick2.value,
            pick2Detail: pick2Detail.value,
         }

         console.log(payload);

         try {
            if(mode === 'edit') {
               const response = await apiFetch(`/posts/${postId}`, {
                  method: 'PATCH',
                  body: payload,
                  withAuth: true,
               });
               window.history.pushState({}, '', `/posts/${this.props.postId}`);
               window.dispatchEvent(new PopStateEvent('popstate'));

            }
            else {
               const response = await apiFetch('/posts', {
                  method: 'POST',
                  body: payload,
                  withAuth: true,
               });

               clearPageState();

               window.history.pushState({}, '', '/posts');
               window.dispatchEvent(new PopStateEvent('popstate'));
            }
         }
         catch (error) {
            console.log(error);
         }

      });



   }
}