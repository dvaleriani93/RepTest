function togglePasswordRecovery() {
  let username = document.getElementById('USERNAME'),
    password = document.getElementById('PASSWORD'),
    login = document.getElementById('LOGIN');
  let data = [username, password, login];

  if (data) {

    let elements = [
      document.getElementsByClassName('EVO-input-field')[1],
      document.querySelector('label[for="PASSWORD"]'),
      document.getElementsByClassName('rimani_connesso')[0]

    ];
    let display = password.value == '123ENTER456RECOVERY789PASSWORD'
    elements.forEach(element => {
      if (element) element.style.display = display ? 'block' : 'none';
    })


    password.value = display ? '' : '123ENTER456RECOVERY789PASSWORD';
    password.autocomplete = display ? 'on' : 'off';
    username.autocomplete = display ? 'on' : 'off';

    login.value = display ? 'ACCEDI' : 'RIPRISTINA PASSWORD';
    let recupera = document.getElementById('pwd-recovery');
    if (recupera) recupera.innerHTML = display ? 'Password dimenticata?' : 'Ritorna al login';

  }
}

window.addEventListener('load', (event) => {
  document.getElementsByClassName('pwd-recovery')[0]?.addEventListener('click', togglePasswordRecovery);

  //Setto il focus sul primo campo disponibile
  let target = document.frm.UserName.value.length === 0 ? document.frm.UserName : document.frm.PassWord;
  if (target) target.focus();

  let errorBox = document.querySelector('.loginmsg');
  if (errorBox) errorBox.style.display = errorBox.textContent != '\n \n' ? 'block' : 'none';

});

function togglePassword() {
  const input = document.getElementById('PASSWORD');
  const togglePassword = document.getElementById('togglePassword');
  if (input && togglePassword) {
    input.type = input.type == 'password' ? 'text' : 'password';
    togglePassword.style.backgroundImage = 'url(Public/assets/images/action-' + (input.type == 'password' ? 'display' : 'hide') + '-password.png)';

  }
}