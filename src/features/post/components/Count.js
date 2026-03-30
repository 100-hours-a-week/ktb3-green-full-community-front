import Component from "../../../core/Component.js";

export default class Count extends Component {

   template() {

      const { type, count } = this.props;

      const frag = document.createDocumentFragment();

      const $wrapper = document.createElement('div');
      $wrapper.className = 'count-wrapper';

      const $type = document.createElement('div');
      $type.className = 'count-title'
      $type.textContent = type;
      const $count = document.createElement('div');
      $count.className = 'count-value'
      $count.textContent = count;

      $wrapper.append($count, $type);
      frag.append($wrapper);

      return frag;
   }

}