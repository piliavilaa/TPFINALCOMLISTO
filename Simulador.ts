import { Evento } from './Evento';
import { Enfermero } from './Enfermero';
import { Paciente } from './Paciente';
import { Medico } from './Medico';
import { Utils } from './Utils';
import { EstadoPaciente } from './EstadoPaciente';
import { Obra } from './Obra';
import { EstadoMedico } from './EstadoMedico';

export class Simulador {
  public mediaTiempoEntreLlegadas: number;
  public aTiempoDeterminacion: number;
  public bTiempoDeterminacion: number;
  public aTiempoAutorizacion: number;
  public bTiempoAutorizacion: number;
  public aTiempoAtencion: number;
  public bTiempoAtencion: number;
  public aTiempoPago: number;
  public bTiempoPago: number;
  public matrizEstado: string[][];
  public cantMaxPacientes: number;
  public probTiposPacientes: number[];
  public tiposPacientes: string[];
  public cantEnSala: number;
  public cantidadMax: number;
  public acuEsperaPacientesUrgentes: number;
  public totalPacientesUrgente: number;
  public tiempoMaximoUrgente: number;
  public acuEsperaPacientesComunes: number;
  public totalPacientesComun: number;
  public tiempoMaximoComun: number;
  public dineroAcumulado: number;


  //-------------------Metodo simular

