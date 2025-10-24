// SIMULACION DE COMPRAS EN RAMBEDJEANS



/*
EL usuario debe registrarse para comprar.
Los datos del usuario se guardaran en un array con nombre, email y password en local storage
Las facturas se guardan en local storage.

Se usa un fetch para cargar el json creado con estilos.


*/

//array con lista de jeans y precios

let listaJeans=[
               /* {id:10044, estilo: "slimA", precio: 40000},
                {id:1002, estilo:"cargoA", precio:60},
                {id:1003, estilo: "regulaA", precio: 40},
                {id:1004, estilo:"slimB", precio:40},
                {id:1005, estilo: "cargoB", precio: 60},
                {id:1006, estilo:"oversizeA", precio:55},
               */
                ]


//*******************PROMESA ASYNCRONA****************************//

const URL="/stock.json"

let stock=[];

async function fetchJsonRB() {

    
    try {   
          
            let response =  await fetch(URL); //capturamos al promesa

             console.log(response) //validamos la promesa

            if(!response.ok){
                throw new Error (`Error ${response.status}`);
            }
            
            let listaJeansJSON = await response.json();
            console.log("succesfull");

           
           //paresamos los datos tipo nuemro y float
           

            listaJeans= listaJeansJSON.stock.map((jeans)=> {
                return {
                    id : parseInt(jeans.id),
		        estilo : jeans.estilo,
                precio : parseFloat(jeans.precio),
		        img : jeans.img,
		        tallas: jeans.tallas }         
                
            })

          
             mostrarCatalogo()
           
               
        
    } catch (error) {
        
        
        Swal.fire({
            title: '¡no se cargaron los datos de la promesa!',
            html: `
                  <p>¡ERRRO JSON ${error}!</p>
            `,
            icon: 'warning', // (success, error, warning, info, question)
            confirmButtonText: 'revisar', 
         })
        throw error;

    }
     finally{
        console.log("promesa comppletada completada")

     }
    
}

fetchJsonRB();


//+++++++++++++++++++++++++++++variables globales++++++++++++++++++++++++++++++++++++++++


let carritoCompra=[]; //array para anexar la compras
let contCarrito= document.getElementById("verCarrito"); //contador del carrito

let compras=[]; // array para las compras
let compra;

let facturasCompras=[]; //array para gaurdar las facturas
let factura; //variable que crea facturas
let numFactura= 1000;

//*****************************************************************************//
//*****************************************************************************//
//+++++++++++++++++++++++++++++DOM++++++++++++++++++++++++++++++++++++++++

//FUNCION PARA USAR EL TOSTIFY CON VARIOS COLORES

function alertTosty(mensaje, tipo = '') {
    let backgroundColor;

    switch (tipo) {
        case 'ok':
            backgroundColor = "rgb(27, 181, 19)"; 
            break;
        case 'error':
            backgroundColor = "rgb(216, 81, 8)";
            break;
        case 'info':
        default:
            backgroundColor = "rgb(29, 216, 213)"; 
            break;
    }

    Toastify({
        text: mensaje,
        duration: 3000, 
        newWindow: true,
        gravity: "top", 
        position: "right", 
        style: {
            background: backgroundColor,
            borderRadius: "5px"
        },
        onClick: function(){} // Callback al hacer clic en el toast
    }).showToast();
}



//Creamos una funcion que nos muestre el catalogo de jeans

function mostrarCatalogo(){
   
     //obtenenos el catalogo que va con el grid

    const catalogoContainer = document.getElementById("catalogo");

    //hacemos un forEach para crear cada elemento de la lista de jenas y ponerlos el html

    listaJeans.forEach(jeans => {
            
            let product_card = document.createElement("div");
            product_card.className="producto-card";

            // Asignamos el ID del producto como atributo de datos para facilitar el manejo
            product_card.setAttribute('data-id', jeans.id); 

            // creamos demas elementos

            let img =  document.createElement("img");
            let h3 =  document.createElement("h3");
            let precio = document.createElement("p");
            precio.className= "precio";

            let botonAgregar = document.createElement("button");
            botonAgregar.className = "btn-agregar";
            botonAgregar.textContent = "Agregar al Carrito";
            botonAgregar.setAttribute('data-id', jeans.id);  // Al botón también le pasamos el ID

            //agregamos los atibutos de la lista jeans

            img.src=`${jeans.img}`;
            img.alt=`${jeans.estilo}`

            h3.textContent = jeans.estilo.toUpperCase();
            precio.textContent = `$${jeans.precio}`;
          
            //agregamos todo al html con apenndchild

            product_card.appendChild(img);
            product_card.appendChild(h3);
            product_card.appendChild(precio);
            product_card.appendChild(botonAgregar);

            catalogoContainer.appendChild(product_card);

            //----------------logica de agregar al carro-----------------//
            botonAgregar.addEventListener('click', agregarAlCarrito); 

        })

}


