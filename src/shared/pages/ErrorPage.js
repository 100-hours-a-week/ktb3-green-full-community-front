import Component from '../../core/Component.js';

export default class ErrorPage extends Component {

   template() {

      const errorPage = h('div', { class: 'error-wrapper'},
         h('div', { class: 'error-title' }, '404 NOT FOUND'),
         h('div', { class: 'error-text' }, '요청하신 페이지를 찾을 수 없습니다!'),
      );

      return errorPage;
      
   }

}