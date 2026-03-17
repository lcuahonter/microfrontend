/**
 * Importación de modelos relacionados con el aviso de modificación.
 * Estos modelos se utilizan para estructurar los datos dentro del sistema.
 */
import { FormularioGrupo, ModificacionGoceInmueble, PersonaFusionEscisionDTO, ProveedorExtranjero } from '../models/avisomodify.model';
import { Store, StoreConfig } from '@datorama/akita';
import { EscisionHeaderItem } from '../enums/fusion-oescision.enum';
import { FraccionGridItem } from '../constantes/importador-exportador.enum';
import { Injectable } from '@angular/core';
import { ModificacionSociosItem } from '../enums/modificacion-socios.enum';
import { MostrarGridNuevoHeader } from '../enums/modificacion-goceInmueble.enum';

/**
 * Definición de la interfaz `Catalogo`.
 * Representa un objeto con un identificador único y una descripción asociada.
 */
export interface Catalogo {
  /**
   * Identificador único del catálogo.
   */
  id: number;

  /**
   * Descripción del elemento dentro del catálogo.
   */
  descripcion: string;
}


// Estado inicial del formulario
export const INITIAL_STATE: FormularioGrupo = {
  /** Opciones del tipo de aviso a declarar */
  tipoDevAviso: {
    /** Modalidad de la certificación seleccionada */
    modalidadCertificacion: '',
    /** Indica si se incluyen proveedores o clientes extranjeros */
    foreignClientsSuppliers: false,
    /** Indica si se incluyen proveedores nacionales */
    nationalSuppliers: false,
    /** Indica si se realizaron modificaciones a los socios o accionistas */
    modificationsMembers: false,
    /** Indica si hay cambios en los documentos legales de la empresa */
    changesToLegalDocuments: false,
    /** Indica si se trata de un aviso por fusión o escisión */
    mergerOrSplitNotice: false,
    /** Indica si se agregan fracciones a la submaquila */
    additionFractions: false,
    /** Aceptación del artículo 253 del Reglamento */
    acepto253: false,
  },

  /** Datos relacionados con el proveedor extranjero */
  proveedorExtranjero: {
    /** Archivo adjunto que contiene información del proveedor extranjero */
    archivoExtranjero: null,
    /** Registro o registros del proveedor extranjero */
    registrosProveedoresExtranjeros: '',
    isActive: false, // Indica si el componente de modificación de socios está activo
  },

  /** Información para modificación de socios o accionistas */
  modificacionSocios: {
    /** Carácter con el que actúa el socio */
    ensucarácterde: 1,
    /** Indica si el socio está obligado a tributar en México */
    obligadoaTributarenMéxico: true,
    /** Nacionalidad del socio */
    nacionalidad: 1,
    /** Registro Federal de Contribuyentes completo del socio */
    registroFederaldeContribuyentes: null,
    /** RFC del socio */
    rfc: '',
    /** Nombre completo del socio */
    nombreCompleto: '',
    isActive: false // Indica si el componente de modificación de socios está activo
  },

  /** Información sobre el inmueble en uso o goce */
  modificacionGoceInmueble: {
    /** ID del aviso relacionado al inmueble */
    idAviInmueble: '',
    /** Dirección del inmueble */
    direccion: '',
    /** Código postal del inmueble */
    codigoPostal: '',
    /** Clave de la entidad federativa */
    cveEntidad: '',
    /** Clave del municipio o alcaldía */
    cveMunicipio: '',
    /** Clave del tipo de documento que ampara el uso del inmueble */
    cveTipoDoc: '',
    /** Fecha de inicio anterior del contrato o documento */
    fechaInicioAnterior: '',
    /** Fecha de fin anterior del contrato o documento */
    fechaFinAnterior: '',
    /** Fecha de inicio actual del contrato o documento */
    fechaInicioActual: '',
    /** Fecha de fin actual del contrato o documento */
    fechaFinActual: '',
    /** RFC de las partes contratantes */
    rfcPartesC: '',
    /** RFC de las partes contratantes (consolidado) */
    rfcPartesCons: '',
    /** Nombre de las partes contratantes */
    nombrePartesCons: '',
    /** Carácter de las partes contratantes */
    caracterDeCons: '',
    /** Observaciones adicionales sobre el inmueble */
    observaciones: ''
  },

  /** Datos de la empresa relacionada a la fusión o escisión */
  personaFusionEscisionDTO: {
    /** RFC de la empresa en fusión o escisión */
    registroFederalDeContribuyentes: '',
    /** Denominación o razón social de la empresa */
    denominacionORazonSocial: '',
    /** Folio VUCEM del trámite */
    folioVucemUltimaCertificacion: '',
    /** Fecha de inicio de vigencia del trámite */
    fechaInicioVigenciaUltimaCertificacion: '',
    /** Fecha de fin de vigencia del trámite */
    fechaFinVigenciaUltimaCertificacion: ''
  },

  /** Fechas seleccionadas para efectos del trámite */
  fechasSeleccionadas: {
    /** Arreglo con las fechas seleccionadas */
    fechasSeleccionadas: []
  },

  /** Datos generales de la empresa */
  datosEmpresa: {
    /** Número del programa IMMEX o similar */
    numeroPrograma: '',
    /** Año del programa correspondiente */
    anoPrograma: '',
    /** Mes al que corresponde el aviso */
    mesCorrespondeAviso: '',
    /** Año al que corresponde el aviso */
    anoCorrespondeAviso: '',
  },

  /** Tipo de carga del aviso */
  cargaTipo: {
    /** Tipo de carga seleccionado (p.ej. manual, archivo, etc.) */
    cargaTipo: '',
  },

  /** Datos de la persona o entidad que recibe */
  datosQuienRecibe: {
    /** RFC de quien recibe el trámite o transferencia */
    rfc: '',
    /** Número de programa de quien recibe */
    numberProgramaQr: '',
    /** Año del programa de quien recibe */
    anoProgramaQr: '',
  },

  /** Domicilio del lugar relacionado con el trámite */
  datosDomicilioLugar: {
    /** Nombre comercial del establecimiento o local */
    nombreComercial: '',
    /** Entidad federativa donde se ubica */
    entidadFederativa: '',
    /** Municipio o alcaldía correspondiente */
    alcaldiaMunicipio: '',
    /** Colonia donde se ubica el domicilio */
    colonias: '',
    /** Calle del domicilio */
    calle: '',
    /** Número exterior del domicilio */
    numeroExterior: '',
    /** Número interior del domicilio (si aplica) */
    numeroInterior: '',
    /** Código postal del domicilio */
    codigoPostal: '',
  },

  /** Datos de mercancía para submaquila o submanufactura */
  datosMercanciaSubmanufactura: {
    /** Fracción arancelaria de la mercancía */
    fracArancelaria: '',
    /** NICO (Número de Identificación Comercial) */
    nico: '',
    /** Unidad de medida de la mercancía */
    unidadMedida: '',
    /** Cantidad de mercancía */
    cantidad: '',
    /** Valor en dólares estadounidenses (USD) */
    valorUsd: '',
    /** Descripción general de la mercancía */
    descripcionMercancia: '',
  },

  /** Encabezados de la tabla de fusión o escisión */
  fusionEscisionHeader: [],

  fusion:[],
  /** Encabezados de la tabla de fracciones */
  gridFraccionesHeader: [],

  /** Encabezados de la tabla de modificación de socios */
  modificacionSociosHeader: [],
  /** Encabezados de la tabla de modificación de goce de inmueble */
  mostrarGridNuevoHeaderData: [],
  /** Indica si el componente de modificación de socios está activo */
  formulario: {},
  /** Indica si el componente de modificación de goce de inmueble está activo */
  modificacionGoceForm: {},
  tipoTramiteDeclaraciones: [],
  proveedoresExtranjeros: [],
  proveedoresNacionales: [],
  capacidadAlmacenamiento: 0,
  numeroTotalCarros: 0,
  cantidadBienes: 0,
  fechaInspeccion: '',
  descripcionClobGenerica2: '',
  idSolicitud: ''
};