function agregarAlCarrito(e){ 
    //la "e" el evento click
    //capturamos el ID del boton
    let id= parseInt(e.target.getAttribute("data-id"));

    let cantidadUser= parseInt(prompt("ingresa la cantidad deseada"));///cambiar po swal

    if(isNaN(cantidadUser)){
        Swal.fire({
            title: 'Ingrese un mumero valido',
            icon: 'warning',
            // Usamos 'html' para inyectar nuestro contenido formateado
            confirmButtonText: 'ok',
        });
        return;
    }
    
    
   

    let jeanSeleccionado = listaJeans.find((jeans) => {
       return jeans.id === id;
    })

    if(jeanSeleccionado){
         compra={ id:jeanSeleccionado.id,
                estilo: jeanSeleccionado.estilo, 
                cantidad: cantidadUser,
                valorTotal: jeanSeleccionado.precio * cantidadUser,
                }
        
         carritoCompra.push(compra); //subimos la compra al array del carrito

              
        actualizarContadorCarrito(); //Actualizamos el carrito de compra


        //confirmamos la seleccion del articulo alert  POR EL TOSTIFY
          
        alertTosty(`¡${jeanSeleccionado.estilo} agregado al carrito!`,`ok` )
       
            
    }

}

//funcion para actualizar visualmente el carrito

function actualizarContadorCarrito() {
     contCarrito.textContent = `🛒 Carrito (${carritoCompra.length})`;
}

//-----------------VER CARRITO DE COMPRAS------------------//

//declaramos las variables globales
let sumTotal=0;
let itemsCarrito = document.getElementById('itemsCarrito');
let totalCarrito = document.getElementById('carritoTotalFinal');


function crearTablaCarrito(){
    //actualizamos la tablas vacia

    itemsCarrito.innerHTML=" "; //vaciamos
    

    if(carritoCompra.length === 0){
        itemsCarrito.innerHTML = '<p style="text-align:center; padding: 20px;">Tu carrito está vacío 😔.</p>';
        sumTotal = 0;
    }else{
        carritoCompra.forEach((jeans, index) => {
            
            //creamos el item con los dettalles
            let item = document.createElement('div');
            item.className = 'carrito-item';

            let estilo = document.createElement('span');
            estilo.className = 'item-estilo';
            estilo.textContent = `${jeans.estilo} (x${jeans.cantidad})`;

            
            let total = document.createElement('span');
            total.className = 'item-total';
            total.textContent = `$${jeans.valorTotal}`; 

            //creamos le boton que hayq ponelro a funcionar, por eso necesito le index

            let eliminar = document.createElement('button');
            eliminar.className = 'btn-eliminar';
            eliminar.textContent = 'Eliminar';
            
            eliminar.setAttribute('data-index', index); //usamo le index para luego saber que borramos
            
            //click
            eliminar.addEventListener('click', eliminarItemDelCarrito);

            //anexamos todo
            item.appendChild(estilo);
            item.appendChild(total);
            item.appendChild(eliminar);
            itemsCarrito.appendChild(item);
           
            sumTotal += jeans.valorTotal;

            });      

    }   totalCarrito.textContent = `$${sumTotal}`; 
    
}

//--------FUNCIONES PARA ABRIR EL CARRITO Y CERRARLO-------------//

let listaCarrito= document.getElementById("vistaCarrito")
const btnCerrarCarrito = document.getElementById('cerrarCarrito');
const btnSeguirComprando = document.getElementById('btnSeguirComprando');
const btnVaciarCarrito = document.getElementById('btnVaciarCompra');
const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');



