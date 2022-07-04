import { EstadoPaciente } from './EstadoPaciente';

export class Paciente {
  private id: number;
  private _tipoPaciente: string;
  private estado: EstadoPaciente;
  private minuto: number;

  public constructor(id: number, tipoPaciente: string, min: number) {
    this.id = id;
    this._tipoPaciente = tipoPaciente;
    this.minuto = min;

  }

  public esperandoDeterminacion(): void {
    this.estado = EstadoPaciente.ESPERANDO_DETERMINACION;
  }

  public siendoDeterminado(): void {
    this.estado = EstadoPaciente.SIENDO_DETERMINADO;
  }

  public siendoAutorizado(): void {
    this.estado = EstadoPaciente.SIENDO_AUTORIZADO;
  }

  public esperandoAtencion(): void {
    this.estado = EstadoPaciente.ESPERANDO_ATENCION;
  }

  public esperandoObra(): void {
    this.estado = EstadoPaciente.ESPERANDO_OBRA;
  }

  public siendoAtendido1(): void {
    this.estado = EstadoPaciente.SIENDO_ATENDIDO1;
  }

  public siendoAtendido2(): void {
    this.estado = EstadoPaciente.SIENDO_ATENDIDO2;
  }

  public enInterrupcion1(): void {
    this.estado = EstadoPaciente.INTERRUMPIDO1;
  }

  public enInterrupcion2(): void {
    this.estado = EstadoPaciente.INTERRUMPIDO2;
  }

  public esperandoPago() {
    this.estado = EstadoPaciente.ESPERANDO_PAGO;
  }

  public pagando(): void {
    this.estado = EstadoPaciente.PAGANDO;
  }

  public finalizado(): void {
    this.estado = EstadoPaciente.FINALIZADO;
  }

  public getEstado(): EstadoPaciente {
    return this.estado;
  }

  public getId(): number {
    return this.id;
  }

  public getTipoPaciente(): string {
    return this._tipoPaciente;
  }

  public set TipoPaciente(tipo: string) {
    this._tipoPaciente = tipo;
  }

  public set Minuto(min: number)
  {
    this.minuto = min;
  }



  // public getMinutoLlegada(): number {
  //   return this.minutoLlegada;
  // }
}