  public simular(
    cantEventos: number,
    eventoDesde: number,
    mediaLlegadaPaciente: number,
    AFinDeterminacion: number,
    BFinDeterminacion: number,
    AFinAutorizacion: number,
    BFinAutorizacion: number,
    AFinAtencion: number,
    BFinAtencion: number,
    AFinPago: number,
    BFinPago: number
  ): void {
    //----------------Definiciones

    this.probTiposPacientes = [0.4, 1];
    this.mediaTiempoEntreLlegadas = mediaLlegadaPaciente;
    this.aTiempoDeterminacion = AFinDeterminacion;
    this.bTiempoDeterminacion = BFinDeterminacion;
    this.aTiempoAutorizacion = AFinAutorizacion;
    this.bTiempoAutorizacion = BFinAutorizacion;
    this.aTiempoAtencion = AFinAtencion;
    this.bTiempoAtencion = BFinAtencion;
    this.aTiempoPago = AFinPago;
    this.bTiempoPago = BFinPago;

    this.matrizEstado = [];
    this.tiposPacientes = ['Urgente', 'Comun'];

    // Definimos el rango de filas que vamos a mostrar.
    let indiceHasta: number = eventoDesde + 399;
    if (indiceHasta > cantEventos - 1) indiceHasta = cantEventos;

    // Vector de estado.
    let evento: string[] = [];

    let tipoEvento: Evento;
    let reloj: number = 0;

    // Llegada de un paciente.
    let rndLlegada: number = -1;
    let tiempoEntreLlegadas: number = -1;
    let proximaLlegada: number = -1;

    // Determinación del paciente.
    let rndDeterminacion: number = -1;
    let tiempoDeterminacion: number = -1;
    let finDeterminacion: number = -1;
    let rndTipoPaciente: number = -1;
    let tipoPaciente: string = '';

    // Autorización del paciente.
    let rndAutorizacion: number = -1;
    let tiempoAutorizacion: number = -1;
    let finAutorizacion: number = -1;

    // Atención del paciente.
    let rndAntencion: number = -1;
    let tiempoAtencion: number = -1;
    let finAtencion1: number = -1;
    let finAtencion2: number = -1;

    // Pago del paciente.
    let rndPago: number = -1;
    let tiempoPago: number = -1;
    let finPago: number = -1;

    // Enfermero.
    let enfermero = new Enfermero();
    let colaEnfermero: Paciente[] = [];

    // Medicos.
    let medico1 = new Medico();
    let medico2 = new Medico();
    let colaMedicosUrgencia: Paciente[] = [];
    let colaMedicosComun: Paciente[] = [];
    let tiempoRemanencia1: number = -1;
    let tiempoRemanencia2: number = -1;
    // Obra
    let obra = new Obra();
    let colaObraSocial: Paciente[] = [];

    // Pacientes en el sistema.
    let pacientesEnSistema: Paciente[] = [];

    //Variables estadisticas
    this.cantEnSala = 0;
    this.cantidadMax = 0;
    let pacienteEnObra: number = 0;
    this.acuEsperaPacientesUrgentes = 0;
    this.totalPacientesUrgente  = 0;
    this.tiempoMaximoUrgente = 0;
    this.acuEsperaPacientesComunes = 0;
    this.totalPacientesComun  = 0;
    this.tiempoMaximoComun = 0;
    this.dineroAcumulado = 0;
    let totalPacientes: number = 0;
    this.cantMaxPacientes = 0;

    for (let i: number = 0; i < cantEventos; i++) {
      evento = [];

      // Determinamos el tipo de evento.
      if (i == 0) {
        tipoEvento = Evento.INICIO_SIMULACION;
      } else if (i == cantEventos - 1) {
        tipoEvento = Evento.FIN_SIMULACION;
      } else {
        let eventosCandidatos: number[] = [
          proximaLlegada,
          finDeterminacion,
          finAutorizacion,
          finAtencion1,
          finAtencion2,
          finPago,
        ];
        for (let i: number = 0; i < pacientesEnSistema.length; i++) {
          let paciente: Paciente = pacientesEnSistema[i];
        }
        reloj = Utils.getMenorMayorACero(eventosCandidatos);
        tipoEvento = this.getSiguienteEvento(eventosCandidatos);
      }

      switch (tipoEvento) {
        case Evento.INICIO_SIMULACION: {
          rndLlegada = Math.random();
          tiempoEntreLlegadas = this.getTiempoEntreLlegadas(rndLlegada);
          proximaLlegada = reloj + tiempoEntreLlegadas;
          break;
        }

        case Evento.LLEGADA_PACIENTE: {
          // Generamos la llegada del próximo paciente.
          rndLlegada = Math.random();
          tiempoEntreLlegadas = this.getTiempoEntreLlegadas(rndLlegada);
          proximaLlegada = reloj + tiempoEntreLlegadas;
          totalPacientes++;

          // Creamos el objeto paciente.
          let tipo: string = 'Indefinido';
          let paciente: Paciente = new Paciente(totalPacientes, tipo, 0);

          //Preguntamos por el enfermero
          if (enfermero.estaLibre()) {
            paciente.siendoDeterminado();
            enfermero.ocupado();

            rndDeterminacion = Math.random();
            tiempoDeterminacion = this.getTiempoDeterminacion(rndDeterminacion);
            finDeterminacion = reloj + tiempoDeterminacion;
          }
          // Lo mandamos a la cola del enfermero porque no esta libre
          else {
            paciente.esperandoDeterminacion();
            colaEnfermero.push(paciente);
          }
          pacientesEnSistema.push(paciente);
          break;
        }

        case Evento.FIN_DETERMINACION: {
          finDeterminacion = -1;
          //--------PARA EL PACIENTE QUE ESTABA SIENDO DETERMINADO
          // Buscamos el paciente determinado y le asignamos el tipo.
          let pacienteAtendido: Paciente = pacientesEnSistema.find(
            (paciente) =>
              paciente.getEstado() == EstadoPaciente.SIENDO_DETERMINADO
          );
          rndTipoPaciente = Math.random();
          tipoPaciente = this.getTipoPaciente(rndTipoPaciente);
          pacienteAtendido.TipoPaciente = tipoPaciente;
          pacienteAtendido.Minuto = reloj;

          //Vemos si la obra social esta disponible
          if (obra.estaLibre()) {
            obra.ocupado();
            pacienteAtendido.siendoAutorizado();
            // calculo el fin de autorizacion
            rndAutorizacion = Math.random();
            tiempoAutorizacion = this.getTiempoAutorizacion(rndAutorizacion);
            finAutorizacion = reloj + tiempoAutorizacion;
          } else {
            //lo meto en la cola de la obra social sin calcular su tiempo de autorizacion
            pacienteAtendido.esperandoObra();
            colaObraSocial.push(pacienteAtendido);
          }

          //--------PARA EL PACIENTE QUE INGRESA A LA DETERMINACION
          // Preguntamos si hay alguien en la cola.
          if (colaEnfermero.length === 0) {
            enfermero.libre();
          } else {
            // Quitamos a un paciente de la cola
            let pacienteIngresa: Paciente = colaEnfermero.shift();
            //vemos si el paciente que ingresa esta para pagar o esta para ser determinado
            if (pacienteIngresa.getEstado() == EstadoPaciente.ESPERANDO_PAGO) {
              pacienteIngresa.pagando();
              rndPago = Math.random();
              tiempoPago = this.getTiempoDeterminacion(rndPago);
              finPago = reloj + tiempoPago;
            } else {
              pacienteIngresa.siendoDeterminado();
              rndDeterminacion = Math.random();
              tiempoDeterminacion =
                this.getTiempoDeterminacion(rndDeterminacion);
              finDeterminacion = reloj + tiempoDeterminacion;
            }
          }
          break;
        }

        case Evento.FIN_AUTORIZACION: {
          finAutorizacion = -1;
          //--------PARA EL PACIENTE QUE ESTABA SIENDO_AUTORIZADO
          // Buscamos el paciente atendido y le asignamos el tipo.
          let pacienteAutorizado: Paciente = pacientesEnSistema.find(
            (paciente) =>
              paciente.getEstado() == EstadoPaciente.SIENDO_AUTORIZADO
          );
          let tiempoEspera =  reloj - pacienteAutorizado.getMinutoLlegada();
          
          //paciente comun
          if (pacienteAutorizado.getTipoPaciente() == 'Comun') {
            //medico 1 libre
            if (medico1.estaLibre()) {
              pacienteAutorizado.siendoAtendido1();
              medico1.atendiendoComun();
              rndAntencion = Math.random();
              tiempoAtencion = this.getTiempoAtencion(rndAntencion);
              finAtencion1 = reloj + tiempoAtencion;
              this.acuEsperaPacientesComunes += tiempoEspera;
              this.totalPacientesComun += 1;

              if (tiempoEspera > this.tiempoMaximoComun)
                {
                  this.tiempoMaximoComun = tiempoEspera;
                }

            } else {
              if (medico2.estaLibre()) {
                //medico 2 libre y el uno no esta libre
                pacienteAutorizado.siendoAtendido2();
                medico2.atendiendoComun();
                rndAntencion = Math.random();
                tiempoAtencion = this.getTiempoAtencion(rndAntencion);
                finAtencion2 = reloj + tiempoAtencion;
                
                this.acuEsperaPacientesComunes += tiempoEspera;
                this.totalPacientesComun += 1;

                if (tiempoEspera > this.tiempoMaximoComun)
                {
                  this.tiempoMaximoComun = tiempoEspera;
                }

              } else {
                //el medico 1 y el medico 2 estan ocupados
                colaMedicosComun.push(pacienteAutorizado);
                pacienteAutorizado.esperandoAtencion();
              }
            }
          }
          //paciente urgente
          else {
            //1 - si los dos medicos estan atendiendo urgencia
            if (
              medico1.estaAtendiendoComun() &&
              medico2.estaAtendiendoUrgencia()
            ) {
              colaMedicosUrgencia.push(pacienteAutorizado);
              pacienteAutorizado.esperandoAtencion();
            }
            //2 - El medico 1 esta libre, se va con el 1
            else if (medico1.estaLibre()) {
              pacienteAutorizado.siendoAtendido1();
              medico1.atendiendoUrgencia();
              rndAntencion = Math.random();
              tiempoAtencion = this.getTiempoAtencion(rndAntencion);
              finAtencion1 = reloj + tiempoAtencion;
              this.acuEsperaPacientesUrgentes += tiempoEspera;
              this.totalPacientesUrgente +=1;
              if (tiempoEspera > this.tiempoMaximoUrgente)
                {
                  this.tiempoMaximoUrgente = tiempoEspera;
                }
            }
            //3 - El medico 1 esta con comun y el dos ocupado, se va con el 1
            else if (
              medico1.estaAtendiendoComun() &&
              (medico2.estaAtendiendoUrgencia() ||
                medico2.estaAtendiendoComun())
            ) {
              //que pasa con el paciente comun que estaba siendo atendido
              let pacienteInterrumpido: Paciente = pacientesEnSistema.find(
                (paciente) =>
                  paciente.getEstado() == EstadoPaciente.SIENDO_ATENDIDO1
              );
              pacienteInterrumpido.enInterrupcion1();
              tiempoRemanencia1 = finAtencion1 - reloj;

              //que pasa con el urgente que pasa a atenderse
              pacienteAutorizado.siendoAtendido1();
              medico1.atendiendoUrgencia();
              rndAntencion = Math.random();
              tiempoAtencion = this.getTiempoAtencion(rndAntencion);
              finAtencion1 = tiempoAtencion + reloj;
              this.acuEsperaPacientesUrgentes += tiempoEspera;
              this.totalPacientesUrgente +=1;
              if (tiempoEspera > this.tiempoMaximoUrgente)
                {
                  this.tiempoMaximoUrgente = tiempoEspera;
                }
            }
            //4 - medico 2 esta libre, se va con el 2
            else if (medico2.estaLibre()) {
              pacienteAutorizado.siendoAtendido2();
              medico2.atendiendoUrgencia();
              rndAntencion = Math.random();
              tiempoAtencion = this.getTiempoAtencion(rndAntencion);
              finAtencion2 = reloj + tiempoAtencion;
              this.acuEsperaPacientesUrgentes += tiempoEspera;
              this.totalPacientesUrgente +=1;
              if (tiempoEspera > this.tiempoMaximoUrgente)
                {
                  this.tiempoMaximoUrgente = tiempoEspera;
                }
            }
            //5 - medico 2 esta atendiendo comun y el 1 a urgencia, se va con el 2
            else if (
              medico2.estaAtendiendoComun() &&
              medico1.estaAtendiendoUrgencia()
            ) {
              //que pasa con el paciente que va a interrumpirse
              let pacienteInterrumpido2: Paciente = pacientesEnSistema.find(
                (paciente) =>
                  paciente.getEstado() == EstadoPaciente.SIENDO_ATENDIDO2
              );
              pacienteInterrumpido2.enInterrupcion2();
              tiempoRemanencia2 = finAtencion2 - reloj;

              //que pasa con el urgente
              pacienteAutorizado.siendoAtendido2();
              medico2.atendiendoUrgencia();
              rndAntencion = Math.random();
              tiempoAtencion = this.getTiempoAtencion(rndAntencion);
              finAtencion2 = reloj + tiempoAtencion;
              this.acuEsperaPacientesUrgentes += tiempoEspera;
              this.totalPacientesUrgente +=1;
              if (tiempoEspera > this.tiempoMaximoUrgente)
                {
                  this.tiempoMaximoUrgente = tiempoEspera;
                }
            }
          }

          //--------PARA EL PACIENTE QUE ENTRA A LA AUTORIZACION
          if (colaObraSocial.length === 0) {
            obra.libre();
          } else {
            let pacienteIngresa: Paciente = colaObraSocial.shift();
            pacienteIngresa.siendoAutorizado();
            rndAutorizacion = Math.random();
            tiempoAutorizacion = this.getTiempoAutorizacion(rndAutorizacion);
            finAutorizacion = reloj + tiempoAutorizacion;
          }
          break;
        }

        case Evento.FIN_ATENCION_MED_1: {
          finAtencion1 = -1;
          //PARA EL PACIENTE QUE SE VA DE LA ATENCION
          let pacienteAtendido: Paciente = pacientesEnSistema.find(
            (paciente) =>
              paciente.getEstado() == EstadoPaciente.SIENDO_ATENDIDO1
          );

          //vemos si el enfermero esta ocupado
          if (enfermero.estaOcupado()) {
            pacienteAtendido.esperandoPago();
            colaEnfermero.push(pacienteAtendido);
          } else {
            enfermero.ocupado();
            pacienteAtendido.pagando();
            rndPago = Math.random();
            tiempoPago = this.getTiempoPago(rndPago);
            finPago = reloj + tiempoPago;
          }

          //PARA EL PACIENTE QUE SALE DE LA COLA DE ATENCION
          //hay algun urgente esperando en la cola
          if (colaMedicosUrgencia.length !== 0) {
            let pacienteIngresa: Paciente = colaMedicosUrgencia.shift();
            let tiempoEspera = reloj - pacienteIngresa.getMinutoLlegada();

            pacienteIngresa.siendoAtendido1();
            medico1.atendiendoUrgencia();
            rndAntencion = Math.random();
            tiempoAtencion = this.getTiempoAtencion(rndAntencion);
            finAtencion1 = reloj + tiempoAtencion;

            this.acuEsperaPacientesUrgentes += tiempoEspera;
            this.totalPacientesUrgente += 1;
            if (tiempoEspera > this.tiempoMaximoUrgente)
            {
              this.tiempoMaximoUrgente = tiempoEspera;
            }

          }
          //hay alguno interrumpido
          else if (tiempoRemanencia1 > -1) {
            let pacienteInterrupido1: Paciente = pacientesEnSistema.find(
              (paciente) => paciente.getEstado() == EstadoPaciente.INTERRUMPIDO1
            );
            pacienteInterrupido1.siendoAtendido1();
            medico1.atendiendoComun();
            finAtencion1 = tiempoRemanencia1 + reloj;
            tiempoRemanencia1 = -1;
          }
          //hay alguien en la cola de comunes
          else if (colaMedicosComun.length !== 0) {
            let pacienteIngresa: Paciente = colaMedicosComun.shift();
            let tiempoEspera = reloj - pacienteIngresa.getMinutoLlegada();
            
            pacienteIngresa.siendoAtendido1();
            medico1.atendiendoComun();
            rndAntencion = Math.random();
            tiempoAtencion = this.getTiempoAtencion(rndAntencion);
            finAtencion1 = reloj + tiempoAtencion;

            this.acuEsperaPacientesComunes += tiempoEspera;
            this.totalPacientesComun += 1;
            if (tiempoEspera > this.tiempoMaximoComun)
            {
              this.tiempoMaximoComun = tiempoEspera;
            }
          }
          //esta libre no hay nadie para atender
          else {
            medico1.libre();
          }

          break;
        }

        case Evento.FIN_ATENCION_MED_2: {
          finAtencion2 = -1;
          //PARA EL PACIENTE QUE SE VA DE LA ATENCION
          let pacienteAtendido: Paciente = pacientesEnSistema.find(
            (pacienteAtendido) =>
              pacienteAtendido.getEstado() == EstadoPaciente.SIENDO_ATENDIDO2
          );

          //vemos si el enfermero esta ocupado
          if (enfermero.estaOcupado()) {
            colaEnfermero.push(pacienteAtendido);
            pacienteAtendido.esperandoPago();
          } else {
            enfermero.ocupado();
            pacienteAtendido.pagando();
            rndPago = Math.random();
            tiempoPago = this.getTiempoPago(rndPago);
            finPago = reloj + tiempoPago;
          }

          //PARA EL PACIENTE QUE SALE DE LA COLA DE ATENCION
          //hay algun urgente esperando en la cola
          if (colaMedicosUrgencia.length !== 0) {
            let pacienteIngresa: Paciente = colaMedicosUrgencia.shift();
            let tiempoEspera = reloj - pacienteIngresa.getMinutoLlegada();

            pacienteIngresa.siendoAtendido2();
            medico2.atendiendoUrgencia();
            rndAntencion = Math.random();
            tiempoAtencion = this.getTiempoAtencion(rndAntencion);
            finAtencion2 = reloj + tiempoAtencion;

            this.acuEsperaPacientesUrgentes += tiempoEspera;
            this.totalPacientesUrgente += 1;
            if (tiempoEspera > this.tiempoMaximoUrgente)
            {
              this.tiempoMaximoUrgente = tiempoEspera;
            }
          }
          //hay alguno interrumpido
          else if (tiempoRemanencia2 > -1) {
            let pacienteInterrupido2: Paciente = pacientesEnSistema.find(
              (paciente) => paciente.getEstado() == EstadoPaciente.INTERRUMPIDO2
            );
            pacienteInterrupido2.siendoAtendido2();
            medico2.atendiendoComun();
            finAtencion2 = tiempoRemanencia2 + reloj;
            tiempoRemanencia2 = -1;
          }
          //hay alguien en la cola de comunes
          else if (colaMedicosComun.length !== 0) {
            let pacienteIngresa: Paciente = colaMedicosComun.shift();
            let tiempoEspera = reloj - pacienteIngresa.getMinutoLlegada();

            pacienteIngresa.siendoAtendido2();
            medico2.atendiendoComun();
            rndAntencion = Math.random();
            tiempoAtencion = this.getTiempoAtencion(rndAntencion);
            finAtencion2 = reloj + tiempoAtencion;
            this.acuEsperaPacientesComunes += tiempoEspera;
            this.totalPacientesComun+=1;
            if (tiempoEspera > this.tiempoMaximoComun)
            {
              this.tiempoMaximoComun = tiempoEspera;
            }
          }
          //esta libre no hay nadie para atender
          else {
            medico2.libre();
          }
          break;
        }

        case Evento.FIN_PAGO: {
          finPago = -1;
          //PARA EL PACIENTE QUE TERMINO SU PAGO
          let pacienteAtendido: Paciente = pacientesEnSistema.find(
            (pacienteAtendido) =>
              pacienteAtendido.getEstado() == EstadoPaciente.PAGANDO
          );
          pacienteAtendido.finalizado();

          //DINERO ACUMULADO
          if (pacienteAtendido.getTipoPaciente() == 'Comun') {
            this.dineroAcumulado += 20;
          } else {
            this.dineroAcumulado += 30;
          }

          //PARA EL QUE SALE DE LA COLA
          //no hay nadie en la cola
          if (colaEnfermero.length === 0) {
            enfermero.libre();
          }
          // hay alguien en la cola
          else {
            let pacienteIngresado: Paciente = colaEnfermero.shift();
            //esta esperando pago
            if (
              pacienteIngresado.getEstado() == EstadoPaciente.ESPERANDO_PAGO
            ) {
              pacienteIngresado.pagando();
              rndPago = Math.random();
              tiempoPago = this.getTiempoPago(rndPago);
              finPago = reloj + tiempoPago;
            }
            //esta esperando determinacion
            else {
              pacienteIngresado.siendoDeterminado();
              rndDeterminacion = Math.random();
              tiempoDeterminacion =
                this.getTiempoDeterminacion(rndDeterminacion);
              finDeterminacion = reloj + tiempoDeterminacion;
            }
          }
          //eliminamos al paciente que se fue
          let indicePaciente: number = pacientesEnSistema.findIndex(
            (paciente) => paciente.getEstado() === EstadoPaciente.FINALIZADO
          );
          pacientesEnSistema.splice(indicePaciente, 1);

          break;
        }

        // Fin de simulación.
        case Evento.FIN_SIMULACION: {
          //Calculamos el tiempo de permanencia en el sistema de los pasajeros que quedaron en el sistema.
          // for (let i: number = 0; i < pacientesEnSistema.length; i++) {
          //   acuTiempoPasajeros += reloj - pasajerosEnSistema[i].getMinutoLlegada();
          // }
          break;
        }
      }

      // Calculo de metricas
      if (obra.estaOcupado()) {
        pacienteEnObra = 1;
      } else {
        pacienteEnObra = 0;
      }
      this.cantEnSala =
        colaMedicosComun.length +
        colaMedicosUrgencia.length +
        colaObraSocial.length +
        pacienteEnObra;

      if (this.cantEnSala > this.cantidadMax) {
        this.cantidadMax = this.cantEnSala;
      }

      // Cargamos la matriz de estado a mostrar solo para el rango pasado por parámetro.
      if ((i >= eventoDesde && i <= indiceHasta) || i == cantEventos - 1) {
        evento.push(
          i.toString(),
          Evento[tipoEvento],
          reloj.toFixed(4),

          rndLlegada.toFixed(4),
          tiempoEntreLlegadas.toFixed(4),
          proximaLlegada.toFixed(4),

          rndDeterminacion.toFixed(4),
          tiempoDeterminacion.toFixed(4),
          finDeterminacion.toFixed(4),
          rndTipoPaciente.toFixed(4),
          tipoPaciente,

          rndAutorizacion.toFixed(4),
          tiempoAutorizacion.toFixed(4),
          finAutorizacion.toFixed(4),

          rndAntencion.toFixed(4),
          tiempoAtencion.toFixed(4),
          finAtencion1.toFixed(4),
          finAtencion2.toFixed(4),

          rndPago.toFixed(4),
          tiempoPago.toFixed(4),
          finPago.toFixed(4),

          enfermero.getEstado(),
          colaEnfermero.length.toString(),

          obra.getEstado(),
          colaObraSocial.length.toString(),

          medico1.getEstado2().toString(),
          medico2.getEstado2().toString(),
          colaMedicosComun.length.toString(),
          colaMedicosUrgencia.length.toString(),
          tiempoRemanencia1.toFixed(4),
          tiempoRemanencia2.toFixed(4),

          this.cantEnSala.toString(),
          this.cantidadMax.toString(),
          this.acuEsperaPacientesUrgentes.toFixed(4),
          this.totalPacientesUrgente.toString(),
          this.tiempoMaximoUrgente.toFixed(4),
          this.acuEsperaPacientesComunes.toFixed(4),
          this.totalPacientesComun.toString(),
          this.tiempoMaximoComun.toFixed(4),
          this.dineroAcumulado.toString()
        );

        for (let i: number = 0; i < pacientesEnSistema.length; i++) {
          evento.push(
            pacientesEnSistema[i].getId().toString(),
            pacientesEnSistema[i].getTipoPaciente(),
            EstadoPaciente[pacientesEnSistema[i].getEstado()]
          );
        }

        this.matrizEstado.push(evento);

        //Actualizamos la cantidad de pacientes máximos que hubo en el sistema.
        if (pacientesEnSistema.length > this.cantMaxPacientes)
          this.cantMaxPacientes = pacientesEnSistema.length;
      }

      // Reseteamos algunas variables.
      rndLlegada = -1;
      tiempoEntreLlegadas = -1;
      rndTipoPaciente = -1;
      tipoPaciente = '';
      rndDeterminacion = -1;
      tiempoDeterminacion = -1;
      rndAutorizacion = -1;
      tiempoAutorizacion = -1;
      rndAntencion = -1;
      tiempoAtencion = -1;
      rndPago = -1;
      tiempoPago = -1;
    }
  }

