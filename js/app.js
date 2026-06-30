const btnFlotante = document.querySelector('.btn-flotante');
const footer = document.querySelector('.footer');
const canasta = document.querySelector('.canasta');
const carrito = document.querySelector('.carrito');

cargarEventListeners();
function cargarEventListeners() {
    btnFlotante.addEventListener('click', mostrarOcultarFooter);
    canasta.addEventListener('click', mostrarCarrito);
}

function mostrarOcultarFooter() {
    if (footer.classList.contains('activo')) {
        footer.classList.remove('activo');
        this.classList.remove('activo');
        this.textContent = 'Idioma y Moneda';
    } else {
        footer.classList.add('activo');
        this.classList.add('activo');
        this.textContent = 'X Cerrar';
    }
}

function mostrarCarrito(e) {
    e.preventDefault();
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

const listaServicios = document.querySelector('.card');
let itemsCarrito = [];