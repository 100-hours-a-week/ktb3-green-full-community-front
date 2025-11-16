import Component from "../core/Component.js";

export default class OptionsButton extends Component {

   setup() {
      this.state = { target: '' };
   }
   
   template() {
      const frag = document.createDocumentFragment();

      const $wrapper = document.createElement('div');
      $wrapper.className = 'options-button-wrapper';

      const $buttons = document.createElement('div');
      $buttons.className = 'options-button';

      const $edit = document.createElement('button');
      $edit.textContent = '수정';

      const $delete = document.createElement('button');
      $delete.textContent = '삭제';

      $buttons.append($edit, $delete);
      
      $wrapper.append($buttons);

      frag.append($wrapper);

      this.$refs = { editButton: $edit, deleteButton: $delete };

      return frag;
   }

   setEvent() {

      const { editButton, deleteButton } = this.$refs;

      editButton.addEventListener('click', (e) => {
         e.preventDefault();

         console.log('수정버튼클릭-자식');
      })

   }

}