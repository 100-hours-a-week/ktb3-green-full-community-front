import Component from "../../../core/Component.js";
import { apiFetch, getAuthUser } from "../../../lib/api.js";
import Loading from "../../../shared/components/Loading.js";
import Comments from "../../comment/components/Comments.js";
import PickResult from "../components/PickResult.js";
import SelectionItem from "../components/SelectionItem.js";

export default class SelectionPage extends Component {

   setup() {
      this.state = { isPicked: false, pickNumber: 0, postResultProps: {}, commentsProps: {} };
   }

   template() {

      const frag = document.createDocumentFragment();

      const $modal = document.createElement('div');
      $modal.className = 'comment-modal';

      const $page = document.createElement('div');
      $page.className = 'selection-page page';

      const $title = document.createElement('div');
      $title.className = 'selection-page-title';
      $title.textContent = '둘 중 하나를 선택하고 전체 결과를 확인해보세요!';

      const $form = document.createElement('div');
      $form.className = 'selection-form';

      const $pickResult = document.createElement('div');
      $pickResult.className = 'pick-result';

      const $comment = document.createElement('div');
      $comment.className = 'comment';

      $page.append($title, $form, $pickResult, $comment );
      frag.append($modal, $page);

      this.$refs = { modal: $modal, title: $title, formMount: $form, resultMount: $pickResult, commentMount: $comment };

      return frag;
   }

   async afterMount() {

      const { postId } = this.props;
      const { title, formMount, commentMount } = this.$refs;
      
      try {

         const postReponse = await apiFetch(`/posts/${postId}`, {
            method: 'GET',
            withAuth: false,
         });

         const commentResponse = await apiFetch(`/posts/${postId}/comments`, {
            method: 'GET',
            withAuth: false,
         });

         const pickResponse = await apiFetch(`/posts/${postId}/picks`, {
            method: 'GET',
            withAuth: true,
         });

         const post = postReponse.data;
         const comments = commentResponse.data;
         const isPicked = pickResponse.data.pickNumber === 0 ? false : true;

         console.log(pickResponse.data);
         console.log(post);
         
         const postDetailProps = {
            $target: formMount,
            postId: post.postId,
            authorNickname: post.author.nickname,
            authorProfile: post.author.profileImg,
            title: post.title,
            pick1Title: post.pick1.pickTitle,
            pick1Detail: post.pick1.pickDetail,
            pick2Title: post.pick2.pickTitle,
            pick2Detail: post.pick2.pickDetail,
            isPicked: isPicked,
            isOwner: Number(getAuthUser().userId) === Number(post.author.userId),
         }

         const postResultProps = {
            totalCount: post.pickCount,
            pick1Count: post.pick1.pickCount,
            pick2Count: post.pick2.pickCount,
            pickNumber: pickResponse.data.pickNumber,
         }
         
         const commentsProps = {
            $target: commentMount,
            postId: post.postId,
            commentList: comments,
            pickNumber: pickResponse.data.pickNumber,
         }

         this.state.postResultProps = postResultProps;
         this.state.commentsProps = commentsProps;

         new SelectionItem(postDetailProps).render();

         if(isPicked) {
            console.log('이미 투표된 게시글입니다');
            this.state.isPicked = true;
            title.classList.toggle('is-hidden', this.state.isPicked);

            this.loadComment(postResultProps, commentsProps);
         }

      }
      catch(error) {
         console.log(error);
      }
   }

   loadComment(postResultProps, commentsProps) {

      const { totalCount, pick1Count, pick2Count, pickNumber } = postResultProps;
      const { resultMount, commentMount } = this.$refs;

      const pickResult = new PickResult({ $target: resultMount, totalCount: totalCount, pick1Count: pick1Count, pick2Count: pick2Count, pickNumber: pickNumber });
      pickResult.render();

      const comment = new Comments(commentsProps);
      comment.render();
   }

   setEvent() {

      const { title, formMount } = this.$refs;

      formMount.addEventListener('post:pick', async (e) => {
         const { pickNumber } = e.detail;
         console.log('투표 완료'); 

         title.classList.toggle('is-hidden', true);
         formMount.classList.toggle('is-picked-format', true);

         await this.showModal();

         const base = this.state.postResultProps;
         const commentBase = this.state.commentsProps;

         const updated = {
            ...base,
            totalCount: base.totalCount + 1,
            pick1Count: base.pick1Count + (pickNumber === 1 ? 1 : 0),
            pick2Count: base.pick2Count + (pickNumber === 2 ? 1 : 0),
            pickNumber,
         };

         const commentUpdated = {
            ...commentBase,
            pickNumber,
         }

         this.loadComment(updated, commentUpdated);

      });
   }

   async showModal() {

      const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

      const { modal } = this.$refs;

      const loadingModal = new Loading({
         $target: modal,
         target: 'logout',
         message: '대기',
      });

      loadingModal.render();

      await sleep(1500);

      const { wrapper } = loadingModal.$refs;
      wrapper.classList.add('out');

   }

}