  //--------------------METODOS NECESARIOS PARA EL SIMULAR

  public getMatrizEstado(): string[][] {
    return this.matrizEstado;
  }

  public getCantMaxPacientesEnSistema(): number {
    return this.cantMaxPacientes;
  }

  public getDistribucionExponencial(rnd: number, media: number): number {
    if (1 - rnd !== 0) return -media * Math.log(1 - rnd);
    return -media * Math.log(1 - rnd + 9e-16);
  }

  // Cálculo del tiempo entre llegadas, que tiene distribución exponencial.
  public getTiempoEntreLlegadas(rndLlegada: number): number {
    let tiempo: number = this.getDistribucionExponencial(
      rndLlegada,
      this.mediaTiempoEntreLlegadas
    );
    return tiempo;
  }

  // Obtención del tipo de paciente según la probabilidad asociada.
  public getTipoPaciente(probTipoPaciente: number): string {
    for (let i: number = 0; i < this.probTiposPacientes.length; i++) {
      if (probTipoPaciente < this.probTiposPacientes[i])
        return this.tiposPacientes[i];
    }
  }

  // Cálculo del tiempo de determinación, que tiene distribución uniforme.
  public getTiempoDeterminacion(rndTiempoDeterminacion: number): number {
    let tiempo: number =
      this.aTiempoDeterminacion +
      rndTiempoDeterminacion *
        (this.bTiempoDeterminacion - this.aTiempoDeterminacion);
    return tiempo;
  }

