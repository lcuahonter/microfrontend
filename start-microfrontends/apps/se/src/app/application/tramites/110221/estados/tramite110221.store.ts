import { ColumnasTabla, SeleccionadasTabla, } from '../models/registro.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@ng-mf/data-access-user';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../../shared/models/modificacion.enum';

import { GrupoRepresentativo, HistoricoColumnas, MercanciaTabla } from '../models/peru-certificado.model';

import { DestinatarioForm, DomicilioForm, RepresentanteLegalForm } from '../../110223/models/registro.model';

/**
 * @interface Tramite110221State
 * Interfaz que define el estado global del trámite 110221 para el certificado zoosanitario.
 * Contiene todas las propiedades y formularios requeridos en el flujo del trámite, así como los datos y banderas de validación.
 * 
 */



export interface Tramite110221State {

  /** @descripcion
   * Grupo representativo asociado al trámite.
   */
  grupoRepresentativo: GrupoRepresentativo;

  /** ID de la solicitud */
  idSolicitud: number | null;
  
  /**
   * Objeto que contiene datos del formulario de mercancía.
   * Las claves pueden contener valores de tipo undefined, boolean, string, number u objeto.
   */
  mercanciaForm: { [key: string]: undefined | boolean | string | number | object };
  /**
   * Objeto que contiene datos del formulario del certificado.
   * Las claves pueden contener valores de tipo undefined, boolean, string, number u objeto.
   */
  formCertificado: { [key: string]: undefined | boolean | string | number | object };
  /**
   * @property {Catalogo} estado - Estado seleccionado.
   * @description
   * Representa el estado actual del trámite, utilizado para filtrar y seleccionar opciones en el formulario.
   */
  estado: Catalogo;
  /**
   * @property {Catalogo[]} paisBloques - Bloques de países seleccionados.
   * @description
   * Lista de bloques de países que se pueden seleccionar en el formulario, representados como objetos `Catalogo`.
   */
  paisBloques: Catalogo;
 
