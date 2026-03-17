import { CriterioConfiguracionResponse } from '../../models/response/tratado-configuracion-response.model';
import { CriterioTratadoResponse } from '../../models/response/tratado-criterio-response.model';
import { DeclaracionDatosResponse } from '../../models/response/declaracion-datos-response.model';

import { FraccionValidarResponse, ProcesoSolicitado } from '../../models/response/validar-fraccion-response.model';

import { DatosMercanciaModalTabla, EnvasesTabla, InsumosTabla } from '../../models/panallas110101.model';
import { Mercancia, TratadoAgregado } from '../../models/response/validar-solicitud-response.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';


/**
 * **Estado del formulario de solicitante**
 *
 * Representa la estructura del estado para los datos del solicitante en el trámite 110101.
 */
export interface Solicitante110101State {
  /** RFC del solicitante. */
  rfc: string;
  /** denominacion del solicitante. */
  denominacion: string;
  /** Actividad económica del solicitante. */
  actividadEconomica: string;

  /** Un array de tratado agregado */
  tratados_servicio_evaluar: TratadoAgregado[];
  /** Correo electrónico del solicitante. */
  correoElectronico: string;
  /** País del solicitante. */
  pais: string;
  /** Denominación o razón social del solicitante. */
  tratado: string;
  /** Actividad económica principal del solicitante. */
  origen: string;
  /** Criterio Instancia de uruguay. */
  criterio: string;
  /** nombreComercial del solicitante. */
  nombreComercial: string | null;
  /** Nombre en inglés del solicitante. */
  nombreIngles: string | null;
  /** Fracción arancelaria del producto o servicio. */
  fraccionArancelaria: string | null;
  /** Descripción del producto o servicio. */
  descripcion: string;
  /** Clasificación NALADI (Normas Arancelarias de América Latina) actual. */
  clasificacionNaladi: string | null;
  /** Clasificación NALADI según normativa de 1993. */
  clasificacionNaladi1993: string | null;
  /** Clasificación NALADI según normativa de 1996. */
  clasificacionNaladi1996: string | null;
  /** Clasificación NALADI según normativa de 2002. */
  clasificacionNaladi2002: string | null;
  /** Valor de la transacción en moneda local. */
  valorTransaccion: number | null;
  /** Valor de unidad de medida */
  unidadMedidaPeso: string | null;
 /** Valor de la franco fabrica */
  francofabrica: number | null;
  /** Valor de de costo neto en dolares */
  costoNetoDolares: number | null;
  /** Entidad a la que pertenece el solicitante. */
  entidad: string;
  /** Representación legal o administrativa del solicitante. */
  representacion: string | null;
    /** Método de separación contable seleccionado por el solicitante. */
  metodoSeparacion: boolean;
    /** Opción de exportador autorizado seleccionada por el solicitante. */
  exportadorAutorizado: boolean;
    /** Información seleccionada en los radios del formulario por el solicitante. */
  informacionRadios: string | null;
  
  /** Bandera que indica si aplica acumulación para Uruguay. */
  acumulacion_uruguay: boolean;
  /** Bandera que indica si aplica materiales fungibles para Uruguay. */
  materiales_fungibles_uruguay: boolean;
  /** Bandera que indica si aplica materiales intermedios para Uruguay. */
  materiales_intermedios_uruguay: boolean;
  /** Criterio de origen específico seleccionado para Uruguay. */
  criterio_origen_uruguay: string | null;

  /** Bandera que indica si aplica acumulación para Perú. */
  acumulacion_peru: boolean;
  /** Bandera que indica si aplica materiales fungibles para Perú. */
  materiales_fungibles_peru: boolean;
  /** Bandera que indica si aplica materiales intermedios para Perú. */
  materiales_intermedios_peru: boolean;
  /** Criterio de origen específico seleccionado para Perú. */
  criterio_origen_peru: string | null;

  /** Bandera que indica si aplica acumulación para otros países. */
  acumulacion_instancias: boolean;
  /** Bandera que indica si aplica materiales fungibles para otros países. */
  materiales_fungibles_instancias: boolean;
  /** Bandera que indica si aplica materiales intermedios para otros países. */
  materiales_intermedios_instancias: boolean;

  /** Bandera que indica si aplica acumulación alianza del pacifico */
  acumulacion_ap: boolean;
  /** Bandera que indica juegos y surtidos alianza del pacifico  */
  materiales_fungibles_ap: boolean;
  /** Bandera que indica si aplica materiales intermedios para alianza del pacifico. */
  materiales_intermedios_ap: boolean;

