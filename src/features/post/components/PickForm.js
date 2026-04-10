import Component from "../../../core/Component.js";
import h from "../../../core/VdomNode.js";

export default class PickForm extends Component {

   template() {

      const { number, title, detail } = this.props;
      const option = number === 1 ? 'A' : 'B';

      const pickContent = {
         option: option,
         titlePlaceholder: `선택지 ${option}`,
         detailPlaceholder: `선택지 ${option}에 대한 상세한 설명을 작성해주세요 💬`,
         title: title,
         detail: detail,
      };

      const pickForm = h('div', { class: `main-format-pick-wrapper pick-${number}`}, 
         h('div', { class: 'main-format-pick-number' }, pickContent.option),
         h('textarea', { class: 'main-format-pick-title pick-title-input', placeholder: pickContent.titlePlaceholder }, pickContent.title),
         h('textarea', { class: 'main-format-pick-detail pick-detail-input', placeholder: pickContent.detailPlaceholder }, pickContent.detail),
      );

      return pickForm;

   }

}