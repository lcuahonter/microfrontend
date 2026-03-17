import { ColumnasTabla, SeleccionadasTabla } from '../constantes/modificacion.enum';
import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@ng-mf/data-access-user';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../../shared/models/modificacion.enum';



/**
 * @interface TramiteState
 * @description
 * Interfaz que representa la estructura completa del estado del formulario de un trámite.
 * Este estado incluye catálogos, selecciones, formularios dinámicos, listas de mercancía, datos del destinatario y banderas de validación.
 */
export interface TramiteState {
  idSolicitud?: number | null;
  calle1?: string;
  numeroLetra1?: string;

  /** Lista de idiomas disponibles como catálogo */
  idiomaDatos?: Catalogo[];

  /** Idioma seleccionado actualmente */
  idiomaDatosSeleccion?: Catalogo;

  /** Lista de países destino como catálogo */
  paisDestin?: Catalogo[];

  /** País destino seleccionado */
  paisDestinSeleccion?: Catalogo;

  /** Lista de medios de transporte disponibles */
  medioDeTransporte?: Catalogo[];

  /** Medio de transporte seleccionado */
  medioDeTransporteSeleccion?: Catalogo;

  /** Entidad federativa seleccionada */
  entidadFederativaSeleccion?: Catalogo;

  /** Lista de entidades federativas disponibles */
  entidadFederativaDatos?: Catalogo[];

  /** Lista de representaciones federales disponibles */
  representacionFederalDatos?: Catalogo[];

  /** Representación federal seleccionada */
  representacionFederalSeleccion?: Catalogo;

  /** Lista de opciones para alta de planta */
  altaPlanta?: Catalogo[];

  /** Estado actual del trámite */
  estado?: Catalogo;

  /** Lista de facturas como catálogo */
  factura?: Catalogo[];

  /** Factura seleccionada actualmente */
  facturas?: Catalogo;

  /** Unidad de medida comercial seleccionada */
  umc?: Catalogo;

  /** Lista de unidades de medida comercial disponibles */
  umcs?: Catalogo[];

  /** Unidad de medida de masa seleccionada */
  masa?: Catalogo;

  /** Lista de unidades de masa bruta disponibles */
  masaBruta?: Catalogo[];

  /** Lista de países por bloque comercial */
  paisBloques?: Catalogo[];

  /** País seleccionado dentro del bloque comercial */
  paisBloque?: Catalogo;

  /** Datos del formulario principal del certificado */
  formCertificado?: { [key: string]: unknown };

  /** Datos del formulario relacionados con los detalles del certificado */
  formDatosCertificado?: { [key: string]: unknown };

  /** Datos específicos del formulario de mercancía */
  mercanciaForm?: { [key: string]: unknown };
/** Datos específicos del formulario de transporte */
  formTransporte?: { [key: string]: unknown };
  /** Objeto que contiene banderas booleanas para validar formularios */
  formaValida?: { [key: string]: boolean };

  /** Lista de mercancías encontradas en la búsqueda */
  buscarMercancia?: Mercancia[];

  /** Tabla que contiene las mercancías agregadas */
  mercanciaTabla?: Mercancia[];

  /** Lista de mercancías disponibles */
  disponiblesDatos?: Mercancia[];

  /** Datos generales del destinatario */
  destinatarioForm?: { [key: string]: unknown };

  /** Formulario general del destinatario */
  formDestinatario?: { [key: string]: unknown };

  /** Formulario con los datos específicos del destinatario */
  formDatosDelDestinatario?: { [key: string]: unknown };

  fraccionArancelaria?: string;
  tratado?: string;
  pais?: string;
  numeroRegistro?: string;
  nombreComercial?: string;
  fechaInicial?: string;
  fechaFinal?: string;
  archivo?: string;
  presica?: string;
  presenta?: string;
  idioma?: string;
  entidad?: string;
  representacion?: string;
  apellidoPrimer?: string;
  apellidoSegundo?: string;
  numeroFiscal?: string;
  ciudad?: string;
  calle?: string;
  numeroLetra?: string;
  lada?: string;
  telefono?: string;
  fax?: string;
  correoElectronico?: string;
  nacion?: string;
  transporte?: string;
  fraccionMercanciaArancelaria?: string;
  nombreTecnico?: string;
  nombreEnIngles?: string;
  criterioParaConferir?: string;
  marca?: string;
  cantidad?: string;
  valorDelaMercancia?: string;
  complementoDelaDescripcion?: string;
  nombreComercialDelaMercancia?: string;
  unidadMedida?: string;
  tipoFactura?: string;
  fecha?: string;
  numeroFactura?: string;
  justificacion?: string;
  casillaVerificacion?: string;

  mercanciaSeleccionadasTablaData?: SeleccionadasTabla[];

  /** Lista de mercancías disponibles (estructura ColumnasTabla) */
  mercancias_disponibles?: ColumnasTabla[];
}

/**
 * @interface Solicitud110202State
 * @description
 * Interfaz que define la estructura del estado para el trámite de solicitud 110202.
 * Contiene datos relacionados con la mercancía, información del solicitante, origen/destino y otros campos asociados al formulario.
 */
export interface Solicitud110202State {
     idSolicitud: number | null;
   calle1:string;
   numeroLetra1:string;
  /** Régimen de la mercancía (por ejemplo, definitivo, temporal) */
  regimenMercancia: string;

  /** Clasificación del régimen aplicable */
  clasifiRegimen: string;

