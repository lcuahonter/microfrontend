/**
 * @fileoverview
 * Este archivo define el store de estado para el trámite 110102 usando Akita.
 * Proporciona la interfaz de estado, el estado inicial y el store con métodos para actualizar el estado.
 */
import { CriterioConfiguracionResponse } from '../../models/response/tratado-configuracion-response.model';
import { DeclaracionDatosResponse } from '../../models/response/declaracion-datos-response.model';

import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que representa el estado del trámite 110102.
 * @interface
 */
export interface Tramite110102State {
  /** Clave de registro del productor */
  cveRegistroProductor: string | null;
  /** Clave de la unidad administrativa */
  claveUnidadAdministrativa: string | null;
  /** Clave de la entidad federativa de la solicitud */
  claveEntidadFederativa: string | null;
  /** Indica si se protesta decir verdad */
  protestoDecirVerdad: boolean;
  /** Indica si se solicita separación contable */
  solicitaSeparacionContable: boolean;
  /** Indica si se solicita exportador autorizado */
  solicitaExportadorAutorizado: boolean;
  /** Condición del exportador */
  condicionExportador: string | null;
  /** Indica si se solicita exportador autorizado para Japón */
  solicitaExportadorAutorizadoJPN: boolean;
  /** Condición del exportador para Japón */
  condicionExportadorJPN: string | null;
  /** Datos de configuracion tratados */
  respuestaServiceConfiguracion: CriterioConfiguracionResponse;
  /** Indica si es exportador autorizado para Japón */
  exportadorAutorizadoJPN: boolean;
  /** Información adicional para los radios de Japón */
  informacionRadiosJPN: string | null;
  /** Método de separación contable seleccionado por el solicitante. */
  metodoSeparacion: boolean;
  /** Opción de exportador autorizado seleccionada por el solicitante. */
  exportadorAutorizado: boolean;
  /** Información seleccionada en los radios del formulario por el solicitante. */
  informacionRadios: string | null;
  /** Id solicitud de peticion de guardado */
  id_solcitud: number | null;
  /** Un array de objetos que contiene los datos de declaración de la solicitud */
  declaracion_solicitud: DeclaracionDatosResponse[];
}

/**
 * Función que retorna el estado inicial del trámite 110102.
 * @returns {Tramite110102State} Estado inicial
 */
export function createInitialState(): Tramite110102State {
  return {
    cveRegistroProductor: null,
    claveEntidadFederativa: null,
    claveUnidadAdministrativa: null,
    protestoDecirVerdad: false,
    solicitaSeparacionContable: false,
    solicitaExportadorAutorizado: false,
    condicionExportador: null,
    solicitaExportadorAutorizadoJPN: false,
    condicionExportadorJPN: null,
     respuestaServiceConfiguracion: {
      mostrar_datos_mercancia: false,
      mostrar_insumos: false,
      mostrar_empaques: false,
      mostrar_otras_instancias: false,
      mostrar_otras_instancias_alianza_p: false,
      mostrar_tipo_metodo_alianza_p: false,
      mostrar_juegos_y_surtidos_alianza_p: false,
      mostrar_acumulacion_alianza_p: false,
      mostrar_juegos_y_surtidos: false,
      mostrar_tipo_metodo: false,
      mostrar_nombre_ingles: false,
      mostrar_precio_franco_fabrica: false,
      mostrar_clasificacion_aladi: false,
      mostrar_valor_transaccional_fob: false,
      mostrar_exportador_autorizado: false,
      mostrar_procesos_mercancia_par4: false,
      mostrar_pais_insumo: false,
      mostrar_exportador_autorizado_jpn: false,
      mostrar_tipo_metodo_panama: false,
      mostrar_tipo_metodo_no_obligatorio_panama: false,
      mostrar_tipo_metodo_panama_uruguay: false,
      mostrar_encabezado_uruguay: false,
      mostrar_costo_neto_fob: false,
      mostrar_otras_instancias_peru: false,
      mostrar_otras_instancias_uruguay: false,
      mostrar_naladi: false,
      mostrar_naladisa_93: false,
      mostrar_naladisa_96: false,
      mostrar_naladisa_02: false
    },
    exportadorAutorizadoJPN: false,
    informacionRadiosJPN: null,
    metodoSeparacion: false,
    exportadorAutorizado: false,
    informacionRadios: null,
    id_solcitud: null,
    declaracion_solicitud:[],
  };
}