  /**
   * @property {Mercancia[]} mercanciaTabla - Tabla de mercancías agregadas.
   * @description
   * Arreglo que almacena las mercancías seleccionadas, cada una representada por un objeto `Mercancia`.
   */
  mercanciaTabla: Mercancia[];
  /**
   * @property {Object} formDatosCertificado - Datos adicionales del certificado.
   * @description
   * Contiene campos como observaciones, idioma, entidad federativa y representación federal.
   */
  formDatosCertificado: { [key: string]: unknown};
  /**
   * @property {Catalogo} idiomaDatosSeleccion - Idioma seleccionado.
   * @description
   * Representa el idioma en el que se generará el certificado, utilizado para la presentación del documento.
   */
  idiomaDatosSeleccion: Catalogo;
  /**
   * @property {Catalogo} entidadFederativaSeleccion - Entidad federativa seleccionada.
   * @description
   * Representa la entidad federativa donde se llevará a cabo el trámite, utilizada para filtrar opciones en el formulario.
   */
  entidadFederativaSeleccion: Catalogo;
  /**
   * @property {Catalogo} representacionFederalSeleccion - Representación federal seleccionada.
   * @description
   * Representa la representación federal asociada al trámite, utilizada para la validación y presentación del certificado.
   */
  representacionFederalSeleccion: Catalogo;
  /**
   * @property {string} nombreComercialMercancia - Nombre comercial de la mercancía.
   * @description
   * Nombre comercial utilizado para identificar la mercancía en el trámite.
   */
  nombreComercialMercancia: string;
  /**
   * @property {string} nombreIngles - Nombre en inglés de la mercancía.
   * @description
   * Nombre de la mercancía en inglés, utilizado para trámites internacionales.
   */
  nombreIngles: string;
  /**
   * @property {string} complementoDescripcion - Complemento de la descripción.
   * @description
   * Descripción adicional de la mercancía, utilizada para proporcionar más detalles en el certificado.
   */
  complementoDescripcion: string;
  /**
   * @property {string} criterioParaTratoPreferencial - Criterio para trato preferencial.
   * @description
   * Criterio que determina si la mercancía califica para un trato preferencial en términos arancelarios.
   */
  criterioParaTratoPreferencial: string;
  /**
   * @property {string} valorDeContenidoRegional - Valor de contenido regional.
   * @description
   * Representa el valor del contenido regional de la mercancía, utilizado para determinar su origen.
   */
  valorDeContenidoRegional: string;
  /**
   * @property {string} numeroDeSerie - Número de serie de la mercancía.
   * @description
   * Número de serie único asignado a la mercancía, utilizado para su identificación.
   */
  numeroDeSerie: string;
  /**
   * @property {string} valorMercancia - Valor de la mercancía.
   * @description
   * Valor monetario asignado a la mercancía, utilizado para fines fiscales y comerciales.
   */
  valorMercancia: string;
  /**
   * @property {string} complementoClasificacion - Complemento de clasificación.
   * @description
   * Información adicional sobre la clasificación de la mercancía, utilizada para su correcta identificación.
   */
  complementoClasificacion: string;
  /**
   * @property {Object} formaValida - Estado de validación de los formularios.
   * @description
   * Contiene banderas que indican si cada sección del formulario es válida, como certificado, datos, destinatario y exportador.
   */
  formaValida: { [key: string]: boolean };
  /**
   * @property {boolean} [datosConfidencialesProductor] - Indica si los datos del productor son confidenciales.
   * @description
   * Bandera que indica si los datos del productor deben ser tratados como confidenciales.
   */
  datosConfidencialesProductor?: boolean;
  /**
   * @property {boolean} [si] - Bandera auxiliar para el flujo del trámite.
   * @description
   * Utilizada para controlar el flujo del trámite, puede ser utilizada en condiciones lógicas dentro del store.
   */
  si?: boolean;
  /**
   * @property {DestinatarioForm} destinatarioForm - Formulario de destinatario.
   * @description
   * Contiene los campos del formulario para el destinatario, como nombre y número fiscal.
   */
  destinatarioForm: DestinatarioForm;
  /**
   * @property {DomicilioForm} domicilioForm - Formulario de domicilio.
   * @description
   * Contiene los campos del formulario para el domicilio, como calle, número/letra, país destino, ciudad, correo electrónico, lada y teléfono.
   */
  domicilioForm: DomicilioForm;
  /**
   * @property {RepresentanteLegalForm} representanteLegalForm - Formulario de representante legal.
   * @description
   * Contiene los campos del formulario para el representante legal, como lugar, nombre, empresa, cargo, lada, teléfono, fax y correo electrónico.
   */
  representanteLegalForm: RepresentanteLegalForm;
  /**
   * @property {boolean} [productorMismoExportador] - Indica si el productor es el mismo que el exportador.
   * @description
   * Bandera que indica si el productor y el exportador son la misma entidad, utilizada para simplificar el flujo del trámite.
   */
  productorMismoExportador?: boolean;
  /**
   * @property {Object} agregarDatosProductorFormulario - Datos adicionales del productor.
   * @description
   * Contiene campos adicionales para el formulario del productor, como número de registro fiscal y fax.
   */
  agregarDatosProductorFormulario: { [key: string]: unknown};
  /**
   * @property {Object} formulario - Otros datos de formularios auxiliares.
   * @description
   * Contiene otros datos relevantes para el trámite, como datos confidenciales del productor y si el productor es el mismo exportador.
   */
  formulario: { [key: string]: unknown};