  // Cálculo del tiempo de autorización, que tiene distribución uniforme.
  public getTiempoAutorizacion(rndTiempoAutorizacion: number): number {
    let tiempo: number =
      this.aTiempoAutorizacion +
      rndTiempoAutorizacion *
        (this.bTiempoAutorizacion - this.aTiempoAutorizacion);
    return tiempo;
  }

  // Cálculo del tiempo de atención, que tiene distribución  uniforme.
  public getTiempoAtencion(rndTiempoAtencion: number): number {
    let tiempo: number =
      this.aTiempoAtencion +
      rndTiempoAtencion * (this.bTiempoAtencion - this.aTiempoAtencion);
    return tiempo;
  }

  // Cálculo del tiempo de pago, que tiene distribución uniforme.
  public getTiempoPago(rndTiempoPago: number): number {
    let tiempo: number =
      this.aTiempoPago + rndTiempoPago * (this.bTiempoPago - this.aTiempoPago);
    return tiempo;
  }

  public getPromedioUrgentes():number
  {
    let promedioU : number = this.acuEsperaPacientesUrgentes / this.totalPacientesUrgente;
    return promedioU;
  }

  public getPromedioComunes():number
  {
    let promedioC : number = this.acuEsperaPacientesComunes / this.totalPacientesComun;
    return promedioC;
  }

  public getSiguienteEvento(tiemposEventos: number[]): Evento {
    let menor: number = Utils.getMenorMayorACero(tiemposEventos);
    for (let i: number = 0; i < tiemposEventos.length; i++) {
      if (tiemposEventos[i] === menor) {
        return Evento[Evento[i + 1]];
      }
    }
    return -1;
  }
}
