import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@ng-mf/data-access-user';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../../shared/models/modificacion.enum';

/**
 * Interfaz que representa la estructura del estado de un trámite 110204.
 * Este estado contiene formularios, catálogos, listas, valores seleccionados y otros datos requeridos.
 */
export interface TramiteState {
  /** ID de la solicitud */
  idSolicitud: number | null;

  /** Lista de catálogos que representan los idiomas disponibles. */
  idiomaDatos: Catalogo[];

  /**
   * @property {Catalogo} idiomaDatosSeleccion - Idioma seleccionado.
   * @description
   * Representa el idioma en el que se generará el certificado, utilizado para la presentación del documento.
   */
  idiomaDatosSeleccion: Catalogo;

  /**
   * @property {Catalogo} representacionFederalSeleccion - Representación federal seleccionada.
   * @description
   * Representa la representación federal asociada al trámite, utilizada para la validación y presentación del certificado.
   */
  representacionFederalSeleccion: Catalogo;

  /** Lista de catálogos que representan las entidades federativas disponibles. */
  entidadFederativaDatos: Catalogo[];

  /** Lista de catálogos que representan las representaciones federales disponibles. */
  representacionFederalDatos: Catalogo[];

  /** Lista de catálogos para la alta de planta. */
  altaPlanta: Catalogo[];

  /** Catálogo que representa el estado actual. */
  estado: Catalogo;

  /** Lista de catálogos que representan facturas disponibles. */
  factura: Catalogo[];

  /** Catálogo que representa facturas. */
  facturas: Catalogo;

  /** Catálogo que representa la unidad de medida comercial (UMC). */
  umc: Catalogo;

  /** Lista de catálogos que representan unidades de medida comercial (UMCs). */
  umcs: Catalogo[];

  /** Lista de catálogos que representan países bloqueados. */
  paisBloques: Catalogo[];

  /** Catálogo que representa un país bloqueado seleccionado. */
  paisBloque: Catalogo;

  /**
   * Objeto que contiene datos del formulario del certificado.
   * Las claves pueden contener valores de tipo undefined, boolean, string, number u objeto.
   */
  formCertificado: {
    [key: string]: undefined | boolean | string | number | object;
  };

  /**
   * @property {Object} formDatosCertificado - Datos adicionales del certificado.
   * @description
   * Contiene campos como observaciones, idioma, entidad federativa y representación federal.
   */
  formDatosCertificado: { [key: string]: unknown };

  /**
   * Objeto que contiene datos del formulario de mercancía.
   * Las claves pueden contener valores de tipo undefined, boolean, string, number u objeto.
   */
  mercanciaForm: {
    [key: string]: undefined | boolean | string | number | object;
  };

  /** Lista de mercancías encontradas o buscadas. */
  buscarMercancia: Mercancia[];

  /**
   * Objeto que representa la validez de los formularios,
   * donde cada clave es un identificador de formulario y el valor un booleano indicando si es válido.
   */
  formaValida: { [key: string]: boolean };

  mercanciaTabla: Mercancia[];
}

/**
 * Interfaz que representa el estado de una solicitud tipo 110204.
 */
export interface Solicitud110204State {
  /** Régimen de la mercancía. */
  regimenMercancia: string;

  /** Clasificación del régimen. */
  clasifiRegimen: string;

  /** Valor TA asociado. */
  valueTA: string;

  /** Fracción arancelaria de la mercancía. */
  fraccionArancelaria: string;

  /** Número de Identificación Comercial (NICO). */
  nico: string;

  /** Unidad de medida tarifaria. */
  unidadMedidaTarifaria: string;

  /** Cantidad tarifaria. */
  cantidadTarifaria: number;

  /** Valor de la factura en dólares estadounidenses. */
  valorFacturaUSD: number;

  /** Precio unitario en dólares estadounidenses. */
  precioUnitarioUSD: string;

  /** País de origen de la mercancía. */
  paisOrigen: string;

  /** País destino de la mercancía. */
  paisDestino: string;

  /** Lote asociado a la mercancía. */
  lote: string;

  /** Fecha de salida de la mercancía. */
  fechaSalida: string;

  /** Observaciones generales. */
  observaciones: string;

  /** Observaciones específicas sobre la mercancía. */
  observacionMerc: string;

  /** Tipo de persona (física, moral, etc.). */
  tipoPersona: string;

  /** Nombre del solicitante o persona responsable. */
  nombre: string;

  /** Apellido paterno del solicitante o persona responsable. */
  apellidoPaterno: string;

  /** Apellido materno del solicitante o persona responsable. */
  apellidoMaterno: string;

  /** Razón social (en caso de persona moral). */
  razonSocial: string;

  /** Molino asociado (si aplica). */
  molino: string;

  /** Domicilio del solicitante o entidad. */
  domicilio: string;

  /** Estado del domicilio. */
  estado: string;

  /** País bloque (si aplica). */
  paisBloque: string;

  /** Número o referencia de factura. */
  factura: string;

  /** Unidad de medida comercial. */
  umc: string;

  /** Representación federal (si aplica). */
  representacionFederal: string;
}

/**
 * Estado inicial que se utiliza para crear el store con valores por defecto.
 */