  //NEW
  nombre: string;
  apellidoPrimer: string;
  apellidoSegundo: string;
  numeroFiscal: string;
  razonSocial: string;
  ciudad: string;
  calle: string;
  numeroLetra: string;
  lada: string;
  telefono: string;
  fax: string;
  correoElectronico: string;
  paisDestino: string;
  tercerOperador: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  numeroDeRegistroFiscal: string;
  tratado: string;
  rangoDeFecha: string;
  pais: string;
  fraccionArancelaria: string;
  numeroRegistro: string;
  nombreComercial: string;
  fechaInicial: string;
  fechaFinal: string;
  archivo: string;
  fraccionMercanciaArancelaria: string;
  otrasInstancias:string;
  nombreTecnico: string;
  nombreComercialDelaMercancia: string;
  criterioParaConferir: string;
  nombreEnIngles: string;
  cantidad: string;
  umc: string;
  valorDelaMercancia: string;
  complementoDelaDescripcion: string;
  tipoFactura: string;
  fecha: string;
  numeroFactura: string;
    disponiblesDatos:Mercancia[];
      productoresExportador: HistoricoColumnas[];
      /** Validez de los formularios individuales */
      formValidity?: {
        datosCertificado?: boolean;
        destinatario?: boolean;
        histProductores?: boolean;
        certificadoOrigen?: boolean;
      };
  

  mercanciaSeleccionadasTablaData:SeleccionadasTabla[],
  mercanciaDisponsiblesTablaDatos:ColumnasTabla[],
  valordeContenidoRegional:string,
    /** Lista de catálogos para la alta de planta. */
  altaPlanta: Catalogo[],
   /** Lista de catálogos que representan facturas disponibles. */
  factura: Catalogo[];
    /** Lista de mercancías asociadas a los productores. */
  mercanciaProductores: MercanciaTabla[];
    /** Lista de mercancías encontradas o buscadas. */
    buscarMercancia: Mercancia[];
    
  /** Lista de catálogos que representan unidades de medida comercial (UMCs). */
  umcs: Catalogo[];
  /** Opciones disponibles para el tipo de factura en el formulario, provenientes del catálogo correspondiente. */
  optionsTipoFactura: Catalogo[];
 /**
   * @property {Object} formDatosDelDestinatario - Datos del destinatario.
   * @description
   * Contiene información del destinatario del certificado, como nombres, apellidos, número de registro fiscal y razón social.
   */
  formDatosDelDestinatario: { [key: string]: unknown };

  /** @property {Object} agregarProductoresExportador - Datos de los productores a agregar.
   * @description
   * Contiene información sobre los productores que se desean agregar al exportador.
   */
  agregarProductoresExportador: HistoricoColumnas[];
  
  /** @property {Object} formDestinatario - Datos del destinatario.
   */
  formDestinatario: { [key: string]: unknown };
  /**
   * @property {Object} formExportor - Datos del exportador.
   * @description
   * Contiene información del exportador, como lugar, nombre de la empresa, cargo, lada, teléfono, fax y correo electrónico.
   */
  formExportor: { [key: string]: unknown };}
 
/**
 * asegurando que el estado comience limpio y sin datos previos.
 * @method createInitialState
 * @function createInitialState
 * @descripcion
 * Función que crea y retorna el estado inicial del store Tramite110221Store para el certificado zoosanitario.
 * Inicializa todas las propiedades y formularios requeridos en el flujo del trámite con valores por defecto,
 * 
 * 
 * @returns {Tramite110221State} Estado inicializado para el store del trámite 110221.
 */