contCarrito.addEventListener("click", ()=>{
   
    crearTablaCarrito();
    listaCarrito.style.display = `flex`;
})

btnCerrarCarrito.addEventListener("click", ()=>{

    listaCarrito.style.display = `none`;

})

btnSeguirComprando.addEventListener("click", ()=>{

    listaCarrito.style.display = `none`;

})

btnVaciarCarrito.addEventListener("click", ()=>{

   vaciarCarrito();
   console.log("Estado del Carrito:", carritoCompra);

})

function vaciarCarrito(){
   carritoCompra=[]
   crearTablaCarrito();
   actualizarContadorCarrito();

}

function eliminarItemDelCarrito(e){
    let index=parseInt( e.target.getAttribute("data-index"));
    console.log(index);
    carritoCompra.splice(index,1);
    crearTablaCarrito(); //actualizamos de neuvo el carrrito y el contador
    actualizarContadorCarrito();
    console.log("Estado del Carrito:", carritoCompra);
   
}


//************************************FINALIZAR COMPRA **************************************//
//***************************************************************************************//

const FACTURAS_LOCALSTORAGE_KEY = 'facturas'; //esta variable para usarlo en el local storage


btnFinalizarCompra.addEventListener(`click`,() => {

    if(carritoCompra.length===0){
        //tostify
         alertTosty(`¡NO hay nada en el carrito!`,`error` )
        return;
    }
    if(!usuarioActivo){

        //tostify
         alertTosty(`No te has loggeado`,`error` )
        listaCarrito.style.display = `none`;
        vaciarCarrito()
        return;
    }

    factura={ numFactura: numFactura++,
        fecha : new Date().toLocaleDateString(),
        comprador : usuarioActivo.nombre,
        nitComprador : usuarioActivo.getId,
        items : [...carritoCompra],
        total : sumTotal

    }

    facturasCompras.push(factura);
    crearTablaCarrito(); //actualizamos de nuevo el carrrito y el contador
    actualizarContadorCarrito();

    alertTosty(`factura cargada con exito`,`ok` )
    console.log("Factura Creada:", factura);
    
    verFacturas();

    listaCarrito.style.display="none";

    vaciarCarrito();

    //GUARDAMOS LAS FACT EN LOCALSTORAGE
    guardarFacturasLocalStorage();

})

 
function verFacturas(){ //listamos las facturas

    if(factura.length===0){
        alertTosty(`no hay compras registardas`,`error`);
    }else{

        let resumenItems = factura.items.map((item) => 
            ` - ${item.estilo} (x${item.cantidad}) - $${item.valorTotal.toFixed(2)}`
        ).join('\n'); // Junta todos los ítems con saltos de línea

        
       // 1. Convertimos los saltos de línea (\n) a etiquetas <br> de HTML.
    const detalleHTML = resumenItems.replace(/\n/g, '<br>');

    // 2. Usamos SweetAlert2
    Swal.fire({
        title: '🎉 ¡COMPRA EXITOSA! 🎉',
        icon: 'success',
        // Usamos 'html' para inyectar nuestro contenido formateado
        html: `
            <div style="text-align: left; margin: 0 auto; max-width: 300px;">
                
                <p><b>Cliente:</b> ${usuarioActivo.nombre}</p>
                <p><b>Nro. Factura:</b> ${factura.numFactura}</p>
                
                <hr>
                <p style="font-weight: bold;">Detalle de la Compra:</p>
                
                <p style="font-size: 0.9em;">${detalleHTML}</p> 
                
                <hr>
                <h3>TOTAL PAGADO: $${factura.total.toFixed(2)}</h3>
                <br>
                <h3>ENVIO PROGRAMADO PARA: ${usuarioActivo.direccion}</h3>
            </div>
        `,
        confirmButtonText: 'Guardar Factura',
    });

    }
}

//*********************guardar facturas en el local storage  ******************************/