  /** Datos de la tabla de respuesta del servicio */
  respuestaServicioDatosTabla: CriterioTratadoResponse[];

  /** Datos de configuracion tratados */
  respuestaServiceConfiguracion: CriterioConfiguracionResponse;

  /** Datos de servicio de fraccion arancelaria */
  validacionFraccionArancelaria: FraccionValidarResponse;

  /** Un array de objetos que representa los insumos registrados */
  insumosTablaDatos: InsumosTabla[];

  /** Un array de objetos que contiene los criterios de tratados asociados a los insumos */
  insumoCriteriosDatos: DatosMercanciaModalTabla[];

  /** Un array de objetos que contiene los criterios de tratados asociados a los empaques */
  empaqueCriteriosDatos: DatosMercanciaModalTabla[];

  /** Un array de objetos que representa los empaques registrados */
  envasesTablaDatos: EnvasesTabla[];

  /** Un array de objetos que contiene los criterios de tratados asociados a los envases */
  envasesCriteriosDatos: DatosMercanciaModalTabla[];

  /** Un array de objetos que contiene los datos de declaración de la solicitud */
  declaracion_solicitud: DeclaracionDatosResponse[];

  /** Valor para check protesto */
  protesto_verdad: boolean;

  /** Valor habilitar tab Procesos */
  tab_procesos: boolean;

  /** Id solicitud de peticion de guardado */
  id_solcitud: number | null;

  /** Un array de procesos seleccionados */
  proceso_seleccionado : ProcesoSolicitado[];

  /** Descripcion juegos y surtidos */
  juegos_surtidos_tab_procesos: string | null;
  /** Valor seleccionado para el método de procesamiento */
  valorMetodoRadioUruguayPanama: string | null;
  /** Valor seleccionado para el método de procesamiento */
  valorMetodoRadioPanama: string | null;
  /** Valor seleccionado para el método de procesamiento P */
  valorMetodoRadioP: string | null;
  /** Indica si es exportador autorizado para Japón */
  exportadorAutorizadoJPN: boolean;
  /** Información adicional para los radios de Japón */
  informacionRadiosJPN: string | null;
  /** Tipo de transformación aplicable al artículo 53 */
  transformacion53: string | null;
  /** Indica si aplica para juegos y surtidos en México y Perú */
  juegosSurtidosBooleanMexicoPeru: boolean | null;
  /** Indica si aplica para juegos y surtidos en México y Panamá */
  juegosSurtidosBooleanMexicoPanama: boolean | null;
  /** Indica si aplica para juegos o surtidos en Alianza del Pac */
  juegosSurtidosBooleanAlianzaPacifico: boolean | null;
  /** VAlor fob dolares mercancia */
  valorFobDolares: number | null;
  /** Indica banderas de validacion de formularios de cada tab */
  validacion_formularios: {
    validacion_tab_tratados_otras_inmstancias: boolean | null;
    validacion_tab_mercancia: boolean | null;
    validacion_tab_datos_adicionales: boolean | null;
  };
  /** Descripción AELC */
  descripcionAELC: number | null;
  /** Descripción UE */
  descripcionUE: number | null;
  /** Descripción ACE */
  descripcionACE: number | null;
  /** Descripción SGP */
  descripcionSGP : number | null;
  /** Mercancia de servicio eveluar*/
  descripcion_evaluar: Mercancia | null;
  /** Indica si la descripción alterna fue modificada */
  descripcion_alterna_modificada: boolean | null;
  /** Respuesta de descripción alterna modificada */
  descripcion_alterna_modificada_response: boolean | null;
  /** Respuesta de acumulacion servicio validar fraccion en alianza*/
  cumple_acumulacion : boolean | null;
}


/**
 * **Función para crear el estado inicial del solicitante**
 *
 * Esta función devuelve un estado inicial vacío para los datos del solicitante en el trámite 110101.
 * Se utiliza para inicializar el store con valores predeterminados.
 *
 * @returns {Solicitante110101State} Estado inicial del solicitante con valores vacíos.
 */
