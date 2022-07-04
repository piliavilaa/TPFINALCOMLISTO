import { EstadoMedico } from './EstadoMedico';

export class Medico {
  private estado: EstadoMedico;

  constructor() {
    this.estado = EstadoMedico.LIBRE;
  }

  public libre(): void {
    this.estado = EstadoMedico.LIBRE;
  }

  public atendiendoUrgencia(): void {
    this.estado = EstadoMedico.ATENDIENDO_URGENCIA;
  }

  public atendiendoComun(): void {
    this.estado = EstadoMedico.ATENDIENDO_COMUN;
  }

  public estaLibre(): boolean {
    return this.estado == EstadoMedico.LIBRE;
  }

  public estaAtendiendoUrgencia(): boolean {
    return this.estado == EstadoMedico.ATENDIENDO_URGENCIA;
  }

  public estaAtendiendoComun(): boolean {
    return this.estado == EstadoMedico.ATENDIENDO_COMUN;
  }

  public getEstado(): EstadoMedico {
    return this.estado;
  }

  public getEstado2(): string {
    return EstadoMedico[this.estado];
  }

}