export const INITIAL_STATE: TramiteState = {
  idSolicitud: 0,
  altaPlanta: [],
  paisBloques: [],
  estado: { id: -1, descripcion: '' },
  umc: { id: -1, descripcion: '' },
  umcs: [],
  factura: [],
  formaValida: {},
  formCertificado: {
    entidadFederativa: '',
    tercerOperador: false,
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
    correo: '',
    numeroLetra: '',
    calle: '',
    si: false,
    anexoJapon: '',
  },
  formDatosCertificado: {
    observacionesDates: '',
    idiomaDates: '',
    precisaDates: '',
    EntidadFederativaDates: '',
    representacionFederalDates: '',
  },
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
  facturas: { id: -1, descripcion: '' },
  buscarMercancia: [],
  paisBloque: { id: -1, descripcion: '' },
  idiomaDatos: [],
  entidadFederativaDatos: [],
  representacionFederalDatos: [],
  mercanciaTabla: [],
  idiomaDatosSeleccion: { id: -1, descripcion: '' },
  representacionFederalSeleccion: { id: -1, descripcion: '' },
};

/**
 * @class Tramite110204Store
 * @description
 * Store que administra el estado global del trámite 110204 utilizando Akita.
 * Este store encapsula todos los datos y formularios necesarios para la gestión
 * de un trámite, tales como catálogos, formularios, validaciones y mercancías.
 *
 * Cada método `set` permite actualizar secciones específicas del estado de forma inmutable.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite-110204', resettable: true })
export class Tramite110204Store extends Store<TramiteState> {
  constructor() {
    super(INITIAL_STATE);
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
   * Actualiza el estado seleccionado.
   * @param estado Objeto de tipo `Catalogo` representando un estado.
   */
  setEstado(estado: Catalogo): void {
    this.update((state) => ({ ...state, estado }));
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
   * Establece los bloques de países disponibles.
   * @param paisBloques Lista de catálogos de países por bloque.
   */
  setBloque(paisBloques: Catalogo[]): void {
    this.update((state) => ({ ...state, paisBloques }));
  }

  /**
   * Establece las plantas disponibles para alta.
   * @param altaPlanta Lista de plantas.
   */
  setaltaPlanta(altaPlanta: Catalogo[]): void {
    this.update((state) => ({ ...state, altaPlanta }));
  }

  /**
   * Actualiza el estado de validación de uno o varios campos del formulario.
   * @param formaValida Objeto con clave/valor booleano que indica si cada campo es válido.
   */
  setFormValida(formaValida: { [key: string]: boolean }): void {
    const IS_VALID = { ...this.getValue().formaValida, ...formaValida };
    this.update({ formaValida: IS_VALID });
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
   * Actualiza los valores del formulario principal del certificado.
   * @param values Clave/valor con campos del formulario.
   */
  setFormCertificado(values: {
    [key: string]: undefined | boolean | string | number | object;
  }): void {
    this.update((state) => ({
      formCertificado: {
        ...state.formCertificado,
        ...values,
      },
    }));
  }

  /**
   * Actualiza los valores del formulario de mercancía.
   * @param values Clave/valor con información sobre la mercancía.
   */
  setFormMercancia(values: {
    [key: string]: undefined | boolean | string | number | object;
  }): void {
    this.update((state) => ({
      mercanciaForm: {
        ...state.mercanciaForm,
        ...values,
      },
    }));
  }

  /**
   * Establece los resultados de mercancía obtenidos por búsqueda.
   * @param buscarMercancia Lista de resultados de tipo `Mercancia`.
   */
  setbuscarMercancia(buscarMercancia: Mercancia[]): void {
    this.update((state) => ({ ...state, buscarMercancia }));
  }

  /** Métodos individuales para establecer propiedades específicas de la solicitud **/

  public setRegimenMercancia(regimenMercancia: string): void {
    this.update((state) => ({ ...state, regimenMercancia }));
  }

  public setClasifiRegimen(clasifiRegimen: string): void {
    this.update((state) => ({ ...state, clasifiRegimen }));
  }

  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({ ...state, fraccionArancelaria }));
  }

  public setNico(nico: string): void {
    this.update((state) => ({ ...state, nico }));
  }

  public setUnidadMedidaTarifaria(unidadMedidaTarifaria: string): void {
    this.update((state) => ({ ...state, unidadMedidaTarifaria }));
  }

  public setPaisOrigen(paisOrigen: string): void {
    this.update((state) => ({ ...state, paisOrigen }));
  }

  public setPaisDestino(paisDestino: string): void {
    this.update((state) => ({ ...state, paisDestino }));
  }

  public setMolino(molino: string): void {
    this.update((state) => ({ ...state, molino }));
  }

  public setRepresentacionFederal(representacionFederal: string): void {
    this.update((state) => ({ ...state, representacionFederal }));
  }

  public setRepresentacionFederalDatos(
    representacionFederalDatos: Catalogo[]
  ): void {
    this.update((state) => ({ ...state, representacionFederalDatos }));
  }

  public setEntidadFederativaDatos(entidadFederativaDatos: Catalogo[]): void {
    this.update((state) => ({ ...state, entidadFederativaDatos }));
  }

  public setIdiomaDatos(idiomaDatos: Catalogo[]): void {
    this.update((state) => ({ ...state, idiomaDatos }));
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
   * Actualiza la representación federal seleccionada en el almacén.
   * @param representacionFederalSeleccion - Objeto de tipo `Catalogo` que contiene la información de la representación federal seleccionada.
   */
  setRepresentacionFederalDatosSeleccion(representacionFederalSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      representacionFederalSeleccion,
    }));
  }

  public setMercanciaTabla(mercanciaTabla: Mercancia[]): void {
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
   * Actualiza el estado con una nueva lista de fechas de idioma.
   *
   * @param idiomaDates - Un arreglo de objetos de tipo `Catalogo` que representa las fechas de idioma a establecer en el estado.
   */
  public setIdiomaDates(idiomaDates: Catalogo[]): void {
    this.update((state) => ({ ...state, idiomaDates }));
  }
}