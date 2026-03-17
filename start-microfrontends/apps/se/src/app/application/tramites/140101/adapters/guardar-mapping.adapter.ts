/**
 * @fileoverview
 * Este archivo contiene el servicio adaptador para convertir entre el estado de Akita y los formatos de payload de API
 * para el trámite de ampliación de servicios 80205.
 */

import { Programa140101State, Tramite140101Store } from '../../../estados/tramites/tramite140101.store';
import { Injectable } from '@angular/core';

/**
 * Interfaz que representa los detalles del solicitante
 */
interface Solicitante {
  rfc: string;
  certificado_serial_number: string;
  cve_rol_capturista: string;
}

/**
 * Interfaz que representa la estructura del payload de API para el trámite 140101
 */
export interface CargaUtilDeRespuesta {
  tipo_de_solicitud: string;
  id_solcitud: number;
  id_programa_seleccionado: string;
  solicitante: Solicitante;
  confirmar: boolean;
  observaciones: string;
  programaSeleccionado?: ProgramaSeleccionado;
}
export interface ProgramaSeleccionado {
 idProgramaAutorizado: string;
  folioPrograma: string;
  tipoPrograma: string;
  movimientoProgramaSE: null | string;
  rfc: null | string;
  resolucion: string;
  unidadAdministrativa: string;
  fechaInicioVigencia: string;
  fechaFinVigencia: string;
  actividadProductiva: null | string;
  fechaSuspension: null | string;
  modalidad: string;
  representacionFederal: string;
  estatus: string;
  contadorGrid: null | number;
  idProgramaCompuesto: null | string;
}

@Injectable({
  providedIn: 'root'
})
export class GuardarMappingAdapter {
  /**
   * Convierte del estado de Akita al formato de payload de API usando las mismas claves
   * @param state El estado actual de Akita
   * @returns Payload formateado para la API
   */
  static toFormPayload(state: Programa140101State): CargaUtilDeRespuesta {
   
    // Construir el solicitante con datos de ejemplo o del estado
    const SOLICITANTE: Solicitante = {
      rfc: 'AAL0409235E6',
      certificado_serial_number: '3082054030820428a00302010',
      cve_rol_capturista: "PersonaMoral"
    };


    return {

      tipo_de_solicitud: "guardar",
      id_solcitud: state.idSolicitud ?? 0,
      solicitante: SOLICITANTE,
      id_programa_seleccionado: state.programaACancelar?.idProgramaAutorizado,
      confirmar: state.confirmar,
      observaciones: state.solicitudObservaciones || "",
    };
  }

  /**
 * Convierte del formato de payload de API al estado de Akita
 * @param payload El payload recibido de la API
 * @returns Estado formateado para Akita
 */
static fromApiPayload(payload: CargaUtilDeRespuesta,state: Programa140101State): Programa140101State {
  const PROGRAMA_SELECCIONADO: ProgramaSeleccionado = payload.programaSeleccionado || {} as ProgramaSeleccionado;

  return {
    idSolicitud: payload.id_solcitud ?? 0,
    solicitudObservaciones: payload.observaciones,
    confirmar: payload.confirmar,
    programaACancelar: {
      idProgramaAutorizado: PROGRAMA_SELECCIONADO.idProgramaAutorizado || '',
      idProgramaSeleccionado: '', 
      folioPrograma: PROGRAMA_SELECCIONADO.folioPrograma || '',
      tipoPrograma: PROGRAMA_SELECCIONADO.tipoPrograma || '',
      movimientoProgramaSE: PROGRAMA_SELECCIONADO.movimientoProgramaSE || null,
      rfc: PROGRAMA_SELECCIONADO.rfc || payload.solicitante.rfc || '',
      resolucion: PROGRAMA_SELECCIONADO.resolucion || null,
      unidadAdministrativa: PROGRAMA_SELECCIONADO.unidadAdministrativa || null,
      fechaInicioVigencia: PROGRAMA_SELECCIONADO.fechaInicioVigencia || null,
      fechaFinVigencia: PROGRAMA_SELECCIONADO.fechaFinVigencia || null,
      actividadProductiva: PROGRAMA_SELECCIONADO.actividadProductiva || null,
      fechaSuspension: PROGRAMA_SELECCIONADO.fechaSuspension || null,
      modalidad: PROGRAMA_SELECCIONADO.modalidad || '',
      representacionFederal: PROGRAMA_SELECCIONADO.representacionFederal || '',
      estatus: PROGRAMA_SELECCIONADO.estatus || '',
      contadorGrid: PROGRAMA_SELECCIONADO.contadorGrid || null,
      idProgramaCompuesto: PROGRAMA_SELECCIONADO.idProgramaCompuesto || null,
    },
    radio: state.radio, 
    datos: [], 
  };
}

/**
 * Actualiza el store con los datos del payload de la API.
 * Si no se proporciona un store, simplemente devuelve el estado parcial.
 *
 * @param response El payload recibido de la API
 * @param store Opcional: instancia del store de Programa140101State
 * @returns Partial<Programa140101State>
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
static patchToStore(response: any, store: Tramite140101Store): Partial<Programa140101State> {
  const PARTIAL = GuardarMappingAdapter.fromApiPayload(response, store.getValue());
  if (store) {
    // Akita's update accepts un objeto parcial o una función de actualización
    store.update((state: Programa140101State) => ({ ...state, ...PARTIAL }));
  }
  return PARTIAL;
}
}