import Component from "../../../core/Component.js";
import h from "../../../core/VdomNode.js";

export default class Slogan extends Component {
   
   template() {

      const slogan = h('div', { class: 'signup-slogan'},
         h('div', { class: 'slogan-greet'}, '흠... 에 오신 걸 환영해요 👋'),
         h('div', { class: 'slogan-title'}, 'Hmmm..'),
         h('div', { class: 'slogan-text-wrapper'},
            h('span', { class: 'slogan-text white-black'}, '마음껏'),
            h('span', { class: 'slogan-text mint-black'}, '고민'),
            h('span', { class: 'slogan-text gray-black'}, '하고'),
         ),
         h('div', { class: 'slogan-title'}, 'And - Talk!'),
         h('div', { class: 'slogan-text-wrapper'},
            h('span', { class: 'slogan-text gray-black'}, '자유롭게'),
            h('span', { class: 'slogan-text mint-black'}, '이야기'),
            h('span', { class: 'slogan-text gray-black'}, '하자!'),
         ),
      );

      return slogan;

   }

}