import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { ProgramaACancelar} from '../../shared/models/programa-cancelar.model';

/**
 * Interfaz que representa la estructura de un programa.
 */
export interface Programa {
  folioPrograma: string; 
  idProgramaSeleccionado?: string; 
  modalidad: string; 
  representacionFederal: string; 
  tipoPrograma: string; 
  estatus: string;
  idProgramaAutorizado: string;
  movimientoProgramaSE: string | null;
  rfc: string | null;
  resolucion: string | null;
  unidadAdministrativa: string | null;
  fechaInicioVigencia: string | null;
  fechaFinVigencia: string | null;
  actividadProductiva: string | null;
  fechaSuspension: string | null;
  contadorGrid: number | null;
  idProgramaCompuesto: string | null;
}

/**
 * Creación del estado inicial para la interfaz de trámite 140101
 * @returns Programa140101State
 */
/**
 * Interfaz que define el estado del programa 140101
 */
export interface Programa140101State {

  idSolicitud:number,
  /**
   * Observaciones de la solicitud
   */
  solicitudObservaciones: string;

  /**
   * Estado de confirmación
   */
  confirmar: boolean;

  /**
   * Información del programa a cancelar
   */
  programaACancelar: ProgramaACancelar;

  /**
   * Selección de radio
   */
  radio: number; 

  /**
   * Datos adicionales
   */
  datos: Programa[];
  
}

/**
 * Función para crear el estado inicial del store
 * @returns Estado inicial de Programa140101State
 */
export function createInitialState(): Programa140101State {
  return {
    idSolicitud:0,
    solicitudObservaciones: '', // Valor inicial vacío para las observaciones
    confirmar: false, // Valor inicial para confirmar en falso
    radio: -1, // Valor inicial para la selección de radio
    datos: [], // Array vacío para datos adicionales
    programaACancelar: {
      idProgramaSeleccionado: '', // ID del programa seleccionado
      idProgramaAutorizado: "",
      folioPrograma: "",
      tipoPrograma: "",
      movimientoProgramaSE: null,
      rfc: null,
      resolucion: null,
      unidadAdministrativa: null,
      fechaInicioVigencia: null,
      fechaFinVigencia: null,
      actividadProductiva: null,
      fechaSuspension: null,
      modalidad: "",
      representacionFederal: "",
      estatus: "",
      contadorGrid: null,
      idProgramaCompuesto: null
    }
  };
}

/**
 * Servicio que representa el store para el trámite 140101.
 * Proporciona métodos para actualizar y gestionar el estado del programa.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite140101', resettable: true })
export class Tramite140101Store extends Store<Programa140101State> {

  /**
   * Constructor de la clase Tramite140101Store.
   * Inicializa el store con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado de las observaciones de la solicitud.
   * @param estado Nuevo valor para solicitudObservaciones.
   */
  public setSolicitudObservaciones(estado: string):void {
    this.update((state) => ({
      ...state, 
      solicitudObservaciones: estado,
    }));
  }

  /**
   * Actualiza el estado de confirmación.
   * @param estado Nuevo valor para confirmar.
   */
  public setConfirmar(estado: boolean):void {
    this.update((state) => ({
      ...state,
      confirmar: estado,
    }));
  }

  /**
   * Actualiza el estado del programa a cancelar.
   * @param estado Nuevo valor para programaACancelar.
   */
  public setPrograma(estado: ProgramaACancelar):void {
    this.update((state) => ({
      ...state,
      programaACancelar: estado,
    }));
  }

  /**
   * Actualiza la selección de radio.
   * @param estado Nuevo valor para radio.
   */
  public setRadioSelection(estado: number):void {
    this.update((state) => ({
      ...state,
      radio: estado,
    }));
  }

  /**
   * Actualiza los datos adicionales.
   * @param estado Nuevo array de datos.
   */
  public setDatosData(estado: Programa[]):void {
    this.update((state) => ({
      ...state,
      datos: estado,
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
