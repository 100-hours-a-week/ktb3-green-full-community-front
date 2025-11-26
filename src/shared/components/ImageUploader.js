import Component from "../../core/Component.js";

export default class ImageUploader extends Component {
   setup() {
      this.state = { isUploaded: false, imgUrl: '', text: '추가', errorText: '' };
      this.$refs = {};
   }

   template() {
      const frag = document.createDocumentFragment();

      const $wrapper = document.createElement('div');
      $wrapper.className = 'image-upload-wrapper';

      const $label = document.createElement('div');
      $label.className = 'image-upload-title';
      $label.textContent = '프로필 사진*'

      const $errorText = document.createElement('div');
      $errorText.className = 'input-error-text';
      $errorText.textContent = this.state.errorText;

      const $custom = document.createElement('div');
      $custom.className = 'custom-image-input';
      if(this.state.isUploaded) $custom.style.backgroundImage = `url(${this.state.imgUrl})`;

      const $uploadIcon = document.createElement('div');
      $uploadIcon.className = this.state.isUploaded ? '' : 'fa-solid fa-file-arrow-up custom-image-upload-icon';
      
      const $input = document.createElement('input');
      $input.type = 'file';
      $input.id = 'image';
      $input.className = 'image-input';

      $custom.append($uploadIcon);

      $wrapper.append($label, $errorText, $custom, $input);
      frag.append($wrapper);

      this.$refs = { custom: $custom, input: $input };

      return frag;
   }

   setEvent() {
      
      const { custom, input } = this.$refs;

      custom.addEventListener('click', () => {
         this.setState({ isUploaded: false, imgUrl: '', text: '+', errorText: '*프로필 사진을 추가해주세요.' });

         input.value = '';
         input.click();
      });

      input.addEventListener('change', () => {
         const file = input.files?.[0];
         if(!file) {
            this.setState({ isUploaded: false, imgUrl: '', text: '+' });
         }
         else {
            const url = URL.createObjectURL(file);
            console.log(url);
            this.setState({ isUploaded: true, imgUrl: url, text: '', errorText: '' });
         }

      });
   }
}