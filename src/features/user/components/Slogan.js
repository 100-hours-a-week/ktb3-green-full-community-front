import Component from "../../../core/Component.js";

export default class Slogan extends Component {
   
   template() {

      const frag = document.createDocumentFragment();

      const $greet = document.createElement('div');
      $greet.className = 'slogan-greet';
      $greet.textContent = '흠... 에 오신 걸 환영해요 👋';

      const $title = document.createElement('div');
      $title.className = 'slogan-title';
      $title.textContent = 'Hmmm..';

      const $hmmmtext = document.createElement('div');
      $hmmmtext.className = 'slogan-text-wrapper';

      const $text1 = document.createElement('span');
      $text1.className = 'slogan-text white-black';
      $text1.textContent = '마음껏';
      const $text2 = document.createElement('span');
      $text2.className = 'slogan-text mint-black';
      $text2.textContent = '고민';
      const $text3 = document.createElement('span');
      $text3.className = 'slogan-text gray-black';
      $text3.textContent = '하고';

      $hmmmtext.append($text1, $text2, $text3);

      const $title2 = document.createElement('div');
      $title2.className = 'slogan-title';
      $title2.textContent = 'And - Talk!';

      const $talkText = document.createElement('div');
      $talkText.className = 'slogan-text-wrapper';

      const $text4 = document.createElement('span');
      $text4.className = 'slogan-text gray-black';
      $text4.textContent = '자유롭게';
      const $text5 = document.createElement('span');
      $text5.className = 'slogan-text mint-black';
      $text5.textContent = '이야기';
      const $text6 = document.createElement('span');
      $text6.className = 'slogan-text gray-black';
      $text6.textContent = '하자!';

      $talkText.append($text4, $text5, $text6);


      frag.append($greet, $title, $hmmmtext, $title2, $talkText);

      return frag;

   }

}