  /** Valor del Tratado de Libre Comercio o Acuerdo aplicable */
  valueTA: string;

  /** Fracción arancelaria correspondiente a la mercancía */
  fraccionArancelaria: string;

  /** NICO (Número de Identificación Comercial) relacionado con la fracción */
  nico: string;

  /** Unidad de medida tarifaria usada para la mercancía */
  unidadMedidaTarifaria: string;

  /** Cantidad medida en unidad tarifaria */
  cantidadTarifaria: number;

  /** Valor total de la factura en dólares estadounidenses */
  valorFacturaUSD: number;

  /** Precio unitario de la mercancía en dólares estadounidenses */
  precioUnitarioUSD: string;

  /** País de origen de la mercancía */
  paisOrigen: string;

  /** País de destino de la mercancía */
  paisDestino: string;

  /** Identificador del lote o agrupación de productos */
  lote: string;

  /** Fecha de salida de la mercancía (en formato ISO o compatible) */
  fechaSalida: string;

  /** Observaciones generales relacionadas con la solicitud */
  observaciones: string;

  /** Observaciones específicas relacionadas con la mercancía */
  observacionMerc: string;

  /** Tipo de persona (por ejemplo, FÍSICA o MORAL) */
  tipoPersona: string;

  /** Nombre de la persona física (en caso de no ser razón social) */
  nombre: string;

  /** Apellido paterno del solicitante */
  apellidoPaterno: string;

  /** Apellido materno del solicitante */
  apellidoMaterno: string;

  /** Razón social (en caso de persona moral) */
  razonSocial: string;

  /** Nombre del molino asociado (si aplica) */
  molino: string;

  /** Dirección o domicilio del solicitante */
  domicilio: string;

  /** Estado o entidad federativa del domicilio */
  estado: string;

  /** País perteneciente a un bloque comercial (ej. MERCOSUR, USMCA) */
  paisBloque: string;

  /** Número o identificador de la factura comercial */
  factura: string;

  /** Unidad de medida comercial utilizada */
  umc: string;

  /** Representación federal asociada (puede usarse en trámites centralizados) */
  representacionFederal: string;
}

/**
 * Estado inicial para el store del trámite 110202.
 *
 * Contiene la estructura y valores predeterminados para todos los campos y formularios
 * relacionados con el trámite, incluyendo listas de selección, formularios de datos,
 * estados de validación y objetos seleccionados.
 *
 * @remarks
 * Este estado inicial es utilizado para inicializar y resetear el store del trámite,
 * asegurando que todos los campos tengan valores definidos y consistentes al inicio.
 *
 * @property altaPlanta Lista de plantas de producción registradas.
 * @property paisBloques Lista de países o bloques económicos seleccionables.
 * @property buscarMercancia Resultado de búsqueda de mercancías.
 * @property mercanciaTabla Lista de mercancías añadidas a la tabla.
 * @property estado Estado actual del trámite.
 * @property umc Unidad de medida comercial seleccionada.
 * @property umcs Lista de unidades de medida comerciales disponibles.
 * @property masa Unidad de medida de masa seleccionada.
 * @property masaBruta Lista de masas brutas disponibles.
 * @property factura Lista de facturas asociadas al trámite.
 * @property formaValida Estado de validación de los diferentes formularios.
 * @property formCertificado Formulario de información del certificado.
 * @property formDatosCertificado Formulario de datos adicionales del certificado.
 * @property mercanciaForm Formulario de información de la mercancía.
 * @property facturas Factura seleccionada actualmente.
 * @property paisBloque País o bloque económico seleccionado.
 * @property idiomaDatosSeleccion Idioma seleccionado para los datos.
 * @property idiomaDatos Lista de idiomas disponibles.
 * @property paisDestin Lista de países destino.
 * @property paisDestinSeleccion País destino seleccionado.
 * @property medioDeTransporte Lista de medios de transporte.
 * @property medioDeTransporteSeleccion Medio de transporte seleccionado.
 * @property entidadFederativaSeleccion Entidad federativa seleccionada.
 * @property entidadFederativaDatos Lista de entidades federativas disponibles.
 * @property representacionFederalDatos Lista de representaciones federales disponibles.
 * @property representacionFederalSeleccion Representación federal seleccionada.
 * @property formDestinatario Formulario con información del destinatario (ubicación y contacto).
 * @property formDatosDelDestinatario Formulario con información fiscal y general del destinatario.
 * @property destinatarioForm Formulario adicional para el destinatario.
 */
