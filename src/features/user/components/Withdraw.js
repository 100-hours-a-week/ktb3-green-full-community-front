import Component from "../../../core/Component.js";
import WithdrawModal from "./WithdrawModal.js";

export default class Withdraw extends Component {

   template() {

      const frag = document.createDocumentFragment();

      const $modal = document.createElement('div');
      $modal.className = 'withdraw-modal';

      const $withdraw = document.createElement('div');
      $withdraw.className = 'withdraw-text';
      $withdraw.textContent = '회원 탈퇴';


      frag.append($modal, $withdraw);

      this.$refs = { modal: $modal, withdraw: $withdraw };

      return frag;
   }

   setEvent() {

      const { modal, withdraw } = this.$refs;

      withdraw.addEventListener('click', () => {
         new WithdrawModal({ $target: modal,}).render();
      });
   }

}