export function createSolicitanteInitialState(): Solicitante110101State {
  return {
    rfc: '',
    denominacion: '',
    actividadEconomica: '',
    correoElectronico: '',
    pais: '',
    tratado: '',
    origen: '',
    criterio: '',
    nombreComercial: null,
    nombreIngles: null,
    fraccionArancelaria: null,
    francofabrica:null,
    costoNetoDolares:null,
    descripcion: '',
    clasificacionNaladi: null,
    clasificacionNaladi1993:null,
    clasificacionNaladi1996:null,
    clasificacionNaladi2002:null,
    valorTransaccion: null,
    unidadMedidaPeso: null,
    entidad: '',
    representacion: '',
    metodoSeparacion: false,
    exportadorAutorizado: false,
    informacionRadios: null,
    tratados_servicio_evaluar: [],
    acumulacion_uruguay: false,
    materiales_fungibles_uruguay: false,
    materiales_intermedios_uruguay:false,
    criterio_origen_uruguay: null,

    acumulacion_peru: false,
    materiales_fungibles_peru: false,
    materiales_intermedios_peru: false,
    criterio_origen_peru: null,

    acumulacion_instancias: false,
    materiales_fungibles_instancias: false,
    materiales_intermedios_instancias: false,

    acumulacion_ap: false,
    materiales_fungibles_ap: false,
    materiales_intermedios_ap:false,

    valorMetodoRadioUruguayPanama: null,
    valorMetodoRadioPanama: null,
    valorMetodoRadioP: null,
    exportadorAutorizadoJPN: false,
    informacionRadiosJPN: null,
    transformacion53: null,
    juegosSurtidosBooleanMexicoPeru: null,
    juegosSurtidosBooleanMexicoPanama: null,
    juegosSurtidosBooleanAlianzaPacifico: null,
    respuestaServicioDatosTabla: [],
    validacion_formularios: {
      validacion_tab_tratados_otras_inmstancias: null,
      validacion_tab_mercancia: null,
      validacion_tab_datos_adicionales: null
    },
    descripcionAELC: null,
    descripcionUE: null,
    descripcionACE: null,
    valorFobDolares: null,
    descripcionSGP:  null,
    descripcion_evaluar: null,
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
    validacionFraccionArancelaria:{
      descripcion: '',
      peso_requerido: null,
      volumen_requerido: null,
      mercancia:{
        peso_es_requerido: null,
        volumen_es_requerido: null,
        proceso_es_requerido: false,
        peso_textil_es_requerido: false,
        descripcion_alterna_modificada: null,
        procesos_solicitados: []
      },
      has_errors: false,
      error_message: null,
      cumple_acumulacion: false
    },
    insumosTablaDatos: [],
    insumoCriteriosDatos: [],
    empaqueCriteriosDatos:[],
    envasesTablaDatos: [],
    envasesCriteriosDatos: [],
    declaracion_solicitud:[],
    protesto_verdad: false,
    tab_procesos: false,
    id_solcitud: null,
    proceso_seleccionado: [],
    juegos_surtidos_tab_procesos: null,
    descripcion_alterna_modificada: null,
    descripcion_alterna_modificada_response: null,
    cumple_acumulacion: null
  };
}


