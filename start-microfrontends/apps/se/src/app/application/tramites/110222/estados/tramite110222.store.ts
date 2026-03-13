import { GrupoRepresentativo, HistoricoColumnas, MercanciaTabla } from '../models/peru-certificado.module';
import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@ng-mf/data-access-user';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../../shared/models/modificacion.enum';

/**
 * @interface Tramite110222State
 * Interfaz que define el estado global del trámite 110222 para el certificado zoosanitario.
 * Contiene todas las propiedades y formularios requeridos en el flujo del trámite, así como los datos y banderas de validación.
 * 
 */
export interface Tramite110222State {
  /** Tratado asociado al trámite */
  tratado?: string;
  /** País asociado al trámite */
  pais?: string;
  /** ID de la solicitud */
  idSolicitud?: number | null;

  /**
   * @property {Object} formCertificado - Datos del formulario principal de certificado.
   * @description
   * Contiene información básica del certificado, como entidad federativa, bloque, nombre comercial, registro de producto, fracción arancelaria y fechas.
   */
  formCertificado?: { [key: string]: unknown };
  /**
   * @property {Catalogo} estado - Estado seleccionado.
   * @description
   * Representa el estado actual del trámite, utilizado para filtrar y seleccionar opciones en el formulario.
   */
  estado?: Catalogo;
  /**
   * @property {Catalogo[]} paisBloques - Bloques de países seleccionados.
   * @description
   * Lista de bloques de países que se pueden seleccionar en el formulario, representados como objetos `Catalogo`.
   */
  paisBloques?: Catalogo;
  /**
   * @property {Object} mercanciaForm - Datos del formulario de mercancía.
   * @description
   * Contiene información específica de la mercancía, como fracción arancelaria, nombre comercial, técnico e inglés, descripción, criterios de trato preferencial, valor regional, número de serie, cantidad y unidad de medida.
   */
  mercanciaForm?: { [key: string]: unknown };
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
  formDatosCertificado?: { [key: string]: unknown };
  /**
   * @property {Catalogo} idiomaDatosSeleccion - Idioma seleccionado.
   * @description
   * Representa el idioma en el que se generará el certificado, utilizado para la presentación del documento.
   */
  idiomaDatosSeleccion?: Catalogo;
  /**
   * @property {Catalogo} entidadFederativaSeleccion - Entidad federativa seleccionada.
   * @description
   * Representa la entidad federativa donde se llevará a cabo el trámite, utilizada para filtrar opciones en el formulario.
   */
  entidadFederativaSeleccion?: Catalogo;
  /**
   * @property {Catalogo} representacionFederalSeleccion - Representación federal seleccionada.
   * @description
   * Representa la representación federal asociada al trámite, utilizada para la validación y presentación del certificado.
   */
  representacionFederalSeleccion?: Catalogo;
  /**
   * @property {Object} formDatosDelDestinatario - Datos del destinatario.
   * @description
   * Contiene información del destinatario del certificado, como nombres, apellidos, número de registro fiscal y razón social.
   */
  formDatosDelDestinatario?: { [key: string]: unknown };
  /**
   * @property {Object} formExportor - Datos del exportador.
   * @description
   * Contiene información del exportador, como lugar, nombre de la empresa, cargo, lada, teléfono, fax y correo electrónico.
   */
  formExportor?: { [key: string]: unknown };

  /** @property {string} fraccionArancelaria - Fracción arancelaria seleccionada. */
  grupoRepresentativo?: GrupoRepresentativo;

