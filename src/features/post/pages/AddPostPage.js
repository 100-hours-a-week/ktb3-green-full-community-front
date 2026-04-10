import Component from "../../../core/Component.js";
import h from "../../../core/VdomNode.js";
import PostForm from "../components/PostForm.js";
import HmmForm from "../components/PostForm.js";

export default class AddPostPage extends Component {
   
   template() {

      const addPostPage = h('div', { class: 'post-add-page' },
         h('div', { class: 'post-add-page-title page-title' }, 'Hmmm..🤔 어떤 둘 중 하나가 고민되시나요?'),
         h(PostForm, { componentName: 'post-form', mode: 'create' }),
      );

      return addPostPage;

   }
}