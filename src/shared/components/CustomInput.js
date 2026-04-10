import Component from "../../core/Component.js";
import h from "../../core/VdomNode.js";

export default class CustomInput extends Component {

   setup() {

      this.state = { hide: true, isValidInput: false, errorText: '' };

      this._bound = false;
      this._type = this.props.type;

      this._onToggle = (e) => {
         const icon = e.target.closest('.hide-icon');
         if (!icon) return;

         this.props = { ...this.props, type: this.props.type === 'password' ? 'text' : 'password'};
         this.setState({ hide: !this.state.hide });
      };

      this._isValid = (e) => {
         const input = e.target.closest('input');
         if(!input) return;

         const { isValid, errorText } = this.props.checkValidation(input.value);
         if(isValid) { this.setState({ errorText: '' }); }
         else { this.setState({ errorText: errorText }); }
      }

   }

   template() {

      const { placeholder, name, type, required } = this.props;
      const isPwInput = this._type === 'password';

      const formInput = h('div', { class: 'common-input-format' },
         h('div', { class: 'common-input-field'}, 
            h('input', { class: `${name}-input`, type: type, placeholder: placeholder, id: name, required: `${required}`}),
            isPwInput ? h('i', { class: `fa-solid ${this.state.hide ? 'fa-eye-slash' : 'fa-eye'} hide-icon` }) : null,
         ),
         h('div', { class: 'input-error-text' }, this.state.errorText)
      );

      return formInput;

   }

   setEvent() {

      if(this._bound) return;
      this._bound = true;

      if(this.$target.querySelector('.hide-icon')) {
         this.$target.querySelector('.hide-icon').addEventListener('click', this._onToggle);
      }

      this.$target.querySelector('input').addEventListener('input', this._isValid);
   
   }
}