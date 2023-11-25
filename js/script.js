document.addEventListener('DOMContentLoaded', function () {
    // Obtener la información de los productos y del carrito al cargar la página
    obtenerInfo();

    // Mostrar los productos y el carrito en la página
    mostrar();
});

/*
    Variables para almacenar todos los productos
    {
        nombre_producto: string,
        codigo: string,
        cantidad: int,
        precio: int,
        descripcion: string;
    }
 */

/*
    variables para almacenar en el carrito de compras
    {
        index: int,
        cantidad_productos: int
    }
*/
    let productos = [],
        carrito = [],
        descuento = 0;

    const IVA = 0.19;

    //variable que guardara la URL de la imagen a guardar
    let imagen = "";

/*
    funcion para validar si un codigo del producto existe, no llega un codigo como parametro y validamos si ese codigo existe en el array de objetos
*/

function guardarInfo() {
    localStorage.setItem('productos', JSON.stringify(productos));
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function obtenerInfo() {
    let producto_recuperado = localStorage.getItem('productos');
    let carrito_recuperado = localStorage.getItem('carrito');

    if (producto_recuperado) {
        productos = JSON.parse(producto_recuperado);
    } else {
        productos = [];
    }

    if (carrito_recuperado) {
        carrito = JSON.parse(carrito_recuperado);
    } else {
        carrito = [];
    }
}

function validar_codigo(parametro_codigo){
    //declaramos una variable existe para guardar informacion
    let existe = false;

    //recorremos el array de objetos productos para verificar si ya hay un elemento codigo que sea igual al parametro codigo que nos envian
    productos.forEach( (val) => {

        //validamos si el elemento codigo del array objetos es igual al parametro codigo que nos han enviado, si es igual editamos la variable existe
        if(val.codigo == parametro_codigo) {
            existe = true;
        }
    }); 

    //al final retormanos la variable existe
    return existe;
}

/*
    agregamos la funcion de agragar producto
*/
function agregar_producto() {

    //declaramos variables y las inicializamos con los valores del formulario del modal
    let codigo = (document.getElementById("codigo").value).trim();
    let nombre = (document.getElementById("nombre").value).trim();
    let cantidad = parseInt(document.getElementById("cantidad").value);
    let precio = parseInt(document.getElementById("precio").value);
    let descripcion = (document.getElementById("descripcion").value).trim();
    let archivo = document.getElementById("imagen").files[0];
    
    //le enviamos el valor del codigo del formulario del modal a la funcion validar codigo para que nos retorne "existe" si existe de lo contrario comillas vacias "" si no existe
    let existe_codigo = validar_codigo(codigo);
    
    //la variable existe codigo nos va a guardar "existe" si el codigo ya existe en el array de objetos, asi que validamos si el contenido de la variable es igual al existe para decirle al usuario atravez de un alert que el codigo ya existe
    if(existe_codigo == true){
        alert('El codigo del producto ya existe');
        return;
    } 

    //validamos que el campo "codigo" del formulario del modal se lleno dado que es requerido el ingreso del mismo
    if(codigo == ""){
        alert('Ingrese el codigo del producto');
        return;
    }

    //validamos que el campo "nombre" del formulario del modal sea lleno dado que es requerido el ingreso del mismo
    if(nombre == "") {
        alert('Ingrese el nombre del producto');
        return;
    }

    //validamos que el campo "cantidad" del formulario del modal sea lleno y mayor a 0
    console.log(cantidad);
    if (cantidad <= 0 || Number.isInteger(cantidad) == false) {
        alert('La cantidad que ingreso no es valida, tiene que ser mayor que 0');
        return;
    }

    //validamos que el campo "precio" del formulario del modal sea lleno y mayor que 0
    if(precio <= 0 || Number.isInteger(precio) == false) {
        alert('El valor que ingreso en precio no es valido, tiene que ser mayor que 0');
        return;
    }

    //validamos que el campo de la descripcion del formulario sea lleno dado que es requerido el ingreso del mismo
    if(descripcion == ""){
        alert('Ingrese la descripción del producto');
        return;
     }

     //validamos que el campo de la imagen del formulario sea lleno dado que es requerido el ingreso del mismo
     if(archivo == null){
        alert('Seleccione la imagen del producto');
        return;
     }

    //se agraga un nuevo elemento al array productos
    productos.push({
        codigo: codigo, 
        nombre: nombre,
        cantidad: cantidad,
        precio: precio,
        descripcion: descripcion,
        imagen: imagen
     });

    //se limpia los inputs del formulario del modal
    document.getElementById("codigo").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("imagen").value = "";
    
    //con esto cerramos el modal 
    let modal = bootstrap.Modal.getInstance(document.getElementById("modal"));
    modal.hide();

    guardarInfo();

    //se llama a la funcion mostrar para que muestre los nuevos elemntos ingresados
    mostrar(); 

    alert('Producto Ingresado');
}

/*
    Listar las producto guardados
*/

function mostrar() {
    //obtenemos el div donde vamos agregar los productos
    const listado = document.getElementById('listado-productos');

    let items = '';

    //recorremos el array productos
    productos.forEach( (val, index) => {
        //validamos que la cantidad de unidades disponibles del producto no este agotado
        if(val.cantidad == 0){
            items += `<div class="col-md-4 mt-4">
                    <div class="card h-100">
                        <img class="card-img-top" src="${val.imagen}">
                        <div class="card-body">
                            <h5 class="card-title text-center">${val.nombre}</h5>
                            <p class="mt-3"><b>Codigo: </b>${val.codigo}</p>
                            <p><b>Unidades Disponibles: </b>${val.cantidad}</p>
                            <p><b>Precio: </b>${val.precio}</p>
                            <p class="justificar"><b>Descripcion: </b>${val.descripcion}</p>

                            <div class="input-group mt-3">
                                <p class="">Agotado</p>
                            </div>

                        </div>
                    </div>
                </div>`;
        } else {
            items += `<div class="col-md-4 mt-4">
                    <div class="card h-100">
                        <img src="${val.imagen}">
                        <div class="card-body">
                            <h5 class="card-title text-center">${val.nombre}</h5>
                            <p class="mt-3"><b>Codigo: </b>${val.codigo}</p>
                            <p><b>Unidades Disponibles: </b>${val.cantidad}</p>
                            <p><b>Precio: </b>${val.precio}</p>
                            <p class="justificar"><b>Descripcion: </b>${val.descripcion}</p>

                            <div class="input-group mt-3">
                                <input type="number" class="form-control" id="cantidad_producto" value="1">
                                <button class="btn btn-success" onclick="agregar_carrito(${index})">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>`;
        }
    });

    //insertamos en el div del html todos los productos que se recorrieron anteriormente
    listado.innerHTML = items;

    resumen();

    configuracion();

    
}

function configuracion() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    const tooltips = document.getElementsByClassName('bs-tooltip-auto');
    [...tooltips].map(tooltip => tooltip.remove());
}

