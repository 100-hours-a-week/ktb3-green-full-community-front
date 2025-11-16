import Component from "../../../core/Component.js";
import PostForm from "../components/PostForm.js";

export default class AddPostPage extends Component {

   template() {

      const frag = document.createDocumentFragment();

      const $page = document.createElement('div');
      $page.className = 'post-add-page';

      const $title = document.createElement('div');
      $title.className = 'post-add-title';
      $title.textContent = '게시글 작성';

      const $form = document.createElement('div');
      $form.className = 'post-add-form';
      const form = new PostForm({ $target: $form });
      form.render();

      $page.append($title, $form);
      frag.append($page);

      return frag;

   }
}