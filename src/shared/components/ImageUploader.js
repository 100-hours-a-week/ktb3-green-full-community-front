import Component from "../../core/Component.js";
import h from "../../core/VdomNode.js";

export default class ImageUploader extends Component {

   setup() {

      this.state = { isUploaded: this.props.isUploaded, imgUrl: this.props?.imgUrl ?? '', text: this.props?.text ?? '추가', errorText: '' };
      this._bind = false;
      this._objectUrl = null;

      this._onClick = (e) => {
         const image = e.target.closest('.custom-image-input');
         if(!image) return;
         e.preventDefault();

         const imageInput = this.$target.querySelector('.image-input');
         imageInput.value = '';
         imageInput.click();

         this.setState({ isUploaded: false, imgUrl: '', text: '+', errorText: '*프로필 사진을 추가해주세요.' });

      }

      this._uploadImg = (e) => {
         const imageInput = e.target.closest('.image-input');
         if(!imageInput) return;
         e.preventDefault();

         const file = imageInput.files?.[0];
         if(!file) {
            this.setState({ isUploaded: false, imgUrl: '', text: '+' });
         }
         else {
            const url = URL.createObjectURL(file);
            console.log(url);
            this.setState({ isUploaded: true, imgUrl: url, text: '', errorText: '' });
         }

      }
   }

   template() {

      const imageUploader = h('div', { class: 'image-upload-wrapper' },
         h('div', { class: 'image-upload-title' }, '프로필 사진*'),
         h('div', { class: 'input-error-text'}, this.state.errorText),
         h('div', { class: 'custom-image-input', style: this.state.isUploaded ? `background-image: url("${this.state.imgUrl}")` : "" },
            h('i', { class: this.state.isUploaded ? '' : 'fa-solid fa-file-arrow-up custom-image-upload-icon' }),
         ),
         h('input', { class: 'image-input', type: 'file', id: 'image'})
      );

      return imageUploader;

   }

   setEvent() {
      
      if(this._bind) return;
      this._bind = true;

      this.$target.querySelector('.custom-image-input').addEventListener('click', this._onClick);
      this.$target.querySelector('.image-input').addEventListener('change', this._uploadImg);

   }
}