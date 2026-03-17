import { HistoricoColumnas, MercanciaTabla } from '../models/peru-certificado.module';
import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@ng-mf/data-access-user';
import { GrupoRepresentativo } from '../models/peru-certificado.module';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../../shared/models/modificacion.enum';

/**
 * @description
 * Interfaz que define el estado del certificado PERU.
 */
/**
 * @interface Tramite110205State
 * @description Representa el estado de la aplicación para el trámite 110205.
 * Contiene las propiedades necesarias para gestionar los datos del formulario,
 * tablas, catálogos y otros elementos relacionados con el trámite.
 *
 * @property { {[key: string]: unknown} } formCertificado - Datos del formulario de certificado.
 * @property { Catalogo } estado - Estado actual del trámite.
 * @property { Catalogo[] } paisBloques - Lista de países o bloques relacionados.
 * @property { {[key: string]: unknown} } mercanciaForm - Datos del formulario de mercancía.
 * @property { Mercancia[] } mercanciaTabla - Lista de mercancías en la tabla.
 * @property { {[key: string]: unknown} } formDatosCertificado - Datos del formulario de certificado.
 * @property { Catalogo } idiomaDatosSeleccion - Idioma seleccionado para los datos.
 * @property { Catalogo } entidadFederativaSeleccion - Entidad federativa seleccionada.
 * @property { Catalogo } representacionFederalSeleccion - Representación federal seleccionada.
 * @property { {[key: string]: unknown} } formDatosDelDestinatario - Datos del formulario del destinatario.
 * @property { {[key: string]: unknown} } formExportor - Datos del formulario del exportador.
 * @property { string } fraccionArancelaria - Fracción arancelaria de la mercancía.
 * @property { string } nombreComercialMercancia - Nombre comercial de la mercancía.
 * @property { string } nombreTecnico - Nombre técnico de la mercancía.
 * @property { string } nombreIngles - Nombre en inglés de la mercancía.
 * @property { string } otrasInstancias - Información sobre otras instancias relacionadas.
 * @property { string } criterioParaConferirOrigen - Criterio para conferir origen.
 * @property { string } cantidad - Cantidad de la mercancía.
 * @property { Catalogo[] } umc - Unidades de medida comercial.
 * @property { string } valorMercancia - Valor de la mercancía.
 * @property { string } complementoDescripcion - Descripción complementaria de la mercancía.
 * @property { string } numeroFactura - Número de factura.
 * @property { Catalogo[] } tipoFactura - Tipos de factura disponibles.
 * @property { {[key: string]: boolean} } formaValida - Validación de la forma.
 * @property { {[key: string]: unknown} } formDestinatario - Datos del formulario del destinatario.
 * @property { boolean | undefined } datosConfidencialesProductor - Indica si los datos del productor son confidenciales.
 * @property { boolean | undefined } productorMismoExportador - Indica si el productor es el mismo exportador.
 * @property { {[key: string]: unknown} } agregarDatosProductorFormulario - Datos adicionales del productor.
 * @property { {[key: string]: unknown} } formulario - Datos generales del formulario.
 */
export interface Tramite110205State {
  idSolicitud: number | null;
  formCertificado: { [key: string]: unknown };
  estado: Catalogo;
  paisBloques: Catalogo;
  mercanciaForm: { [key: string]: unknown };
  mercanciaTabla: Mercancia[];
  formDatosCertificado: { [key: string]: unknown };
  idiomaDatosSeleccion: Catalogo;
  entidadFederativaSeleccion: Catalogo;
  representacionFederalSeleccion: Catalogo;
  formDatosDelDestinatario: { [key: string]: unknown };
  grupoRepresentativo: GrupoRepresentativo;
  formExportor: { [key: string]: unknown };
  fraccionArancelaria: string;
  nombreComercialMercancia: string;
  nombreTecnico: string;
  nombreIngles: string;
  otrasInstancias: string;
  criterioParaConferirOrigen: string;
  fechaFactura: string;
  cantidad: string;
  umc: Catalogo[];
  valorMercancia: string;
  complementoDescripcion: string;
  numeroFactura: string;
  tipoFactura: Catalogo[];
  formaValida: { [key: string]: boolean };
  formDestinatario: { [key: string]: unknown };
  datosConfidencialesProductor?: boolean;
  productorMismoExportador?: boolean;
  agregarDatosProductorFormulario: {[key: string]: unknown};
  formulario: {[key: string]: unknown};
  disponiblesDatos:Mercancia[];
  procductoUno:HistoricoColumnas[];
  agregarProductoresExportador: HistoricoColumnas[];
  mercanciaProductores: MercanciaTabla[];
  /** Opciones disponibles para el tipo de factura en el formulario, provenientes del catálogo correspondiente. */
  optionsTipoFactura: Catalogo[];
  cambioError?: boolean;
  serviciosImmxError?: boolean;
  /** Lista de mercancías encontradas o buscadas. */
  buscarMercancia: Mercancia[];
  productores: HistoricoColumnas[];
  /**
   * @property {HistoricoColumnas[]} productoresExportador
   * @description Lista de productores asociados al exportador.
   */
  productoresExportador: HistoricoColumnas[];
}

