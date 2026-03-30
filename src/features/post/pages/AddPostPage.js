import Component from "../../../core/Component.js";
import HmmForm from "../components/HmmForm.js";

export default class AddPostPage extends Component {
   
   template() {
      
      const frag = document.createDocumentFragment();

      const $page = document.createElement('div');
      $page.className = 'post-add-page';

      const $title = document.createElement('div');
      $title.className = 'post-add-page-title page-title';
      $title.textContent = 'Hmmm..🤔 어떤 둘 중 하나가 고민되시나요?';

      const $form = document.createElement('div');
      $form.className = 'hmm-add-form';
      const form = new HmmForm({ $target: $form });
      form.render();

      $page.append($title, $form);
      frag.append($page);

      return frag;

   }
}