function guardarFacturasLocalStorage() {
   
    //convertimoS el array facturas a JSON

    const facturasJSON = JSON.stringify(facturasCompras);
    
    // Guardar esa cadena de texto en LocalStorage. Necesita dos parametros key y value
    localStorage.setItem(FACTURAS_LOCALSTORAGE_KEY, facturasJSON);

    //tostify
     alertTosty(`Factura guardad exitosamente LS`,`ok`);
}

function obtenerFacturasLocalStorage(){ 
    // esta funcion la podemos llamar al incio para cargar datos guardados
    const facturas_LS_JSON = localStorage.getItem(FACTURAS_LOCALSTORAGE_KEY);
    

    if(facturas_LS_JSON){
        const facturasCargadas = JSON.parse(facturas_LS_JSON); 
        //validamos datos en array
        console.log(facturasCargadas);
        console.log("hay FACTURAS guardadas en LS");

        //pasamos lo datos al array global del programa
        facturasCompras = facturasCargadas;
    }else{
        console.log(`no hay facturas guardadas en el localStorage--there are not INVOICES saved in localStorage`)
    }
    

}




//*****************************************************************************//
//*****************************************************************************//
//--------------LOGGIN USUARIOS---ALAMCENAMIENTO EN EL LOCAL STORAGE-----------//

let usuarioActivo = null;

//--------funcion para validar correos y ID--------------------//

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENTERO_REGEX = /^\d+$/;

function validarEmail(email) {
    // El método .test() verifica si la cadena coincide con el patrón RegEx.
    return EMAIL_REGEX.test(email);
}

function validarId(id) {
    // El método .test() verifica si la cadena coincide con el patrón RegEx.
    return ENTERO_REGEX.test(id);
}

//elelmentos del login

let paginaIngresar = document.getElementById("modalAuth");
let loginForm = document.getElementById("loginForm");
let loginEmail= document.getElementById("loginEmail");
let loginPassword= document.getElementById("loginPassword");
let linkLogin= document.querySelector(".linkLogin");
let loginBtn= document.getElementById("loginBtn");

const USERS_LOCALSTORAGE_KEY = 'rambedClientes'; //esta variable para usarlo en el local storage



let btnCerrarFormRegistro = document.getElementById('cerrarAuth');
let btnIngreso= document.getElementById("btnAuth");


btnIngreso.addEventListener("click", ()=>{
       
    paginaIngresar.style.display = `block`;
})

btnCerrarFormRegistro.addEventListener("click", ()=>{

    paginaIngresar.style.display = `none`;

})

//--------------registro de usuarios----y almacenamiento de datos en el local storage
let linkRegistrarse = document.querySelector(".linkRegistro");
let formReg = document.getElementById("registroForm");
let nomReg= document.getElementById("regNombre");
let idReg= document.getElementById("regId");
let dirReg= document.getElementById("regDir");
let mailReg= document.getElementById("regEmail");
let passReg= document.getElementById("regPassword");
let btnRegistro= document.getElementById("btnRegistro");



linkRegistrarse.addEventListener("click",()=>{
   
    formReg.style.display = `block`;
    loginForm.style.display = `none`;
    linkLogin.style.display = `block`;
    linkRegistrarse.style.display = `none`;
    

})

linkLogin.addEventListener("click", () => {
    formReg.style.display = `none`;
    loginForm.style.display = `block`;
    linkLogin.style.display = `none`;
    linkRegistrarse.style.display = `block`;
    

} );

//*************creamos la clase usuario para guardar datos***********  //
class Usuario{
    constructor(nombre, id,direccion, mail, password){
   
    this.nombre= nombre;
    this.id= id;
    this.dir= direccion;
    this.mail=mail;
    this.password=password;
    }
}


// array para guardar datos de usuarios, dejamos uno de esanyo.

let usuarios=[]; 


btnRegistro.addEventListener("click",registrarse)

