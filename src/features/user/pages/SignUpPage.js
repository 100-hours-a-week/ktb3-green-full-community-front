import Component from '../../../core/Component.js';
import h from '../../../core/VdomNode.js';
import SignUpForm from '../components/SignUpForm.js';
import Slogan from '../components/Slogan.js';

export default class SignUpPage extends Component {

   template() {

      const signUpPage = h('div', { class: 'signup-page'},
         h(Slogan, { componentName: 'signup-slogan'}),
         h(SignUpForm, { componentName: 'signup-form'}),
      );

      return signUpPage;

   }
   
}