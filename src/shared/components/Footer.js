import Component from "../../core/Component.js";

export default class Footer extends Component {

   template() {

      const frag = document.createDocumentFragment();

      const $footer = document.createElement('footer');
      $footer.className = 'footer';

      const $copyright = document.createElement('div');
      $copyright.className = 'footer-copyright';
      $copyright.textContent = '@2025 KTB3 Green Project';

      const $contact = document.createElement('div');
      $contact.className = 'footer-contact';
      
      const $aTagGithub = document.createElement('a');
      $aTagGithub.href = 'https://github.com/jiyeonyooo';
      $aTagGithub.target = '_blank';
      const $aTagInstagram = document.createElement('a');
      $aTagInstagram.href = 'https://www.instagram.com/yeonjiyooo_/';
      $aTagInstagram.target = '_blank';

      const $github = document.createElement('i');
      $github.className = 'fa-brands fa-github'
      const $instagram = document.createElement('i');
      $instagram.className = 'fa-brands fa-instagram';
      const $email = document.createElement('i');
      $email.className = 'fa-solid fa-envelope';

      $aTagGithub.append($github);
      $aTagInstagram.append($instagram);

      $contact.append($aTagGithub, $aTagInstagram, $email);

      $footer.append($copyright, $contact);
      frag.append($footer);

      this.$refs = { github: $github, instagram: $instagram, email: $email };

      return frag;

   }

}