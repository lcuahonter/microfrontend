import { Store, StoreConfig } from '@datorama/akita';
import { ExpedirMonto } from '../../tramites/120201/models/cupos.model';
import { Injectable } from '@angular/core';

/**
 * Creacion del estado inicial para la interfaz de tramite 120201
 * @returns Cupos120201
 */
export interface Cupos120201State {
  idSolicitud: number | string | null;
  asignacionOficioNumeroForm: {
    cveAniosAutorizacion?: string;
    numFolioAsignacionAux?: string;
  };

  representacionFederalForm: {
    estado?: string;
    representacionFederal?: string;
    clave?: string;
  };

  controlMontosAsignacionForm: {
    sumaAprobada?: number | null;
    sumaExpedida?: number | null;
    montoDisponible?: number | null;
  };

  asignacionDatosForm: {
    idAsignacion?: number;
    idMecanismoAsignacion?: number;
    montoDisponible?: number;
    cadenaMontos?: string;
    numOficio?: string;
    fechaInicio?: string;
    fechaFinVigenciaAprobada?: string;
  };

  cupoDescripcionForm: {
    descClasificacionProducto: string | null;
    regimenAduanero?: string;
    descripcionProducto?: string;
    clasificaionSubproducto?: string;
    unidadMedidaOficialCupo?: string;
    fechaInicioVigencia?: string;
    fechaFinVigencia?: string;
    mecanismoAsignacion?: string;
    tratado?: string;
    fraccionesArancelarias?: string;
    paisesCupo?: string;
    observaciones?: string;
    descripcionFundamento?: string;
  };

  distribucionSaldoForm: {
    montoDisponibleAsignacion?: number | null;
    montoExpedir?: number | null;
    totalExpedir?: number;
  };
  cuerpoTabla?: ExpedirMonto[];
  mostrarDetalle?: boolean;
}


/**
 * Crea el estado inicial del trámite 120201.
 * @returns Estado inicial de tipo `Cupos120201State`.
 */
export function createInitialState(): Cupos120201State {
  return {
    idSolicitud: null,
    asignacionOficioNumeroForm: {
      cveAniosAutorizacion: '',
      numFolioAsignacionAux: '',
    },
    representacionFederalForm: {
      estado: '',
      representacionFederal: '',
    },
    controlMontosAsignacionForm: {
      sumaAprobada: null,
      sumaExpedida: null,
      montoDisponible: null,
    },
    asignacionDatosForm: {
      numOficio: '',
      fechaInicio: '',
      fechaFinVigenciaAprobada: '',
      idAsignacion: 0,
    },
    cupoDescripcionForm: {
      regimenAduanero: '',
      descripcionProducto: '',
      clasificaionSubproducto: '',
      unidadMedidaOficialCupo: '',
      fechaInicioVigencia: '',
      fechaFinVigencia: '',
      mecanismoAsignacion: '',
      tratado: '',
      fraccionesArancelarias: '',
      paisesCupo: '',
      observaciones: '',
      descripcionFundamento: '',
      descClasificacionProducto: null
    },
    distribucionSaldoForm: {
      montoDisponibleAsignacion: null,
      montoExpedir: null,
      totalExpedir: 0,
    },
    cuerpoTabla: [],
    mostrarDetalle: false
  };
}

/**
 * Servicio de estado global para gestionar el trámite 130118 con Akita.
 */
@Injectable({
  providedIn: 'root',
})

/**
 * Configuración de la tienda Akita para el trámite 120201 con opción de reinicio.
 */
