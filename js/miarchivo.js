// Variable para representar el monto inicial de la familia
let montoInicial = 0;

// Función para registrar ingreso de dinero
function registrarIngreso() {
    let ingreso = parseFloat(prompt("Ingrese el monto del ingreso:"));
    if (!isNaN(ingreso) && ingreso > 0) {
        montoInicial += ingreso;
        alert("Se ha registrado el ingreso correctamente.");
    } else {
        alert("Por favor, ingrese un monto válido.");
    }
}

// Función para registrar salida de dinero
function registrarSalida() {
    let salida = parseFloat(prompt("Ingrese el monto de la salida:"));
    if (!isNaN(salida) && salida > 0 && salida <= montoInicial) {
        montoInicial -= salida;
        alert("Se ha registrado la salida correctamente.");
    } else {
        alert("Monto inválido o insuficiente.");
    }
}

// Función para ver el monto actual
function verMontoActual() {
    alert("El monto actual es: " + montoInicial + " euros.");
}

// Ciclo do-while para mostrar las opciones al usuario
do {
    let opcion = parseInt(prompt("Seleccione una opción:\n1. Registrar ingreso de dinero\n2. Registrar salida de dinero\n3. Ver el monto actual\n4. Salir"));
    switch (opcion) {
        case 1:
            registrarIngreso();
            break;
        case 2:
            registrarSalida();
            break;
        case 3:
            verMontoActual();
            break;
        case 4:
            alert("Gracias por utilizar nuestra plataforma de control de gastos.");
            break;
        default:
            alert("Opción inválida. Por favor, seleccione una opción válida.");
    }
// Si la opción es 4 (Salir), salimos del bucle
    if (opcion === 4) {
        break;
    }
} while (true);