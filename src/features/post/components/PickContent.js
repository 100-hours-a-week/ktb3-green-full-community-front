import Component from "../../../core/Component.js"
import h from "../../../core/VdomNode.js";

export default class PickContent extends Component {

   template() {

      const { number, title, detail, isPicked } = this.props;

      const pick = {
         option: number === 1 ? 'A' : 'B',
         title: title,
         detail: detail,
      };

      const pickContent = h('div', { class: `main-format-pick-wrapper pick-${number} ${isPicked ? 'is-picked' : ''}`.trim() },
         h('div', { class: `main-format-pick-number ${isPicked ? 'is-picked' : ''}`.trim() }, pick.option),
         h('div', { class: `main-format-pick-title ${isPicked ? 'is-picked' : ''}`.trim() }, pick.title),
         h('div', { class: `main-format-pick-detail ${isPicked ? 'is-picked' : ''}`.trim() }, pick.detail)
      );

      return pickContent;

   }

}