/**
* Store del trámite 32301.
* Este store gestiona el estado del formulario relacionado con el trámite 32301.
* Utiliza Akita para manejar el estado de manera reactiva.
* 
* @export
* @class Tramite32301Store
* @extends {Store<FormularioGrupo>}
*/
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite-32301', resettable: true })
export class Tramite32301Store extends Store<FormularioGrupo> {
  constructor() {
    super(INITIAL_STATE);
  }

  /**
   * Establece la modalidad de certificación en el estado.
   * 
   * @param {string} EV - La modalidad de certificación a establecer.
   */
  setModalidadCertificacion(modalidadCertificacion: string): void {
    this.update((state) => ({
      ...state,
      tipoDevAviso: { ...state.tipoDevAviso, modalidadCertificacion }
    }));
  }

  setProveedoresExtranjeros(proveedoresExtranjeros: []): void {
    this.update((state) => ({
      ...state,
      proveedoresExtranjeros: proveedoresExtranjeros
    }));
  }

  getProveedoresExtranjeros(): [] {
    return this.getValue().proveedoresExtranjeros;
  }
  getIdSolicitud(): string {
    return this.getValue().idSolicitud;
  }
  setIdSolicitud(idSolicitud: string): void {
    this.update((state) => ({
      ...state,
      idSolicitud
    }));
  }

