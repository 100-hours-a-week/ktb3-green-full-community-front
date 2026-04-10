import Component from "../../../core/Component.js";
import h from "../../../core/VdomNode.js";
import PostForm from "../components/PostForm.js";

export default class EditPostPage extends Component {

   template() {

      const editPostPage = h('div', { class: 'post-edit-page' },
         h('div', { class: 'post-add-page-title page-title' }, 'Hmmm..🤔 내용을 수정 중입니다!'),
         h(PostForm, { componentName: 'post-form', mode: 'edit', ...this.state }),
      )

      return editPostPage;
      
   }

   async afterMount() {

      const postState = history.state;
      console.log('상태: ', postState);
      this.setState({...postState});

   }


}