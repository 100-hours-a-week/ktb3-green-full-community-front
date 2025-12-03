export function getAuth() {
   const accessToken = localStorage.getItem('accessToken');

   if (!accessToken) return { isLoggedIn: false };
   else return { isLoggIn: true };

}