  /**
   * @property {string} fraccionArancelaria - Fracción arancelaria seleccionada.
   * @description
   * Representa la fracción arancelaria de la mercancía, utilizada para clasificar y determinar aranceles.
   */
  fraccionArancelaria?: string;
  /**
   * @property {string} nombreComercialMercancia - Nombre comercial de la mercancía.
   * @description
   * Nombre comercial utilizado para identificar la mercancía en el trámite.
   */
  nombreComercialMercancia?: string;
  /**
   * @property {string} nombreTecnico - Nombre técnico de la mercancía.
   * @description
   * Nombre técnico utilizado para describir la mercancía de manera precisa.
   */
  nombreTecnico?: string;
  /**
   * @property {string} nombreIngles - Nombre en inglés de la mercancía.
   * @description
   * Nombre de la mercancía en inglés, utilizado para trámites internacionales.
   */
  nombreIngles?: string;
  /**
   * @property {string} complementoDescripcion - Complemento de la descripción.
   * @description
   * Descripción adicional de la mercancía, utilizada para proporcionar más detalles en el certificado.
   */
  complementoDescripcion?: string;
  /**
   * @property {string} criterioParaTratoPreferencial - Criterio para trato preferencial.
   * @description
   * Criterio que determina si la mercancía califica para un trato preferencial en términos arancelarios.
   */
  criterioParaTratoPreferencial?: string;
  /**
   * @property {string} valorDeContenidoRegional - Valor de contenido regional.
   * @description
   * Representa el valor del contenido regional de la mercancía, utilizado para determinar su origen.
   */
  valorDeContenidoRegional?: string;
  /**
   * @property {string} numeroDeSerie - Número de serie de la mercancía.
   * @description
   * Número de serie único asignado a la mercancía, utilizado para su identificación.
   */
  numeroDeSerie?: string;
  /**
   * @property {string} cantidad - Cantidad de mercancía.
   * @description
   * Cantidad total de la mercancía registrada en el trámite, utilizada para fines de control y validación.
   */
  cantidad?: string;
  /**
   * @property {Catalogo[]} umc - Unidades de medida y cantidad.
   * @description
   * Lista de unidades de medida y cantidad asociadas a la mercancía, representadas como objetos `Catalogo`.
   */
  umc?: Catalogo[];
  /**
   * @property {string} valorMercancia - Valor de la mercancía.
   * @description
   * Valor monetario asignado a la mercancía, utilizado para fines fiscales y comerciales.
   */
  valorMercancia?: string;
  /**
   * @property {string} complementoClasificacion - Complemento de clasificación.
   * @description
   * Información adicional sobre la clasificación de la mercancía, utilizada para su correcta identificación.
   */
  complementoClasificacion?: string;
  /**
   * @property {string} numeroFactura - Número de factura.
   * @description
   * Número de la factura asociada a la mercancía, utilizado para su identificación y validación.
   */
  numeroFactura?: string;
  /**
   * @property {Catalogo[]} tipoFactura - Tipos de factura.
   * @description
   * Lista de tipos de factura disponibles, representados como objetos `Catalogo`, utilizados para clasificar la mercancía.
   */
  tipoFactura?: Catalogo[];
  /**
   * @property {Object} formaValida - Estado de validación de los formularios.
   * @description
   * Contiene banderas que indican si cada sección del formulario es válida, como certificado, datos, destinatario y exportador.
   */
  formaValida?: { [key: string]: boolean };
  /**
   * @property {Object} formDestinatario - Datos del formulario de destinatario.
   * @description
   * Contiene información del destinatario del certificado, como país, ciudad, número de teléfono, fax y correo electrónico.
   */
  formDestinatario?: { [key: string]: unknown };
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
  agregarDatosProductorFormulario?: { [key: string]: unknown };
  /**
   * @property {Object} formulario - Otros datos de formularios auxiliares.
   * @description
   * Contiene otros datos relevantes para el trámite, como datos confidenciales del productor y si el productor es el mismo exportador.
   */
  formulario?: { [key: string]: unknown };

  /** Opciones disponibles para el tipo de factura en el formulario, provenientes del catálogo correspondiente. */
  optionsTipoFactura?: Catalogo[];

  /** Lista de idiomas disponibles como catálogo */
  idiomaDatos?: Catalogo[];

  /** Lista de entidades federativas disponibles */
  entidadFederativaDatos?: Catalogo[];

  /** Lista de representaciones federales disponibles */
  representacionFederalDatos?: Catalogo[];
  /** Lista de productores agregados al exportador */
  agregarProductoresExportador?: HistoricoColumnas[];
  /** Lista de mercancías asociadas a los productores */
  mercanciaProductores?: MercanciaTabla[];
  /** Lista de mercancías disponibles */
  disponiblesDatos?: Mercancia[];
  /**
   * @property {HistoricoColumnas[]} productoresExportador
   * @description Lista de productores asociados al exportador.
   */
  productoresExportador?: HistoricoColumnas[];
  /** Validez de los formularios individuales */
  formValidity?: {
    datosCertificado?: boolean;
    destinatario?: boolean;
    histProductores?: boolean;
    certificadoOrigen?: boolean;
  };
   bloque:Catalogo,
}

/**
 * asegurando que el estado comience limpio y sin datos previos.
 * @method createInitialState
 * @function createInitialState
 * @descripcion
 * Función que crea y retorna el estado inicial del store Tramite110222Store para el certificado zoosanitario.
 * Inicializa todas las propiedades y formularios requeridos en el flujo del trámite con valores por defecto,
 * 
 * 
 * @returns {Tramite110222State} Estado inicializado para el store del trámite 110222.
 */
