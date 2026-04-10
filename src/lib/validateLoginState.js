export function getAuth() {
   const accessToken = localStorage.getItem('accessToken');

   if (!accessToken) return false;
   else return true;

}