export function createInitialState(): Tramite110221State {
  return {
  idSolicitud:0,
  formCertificado: {
    entidadFederativa: '',
    tercerOperador: false,
    bloque: '',
    nombreComercialForm: '',
    registroProductoForm: '',
    fraccionArancelariaForm: '',
    fechaInicioInput: '',
    fechaFinalInput: '',
  },
     estado: {
      id: -1,
      descripcion: '',
    },
    paisBloques: { id: -1, descripcion: '' },
 mercanciaProductores: [],
    mercanciaTabla: [],
    formDatosCertificado: {
      observacionesDates: '',
      idiomaDates: '',
      precisaDates: '',
      EntidadFederativaDates: '',
      representacionFederalDates: '',
    },
    idiomaDatosSeleccion: { id: -1, descripcion: '' },
    entidadFederativaSeleccion: { id: -1, descripcion: '' },
    representacionFederalSeleccion: { id: -1, descripcion: '' },
    fraccionArancelaria: '',
    nombreComercialMercancia: '',
    nombreTecnico: '',
    nombreIngles: '',
    complementoDescripcion: '',
    criterioParaTratoPreferencial: '',
    valorDeContenidoRegional: '',
    numeroDeSerie: '',
    cantidad: '',
    valorMercancia: '',
    complementoClasificacion: '',
    numeroFactura: '',
    formaValida: {
      certificado: false,
      datos: false,
      destinatrio: false,
      datosDestinatario: false,
      exportador: false,
    },
    formulario:{
      datosConfidencialesProductor: '',
      productorMismoExportador: '',
    },
    agregarDatosProductorFormulario: {
      numeroRegistroFiscal: '',
      fax: '',      
    },
    nombre: '',
    apellidoPrimer: '',
    apellidoSegundo: '',
    numeroFiscal: '',
    razonSocial: '',
    ciudad: '',
    calle: '',
    numeroLetra: '',
    lada: '',
    telefono: '',
    fax: '',
    correoElectronico: '',
    paisDestino: '',
    tercerOperador: '',
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    numeroDeRegistroFiscal: '',
    tratado: '',
    rangoDeFecha: '',
    pais: '',
    numeroRegistro: '',
    nombreComercial: '',
    fechaInicial: '',
    fechaFinal: '',
    archivo: '',
    fraccionMercanciaArancelaria: '',
    nombreComercialDelaMercancia: '',
    criterioParaConferir: '',
    nombreEnIngles: '',
    umc: '',
    valorDelaMercancia: '',
    complementoDelaDescripcion: '',
    tipoFactura: '',
    fecha: '',
    mercanciaSeleccionadasTablaData:[],
    mercanciaDisponsiblesTablaDatos:[],
      disponiblesDatos: [],
    otrasInstancias:'',
    valordeContenidoRegional:'',
  destinatarioForm: {} as DestinatarioForm,
  domicilioForm: {} as DomicilioForm,
  representanteLegalForm: {} as RepresentanteLegalForm,
grupoRepresentativo: {
  lugar: '',
  nombre: '',
  empresa: '',
  cargo: '',
  registroFiscal: '',
  telefono: '',
  fax: '',
  correo: '',
},
   formDestinatario: {
      paisDestin: '',
      ciudad: '',
      celle: '',
      numeroLetra: '',
      lada: '',
      telefono: '',
      fax: '',
      correoElectronico: '',
    },
    formDatosDelDestinatario: {
      nombres: '',
      primerApellido: '',
    },
    formExportor: {
      lugar: '',
      nombreEmpresa: '',
      cargo: '',
      lada: '',
      telefono: '',
      fax: '',
      correoElectronico: ''
    },

   buscarMercancia: [],
   altaPlanta:[],
     mercanciaForm: {
    fraccionNaladi: '',
    fraccionNaladiSa93: '',
    fraccionNaladiSa96: '',
    fraccionNaladiSa02: '',
    nombreTecnico: '',
    nombreComercial: '',
    normaOrigen: '',
    id: '',
    cantidad: '',
    umc: '',
    tipoFactura: '',
    valorMercancia: '',
    fechaFinalInput: '',
    numeroFactura: '',
    nalad: '',
    complementoClasificacion: '',
  },
  factura:[],
  umcs:[],
  optionsTipoFactura: [],
  agregarProductoresExportador: [],
  productoresExportador: [],
    formValidity: {},
  };

}