//funcion para obtener la imagen del producto
function obtenerImagen() {

    //obtenemos el input del archivo del formulario en el html
    const archivo = document.getElementById("imagen").files[0];
    //console.log(archivo);

    //convertir la imagen a base64
    let leerArchivo = new FileReader();

    leerArchivo.readAsDataURL(archivo);

    leerArchivo.onload = (val) => {
        imagen = val.target.result;
    }
}

//funcion agregar productos al carrito de compras 
function agregar_carrito(index){
    //obtenemos la cantidad de productos que se van a comprar
    let cantidad_producto = parseInt(document.getElementById("cantidad_producto").value);
    
    //validamos que el input cantidad de producto sea numerico y mayor a 0
    if(cantidad_producto <= 0 || Number.isInteger(cantidad_producto) == false){
        alert('Por favor ingrese un valor mayor que cero');
        return;
    }

    //validamos que el input cantidad de producto no se mayor a las unidades disponibles del producto
    if(cantidad_producto > productos[index].cantidad ){
        alert('La cantidad de unidades escogidas es mayor a la cantidad de unidades disponible, lo sentimos');
        return;
    }

    //le restamos a las unidades disponibles la cantidad de producto ingresados
    let inventario_unidades = productos[index].cantidad - cantidad_producto;

    //asignamos las nuevas unidades disponibles del producto que quedan despues de esta compra al array productos
    productos[index].cantidad = inventario_unidades;
    

    //agragamos una variable denominada update_item y la inicializamos en false, esta variable me va permitir conocer si el producto que agrego al carrito ya existe o no
    let update_item = false;

    //recorremos el arreglo carrito
    carrito.forEach((val, index2) => {

        //validamos si un producto ya existe en el carrito,para si ya existe agragarle la cantidad de producto a ese elemento en el carrito
        if(val.index == index){

            //actualizamos la variable a true si existe el producto en el carrito
            update_item = true;

            //sumamosla cantidad de productos del elemento que ya existe mas la nueva cantidad que se agrega al carrito
            let cantidad_total_producto_carrito = val.cantidad_productos + cantidad_producto;
            
            //el valor sumado anteriormente lo actualizamos al producto del carrito
            carrito[index2].cantidad_productos = cantidad_total_producto_carrito;
        }
    })

    //despues de recorrer el carrito y verificar que no existe un producto igual al que se agrega,adicionamos el producto como nuevo elemento del carrito
    if(update_item == false){
        //agregamosal array carrito el index del producto y la cantidad de productos escogidos
        carrito.push({
            index: index,
            cantidad_productos: cantidad_producto
        })
    }


    //mostramos los elementos actualizados
    mostrar();

    // Guarda Info en locale storage
    guardarInfo();

    alert('Producto seleccionado para el carrito de compras');
    
}

