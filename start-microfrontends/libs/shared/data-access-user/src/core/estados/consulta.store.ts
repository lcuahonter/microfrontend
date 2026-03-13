import { Store, StoreConfig } from '@datorama/akita';
import { ConsultaioSolicitante } from '../models/consultaio-solicitante.model';
import { Injectable } from '@angular/core';

/**
 * Estado para la información de Consultaio obtenida del inicio de sesión
 */
export interface ConsultaioState {
  procedureId: string;
  parameter: string;
  department: string;
  folioTramite: string;
  tipoDeTramite: string;
  estadoDeTramite: string;
  readonly: boolean;
  create: boolean;
  update: boolean;
  consultaioSolicitante: ConsultaioSolicitante | null;
  action_id: string;
  current_user: string;
  id_solicitud: string;
  nombre_pagina: string;
  idSolicitudSeleccionada?: string;
  solicitudEditable?: boolean;
}

/**
 * Creación del estado inicial para el Consultaio
 * @returns ConsultaioState
 */
export function createConsultaInitialState(): ConsultaioState {
  return {
    procedureId: '', // It should not be initialized with data from a single procedure, because it is a generic component used in all departments.
    parameter: '',
    department: '',
    folioTramite: '',
    tipoDeTramite: '',
    estadoDeTramite: '',
    readonly: false,
    create: true,
    update: false, //It was reset to false, and that's how it should stay. There's already logic behind setting this flag to false.
    consultaioSolicitante: null,
    action_id: '',
    current_user: '',
    id_solicitud: '', // It should not be initialized with data from a single procedure, because it is a generic component used in all departments.
    nombre_pagina: '',
    idSolicitudSeleccionada: '',
    solicitudEditable: true
  };
}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'Consultaio', resettable: true, })
export class ConsultaioStore extends Store<ConsultaioState> {
  constructor() {
    super(createConsultaInitialState());
  }

  /**
   * Guarda la información del Consultaio registrado en la sesión dentro del state
   *
   * @param logueado
   * @param token
   * @param nombre
   */
  public establecerConsultaio(procedureId: string, parameter: string,
    department: string, folioTramite: string, tipoDeTramite: string, estadoDeTramite: string, readonly: boolean, create: boolean, update: boolean,
    action_id: string='', current_user: string='', id_solicitud: string='', nombre_pagina: string='', idSolicitudSeleccionada: string = ''): void {
    this.update(state => ({
      ...state,
      procedureId,
      parameter,
      department,
      folioTramite,
      tipoDeTramite,
      estadoDeTramite,
      readonly,
      create,
      update,
      action_id,
      current_user,
      id_solicitud,
      nombre_pagina,
      idSolicitudSeleccionada
    }));
  }


  /**
  * Actualiza bandera de solicitud editable.
  * @param idSolicitud - El nuevo ID de la solicitud.
  */
  public setSolicitudEditable(editable: boolean): void {
    this.update(state => ({
      ...state,
      solicitudEditable:editable
    }));
  }

  /**
  * Actualiza el ID de la solicitud en el estado de Consultaio.
  * @param idSolicitud - El nuevo ID de la solicitud.
  */
  public setIdSolicitud(idSolicitud:string): void {
    this.update(state => ({
      ...state,
      id_solicitud:idSolicitud
    }));
  }
  /**
 * Actualiza la información del solicitante en el estado de Consultaio.
 * 
 * Este método guarda los datos del solicitante proporcionados en el estado de Consultaio.
 * Se utiliza para mantener actualizada la información del solicitante en la sesión.
 * 
 * @param {ConsultaioSolicitante} consultaioSolicitante - Objeto que contiene la información del solicitante.
 */
  public solicitanteConsultaio(consultaioSolicitante: ConsultaioSolicitante | null): void {
    this.update(state => ({
      ...state, consultaioSolicitante
    }));
  }
}