/**
 * Store para gestionar el estado de los datos del solicitante.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'solicitante', resettable: true })
export class Tramite110101Store extends Store<Solicitante110101State> {
   /**
   * **Constructor de la tienda**
   *
   * - Inicializa el estado de la tienda con los valores predeterminados definidos en `createSolicitanteInitialState()`.
   * - Garantiza que la tienda comience con una estructura de datos válida para el solicitante.
   *
   * @constructor
   */
   constructor() {
    super(createSolicitanteInitialState());
  }

  /**
   * Actualiza el estado con el RFC especificado.
   * @param rfc - El RFC a establecer en el estado.
   */
  public setRfc(rfc: string):void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }

  /**
   * Actualiza el estado con la denominación especificada.
   * @param denominacion - La denominación a establecer en el estado.
   */
  public setDenominacion(denominacion: string):void {
    this.update((state) => ({
      ...state,
      denominacion,
    }));
  }

  /**
   * Actualiza el estado con la actividad económica especificada.
   * @param actividadEconomica - La actividad económica a establecer en el estado.
   */

  public setActividadEconomica(actividadEconomica: string):void {
    this.update((state) => ({
      ...state,
      actividadEconomica,
    })); 
  }

  /**
   * Actualiza el estado con el correo electrónico especificado.
   * @param correoElectronico - El correo electrónico a establecer en el estado.
   */ 
  public setCorreoElectronico(correoElectronico: string):void {
    this.update((state) => ({
      ...state,
      correoElectronico,
    }));
  }

  /**
   * Actualiza el estado con el país especificado.
   * @param pais - El país a establecer en el estado.
   */
  public setPais(pais: string):void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }

  /**
   * Actualiza el estado del criterio instacia.
   * @param criterio - El país a establecer en el estado.
   */
  public setCriterioInstancia(criterio: string):void {
    this.update((state) => ({
      ...state,
      criterio,
    }));
  }


  /**
   * Actualiza el estado con el país especificado.
   * @param tratado - El país a establecer en el estado.
   */
  public setTratado(tratado: string):void {
    this.update((state) => ({
      ...state,
      tratado,
    }));
  }

  /**
   * Actualiza el estado con el país especificado.
   * @param origen - El país a establecer en el estado.
   */
  public setOrigen(origen: string):void {
    this.update((state) => ({
      ...state,
      origen,
    }));
  }

  /**
   * Actualiza el estado con el país especificado.
   * @param nombreComercial - El país a establecer en el estado.
   */
  public setNombreComercial(nombreComercial: string | null):void {
    this.update((state) => ({
      ...state,
      nombreComercial,
    }));
  }

  /**
 * Actualiza el valor del método de procesamiento seleccionado.
 * @param valorMetodoRadioUruguayPanama - Valor seleccionado para el método de procesamiento.
 */
  public setValorMetodoRadio(valorMetodoRadioUruguayPanama: string | null):void {
    this.update((state) => ({
      ...state,
      valorMetodoRadioUruguayPanama,
    }));
  }

/**
 * Actualiza el valor del método radio Panamá seleccionado.
 * @param valorMetodoRadioPanama - Valor seleccionado para el método radio Panamá.
 */
  public setValorMetodoRadioPanama(valorMetodoRadioPanama: string | null):void {
    this.update((state) => ({
      ...state,
      valorMetodoRadioPanama,
    }));
  }

