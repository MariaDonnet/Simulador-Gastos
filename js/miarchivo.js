// Array de movimientos precargados
let movimientosPrecargados = [];

// Función para cargar movimientos desde data.json usando fetch
function cargarMovimientos() {
    // Verificar si hay movimientos en localStorage
    const movimientosEnStorage = localStorage.getItem('movimientos');
    if (movimientosEnStorage) {
        movimientosPrecargados = JSON.parse(movimientosEnStorage);
        // Inicializar la visualización de los movimientos y el saldo
        mostrarMovimientos();
        verSaldoActual();
    } else {
        fetch("./js/data.json")
            .then(response => response.json())
            .then(data => {
                data.forEach(movimiento => {
                    // Agregar el movimiento al array de movimientos precargados
                    movimientosPrecargados.push(movimiento);
                });
                // Guardar los movimientos en localStorage para persistencia
                guardarMovimientos(movimientosPrecargados);
                // Inicializar la visualización de los movimientos y el saldo
                mostrarMovimientos();
                verSaldoActual();
            })
            .catch(error => {
                console.error('Error al cargar los movimientos:', error);
            });
    }
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

    // Validación
    if (!descripcion || isNaN(valor) || valor <= 0 || !fecha) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor complete todos los campos correctamente.'
        });
        return;
    }

    // Generar un nuevo ID único
    const nuevoId = generarIdUnico();

    // Crear un nuevo objeto de movimiento
    const nuevoMovimiento = {
        id: nuevoId,
        descripcion: descripcion,
        monto: valor,
        tipo: tipo,
        fecha: new Date(fecha).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'}),
    };

    // Agregar el nuevo movimiento al array de movimientos precargados
    movimientosPrecargados.push(nuevoMovimiento);

    // Guardar los movimientos en localStorage
    guardarMovimientos(movimientosPrecargados);

    // Limpiar los campos del formulario
    document.getElementById('descripcion').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('fecha').value = '';

    // Actualizar la visualización de los movimientos y el saldo
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

    // Filtrar los movimientos según el tipo seleccionado
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

    // Actualizar el total de ingresos y egresos
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
        title: '¿Estás seguro que desea eliminarlo?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
        if (result.isConfirmed) {
            // Filtrar el movimiento a eliminar del array de movimientos precargados
            movimientosPrecargados = movimientosPrecargados.filter(movimiento => movimiento.id !== id);
            
            // Guardar los movimientos actualizados en localStorage
            guardarMovimientos(movimientosPrecargados);

            // Actualizar la visualización de los movimientos
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

// EVENTOS
// Asignar eventos a los botones de filtro
document.getElementById('btnTodos').addEventListener('click', () => mostrarMovimientos('todos'));
document.getElementById('btnIngresos').addEventListener('click', () => mostrarMovimientos('ingreso'));
document.getElementById('btnEgresos').addEventListener('click', () => mostrarMovimientos('egreso'));

// Agregar un nuevo movimiento
document.getElementById('agregarMovimientoBtn').addEventListener('click', agregarMovimiento);

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarMovimientos();
});

// LOCALSTORAGE
// Generar un ID único utilizando un contador en localStorage
function generarIdUnico() {
    let contador = parseInt(localStorage.getItem('contadorID'), 10);
    if (isNaN(contador)) contador = 4; // Inicializar el contador si no existe
    contador += 1;
    localStorage.setItem('contadorID', contador.toString());
    return contador;
}
