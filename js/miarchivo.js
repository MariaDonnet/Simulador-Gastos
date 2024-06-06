// Array de movimientos precargados
let movimientosPrecargados = JSON.parse(localStorage.getItem('movimientos')) || [];

// Función para cargar movimientos desde data.json usando fetch
function cargarMovimientos() {
    const movimientosEnStorage = localStorage.getItem('movimientos');
    if (movimientosEnStorage) {
        movimientosPrecargados = JSON.parse(movimientosEnStorage);
        procesarMovimientos();
    } else {
        fetch("./js/data.json")
            .then(response => response.json())
            .then(data => {
                movimientosPrecargados = data;
                guardarMovimientos(movimientosPrecargados);
                procesarMovimientos();
            })
            .catch(error => {
                console.error('Error al cargar los movimientos:', error);
            });
    }
}

// Función para procesar los movimientos cargados
function procesarMovimientos() {
    movimientosPrecargados.forEach(movimiento => {
        movimiento.fecha = movimiento.fecha.toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'});
    });
    mostrarMovimientos();
    verSaldoActual();
}

// Función para guardar movimientos en localStorage
function guardarMovimientos(movimientos) {
    localStorage.setItem('movimientos', JSON.stringify(movimientos));
}

// Función para agregar un nuevo movimiento
function agregarMovimiento() {
    const descripcion = document.getElementById('descripcion').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const tipo = document.getElementById('tipo').value;
    const fecha = document.getElementById('fecha').value;

    const hoy = new Date(); 
    if (fecha > hoy) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No puedes agregar movimientos con fecha posterior al día de hoy.'
        });
        return;
    }

    if (tipo === 'egreso' && valor > calcularTotal('ingreso') - calcularTotal('egreso')) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No tienes suficiente saldo para este egreso.'
        });
        return;
    }

    if (!descripcion || isNaN(valor) || valor <= 0 || !fecha) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor complete todos los campos correctamente.'
        });
        return;
    }

    // Formatear la fecha
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'});

    // Generar un nuevo ID único
    const nuevoId = generarIdUnico();

    // Crear un nuevo objeto de movimiento
    const nuevoMovimiento = {
        id: nuevoId,
        descripcion: descripcion,
        monto: valor,
        tipo: tipo,
        fecha: fechaFormateada,
    };

    // Agregar el nuevo movimiento al array de movimientos precargados
    movimientosPrecargados.push(nuevoMovimiento);

    // Guardar los movimientos en localStorage
    guardarMovimientos(movimientosPrecargados);

    // Limpiar los campos del formulario
    document.getElementById('descripcion').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('fecha').value = '';

    mostrarMovimientos();
    verSaldoActual();

    Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Se ha registrado el movimiento con éxito.'
    });
}

// Función para mostrar los movimientos en la página
function mostrarMovimientos(tipoFiltrado = 'todos') {
    const listaMovimientos = document.getElementById('lista-movimientos');

    // Limpiar los elementos de la lista
    listaMovimientos.innerHTML = '';

    const movimientosFiltrados = tipoFiltrado === 'todos' ? movimientosPrecargados : movimientosPrecargados.filter(movimiento => movimiento.tipo === tipoFiltrado);

    // Recorrer los movimientos filtrados y agregarlos a la lista
    movimientosFiltrados.forEach(movimiento => {
        const filaMovimiento = document.createElement('tr');
        filaMovimiento.innerHTML = `
            <td>${movimiento.descripcion}</td>
            <td>${movimiento.monto}</td>
            <td>${movimiento.tipo.charAt(0).toUpperCase() + movimiento.tipo.slice(1)}</td>
            <td>${movimiento.fecha}</td>
            <td><i class="fas fa-times text-danger" onclick="eliminarMovimiento(${movimiento.id})" style="cursor: pointer;"></i></td>
        `;
        listaMovimientos.appendChild(filaMovimiento);
    });

    document.getElementById('totalIngresos').textContent = `Total de Ingresos: ${calcularTotal('ingreso')} euros.`;
    document.getElementById('totalEgresos').textContent = `Total de Egresos: ${calcularTotal('egreso')} euros.`;
}

// Función para calcular el total de ingresos o egresos
function calcularTotal(tipo) {
    return movimientosPrecargados.reduce((total, movimiento) => {
        if (movimiento.tipo === tipo) {
            return total + movimiento.monto;
        }
        return total;
    }, 0);
}

// Función para calcular y mostrar el saldo actual
function verSaldoActual() {
    const saldo = calcularTotal('ingreso') - calcularTotal('egreso');
    document.getElementById('saldoOutput').textContent = `El saldo actual es: ${saldo} euros.`;
}

// Función para eliminar un movimiento
function eliminarMovimiento(id) {
    Swal.fire({
        title: '¿Estás seguro que deseas eliminarlo?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar', 
    }).then((result) => {
        if (result.isConfirmed) {
            movimientosPrecargados = movimientosPrecargados.filter(movimiento => movimiento.id !== id);
            
            guardarMovimientos(movimientosPrecargados);
            mostrarMovimientos();
            verSaldoActual();

            Swal.fire(
                'Eliminado!',
                'El movimiento ha sido eliminado con éxito.',
                'success'
            );
        }
    });
}

//EVENTOS
document.getElementById('btnTodos').addEventListener('click', () => mostrarMovimientos('todos'));
document.getElementById('btnIngresos').addEventListener('click', () => mostrarMovimientos('ingreso'));
document.getElementById('btnEgresos').addEventListener('click', () => mostrarMovimientos('egreso'));
document.getElementById('agregarMovimientoBtn').addEventListener('click', agregarMovimiento);

document.addEventListener('DOMContentLoaded', () => {
    cargarMovimientos();
});

//LOCALSTORAGE
function generarIdUnico() {
    let contador = parseInt(localStorage.getItem('contadorID'), 10);
    if (isNaN(contador)) contador = 4; 
    contador += 1;
    localStorage.setItem('contadorID', contador.toString());
    return contador;
}