function registrarse(e){ 

    e.preventDefault();

    let nombreUsuario= nomReg.value;
    let idUsuario= idReg.value;
    let dirUsuario= dirReg.value;
    let mailUsuario=mailReg.value;
    let passwordUsuario= passReg.value;


    if (!validarEmail(mailUsuario)) {
        alertTosty(`correo incorrecto debe contener @ y .com,  ej: user@mail.com`,`error`);
        return; 
    }

    if (!validarId(idUsuario)) {
        alertTosty(`Id incorrecto debe ser solo numeros`,`error`);
        return; 
         }


    //Instanciamos a los usuarios nuevos

    let usuario= new Usuario(nombreUsuario, idUsuario,dirUsuario,  mailUsuario, passwordUsuario);

    //subimos el usuario al array de usuarios
    usuarios.push(usuario);

    //cambiar etso por un SWEETALERT
    confirm(`Usted ingresó
             \n nombre: ${usuario.nombre}
            \n ID: ${usuario.id}
            \n direccion: ${usuario.dir}
            \n email: ${usuario.mail}
            \n password: ${usuario.password} `);

    //guaradmos valores en local storage
    guardarUsuariosLocalStorage();

    //verificano valores        
    console.log(usuarios);

    nomReg.value = "";
    idReg.value = "";
    dirReg.value ="";
    dirReg = "";
    mailReg.value = "";
    passReg.value = "";


}



function guardarUsuariosLocalStorage() {
   
    //convertimoS el array usuario a JSON

    const usuariosJSON = JSON.stringify(usuarios);
    
    // Guardar esa cadena de texto en LocalStorage. Necesita dos parametros key y value
    localStorage.setItem(USERS_LOCALSTORAGE_KEY, usuariosJSON);

    console.log("Usuarios guardados exitosamente en LocalStorage.");
}

function obtenerUsuariosLocalStorage(){ 
    // esta funcion la podemos llamar al incio para cargar datos guardados
    const usuarios_LS_JSON = localStorage.getItem(USERS_LOCALSTORAGE_KEY);
    

    if(usuarios_LS_JSON){
        const usuariosCargados = JSON.parse(usuarios_LS_JSON); 
        //validamos datos en array
        console.log(usuariosCargados);
        console.log("hay usuarios guardados en ls");

        //pasamos lo datos al array global del programa
        usuarios = usuariosCargados;
       
}}

obtenerUsuariosLocalStorage() //amnetenemos cargados los usuarios del LS


//***************************INGRESO***************************************************//
//*************************************************************************************//

loginBtn.addEventListener("click",ingresar)

function ingresar(e){ 
    e.preventDefault();
   

    obtenerUsuariosLocalStorage(); // usuarios queda listo para usarse
    
    let mailR=loginEmail.value;

    if (!validarEmail(mailR)) {
        alertTosty(`correo incorrecto. ej: user@mail.com`,`error`);
        return; 
     }

    let passwordR=loginPassword.value;
    let loggin=false;

   
          //metodo find, recibe por paramentros una funcion para buscar el ususario 

        const usuarioEncontrado= usuarios.find(usuario =>{
            return mailR===usuario.mail && passwordR==usuario.password
        } )

        if(usuarioEncontrado){
            loggin=true;
            alertTosty(`LOGIN EXITOSO`,`OK`);
            
         }
            
                     
        if(loggin===true){

            usuarioActivo=usuarioEncontrado;

          
        }else{

            alertTosty(`ERROR EN USUARIO Y CONTRASENA`,`error`);

        }
    
        loginEmail.value = "";
        loginPassword.value = "";
       

        const estadoUsuarioDiv = document.querySelector('#estadoUser');

        if (usuarioActivo) {
            // Usuario logueado: Mostrar nombre y botón de cerrar sesión
            estadoUsuarioDiv.innerHTML = `
                <span>Hola, <b>${usuarioActivo.nombre}</b></span> 
                <button id="btnLogout" class="btn-secundario" style="margin-left: 10px;">Salir</button> `;
            // Conectar el botón de salir
            document.getElementById('btnLogout').addEventListener('click', cerrarSesion);
           //cerramos el modal

           paginaIngresar.style.display = `none`;
                  
        }

}

//cerrar sesion

function cerrarSesion() {
    usuarioActivo = null; 
    const estadoUsuarioDiv = document.querySelector('#estadoUser');
    estadoUsuarioDiv.innerHTML = `
            <span>Hola, <b>No estas loggeado</b></span>`
}

//cargamos el local storage

obtenerUsuariosLocalStorage();
obtenerFacturasLocalStorage();