export const INITIAL_STATE: TramiteState = {
      disponiblesDatos: [],
  numeroLetra1: '',
  calle1:'',
  mercancias_disponibles: [],
  idSolicitud:0,
  mercanciaSeleccionadasTablaData: [],
  fraccionArancelaria: '',
  /** Lista de alta planta (por ejemplo, plantas de producción registradas) */
  altaPlanta: [],

  /** Lista de países o bloques económicos seleccionables */
  paisBloques: [],

  /** Resultado de búsqueda de mercancías */
  buscarMercancia: [],

  /** Lista de mercancías añadidas a la tabla */
  mercanciaTabla: [],

  /** Estado actual del trámite */
  estado: {
    id: -1,
    descripcion: '',
  },
 formTransporte: {
      medioDeTransporte: '',
    },
  /** Unidad de medida comercial seleccionada */
  umc: { id: -1, descripcion: '' },

  /** Lista de unidades de medida comerciales disponibles */
  umcs: [],

  /** Unidad de medida de masa seleccionada */
  masa: { id: -1, descripcion: '' },

  /** Lista de masas brutas disponibles */
  masaBruta: [],
  /** Lista de facturas asociadas al trámite */
  factura: [],

  /** Estado de validación de los diferentes formularios */
  formaValida: {
    certificado: true,
    datos: true,
    destinatrio: true,
    datosDestinatario: true,
  },

  /** Formulario de información del certificado */
  formCertificado: {
    entidadFederativa: '',
    bloque: '',
    nombreComercialForm: '',
    registroProductoForm: '',
    fraccionArancelariaForm: '',
    fechaInicioInput: '',
    fechaFinalInput: '',
  },

  /** Formulario de datos adicionales del certificado */
  formDatosCertificado: {
    observacionesDates: '',
    idiomaDates: '',
    precisaDates: '',
    presentaDates: '',
    EntidadFederativaDates: '',
    representacionFederalDates: '',
  },

  /** Formulario de información de la mercancía */
  mercanciaForm: {
    fraccionArancelaria: '',
    nombreComercialMercancia: '',
    nombreTecnico: '',
    nombreIngles: '',
    criterioClasificacion: '',
    marca: '',
    cantidad: '',
    umc: '',
    valorMercancia: '',
    complementoClasificacion: '',
    masaBruta: [],
    unidadMedidaMasaBruta: '',
    numeroFactura: '',
    tipoFactura: '',
    fechaFinal: '',
    normaOrigen: '',
    id: '',
    fechaFinalInput: '',
    nalad: ''
  },

  /** Factura seleccionada actualmente */
  facturas: {
    id: -1,
    descripcion: '',
  },

  /** País o bloque económico seleccionado */
  paisBloque: {
    id: -1,
    descripcion: '',
  },

  /** Idioma seleccionado para los datos */
  idiomaDatosSeleccion: { id: -1, descripcion: '' },

  /** Lista de idiomas disponibles */
  idiomaDatos: [],

  /** Lista de países destino */
  paisDestin: [],

  /** País destino seleccionado */
  paisDestinSeleccion: { id: -1, descripcion: '' },

  /** Lista de medios de transporte */
  medioDeTransporte: [],

  /** Medio de transporte seleccionado */
  medioDeTransporteSeleccion: { id: -1, descripcion: '' },

  /** Entidad federativa seleccionada */
  entidadFederativaSeleccion: { id: -1, descripcion: '' },

  /** Lista de entidades federativas disponibles */
  entidadFederativaDatos: [],

  /** Lista de representaciones federales disponibles */
  representacionFederalDatos: [],

  /** Representación federal seleccionada */
  representacionFederalSeleccion: { id: -1, descripcion: '' },

  /** Formulario con información del destinatario (ubicación y contacto) */
  formDestinatario: {
    paisDestin: '',
    ciudad: '',
    calle: '',
    numeroLetra: '',
    lada: '',
    telefono: '',
    fax: '',
    correoElectronico: ''
  },

  /** Formulario con información fiscal y general del destinatario */
  formDatosDelDestinatario: {
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    numeroDeRegistroFiscal: '',
    razonSocial: ''
  },

  /** Formulario adicional para el destinatario */
  destinatarioForm: {
    medioDeTransporte: '',
  },
  tratado:'',
  pais: '',
  numeroRegistro: '',
  nombreComercial: '',
  fechaInicial: '',
  fechaFinal: '',
  archivo: '',
  presica: '',
  presenta: '',
  idioma: '',
  entidad: '',
  representacion: '',
  apellidoPrimer: '',
  apellidoSegundo: '',
  numeroFiscal: '',
  ciudad: '',
  calle: '',
  numeroLetra: '',
  lada: '',
  telefono: '',
  fax: '',
  correoElectronico: '',
  nacion: '',
  transporte: '',
  fraccionMercanciaArancelaria: '',
  nombreTecnico: '',
  nombreEnIngles: '',
  criterioParaConferir: '',
  marca: '',
  cantidad: '',
  valorDelaMercancia: '',
  complementoDelaDescripcion: '',
  nombreComercialDelaMercancia: '',
  unidadMedida: '',
  tipoFactura: '',
  fecha: '',
  numeroFactura: '',
  justificacion: '',
  casillaVerificacion: ''
  
};

