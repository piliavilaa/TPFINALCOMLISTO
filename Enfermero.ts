import { EstadoEnfermero } from './EstadoEnfermero';

export class Enfermero {
  private estado: EstadoEnfermero;

  constructor() {
    this.estado = EstadoEnfermero.LIBRE;
  }

  public libre(): void {
    this.estado = EstadoEnfermero.LIBRE;
  }

  public ocupado(): void {
    this.estado = EstadoEnfermero.OCUPADO;
  }

  public estaLibre(): boolean {
    return this.estado == EstadoEnfermero.LIBRE;
  }

  public estaOcupado(): boolean {
    return this.estado == EstadoEnfermero.OCUPADO;
  }

  public getEstado(): string {
    return EstadoEnfermero[this.estado];
  }
}
