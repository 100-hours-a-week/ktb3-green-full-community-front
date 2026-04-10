import Component from "../../../core/Component.js";
import h from "../../../core/VdomNode.js";

export default class PickResult extends Component {

   setup() {
      this.state = { isResultOpen: false }; 
      this._openQueued = false;
   }

   template() {

      const { isOpen, totalCount, pick1Count, pick2Count, pickNumber } = this.props;

      const pick = Number(pickNumber)
      const safeTotal = totalCount > 0 ? totalCount : (pick1Count + pick2Count);
      const pick1Percent = safeTotal > 0 ? Math.round((pick1Count / safeTotal) * 100) : 0;
      const pick2Percent = safeTotal > 0 ? 100 - pick1Percent : 0;



      const result = h('div', { class: `pick-results-wrapper ${this.props.class}` },
         h('div', { class: `pick-result-box result-1 ${pick === 1 ? 'is-picked' : ''}` },
            h('div', { class: 'pick-result-1' }, `${pick1Percent}%(${pick1Count}표)`),
         ),
         h('div', { class: `pick-result-box result-1 ${pick === 2 ? 'is-picked' : ''}` },
            h('div', { class: 'pick-result-2' }, `${pick2Percent}%(${pick2Count}표)`),
         ),
      );

      return (isOpen && this.state.isResultOpen) ? result : null;

   }

   setEvent() {
      const { isOpen, isDelay } = this.props;
      if (!isOpen || this.state.isResultOpen || this._openQueued) return;

      this._openQueued = true;

      const openResult = () => {
         this._openQueued = false;
         if (!this.props.isOpen || this.state.isResultOpen) return;
         this.setState({ isResultOpen: true });
      };

      if (isDelay) {
         setTimeout(openResult, 1500);
         return;
      }

      openResult();
   }
}