  setProveedoresNacionalesRes(proveedoresNacionales: []): void {
    this.update((state) => ({
      ...state,
      proveedoresNacionales: proveedoresNacionales
    }));
  }
  getProveedoresNacionalesRes(): [] {
    return this.getValue().proveedoresNacionales;
  }
  setFechaInspeccion(fechaInspeccion: string): void {
    this.update((state) => ({
      ...state,
      fechaInspeccion
    }));
  }
  getFechaInspeccion(): string {
    const INPDATE = this.getValue().fechaInspeccion;   // e.g. "20/12/2025"
    const [DAY, MONTH, YEAR] = INPDATE.split('/');

    const NOW = new Date();

    // Pad numbers so Date() never becomes invalid
    const hh = String(NOW.getUTCHours()).padStart(2, '0');
    const mm = String(NOW.getUTCMinutes()).padStart(2, '0');
    const ss = String(NOW.getUTCSeconds()).padStart(2, '0');
    const ms = String(NOW.getUTCMilliseconds()).padStart(3, '0');

    const ISODATE = new Date(
      `${YEAR}-${MONTH.padStart(2, '0')}-${DAY.padStart(2, '0')}T${hh}:${mm}:${ss}.${ms}Z`
    ).toISOString();

    return ISODATE;
  }
  setDescripcionClobGenerica2(descripcionClobGenerica2: string): void {
    this.update((state) => ({
      ...state,
      descripcionClobGenerica2
    }));
  }
  getDescripcionClobGenerica2(): string {
    return this.getValue().descripcionClobGenerica2;
  }

  /**
   * Establece si es un proveedor extranjero en el estado.
   * 
   * @param {TipoDevAviso} tipoDevAviso - El tipo de proveedor extranjero a establecer.
   */
  setClientesProveedoresExtranjeros(foreignClientsSuppliers: boolean): void {
    this.update((state) => ({
      ...state,
      tipoDevAviso: { ...state.tipoDevAviso, foreignClientsSuppliers }
    }));
  }

  /**
   * Establece si es un proveedor nacional en el estado.
   * 
   * @param {TipoDevAviso} tipoDevAviso - El tipo de proveedor nacional a establecer.
   */
  setProveedoresNacionales(nationalSuppliers: boolean): void {
    this.update((state) => ({
      ...state,
      tipoDevAviso: { ...state.tipoDevAviso, nationalSuppliers }
    }));
  }

  /**
   * Establece si hubo modificaciones en los miembros en el estado.
   * 
   * @param {TipoDevAviso} tipoDevAviso - El tipo de modificación a establecer.
   */
  setModificacionesMiembros(modificationsMembers: boolean): void {
    this.update((state) => ({
      ...state,
      tipoDevAviso: { ...state.tipoDevAviso, modificationsMembers }
    }));
  }

  setCapacidadAlmacenamiento(capacidadAlmacenamiento: number): void {
    this.update((state) => ({
      ...state,
      capacidadAlmacenamiento
    }));
  }
  getCapacidadAlmacenamiento(): number {
    return this.getValue().capacidadAlmacenamiento;
  }

  setNumeroTotalCarros(numeroTotalCarros: number): void {
    this.update((state) => ({
      ...state,
      numeroTotalCarros
    }));
  }
  getNumeroTotalCarros(): number {
    return this.getValue().numeroTotalCarros;
  }
  setCantidadBienes(cantidadBienes: number): void {
    this.update((state) => ({
      ...state,
      cantidadBienes
    }));
  }
  getCantidadBienes(): number {
    return this.getValue().cantidadBienes;
  }


