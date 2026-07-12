const btnFlotante = document.querySelector('.btn-flotante');
const footer = document.querySelector('.footer');
const canasta = document.querySelector('.canasta');
const carrito = document.querySelector('.carrito');
const listaServicios = document.querySelector('.contenido');
const listaItemsCarrito = document.querySelector('.lista-itemsCarrito')
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito')

let itemsCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
    btnFlotante.addEventListener('click', mostrarOcultarFooter);
    canasta.addEventListener('click', mostrarCarrito);
    listaServicios.addEventListener('click', agregarServicio);
    carrito.addEventListener('click', actualizarItem)
    vaciarCarritoBtn.addEventListener('click', () => {
        itemsCarrito = [];
        limpiarCarritoHTML();
    })
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
    //obtenemos toda la ruta en forma de arreglo donde se dio click incluso si fue destruido luego
    const rutaClic = e.composedPath();
    const clickEnCarrito = rutaClic.includes(carrito);
    const clickEnCanasta = rutaClic.includes(canasta);
    const clickEnBotonAgregar = e.target.closest('.agregarCarrito');
    if (!clickEnCarrito && !clickEnCanasta && !clickEnBotonAgregar) {
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
    if (e.target.getAttribute('href') === '#') {
        e.preventDefault();
    }
    if (e.target.classList.contains('agregarCarrito')) {
        const servicioSeleccionado = e.target.parentElement.parentElement.parentElement;
        leerDatosServicio(servicioSeleccionado);
    }
}

function leerDatosServicio(servicio) {
    const infoServicio = {
        imagen: servicio.querySelector('img').src,
        categoria: servicio.querySelector('.categoria').textContent,
        titulo: servicio.querySelector('.titulo').textContent,
        precio: Number(servicio.querySelector('.precio').dataset.precio),
        cantidad: 1,
        id: servicio.querySelector('.agregarCarrito').getAttribute('data-id')
    }

    const existeItem = itemsCarrito.some(item => item.id === infoServicio.id);
    if (existeItem) {
        itemsCarrito.forEach(item => {
            if (item.id === infoServicio.id) {
                item.cantidad++;
                return item;
            } else {
                return item;
            }
        })
    } else {
        itemsCarrito = [...itemsCarrito, infoServicio];
    }
    carritoHTML();
    calcularSubtotal();
    contadorCanasta();
}

function carritoHTML() {
    limpiarCarritoHTML();
    itemsCarrito.forEach(servicio => {
        const { imagen, categoria, titulo, precio, cantidad, id } = servicio;
        const bloque = document.createElement('div');
        bloque.classList.add('itemsCarrito');
        bloque.innerHTML = `
            <img src="${imagen}" alt="imagen del servicio">
            <div class="descripcion-itemsCarrito">
                <p class="categoria">${categoria}</p>
                <p class="titulo">${titulo}</p>
                <p class="precio">$${precio}</p>
                <div class="controles">
                    <button class="cantidad disminuir" data-id="${id}">-</button>
                    <span class="numero">${cantidad}</span>
                    <button class="cantidad aumentar" data-id="${id}">+</button>
                </div>
                <button class="eliminarItem" data-id="${id}">X</button>
            </div>
        `;
        listaItemsCarrito.appendChild(bloque);
    });
}

function limpiarCarritoHTML() {
    while (listaItemsCarrito.firstElementChild) {
        listaItemsCarrito.firstElementChild.remove();
    }
}

/**Aumentar, disminuir y eliminar items del carrito**/
function actualizarItem(e) {
    if (e.target.classList.contains('disminuir')) {
        const itemId = e.target.getAttribute('data-id');
        itemsCarrito.forEach(item => {
            if (item.id === itemId && item.cantidad > 1) {
                item.cantidad--;
                return;
            } else {
                return;
            }
        });
    } else if (e.target.classList.contains('aumentar')) {
        const itemId = e.target.getAttribute('data-id');
        itemsCarrito.forEach(item => {
            if (item.id === itemId) {
                item.cantidad++;
                return;
            } else {
                return;
            }
        });
    } else if (e.target.classList.contains('eliminarItem')) {
        const itemId = e.target.getAttribute('data-id');
        itemsCarrito.forEach(item => {
            if (item.id === itemId) {
                itemsCarrito = itemsCarrito.filter(item => item.id !== itemId)
            }
        });
    }
    carritoHTML();
    calcularSubtotal();
    contadorCanasta();
}

function calcularSubtotal() {
    let subTotal = 0;
    itemsCarrito.forEach(item => {
        subTotal += item.precio * item.cantidad;
    });
    const subTotalHTML = carrito.querySelector('.subtotal-html');
    subTotalHTML.textContent = `SUBTOTAL: $ ${subTotal}`;
}

function contadorCanasta() {
    let contador = 0;
    itemsCarrito.forEach(item => {
        contador += item.cantidad;
    });
    const contadorHTML = canasta.querySelector('.contador');
    contadorHTML.textContent = `${contador}`;
    if (contador > 0) {
        contadorHTML.classList.add('activo')
    } else {
        contadorHTML.classList.remove('activo')
    }
}

/** actualizar placeholder segun dispositivo **/
function actualizarPlaceholder() {
    const input = document.querySelector(".busqueda");

    // Condición: Si la pantalla mide menos de 768px (Móviles/Tablets)
    if (window.matchMedia("(max-width: 768px)").matches) {
        input.placeholder = "Lima, Múnich, etc.";
    } else {
        // Texto para pantallas grandes (Escritorio)
        input.placeholder = "Lima, Guayaquil, Londres, Nueva York";
    }
}

// Ejecutar al cargar la página
actualizarPlaceholder();

// Ejecutar cada vez que el usuario cambie el tamaño de la pantalla
window.addEventListener("resize", actualizarPlaceholder);