//resumen del carrito de compras 
function resumen() {

    //obtenemos el div donde vamos agregar el resumen
    const resumen = document.getElementById('resumen');

    //definimos las variables que vamos a calcular y otras en las que vamos a concatenar la informacion referente al carrito de compra y al resumen
    let subtotal = 0, 
        vr_bruto = 0,
        vr_iva = 0,
        total = 0,
        valor_descuento= 0,
        items_resumen = "",
        items_carrito = `<h2><i class="fa-solid fa-cart-shopping"></i> Mi Carrito</h2>
                        <div class="card">
                            <div class="card-body">`,
        carrito_vacio = true;
      
    //recorremos el array de objetos carrito para mostrar en tajetas los productos añadidos al carrito de compras
    carrito.forEach((val, index2) => {

        //asignamos false a esta variable para que luego si no esta lleno el carrito no me muestre nada el resumen 
        carrito_vacio = false;

        //calculamos el precio total por producto, multiplicando la cantidad de elementos del producto por el precio unitario
        let total_producto = productos[val.index].precio * val.cantidad_productos;

        //sumamosel total por producto
        vr_bruto = vr_bruto + total_producto;

        //en esta variable concatenamos targetas de productos para luego ser mostradas
        items_carrito += `<div class="row">
                            <div class="col-10">
                                <h5 class="card-title">${productos[val.index].codigo} - ${productos[val.index].nombre}</h5>
                                <p><b>Precio: </b>$${productos[val.index].precio}</p>
                                <p><b>Cantidad: </b>${val.cantidad_productos}</p>
                                <p><b>Total: </b>${total_producto}</p>
                                
                            </div>
                        <div class="col-2 mt-4">
                            <div class="input-group">
                                <button class="btn btn-danger" onclick="delete_producto_carrito(${index2}, ${val.index})">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </div>   
                    </div>
                    <hr>`;
    });

    //calculamos el valor del descuento
    valor_descuento = (vr_bruto * descuento) / 100;
    subtotal = vr_bruto - valor_descuento;
    vr_iva = subtotal * IVA;
    total = subtotal + vr_iva;

    // terminamos las targetas añadiendole el boton vaciar carrito y cerrando los div
    items_carrito += `<center>
                        <button class="btn btn-danger" onclick="vaciar_carrito()">
                            <i class="fa-solid fa-ban"></i> Vaciar Carrito
                        </button>
                    </center>
                    </div>
                </div>`;

    //asignamos a esta variable el resto de la informacion que corresponde al resume de la compra
    items_resumen = ` <h2 class="mt-5"><i class="fa-solid fa-cart-flatbed"></i> Resumen de Compra</h2>
                        <div class="card">
                            <div class="card-body">
                                <div class="row">

                                    <div class="col-12 mb-5" >
                                        <label><i class="fa-solid fa-percent"></i> Descuento</label>
                                        <input class="form-control" type="number" id="descuento" value="${descuento}" onchange="generar_descuento()">
                                    </div>


                                    <div class="col-12">
                                        <p><b>Descuento: </b>$${valor_descuento}</p>
                                        <p><b>Subtotal: </b>$${subtotal}</p>
                                        <p><b>IVA: </b>$${vr_iva}</p>
                                        <p><b>Total: </b>$${total}</p>
                                    </div>

                                    <div class="col-12 mt-4">
                                        <center>
                                            <button class="btn btn-success" onclick="comprar()">
                                                <i class="fa-regular fa-credit-card"></i> Comprar
                                            </button>
                                        </center>
                                    </div>
                                </div>
                            </div>
                        </div>`;

    //si la variable que habiamos definido para que cuando entrara al foreach indicaba que no habia elementos en el carrito indica que es true, inicializamos las dos variables para que no muestre informacion alguna                
    if(carrito_vacio == true){
        items_carrito = "";
        items_resumen = "";
    }

    //insertamos en el div del html todos los productos del carrito
   resumen.innerHTML = items_carrito + items_resumen;
}

