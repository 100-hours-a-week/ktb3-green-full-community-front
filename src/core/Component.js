export default class Component {

   $target = null;
   $refs = {};
   props = {};
   state = {};
   
   constructor(props = {}) {
      this.$target = props.$target ?? null;
      this.props = props;
      this.setup();
   }
   
   setup() {};

   template() { return document.createDocumentFragment(); };

   render() {
      const node = this.template();
      this.setEvent?.();
      if (this.$target) {
         this.$target.replaceChildren(node);
      }
      return node;
   }

   setEvent() {};

   setState(newState) {
      this.state = {...this.state, ...newState};
      this.render();
   }
}