/**
 * @method createInitialState
 * Crea el estado inicial para el trámite 110205 (Certificado PERU).
 * Inicializa todas las propiedades requeridas en el estado del store.
 * @function createInitialState
 * @description
 *
 * @returns {Tramite110205State} Estado inicial del trámite 110205.
 */
export function createInitialState(): Tramite110205State {
  return {
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
      otrasInstancias: '',
      criterioParaConferirOrigen: '',
      marca: '',
      cantidad: '',
      umc: '',
      valorMercancia: '',
      complementoDescripcion: '',
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
      razonSocial: '',
    },
    fraccionArancelaria: '',
    nombreComercialMercancia: '',
    nombreTecnico: '',
    nombreIngles: '',
    otrasInstancias: '',
    criterioParaConferirOrigen: '',
    fechaFactura: '',
    cantidad: '',
    umc: [],
    valorMercancia: '',
    complementoDescripcion: '',
    numeroFactura: '',
    tipoFactura: [],
    grupoRepresentativo: {
      lugar: '',
      nombreExportador: '',
      empresa: '',
      cargo: '',
      telefono: '',
      correoElectronico: '',
    },
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
    disponiblesDatos: [],
    procductoUno:[],
    agregarProductoresExportador: [],
    mercanciaProductores: [],
    optionsTipoFactura: [],
    /** Flag que indica errores en el cambio de modalidad, false por defecto */
    cambioError: false,

    /** Flag que indica errores en servicios IMMX, false por defecto */
    serviciosImmxError: false,
    buscarMercancia: [],
    productores: [],
    productoresExportador: [],
  };
}