/**
 * Store de la entidad Tramite.
 * 
 * Este store se utiliza para gestionar el estado relacionado con el trámite,
 * actualizando los valores del estado mediante las funciones proporcionadas.
 * 
 * @export
 * @class TramiteStore
 * @extends {Store<TramiteState>}
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite-110202', resettable: true })
export class Tramite110202Store extends Store<TramiteState> {

constructor() {
  super(INITIAL_STATE);
}
  /**
   * Establece el estado en el almacén.
   * 
   * @param {Catalogo} estado - El estado que se va a establecer en el almacén.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setEstado(estado: Catalogo): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * Establece la lista de facturas en el estado.
   * 
   * @param factura - Lista de objetos de tipo Catalogo que representan las facturas.
   */
  setFactura(factura: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      factura,
    }));
  }
   /**
   * @method setformTransporte
   * @description
   * Actualiza los datos del formulario de transporte en el almacén.
   * @param values Objeto que contiene los valores a actualizar en el formulario de transporte.
   */
  setformTransporte(values: {
    [key: string]: undefined | boolean | string | number | object;
  }): void {
    this.update((state) => ({
      formTransporte: {
        ...state.formTransporte,
        ...values,
      },
    }));
  }

  /**
   * Establece el catálogo de UMCs en el estado de la tienda.
   *
   * @param umcs - Una lista de objetos de tipo `Catalogo` que representan las UMCs a establecer.
   */
  setUmc(umcs: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      umcs,
    }));
  }

  /**
 * Establece el catálogo de UMCs en el estado de la tienda.
 *
 * @param umc - Una lista de objetos de tipo `Catalogo` que representan las UMCs a establecer.
 */
  setUmcSeleccion(umc: Catalogo): void {
    this.update((state) => ({
      ...state,
      umc,
    }));
  }


  /**
* Establece el catálogo de masa en el estado de la tienda.
*
* @param masa - Una lista de objetos de tipo `Catalogo` que representan las masa a establecer.
*/
  setMasaBrutaSeleccion(masa: Catalogo): void {
    this.update((state) => ({
      ...state,
      masa,
    }));
  }
  /**
* Establece el catálogo de facturas en el estado de la tienda.
*
* @param facturas - Una lista de objetos de tipo `Catalogo` que representan las facturas a establecer.
*/
  setFacturasSeleccion(facturas: Catalogo): void {
    this.update((state) => ({
      ...state,
      facturas,
    }));
  }

  /**
* Establece el catálogo de idiomaDatosSeleccion en el estado de la tienda.
*
* @param idiomaDatosSeleccion - Una lista de objetos de tipo `Catalogo` que representan las idiomaDatosSeleccion a establecer.
*/
  setIdiomaSeleccion(idiomaDatosSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      idiomaDatosSeleccion,
    }));
  }


  /**
 * Establece el catálogo de masaBruta en el estado de la tienda.
 *
 * @param masaBruta - Una lista de objetos de tipo `Catalogo` que representan las masaBruta a establecer.
 */
  setMasaBruta(masaBruta: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      masaBruta,
    }));
  }

  /**
   * Establece los bloques de países en el almacén.
   * 
   * @param {Catalogo[]} paisBloques - Un array de objetos `Catalogo` que representa los bloques de países.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setBloque(paisBloques: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      paisBloques,
    }));
  }

  /**
  * Establece los bloques de países en el almacén.
  * 
  * @param {Catalogo} paisBloque - Un array de objetos `Catalogo` que representa los paisBloque de países.
  * 
  * @returns {void} - No devuelve ningún valor.
  */
  setBloqueSeleccion(paisBloque: Catalogo): void {
    this.update((state) => ({
      ...state,
      paisBloque,
    }));
  }

  /**
  * Establece los paisDestinSeleccion de países en el almacén.
  * 
  * @param {Catalogo} paisDestinSeleccion - Un array de objetos `Catalogo` que representa los paisDestinSeleccion de países.
  * 
  * @returns {void} - No devuelve ningún valor.
  */
  setPaisDestinSeleccion(paisDestinSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      paisDestinSeleccion,
    }));
  }
  /**
  * Establece los medioDeTransporteSeleccion de países en el almacén.
  * 
  * @param {Catalogo} medioDeTransporteSeleccion - Un array de objetos `Catalogo` que representa los medioDeTransporteSeleccion de países.
  * 
  * @returns {void} - No devuelve ningún valor.
  */
  setMedioDeTransporteSeleccion(medioDeTransporteSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      medioDeTransporteSeleccion,
    }));
  }


  setnumeroLetra1(numeroLetra1: string): void {
       this.update((state) => ({
      ...state,
      numeroLetra1,
    }));
  }

  /**
  * Establece los entidadFederativaSeleccion de países en el almacén.
  * 
  * @param {Catalogo} entidadFederativaSeleccion - Un array de objetos `Catalogo` que representa los entidadFederativaSeleccion de países.
  * 
  * @returns {void} - No devuelve ningún valor.
  */
  setEntidadFederativaSeleccion(entidadFederativaSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      entidadFederativaSeleccion,
    }));
  }
  /**
* Establece los representacionFederalSeleccion de países en el almacén.
* 
* @param {Catalogo} representacionFederalSeleccion - Un array de objetos `Catalogo` que representa los representacionFederalSeleccion de países.
* 
* @returns {void} - No devuelve ningún valor.
*/
  setRepresentacionFederalDatosSeleccion(representacionFederalSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      representacionFederalSeleccion,
    }));
  }

  /**
   * Establece las plantas a dar de alta en el almacén.
   * 
   * @param {Catalogo[]} altaPlanta - Un array de objetos `Catalogo` que representa las plantas a dar de alta.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setaltaPlanta(altaPlanta: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      altaPlanta,
    }));
  }

  /**
   * Establece el estado de validación del formulario en el almacén.
   * 
   * @param {Object} formaValida - Un objeto donde las claves son los nombres de los campos del formulario y los valores son booleanos que indican si el campo es válido o no.
   * 
   * @returns {void} - No devuelve ningún valor.
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
   * Establece los valores del formulario de fechas del certificado en el almacén.
   * 
   * @param {Object} values - Un objeto con las claves y valores para actualizar las fechas del certificado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setFormDatosCertificado(values: { [key: string]: unknown}): void {
    this.update((state) => ({
      formDatosCertificado: {
        ...state.formDatosCertificado,
        ...values,
      },
    }));
  }

  /**
   * Establece los valores del formulario del certificado en el almacén.
   * 
   * @param {Object} values - Un objeto con las claves y valores para actualizar el formulario del certificado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setFormCertificado(values: { [key: string]: unknown}): void {
    this.update((state) => ({
      formCertificado: {
        ...state.formCertificado,
        ...values,
      },
    }));
  }

  /**
   * Establece los valores del formulario del certificado en el almacén.
   * 
   * @param {Object} values - Un objeto con las claves y valores para actualizar el formulario del certificado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setFormCertificadoGenric(values: { [key: string]: unknown}): void {    
    this.update((state) => ({
      formCertificado: {
        ...state.formCertificado,
        ...values,
      },
    }));
  }
  /**
   * Establece los valores del formulario del certificado en el almacén.
   * 
   * @param {Object} values - Un objeto con las claves y valores para actualizar el formulario del certificado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setFormMercancia(values: { [key: string]: unknown}): void {
    this.update((state) => ({
      mercanciaForm: {
        ...state.mercanciaForm,
        ...values,
      },
    }));
  }

  /**
   * Establece el régimen de la mercancía en el almacén.
   * 
   * @param {string} regimenMercancia - El régimen de la mercancía a establecer.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  public setRegimenMercancia(regimenMercancia: string): void {
    this.update((state) => ({
      ...state,
      regimenMercancia,
    }));
  }

  /**
   * Establece la clasificación del régimen en el almacén.
   * 
   * @param {string} clasifiRegimen - La clasificación del régimen a establecer.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  public setClasifiRegimen(clasifiRegimen: string): void {
    this.update((state) => ({
      ...state,
      clasifiRegimen,
    }));
  }

  /**
   * Establece la fracción arancelaria en el almacén.
   * 
   * @param {string} fraccionArancelaria - La fracción arancelaria a establecer.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * Establece el NICO en el almacén.
   * 
   * @param {string} nico - El NICO (número de identificación comercial).
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  public setNico(nico: string): void {
    this.update((state) => ({
      ...state,
      nico,
    }));
  }

  /**
   * Establece la unidad de medida tarifaria en el almacén.
   * 
   * @param {string} unidadMedidaTarifaria - La unidad de medida tarifaria a establecer.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  public setUnidadMedidaTarifaria(unidadMedidaTarifaria: string): void {
    this.update((state) => ({
      ...state,
      unidadMedidaTarifaria,
    }));
  }

  /**
   * Establece el país de origen en el almacén.
   * 
   * @param {string} paisOrigen - El país de origen a establecer.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  public setPaisOrigen(paisOrigen: string): void {
    this.update((state) => ({
      ...state,
      paisOrigen,
    }));
  }

  /**
   * Establece el país de destino en el almacén.
   * 
   * @param {string} paisDestino - El país de destino a establecer.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  public setPaisDestino(paisDestino: string): void {
    this.update((state) => ({
      ...state,
      paisDestino,
    }));
  }

  /**
   * Establece el molino en el almacén.
   * 
   * @param {string} molino - El molino a establecer.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  public setMolino(molino: string): void {
    this.update((state) => ({
      ...state,
      molino,
    }));
  }

  /**
   * Establece la representación federal en el almacén.
   * 
   * @param {string} representacionFederal - La representación federal a establecer.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  public setRepresentacionFederal(representacionFederal: string): void {
    this.update((state) => ({
      ...state,
      representacionFederal,
    }));
  }

  /**
   * Establece los datos de la representación federal en el almacén.
   * 
   * @param {Catalogo[]} representacionFederalDatos - Un array de objetos `Catalogo` con los datos de la representación federal.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setRepresentacionFederalDatos(representacionFederalDatos: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      representacionFederalDatos,
    }));
  }

  /**
   * Establece los datos de la entidad federativa en el almacén.
   * 
   * @param {Catalogo[]} entidadFederativaDatos - Un array de objetos `Catalogo` con los datos de la entidad federativa.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setEntidadFederativaDatos(entidadFederativaDatos: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      entidadFederativaDatos,
    }));
  }

  /**
   * Establece los datos del idioma en el almacén.
   * 
   * @param {Catalogo[]} idiomaDatos - Un array de objetos `Catalogo` con los datos del idioma.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  public setIdiomaDatos(idiomaDatos: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      idiomaDatos,
    }));
  }

  /**
    * Establece los datos de la mercancía a buscar en el almacén.
    * 
    * @param {Mercancia[]} buscarMercancia - Un array de objetos `Mercancia` con la información de la mercancía a buscar.
    * 
    * @returns {void} - No devuelve ningún valor.
    */
  setbuscarMercancia(buscarMercancia: Mercancia[]): void {
    this.update((state) => ({
      ...state,
      buscarMercancia,
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
   * @method setmercanciaTabla
   * @description
   * Actualiza la tabla de mercancías en el almacén.
   * @param mercanciaTabla Array de objetos `Mercancia` que representa la tabla de mercancías.
   */
  public setmercanciaTabla(mercanciaTabla: Mercancia[]): void {
    this.update((STATE) => {
      const LISTAEXISTENTE = STATE.mercanciaTabla || [];
      const NUEVOARTICULO = { ...mercanciaTabla[0] };

      if (NUEVOARTICULO.id === 0) {
        // Agregar nuevo elemento con una identificación generada
        NUEVOARTICULO.id = (LISTAEXISTENTE.length || 0) + 1;
        const UPDATEDLIST = [...LISTAEXISTENTE, NUEVOARTICULO];
        return { ...STATE, mercanciaTabla: UPDATEDLIST };
      }

      // Actualizar el elemento existente cuando id > 0
      const UPDATEDLIST = LISTAEXISTENTE.map((ITEM) =>
        ITEM.id === NUEVOARTICULO.id ? { ...ITEM, ...NUEVOARTICULO } : ITEM
      );
      return { ...STATE, mercanciaTabla: UPDATEDLIST };
    });
  }

  /**
   * Actualiza el estado con la lista de países de destino
   * @param paisDestin Arreglo de catálogos con los países de destino
   */
  public setPaisDestinatario(paisDestin: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      paisDestin,
    }));
  }

  /**
   * Actualiza el estado con la lista de medios de transporte
   * @param medioDeTransporte Arreglo de catálogos con los medios de transporte
   */
  setMedioDeTransporte(medioDeTransporte: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      medioDeTransporte,
    }));
  }

  /**
   * Actualiza el estado del formulario de destinatario con nuevos valores
   * @param values Objeto con los valores a actualizar en el formulario.
   */
  setDestinatarioForm(values: { [key: string]: unknown}): void {
    this.update((state) => ({
      destinatarioForm: {
        ...state.destinatarioForm,
        ...values,
      },
    }));
  }

  /**
   * Actualiza el estado del formulario de destinatario (sección principal) con nuevos valores
   * @param values Objeto con los valores a actualizar en el formulario.
   */
  setFormDestinatario(values: { [key: string]: unknown}): void {
    this.update((state) => ({
      formDestinatario: {
        ...state.formDestinatario,
        ...values,
      },
    }));
  }

  /**
   * Actualiza el estado del formulario de datos del destinatario con nuevos valores
   * @param values Objeto con los valores a actualizar en el formulario.
   */
  setFormDatosDelDestinatario(values: { [key: string]: unknown}): void {
    this.update((state) => ({
      formDatosDelDestinatario: {
        ...state.formDatosDelDestinatario,
        ...values,
      },
    }));
  }
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

 public setMercanciaTabla(mercanciaTabla: ColumnasTabla[]): void {
    this.update((state) => {

      const EXISTING_LIST = state.mercancias_disponibles ?? [];

      const UPDATED_LIST = [...EXISTING_LIST];

      for (const NEW_DEST of mercanciaTabla) {
        const INDEX = EXISTING_LIST.findIndex(
          (existing) => existing.id === NEW_DEST.id
        );

        if (INDEX !== -1) {
          UPDATED_LIST[INDEX] = NEW_DEST;
        } else {
          UPDATED_LIST.push(NEW_DEST);
        }
      }

      return {
        ...state,
        mercancias_disponibles: UPDATED_LIST,
      };
    });
  }
    /**
   * Actualiza los datos de la solicitud en el estado.
   * @param {DatosMercancia[]} mercanciaDatos - Lista de datos de la solicitud.
   */
  public setDatosMercancia(mercanciaSeleccionadasTablaData: SeleccionadasTabla[]): void {
    this.update((state) => ({
      ...state,
      mercanciaSeleccionadasTablaData,
    }));
  }
  /**
   * Establece el catálogo de tratados.
   * @param tratado Lista de objetos de tipo `Catalogo`.
   */
  public setTratado(tratado: string):void {
    this.update((state) => ({
      ...state,
      tratado,
    }));
  }
 /**
   * Establece el catálogo de tratados.
   * @param tratado Lista de objetos de tipo `Catalogo`.
   */
  public setCall1(calle1: string):void {
    this.update((state) => ({
      ...state,
      calle1,
    }));
  }
   /**
   * Establece el catálogo de tratados.
   * @param tratado Lista de objetos de tipo `Catalogo`.
   */
  public setNumeroLetra1(numeroLetra1: string):void {
    this.update((state) => ({
      ...state,
      numeroLetra1,
    }));
  }
  public setTratadoDescripciones(tratadoDescripcion: string):void {
    this.update((state) => ({
      ...state,
      tratadoDescripcion,
    }));
  }

  public setPaisDescripcion(paisDescripcion: string):void {
    this.update((state) => ({
      ...state,
      paisDescripcion,
    }));
  }

  public setUmcDescripcion(umcDescripcion: string): void {
    this.update((state) => ({
      ...state,
      umcDescripcion,
    }));
  }
  public setTipoFacturaDescripcion(tipoFacturaDescripcion: string): void {
    this.update((state) => ({
      ...state,
      tipoFacturaDescripcion,
    }));
  }
  public setUnidadMedidaDescripcion(unidadMedidaDescripcion: string): void {
    this.update((state) => ({
      ...state,
      unidadMedidaDescripcion,
    }));
  }
  
  public setIdiomaDescripcion(idiomaDescripcion: string):void {
    this.update((state) => ({
      ...state,
      idiomaDescripcion,
    }));
  }
  public setEntidadDescripcion(entidadDescripcion: string):void {
    this.update((state) => ({
      ...state,
      entidadDescripcion,
    }));
  }
  public setRepresentacionDescripcion(representacionDescripcion: string):void {
    this.update((state) => ({
      ...state,
      representacionDescripcion,
    }));
  }
  
  public setNacionDescripcion(nacionDescripcion: string):void {
    this.update((state) => ({
      ...state,
      nacionDescripcion,
    }));
  }
  public setTransporteDescripcion(transporteDescripcion: string):void {
    this.update((state) => ({
      ...state,
      transporteDescripcion,
    }));
  }

  /**
   * Establece el catálogo de países.
   * @param pais Lista de objetos de tipo `Catalogo`.
   */
  public setPais(pais: string):void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }

  /**
   * Establece la fracción arancelaria de la mercancía.
   * @param fraccionMercanciaArancelaria Cadena que representa la fracción arancelaria de la mercancía.
   */
  public setfraccionMercanArancelaria(fraccionMercanciaArancelaria: string):void {
    this.update((state) => ({
      ...state,
      fraccionMercanciaArancelaria,
    }));
  }
  /**
   * Establece el nombre técnico de la mercancía.
   * @param nombreTecnico Cadena que representa el nombre técnico.
   */
  public setnombretecnico(nombreTecnico: string):void {
    this.update((state) => ({
      ...state,
      nombreTecnico,
    }));
  }
  /**
   * Establece el nombre en inglés de la mercancía.
   * @param nombreEnIngles Cadena que representa el nombre en inglés.
   */
  public setnomreeningles(nombreEnIngles: string):void {
    this.update((state) => ({
      ...state,
      nombreEnIngles,
    }));
  }
  /**
   * Establece el criterio para conferir origen.
   * @param criterioParaConferir Cadena que representa el criterio para conferir origen.
   */
  public setcriterioparaconferir(criterioParaConferir: string):void {
    this.update((state) => ({
      ...state,
      criterioParaConferir,
    }));
  }
  /**
   * Establece la marca de la mercancía.
   * @param marca Cadena que representa la marca.
   */
  public setmarca(marca: string):void {
    this.update((state) => ({
      ...state,
      marca,
    }));
  }
  /**
   * Establece la cantidad de la mercancía.
   * @param cantidad Cadena que representa la cantidad.
   */
  public setcantidad(cantidad: string):void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }
  /**
   * Establece el catálogo de unidades de medida comercial (UMC).
   * @param umc Lista de objetos de tipo `Catalogo`.
   */
  public setUMC(umc: Catalogo):void {
    this.update((state) => ({
      ...state,
      umc,
    }));
  }
  /**
   * Establece el catálogo de unidades de medida.
   * @param unidadMedida Lista de objetos de tipo `Catalogo`.
   */
  public setUnidadMedida(unidadMedida: string):void {
    this.update((state) => ({
      ...state,
      unidadMedida,
    }));
  }
  /**
   * Establece el catálogo de tipos de factura.
   * @param tipoFactura Lista de objetos de tipo `Catalogo`.
   */
  public setTipoFactura(tipoFactura: string):void {
    this.update((state) => ({
      ...state,
      tipoFactura,
    }));
  }
  /**
   * Establece la fecha de la factura.
   * @param fecha Cadena que representa la fecha.
   */
  public setFecha(fecha: string):void {
    this.update((state) => ({
      ...state,
      fecha,
    }));
  }
  /**
   * Establece el número de factura.
   * @param numeroFactura Cadena que representa el número de factura.
   */
  public setNFactura(numeroFactura: string):void {
    this.update((state) => ({
      ...state,
      numeroFactura,
    }));
  }
  /**
   * Establece la justificación.
   * @param justificacion Cadena que representa la justificación.
   */
  public setJustificacion(justificacion: string):void {
    this.update((state) => ({
      ...state,
      justificacion,
    }));
  }
  /**
   * Establece el catálogo de transporte.
   * @param valorDelaMercancia Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setvalordelamercancia(valorDelaMercancia: string):void {
    this.update((state) => ({
      ...state,
      valorDelaMercancia,
    }));
  }
  /**
   * Establece el valor de la casilla de verificación.
   * @param complementoDelaDescripcion Cadena que representa el valor de la casilla.
   */
  public setcomplementodeladescripcion(complementoDelaDescripcion: string):void {
    this.update((state) => ({
      ...state,
      complementoDelaDescripcion,
    }));
  }
  /**
   * Establece el valor de la masa bruta de la mercancía.
   * @param masaBruta Cadena que representa la masa bruta.
   */
  public setmasabruta(masaBruta: Catalogo[]):void {
    this.update((state) => ({
      ...state,
      masaBruta,
    }));
  }
  /**
   * Establece el nombre comercial de la mercancía.
   * @param nombreComercialDelaMercancia Cadena que representa el nombre comercial de la mercancía.
   */
  public setnombrecomercialdelamercancia(nombreComercialDelaMercancia: string):void {
    this.update((state) => ({
      ...state,
      nombreComercialDelaMercancia,
    }));
  }
  /**
   * Establece el número de registro.
   * @param numeroRegistro Cadena que representa el número de registro.
   */
  public setNumRegistro(numeroRegistro: string):void {
    this.update((state) => ({
      ...state,
      numeroRegistro,
    }));
  }
  /**
   * Establece el nombre comercial.
   * @param nombreComercial Cadena que representa el nombre comercial.
   */
  public setNomComercial(nombreComercial: string):void {
    this.update((state) => ({
      ...state,
      nombreComercial,
    }));
  }
  /**
   * Establece la fecha de inicio del bloque.
   * @param fechaInicial Cadena que representa la fecha de inicio del bloque.
   */
  public setFechInicioB(fechaInicial: string):void {
    this.update((state) => ({
      ...state,
      fechaInicial,
    }));
  }
  /**
   * Establece la fecha de fin del bloque.
   * @param fechaFinal Cadena que representa la fecha de fin del bloque.
   */
  public setFechFinB(fechaFinal: string):void {
    this.update((state) => ({
      ...state,
      fechaFinal,
    }));
  }
  /**
   * Establece el archivo adjunto.
   * @param archivo Cadena que representa el archivo adjunto.
   */
  public setArchivo(archivo: string):void {
    this.update((state) => ({
      ...state,
      archivo,
    }));
  }
  /**
   * Establece las observaciones.
   * @param observaciones Cadena que representa las observaciones.
   */
  public setObservaciones(observaciones: string):void {
    this.update((state) => ({
      ...state,
      observaciones,
    }));
  }
  /**
   * Establece el valor de presica.
   * @param presica Cadena que representa el valor de presica.
   */
  public setPresica(presica: string):void {
    this.update((state) => ({
      ...state,
      presica,
    }));
  }
  /**
   * Establece el valor de presenta.
   * @param presenta Cadena que representa el valor de presenta.
   */
  public setPresenta(presenta: string):void {
    this.update((state) => ({
      ...state,
      presenta,
    }));
  }
  /**
   * Establece el catálogo de idiomas.
   * @param idioma Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setIdioma(idioma: string):void {
    this.update((state) => ({
      ...state,
      idioma,
    }));
  }
  /**
   * Establece el catálogo de entidades.
   * @param entidad Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setEntidad(entidad: string):void {
    this.update((state) => ({
      ...state,
      entidad,
    }));
  }
  /**
   * Establece el catálogo de representaciones.
   * @param representacion Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setRepresentacion(representacion: string):void {
    this.update((state) => ({
      ...state,
      representacion,
    }));
  }
  /**
   * Establece el nombre del solicitante.
   * @param nombre Cadena que representa el nombre del solicitante.
   */
  public setNombre(nombre: string):void {
    this.update((state) => ({
      ...state,
      nombre,
    }));
  }
  /**
   * Establece el primer apellido del solicitante.
   * @param apellidoPrimer Cadena que representa el primer apellido del solicitante.
   */
  public setApellidoPrimer(apellidoPrimer: string):void {
    this.update((state) => ({
      ...state,
      apellidoPrimer,
    }));
  }
  /**
   * Establece el segundo apellido del solicitante.
   * @param apellidoSegundo Cadena que representa el segundo apellido del solicitante.
   */
  public setApellidoSegundo(apellidoSegundo: string):void {
    this.update((state) => ({
      ...state,
      apellidoSegundo,
    }));
  }
  /**
   * Establece el número fiscal del solicitante.
   * @param numeroFiscal Cadena que representa el número fiscal del solicitante.
   */
  public setNumeroFiscal(numeroFiscal: string):void {
    this.update((state) => ({
      ...state,
      numeroFiscal,
    }));
  }
  /**
   * Establece la razón social.
   * @param razonSocial Cadena que representa la razón social.
   */
  public setRazonSocial(razonSocial: string):void {
    this.update((state) => ({
      ...state,
      razonSocial,
    }));
  }
  /**
   * Establece la ciudad del solicitante.
   * @param ciudad Cadena que representa la ciudad del solicitante.
   */
  public setCiudad(ciudad: string):void {
    this.update((state) => ({
      ...state,
      ciudad,
    }));
  }
  /**
   * Establece la calle del solicitante.
   * @param calle Cadena que representa la calle del solicitante.
   */
  public setCalle1(calle1: string):void {
    this.update((state) => ({
      ...state,
      calle1,
    }));
  }
  /**
   * Establece el número o letra de la dirección del solicitante.
   * @param numeroLetra Cadena que representa el número o letra de la dirección.
   */
  public setNumeroLetra(numeroLetra: string):void {
    this.update((state) => ({
      ...state,
      numeroLetra,
    }));
  }
  /**
   * Establece la lada del número telefónico.
   * @param lada Cadena que representa la lada.
   */
  public setLada(lada: string):void {
    this.update((state) => ({
      ...state,
      lada,
    }));
  }
  /**
   * Establece el número telefónico.
   * @param telefono Cadena que representa el número telefónico.
   */
  public setTelefono(telefono: string):void {
    this.update((state) => ({
      ...state,
      telefono,
    }));
  }
  /**
   * Establece el número de fax.
   * @param fax Cadena que representa el número de fax.
   */
  public setFax(fax: string):void {
    this.update((state) => ({
      ...state,
      fax,
    }));
  }
  /**
   * Establece el correo electrónico.
   * @param correoElectronico Cadena que representa el correo electrónico.
   */
  public setCorreoElectronico(correoElectronico: string):void {
    this.update((state) => ({
      ...state,
      correoElectronico,
    }));
  }
  /**
   * Establece el catálogo de naciones.
   * @param nacion Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setNacion(nacion: string):void {
    this.update((state) => ({
      ...state,
      nacion,
    }));
  }
  /**
   * Establece el catálogo de transportes.
   * @param transporte Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setTransporte(transporte: string):void {
    this.update((state) => ({
      ...state,
      transporte,
    }));
  }
  /**
   * Establece el valor de la casilla de verificación.
   * @param casillaVerificacion Cadena que representa el valor de la casilla.
   */
  public setCheckbox(casillaVerificacion: string):void {
    this.update((state) => ({
      ...state,
      casillaVerificacion,
    }));
  }

  /**
   * Limpia los datos de la solicitud
   */
  public limpiarSolicitud():void {
    this.reset();
  }
}

