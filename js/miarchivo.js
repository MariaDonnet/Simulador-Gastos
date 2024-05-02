// Variable para representar el monto inicial de la familia
let montoInicial = 0;

// Función para ver el saldo actual
function verSaldoActual() {
    let saldo = montoInicial
    movimientos.forEach((movimiento) => {
        if (movimiento.tipo.toLowerCase() === 'ingreso') {
        saldo += movimiento.monto
        } else {
        saldo -= movimiento.monto
        }
    })
    alert(`El saldo actual es: ${saldo} euros.`);
}

class Movimiento {
    constructor(id, descripcion, monto, tipo, fecha) {
        this.id = id
        this.descripcion = descripcion
        this.monto = monto
        this.tipo = tipo
        this.fecha = fecha
    }
}

const movimientos = []

// Función que me muestre todos los movimientos realizados
function mostrarMovimientos() {
    let mensaje = `Lista de movimientos:
    
`;
    if (movimientos.length === 0) {
        mensaje = 'No hay movimientos registrados.'
    } else {
        movimientos.forEach((movimiento) => {
            mensaje += `ID: ${movimiento.id}, Descripción: ${movimiento.descripcion}, Monto: ${movimiento.monto}, Tipo: ${movimiento.tipo}, Fecha: ${movimiento.fecha}
`;
        })
    }
    alert(mensaje)
}

// Función para agregar ingresos o egresos
function agregarMovimiento() {
    const descripcion = prompt('Ingrese la descripción del movimiento:');
        // Validar que la descripción no esté vacía
        if (!descripcion) {
            alert('La descripción no puede estar vacía.');
            return;
        }
    let monto = parseFloat(prompt('Ingrese el monto del movimiento:'));
       // Validar que el monto sea un número válido
        if (isNaN(monto) || monto <= 0) {
        alert('El monto ingresado no es válido.');
        return;
    }
    const tipo = prompt('Ingrese el tipo de movimiento (Ingreso o Egreso):');
    // Validar que el tipo sea "Ingreso" o "Egreso"
    if (tipo.toLowerCase() !== 'ingreso' && tipo.toLowerCase() !== 'egreso') {
        alert('El tipo de movimiento ingresado no es válido. Debe ser "Ingreso" o "Egreso".');
        return;
    }
    
  // Obtenemos la fecha actual
    const fecha = new Date().toLocaleDateString();

    const nuevoMovimiento = new Movimiento(
        movimientos.length + 1,
        descripcion,
        monto,
        tipo,
        fecha,
    )

    movimientos.push(nuevoMovimiento)

    alert('Se ha registrado el movimiento con éxito.')
}

// Función para filtrar un movimiento por tipo 
function filtrarPorTipo() {
    const tipoFiltrar = prompt("Ingrese el tipo de movimiento a filtrar (Ingreso o Egreso):");
    const movimientosFiltrados = movimientos.filter((movimiento) => movimiento.tipo.toLowerCase() === tipoFiltrar.toLowerCase());

    if (movimientosFiltrados.length === 0) {
        alert("No se encontraron movimientos con el tipo especificado.");
    } else {
        let mensaje = `Movimientos de tipo ${tipoFiltrar}:
        
`;
        movimientosFiltrados.forEach((movimiento) => {
            mensaje += `ID: ${movimiento.id}, Descripción: ${movimiento.descripcion}, Monto: ${movimiento.monto}, Fecha: ${movimiento.fecha}
`;
        });
        alert(mensaje);
    }
}

// Función para buscar un movimiento por descripción
function buscarPorDescripcion() {
    const descripcionBuscar = prompt("Ingrese la descripción del movimiento a buscar:");
    const movimientosEncontrados = movimientos.filter((movimiento) => movimiento.descripcion.toLowerCase().includes(descripcionBuscar.toLowerCase()));

    if (movimientosEncontrados.length === 0) {
        alert("No se encontraron movimientos con la descripción especificada.");
    } else {
        let mensaje = `Movimientos con la descripción ${descripcionBuscar}:
        
`;
        movimientosEncontrados.forEach((movimiento) => {
            mensaje += `ID: ${movimiento.id}, Descripción: ${movimiento.descripcion}, Monto: ${movimiento.monto}, Tipo: ${movimiento.tipo}, Fecha: ${movimiento.fecha}
`;
        });
        alert(mensaje);
    }
}


let opcion;

do {
    opcion = parseInt(prompt(`Bienvenido al sistema de gestión de ingresos familiares
    
    1. Registrar movimiento
    2. Ver movimientos
    3. Ver el saldo actual
    4. Filtrar por tipo de movimiento
    5. Buscar por descripción
    Para salir, ingrese 0`));

    switch (opcion) {
        case 0:
            alert("Muchas gracias por utilizar el sistema de gestión de ingresos familiares. Lo esperamos pronto!");
            break;
        case 1:
            agregarMovimiento();
            break;
        case 2:
            mostrarMovimientos();
            break;
        case 3:
            verSaldoActual();
            break;
        case 4:
            filtrarPorTipo();
            break;
        case 5:
            buscarPorDescripcion();
            break;
        default:
            alert("Opción no válida. Por favor, seleccione una opción válida.");
            break;
    }
} while (opcion !== 0);