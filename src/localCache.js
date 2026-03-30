const STORAGE_KEY = 'pageState';

let store = loadStore();

function loadStore() {
   try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return {};
      return JSON.parse(raw);
   }
   catch(error) {
      console.log('failed to parse pageState from localStorage', error);
      return {};
   }
}

function persist() {
   try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
   }  
   catch(error) {
      console.log('failed to save pageState to localStorage');
   }
}

export function getPageState(key) {
   return store[key] || null;
}

export function savePageState(key, patchState) {
   store[key] = {...(store[key] || {}), ...patchState};
   persist();
}

export function clearPageState() {
   store = {};
   localStorage.removeItem('pageState');
}