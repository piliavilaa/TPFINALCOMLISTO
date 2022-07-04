import { EstadoObra } from './EstadoObra';

export class Obra {
  private estado: EstadoObra;

  constructor() {
    this.estado = EstadoObra.LIBRE;
  }

  public libre(): void {
    this.estado = EstadoObra.LIBRE;
  }

  public ocupado(): void {
    this.estado = EstadoObra.OCUPADO;
  }

  public estaLibre(): boolean {
    return this.estado == EstadoObra.LIBRE;
  }

  public estaOcupado(): boolean {
    return this.estado == EstadoObra.OCUPADO;
  }

  public getEstado(): string {
    return EstadoObra[this.estado];
  }
}