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
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar los movimientos');
                }
                return response.json();
            })
            .then(data => {
                movimientosPrecargados = data;
                guardarMovimientos(movimientosPrecargados);
                procesarMovimientos();
            })
            .catch(error => {
                console.error('Error al cargar los movimientos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar los movimientos desde el servidor.'
                });
            });
    }
}

// Función para procesar los movimientos cargados
function procesarMovimientos() {
    movimientosPrecargados.forEach(movimiento => {
        movimiento.fecha = new Date(movimiento.fecha); // Convertir fecha a objeto de fecha
        movimiento.fecha = movimiento.fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    });
    mostrarMovimientos();
    verSaldoActual();
}

// Función para guardar movimientos en localStorage
function guardarMovimientos(movimientos) {
    localStorage.setItem('movimientos', JSON.stringify(movimientos));
}

// Función para validar un nuevo movimiento
function validarMovimiento(descripcion, valor, fecha, tipo) {
    const hoy = new Date();

    if (!descripcion.trim()) {
        return 'La descripción no puede estar vacía.';
    }
    if (isNaN(valor) || valor <= 0) {
        return 'El valor debe ser un número positivo.';
    }
    if (isNaN(fecha.getTime())) {
        return 'Fecha inválida.';
    }
    if (fecha.getTime() > hoy.getTime()) {
        return 'No puedes agregar movimientos con fecha posterior al día de hoy.';
    }
    if (tipo === 'egreso' && valor > calcularTotal('ingreso') - calcularTotal('egreso')) {
        return 'No tienes suficiente saldo para este egreso.';
    }
    return null;
}

// Función para agregar un nuevo movimiento
function agregarMovimiento() {
    const descripcion = document.getElementById('descripcion').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const tipo = document.getElementById('tipo').value;
    const fecha = new Date(document.getElementById('fecha').value);

    const error = validarMovimiento(descripcion, valor, fecha, tipo);
    if (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error
        });
        return;
    }

    const fechaFormateada = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const nuevoId = generarIdUnico();
    const nuevoMovimiento = {
        id: nuevoId,
        descripcion: descripcion,
        monto: valor,
        tipo: tipo,
        fecha: fechaFormateada,
    };

    movimientosPrecargados.push(nuevoMovimiento);
    guardarMovimientos(movimientosPrecargados);

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
    listaMovimientos.innerHTML = '';

    const movimientosFiltrados = tipoFiltrado === 'todos' ? movimientosPrecargados : movimientosPrecargados.filter(movimiento => movimiento.tipo === tipoFiltrado);

    movimientosFiltrados.forEach(movimiento => {
        const filaMovimiento = document.createElement('tr');

        const descripcion = document.createElement('td');
        descripcion.textContent = movimiento.descripcion;
        filaMovimiento.appendChild(descripcion);

        const monto = document.createElement('td');
        monto.textContent = movimiento.monto;
        filaMovimiento.appendChild(monto);

        const tipo = document.createElement('td');
        tipo.textContent = movimiento.tipo.charAt(0).toUpperCase() + movimiento.tipo.slice(1);
        filaMovimiento.appendChild(tipo);

        const fecha = document.createElement('td');
        fecha.textContent = movimiento.fecha;
        filaMovimiento.appendChild(fecha);

        const eliminar = document.createElement('td');
        const iconoEliminar = document.createElement('i');
        iconoEliminar.className = 'fas fa-times text-danger';
        iconoEliminar.style.cursor = 'pointer';
        iconoEliminar.addEventListener('click', () => eliminarMovimiento(movimiento.id));
        eliminar.appendChild(iconoEliminar);
        filaMovimiento.appendChild(eliminar);

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

// Eventos
document.getElementById('btnTodos').addEventListener('click', () => mostrarMovimientos('todos'));
document.getElementById('btnIngresos').addEventListener('click', () => mostrarMovimientos('ingreso'));
document.getElementById('btnEgresos').addEventListener('click', () => mostrarMovimientos('egreso'));
document.getElementById('agregarMovimientoBtn').addEventListener('click', agregarMovimiento);

document.addEventListener('DOMContentLoaded', () => {
    cargarMovimientos();
});

// Generar un nuevo ID único
function generarIdUnico() {
    let contador = parseInt(localStorage.getItem('contadorID'), 10) || 0;
    contador += 1;
    localStorage.setItem('contadorID', contador.toString());
    return contador;
}
