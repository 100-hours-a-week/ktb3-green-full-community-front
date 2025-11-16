import Header from "./shared/components/Header.js";

export default class App {

   constructor({$target}) {

      this.$target = $target;

      const $headerMount = document.createElement('header');
      $headerMount.id = 'app-header';

      this.$header = new Header({ $target: $headerMount });
      this.$header.setState({isLoggedIn: false, isback: false});
      this.$header.render();

      const $mainMount = document.createElement('main');
      $mainMount.id = 'page-content';
      this.$main = $mainMount;

      this.$target.append($headerMount, $mainMount);
   }

   mount(node) {
      this.$main.replaceChildren(node);
   }

   updateHeader(state) {
      this.$header.setState(state);
   }


}