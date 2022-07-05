import { HTMLUtils } from './HTMLUtils';
import { Simulador } from './Simulador';
import './style.css';

//-----------------------Definiciones------------------------------------------------
//-----------------------Definición de los cuadros de texto de la interfaz de usuario.
const txtCantNros: HTMLInputElement = document.getElementById(
  'txtCantNros'
) as HTMLInputElement;
const txtEventoDesde: HTMLInputElement = document.getElementById(
  'txtEventoDesde'
) as HTMLInputElement;
const txtMediaLlegadaPacientes: HTMLInputElement = document.getElementById(
  'txtMediaLlegadaPacientes'
) as HTMLInputElement;
const txtAFinDeDeterminacion: HTMLInputElement = document.getElementById(
  'txtAFinDeDeterminacion'
) as HTMLInputElement;
const txtBFinDeDeterminacion: HTMLInputElement = document.getElementById(
  'txtBFinDeDeterminacion'
) as HTMLInputElement;
const txtAFinDeAutorizacion: HTMLInputElement = document.getElementById(
  'txtAFinDeAutorizacion'
) as HTMLInputElement;
const txtBFinDeAutorizacion: HTMLInputElement = document.getElementById(
  'txtBFinDeAutorizacion'
) as HTMLInputElement;
const txtAFinDeAntencion: HTMLInputElement = document.getElementById(
  'txtAFinDeAntencion'
) as HTMLInputElement;
const txtBFinDeAntencion: HTMLInputElement = document.getElementById(
  'txtBFinDeAntencion'
) as HTMLInputElement;
const txtAFinDePago: HTMLInputElement = document.getElementById(
  'txtAFinDePago'
) as HTMLInputElement;
const txtBFinDePago: HTMLInputElement = document.getElementById(
  'txtBFinDePago'
) as HTMLInputElement;

//-----------------------Definición de la seccion de la simulación.
const divTablaSimulacion: HTMLDivElement = document.getElementById(
  'divTablaSimulacion'
) as HTMLDivElement;

//-----------------------Definición de la tabla de simulación de colas.
const tablaSimulacion: HTMLTableElement = document.getElementById(
  'tablaSimulacion'
) as HTMLTableElement;
const cantEncabezadosTablaSimulacion = tablaSimulacion.rows[0].cells.length;
const cantSubEncabezadosTablaSimulacion = tablaSimulacion.rows[1].cells.length;
const indicesEventosCandidatos: number[] = [5, 8, 13, 16, 17, 20];
const colPacientes: string[] = [
  'ID Paciente',
  'Tipo Paciente',
  'Estado',
  'Minuto de llegada a sala de espera',
];

//-----------------------Ocultamos la seccion en donde esta la tabla.
HTMLUtils.ocultarSeccion(divTablaSimulacion);

//-----------------------Definición de botones de la interfaz de usuario.
const btnSimular: HTMLButtonElement = document.getElementById(
  'btnSimular'
) as HTMLButtonElement;

//-----------------------Definición de los objetos que realizan la simulación de colas.
let simulador: Simulador;
let matrizEstado: any[][];
let cantMaxPacientes: number;

//-----------------------Definición de los parámetros.
let n: number;
let eventoDesde: number;
let mediaLlegadaPaciente: number;
let AFinDeterminacion: number;
let BFinDeterminacion: number;
let AFinAutorizacion: number;
let BFinAutorizacion: number;
let AFinAtencion: number;
let BFinAtencion: number;
let AFinPago: number;
let BFinPago: number;

//-----------------------Definición para las metricas.
let cantidadEnSala: number;
let promedioU: number;
let tiempoMaxU: number;
let promedioC: number;
let tiempoMaxC: number;
let dinero: number;

//-----------------------Funcionalidad------------------------------------------------
//-----------------------Disparamos la simulación.
btnSimular.addEventListener('click', () => {
  HTMLUtils.ocultarSeccion(divTablaSimulacion);
  simular();
});

