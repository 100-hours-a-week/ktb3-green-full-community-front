import Component from "../../../core/Component.js";
import PostForm from "../components/PostForm.js";

export default class EditPostPage extends Component {

   template() {

      const { mode, postId, title, content, image } = this.props;

      const frag = document.createDocumentFragment();
      
      const $page = document.createElement('div');
      $page.className = 'post-edit-page';

      const $title = document.createElement('div');
      $title.className = 'post-edit-title';
      $title.textContent = '게시글 수정';

      const $form = document.createElement('div');
      $form.className = 'post-edit-form';
      const form = new PostForm({ $target: $form, mode: mode, postId: postId, title: title, content: content, image: image });
      form.render();
      
      $page.append($title, $form);
      frag.append($page);

      return frag;
      
   }
}