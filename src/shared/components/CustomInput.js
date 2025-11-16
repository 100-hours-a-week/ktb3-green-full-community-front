import Component from "../../core/Component.js";

export default class CustomInput extends Component {

   setup() {
      this.state = { isValidInput: false, errorText: '' };
   }

   template() {

      const { label, name, type, placeholder, required } = this.props;

      const frag = document.createDocumentFragment();

      const $wrapper = document.createElement('div');
      $wrapper.className = 'wrapper-form';

      const $label= document.createElement('label');
      $label.textContent = label
      $label.htmlFor = name;

      const $input = document.createElement('input');
      $input.type = type;
      $input.placeholder = placeholder;
      $input.id = name;
      if (required) $input.required = true;

      const $errorText = document.createElement('div');
      $errorText.className = 'input-error-text';
      $errorText.textContent = this.state.errorText;

      $wrapper.append($label, $input, $errorText);

      frag.append($wrapper);

      this.$refs = { input: $input, errorText: $errorText };

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
}