/**
 * @descripcion
 * Store encargado de gestionar el estado global del trámite 110221 para el certificado zoosanitario.
 * Permite actualizar y consultar los datos de los diferentes formularios y secciones del trámite,
 * así como el estado de validación de cada uno de ellos.
 * Utiliza Akita para la gestión reactiva del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'Tramite110221Store', resettable: true })
export class Tramite110221Store extends Store<Tramite110221State> {

 
  /**
   * @descripcion
   * Constructor que inicializa el almacén con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }
  /** @descripcion
   * Observable que selecciona todo el estado del trámite.
   */
  selectTramite$ = this._select((state) => state);

  /**
   * Guarda el ID de la solicitud en el estado.
   *
   * @param idSolicitud - El ID de la solicitud que se va a guardar.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
  /**
   * Actualiza los datos del formulario de destinatario.
   * @param values Clave/valor con campos del formulario.
   */
  setFormDatosDelDestinatario(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      formDatosDelDestinatario: {
        ...state.formDatosDelDestinatario,
        ...values,
      },
    }));
  }

  /**
   * Actualiza los datos del formulario del exportador.
   * @param values Clave/valor con campos del formulario.
   */
  public setFormExportor(values: { [key: string]: undefined | string }): void {
    this.update((state) => ({
      formExportor: {
        ...state.formExportor,
        ...values,
      },
    }));
  }
  /**
   * Actualiza los datos del formulario del destinatario.
   * @param values Clave/valor con campos del formulario.
   */
  public setFormDestinatario(values: { [key: string]: undefined | string }): void {
    this.update((state) => ({
      formDestinatario: {
        ...state.formDestinatario,
        ...values,
      },
    }));
  }

  /**
   * Actualiza los valores del formulario principal del certificado.
   * @param values Clave/valor con campos del formulario.
   */
  setFormCertificado(values: { [key: string]: undefined | boolean | string | number | object }): void {
    this.update((state) => ({
      formCertificado: {
        ...state.formCertificado,
        ...values,
      },
    }));
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario histórico.
   * @param values - Valores a actualizar en el formulario.
   */
  setFormHistorico(values: { [key: string]: unknown}): void {
    this.update((state) => ({
      formulario: {
        ...state.formulario,
        ...values,
      },
    }));
  }
  /** @descripcion
   * Actualiza los datos del formulario de exportador.
   * @param values - Valores a actualizar en el formulario.
   */
  setFormExportador(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      formExportor: {
        ...state.formExportor,
        ...values,
      },
    }));
  }
  /**
   * @descripcion
   * Actualiza los datos del formulario de productor.
   * @param values - Valores a actualizar en el formulario.
   */
  setAgregarFormDatosProductor(values: { [key: string]: unknown}): void {
    this.update((state) => ({
      agregarDatosProductorFormulario: {
        ...state.agregarDatosProductorFormulario,
        ...values,
      },
    }));
  }

  /**
   * @descripcion
   * Actualiza el estado seleccionado en el almacén.
   * @param estado - Objeto de tipo `Catalogo` que contiene la información del estado a actualizar.
   */
