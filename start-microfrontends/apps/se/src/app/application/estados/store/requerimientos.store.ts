import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from "@angular/core";

export interface RequerimientosState {
    /**
     * Parametro del tipo de requerimieto
     */
    idTipoRequerimiento: string;
    /**
     * Parametro justificación de evaluación
     */
    justificacion: string;
    /**
     * Parametro area solicitante
     */
    areaSolicitante: string;
    /**
     * Parametro activa pestaña
     */
    activarTabSolicitarDocumentos: boolean;


    motivo: string;
    fundamento: string;
    siglas_participante_externo: string;
    alcance_requerimiento: string;
    formaValida?: boolean;
}
export function createInitialRequerimientosStates(): RequerimientosState {
    return {
        idTipoRequerimiento: '',
        justificacion: '',
        areaSolicitante: '',
        activarTabSolicitarDocumentos: false,
        motivo: '',
        fundamento: '',
        siglas_participante_externo: '',
        alcance_requerimiento: '',
        formaValida: false,
    };
}
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'RequerimientosStates', resettable: true })
export class RequerimientosStore extends Store<RequerimientosState> {
  constructor() {
    super(createInitialRequerimientosStates());
  }
  /**
   * Devuelve el idTipoRequerimiento actual del store
   * @returns El idTipoRequerimiento actual.
   */
  getIdTipoRequerimiento(): string {
    return this.getValue().idTipoRequerimiento;
  }

  /**
   * Método para resetear valores del store a su estado inicial.
   */
  resetStore(): void {
    this.reset();
  }

  /**
   * Guarda el tipo de requerimiento seleccionado.
   * @param idTipoRequerimiento - Parámetro del tipo de requerimiento.
   */
  settipoRequerimientoValue(idTipoRequerimiento: string): void {
    this.update((state) => ({ ...state, idTipoRequerimiento }));
  }

  /**
   * Guarda la justificación de la evaluación.
   * @param justificacion - Justificación del requerimiento.
   */
  setjustificacionRequerimientoValue(justificacion: string): void {
    this.update((state) => ({ ...state, justificacion }));
  }

  /**
   * Guarda el área solicitante.
   * @param areaSolicitante - Área solicitante del requerimiento.
   */
  setareaSolicitanteValue(areaSolicitante: string): void {
    this.update((state) => ({ ...state, areaSolicitante }));
  }

  /**
   * Guarda el valor de la pestaña de solicitud de documentos.
   * @param activarTabSolicitarDocumentos - Valor booleano para activar la pestaña.
   */
  setPestaniaSolicitudDocumento(activarTabSolicitarDocumentos: boolean): void {
    this.update((state) => ({ ...state, activarTabSolicitarDocumentos }));
  }

  /**
   * Actualiza el valor del campo `motivo` en el estado de la tienda.
   * @param motivo - Nuevo valor para el motivo del requerimiento.
   */
  setMotivoValue(motivo: string): void {
    this.update((state) => ({ ...state, motivo }));
  }

  /**
   * Actualiza el valor del campo `fundamento` en el estado de la tienda.
   * @param fundamento - Nuevo valor para el fundamento del requerimiento.
   */
  setFundamentoValue(fundamento: string): void {
    this.update((state) => ({ ...state, fundamento }));
  }

  /**
   * Actualiza el valor del campo `alcance_requerimiento` en el estado de la tienda.
   * @param alcance_requerimiento - Nuevo valor para el alcance del requerimiento.
   */
  setAlcanceRequerimientoValue(alcance_requerimiento: string): void {
    this.update((state) => ({ ...state, alcance_requerimiento }));
  }
  
  /**
   * Actualiza el valor del campo `siglas_participante_externo`
   * en el estado de la tienda.
   * @param siglas_participante_externo - Nuevas siglas del dictaminador.
   */
  setSiglasDictaminadorValue(siglas_participante_externo: string): void {
    this.update((state) => ({
      ...state,
      siglas_participante_externo,
    }));
  }

  /**
   * Actualiza el valor del campo `formaValida`
   * en el estado de la tienda.
   * @param formaValida - Nuevas siglas del dictaminador.
   */
  setFormaValida(formaValida: boolean): void {
    this.update((state) => ({
      ...state,
      formaValida,
    }));
  }

  /**
   * Devuelve el idTipoRequerimiento actual del store
   * @returns El idTipoRequerimiento actual.
   */
  getFormaValida(): boolean {
    return this.getValue().formaValida ?? false;
  }
}
