import Component from "../../../core/Component.js";
import h from "../../../core/VdomNode.js";
import { apiFetch, getAuthUser } from "../../../lib/api.js";
import { getRouter } from "../../../router/Router.js";
import Loading from "../../../shared/components/Loading.js";
import Modal from "../../../shared/components/Modal.js";
import Comments from "../../comment/components/Comments.js";
import PickResult from "../components/PickResult.js"
import PostForm from "../components/PostForm.js";
import SelectionItem from "../components/SelectionItem.js";

export default class SelectionPage extends Component {

   setup() {

      this.state = { isDelay: true, isModalOpen: false, isPicked: false, pickNumber: 0, postDetailProps: {}, postResultProps: {}, commentsProps: {} };
      this.router = getRouter();
      this._bind = false;

      this._showResult = async (pickNumber) => {

         const updatedPostDeatilsProps = { ...this.state.postDetailProps, isPicked: true };
         const base = this.state.postResultProps;
         const updatedPostResultProps = { ...this.state.postResultProps, totalCount: base.totalCount + 1, pick1Count: base.pick1Count + (pickNumber === 1 ? 1 : 0), pick2Count: base.pick2Count + (pickNumber === 2 ? 1 : 0), pickNumber: pickNumber };
         this.setState({ isModalOpen: true, isDelay: true, isPicked: true, postDetailProps: updatedPostDeatilsProps, postResultProps: updatedPostResultProps });
      
      }

      this._updateComment = async () => {

         const commentResponse = await apiFetch(`/posts/${this.props.params.id}/comments`, {
            method: 'GET',
            withAuth: false,
         });

         const updatedCommentsProps = { ...this.state.commentsProps, commentList: commentResponse.data };
         this.setState({ isDelay: false, isModalOpen: false, commentsProps: updatedCommentsProps });

      }

   }

   template() {

      const postDetailProps = this.state.postDetailProps;
      const postResultProps = this.state.postResultProps;
      const commentsProps = this.state.commentsProps;

      const isPicked = this.state.isPicked;
      console.log('투표 여부: ', isPicked);

      console.log('PickResult:', PickResult);

      const selectionPage = h('div', { class: 'selection-page page'},
         h(Loading, { componentName: 'loading-modal', isOpen: this.state.isModalOpen }),
         h('div', { class: 'selection-page-title' }, '둘 중 하나를 선택하고 투표 결과를 확인해보세요!'),
         h('div', { class: 'selction-form' },
            h(SelectionItem, { componentName: 'post-form', ...postDetailProps, showResults: this._showResult }),
         ),
         h(PickResult, { componentName: 'pick-result', isOpen: this.state.isPicked, isDelay: this.state.isDelay, ...postResultProps }),
         h('div', { class: 'comment'},
            h(Comments, { componentName: 'comments', ...commentsProps, isOpen: this.state.isPicked, isDelay: this.state.isDelay, updateComments: this._updateComment }),
         ),
      );

      return selectionPage;
      
   }

   setEvent() {
   }

   async afterMount() {

      const postId = this.props.params.id;
      
      try {
         const [postReponse, commentResponse] = await Promise.all([
            apiFetch(`/posts/${postId}`, {
               method: 'GET',
               withAuth: false,
            }),
            apiFetch(`/posts/${postId}/comments`, {
               method: 'GET',
               withAuth: false,
            }),
         ]);

         let pickNumber = 0;
         try {
            const pickResponse = await apiFetch(`/posts/${postId}/picks`, {
               method: 'GET',
               withAuth: true,
            });
            pickNumber = Number(pickResponse.data?.pickNumber ?? 0);
         }
         catch (error) {
            console.log('투표 정보 조회 실패:', error);
         }

         const post = postReponse.data;
         const comments = commentResponse.data;
         const isPicked = pickNumber !== 0;
         const authUser = getAuthUser();
         
         const postDetailProps = {
            postId: post.postId,
            authorNickname: post.author.nickname,
            authorProfile: post.author.profileImg,
            updatedAt: post.updatedAt,
            title: post.title,
            pick1Title: post.pick1.pickTitle,
            pick1Detail: post.pick1.pickDetail,
            pick2Title: post.pick2.pickTitle,
            pick2Detail: post.pick2.pickDetail,
            isPicked: isPicked,
            isOwner: Number(authUser.userId) === Number(post.author.userId),
         }

         const postResultProps = {
            totalCount: post.pickCount,
            pick1Count: post.pick1.pickCount,
            pick2Count: post.pick2.pickCount,
            pickNumber: pickNumber,
         }
         
         const commentsProps = {
            postId: post.postId,
            commentList: comments,
            pickNumber: pickNumber,
         }

         this.setState({ isDelay: isPicked ? false : true, isPicked: isPicked, postDetailProps: postDetailProps, postResultProps: postResultProps, commentsProps: commentsProps });

      }
      catch(error) {
         console.log(error);
      }
   }

}
