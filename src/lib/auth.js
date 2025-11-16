export function getAuth() {
   const accessToken = localStorage.getItem('accessToken');

   if (!accessToken) return { isLoggedIn: false };
   else return { isLoggIn: true };

}

export function isValidPassword(password) {
   const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()\-\_=+\[\]{}\\|;:'",.<>\/?]).{8,20}$/;
   return regex.test(password);
}

export function isValidNickname(nickname) {
   if (typeof nickname !== 'string') return false;

   const trimmed = nickname.trim();            
   const charCount = Array.from(trimmed).length;  

   if (charCount === 0 || charCount > 10) return false;

   const allow = /^[A-Za-z0-9가-힣._-]+$/;
   return allow.test(trimmed);
}

export function isValidEmail(email) {
  if (typeof email !== 'string') return false;

  const s = email.trim();
  if (!s || s.length > 320) return false; 

  const reBasic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return reBasic.test(s);
}