export function createInitialState(): Tramite110222State {
  return {
    tratado: '',
    pais: '',
    idSolicitud: 0,
    formCertificado: {
      si: false,
      entidadFederativa: '',
      bloque: '',
      nombreComercialForm: '',
      registroProductoForm: '',
      fraccionArancelariaForm: '',
      fechaInicioInput: '',
      fechaFinalInput: '',
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      numeroDeRegistroFiscal: '',
      razonSocial: '',
      pais: '',
      ciudad: '',
      telefono: '',
      correoElectronico: '',
      numeroLetra: '',
      calle: '',
      correo: '',
      fax: ''
    },
    estado: {
      id: -1,
      descripcion: '',
    },
    paisBloques: { id: -1, descripcion: '' },
    mercanciaForm: {
      fraccionArancelaria: '',
      nombreComercialMercancia: '',
      nombreTecnico: '',
      nombreIngles: '',
      complementoDescripcion: '',
      criterioParaTratoPreferencial: '',
      valorDeContenidoRegional: '',
      numeroDeSerie: '',
      marca: '',
      cantidad: '',
      umc: '',
      valorMercancia: '',
      complementoClasificacion: '',
      masaBruta: '',
      unidadMedidaMasaBruta: '',
      numeroFactura: '',
      tipoFactura: '',
      fechaFinal: '',
      normaOrigen: '',
      id: '',
      fechaFinalInput: '',
      nalad: '',
    },
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
    formDatosDelDestinatario: {
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      numeroDeRegistroFiscal: '',
      registroFiscal: '',
      razonSocial: '',
    },
    fraccionArancelaria: '',
    nombreComercialMercancia: '',
    nombreTecnico: '',
    nombreIngles: '',
    complementoDescripcion: '',
    criterioParaTratoPreferencial: '',
    valorDeContenidoRegional: '',
    numeroDeSerie: '',
    cantidad: '',
    umc: [],
    valorMercancia: '',
    complementoClasificacion: '',
    numeroFactura: '',
    tipoFactura: [],
    formExportor: {
      lugar: '',
      nombreExportador: '',
      empresa: '',
      cargo: '',
      lada: '',
      telefono: '',
      fax: '',
      correoElectronico: '',
    },
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
    formaValida: {
      certificado: false,
      datos: false,
      destinatrio: false,
      datosDestinatario: false,
      exportador: false,
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
    formulario: {
      datosConfidencialesProductor: '',
      productorMismoExportador: '',
    },
    agregarDatosProductorFormulario: {
      numeroRegistroFiscal: '',
      fax: '',
    },
    optionsTipoFactura: [],
    idiomaDatos: [],
    entidadFederativaDatos: [],
    agregarProductoresExportador: [],
    representacionFederalDatos: [],
    mercanciaProductores: [],
    disponiblesDatos: [],
    productoresExportador: [],
    formValidity: {},
   bloque:{ id: -1, descripcion: '' }
  };
  
}

/**
 * @descripcion
 * Store encargado de gestionar el estado global del trámite 110222 para el certificado zoosanitario.
 * Permite actualizar y consultar los datos de los diferentes formularios y secciones del trámite,
 * así como el estado de validación de cada uno de ellos.
 * Utiliza Akita para la gestión reactiva del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'Tramite110222Store', resettable: true })
export class Tramite110222Store extends Store<Tramite110222State> {
  /**
   * @descripcion
   * Constructor que inicializa el almacén con el estado inicial.
   */
  constructor() {
    super(createInitialState());
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

  /**
   * @descripcion
   * Actualiza los datos del formulario de certificado.
   * @param values - Valores a actualizar en el formulario.
   */
  setFormCertificado(values: { [key: string]: unknown }): void {
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
  setFormHistorico(values: {
    [key: string]: undefined | boolean | string | number | object;
  }): void {
    this.update((state) => ({
      formulario: {
        ...state.formulario,
        ...values,
      },
    }));
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario de productor.
   * @param values - Valores a actualizar en el formulario.
   */
  setAgregarFormDatosProductor(values: {
    [key: string]: string | number | boolean | null;
  }): void {
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
   * @descripcion
   * Actualiza los bloques de países en el almacén.
   * @param paisBloques - Array de objetos `Catalogo` que representa los bloques de países.
   */
  setBloque(paisBloques: Catalogo): void {
    this.update((state) => ({
      ...state,
      paisBloques,
    }));
  }

  /**
   * @descripcion
   * Actualiza los bloques de países en el almacén.
   * @param bloque - Array de objetos `Catalogo` que representa los bloques de países.
   */
  setBloques(bloque: Catalogo): void {
    this.update((state) => ({
      ...state,
      bloque,
    }));
  }
  /**
   * @descripcion
   * Actualiza los datos del formulario de mercancía en el almacén.
   * @param values - Objeto que contiene los valores a actualizar en el formulario de mercancía.
   */
  setFormMercancia(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      mercanciaForm: {
        ...state.mercanciaForm,
        ...values,
      },
    }));
  }

  /**
   * @descripcion
   * Actualiza la tabla de mercancías en el almacén.
   * @param mercanciaTabla - Array de objetos `Mercancia` que representa la tabla de mercancías.
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
      const UPDATEDLIST = mercanciaTabla.map((ITEM) =>
        ITEM.id === NUEVOARTICULO.id ? { ...ITEM, ...NUEVOARTICULO } : ITEM
      );
      return { ...STATE, mercanciaTabla: UPDATEDLIST };
    });
  }

  /**
    * Establece los resultados de mercancía obtenidos por búsqueda.
    * @param buscarMercancia Lista de resultados de tipo `Mercancia`.
    */
  setbuscarMercancia(buscarMercancia: Mercancia[]): void {
    this.update((state) => ({ ...state, buscarMercancia }));
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario de certificado en el almacén.
   * @param values - Objeto que contiene los valores a actualizar en el formulario de certificado.
   */
  setFormDatosCertificado(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      formDatosCertificado: {
        ...state.formDatosCertificado,
        ...values,
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
   * Actualiza los datos del formulario de destinatario en el almacén.
   * @param values - Objeto que contiene los valores a actualizar en el formulario de destinatario.
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
   * @descripcion
   * Actualiza los datos del formulario de exportador en el almacén.
   * @param values - Objeto que contiene los valores a actualizar en el formulario de exportador.
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
   * Actualiza el número de umc en el almacén.
   * @param umc - Arreglo de objetos `Catalogo` que representa el número de umc a actualizar.
   */
  setUmc(umc: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      umc,
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
   * Actualiza el número de tipoFactura en el almacén.
   * @param tipoFactura - Arreglo de objetos `Catalogo` que representa el número de tipoFactura a actualizar.
   */
  setTipoFactura(tipoFactura: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      tipoFactura,
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
   * @descripcion
   * Actualiza los datos del formulario de destinatario en el almacén.
   * @param values - Objeto que contiene los valores a actualizar en el formulario de destinatario.
   */
  setFormDestinatario(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      formDestinatario: {
        ...state.formDestinatario,
        ...values,
      },
    }));
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario de certificado de manera genérica.
   * @param values - Objeto que contiene los valores a actualizar en el formulario de certificado.
   */
  setFormCertificadoGenric(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      formCertificado: {
        ...state.formCertificado,
        ...values,
      },
    }));
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
  * Actualiza el lugar en el grupo representativo.
  *
  * Este método permite establecer el lugar en el grupo representativo del trámite.
  *
  * @param {string} lugar - El lugar a establecer.
  */
  // public setGrupoRepresentativoLugar(lugar: string): void {
  //   this.update((state) => ({
  //     ...state,
  //     grupoRepresentativo: { ...state.grupoRepresentativo, lugar },
  //   }));
  // }
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
   * Actualiza el nombre del exportador en el grupo representativo.
   *
   * Este método permite establecer el nombre del exportador en el grupo representativo del trámite.
   *
   * @param {string} nombre - El nombre del exportador a establecer.
   */
  // public setGrupoRepresentativoNombreExportador(
  //   nombre: string
  // ): void {
  //   this.update((state) => ({
  //     ...state,
  //     grupoRepresentativo: { ...state.grupoRepresentativo, nombre },
  //   }));
  // }
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
   * Actualiza la empresa en el grupo representativo.
   *
   * Este método permite establecer la empresa en el grupo representativo del trámite.
   *
   * @param {string} empresa - La empresa a establecer.
   */
  // public setGrupoRepresentativoEmpresa(empresa: string): void {
  //   this.update((state) => ({
  //     ...state,
  //     grupoRepresentativo: { ...state.grupoRepresentativo, empresa },
  //   }));
  // }
  /**
   * Actualiza el cargo en el grupo representativo.
   *
   * Este método permite establecer el cargo en el grupo representativo del trámite.
   *
   * @param {string} cargo - El cargo a establecer.
   */
  // public setGrupoRepresentativoCargo(cargo: string): void {
  //   this.update((state) => ({
  //     ...state,
  //     grupoRepresentativo: { ...state.grupoRepresentativo, cargo },
  //   }));
  // }

  /**
   * Actualiza la lada en el grupo representativo.
   *
   * Este método permite establecer la lada en el grupo representativo del trámite.
   *
   * @param {string} lada - La lada a establecer.
   */
  // public setGrupoRepresentativo(grupoRepresentativo: GrupoRepresentativo): void {
  //   this.update((state) => ({
  //     ...state,
  //     grupoRepresentativo: { ...state.grupoRepresentativo, lada },
  //   }));
  // }
 
  // public setGrupoRepresentativoRegistroFiscal(registroFiscal: string): void {
  //   this.update((state) => ({
  //     ...state,
  //     grupoRepresentativo: { ...state.grupoRepresentativo, registroFiscal },
  //   }));
  // }

  /**
   * Actualiza el teléfono en el grupo representativo.
   *
   * Este método permite establecer el teléfono en el grupo representativo del trámite.
   *
   * @param {string} telefono - El teléfono a establecer.
   */
  // public setGrupoRepresentativoTelefono(telefono: string): void {
  //   this.update((state) => ({
  //     ...state,
  //     grupoRepresentativo: { ...state.grupoRepresentativo, telefono },
  //   }));
  // }

  /**
   * Actualiza el fax en el grupo representativo.
   *
   * Este método permite establecer el fax en el grupo representativo del trámite.
   *
   * @param {string} fax - El fax a establecer.
   */
  // public setGrupoRepresentativoFax(fax: string): void {
  //   this.update((state) => ({
  //     ...state,
  //     grupoRepresentativo: { ...state.grupoRepresentativo, fax },
  //   }));
  // }

  /**
   * Actualiza el correo electrónico en el grupo representativo.
   *
   * Este método permite establecer el correo electrónico en el grupo representativo del trámite.
   *
   * @param {string} correoElectronico - El correo electrónico a establecer.
   */
  // public setGrupoRepresentativoCorreoElectronico(
  //   correo: string
  // ): void {
  //   this.update((state) => ({
  //     ...state,
  //     grupoRepresentativo: { ...state.grupoRepresentativo, correo },
  //   }));
  // }
  public setGrupoRepresentativo(
    grupoRepresentativo: GrupoRepresentativo
  ): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo,
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
 * Establece los resultados de mercancía obtenidos por búsqueda.
 * @param buscarMercancia Lista de resultados de tipo `Mercancia`.
 */
  setProductores(productores: HistoricoColumnas[]): void {
    this.update((state) => ({ ...state, productores }));
  }

  /**
   * Agrega un productor exportador al arreglo correspondiente en el estado del trámite.
   * @param productor Objeto de tipo HistoricoColumnas que representa al productor a agregar.
   */
  setAgregarProductoresExportador(agregarProductoresExportador: HistoricoColumnas[]): void {
    this.update((state) => ({
      ...state,
      agregarProductoresExportador
    }));
  }

   /**
* Actualiza la lista de mercancías asociadas a los productores en el estado del trámite.
* @param mercancia Arreglo de objetos de tipo MercanciaTabla a asignar.
*/
  setMercanciaProductores(mercancia: MercanciaTabla[]): void {
    this.update((state) => ({
      ...state,
      mercanciaProductores: mercancia,
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
  * @method setProductoresExportador
  * @description Actualiza la lista de productores asociados al exportador en el estado del trámite.
  *
  * Este método permite establecer los datos de los productores asociados al exportador.
  *
  * @param {HistoricoColumnas[]} productoresExportador - Lista de productores asociados al exportador.
  *
  * @returns {void}
  */
  public setProductoresExportador(
    productoresExportador: HistoricoColumnas[]
  ): void {
    this.update((state) => ({
      ...state,
      productoresExportador,
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
     * Actualiza el estado con una nueva lista de fechas de idioma.
     *
     * @param idiomaDates - Un arreglo de objetos de tipo `Catalogo` que representa las fechas de idioma a establecer en el estado.
     */
  public setIdiomaDates(idiomaDates: Catalogo[]): void {
    this.update((state) => ({ ...state, idiomaDates }));
  }
}