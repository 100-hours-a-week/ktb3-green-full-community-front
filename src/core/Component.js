import createElement from "./CreateElement.js";
import Diff, { unmountDomTree } from "./DiffAndRerender.js";
import { isDomNode, normalizeNode } from "./VdomNode.js";

export default class Component {

   $target = null;
   $refs = {};
   props = {};
   state = {};
   oldVdom = null;
   _mounted = false;
   _unmounted = false;
   _mountFrameId = null;
   _cleanups = [];
   
   constructor(props = {}) {
      this.$target = props.$target ?? null;
      this.props = props;
      this.setup();
   }
   
   setup() {};

   template() { return  {}; };

   cleanup() {}

   render() {
      if (this._unmounted || !this.$target) return;

      const oldVdom = this.oldVdom;
      const newVdom = normalizeNode(this.template());

      this.oldVdom = newVdom;

      if(!oldVdom || isDomNode(oldVdom) || isDomNode(newVdom)) {
         if (oldVdom) {
            this.unmountChildren();
         }

         this.$target.replaceChildren(createElement(newVdom));
         this.runPostRender();
         return;
      }

      Diff(this.$target, oldVdom, newVdom, 0);
      this.runPostRender();
   }

   runPostRender() {
      if (this._unmounted) return;

      this.setEvent();

      if (this._mounted) return;

      this._mounted = true;
      this._mountFrameId = requestAnimationFrame(() => {
         this._mountFrameId = null;
         if (this._unmounted) return;
         this.afterMount?.();
      });
   }

   setEvent() {};

   addCleanup(cleanup) {
      if (typeof cleanup !== "function") return cleanup;
      this._cleanups.push(cleanup);
      return cleanup;
   }

   flushCleanups() {
      const cleanups = [...this._cleanups];
      this._cleanups.length = 0;

      cleanups.forEach((cleanup) => {
         try {
            cleanup();
         }
         catch (error) {
            console.error("cleanup 실행 중 오류가 발생했습니다.", error);
         }
      });
   }

   unmountChildren() {
      Array.from(this.$target?.childNodes || []).forEach((childNode) => {
         unmountDomTree(childNode);
      });
   }

   unmount({ skipChildren = false } = {}) {
      if (this._unmounted) return;

      this._unmounted = true;

      if (this._mountFrameId !== null) {
         cancelAnimationFrame(this._mountFrameId);
         this._mountFrameId = null;
      }

      try {
         this.cleanup?.();
      }
      catch (error) {
         console.error("cleanup 메서드 실행 중 오류가 발생했습니다.", error);
      }

      if (!skipChildren) {
         this.unmountChildren();
      }

      this.flushCleanups();
      this.$refs = {};
      this.oldVdom = null;
      this._mounted = false;
   }

   useEffect(setup, dependencies = []) {
      if (this._unmounted || typeof setup !== "function") return undefined;

      const cleanup = setup();
      if (typeof cleanup === "function") {
         this.addCleanup(cleanup);
      }

      return cleanup;
   };

   setState(newState) {
      if (this._unmounted) return;
      this.state = {...this.state, ...newState};
      this.render();
   }

}
