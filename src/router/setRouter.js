import { getAuthUser } from "../lib/api.js";
import ErrorPage from "../shared/pages/ErrorPage.js";
import LoginPage from "../features/user/pages/LoginPage.js";
import SignUpPage from "../features/user/pages/SignUpPage.js";
import ProfileEditPage from "../features/user/pages/ProfileEditPage.js";
import PasswordEditPage from "../features/user/pages/PasswordEditPage.js";
import EditPostPage from "../features/post/pages/EditPostPage.js";
import AddPostPage from "../features/post/pages/AddPostPage.js";
import SelectionPage from "../features/post/pages/SelectionPage.js";
import PostListPage from "../features/post/pages/PostListPage.js";
import { clearPageState } from "../localCache.js";
import { getAuth } from "../lib/validateLoginState.js";

const routes = [
   { path: '/', view: () => LoginPage },
   { path: '/posts', view: () => PostListPage },
   { path: '/posts/:id(\\d+)', view: () => SelectionPage },
   { path: '/posts/new', view: () => AddPostPage},
   { path: '/posts/:id/edit', view: () => EditPostPage },
   { path: '/users/new', view: () => SignUpPage},
   { path: '/users/profile/edit', view: () => ProfileEditPage },
   { path: '/users/password/edit', view: () => PasswordEditPage },
   { path: '/error', view: () => ErrorPage },
]

export default function Router(app) {

   function matchRoute(pathname) {

      for (const route of routes) {
         const paramNames = [];
         const pattern = route.path.replace(/:([^/()]+)(\(([^)]+)\))?/g, (_, key, _g2, regex) => {
            paramNames.push(key);
            return `(${regex || '[^/]+'})`;
         });
         const regex = new RegExp(`^${pattern}$`);

         const m = pathname.match(regex);
         if (m) {
            const params = Object.fromEntries(paramNames.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
            return { route, params };
         }
      }

      return null;

   }

   const render = () => {

      const { pathname } = window.location;
      const matched = matchRoute(pathname);

      if(pathname == '/') {
         clearPageState();
         localStorage.clear();
      }

      let page;
      if (matched) {
         page = matched.route.view();
      } 
      else {
         page = new ErrorPage();
      }

      const contentPage = page;

      let headerState;
      if(getAuth()) {
         const authUser = getAuthUser();
         headerState = { isAuthenticated: true, profileImg: authUser.profileImg };
      } 
      else {
         headerState = { isAuthenticated: false, profileImg: null };
      }

      app.setState({ params: matched?.params ?? {}, headerState: headerState, contentPage: contentPage });

   }

   const navigate = (to, state = {}) => {
      if(!to || window.location.pathname === to) return;
      history.pushState(state, '', to);
      console.log('이동: ', to);
      render();
   }

   window.addEventListener('popstate', render);

   return { render, navigate };
}