  /**
   * Establece si hubo cambios en los documentos legales en el estado.
   * 
   * @param {TipoDevAviso} tipoDevAviso - El tipo de cambio en los documentos legales.
   */
  setCambiosDocumentosLegales(changesToLegalDocuments: boolean): void {
    this.update((state) => ({
      ...state,
      tipoDevAviso: { ...state.tipoDevAviso, changesToLegalDocuments }
    }));
  }

  /**
   * Establece si hay una notificación de fusión o escisión en el estado.
   * 
    * @param {boolean} mergerOrSplitNotice - El tipo de adición a establecer.
   */
  setNotifiFusionOescision(mergerOrSplitNotice: boolean): void {
    this.update((state) => ({
      ...state,
      tipoDevAviso: { ...state.tipoDevAviso, mergerOrSplitNotice }
    }));
  }

  /**
   * Establece si hay adiciones de fracciones en el estado.
   * 
   * @param {boolean} additionFractions - El tipo de adición a establecer.
   */
  setAdicionalesFractions(additionFractions: boolean): void {
    this.update((state) => ({
      ...state,
      tipoDevAviso: { ...state.tipoDevAviso, additionFractions }
    }));
  }


  /**
   * Actualiza el estado del store con el arreglo proporcionado de gridFraccionesHeader.
   *
   * @param gridFraccionesHeader - Un arreglo de objetos `FraccionGridItem` que representa los encabezados para la tabla de fracciones.
   */
  setCargaManual(gridFraccionesHeader: FraccionGridItem[]): void {
    this.update((state) => ({
      ...state,
      gridFraccionesHeader
    }));
  }
  getCargaManual(): FraccionGridItem[] {
    return this.getValue().gridFraccionesHeader;
  }

  /**
   * Establece el encabezado de la tabla de fusión o escisión.
   * 
   * @param {EscisionHeaderItem[]} fusionEscisionHeader - El encabezado a establecer.
   */
  setFusionEscisionHeader(fusionEscisionHeader: EscisionHeaderItem[]): void {
    this.update((state) => ({
      ...state,
      fusionEscisionHeader: fusionEscisionHeader
    }));
  }

  getFusionEscisionHeader(): EscisionHeaderItem[] {
    return this.getValue().fusionEscisionHeader;
  }

    /**
   * Establece el encabezado de la tabla de fusión o escisión.
   * 
   * @param {EscisionHeaderItem[]} fusion - El encabezado a establecer.
   */
  setFusion(fusion: EscisionHeaderItem[]): void {
    this.update((state) => ({
      ...state,
      fusion: fusion
    }));
  }

  getFusion(): EscisionHeaderItem[] {
    return this.getValue().fusion;
  }
  /**
     * Establece el encabezado de la tabla de modificación de socios.
     * @param {ModificacionSociosItem[]} modificacionSociosHeader - El encabezado a establecer.
     * */
  setMostrarGridNuevoHeaderData(mostrarGridNuevoHeaderData: MostrarGridNuevoHeader[]): void {
    this.update((state) => ({
      ...state,
      mostrarGridNuevoHeaderData: mostrarGridNuevoHeaderData
    }));
  }
  getMostrarGridNuevoHeaderData(): MostrarGridNuevoHeader[] {
    return this.getValue().mostrarGridNuevoHeaderData;
  }
  /**
     * Establece el encabezado de la tabla de modificación de socios.
     * @param {ModificacionSociosItem[]} modificacionSociosHeader - El encabezado a establecer.
     * */
  setModificacionSociosHeader(modificacionSociosHeader: ModificacionSociosItem[]): void {
    this.update((state) => ({
      ...state,
      modificacionSociosHeader: modificacionSociosHeader
    }));
  }
  getModificacionSociosHeader(): ModificacionSociosItem[] {
    return this.getValue().modificacionSociosHeader;
  }

  setTipoTramiteDeclaraciones(tipoTramiteDeclaraciones: []): void {
    this.update((state) => ({
      ...state,
      tipoTramiteDeclaraciones: tipoTramiteDeclaraciones
    }));
  }

  /**
   * Establece si se aceptó el artículo 253 en el estado.
   * 
     * @param {boolean} acepto253 - El tipo de adición a establecer.
   */
  setAceptacion253(acepto253: boolean): void {
    this.update((state) => ({
      ...state,
      tipoDevAviso: { ...state.tipoDevAviso, acepto253 },
    }));
  }

  getAcceptacion253(): boolean {
    return this.getValue().tipoDevAviso.acepto253;
  }

