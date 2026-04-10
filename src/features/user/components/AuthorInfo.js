import Component from "../../../core/Component.js";
import h from "../../../core/VdomNode.js";

export default class AuthorInfo extends Component {

   template() {

      const { nickname, profileImg, date, samePick } = this.props;
      const profileStyle = profileImg ? `background-image: url("${profileImg}")` : "";

      const authorInfo = h('div', { class: 'main-format-author-info'},
         h('div', { class: 'main-format-profile-img', style: profileStyle }),
         h('div', { class: 'main-format-nickname-date'},
            h('div', { class: `main-format-author-nickname ${samePick ? samePick : ''}` }, nickname),
            h('div', { class: `main-format-created-at ${samePick ? 'comment' : ''}` }, date),
         ),
      );

      return authorInfo;

   }

}