//funccion para eliminar elementos de carrito
function delete_producto_carrito(index_carrito, index_producto) {

    //definimos el alerta de confirmacion
    const confirmacion = confirm('¿Desea eliminar el producto del carrito?');
    
    //si el cliente acepto la alerta procedemos a borrar el producto del carrito
    if (confirmacion) {
        alert('El producto seleccionado ha sido eliminado');

        //calculamos la cantidad de unidades disponibles del producto y le sumamos la cantidad de productos seleccionados en el carrito
        let cantidad_devuelta = carrito[index_carrito].cantidad_productos + productos[index_producto].cantidad;

        //asignamos ese calculo anterior al producto del cual se elimina del carrito
        productos[index_producto].cantidad = cantidad_devuelta;

        //eliminamos ese elemento del array de carrito
        carrito.splice(index_carrito, 1);

        guardarInfo();

        //actualizamos la informacion en la vista llamando a la funcion mostrar
        mostrar();
    }    
}

//funcion para vaciar carrito de compras
function vaciar_carrito() {

    //definimos el alerta de confirmacion
    const confirmacion = confirm('Desea vaciar el carrito de compras');

    //si el cliente acepto la confirmacion procedemos a vaciar el carrito
    if(confirmacion) {
        alert('El carrito de compras ha sido vaciado correctamente');
        
        //recorremos el carrito de compras para devolverle las unidades seleccionadas al producto
        carrito.forEach(val => {
            let  cantidad_productos_devueltos = productos[val.index].cantidad + val.cantidad_productos;
            productos[val.index].cantidad = cantidad_productos_devueltos;
        })

        //inicializamos a vacio el array carrito
        carrito = [];
    }

    guardarInfo();

    //actualizamos la informacion de la vista llamando la funcion mostrar
    mostrar()
}

//funcion para calcular el descuento de la compra
function generar_descuento() {

    //obtenemos el valor del input descuento 
    descuento = parseInt(document.getElementById('descuento').value);

    //validamos que sea un numero y mayor o igual a 0
    if(descuento < 0 || Number.isInteger(descuento) == false) {
        alert('El descuento debe ser mayor o igual a cero');

        //si no es mayor  o igual a cero, asignamos vacio al input descuento y inicializamos a cero la variable global descuento
        document.getElementById('descuento').value = "";
        descuento = 0;
        return;
    }

    //actualizamos la informacion del resumen llamando la funcion resumen
    resumen();
}


//funcion para simular la compra
function comprar() {

    //definimos el alerta de confirmacion
    let confirmar = confirm('¿Desea realizar esta compra?');

    //validamos que acepte la confirmacion de compra 
    if(confirmar) {
        alert('Su compra se ha realizado correctamente');

        //inicializamos a vacio el array carrito
        carrito = [];

        guardarInfo();

         //actualizamos la informacion del resumen llamando la funcion resumen
        resumen();

    }
}