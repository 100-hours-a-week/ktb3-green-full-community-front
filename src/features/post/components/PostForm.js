import Component from '../../../core/Component.js';
import { createInputWrapper } from '../../../shared/components/formInput.js';
import { apiFetch } from '../../../lib/api.js';
import CustomInput from '../../../shared/components/CustomInput.js';

export default class PostForm extends Component {
   
   setup() {
      this.state = { 
         mode: 'create',
         errorText: '',
      };
   }

   template() {

      const { mode, postId, title, content, image } = this.props;

      const frag = document.createDocumentFragment();

      const $form = document.createElement('form');
      $form.className = 'post-form';

      const $titleWrapper = document.createElement('div');
      $titleWrapper.className = 'post-form-wrapper title';

      const $titleLabel= document.createElement('label');
      $titleLabel.textContent = '제목*';
      $titleLabel.htmlFor = 'title';

      const $titleInput = document.createElement('input');
      $titleInput.type = 'text';
      $titleInput.placeholder = '제목을 입력해주세요. (최대 26자)';
      $titleInput.id = title;

      const $contentWrapper = document.createElement('div');
      $contentWrapper.className = 'post-form-wrapper content';

      const $contentLabel= document.createElement('label');
      $contentLabel.textContent = '내용*'
      $contentLabel.htmlFor = 'content';

      const $contentInput = document.createElement('textarea');
      $contentInput.placeholder = '내용을 입력해주세요';
      $contentInput.id = 'content';

      const $errorText = document.createElement('div');
      $errorText.className = 'input-error-text';
      $errorText.textContent = this.state.errorText;

      if(mode === 'edit') {
         $titleInput.value = title;
         $contentInput.value = content;
      }

      const $imageWrapper = document.createElement('div');
      $imageWrapper.className = 'post-form-wrapper image';

      const $imageLabel= document.createElement('label');
      $imageLabel.textContent = '이미지'
      $imageLabel.htmlFor = 'image';

      const $imageInput = document.createElement('input');
      $imageInput.type = 'file';
      $imageInput.placeholder = '내용을 입력해주세요';
      $imageInput.id = 'image';
      $imageInput.required = false;

      $titleWrapper.append($titleLabel, $titleInput);
      $contentWrapper.append($contentLabel, $contentInput, $errorText);
      $imageWrapper.append($imageLabel, $imageInput);
      
      const $submit = document.createElement('button');
      $submit.type = 'submit';
      $submit.className = 'form-submit-button';
      $submit.textContent = mode === 'edit' ? '수정하기' : '완료';

      $form.append($titleWrapper, $contentWrapper, $imageWrapper, $submit);
      frag.append($form);

      this.$refs = { form: $form, titleInput: $titleInput, contentInput: $contentInput, errorText: $errorText, imageInput: $imageInput, submit: $submit };
      
      return frag;

   }

   setEvent() {

      const mode = this.props.mode;
      const { form, titleInput, contentInput, errorText, submit } = this.$refs;

      titleInput.maxLength = 27;

      titleInput.addEventListener('input', () => {
         const input = titleInput.value || '';
         if(input && contentInput.value) {
            submit.classList.toggle('is-active', true);
         }
      });

      contentInput.addEventListener('input', () => {
         const input = contentInput.value || '';
         if(input && titleInput.value) {
            submit.classList.toggle('is-active', true);
         }
      });
      
      form.addEventListener('submit', async(e) => {
         e.preventDefault();

         const title = titleInput.value;
         const content = contentInput.value;
         
         if(!(title && content)) {
            errorText.textContent = '*제목, 내용을 모두 작성해주세요.';
            submit.classList.toggle('is-active', false);
            return;
         }

         const payload = {
            title: title,
            content: content,      
         };

         try {
            if (mode === 'edit') {
               const response = await apiFetch(`/posts/${this.props.postId}`, {
                  method: 'PATCH',
                  body: payload,
                  withAuth: true
               });
               window.history.pushState({}, '', `/posts/${this.props.postId}`);
               window.dispatchEvent(new PopStateEvent('popstate'));
            }

            else {
               const response = await apiFetch('/posts', {
                  method: 'POST',
                  body: payload,
                  withAuth: true
               });
               window.history.pushState({}, '', `/posts`);
               window.dispatchEvent(new PopStateEvent('popstate'));
            }
         } 
         catch (error) {
            console.log(error);
         }
      })
   }
}
