import Component from "../../../core/Component.js";
import { apiFetch } from "../../../lib/api.js";

export default class HmmItem extends Component {

   template() {

      const { title, pick1, pick2, pickCount, nickname } = this.props;

      const frag = document.createDocumentFragment();

      const $wrapper = document.createElement('div');
      $wrapper.className = 'hmm-item';

      const $title = document.createElement('div');
      $title.className = 'hmm-item-title';

      const $titleTop = document.createElement('div');
      $titleTop.className = 'hmm-item-title-top';
      const $titleBottom = document.createElement('div');
      $titleBottom.className = 'hmm-item-title-bottom';
      
      const $question = document.createElement('div');
      $question.className = 'hmm-item-title-question';
      $question.textContent = title;

      const $type = document.createElement('div');
      $type.className = 'hmm-item-title-type';
      $type.textContent = '🔥 HOT';

      $titleTop.append($question, $type);

      const $viewing = document.createElement('div');
      $viewing.className = 'hmm-item-title-viewing';
      $viewing.textContent = `${pickCount}명이 흠...에 참여하고 있어요!`;

      const $author = document.createElement('div');
      $author.className = 'hmm-item-title-author';
      $author.textContent = `by ${nickname}`;

      $titleBottom.append($viewing, $author);

      $title.append($titleTop, $titleBottom);

      const $picks = document.createElement('div');
      $picks.className = 'hmm-item-picks';

      const $pick1 = document.createElement('div');
      $pick1.className = 'hmm-item-pick pick-1'
      $pick1.textContent = pick1;
      const $pick2 = document.createElement('div');
      $pick2.className = 'hmm-item-pick pick-2';
      $pick2.textContent = pick2;
      
      $picks.append($pick1, $pick2);

      $wrapper.append($title, $picks);
      frag.append($wrapper);

      this.$refs = { postItem: $wrapper };
      
      return frag;

   }

   setEvent() {
      const { postItem } = this.$refs;
      const { postId } = this.props;

      postItem.addEventListener('click', async(e) => { 
         e.preventDefault();

         try {
            const response = await apiFetch(`/posts/${postId}`, {
               method: 'GET',
               withAuth: true,
            });

            window.history.pushState({}, '', `/posts/${postId}`);
            window.dispatchEvent(new PopStateEvent('popstate'));
         }
         catch(error) {
            console.log(error);
         }

      });
   }

}