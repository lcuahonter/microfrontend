import { ArchivoDocumentos, AvisoFormulario, AvisoTabla, DatosSolicitante, DomicilioFormulario, MercanciaFormulario, TipoDocumento } from '../../tramites/32503/models/aviso-traslado.model';
import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * @interface Tramite32503State
 * @description Representa el estado de la gestión del trámite 32503.
 *
 * @property {number} pasoActivo - Indica el paso activo en el flujo del trámite.
 * @property {number} pestanaActiva - Indica la pestaña activa en la interfaz del trámite.
 * @property {DatosSolicitante} datosSolicitante - Contiene los datos del solicitante.
 * @property {MercanciaFormulario} mercanciaFormulario - Contiene los datos del formulario de mercancía.
 * @property {DomicilioFormulario} domicilioFormulario - Contiene los datos del formulario de domicilio.
 * @property {AvisoFormulario} avisoFormulario - Contiene los datos del formulario de aviso.
 * @property {TipoDocumento[]} tipoTablaDatos - Lista de tipos de documentos disponibles.
 * @property {string} tipoDocumento - Tipo de documento seleccionado.
 * @property {ArchivoDocumentos[]} documentosDesplegable - Lista de documentos disponibles en el desplegable.
 * @property {string[]} valorSeleccionado - Valores seleccionados en el formulario.
 */
export interface Tramite32503State {
  pasoActivo: number;
  pestanaActiva: number;
  datosSolicitante: DatosSolicitante;
  mercanciaFormulario: MercanciaFormulario;
  domicilioFormulario: DomicilioFormulario;
  avisoFormulario: AvisoFormulario;
  tipoTablaDatos: TipoDocumento[];
  tipoDocumento: string;
  documentosDesplegable: ArchivoDocumentos[];
  valorSeleccionado: string[];
  tablaDeDatos: AvisoTabla[]
}
/**
 * Estado inicial del trámite 32503.
 * 
 * Esta función define el estado inicial del trámite, incluyendo datos del solicitante,
 * formulario de mercancías, formulario de domicilio, formulario de aviso, y otros datos relacionados.
 * 
 * @returns {Tramite32503State} El estado inicial del trámite.
 * 
 * 
 */
