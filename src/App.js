import Component from "./core/Component.js";
import h from "./core/VdomNode.js";
import Footer from "./shared/components/Footer.js";
import Header from "./shared/components/Header.js";

export default class App extends Component {

   setup () {}

   template () {

      const { params, headerState, contentPage } = this.state;

      const vdom = 
         h('div', { id: 'content' },
            h(Header, { componentName: 'header', ...headerState }),
            h(contentPage, { componentName: 'content-page', params: params }),
            h(Footer, { componentName: 'footer' })
         );
   
      return vdom;

  }

  setEvent () {}

}