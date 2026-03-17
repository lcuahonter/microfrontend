import { ConfiguracionCertificados, CupoDetalle, ProductoDetalle } from '../../models/detalle';
import { Store, StoreConfig } from '@datorama/akita';
import { Cupo } from '@libs/shared/data-access-user/src/core/models/140103/cancelacion.model';
import { Injectable } from '@angular/core';
/**
 * Creacion del estado inicial para la interfaz de tramite 90201
 * @returns Solicitud90201
 */
export interface Solicitud140103State {
  idSolicitud:number,
  regimen: string;
  mecanismo: string;
  tratado: string;
  producto: string;
  subproducto: string;
  representacion: string;
  cantidad: string;
  cancelacion: Cupo[];
  certificados: ConfiguracionCertificados[];
  cupo : CupoDetalle[];
  productoDetalle : ProductoDetalle[];
  idSolicitudState: number;
}

/** Crea y devuelve el estado inicial vacío para el formulario de Solicitud 140103. */
export function createInitialState(): Solicitud140103State {
  return {
    idSolicitud: 0,
    regimen: '',
    mecanismo: '',
    tratado: '',
    producto: '',
    subproducto: '',
    representacion: '',
    cantidad: '',
    cancelacion: [],
    certificados: [],
    cupo: [],
    productoDetalle: [],
    idSolicitudState: 0,
  };
}

/** Store que gestiona el estado reactivo para el trámite 140103 usando Akita. */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite140103', resettable: true })
export class Solicitud140103Store extends Store<Solicitud140103State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado estableciendo el régimen seleccionado.
   * @param regimen Valor del régimen a asignar
   */
  public setRegimen(regimen: string): void {
    this.update((state) => ({
      ...state,
      regimen,
    }));
  }
  /**
   * Actualiza el estado con el mecanismo seleccionado.
   * @param mecanismo Valor del mecanismo a asignar
   */
  public setMecanismo(mecanismo: string): void {
    this.update((state) => ({
      ...state,
      mecanismo,
    }));
  }
  /**
   * Actualiza el estado con el tratado seleccionado.
   * @param tratado Valor del tratado a asignar
   */
  public setTratado(tratado: string): void {
    this.update((state) => ({
      ...state,
      tratado,
    }));
  }
  /**
   * Actualiza el estado con el producto seleccionado.
   * @param producto Nombre del producto a asignar
   */
  public setProducto(producto: string): void {
    this.update((state) => ({
      ...state,
      producto,
    }));
  }
  /**
   * Actualiza el estado con el subproducto seleccionado.
   * @param subproducto Nombre del subproducto a asignar
   */
  public setSubproducto(subproducto: string): void {
    this.update((state) => ({
      ...state,
      subproducto,
    }));
  }
  /**
   * Actualiza el estado con la representación seleccionada.
   * @param representacion Valor de la representación a asignar
   */
  public setRepresentacion(representacion: string): void {
    this.update((state) => ({
      ...state,
      representacion,
    }));
  }
  /**
   * Actualiza el estado con la cantidad especificada.
   * @param cantidad Valor numérico de la cantidad
   */
  public setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }
  /**
   * Actualiza el estado con los cupos de cancelación.
   * @param cancelacion Lista de cupos asociados a la cancelación
   */
  public setCancelacion(cancelacion: Cupo[]): void {
    this.update((state) => ({
      ...state,
      cancelacion,
    }));
  }
  /**
   * Actualiza el estado con los certificados configurados.
   * @param certificados Lista de elementos de configuración de certificados
   */
  public setCertificados(certificados: ConfiguracionCertificados[]): void {
    this.update((state) => ({
      ...state,
      certificados,
    }));
  }

  /**
   * Actualiza el ID de la solicitud.
   * @param idSolicitud Nuevo ID de la solicitud.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
}