const simular = () => {
  //-----------------------Validamos los parámetros ingresados por el usuario.
  if (!validarParametros()) return;

  var startTime = performance.now();
  HTMLUtils.limpiarTablaSimulacion(
    tablaSimulacion,
    cantEncabezadosTablaSimulacion,
    cantSubEncabezadosTablaSimulacion
  );
  console.log(
    `La limpieza tardó ${performance.now() - startTime} milisegundos`
  );

  //Realizamos la simulacion

  simulador = new Simulador();
  simulador.simular(
    n,
    eventoDesde,
    mediaLlegadaPaciente,
    AFinDeterminacion,
    BFinDeterminacion,
    AFinAutorizacion,
    BFinAutorizacion,
    AFinAtencion,
    BFinAtencion,
    AFinPago,
    BFinPago
  );

  matrizEstado = simulador.getMatrizEstado();
  cantMaxPacientes = simulador.getCantMaxPacientesEnSistema();

  //Cargamos la tabla a mostrar.
  HTMLUtils.completarEncabezadosPacientes(
    cantMaxPacientes,
    tablaSimulacion,
    colPacientes
  );
  HTMLUtils.llenarTablaSimulacion(
    matrizEstado,
    indicesEventosCandidatos,
    tablaSimulacion
  );
  console.log(
    `La renderización tardó ${performance.now() - startTime} milisegundos`
  );
  HTMLUtils.mostrarSeccion(divTablaSimulacion);

  //Definiciones de metricas
  cantidadEnSala = simulador.cantidadMax;
  promedioU = simulador.getPromedioUrgentes();
  tiempoMaxU = simulador.tiempoMaximoUrgente;
  promedioC = simulador.getPromedioComunes();
  tiempoMaxC = simulador.tiempoMaximoComun;
  dinero = simulador.dineroAcumulado;

  //Cargamos las metricas
  document.getElementById('txtCantSala').innerHTML =
    '-->Cola máxima en sala de espera: ' + cantidadEnSala.toString();
  document.getElementById('txtTiempoMaxU').innerHTML =
    '-->Tiempo máximo de espera para un paciente urgente: ' +
    tiempoMaxU.toFixed(4) +
    ' minutos';
  document.getElementById('txtPromedioU').innerHTML =
    '-->Tiempo promedio de espera para un paciente urgente: ' +
    promedioU.toFixed(4) +
    ' minutos';
  document.getElementById('txtTiempoMaxC').innerHTML =
    '-->Tiempo máximo de espera para un paciente común: ' +
    tiempoMaxC.toFixed(4) +
    ' minutos';
  document.getElementById('txtPromedioC').innerHTML =
    '-->Tiempo promedio de espera para un paciente común: ' +
    promedioC.toFixed(4) +
    ' minutos';
  document.getElementById('txtRecaudacion').innerHTML =
    '-->Dinero acumulado en la simulación: $' + dinero.toString();
};

//-----------------------Metodo de validación de los parámetros del usuario.
function validarParametros(): boolean {
  if (txtCantNros.value === '' || txtEventoDesde.value === '') {
    alert('Tiene que ingresar todos los parámetros solicitados.');
    return false;
  }
  n = Number(txtCantNros.value);
  eventoDesde = Number(txtEventoDesde.value);
  mediaLlegadaPaciente = Number(txtMediaLlegadaPacientes.value);
  AFinDeterminacion = Number(txtAFinDeDeterminacion.value);
  BFinDeterminacion = Number(txtBFinDeDeterminacion.value);
  AFinAutorizacion = Number(txtAFinDeAutorizacion.value);
  BFinAutorizacion = Number(txtBFinDeAutorizacion.value);
  AFinAtencion = Number(txtAFinDeAntencion.value);
  BFinAtencion = Number(txtBFinDeAntencion.value);
  AFinPago = Number(txtAFinDePago.value);
  BFinPago = Number(txtBFinDePago.value);

  if (n <= 0) {
    alert('La cantidad de eventos a generar debe ser mayor a cero.');
    return false;
  }
  if (eventoDesde < 0 || eventoDesde > n) {
    alert(
      'El evento desde ingresado debe estar comprendido entre 0 y ' + n + '.'
    );
    return false;
  }
  if (mediaLlegadaPaciente <= 0) {
    alert('La media debe ser un valor mayor a cero');
    return false;
  }
  if (
    AFinDeterminacion < 0 ||
    BFinDeterminacion < 0 ||
    AFinAutorizacion < 0 ||
    BFinAutorizacion < 0 ||
    AFinAtencion < 0 ||
    BFinAtencion < 0 ||
    AFinPago < 0 ||
    BFinPago < 0
  ) {
    alert(
      'Los limites A y B representan tiempos por eso no pueden ser un valor negativo.'
    );
    return false;
  }
  if (AFinDeterminacion >= BFinDeterminacion) {
    alert('El valor de "B" debe ser mayor a "A".');
    return false;
  }
  if (AFinAutorizacion >= BFinAutorizacion) {
    alert('El valor de "B" debe ser mayor a "A".');
    return false;
  }
  if (AFinAtencion >= BFinAtencion) {
    alert('El valor de "B" debe ser mayor a "A".');
    return false;
  }
  if (AFinPago >= BFinPago) {
    alert('El valor de "B" debe ser mayor a "A".');
    return false;
  }
  return true;
}