/**
 * Store de Akita para el trámite 110102.
 * Permite gestionar y actualizar el estado de la información del trámite.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite110102', resettable: true })
export class Tramite110102Store extends Store<Tramite110102State> {
  /**
   * Constructor que inicializa el store con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado del store con los datos proporcionados.
   * @param {Partial<Tramite110102State>} datos - Datos parciales para actualizar el estado.
   */
  public establecerDatos(datos: Partial<Tramite110102State>): void {
    this.update((state) => ({
      ...state,
      ...datos,
    }));
  }

  /**
   * Limpia la configuracion de tratados.
   */
  public clearRespuestaServicioDatosConfiguracion(): void {
    this.update((state) => ({
      ...state,
      respuestaServiceConfiguracion: {} as CriterioConfiguracionResponse,
    }));
  }

  /**
   * Actualiza el estado con la respuesta de la configuracion.
   * @param datosConfiguracion - El array de criterios de tratado.
   */
  public setRespuestaServicioDatosConfiguracion(datosConfiguracion: CriterioConfiguracionResponse): void {
    this.update((state) => ({
      ...state,
      respuestaServiceConfiguracion: datosConfiguracion,
    }));
  }

  /**
   * Actualiza la información adicional para los radios de Japón.
   * @param informacionRadiosJPN - Información adicional para los radios de Japón.
   */
  public setExportadorAutorizadoJPN(exportadorAutorizadoJPN: boolean): void {
    this.update((state) => ({
      ...state,
      exportadorAutorizadoJPN,
    }));
  }

  /**
   * Actualiza el estado de exportador autorizado para Japón.
   * @param exportadorAutorizadoJPN - Indica si es exportador autorizado para Japón.
   */
  public setInformacionRadiosJPN(informacionRadiosJPN: string | null): void {
    this.update((state) => ({
      ...state,
      informacionRadiosJPN,
    }));
  }

  /**
   * Actualiza el estado con el valor de método de separación especificado.
   * @param metodoSeparacion - El valor booleano a establecer en el estado.
   */
  public setMetodoSeparacion(metodoSeparacion: boolean): void {
    this.update((state) => ({
      ...state,
      metodoSeparacion,
    }));
  }

  /**
   * Actualiza el estado con el valor de exportador autorizado especificado.
   * @param exportadorAutorizado - El valor booleano a establecer en el estado para la opción de exportador autorizado.
   */
  public setExportadorAutorizado(exportadorAutorizado: boolean): void {
    this.update((state) => ({
      ...state,
      exportadorAutorizado,
    }));
  }

  /**
   * Actualiza el estado con el valor seleccionado en los radios del formulario.
   * @param informacionRadios - El valor seleccionado a establecer en el estado para la información de los radios.
   */
  public setInformacionRadios(informacionRadios: string | null): void {
    this.update((state) => ({
      ...state,
      informacionRadios,
    }));
  }

    /**
     * Agrega una delcaracion `DeclaracionDatosResponse`.
     * @param declaraciones - El objeto `DeclaracionDatosResponse` a insertar en el array.
    */
    public addDeclaraciones(declaraciones: DeclaracionDatosResponse[]): void {
      this.update((state) => ({
        ...state,
        declaracion_solicitud: declaraciones,
      }));
    }
    
  /**
   * Limpia la lista de declaraciones.
   */
  public clearDeclaraciones(): void {
    this.update((state) => ({
      ...state,
      declaracion_solicitud: [],
    }));
  }

  /**
   * Actualiza el di de guardado.
   * @param id_solcitud - El id de peticion guardado.
   */
  public setId_solicitud(id_solcitud: number):void {
    this.update((state) => ({
      ...state,
      id_solcitud,
    }));
  }

  /**
   * Actualiza un valor arbitrario del estado de forma dinámica.
   * @param campo - El nombre del campo en el estado.
   * @param valor - El nuevo valor a asignar.
   */
  public setValor<T extends keyof Tramite110102State>(
    campo: T,
    valor: Tramite110102State[T]
  ): void {
    this.update((state) => ({
      ...state,
      [campo]: valor,
    }));
  }

   /**
   * Restablece el estado a sus valores iniciales, preservando únicamente
   * la información de la declaración de solicitud.
   */
  public resetExceptDeclaracion(): void {
  const DECLARACIONES = this.getValue().declaracion_solicitud;

  this.reset();

  this.update({
    declaracion_solicitud: DECLARACIONES, 
  });
}
}