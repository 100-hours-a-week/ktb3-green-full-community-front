import { getAuthUser } from "./lib/api.js";
import ErrorPage from "./shared/pages/ErrorPage.js";
import LoginPage from "./features/user/pages/LoginPage.js";
import SignUpPage from "./features/user/pages/SignUpPage.js";
import ProfileEditPage from "./features/user/pages/ProfileEditPage.js";
import PasswordEditPage from "./features/user/pages/PasswordEditPage.js";
import EditPostPage from "./features/post/pages/EditPostPage.js";
import AddPostPage from "./features/post/pages/AddPostPage.js";
import SelectionPage from "./features/post/pages/SelectionPage.js";
import PostListPage from "./features/post/pages/PostListPage.js";
import { clearPageState } from "./localCache.js";

const routes = [
   { path: '/', view: () => new LoginPage() },
   { path: '/posts', view: () => new PostListPage() },
   { path: '/posts/:id(\\d+)', view: ({params}) => new SelectionPage({ postId: params.id })},
   { path: '/posts/new', view: () => new AddPostPage()},
   { path: '/posts/:id/edit', view: ({params, state}) => new EditPostPage({ mode: state.mode, postId: params.id, title: state.title, pick1Title: state.pick1Title, pick1Detail: state.pick1Detail, pick2Title: state.pick2Title, pick2Detail: state.pick2Detail })},
   { path: '/users/new', view: () => new SignUpPage()},
   { path: '/users/profile/edit', view: () => new ProfileEditPage() },
   { path: '/users/password/edit', view: () => new PasswordEditPage() },
   { path: '/error', view: () => new ErrorPage() },
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
         page = matched.route.view({ params: matched.params, state: history.state || null });
      } else {
         page = new ErrorPage();
      }

      const authUser = getAuthUser();

      const back = pathname === '/' || pathname ==='/posts';
      const headerState = { isLoggedIn: authUser?.userId ? true : false, isBack: !back, profileImg: authUser?.profileImg ?? null };

      page.$target = app.$main;  
      page.render(); 
      app.updateHeader(headerState);

      page.afterMount?.();
   }

   const navigate = (to) => {
      if(!to || window.location.pathname === to) return;
      history.pushState({}, '', to);
      render();
   }

   window.addEventListener('popstate', render);

   document.addEventListener('click', (e) => {
      const $routeTarget = e.target.closest('[data-route]');
      if (!$routeTarget) return;

      e.preventDefault();

      const path = $routeTarget.getAttribute('data-route');
      if (!path) return;

      navigate(path);
   });

   return { render, navigate };
}