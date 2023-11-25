// Función para mostrar los detalles del producto
function mostrarDetallesProducto(productId) {
  const producto = productos[productId];

  // Construir el contenido de los detalles del producto
  const detallesContenido = `
            <button class="btn btn-primary" onclick="volverAPrincipal()"><i class="fas fa-chevron-left"></i>Volver</button>
<div class="row mb-5">
    <div class="col-md-6">
        <!-- Imagen a la izquierda en pantallas medianas y más grandes -->
        <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid">
    </div>
    <div class="col-md-6">
        <!-- Texto a la derecha en pantallas medianas y más grandes -->
        <h2>${producto.nombre}</h2>
        <p><b>Código: </b>${producto.codigo}</p>
        <p><b>Unidades Disponibles: </b>${producto.cantidad}</p>
        <p><b>Precio: </b>${producto.precio}</p>
        <p class="justificar"><b>Descripción: </b>${producto.descripcion}</p>
    </div>
</div>
    `;

  // Mostrar los detalles del producto y ocultar la sección principal
  document.getElementById("detalles-producto").innerHTML = detallesContenido;
  document.getElementById("detalles-producto").style.display = "block";
  document.getElementById("seccion-principal").style.display = "none";
}

function volverAPrincipal() {
  // Mostrar la sección principal y ocultar los detalles del producto
  document.getElementById("seccion-principal").style.display = "block";
  document.getElementById("detalles-producto").style.display = "none";
}
