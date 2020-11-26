class UserController {

  constructor(formId, tableId){
      this.formEl = document.getElementById(formId);
      this.tableEl = document.getElementById(tableId);

      this.onSubmit();

  }

  onSubmit(){

    this.formEl.addEventListener("submit", event =>{

      event.preventDefault();
      //Nessa classe que eu to, quero acessar o método getValues

      let values = this.getValues();

      this.getPhoto((content)=>{

        values.photo = content;

        this.addLine(values);
      });

    });

  }//fechando metodo onSubmit

  getPhoto(callback){
    let fileReader = new FileReader();

    let elements = [...this.formEl.elements].filter(item=>{

      if (item.name === 'photo') {
        return item;
      }

    });
    console.log(elements[0].files[0]);

    let file = elements[0].files[0];

    fileReader.onload = ()=>{

      callback(fileReader.result);
    };

    fileReader.readAsDataURL(file);
  }

  getValues(){

  //let é uma variavel que só existe dentro do getvalues
  let user = {};
  //spread é um operador que serve pra distribuir os indices sem precisar colocar todos.
  [...this.formEl.elements].forEach(function(field, index){

      if (field.name == "gender") {
  
        if (field.checked) {
          user[field.name] = field.value;
        }
  
      } else {

        user[field.name] = field.value;

      }
  
    });
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
    this.tableEl.innerHTML = `
            <tr>
              <td>
                <img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm">
              </td>
              <td>${dataUser.name}</td>
              <td>${dataUser.email}</td>
              <td>${dataUser.admin}</td>
              <td>${dataUser.birth}</td>
              <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
              </td>
            </tr>
    `;
  

  }
}