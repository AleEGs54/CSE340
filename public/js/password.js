const showButton = document.querySelector('.show-pswd')
  showButton.addEventListener('click', ()=>{
    const pwdInput = document.querySelector('#account_password');
    if (pwdInput.type === 'password'){
      pwdInput.setAttribute('type', 'text')
      showButton.textContent = 'Hide Password'
    } else {
      pwdInput.setAttribute('type', 'password')
      showButton.textContent = 'Show Password'
    }
})
