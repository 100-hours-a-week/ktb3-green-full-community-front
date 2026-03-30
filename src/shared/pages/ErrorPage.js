import Component from '../../core/Component.js';

export default class ErrorPage extends Component {
   template() {
      const frag = document.createDocumentFragment();

      const $page = document.createElement('div');
      $page.className = 'error-wrapper';

      const $title = document.createElement('div');
      $title.className = 'error-title';
      $title.textContent = '404 NOT FOUND';

      const $text = document.createElement('div');
      $text.className = 'error-text';
      $text.textContent = '요청하신 페이지를 찾을 수 없습니다!';
      
      $page.append($title, $text);
      frag.appendChild($page);
      return frag;
   }
}