/**
 * @class Tramite110205Store
 * @description
 * Store encargado de gestionar el estado global del trámite 110205 (Certificado PERU).
 * Permite actualizar y consultar los datos relacionados con los formularios, catálogos, tablas y validaciones del trámite.
 * Utiliza Akita para el manejo reactivo del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite-110205', resettable: true })
export class Tramite110205Store extends Store<Tramite110205State> {
  /**
   * @constructor
   * @description
   * Inicializa el almacén con el estado inicial del trámite.
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
   * Establece el estado de error para el campo de cambio de modalidad.
   *
   * @param cambioError - Indica si existe un error en el campo de cambio de modalidad.
   */
  public setCambioError(cambioError: boolean): void {
    this.update((state) => ({
      ...state,
      cambioError,
    }));
  }

  /**
   * Establece el estado de error para el campo de servicios IMMX.
   *
   * @param serviciosImmxError - Indica si existe un error en el campo de servicios IMMX.
   */
  public setserviciosImmxError(serviciosImmxError: boolean): void {
    this.update((state) => ({
      ...state,
      serviciosImmxError,
    }));
  }

  /**
   * @method setFormCertificado
   * @description
   * Actualiza los datos del formulario de certificado.
   * @param values Valores a actualizar en el formulario.
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
   * @method setFormHistorico
   * @description
   * Actualiza los datos del formulario de formulario.
   * @param values Valores a actualizar en el formulario.
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
   * @method setAgregarFormDatosProductor
   * @description
   * Actualiza los datos del formulario de productor.
   * @param values Valores a actualizar en el formulario.
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
   * @method setEstado
   * @description
   * Actualiza el estado seleccionado en el almacén.
   * @param estado Objeto de tipo `Catalogo` que contiene la información del estado a actualizar.
   */
  setEstado(estado: Catalogo): void {
    this.update((state) => ({
      ...state,
      estado,
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
   * @method setFormMercancia
   * @description
   * Actualiza los datos del formulario de mercancía en el almacén.
   * @param values Objeto que contiene los valores a actualizar en el formulario de mercancía.
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
   * @method setmercanciaTabla
   * @description
   * Actualiza la tabla de mercancías en el almacén.
   * @param mercanciaTabla Array de objetos `Mercancia` que representa la tabla de mercancías.
   */
  public setmercanciaTabla(mercanciaTabla: Mercancia[]): void {
    this.update((STATE) => {
      if (mercanciaTabla.length === 0 || !mercanciaTabla[0] || mercanciaTabla.length > 1) {
        return { ...STATE, mercanciaTabla: [...mercanciaTabla] };
      }

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
   * Establece los resultados de mercancía obtenidos por búsqueda.
   * @param buscarMercancia Lista de resultados de tipo `Mercancia`.
   */
  setProductores(productores: HistoricoColumnas[]): void {
    this.update((state) => ({ ...state, productores }));
  }

  /**
   * @method setFormDatosCertificado
   * @description
   * Actualiza los datos del formulario de certificado en el almacén.
   * @param values Objeto que contiene los valores a actualizar en el formulario de certificado.
   */
  setFormDatosCertificado(values: {
    [key: string]: undefined | boolean | string | number | object;
  }): void {
    this.update((state) => ({
      formDatosCertificado: {
        ...state.formDatosCertificado,
        ...values,
      },
    }));
  }

  /**
   * @method setIdiomaSeleccion
   * @description
   * Actualiza el idioma seleccionado en el almacén.
   * @param idiomaDatosSeleccion Objeto de tipo `Catalogo` que contiene la información del idioma seleccionado.
   */
  setIdiomaSeleccion(idiomaDatosSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      idiomaDatosSeleccion,
    }));
  }

  /**
   * @method setEntidadFederativaSeleccion
   * @description
   * Actualiza la entidad federativa seleccionada en el almacén.
   * @param entidadFederativaSeleccion Objeto de tipo `Catalogo` que contiene la información de la entidad federativa seleccionada.
   */
  setEntidadFederativaSeleccion(entidadFederativaSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      entidadFederativaSeleccion,
    }));
  }

  /**
   * @method setRepresentacionFederalDatosSeleccion
   * @description
   * Actualiza la representación federal seleccionada en el almacén.
   * @param representacionFederalSeleccion Objeto de tipo `Catalogo` que contiene la información de la representación federal seleccionada.
   */
  setRepresentacionFederalDatosSeleccion(
    representacionFederalSeleccion: Catalogo
  ): void {
    this.update((state) => ({
      ...state,
      representacionFederalSeleccion,
    }));
  }

  /**
   * @method setFormDatosDelDestinatario
   * @description
   * Actualiza los datos del formulario de destinatario en el almacén.
   * @param values Objeto que contiene los valores a actualizar en el formulario de destinatario.
   */
  setFormDatosDelDestinatario(values: {
    [key: string]: undefined | boolean | string | number | object;
  }): void {
    this.update((state) => ({
      formDatosDelDestinatario: {
        ...state.formDatosDelDestinatario,
        ...values,
      },
    }));
  }

  /**
   * @method setFormExportador
   * @description
   * Actualiza los datos del formulario de exportador en el almacén.
   * @param values Objeto que contiene los valores a actualizar en el formulario de exportador.
   */
  setFormExportador(values: {
    [key: string]: undefined | boolean | string | number | object;
  }): void {
    this.update((state) => ({
      formExportor: {
        ...state.formExportor,
        ...values,
      },
    }));
  }

  /**
   * @method setFraccionArancelaria
   * @description
   * Actualiza el número de fraccionArancelaria en el almacén.
   * @param fraccionArancelaria Cadena que representa el número de fraccionArancelaria a actualizar.
   */
  setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * @method setNombreComercialMercancia
   * @description
   * Actualiza el número de nombreComercialMercancia en el almacén.
   * @param nombreComercialMercancia Cadena que representa el número de nombreComercialMercancia a actualizar.
   */
  setNombreComercialMercancia(nombreComercialMercancia: string): void {
    this.update((state) => ({
      ...state,
      nombreComercialMercancia,
    }));
  }

  /**
   * @method setNombreTecnico
   * @description
   * Actualiza el número de nombreTecnico en el almacén.
   * @param nombreTecnico Cadena que representa el número de nombreTecnico a actualizar.
   */
  setNombreTecnico(nombreTecnico: string): void {
    this.update((state) => ({
      ...state,
      nombreTecnico,
    }));
  }

  /**
   * @method setNombreIngles
   * @description
   * Actualiza el número de nombreIngles en el almacén.
   * @param nombreIngles Cadena que representa el número de nombreIngles a actualizar.
   */
  setNombreIngles(nombreIngles: string): void {
    this.update((state) => ({
      ...state,
      nombreIngles,
    }));
  }

  /**
   * @method setOtrasInstancias
   * @description
   * Actualiza el valor de `otrasInstancias` en el almacén.
   * @param otrasInstancias Cadena que representa el nuevo valor de `otrasInstancias`.
   */
  setOtrasInstancias(otrasInstancias: string): void {
    this.update((state) => ({
      ...state,
      otrasInstancias,
    }));
  }

  /**
   * @method setCriterioParaConferirOrigen
   * @description
   * Actualiza el número de criterioParaConferirOrigen en el almacén.
   * @param criterioParaConferirOrigen Cadena que representa el número de criterioParaConferirOrigen a actualizar.
   */
  setCriterioParaConferirOrigen(criterioParaConferirOrigen: string): void {
    this.update((state) => ({
      ...state,
      criterioParaConferirOrigen,
    }));
  }

  /**
   * @method setCantidad
   * @description
   * Actualiza el número de cantidad en el almacén.
   * @param cantidad Cadena que representa el número de cantidad a actualizar.
   */
  setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }

  /**
   * @method setUmc
   * @description
   * Actualiza el número de umc en el almacén.
   * @param umc Array de objetos `Catalogo` que representa las unidades de medida comercial.
   */
  setUmc(umc: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      umc,
    }));
  }

  /**
   * @method setValorMercancia
   * @description
   * Actualiza el número de valorMercancia en el almacén.
   * @param valorMercancia Cadena que representa el número de valorMercancia a actualizar.
   */
  setValorMercancia(valorMercancia: string): void {
    this.update((state) => ({
      ...state,
      valorMercancia,
    }));
  }

  /**
   * @method setComplementoDescripcion
   * @description
   * Actualiza el número de complementoDescripcion en el almacén.
   * @param complementoDescripcion Cadena que representa el número de complementoDescripcion a actualizar.
   */
  setComplementoDescripcion(complementoDescripcion: string): void {
    this.update((state) => ({
      ...state,
      complementoDescripcion,
    }));
  }

  /**
   * @method setNumeroFactura
   * @description
   * Actualiza el número de numeroFactura en el almacén.
   * @param numeroFactura Cadena que representa el número de numeroFactura a actualizar.
   */
  setNumeroFactura(numeroFactura: string): void {
    this.update((state) => ({
      ...state,
      numeroFactura,
    }));
  }

  /**
   * @summary Actualiza `fechaFactura` en el estado.
   * @description Persiste la fecha recibida en el store (Akita) de forma inmutable.
   * @param {string} fechaFactura Fecha en formato ISO (`YYYY-MM-DD`).
   * @returns {void}
   */
  setFechaFactura(fechaFactura: string): void {
    this.update((state) => ({
      ...state,
      fechaFactura,
    }));
  }

  /**
   * @method setTipoFactura
   * @description
   * Actualiza el número de tipoFactura en el almacén.
   * @param tipoFactura Array de objetos `Catalogo` que representa los tipos de factura.
   */
  setTipoFactura(tipoFactura: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      tipoFactura,
    }));
  }

  /**
   * @method setFormValida
   * @description
   * Actualiza el estado de validación de los formularios en el almacén.
   * @param formaValida Objeto que contiene los valores de validación para los formularios.
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
   * @method setFormDestinatario
   * @description
   * Actualiza los datos del formulario de destinatario en el almacén.
   * @param values Objeto que contiene los valores a actualizar en el formulario de destinatario.
   */
  setFormDestinatario(values: {
    [key: string]: undefined | boolean | string | number | object;
  }): void {
    this.update((state) => ({
      formDestinatario: {
        ...state.formDestinatario,
        ...values,
      },
    }));
  }

  /**
   * @method setFormCertificadoGenric
   * @description
   * Actualiza los datos del formulario de certificado en el almacén.
   * @param values Objeto que contiene los valores a actualizar en el formulario de certificado.
   */
  setFormCertificadoGenric(values: {
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
   * @method setDatosConfidencialesProductor
   * @description
   * Actualiza el estado de datos confidenciales del productor en el almacén.
   * @param datosConfidencialesProductor Valor booleano que indica si los datos del productor son confidenciales.
   * */
  setHistorica(procductoUno: HistoricoColumnas[]): void {
    this.update((state) => ({
      ...state,
      procductoUno,
    }));
  }
  /**
   * Actualiza el lugar en el grupo representativo.
   *
   * Este método permite establecer el lugar en el grupo representativo del trámite.
   *
   * @param {string} lugar - El lugar a establecer.
   */
  public setGrupoRepresentativoLugar(lugar: string): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo: { ...state.grupoRepresentativo, lugar },
    }));
  }

  /**
   * Actualiza el nombre del exportador en el grupo representativo.
   *
   * Este método permite establecer el nombre del exportador en el grupo representativo del trámite.
   *
   * @param {string} nombre - El nombre del exportador a establecer.
   */
  public setGrupoRepresentativoNombreExportador(
    nombreExportador: string
  ): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo: { ...state.grupoRepresentativo, nombreExportador },
    }));
  }

  /**
   * Actualiza la empresa en el grupo representativo.
   *
   * Este método permite establecer la empresa en el grupo representativo del trámite.
   *
   * @param {string} empresa - La empresa a establecer.
   */
  public setGrupoRepresentativoEmpresa(empresa: string): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo: { ...state.grupoRepresentativo, empresa },
    }));
  }
  /**
   * Actualiza el cargo en el grupo representativo.
   *
   * Este método permite establecer el cargo en el grupo representativo del trámite.
   *
   * @param {string} cargo - El cargo a establecer.
   */
  public setGrupoRepresentativoCargo(cargo: string): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo: { ...state.grupoRepresentativo, cargo },
    }));
  }

  /**
   * Actualiza el teléfono en el grupo representativo.
   *
   * Este método permite establecer el teléfono en el grupo representativo del trámite.
   *
   * @param {string} telefono - El teléfono a establecer.
   */
  public setGrupoRepresentativoTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo: { ...state.grupoRepresentativo, telefono },
    }));
  }

  /**
   * Actualiza el correo electrónico en el grupo representativo.
   *
   * Este método permite establecer el correo electrónico en el grupo representativo del trámite.
   *
   * @param {string} correoElectronico - El correo electrónico a establecer.
   */
  public setGrupoRepresentativoCorreoElectronico(
    correoElectronico: string
  ): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo: { ...state.grupoRepresentativo, correoElectronico },
    }));
  }

  public setGrupoRepresentativo(
    grupoRepresentativo: GrupoRepresentativo
  ): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo,
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
   * Agrega un productor exportador al arreglo correspondiente en el estado del trámite.
   * @param productor Objeto de tipo HistoricoColumnas que representa al productor a agregar.
   */
    setAgregarProductoresExportador(productor: HistoricoColumnas[]): void {
      this.update((state) => ({
        ...state,
        agregarProductoresExportador: [
          ...state.agregarProductoresExportador,
          ...productor.map(item => ({ ...item })),
        ],
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
     * Actualiza completamente la lista de productores exportador agregados, reemplazando los valores existentes.
     * @param agregarProductoresExportador Arreglo completo de productores exportador que reemplazará la lista actual.
     */
    updateAgregarProductoresExportador(agregarProductoresExportador: HistoricoColumnas[]): void {
      this.update((state) => ({
        ...state,
        agregarProductoresExportador,
      }));
    }
  }
