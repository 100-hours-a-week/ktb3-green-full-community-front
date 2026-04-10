import Component from "../../core/Component.js";
import h from "../../core/VdomNode.js";

export default class Footer extends Component {

   template() {

      const footer = h('footer', { class: 'footer'},
         h('div', { class: 'footer-copyright'}, '@2025 KTB3 Green Project'),
         h('div', { class: 'footer-contact' },
            h('a', { href: 'https://github.com/jiyeonyooo', target: '_blank'},
               h('i', { class: 'fa-brands fa-github' }, '')
            ),
            h('a', { href: 'https://www.instagram.com/yeonjiyooo_/', target: '_blank'},
               h('i', { class: 'fa-brands fa-instagram' }, '')),
            h('i', { class: 'fa-solid fa-envelope'}, '')
         )
      );

      return footer;

   }

}