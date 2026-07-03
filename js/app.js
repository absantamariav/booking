const btnFlotante = document.querySelector('.btn-flotante');
const footer = document.querySelector('.footer');
const canasta = document.querySelector('.canasta');
const carrito = document.querySelector('.carrito');
const listaServicios = document.querySelector('.contenido');
let itemsCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
    btnFlotante.addEventListener('click', mostrarOcultarFooter);
    canasta.addEventListener('click', mostrarCarrito);
    listaServicios.addEventListener('click', agregarServicio);
}

/** mostrar y ocultar footer y carrito **/
function mostrarOcultarFooter() {
    if (footer.classList.contains('activo')) {
        footer.classList.remove('activo');
        this.classList.remove('activo');
        this.textContent = 'Sobre Nosotros';
    } else {
        footer.classList.add('activo');
        this.classList.add('activo');
        this.textContent = 'X Cerrar';
    }
}

function mostrarCarrito(e) {
    const carritoActivo = carrito.classList.toggle('activo');
    if (carritoActivo) {
        document.addEventListener('click', ocultarCarritoDesdeAfuera);
        document.addEventListener('keydown', ocultarCarritoConEscape);
    } else {
        limpiarEventListeners();
    }
}

function ocultarCarritoDesdeAfuera(e) {
    if (!carrito.contains(e.target) && !canasta.contains(e.target)) {
        carrito.classList.remove('activo');
        limpiarEventListeners();
    }
}

function ocultarCarritoConEscape(e) {
    if (e.key === 'Escape') {
        carrito.classList.remove('activo');
        canasta.blur();
        limpiarEventListeners();
    }
}

function limpiarEventListeners() {
    document.removeEventListener('click', ocultarCarritoDesdeAfuera);
    document.removeEventListener('keydown', ocultarCarritoConEscape);
}

/** agregar y eliminar items al carrito **/
function agregarServicio(e) {
    //evitamos afectar los enlaces reales
    if (e.target.getAttribute('href') === '#') {
        e.preventDefault();
    }
    if (e.target.classList.contains('agregarCarrito')) {
        const servicioSeleccionado = e.target.parentElement.parentElement.parentElement;
        leerDatosServicio(servicioSeleccionado);
    }
}

function leerDatosServicio(servicio) {
    const precioNumero = servicio.querySelector('.precio').textContent.replace(' por persona', '').replace(' por noche', '').replace(',', '').slice(1)
    const infoServicio = {
        imagen: servicio.querySelector('img').src,
        categoria: servicio.querySelector('.categoria').textContent,
        titulo: servicio.querySelector('.titulo').textContent,
        precio: Number(precioNumero),
        cantidad: 1,
        id: servicio.querySelector('.agregarCarrito').getAttribute('data-id')
    }
    itemsCarrito = [...itemsCarrito, infoServicio]
    console.log(itemsCarrito);
}