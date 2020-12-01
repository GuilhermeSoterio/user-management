class UserController {

  constructor(formId, tableId){
      this.formEl = document.getElementById(formId);
      this.tableEl = document.getElementById(tableId);

      this.onSubmit();
      this.onEdit();

  }
  onEdit(){

    document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{

      this.showPanelCreate();

    });
  }

  onSubmit(){

    this.formEl.addEventListener("submit", event =>{

      event.preventDefault();
      //Nessa classe que eu to, quero acessar o método getValues
      let btn = this.formEl.querySelector("[type=submit]")
      
      btn.disabled = true;
      
      let values = this.getValues();

      if (!values) return false;

      this.getPhoto().then(
        (content)=>{

          values.photo = content;

          this.addLine(values);

          this.formEl.reset();

          btn.disabled = false;
        }, 
        (e)=>{
          console.error(e);
        }
    );

    });

  }//fechando metodo onSubmit

  getPhoto(){
    return new Promise((resolve, reject)=>{


    let fileReader = new FileReader();

    let elements = [...this.formEl.elements].filter(item=>{

      if (item.name === 'photo') {
        return item;
      }

    });

    let file = elements[0].files[0];

    fileReader.onload = () =>{

      resolve(fileReader.result);
    };

    fileReader.onerror = (e)=>{

      reject(e);

    };

    if (file) {
      fileReader.readAsDataURL(file);
    }
    else{
      resolve('dist/img/boxed-bg.jpg');
    }

  });

}

  getValues(){

  //let é uma variavel que só existe dentro do getvalues
  let user = {};
  let isValid = true;  
  //spread é um operador que serve pra distribuir os indices sem precisar colocar todos.
  [...this.formEl.elements].forEach(function(field, index){

    if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){

      field.parentElement.classList.add('has-error');
      isValid = false;

    }

      if (field.name == "gender") {
  
        if (field.checked) {
          user[field.name] = field.value;
        }
  
      } else if (field.name == "admin"){
      
        user[field.name] = field.checked;
   
      }else {

        user[field.name] = field.value;

      }
  
    });
//---------------Validação de formulário--------------------
    if (!isValid){
      return false;
    }
  //Criando um objeto da classe usuário, com a variavel objectUser
  //Esse é uma forma reduzida de instanciar um objeto
    return new User(
      user.name,
      user.gender,
      user.birth,
      user.country,
      user.email, 
      user.password, 
      user.photo, 
      user.admin
    );

  }//fechando metodo getValues

    addLine(dataUser){

  
    //document.getElementById("table-users").innerHTML
    let tr = document.createElement('tr');

    tr.dataset.user = JSON.stringify(dataUser);

    tr.innerHTML = `
            <tr>
              <td>
                <img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm">
              </td>
              <td>${dataUser.name}</td>
              <td>${dataUser.email}</td>
              <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
              <td>${Utils.dateFormat(dataUser.register)}</td>
              <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
              </td>
            </tr>
        `;
  
        tr.querySelector(".btn-edit").addEventListener("click", e=>{

          console.log(JSON.parse(tr.dataset.user));
          document.querySelector("#box-user-create").style.display = "none";
          document.querySelector("#box-user-update").style.display = "block";

        });

        this.tableEl.appendChild(tr);

        this.updateCount();

    }

    showPanelCreate(){
      document.querySelector("#box-user-create").style.display = "block";
      document.querySelector("#box-user-update").style.display = "none";
    }

    showPanelUpdate(){
      document.querySelector("#box-user-create").style.display = "none";
      document.querySelector("#box-user-update").style.display = "block";
    }

    updateCount(){

      let numberUsers = 0;
      let numberAdmin = 0;

      [...this.tableEl.children].forEach(tr=>{

        numberUsers++;

        let user = JSON.parse(tr.dataset.user);

        if (user._admin) numberAdmin++;
      });

      document.querySelector('#number-users').innerHTML = numberUsers;
      document.querySelector('#number-users-admin').innerHTML = numberAdmin;
    }
}