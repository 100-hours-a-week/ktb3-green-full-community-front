import Component from "../../../core/Component.js";

export default class PickResult extends Component {
   
   template() {

      const { totalCount, pick1Count, pick2Count, pickNumber } = this.props;
      
      const safeTotal = totalCount > 0 ? totalCount : (pick1Count + pick2Count);

      const pick1Percent = safeTotal > 0 ? Math.round((pick1Count / safeTotal) * 100) : 0;

      const pick2Percent = safeTotal > 0 ? 100 - pick1Percent : 0;
      
      const frag = document.createDocumentFragment();

      const $result = document.createElement('div');
      $result.className = 'pick-results-wrapper';

      const $pick1 = document.createElement('div');
      $pick1.className = 'pick-result-box result-1';
      const $pick1Result = document.createElement('div');
      $pick1Result.className = 'pick-result-1';
      $pick1Result.textContent = `${pick1Percent}%(${pick1Count}표)`;

      const $pick2 = document.createElement('div');
      $pick2.className = 'pick-result-box result-2';
      const $pick2Result = document.createElement('div');
      $pick2Result.className = 'pick-result-2';
      $pick2Result.textContent = `${pick2Percent}%(${pick2Count}표)`;

      if(pickNumber === 1) $pick1.classList.toggle('is-picked', true);
      else $pick2.classList.toggle('is-picked', true);

      $pick1.append($pick1Result);
      $pick2.append($pick2Result);

      $result.append($pick1, $pick2);
      frag.append($result);

      return frag;

   }

}