setEstado(estado: Catalogo): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }
/**
   * @method setDatosConfidencialesProductor
   * @description
   * Actualiza el estado de datos confidenciales del productor en el almacén.
   * @param datosConfidencialesProductor Valor booleano que indica si los datos del productor son confidenciales.
   * */
  setDisponsiblesDatos(disponiblesDatos: Mercancia[]): void {
    this.update((state) => ({
      ...state,
      disponiblesDatos,
    }));
  }
  /**
   * @method setBloque
   * @description
   * Actualiza los bloques de países en el almacén.
   * @param paisBloques Array de objetos `Catalogo` que representa los bloques de países.
   */
  setBloque(paisBloques: Catalogo): void {
    this.update((state) => ({
      ...state,
      paisBloques,
    }));
  }

  /**
   * @descripcion
   * Actualiza la tabla de mercancías en el almacén.
   * @param mercanciaTabla - Array de objetos `Mercancia` que representa la tabla de mercancías.
   */
  setmercanciaTabla(mercanciaTabla: Mercancia[]): void {
    this.update((state) => ({
      ...state,
      mercanciaTabla,
    }));
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario de certificado en el almacén.
   * @param values - Objeto que contiene los valores a actualizar en el formulario de certificado.
   */
setFormDatosCertificado(values: { [key: string]: unknown }): void {
  this.update((state) => ({
    ...state,
    formDatosCertificado: {
      ...state.formDatosCertificado, 
      ...values,                     
    },
  }));
}
 /**
* Actualiza el estado de validez de un formulario específico dentro del trámite.
* @param formName Nombre del formulario a actualizar.
* @param isValid Indica si el formulario es válido o no.
*/
  setFormValidity(formName: string, isValid: boolean): void {
    this.update((state) => ({
      ...state,
      formValidity: {
        ...state.formValidity,
        [formName]: isValid,
      },
    }));
  }


  /**
   * @descripcion
   * Actualiza el idioma seleccionado en el almacén.
   * @param idiomaDatosSeleccion - Objeto de tipo `Catalogo` que contiene la información del idioma seleccionado.
   */
  setIdiomaSeleccion(idiomaDatosSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      idiomaDatosSeleccion,
    }));
  }

  /**
   * @descripcion
   * Actualiza la entidad federativa seleccionada en el almacén.
   * @param entidadFederativaSeleccion - Objeto de tipo `Catalogo` que contiene la información de la entidad federativa seleccionada.
   */
  setEntidadFederativaSeleccion(entidadFederativaSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      entidadFederativaSeleccion,
    }));
  }

  /**
   * @descripcion
   * Actualiza la representación federal seleccionada en el almacén.
   * @param representacionFederalSeleccion - Objeto de tipo `Catalogo` que contiene la información de la representación federal seleccionada.
   */
  setRepresentacionFederalDatosSeleccion(representacionFederalSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      representacionFederalSeleccion,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de fraccionArancelaria en el almacén.
   * @param fraccionArancelaria - Cadena que representa el número de fraccionArancelaria a actualizar.
   */
  setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de nombreComercialMercancia en el almacén.
   * @param nombreComercialMercancia - Cadena que representa el número de nombreComercialMercancia a actualizar.
   */
  setNombreComercialMercancia(nombreComercialMercancia: string): void {
    this.update((state) => ({
      ...state,
      nombreComercialMercancia
    }))
  }

  /**
   * @descripcion
   * Actualiza el número de nombreTecnico en el almacén.
   * @param nombreTecnico - Cadena que representa el número de nombreTecnico a actualizar.
   */
  setNombreTecnico(nombreTecnico: string): void {
    this.update((state) => ({
      ...state,
      nombreTecnico
    }))
  }

  /**
   * @descripcion
   * Actualiza el número de nombreIngles en el almacén.
   * @param nombreIngles - Cadena que representa el número de nombreIngles a actualizar.
   */
  setNombreIngles(nombreIngles: string): void {
    this.update((state) => ({
      ...state,
      nombreIngles
    }))
  }

  /**
   * @descripcion
   * Actualiza el número de criterioParaTratoPreferencial en el almacén.
   * @param criterioParaTratoPreferencial - Cadena que representa el número de criterioParaTratoPreferencial a actualizar.
   */
  setCriterioParaTratoPreferencial(criterioParaTratoPreferencial: string): void {
    this.update((state) => ({
      ...state,
      criterioParaTratoPreferencial
    }))
  }

  /**
   * @descripcion
   * Actualiza el valor de `otrasInstancias` en el almacén.
   * @param otrasInstancias - Cadena que representa el nuevo valor de `otrasInstancias`.
   */
  setOtrasInstancias(otrasInstancias: string): void {
    this.update((state) => ({
      ...state,
      otrasInstancias
    }))
  }

  /**
   * @descripcion
   * Actualiza el número de criterioParaConferirOrigen en el almacén.
   * @param criterioParaConferirOrigen - Cadena que representa el número de criterioParaConferirOrigen a actualizar.
   */
  setCriterioParaConferirOrigen(criterioParaConferirOrigen: string): void {
    this.update((state) => ({
      ...state,
      criterioParaConferirOrigen,
    }))
  }

  /**
   * @descripcion
   * Actualiza el número de valorDeContenidoRegional en el almacén.
   * @param valorDeContenidoRegional - Cadena que representa el número de valorDeContenidoRegional a actualizar.
   */
  setValorDeContenidoRegional(valorDeContenidoRegional: string): void {
    this.update((state) => ({
      ...state,
      valorDeContenidoRegional,
    }))
  }

  /**
   * @descripcion
   * Actualiza el número de numeroDeSerie en el almacén.
   * @param numeroDeSerie - Cadena que representa el número de numeroDeSerie a actualizar.
   */
  setNumeroDeSerie(numeroDeSerie: string): void {
    this.update((state) => ({
      ...state,
      numeroDeSerie,
    }))
  }

  /**
   * @descripcion
   * Actualiza el número de cantidad en el almacén.
   * @param cantidad - Cadena que representa el número de cantidad a actualizar.
   */
  setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad,
    }))
  }

  /**
   * @descripcion
   * Actualiza el número de valorMercancia en el almacén.
   * @param valorMercancia - Cadena que representa el número de valorMercancia a actualizar.
   */
  setValorMercancia(valorMercancia: string): void {
    this.update((state) => ({
      ...state,
      valorMercancia,
    }))
  }

  /**
   * @descripcion
   * Actualiza el número de complementoDescripcion en el almacén.
   * @param complementoDescripcion - Cadena que representa el número de complementoDescripcion a actualizar.
   */
  setComplementoDescripcion(complementoDescripcion: string): void {
    this.update((state) => ({
      ...state,
      complementoDescripcion,
    }))
  }

  /**
   * @descripcion
   * Actualiza el número de numeroFactura en el almacén.
   * @param numeroFactura - Cadena que representa el número de numeroFactura a actualizar.
   */
  setNumeroFactura(numeroFactura: string): void {
    this.update((state) => ({
      ...state,
      numeroFactura,
    }))
  }

  /**
   * @descripcion
   * Actualiza el estado de validación de los formularios en el almacén.
   * @param formaValida - Objeto que contiene los valores de validación para los formularios.
   */
  setFormValida(formaValida: { [key: string]: boolean }): void {
    this.update((state) => {
      const IS_VALID = { ...state.formaValida, ...formaValida };
      return {
        ...state,
        formaValida: IS_VALID,
      };
    });
  }

  /**
   * Actualiza el estado del store con los valores proporcionados.
   * Valores a actualizar en el estado.
   */
  public actualizarEstado(valores: Partial<Tramite110221State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  } 
  /**
   * @descripcion
   * Actualiza los datos de la tabla de mercancías seleccionadas.
   * @param mercanciaSeleccionadasTablaData - Array de objetos `SeleccionadasTabla` que representa las mercancías seleccionadas.
   */
  setMercanciaSeleccionadasTablaData(mercanciaSeleccionadasTablaData: SeleccionadasTabla[]): void {
    this.update((state) => ({
      ...state,
      mercanciaSeleccionadasTablaData,
    }));
  }

  /**
   * @descripcion
   * Actualiza los datos de la tabla de mercancías disponibles.
   * @param mercanciaDisponsiblesTablaDatos - Array de objetos `ColumnasTabla` que representa las mercancías disponibles.
   */
  setMercanciaDisponsiblesTablaDatos(mercanciaDisponsiblesTablaDatos: ColumnasTabla[]): void {
    this.update((state) => ({
      ...state,
      mercanciaDisponsiblesTablaDatos,
    }));
  }
  /**
   * @descripcion
   * Actualiza los datos del formulario de destinatario.
   * @param destinatarioForm - Objeto que contiene los valores del formulario de destinatario.
   */
  setDestinatarioForm(destinatarioForm: DestinatarioForm): void {
    this.update((state) => ({
      ...state,
      destinatarioForm,
    }));
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario de domicilio.
   * @param domicilioForm - Objeto que contiene los valores del formulario de domicilio.
   */
  setDomicilioForm(domicilioForm: DomicilioForm): void {
    this.update((state) => ({
      ...state,
      domicilioForm,
    }));
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario de representante legal.
   * @param representanteLegalForm - Objeto que contiene los valores del formulario de representante legal.
   */
  setRepresentanteLegalForm(representanteLegalForm: RepresentanteLegalForm): void {
    this.update((state) => ({
      ...state,
      representanteLegalForm,
    }));
  }

    /**
   * Establece las plantas disponibles para alta.
   * @param altaPlanta Lista de plantas.
   */
  setaltaPlanta(altaPlanta: Catalogo[]): void {
    this.update((state) => ({ ...state, altaPlanta }));
  }
    /**
     * Establece los resultados de mercancía obtenidos por búsqueda.
     * @param buscarMercancia Lista de resultados de tipo `Mercancias`.
     */
    setbuscarMercancia(buscarMercancia: Mercancia[]): void {
    this.update((state) => ({ ...state, buscarMercancia }));
  }

      /**
   * Actualiza los valores del formulario de mercancía.
   * @param values Clave/valor con información sobre la mercancía.
   */
  setFormMercancia(values: { [key: string]: undefined | boolean | string | number | object }): void {
    this.update((state) => ({
      mercanciaForm: {
        ...state.mercanciaForm,
        ...values,
      },
    }));
  }
    /**
   * Actualiza la lista de facturas.
   * @param factura Arreglo de objetos `Catalogo`.
   */
  setFactura(factura: Catalogo[]): void {
    this.update((state) => ({ ...state, factura }));
  }

  /**
   * Actualiza la lista de UMCs disponibles.
   * @param umcs Lista de catálogos con unidades de medida.
   */
  setUmc(umcs: Catalogo[]): void {
    this.update((state) => ({ ...state, umcs }));
  }
    /**
   * Actualiza la lista de UMCs disponibles.
   * @param mercanciaTabla Lista de catálogos con unidades de medida.
   */
  
  public setMercanciaTabla(mercanciaTabla: Mercancia[]): void {
    this.update((state) => ({ ...state, mercanciaTabla }));
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario de productor.
   * @param values - Valores a actualizar en el formulario.
   */
  setTipoFacturaOpciones(tipoFactura: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      optionsTipoFactura: tipoFactura,
    }));
  }
  /**
   * Actualiza los datos del formulario de destinatario.
   * @param values - Valores a actualizar en el formulario.
   */
  setformdestinatario(values: { [key: string]: unknown}): void {
    this.update((state) => ({
      formDestinatario: {
        ...state.formDestinatario,
        ...values,
      },
    }));
  }

  /** @descripcion
   * Actualiza los datos del formulario de destinatario.
   * @param values - Valores a actualizar en el formulario.
   */
  setformDatosDelDestinatario(values: { [key: string]: unknown}): void {
    this.update((state) => ({
      formDatosDelDestinatario: {
        ...state.formDatosDelDestinatario,
        ...values,
      },
    }));
  }

  /** @descripcion
   * Actualiza los datos del formulario de exportador.
   * @param values - Valores a actualizar en el formulario.
   */
  setformExportor(values: { [key: string]: unknown}): void {
    this.update((state) => ({
      formExportor: {
        ...state.formExportor,
        ...values,
      },
    }));
  }
  /**
   * Establece los resultados de mercancía obtenidos por búsqueda.
   * @param buscarMercancia Lista de resultados de tipo `Mercancia`.
   */
  setProductores(productores: HistoricoColumnas[]): void {
    this.update((state) => ({ ...state, productores }));
  }

/**
 * @descripcion
 * Agrega un productor al arreglo de productores exportadores en el estado.
 * 
 * @param productor - Objeto de tipo `HistoricoColumnas` que representa el productor a agregar.
 * 
 * @detalle
 * - Crea una nueva instancia del arreglo `agregarProductoresExportador` con el productor proporcionado.
 * - Mantiene los productores existentes en el arreglo y agrega el nuevo productor al final.
 * - Actualiza el estado global del store con el nuevo arreglo de productores exportadores.
 */
setAgregarProductoresExportador(productor: HistoricoColumnas): void {
  this.update((state) => ({
    ...state,
    agregarProductoresExportador: [
      ...state.agregarProductoresExportador,
      { ...productor },
    ],
  }));
}

}