/**
 * Actualiza el valor del método radio P seleccionado.
 * @param valorMetodoRadioP - Valor seleccionado para el método radio P.
 */
  public setValorMetodoRadioP(valorMetodoRadioP: string | null):void {
    this.update((state) => ({
      ...state,
      valorMetodoRadioP,
    }));
  }
  

  /**
 * Actualiza el valor del tipo de costo seleccionado.
 * @param valorCostoRadio - Valor seleccionado para el tipo de costo.
 */
  public setValorCostoRadio(valorCostoRadio: string | null):void {
    this.update((state) => ({
      ...state,
      valorCostoRadio,
    }));
  }


  /**
   * Actualiza el estado con el país especificado.
   * @param nombreIngles - El país a establecer en el estado.
   */
  public setNombreIngles(nombreIngles: string | null):void {
    this.update((state) => ({
      ...state,
      nombreIngles,
    }));
  }

  /**
   * Actualiza el estado con el país especificado.
   * @param fraccionArancelaria - El país a establecer en el estado.
   */
  public setFraccionArancelaria(fraccionArancelaria: string | null):void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * Actualiza el estado con el costo neto en dolares
   * @param costoNetoDolares - El precio en dolares.
   */
  public setCostoNetoDolares(costoNetoDolares: number | null):void {
    this.update((state) => ({
      ...state,
      costoNetoDolares,
    }));
  }

  /**
   * Actualiza el estado con el franco fabrica
   * @param francofabrica - El precio en dolares.
   */
  public setFrancofabrica(francofabrica: number | null):void {
    this.update((state) => ({
      ...state,
      francofabrica,
    }));
  }

  /**
   * Actualiza el estado con el país especificado.
   * @param descripcion - El país a establecer en el estado.
   */
  public setDescripcion(descripcion: string):void {
    this.update((state) => ({
      ...state,
      descripcion,
    }));
  }

  /**
   * Actualiza el estado con la clasificación NALADI actual.
   * @param clasificacionNaladi - La clasificación NALADI a establecer en el estado.
   */
  public setClasificacionNaladi(clasificacionNaladi: string | null):void {
    this.update((state) => ({
      ...state,
      clasificacionNaladi,
    }));
  }

  /**
   * Actualiza el estado con la clasificación NALADI 1993.
   * @param clasificacionNaladi1993 - La clasificación NALADI 1993 a establecer en el estado.
   */
  public setClasificacionNaladi1993(clasificacionNaladi1993: string | null):void {
    this.update((state) => ({
      ...state,
      clasificacionNaladi1993,
    }));
  }

  /**
   * Actualiza el estado con la clasificación NALADI 1996.
   * @param clasificacionNaladi1996 - La clasificación NALADI 1996 a establecer en el estado.
   */
  public setClasificacionNaladi1996(clasificacionNaladi1996: string | null):void {
    this.update((state) => ({
      ...state,
      clasificacionNaladi1996,
    }));
  }

  /**
   * Actualiza el estado con la clasificación NALADI 2002.
   * @param clasificacionNaladi2002 - La clasificación NALADI 2002 a establecer en el estado.
   */
  public setClasificacionNaladi2002(clasificacionNaladi2002: string | null):void {
    this.update((state) => ({
      ...state,
      clasificacionNaladi2002,
    }));
  }

  /**
   * Actualiza el estado con el país especificado.
   * @param valorTransaccion - El país a establecer en el estado.
   */
  public setValorTransaccion(valorTransaccion: number | null):void {
    this.update((state) => ({
      ...state,
      valorTransaccion,
    }));
  }

  /**
   * Actualiza el estado con el país especificado.
   * @param unidadMedidaPeso - El país a establecer en el estado.
   */
  public setUnidadMedidaPeso(unidadMedidaPeso: string | null):void {
    this.update((state) => ({
      ...state,
      unidadMedidaPeso,
    }));
  }

  /**
   * Actualiza el estado con el país especificado.
   * @param entidad - El país a establecer en el estado.
   */
  public setEntidad(entidad: string):void {
    this.update((state) => ({
      ...state,
      entidad,
    }));
  }

  /**
   * Actualiza el estado con el país especificado.
   * @param representacion - El país a establecer en el estado.
   */
  public setRepresentacion(representacion: string | null):void {
    this.update((state) => ({
      ...state,
      representacion,
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
 * Actualiza la información de descripcion alterna.
 * @param descripcion_alterna_modificada_response - Información del response de validación.
 */
  public setDescripcionAlternaModificadaResponse(descripcion_alterna_modificada_response: boolean | null): void {
    this.update((state) => ({
      ...state,
      descripcion_alterna_modificada_response,
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
   * Actualiza el estado con la respuesta de la tabla.
   * @param datosTabla - El array de criterios de tratado.
   */
  public setRespuestaServicioDatosTabla(datosTabla: CriterioTratadoResponse[]): void {
    this.update((state) => ({
      ...state,
      respuestaServicioDatosTabla: datosTabla,
    }));
  }

  /**
   * Limpia la tabla de criterios.
   */
  public clearRespuestaServicioDatosTabla(): void {
    this.update((state) => ({
      ...state,
      respuestaServicioDatosTabla: [],
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
   * Limpia la configuracion de tratados.
   */
  public clearRespuestaServicioDatosConfiguracion(): void {
    this.update((state) => ({
      ...state,
      respuestaServiceConfiguracion: {} as CriterioConfiguracionResponse,
    }));
  }

  /**
   * Actualiza el estado con la respuesta de validar fraccion arancelaria.
   * @param datos- El array de fraccion.
   */
  public setRespuestaServicioValidarFraccion(datos: FraccionValidarResponse): void {
    this.update((state) => ({
      ...state,
      validacionFraccionArancelaria: datos,
    }));
  }

   /**
   * Limpia la fraccion
   */
  public clearRespuestaServicioValidarFraccionArancelaria(): void {
    this.update((state) => ({
      ...state,
      validacionFraccionArancelaria: {} as FraccionValidarResponse,
    }));
  }

  /**
   * Agrega un nuevo insumo al estado `insumosTablaDatos`.
   * @param insumo - El objeto `InsumosTabla` a insertar en el array.
  */
  public addInsumo(insumo: InsumosTabla[]): void {
    this.update((state) => ({
      ...state,
      insumosTablaDatos: insumo,
    }));
  }

  /**
   * Agregar un nuevo servicio de tratados evaluar al estado 'TratadoAgregado'
   * @param tratado_servicio 
   */
  public addTratadosServicioEvaluar(tratado_servicio: TratadoAgregado[]): void {
    this.update((state) => ({
      ...state,
      tratados_servicio_evaluar: tratado_servicio,
    }));
  }

  /**
   * Agregar respuesta de descripciones 'Mercancia'
   * @param descripcion_evaluar 
   */
  public addDescripcionServicioEvaluar(descripcion_evaluar: Mercancia): void {
    this.update((state) => ({
      ...state,
      descripcion_evaluar: descripcion_evaluar,
    }));
  }

  /**
   * Limpia la lista de insumos, dejando el array vacío.
   */
  public clearInsumos(): void {
    this.update((state) => ({
      ...state,
      insumosTablaDatos: [],
    }));
  }

  /**
   * Agrega un nuevo insumo al estado `DatosMercanciaModalTabla`.
   * @param insumo - El objeto `DatosMercanciaModalTabla` a insertar en el array.
  */
  public addInsumoCriterios(insumoCriterios: DatosMercanciaModalTabla[]): void {
    this.update((state) => ({
      ...state,
      insumoCriteriosDatos: insumoCriterios,
    }));
  }

  /**
   * Limpia la lista de insumos, dejando el array vacío.
   */
  public clearInsumosCriterios(): void {
    this.update((state) => ({
      ...state,
      insumoCriteriosDatos: [],
    }));
  }

  /**
   * Agrega un nuevo insumo al estado `ProcesoSolicitado`.
   * @param insumo - El objeto `ProcesoSolicitado` a insertar en el array.
  */
  public addProcesoSolicitado(proceso: ProcesoSolicitado[]): void {
    this.update((state) => ({
      ...state,
      proceso_seleccionado: proceso,
    }));
  }

  /**
   * Limpia la lista de procesos solicitados, dejando el array vacío.
   */
  public clearProcesoSolicitado(): void {
    this.update((state) => ({
      ...state,
      proceso_seleccionado: [],
    }));
  }

  /**
   * Agrega un nuevo empaque al estado `envasesTablaDatos`.
   * @param empaque - El objeto `EnvasesTabla` a insertar en el array.
   */
  public addEmpaque(empaque: EnvasesTabla[]): void {
    this.update((state) => ({
      ...state,
      envasesTablaDatos: empaque,
    }));
  }

  /**
   * Limpia la lista de empaques, dejando el array vacío.
   */
  public clearEmpaques(): void {
    this.update((state) => ({
      ...state,
      envasesTablaDatos: [],
    }));
  }

  /**
   * Agrega un nuevo insumo al estado `DatosMercanciaModalTabla`.
   * @param empaque - El objeto `DatosMercanciaModalTabla` a insertar en el array.
  */
  public addEmpaqueCriterios(empaqueCriterios: DatosMercanciaModalTabla[]): void {
    this.update((state) => ({
      ...state,
      empaqueCriteriosDatos: empaqueCriterios,
    }));
  }

  /**
   * Limpia la lista de empaques criterios, dejando el array vacío.
   */
  public clearEmpaquesCriterios(): void {
    this.update((state) => ({
      ...state,
      empaqueCriteriosDatos: [],
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
   * Actualiza el campo protesto decir verdad.
   * @param protesto_verdad - El valor booleano a establecer true o false.
   */
  public setProtesto(protesto_verdad: boolean): void {
    this.update((state) => ({
      ...state,
      protesto_verdad,
    }));
  }

   /**
   * Actualiza el la vista de Proceso.
   * @param tab_procesos - El valor booleano a establecer true o false.
   */
  public setTabProceso(tab_procesos: boolean ): void {
    this.update((state) => ({
      ...state,
      tab_procesos,
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
  public setValor<T extends keyof Solicitante110101State>(
    campo: T,
    valor: Solicitante110101State[T]
  ): void {
    this.update((state) => ({
      ...state,
      [campo]: valor,
    }));
  }

  /**
   * Actualiza un campo dentro del objeto validacion_formularios.
   * 
   * @param campo - Nombre del campo dentro de validacion_formularios.
   * @param valor - Valor booleano o null a establecer.
   */
  public setValidacionFormulario(
    campo: keyof Solicitante110101State['validacion_formularios'],
    valor: boolean | null
  ): void {
    this.update((state) => ({
      ...state,
      validacion_formularios: {
        ...state.validacion_formularios,
        [campo]: valor,
      },
    }));
  }

  /**
   * Actualiza el estado con el Valor Fob en dolares.
   * @param valorFobDolares - El valor Fob en dolares.
   */
  public setvalorFobDolares(valorFobDolares: number | null):void {
    this.update((state) => ({
      ...state,
      valorFobDolares,
    }));
  }
}
