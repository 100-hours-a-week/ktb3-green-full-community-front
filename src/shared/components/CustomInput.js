import Component from "../../core/Component.js";

export default class CustomInput extends Component {

   setup() {
      this.state = { isValidInput: false, errorText: '' };
   }

   template() {

      const { label, name, type, required } = this.props;

      const frag = document.createDocumentFragment();

      const $wrapper = document.createElement('div');
      $wrapper.className = 'common-input-format';

      const $inputWrapper = document.createElement('div');
      $inputWrapper.className = 'common-input-field';

      const $input = document.createElement('input');
      $input.type = type;
      $input.placeholder = label
      $input.id = name;
      if (required) $input.required = true;

      const $hideIcon = document.createElement('i');
      $hideIcon.className = 'fa-solid fa-eye-slash hide-icon';
      $hideIcon.classList.toggle('is-password', type === 'password');

      $inputWrapper.append($input, $hideIcon);

      const $errorText = document.createElement('div');
      $errorText.className = 'input-error-text';
      $errorText.textContent = this.state.errorText;

      $wrapper.append($inputWrapper, $errorText);
      frag.append($wrapper);

      this.$refs = { input: $input, hideIcon: $hideIcon, errorText: $errorText };

      return frag;
   }

   setState(patch) {

      this.state = {...this.state, ...patch};

      if(this.$refs.errorText) {
         this.$refs.errorText.textContent = this.state.errorText || '';
         this.$refs.errorText.hidden = !this.state.errorText;
      }
      
      if(this.$refs.input) {
         this.$refs.input.setAttribute('aria-invalid', String(!this.state.isValidInput));
      }
   }

   setEvent() {

      const { input, hideIcon } = this.$refs;

      hideIcon.addEventListener('click', (e) => {

         const isHidden = input.type === 'password';
         input.type = isHidden ? 'text' : 'password';

         hideIcon.classList.toggle('fa-eye');
         hideIcon.classList.toggle('fa-eye-slash');
      });

   }
}