@StoreConfig({ name: 'tramite120201', resettable: true })
export class Tramite120201Store extends Store<Cupos120201State> {
  /**
   * Constructor que inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
* Guarda el ID de la solicitud en el estado.
*
* @param idSolicitud - El ID de la solicitud que se va a guardar.
*/
  public setIdSolicitud(idSolicitud: number | string): void {    
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /** Método para actualizar el estado del formulario de número de oficio de asignación.
   * @param campo - El campo específico del formulario a actualizar.
   * @param valor - El nuevo valor para el campo especificado.
   */
  public setAsignacionOficioNumeroForm(campo: string, valor: unknown): void {
    this.update(state => ({
      ...state,
      asignacionOficioNumeroForm: {
        ...state.asignacionOficioNumeroForm,
        [campo]: valor
      }
    }));
  }

  /** Método para actualizar el campo `numFolioAsignacionAux` en el formulario de número de oficio de asignación.
   * @param numFolioAsignacionAux - El nuevo valor para `numFolioAsignacionAux`.
   */
  public setNumFolioAsignacionAux(numFolioAsignacionAux: string): void {
    this.update((state) => ({
      ...state,
      asignacionOficioNumeroForm: {
        ...state.asignacionOficioNumeroForm,
        numFolioAsignacionAux,
      },
    }));
  }

  /** Método para actualizar el estado del formulario de representación federal.
   * @param campo - El campo específico del formulario a actualizar.
   * @param valor - El nuevo valor para el campo especificado.
   */
  public setRepresentacionFederalForm(campo: string, valor: unknown): void {
    this.update(state => ({
      ...state,
      representacionFederalForm: {
        ...state.representacionFederalForm,
        [campo]: valor
      }
    }));
  }

  /** Método para actualizar el estado del formulario de control de montos de asignación.
   * @param campo - El campo específico del formulario a actualizar.
   * @param valor - El nuevo valor para el campo especificado.
   */
  public setControlMontosAsignacionForm(campo: string, valor: unknown): void {
    this.update((state) => ({
      ...state,
      controlMontosAsignacionForm: {
        ...state.controlMontosAsignacionForm,
        [campo]: valor,
      },
    }));
  }

  /** Método para actualizar el estado del formulario de datos de asignación.
   * @param campo - El campo específico del formulario a actualizar.
   * @param valor - El nuevo valor para el campo especificado.
   */
  public setAsignacionDatosForm(campo: string, valor: unknown): void {
    this.update((state) => ({
      ...state,
      asignacionDatosForm: {
        ...state.asignacionDatosForm,
        [campo]: valor,
      },
    }));
  }

  /** Método para actualizar el estado del formulario de descripción del cupo.
   * @param campo - El campo específico del formulario a actualizar.
   * @param valor - El nuevo valor para el campo especificado.
   */
  public setCupoDescripcionForm(campo: string, valor: unknown): void {
    this.update((state) => ({
      ...state,
      cupoDescripcionForm: {
        ...state.cupoDescripcionForm,
        [campo]: valor,
      },
    }));
  }

  /** Método para actualizar el estado del formulario de distribución de saldo.
   * @param campo - El campo específico del formulario a actualizar.
   * @param valor - El nuevo valor para el campo especificado.
   */
  public setDistribucionSaldoForm(campo: string, valor: unknown): void {
    this.update((state) => ({
      ...state,
      distribucionSaldoForm: {
        ...state.distribucionSaldoForm,
        [campo]: valor,
      },
    }));
  }


  /**
    * Establece el Año del oficio de autorización.
    * @param cveAniosAutorizacion - Clave del año de autorización.
    */
  public setAniosAutorizacion(cveAniosAutorizacion: string): void {
    this.update((state) => ({
      ...state,
      cveAniosAutorizacion,
    }));
  }


  /**
   * Establece el estado de la solicitud.
   * @param estado - Estado de la solicitud.
   */
  public setEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * Establece la representación federal.
   * @param representacionFederal - Representación federal.
   */
  public setRepresentacionFederal(representacionFederal: string): void {
    this.update((state) => ({
      ...state,
      representacionFederal,
    }));
  }

  /**
   * Establece la suma aprobada.
   * @param sumaAprobada - Monto total aprobado.
   */
  public setSumaAprobada(sumaAprobada: number | null): void {
    this.update((state) => ({
      ...state,
      sumaAprobada,
    }));
  }

  /**
   * Establece la suma expedida.
   * @param sumaExpedida - Monto total expedido.
   */
  public setSumaExpedida(sumaExpedida: number | null): void {
    this.update((state) => ({
      ...state,
      sumaExpedida,
    }));
  }

  /**
   * Establece el monto disponible.
   * @param montoDisponible - Monto disponible.
   */
  public setMontoDisponible(montoDisponible: number | null): void {
    this.update((state) => ({
      ...state,
      montoDisponible,
    }));
  }

  /**
   * Establece el ID de la asignación.
   * @param idAsignacion - ID de la asignación.
   */
  public setIdAsignacion(idAsignacion: number): void {
    this.update((state) => ({
      ...state,
      idAsignacion,
    }));
  }

  /**
   * Establece el número de oficio.
   * @param numOficio - Número de oficio.
   */
  public setNumOficio(numOficio: string): void {
    this.update((state) => ({
      ...state,
      numOficio,
    }));
  }

  /**
   * Establece la fecha de inicio.
   * @param fechaInicio - Fecha de inicio.
   */
  public setFechaInicio(fechaInicio: string): void {
    this.update((state) => ({
      ...state,
      fechaInicio,
    }));
  }

  /**
   * Establece la fecha de fin de vigencia aprobada.
   * @param fechaFinVigenciaAprobada - Fecha de fin de vigencia aprobada.
   */
  public setFechaFinVigenciaAprobada(fechaFinVigenciaAprobada: string): void {
    this.update((state) => ({
      ...state,
      fechaFinVigenciaAprobada,
    }));
  }

  /**
   * Establece el régimen aduanero.
   * @param regimenAduanero - Régimen aduanero.
   * */
  public setRegimenAduanero(regimenAduanero: string): void {
    this.update((state) => ({
      ...state,
      regimenAduanero,
    }));
  }

  /**
   * Establece la descripción del producto.
   * @param descripcionProducto - Descripción del producto.
   */
  public setDescripcionProducto(descripcionProducto: string): void {
    this.update((state) => ({
      ...state,
      descripcionProducto,
    }));
  }

  /**
   * Establece la clasificación del subproducto.
   * @param clasificaionSubproducto - Clasificación del subproducto.
   */
  public setClasificaionSubproducto(clasificaionSubproducto: string): void {
    this.update((state) => ({
      ...state,
      clasificaionSubproducto,
    }));
  }

  /**
   * Establece la unidad de medida oficial del cupo.
   * @param unidadMedidaOficialCupo - Unidad de medida oficial del cupo.
   */
  public setUnidadMedidaOficialCupo(unidadMedidaOficialCupo: string): void {
    this.update((state) => ({
      ...state,
      unidadMedidaOficialCupo,
    }));
  }

  /**
   * Establece la fecha de inicio de vigencia.
   * @param fechaInicioVigencia - Fecha de inicio de vigencia.
   */
  public setFechaInicioVigencia(fechaInicioVigencia: string): void {
    this.update((state) => ({
      ...state,
      fechaInicioVigencia,
    }));
  }

  /**
   * Establece la fecha de fin de vigencia.
   * @param fechaFinVigencia - Fecha de fin de vigencia.
   */
  public setFechaFinVigencia(fechaFinVigencia: string): void {
    this.update((state) => ({
      ...state,
      fechaFinVigencia,
    }));
  }

  /**
   * Establece el mecanismo de asignación.
   * @param mecanismoAsignacion - Mecanismo de asignación.
   */
  public setMecanismoAsignacion(mecanismoAsignacion: string): void {
    this.update((state) => ({
      ...state,
      mecanismoAsignacion,
    }));
  }

  /**
   * Establece el tratado.
   * @param tratado - Tratado.
   */
  public setTratado(tratado: string): void {
    this.update((state) => ({
      ...state,
      tratado,
    }));
  }

  /**
   * Establece las fracciones arancelarias.
   * @param fraccionesArancelarias - Fracciones arancelarias.
   */
  public setFraccionesArancelarias(fraccionesArancelarias: string): void {
    this.update((state) => ({
      ...state,
      fraccionesArancelarias,
    }));
  }

  /**
   * Establece los países del cupo.
   * @param paisesCupo - Países del cupo.
   */
  public setPaisesCupo(paisesCupo: string): void {
    this.update((state) => ({
      ...state,
      paisesCupo,
    }));
  }

  /**
   * Establece las observaciones.
   * @param observaciones - Observaciones.
   */
  public setObservaciones(observaciones: string): void {
    this.update((state) => ({
      ...state,
      observaciones,
    }));
  }

  /**
   * Establece la descripción del fundamento.
   * @param descripcionFundamento - Descripción del fundamento.
   */
  public setDescripcionFundamento(descripcionFundamento: string): void {
    this.update((state) => ({
      ...state,
      descripcionFundamento,
    }));
  }

  /**
   * Establece el monto disponible de asignación.
   * @param montoDisponibleAsignacion - Monto disponible de asignación.
   */
  public setMontoDisponibleAsignacion(montoDisponibleAsignacion: number | null): void {
    this.update((state) => ({
      ...state,
      montoDisponibleAsignacion,
    }));
  }

  /**
   * Establece el monto a expedir.
   * @param montoExpedir - Monto a expedir.
   */
  public setMontoExpedir(montoExpedir: number | null): void {
    this.update((state) => ({
      ...state,
      montoExpedir,
    }));
  }

  /**
   * Establece el total de monto a expedir.
   * @param totalExpedir - Total de monto a expedir.
   */
  public setTotalExpedir(totalExpedir: number): void {
    this.update((state) => ({
      ...state,
      totalExpedir,
    }));
  }

  /**
   * Establece el cuerpo de la tabla.
   * @param cuerpoTabla - Cuerpo de la tabla.
   */
  public setCuerpoTabla(cuerpoTabla: ExpedirMonto[]): void {
    this.update((state) => ({
      ...state,
      cuerpoTabla,
    }));
  }

  /**
   * Este método actualiza el estado de la propiedad `mostrarDetalle` en el store.
   * @param mostrarDetalle - Indica si se debe mostrar el detalle o no.
   */
  public setMostrarDetalle(mostrarDetalle: boolean): void {
    this.update((state) => ({
      ...state,
      mostrarDetalle,
    }));
  }

  /**
   * Actualiza el estado de la consulta de persona física.
   * @param nuevoDatos - Nuevo estado de la consulta de persona física.
   */
  public setConsultaPersonaFisicaState(nuevoDatos: Cupos120201State): void {
    this.update(nuevoDatos);
  }
}