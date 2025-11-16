import Component from "../../../core/Component.js";

export default class PostDetailMain extends Component {

   template() {

      const { postImg, content } = this.props;

      const frag = document.createDocumentFragment();
   
      const $wrapper = document.createElement('div');
      $wrapper.className = 'post-detail-main-wrapper';

      const $postImg = document.createElement('img');
      $postImg.className = 'post-detail-main-img';
      $postImg.src = '/img/profile_img_ms.JPG'; //추후 수정 필요
      const $content = document.createElement('div');
      $content.className = 'post-detail-main-content';
      $content.textContent = content;

      $wrapper.append($postImg, $content);
      frag.append($wrapper);

      return frag;
      
   }
}