function togglePasswordRecovery() {
   let username = document.getElementById('USERNAME'),
     password = document.getElementById('PASSWORD'),
     login = document.getElementById('LOGIN');
   let data = [username, password, login];

   if (data) {

     let elements = [
       password,
       document.querySelector('label[for="PASSWORD"]'),
       document.getElementsByClassName('rimani_connesso')[0]

     ];
     let display = password.style.display == 'none'
     elements.forEach(element => {
       if (element) element.style.display = display ? 'block' : 'none';
     })


     password.value = display ? '' : '123ENTER456RECOVERY789PASSWORD';

     login.value = display ? 'ACCEDI' : 'RECUPERA PASSWORD';
     let recupera = document.getElementsByClassName('recupera_left')[0];
     if (recupera) recupera.innerHTML = display ? 'Recupera password' : 'Ritorna al login';

   }
 }

 document.getElementsByClassName('recupera_left')[0]?.addEventListener('click', togglePasswordRecovery);


 if (document.frm.UserName.value.length==0)
						document.frm.UserName.focus();
						else
						document.frm.PassWord.focus();