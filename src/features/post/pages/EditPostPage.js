import Component from "../../../core/Component.js";
import HmmForm from "../components/HmmForm.js";

export default class EditPostPage extends Component {

   template() {

      const { mode, postId, title, pick1Title, pick1Detail, pick2Title, pick2Detail } = this.props;

      const frag = document.createDocumentFragment();
      
      const $page = document.createElement('div');
      $page.className = 'post-edit-page';

      const $title = document.createElement('div');
      $title.className = 'post-add-page-title page-title';
      $title.textContent = 'Hmmm..🤔 내용을 수정 중입니다!';

      const $form = document.createElement('div');
      $form.className = 'post-edit-form';
      const form = new HmmForm({ $target: $form, mode: mode, postId: postId, title: title, pick1Title: pick1Title, pick1Detail: pick1Detail, pick2Title: pick2Title, pick2Detail: pick2Detail });
      form.render();
      
      $page.append($title, $form);
      frag.append($page);

      return frag;
      
   }
}