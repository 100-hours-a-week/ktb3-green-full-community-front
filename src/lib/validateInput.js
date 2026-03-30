export function isValidPassword(password) {

   if (typeof password !== 'string') {
      return {
         isValid: false,
         errorText: '*비밀번호 입력값 타입이 유효하지 않습니다.',
      }
   }

   const passwordValue = password.trim();

   const validRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()\-\_=+\[\]{}\\|;:'",.<>\/?]).{8,20}$/;
   const isValid = validRegex.test(passwordValue);
   return {
      isValid: isValid,
      errorText: isValid ? '' : '*비밀번호는 8자 이상, 20자 이하이며, 대문자/소문자/숫자/특수문자를 각각 최소 1개씩 포함해야 합니다.'
   };

}

export function isValidNickname(nickname) {

   if (typeof nickname !== 'string') {
      return {
         isValid: false,
         errorText: '*닉네임 입력값 타입이 유효하지 않습니다.',
      }
   }

   const nicknameValue = nickname.trim();            

   const validRegex = /^[A-Za-z0-9가-힣._-]+$/;
   const isValid = validRegex.test(nicknameValue);
   return {
      isValid: isValid,
      errorText: isValid ? '' : '*닉네임은 최대 10자까지 설정 가능합니다.',
   }

}

export function isValidEmail(email) {

   if (typeof email !== 'string') {
      return {
         isValid: false,
         errorText: '*이메일 입력값 타입이 유효하지 않습니다.',
      }
   }

   const emailValue = email.trim();
   if (!emailValue || emailValue.length > 320) {
      return {
         isValid: false,
         errorText: '*유효한 이메일 길이의 범위를 벗어났습니다.',
      }
   }

   const validRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   const isValid = validRegex.test(emailValue);
   return {
      isValid: isValid,
      errorText: isValid ? '' : '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)',
   }

}