  /**
   * Establece el archivo extranjero en el estado.
   * 
   * @param {ProveedorExtranjero} proveedorExtranjero - El archivo del proveedor extranjero.
   */
  setArchivoExtranjero(proveedorExtranjero: ProveedorExtranjero): void {
    this.update((state) => ({
      ...state,
      archivoExtranjero: proveedorExtranjero
    }));
  }

  /**
   * Establece los registros de proveedores extranjeros en el estado.
   * 
   * @param {ProveedorExtranjero} proveedorExtranjero - Los registros del proveedor extranjero.
   */
  setRegistrosProveedoresExtranjeros(proveedorExtranjero: ProveedorExtranjero): void {
    this.update((state) => ({
      ...state,
      registrosProveedoresExtranjeros: proveedorExtranjero.registrosProveedoresExtranjeros
    }));
  }

  /**
   * Establece el estado de 'sucarácterde' de modificación de socios.
   * 
   * @param {number} ensucarácterde - El valor a establecer para 'ensucarácterde'.
   */
  setSnsucarácterde(ensucarácterde: number): void {
    this.update((state) => ({
      ...state,
      modificacionSocios: {
        ...state.modificacionSocios,
        ensucarácterde
      }
    }));
  }

  /**
   * Establece el RFC de modificación de socios en el estado.
   * 
   * @param {string} rfc - El RFC a establecer.
   */
  setRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      modificacionSocios: {
        ...state.modificacionSocios,
        rfc
      }
    }));
  }

  /**
   * Establece si está obligado a tributar en México en el estado.
   * 
   * @param {boolean} obligadoaTributarenMéxico - El valor a establecer para 'obligadoaTributarenMéxico'.
   */
  setObligadoaTributarenMéxico(obligadoaTributarenMéxico: boolean): void {
    this.update((state) => ({
      ...state,
      modificacionSocios: {
        ...state.modificacionSocios,
        obligadoaTributarenMéxico
      }
    }));
  }

  /**
   * Establece la nacionalidad de modificación de socios en el estado.
   * 
   * @param {number} nacionalidad - La nacionalidad a establecer.
   */
  setNacionalidad(nacionalidad: number): void {
    this.update((state) => ({
      ...state,
      modificacionSocios: {
        ...state.modificacionSocios,
        nacionalidad
      }
    }));
  }

  /**
   * Establece el registro federal de contribuyentes de modificación de socios en el estado.
   * 
   * @param {[]} registroFederaldeContribuyentes - El registro a establecer.
   */
  setRegistroFederaldeContribuyentes(registroFederaldeContribuyentes: []): void {
    this.update((state) => ({
      ...state,
      modificacionSocios: {
        ...state.modificacionSocios,
        registroFederaldeContribuyentes
      }
    }));
  }

  /**
   * Establece los datos de modificación de goce de inmueble en el estado.
   * 
   * @param {ModificacionGoceInmueble} modificacionGoceInmueble - Los datos de modificación de goce de inmueble.
   */
  setModificacionGoceInmueble(modificacionGoceInmueble: ModificacionGoceInmueble): void {
    this.update(() => ({
      modificacionGoceInmueble
    }));
  }

  /**
   * Establece los datos de fusión o escisión de persona en el estado.
   * 
   * @param {PersonaFusionEscisionDTO} personaFusionEscisionDTO - Los datos de la persona en el proceso de fusión o escisión.
   */
  SetpersonaFusionEscisionDTO(personaFusionEscisionDTO: PersonaFusionEscisionDTO): void {
    this.update(() => ({
      personaFusionEscisionDTO
    }));
  }

  /**
   * Establece el nombre completo de modificación de socios en el estado.
   * 
   * @param {string} nombreCompleto - El nombre completo a establecer.
   */
  setNombreCompleto(nombreCompleto: string): void {
    this.update((state) => ({
      ...state,
      modificacionSocios: {
        ...state.modificacionSocios,
        nombreCompleto
      }
    }));
  }

  /**
   * Establece la propiedad `isActive` dentro del estado `modificacionSocios`.
   *
   * @param isActive - Valor booleano que indica si la modificación de socios está activa.
   */
  setIsActive(isActive: boolean): void {
    this.update((state) => ({
      ...state,
      modificacionSocios: {
        ...state.modificacionSocios,
        isActive
      }
    }));
  }
  /**
   * Limpia el formulario y restablece el estado a su estado inicial.
   */
  public limpiarFormulario(): void {
    this.reset();
  }
}
