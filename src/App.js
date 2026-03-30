import Footer from "./shared/components/Footer.js";
import Header from "./shared/components/Header.js";

export default class App {

   constructor({$target}) {

      this.$target = $target;

      const $headerMount = document.createElement('header');
      $headerMount.id = 'app-header';

      this.$header = new Header({ $target: $headerMount });
      this.$header.setState({isLoggedIn: false, isback: false, profileImg: '' });
      this.$header.render();

      const $mainMount = document.createElement('main');
      $mainMount.id = 'page-content';
      this.$main = $mainMount;

      const $footerMount = document.createElement('footer');
      $footerMount.id = 'app-footer';
      this.$footer = new Footer({ $target: $footerMount });
      this.$footer.render();

      this.$target.append($headerMount, $mainMount, $footerMount);
   }

   mount(node) {
      this.$main.replaceChildren(node);
   }

   updateHeader(state) {
      this.$header.setState(state);
   }


}