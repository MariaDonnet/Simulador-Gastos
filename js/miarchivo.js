// Array de movimientos precargados
let movimientosPrecargados = cargarMovimientos().length > 0 ? cargarMovimientos() : [
    { id: 1, descripcion: "Salario mensual", monto: 3000, tipo: "ingreso" },
    { id: 2, descripcion: "Alquiler", monto: 600, tipo: "egreso" },
    { id: 3, descripcion: "Alimentación", monto: 300, tipo: "egreso" },
    { id: 4, descripcion: "Diversión", monto: 200, tipo: "egreso" }
];

// Función para agregar un nuevo movimiento
function agregarMovimiento() {
    const descripcion = document.getElementById('descripcion').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const tipo = document.getElementById('tipo').value;

    // Validación
    if (!descripcion || isNaN(valor) || valor <= 0) {
        alert('Por favor complete todos los campos correctamente.');
        return;
    }

    // Generar un nuevo ID único
    const nuevoId = generarIdUnico();

    // Crear un nuevo objeto de movimiento
    const nuevoMovimiento = {
        id: nuevoId,
        descripcion: descripcion,
        monto: valor,
        tipo: tipo
    };

    // Agregar el nuevo movimiento al array de movimientos precargados
    movimientosPrecargados.push(nuevoMovimiento);

    // Guardar los movimientos en localStorage
    guardarMovimientos(movimientosPrecargados);

    // Limpiar los campos del formulario
    document.getElementById('descripcion').value = '';
    document.getElementById('valor').value = '';

    // Actualizar la visualización de los movimientos y el saldo
    mostrarMovimientos();
    verSaldoActual();
    alert('Se ha registrado el movimiento con éxito.');
}

// Función para mostrar los movimientos en la página
function mostrarMovimientos(tipoFiltrado = 'todos') {
    const listaIngresos = document.getElementById('lista-ingresos');
    const listaEgresos = document.getElementById('lista-egresos');
    const tituloIngresos = document.querySelector('.ingreso_titulo');
    const tituloEgresos = document.querySelector('.egreso_titulo');

    // Limpiar los elementos de la lista
    listaIngresos.innerHTML = '';
    listaEgresos.innerHTML = '';
    tituloIngresos.style.display = 'none';
    tituloEgresos.style.display = 'none';

    // Filtrar los movimientos según el tipo seleccionado
    const movimientosFiltrados = tipoFiltrado === 'todos' ? movimientosPrecargados : movimientosPrecargados.filter(movimiento => movimiento.tipo === tipoFiltrado);

    // Recorrer los movimientos filtrados y agregarlos a la lista correspondiente
    movimientosFiltrados.forEach(movimiento => {
        const filaMovimiento = document.createElement('tr');
        filaMovimiento.innerHTML = `
            <td>${movimiento.id}</td>
            <td>${movimiento.descripcion}</td>
            <td>${movimiento.monto}</td>
            <td><i class="fas fa-times text-danger" onclick="eliminarMovimiento(${movimiento.id})" style="cursor: pointer;"></i></td>
        `;
        if (movimiento.tipo === 'ingreso') {
            listaIngresos.appendChild(filaMovimiento);
            tituloIngresos.style.display = 'block';
        } else {
            listaEgresos.appendChild(filaMovimiento);
            tituloEgresos.style.display = 'block';
        }
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
    // Filtrar el movimiento a eliminar del array de movimientos precargados
    movimientosPrecargados = movimientosPrecargados.filter(movimiento => movimiento.id !== id);
    
    // Guardar los movimientos actualizados en localStorage
    guardarMovimientos(movimientosPrecargados);

    // Actualizar la visualización de los movimientos
    mostrarMovimientos();
    verSaldoActual();

    alert('El movimiento ha sido eliminado con éxito.');
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
    mostrarMovimientos();
    verSaldoActual();
});

//LOCALSTORAGE
// Función para cargar movimientos desde localStorage
function cargarMovimientos() {
    const movimientosGuardados = localStorage.getItem('movimientos');
    const contadorGuardado = localStorage.getItem('contadorID') || '4'; // Inicializar el contador si no existe
    localStorage.setItem('contadorID', contadorGuardado);
    return movimientosGuardados ? JSON.parse(movimientosGuardados) : [];
}

// Función para guardar movimientos en localStorage
function guardarMovimientos(movimientos) {
    localStorage.setItem('movimientos', JSON.stringify(movimientos));
}

// Generar un ID único utilizando un contador en localStorage
function generarIdUnico() {
    let contador = parseInt(localStorage.getItem('contadorID'), 10);
    contador += 1;
    localStorage.setItem('contadorID', contador.toString());
    return contador;
}


