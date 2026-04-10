import Component from "../../core/Component.js";
import h from "../../core/VdomNode.js";

export default class Loading extends Component {

   setup() {
      this.state = { isModalOpen: true };
   }

   template() {

      const { isOpen } = this.props;

      const loadingModal = h('div', { class: `modal-wrapper ${this.state.isModalOpen ? '' : 'out'}` },
         h('div', { class: 'modal modal-loading' },
            h('div', { class: 'modal-loading-spinner' }),
            h('i', { class: 'fa-solid fa-check-to-slot modal-loading-icon'}),
         ),
      );

      return isOpen ? loadingModal : null;

   }

   async afterMount() {

      const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
      await sleep(1500);
      this.setState({ isModalOpen: false });

   }

}