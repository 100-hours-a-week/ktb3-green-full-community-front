import Component from "../../core/Component.js";

export default class Loading extends Component {

   template() {

      const frag = document.createDocumentFragment();

      const $wrapper = document.createElement('div');
      $wrapper.className = 'modal-wrapper';

      const $loading = document.createElement('div');
      $loading.className = 'modal modal-loading';

      const $spinner = document.createElement('div');
      $spinner.className = 'modal-loading-spinner';

      const $voteIcon = document.createElement('i');
      $voteIcon.className = 'fa-solid fa-check-to-slot modal-loading-icon';

      $loading.append($spinner, $voteIcon);
      $wrapper.append($loading);
      frag.append($wrapper);

      this.$refs = { wrapper: $wrapper };

      return frag;

   }

}