export function createInitialState(): Tramite32503State {
  return {
    pasoActivo: 1,
    pestanaActiva: 1,
    datosSolicitante: {
      rfc: "",
      denominacion: "",
      actividadEconomica: "",
      correoElectronico: "",
      pais: "",
      codigoPostal: "",
      entidadFederativa: "",
      municipio: "",
      localidad: "",
      colonia: "",
      calle: "",
      nExt: "",
      nInt: "",
      lada: "",
      telefono: "",
      adace: "",
    },
    mercanciaFormulario: {
      claveFraccionArancelaria: '',
      nico: '',
      cantidad: '',
      claveUnidadMedida: '',
      valorUSD: '',
      descripcionMercancia: '',
      descripcionProceso: '',
      numPedimentoExportacion: '',
      numPedimentoImportacion: '',
    },
    domicilioFormulario: {
      nombreComercial: '',
      claveEntidadFederativa: '',
      claveDelegacionMunicipio: '',
      claveColonia: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      codigoPostal: '',
      rfc: '',
    },
    avisoFormulario: {
      adace: '',
      valorProgramaImmex: '',
      valorAnioProgramaImmex: '',
      tipoAviso: '',
      tieneIdTransaccionVucem: '',
      idTransaccion: '',
      motivoProrroga: '',
      fechaTranslado: '',
      nombreComercial: '',
      claveEntidadFederativa: '',
      claveDelegacionMunicipio: '',
      claveColonia: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      codigoPostal: '',
      tipoCarga: '',
    },
    tipoTablaDatos: [],
    tipoDocumento: '',
    documentosDesplegable: [],
    valorSeleccionado: [],
    tablaDeDatos: []
  };
}
/**
 * Store para gestionar el estado del trámite 32503.
 * 
 * Este store utiliza Akita para manejar el estado del trámite, permitiendo actualizar y consultar
 * diferentes propiedades relacionadas con el trámite.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite32503', resettable: true })
export class Tramite32503Store extends Store<Tramite32503State> {

  /**
   * Constructor del store.
   * 
   * Inicializa el store con el estado inicial definido en `createInitialState`.
   */
  constructor() {
    super(createInitialState());
  }

  /**
 * Actualiza el paso activo del trámite.
 * 
 * @param {number} pasoActivo - El número del paso activo.
 */
  public setPasoActivo(pasoActivo: number): void {
    this.update((state) => ({
      ...state,
      pasoActivo,
    }));
  }

  /**
   * Actualiza el tipo de documento seleccionado.
   * 
   * @param {string} tipoDocumento - El tipo de documento seleccionado.
   */
  public setTipoDocumento(tipoDocumento: string): void {
    this.update((state) => ({
      ...state,
      tipoDocumento,
    }));
  }

  /**
   * Actualiza la lista de documentos desplegables.
   * 
   * @param {ArchivoDocumentos[]} documentosDesplegable - Lista de documentos desplegables.
   */
  public setDocumentosDesplegable(documentosDesplegable: ArchivoDocumentos[]): void {
    this.update((state) => ({
      ...state,
      documentosDesplegable,
    }));
  }

  /**
   * Actualiza los valores seleccionados.
   * 
   * @param {string[]} valorSeleccionado - Lista de valores seleccionados.
   */
  public setValorSeleccionado(valorSeleccionado: string[]): void {
    this.update((state) => ({
      ...state,
      valorSeleccionado,
    }));
  }

  /**
   * Actualiza la pestaña activa del trámite.
   * 
   * @param {number} pestanaActiva - El número de la pestaña activa.
   */
  public setPestanaActiva(pestanaActiva: number): void {
    this.update((state) => ({
      ...state,
      pestanaActiva,
    }));
  }
  /**
   * Actualiza los datos del solicitante en el estado.
   * 
   * @param {DatosSolicitante} datosSolicitante - Objeto que contiene los datos del solicitante.
   */
  public setDatosSolicitante(datosSolicitante: DatosSolicitante): void {
    this.update((state) => ({
      ...state,
      datosSolicitante
    }));
  }

  /**
   * Actualiza la fracción arancelaria en el formulario de mercancías.
   * 
   * @param {string} claveFraccionArancelaria - La clave de la fracción arancelaria.
   */
  public setFraccionArancelaria(claveFraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      mercanciaFormulario: { ...state.mercanciaFormulario, claveFraccionArancelaria },
    }));
  }

  /**
   * Actualiza el NICO (Número de Identificación Comercial) en el formulario de mercancías.
   * 
   * @param {string} nico - El número de identificación comercial.
   */
  public setMercanciaFormularioNico(nico: string): void {
    this.update((state) => ({
      ...state,
      mercanciaFormulario: { ...state.mercanciaFormulario, nico },
    }));
  }

  /**
   * Actualiza la cantidad en el formulario de mercancías.
   * 
   * @param {string} cantidad - La cantidad de la mercancía.
   */
  public setMercanciaFormularioCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      mercanciaFormulario: { ...state.mercanciaFormulario, cantidad },
    }));
  }

  /**
   * Actualiza la unidad de medida en el formulario de mercancías.
   * 
   * @param {string} claveUnidadMedida - La clave de la unidad de medida.
   */
  public setMercanciaFormularioUnidadMedida(claveUnidadMedida: string): void {
    this.update((state) => ({
      ...state,
      mercanciaFormulario: { ...state.mercanciaFormulario, claveUnidadMedida },
    }));
  }

  /**
   * Actualiza el valor en USD de la mercancía en el formulario de mercancías.
   * 
   * @param {string} valorUSD - El valor en dólares de la mercancía.
   */
  public setMercanciaFormularioValor(valorUSD: string): void {
    this.update((state) => ({
      ...state,
      mercanciaFormulario: { ...state.mercanciaFormulario, valorUSD },
    }));
  }

  /**
   * Actualiza la descripción de la mercancía en el formulario de mercancías.
   * 
   * @param {string} descripcionMercancia - La descripción de la mercancía.
   */
  public setMercanciaFormularioDescripcionMercancia(descripcionMercancia: string): void {
    this.update((state) => ({
      ...state,
      mercanciaFormulario: { ...state.mercanciaFormulario, descripcionMercancia },
    }));
  }

  /**
   * Actualiza la descripción del proceso en el formulario de mercancías.
   * 
   * @param {string} descripcionProceso - La descripción del proceso.
   */
  public setMercanciaFormularioDescripcionProceso(descripcionProceso: string): void {
    this.update((state) => ({
      ...state,
      mercanciaFormulario: { ...state.mercanciaFormulario, descripcionProceso },
    }));
  }

  /**
   * Actualiza el número de pedimento de exportación en el formulario de mercancías.
   * 
   * @param {string} numPedimentoExportacion - El número de pedimento de exportación.
   */
  public setMercanciaFormularioPedimentoExportacion(numPedimentoExportacion: string): void {
    this.update((state) => ({
      ...state,
      mercanciaFormulario: { ...state.mercanciaFormulario, numPedimentoExportacion },
    }));
  }

  /**
   * Actualiza el número de pedimento de importación en el formulario de mercancías.
   * 
   * @param {string} numPedimentoImportacion - El número de pedimento de importación.
   */
  public setMercanciaFormularioPedimentoImportacion(numPedimentoImportacion: string): void {
    this.update((state) => ({
      ...state,
      mercanciaFormulario: { ...state.mercanciaFormulario, numPedimentoImportacion },
    }));
  }

  /**
   * Actualiza el nombre comercial en el formulario de domicilio.
   * 
   * @param {string} nombreComercial - El nombre comercial.
   */
  public setDomicilioFormularioNombreComercial(nombreComercial: string): void {
    this.update((state) => ({
      ...state,
      domicilioFormulario: { ...state.domicilioFormulario, nombreComercial },
    }));
  }

  /**
   * Actualiza la clave de la entidad federativa en el formulario de domicilio.
   * 
   * @param {string} claveEntidadFederativa - La clave de la entidad federativa.
   */
  public setDomicilioFormularioEntidadFederativa(claveEntidadFederativa: string): void {
    this.update((state) => ({
      ...state,
      domicilioFormulario: { ...state.domicilioFormulario, claveEntidadFederativa },
    }));
  }

  /**
   * Actualiza la clave de la delegación o municipio en el formulario de domicilio.
   * 
   * @param {string} claveDelegacionMunicipio - La clave de la delegación o municipio.
   */
  public setDomicilioFormularioDelegacionMunicipio(claveDelegacionMunicipio: string): void {
    this.update((state) => ({
      ...state,
      domicilioFormulario: { ...state.domicilioFormulario, claveDelegacionMunicipio },
    }));
  }
  /**
   * Actualiza la clave de la colonia en el formulario de domicilio.
   * 
   * @param {string} claveColonia - La clave de la colonia.
   */
  public setDomicilioFormularioColonia(claveColonia: string): void {
    this.update((state) => ({
      ...state,
      domicilioFormulario: { ...state.domicilioFormulario, claveColonia },
    }));
  }

  /**
   * Actualiza la calle en el formulario de domicilio.
   * 
   * @param {string} calle - El nombre de la calle.
   */
  public setDomicilioFormularioCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      domicilioFormulario: { ...state.domicilioFormulario, calle },
    }));
  }

  /**
   * Actualiza el número exterior en el formulario de domicilio.
   * 
   * @param {string} numeroExterior - El número exterior.
   */
  public setDomicilioFormularioNumeroExterior(numeroExterior: string): void {
    this.update((state) => ({
      ...state,
      domicilioFormulario: { ...state.domicilioFormulario, numeroExterior },
    }));
  }

  /**
   * Actualiza el número interior en el formulario de domicilio.
   * 
   * @param {string} numeroInterior - El número interior.
   */
  public setDomicilioFormularioNumeroInterior(numeroInterior: string): void {
    this.update((state) => ({
      ...state,
      domicilioFormulario: { ...state.domicilioFormulario, numeroInterior },
    }));
  }

  /**
   * Actualiza el código postal en el formulario de domicilio.
   * 
   * @param {string} codigoPostal - El código postal.
   */
  public setDomicilioFormularioCodigoPostal(codigoPostal: string): void {
    this.update((state) => ({
      ...state,
      domicilioFormulario: { ...state.domicilioFormulario, codigoPostal },
    }));
  }

  /**
   * Actualiza el RFC en el formulario de domicilio.
   * 
   * @param {string} rfc - El RFC.
   */
  public setDomicilioFormularioRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      domicilioFormulario: { ...state.domicilioFormulario, rfc },
    }));
  }

  /**
   * Actualiza el valor de ADACE en el formulario de aviso.
   * 
   * @param {string} adace - El valor de ADACE.
   */
  public setAvisoFormularioAdace(adace: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, adace },
    }));
  }

  /**
   * Actualiza el valor del programa IMMEX en el formulario de aviso.
   * 
   * @param {string} valorProgramaImmex - El valor del programa IMMEX.
   */
  public setAvisoFormularioValorProgramaImmex(valorProgramaImmex: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, valorProgramaImmex },
    }));
  }
  /**
   * Actualiza el valor del año del programa IMMEX en el formulario de aviso.
   * 
   * @param {string} valorAnioProgramaImmex - El valor del año del programa IMMEX.
   */
  public setAvisoFormularioValorAnioProgramaImmex(valorAnioProgramaImmex: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, valorAnioProgramaImmex },
    }));
  }

  /**
   * Actualiza el tipo de aviso en el formulario de aviso.
   * 
   * @param {string} tipoAviso - El tipo de aviso.
   */
  public setAvisoFormularioTipoAviso(tipoAviso: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, tipoAviso },
    }));
  }

  /**
   * Actualiza el tipo de aviso en el formulario de aviso.
   * 
   * @param {string} tipoAviso - El tipo de aviso.
   */
  public setAvisoFormularioTieneIdTransaccionVucem(tieneIdTransaccionVucem: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, tieneIdTransaccionVucem },
    }));
  }

  /**
   * Actualiza el ID de la transacción en el formulario de aviso.
   * 
   * @param {string} idTransaccion - El ID de la transacción.
   */
  public setAvisoFormularioTransaccion(idTransaccion: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, idTransaccion },
    }));
  }

  /**
   * Actualiza el motivo de la prórroga en el formulario de aviso.
   * 
   * @param {string} motivoProrroga - El motivo de la prórroga.
   */
  public setAvisoFormularioMotivoProrroga(motivoProrroga: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, motivoProrroga },
    }));
  }

  /**
   * Actualiza la fecha de traslado en el formulario de aviso.
   * 
   * @param {string} fechaTranslado - La fecha de traslado.
   */
  public setAvisoFormularioFechaTranslado(fechaTranslado: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, fechaTranslado },
    }));
  }

  /**
   * Actualiza el nombre comercial en el formulario de aviso.
   * 
   * @param {string} nombreComercial - El nombre comercial.
   */
  public setAvisoFormularioNombreComercial(nombreComercial: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, nombreComercial },
    }));
  }

  /**
   * Actualiza la clave de la entidad federativa en el formulario de aviso.
   * 
   * @param {string} claveEntidadFederativa - La clave de la entidad federativa.
   */
  public setAvisoFormularioEntidadFederativa(claveEntidadFederativa: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, claveEntidadFederativa },
    }));
  }

  /**
   * Actualiza la clave de la delegación o municipio en el formulario de aviso.
   * 
   * @param {string} claveDelegacionMunicipio - La clave de la delegación o municipio.
   */
  public setAvisoFormularioDelegacionMunicipio(claveDelegacionMunicipio: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, claveDelegacionMunicipio },
    }));
  }

  /**
   * Actualiza la clave de la colonia en el formulario de aviso.
   * 
   * @param {string} claveColonia - La clave de la colonia.
   */
  public setAvisoFormularioColonia(claveColonia: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, claveColonia },
    }));
  }
  /**
 * Actualiza la calle en el formulario de aviso.
 * 
 * @param {string} calle - La calle del aviso.
 */
  public setAvisoFormularioCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, calle },
    }));
  }

  /**
   * Actualiza el número exterior en el formulario de aviso.
   * 
   * @param {string} numeroExterior - El número exterior del aviso.
   */
  public setAvisoFormularioNumeroExterior(numeroExterior: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, numeroExterior },
    }));
  }

  /**
   * Actualiza el número interior en el formulario de aviso.
   * 
   * @param {string} numeroInterior - El número interior del aviso.
   */
  public setAvisoFormularioNumeroInterior(numeroInterior: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, numeroInterior },
    }));
  }

  /**
   * Actualiza el código postal en el formulario de aviso.
   * 
   * @param {string} codigoPostal - El código postal del aviso.
   */
  public setAvisoFormularioCodigoPostal(codigoPostal: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, codigoPostal },
    }));
  }

  /**
   * Actualiza el tipo de carga en el formulario de aviso.
   * 
   * @param {string} tipoCarga - El tipo de carga del aviso.
   */
  public setAvisoFormularioTipoCarga(tipoCarga: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, tipoCarga },
    }));
  }

  /**
   * Actualiza los datos de la tabla de tipos de documentos.
   * 
   * @param {TipoDocumento[]} tipoTablaDatos - Lista de tipos de documentos.
   */
  public setTipoTablaDatos(tipoTablaDatos: TipoDocumento[]): void {
    this.update((state) => ({
      ...state,
      tipoTablaDatos,
    }));
  }
  /**
 * Actualiza el formulario de aviso en el estado del trámite.
 * 
 * Este método permite establecer los datos del formulario de aviso en el estado del trámite.
 * 
 * @param {AvisoFormulario} avisoFormulario - Objeto que contiene los datos del formulario de aviso.
 */
  public setAvisoFormulario(avisoFormulario: AvisoFormulario): void {
    this.update((state) => ({
      ...state,
      avisoFormulario,
    }));
  }

  /**
   * Actualiza la tabla de datos en el estado del trámite.
   * 
   * Este método permite establecer los datos de la tabla en el estado del trámite.
   * 
   * @param {AvisoTabla[]} tablaDeDatos - Lista de datos que se mostrarán en la tabla.
   */
  public setTablaDeDatos(tablaDeDatos: AvisoTabla[]): void {
    this.update((state) => ({
      ...state,
      tablaDeDatos,
    }));
  }
}
