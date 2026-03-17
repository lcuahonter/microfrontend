import {
  AgregarDatosProductorFormulario,
  DisponiblesTabla,
  FormularioMercancia,
  GrupoOperador,
  GrupoTratado,
  HistoricoColumnas,
  MercanciaTabla,
  SeleccionadasTabla,
} from '../../tramites/110214/models/validar-inicialmente-certificado.model';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { GrupoDeDirecciones } from '../../tramites/110214/models/validar-inicialmente-certificado.model';
import { GrupoReceptor } from '../../tramites/110214/models/validar-inicialmente-certificado.model';
import { GrupoRepresentativo } from '../../tramites/110214/models/validar-inicialmente-certificado.model';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../shared/models/modificacion.enum';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Interfaz que define el estado del trámite 110214.
 *
 * Esta interfaz incluye las propiedades necesarias para gestionar el estado del trámite,
 * como el paso activo, la pestaña activa, los datos del productor, las mercancías,
 * los grupos representativos, las direcciones, los receptores, y los datos relacionados
 * con tratados y fracciones arancelarias.
 */
export interface Tramite110214State {
  /** ID de la solicitud */
  idSolicitud: number | null;

  /**
   * Paso activo del trámite.
   *
   * Indica el número del paso actual en el flujo del trámite.
   */
  pasoActivo: number;

  /**
   * Pestaña activa del trámite.
   *
   * Indica el índice de la pestaña activa en el flujo del trámite.
   */
  pestanaActiva: number;

  /**
   * Lista de productores asignados.
   */
  asignarProductor: SeleccionadasTabla[] | null;

  /**
   * Indica si el productor es el mismo que el exportador.
   */
  productorMismoExportador: boolean;

  /**
   * Datos del formulario para agregar información del productor.
   */
  agregarDatosProductorFormulario: AgregarDatosProductorFormulario;

  /**
   * Indica si los datos del productor son confidenciales.
   */
  datosConfidencialesProductor: boolean;

  /**
   * Información del grupo representativo.
   */
  grupoRepresentativo: GrupoRepresentativo;

  /**
   * Información del grupo de direcciones.
   */
  grupoDeDirecciones: GrupoDeDirecciones;

  /**
   * Indica si hay un tercer operador involucrado.
   */
  tercerOperador: boolean;

  /**
   * Período del trámite.
   */
  blnPeriodo: string;

  /**
   * Información del grupo receptor.
   */
  grupoReceptor: GrupoReceptor;

  /**
   * Representación federal seleccionada.
   */
  representacionFederal: string | null;

  /**
   * Observaciones relacionadas con el trámite.
   */
  observaciones: string;

  /**
   * Entidad federativa seleccionada.
   */
  entidadFederativa: string | null;

  /**
   * Idioma seleccionado.
   */
  idioma: string | null;

  /**
   * Información del formulario de mercancías.
   */
  formularioMercancia: FormularioMercancia;

  /**
   * Información del grupo tratado.
   */
  grupoTratado: GrupoTratado;

  /**
   * Información del operador.
   */
  grupoOperador: GrupoOperador;
  /**
   * @property {SeleccionadasTabla[]} mercanciaSeleccionadasTablaDatos
   * @description Lista de mercancías seleccionadas para ser mostradas en la tabla de datos.
   *
   * Contiene los datos de las mercancías que han sido seleccionadas por el usuario durante el trámite.
   */
  mercanciaSeleccionadasTablaDatos: SeleccionadasTabla[];
  /**
   * @property {DisponiblesTabla[]} mercanciaDisponsiblesTablaDatos
   * @description Lista de mercancías disponibles para ser mostradas en la tabla de datos.
   *
   * Contiene los datos de las mercancías que están disponibles para ser seleccionadas por el usuario durante el trámite.
   */
  mercanciaDisponsiblesTablaDatos: DisponiblesTabla[];
  /**
   * @property {HistoricoColumnas[]} productoresExportador
   * @description Lista de productores asociados al exportador.
   */
  productoresExportador: HistoricoColumnas[];
  /**
   * @property {SeleccionadasTabla[]} historicoMercanciaSeleccionadasTablaDatos
   * @description Historial de mercancías seleccionadas en la tabla de datos.
   */
  historicoMercanciaSeleccionadasTablaDatos: SeleccionadasTabla[];

  /**
   * @property {Object} formulario - Otros datos de formularios auxiliares.
   * @description
   * Contiene otros datos relevantes para el trámite, como datos confidenciales del productor y si el productor es el mismo exportador.
   */
  formHistorico: { [key: string]: unknown };

  /**
   * @property {Object} datosProductorFormulario - Datos adicionales del productor.
   * @description
   * Contiene campos adicionales para el formulario del productor, como número de registro fiscal y fax.
   */
  datosProductorFormulario: { [key: string]: unknown };

  /** Opciones disponibles para el tipo de factura en el formulario, provenientes del catálogo correspondiente. */
  optionsTipoFactura: Catalogo[];

  /** Lista de idiomas disponibles como catálogo */
  idiomaDatos: Catalogo[];

  /** Lista de entidades federativas disponibles */
  entidadFederativaDatos: Catalogo[];

  /** Lista de representaciones federales disponibles */
  representacionFederalDatos: Catalogo[];

  /**
   * Datos del formulario relacionados con los detalles del certificado.
   * Estructura dinámica y flexible.
   */
  formDatosCertificado: { [key: string]: unknown };

  /**
   * @description
   * Representa la estructura principal del estado o modelo de datos relacionado con el formulario de certificado.
   */
  formaValida: { [key: string]: boolean };
  /**
   * @description
   * Lista de mercancías disponibles para seleccionar o procesar dentro del formulario.
   */
  disponiblesDatos: Mercancia[];
  /**
   * @description
   * Tabla que contiene las mercancías registradas o agregadas por el usuario.
   */
  mercanciaTabla: Mercancia[];
  /**
   * @description
   * Objeto que contiene los valores actuales del formulario de certificado.
   */
  formCertificado: { [key: string]: unknown };
  /**
   * @description
   * Estado seleccionado del catálogo correspondiente.
   */
  estado: Catalogo;
  /**
   * @description
   * Objeto que almacena los valores individuales del formulario de mercancía.
   */
  mercanciaForm: { [key: string]: unknown };
  /**
   * @description
   * Identificador o nombre del bloque actual del formulario o proceso.
   */
  bloque: string;

  /** Lista de catálogos que representan países bloqueados. */
  paisBloques: Catalogo[];

  /** Lista de catálogos que representan países bloqueados. */
  paisBloqu: Catalogo[];

  agregarProductoresExportador: HistoricoColumnas[];

  mercanciaProductores: Mercancia[];

  formValidity?: {
    datosCertificado?: boolean;
    destinatario?: boolean;
    histProductores?: boolean;
    certificadoOrigen?: boolean;
  };

  continuarTriggered?: boolean;
}

/**
 * Función para crear el estado inicial del trámite 110214.
 *
 * Esta función devuelve un objeto con los valores predeterminados para el estado del trámite.
 *
 * @returns {Tramite110214State} El estado inicial del trámite.
 */
export function createInitialState(): Tramite110214State {
  return {
    idSolicitud: 0,
    pasoActivo: 1,
    pestanaActiva: 1,
    asignarProductor: null,
    productorMismoExportador: false,
    agregarDatosProductorFormulario: {
      numeroRegistroFiscal: '',
    },
    datosConfidencialesProductor: false,
    grupoRepresentativo: {
      lugar: '',
      nombreExportador: '',
      empresa: '',
      cargo: '',
      telefono: '',
      correoElectronico: '',
    },
    grupoDeDirecciones: {
      ciudad: '',
      calle: '',
      numeroLetra: '',
      telefono: '',
      correoElectronico: '',
    },
    tercerOperador: false,
    blnPeriodo: '1',
    grupoReceptor: {
      nombre: '',
      apellidoPrimer: '',
      apellidoSegundo: '',
      numeroFiscal: '',
      razonSocial: '',
    },
    representacionFederal: null,
    observaciones: '',
    entidadFederativa: null,
    idioma: null,
    formularioMercancia: {
      fraccionMercanciaArancelaria: '',
      nombreComercialDelaMercancia: '',
      nombreTecnico: '',
      nombreEnIngles: '',
      criterioTratoPreferencial: '',
      valorContenidoRegional: '',
      otrasInstancias: '',
      cantidad: '',
      pais: '',
      valorDelaMercancia: '',
      complementoDelaDescripcion: '',
      numeroSerie: '',
      fecha: '',
      numeroFactura: '',
      tipoFactura: ''
    },
    grupoTratado: { 
      tratado: '',
      pais: '',
      fraccionArancelaria: '',
      numeroRegistro: '',
      nombreComercial: '',
      fechaFinalInput: '',
      fechaInicialInput: '',
    },
    grupoOperador: {
      nombreTercerOperador: '',
      primerApellidoTercerOperador: '',
      segundoApellidoTercerOperador: '',
      registroFiscalTercerOperador: '',
      razonSocialTercerOperador: '',
    },
    mercanciaSeleccionadasTablaDatos: [],
    mercanciaDisponsiblesTablaDatos: [],
    productoresExportador: [],
    historicoMercanciaSeleccionadasTablaDatos: [],
    formHistorico: {
      datosConfidencialesProductor: '',
      productorMismoExportador: '',
    },
    datosProductorFormulario: {
      numeroRegistroFiscal: '',
      fax: '',
    },
    optionsTipoFactura: [],
    agregarProductoresExportador: [],
    mercanciaProductores: [],
    formValidity: {},
    formaValida: {
      certificado: true,
      datos: true,
      destinatrio: true,
      datosDestinatario: true,
    },
    disponiblesDatos: [],
    mercanciaTabla: [],
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
      pais1: '',
      ciudad1: '',
      telefono1: '',
      correoElectronico1: '',
      numeroLetra1: '',
      calle1: '',
    },
    estado: {
      id: -1,
      descripcion: '',
    },
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
    bloque: '',
    idiomaDatos: [],
    entidadFederativaDatos: [],
    representacionFederalDatos: [],
    formDatosCertificado: {
      observacionesDates: '',
      idiomaDates: '',
      EntidadFederativaDates: '',
      representacionFederalDates: '',
    },
    /** Lista de catálogos que representan países bloqueados. */
  paisBloques: [],
  paisBloqu: [],
  continuarTriggered: false,
  };
}
/**
 * Servicio para validar inicialmente los datos del certificado en el trámite 110214.
 *
 * Este servicio proporciona métodos para obtener información necesaria para el trámite,
 * como idiomas, entidades federativas, representaciones federales, mercancías disponibles,
 * mercancías seleccionadas, productores por exportador, tratados y países.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite110214', resettable: true })
export class Tramite110214Store extends Store<Tramite110214State> {
  /**
   * Constructor del store.
   *
   * Inicializa el estado del trámite 110214 con los valores predeterminados definidos en `createInitialState`.
   */
  constructor() {
    super(createInitialState());
  }

  /**
 * Establece el estado del botón continuar para activar o desactivar las validaciones del formulario.
 * @param continuarTriggered Indica si el botón continuar ha sido activado.
 */
  public setContinuarTriggered(continuarTriggered: boolean): void {
    this.update((state) => ({ ...state, continuarTriggered }));
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
   * Actualiza el paso activo del trámite.
   *
   * @param {number} pasoActivo - El número del paso activo en el flujo del trámite.
   */
  public setPasoActivo(pasoActivo: number): void {
    this.update((state) => ({
      ...state,
      pasoActivo,
    }));
  }

  /**
   * Actualiza la pestaña activa del trámite.
   *
   * @param {number} pestanaActiva - El índice de la pestaña activa en el flujo del trámite.
   */
  public setPestanaActiva(pestanaActiva: number): void {
    this.update((state) => ({
      ...state,
      pestanaActiva,
    }));
  }

  /**
   * Actualiza la lista de productores asignados.
   *
   * @param {SeleccionadasTabla[]} asignarProductor - Lista de productores asignados.
   */
  public setAsignarProductor(asignarProductor: SeleccionadasTabla[]): void {
    this.update((state) => ({
      ...state,
      asignarProductor,
    }));
  }

  /**
   * Actualiza si el productor es el mismo que el exportador.
   *
   * @param {boolean} productorMismoExportador - Indica si el productor es el mismo que el exportador.
   */
  public setProductorMismoExportador(productorMismoExportador: boolean): void {
    this.update((state) => ({
      ...state,
      productorMismoExportador,
    }));
  }

  /**
   * Actualiza el número de registro fiscal del productor en el formulario.
   *
   * @param {string} numeroRegistroFiscal - Número de registro fiscal del productor.
   */
  public setAgregarDatosProductorNumeroRegistroFiscal(
    numeroRegistroFiscal: string
  ): void {
    this.update((state) => ({
      ...state,
      agregarDatosProductorFormulario: {
        ...state.agregarDatosProductorFormulario,
        numeroRegistroFiscal,
      },
    }));
  }

  /**
   * Actualiza si los datos del productor son confidenciales.
   *
   * @param {boolean} datosConfidencialesProductor - Indica si los datos del productor son confidenciales.
   */
  public setDatosConfidencialesProductor(
    datosConfidencialesProductor: boolean
  ): void {
    this.update((state) => ({
      ...state,
      datosConfidencialesProductor,
    }));
  }

  /**
   * Actualiza el lugar del grupo representativo.
   *
   * @param {string} lugar - Lugar del grupo representativo.
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
   * @param {string} nombreExportador - Nombre del exportador.
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
   * Actualiza la empresa del grupo representativo.
   *
   * @param {string} empresa - Nombre de la empresa.
   */
  public setGrupoRepresentativoEmpresa(empresa: string): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo: { ...state.grupoRepresentativo, empresa },
    }));
  }

  /**
   * Actualiza el cargo del grupo representativo.
   *
   * @param {string} cargo - Cargo del grupo representativo.
   */
  public setGrupoRepresentativoCargo(cargo: string): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo: { ...state.grupoRepresentativo, cargo },
    }));
  }

  /**
   * Actualiza el teléfono del grupo representativo.
   *
   * @param {string} telefono - Teléfono del grupo representativo.
   */
  public setGrupoRepresentativoTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo: { ...state.grupoRepresentativo, telefono },
    }));
  }

  /**
   * Actualiza el correo electrónico del grupo representativo.
   *
   * @param {string} correoElectronico - Correo electrónico del grupo representativo.
   */
  public setGrupoRepresentativoCorreoElectronico(
    correoElectronico: string
  ): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo: { ...state.grupoRepresentativo, correoElectronico },
    }));
  }

  /**
   * Actualiza la ciudad del grupo de direcciones.
   *
   * @param {string} ciudad - Ciudad del grupo de direcciones.
   */
  public setGrupoDeDireccionesCiudad(ciudad: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDirecciones: { ...state.grupoDeDirecciones, ciudad },
    }));
  }

  /**
   * Actualiza la calle del grupo de direcciones.
   *
   * @param {string} calle - Calle del grupo de direcciones.
   */
  public setGrupoDeDireccionesCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDirecciones: { ...state.grupoDeDirecciones, calle },
    }));
  }
  /**
   * Actualiza el número o letra del grupo de direcciones.
   *
   * @param {string} numeroLetra - Número o letra del grupo de direcciones.
   */
  public setGrupoDeDireccionesNumeroLetra(numeroLetra: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDirecciones: { ...state.grupoDeDirecciones, numeroLetra },
    }));
  }

  /**
   * Actualiza el teléfono del grupo de direcciones.
   *
   * @param {string} telefono - Teléfono del grupo de direcciones.
   */
  public setGrupoDeDireccionesTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDirecciones: { ...state.grupoDeDirecciones, telefono },
    }));
  }

  /**
   * Actualiza el correo electrónico del grupo de direcciones.
   *
   * @param {string} correoElectronico - Correo electrónico del grupo de direcciones.
   */
  public setGrupoDeDireccionesCorreoElectronico(
    correoElectronico: string
  ): void {
    this.update((state) => ({
      ...state,
      grupoDeDirecciones: { ...state.grupoDeDirecciones, correoElectronico },
    }));
  }

  /**
   * Actualiza si hay un tercer operador involucrado.
   *
   * @param {boolean} tercerOperador - Indica si hay un tercer operador.
   */
  public setTercerOperador(tercerOperador: boolean): void {
    this.update((state) => ({
      ...state,
      tercerOperador,
    }));
  }

  /**
   * Actualiza el período del trámite.
   *
   * @param {string} blnPeriodo - Período del trámite.
   */
  public setPeriodo(blnPeriodo: string): void {
    this.update((state) => ({
      ...state,
      blnPeriodo,
    }));
  }

  /**
   * Actualiza el nombre del grupo receptor.
   *
   * @param {string} nombre - Nombre del grupo receptor.
   */
  public setGrupoReceptorNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, nombre },
    }));
  }

  /**
   * Actualiza el primer apellido del grupo receptor.
   *
   * @param {string} apellidoPrimer - Primer apellido del grupo receptor.
   */
  public setGrupoReceptorApellidoPrimer(apellidoPrimer: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, apellidoPrimer },
    }));
  }

  /**
   * Actualiza el segundo apellido del grupo receptor.
   *
   * @param {string} apellidoSegundo - Segundo apellido del grupo receptor.
   */
  public setGrupoReceptorApellidoSegundo(apellidoSegundo: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, apellidoSegundo },
    }));
  }

  /**
   * Actualiza el número fiscal del grupo receptor.
   *
   * @param {string} numeroFiscal - Número fiscal del grupo receptor.
   */
  public setGrupoReceptorNumeroFiscal(numeroFiscal: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, numeroFiscal },
    }));
  }

  /**
   * Actualiza la razón social del grupo receptor.
   *
   * @param {string} razonSocial - Razón social del grupo receptor.
   */
  public setGrupoReceptorRazonSocial(razonSocial: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, razonSocial },
    }));
  }

  /**
   * Actualiza la representación federal seleccionada.
   *
   * @param {string} representacionFederal - Representación federal seleccionada.
   */
  public setRepresentacionFederal(representacionFederal: string): void {
    this.update((state) => ({
      ...state,
      representacionFederal,
    }));
  }

  /**
   * Actualiza las observaciones relacionadas con el trámite.
   *
   * @param {string} observaciones - Observaciones del trámite.
   */
  public setObservaciones(observaciones: string): void {
    this.update((state) => ({
      ...state,
      observaciones,
    }));
  }

  /**
   * Actualiza la entidad federativa seleccionada.
   *
   * @param {string} entidadFederativa - Entidad federativa seleccionada.
   */
  public setEntidadFederativa(entidadFederativa: string): void {
    this.update((state) => ({
      ...state,
      entidadFederativa,
    }));
  }

  /**
   * Actualiza el idioma seleccionado.
   *
   * @param {string} idioma - Idioma seleccionado.
   */
  public setIdioma(idioma: string): void {
    this.update((state) => ({
      ...state,
      idioma,
    }));
  }

  /**
   * Actualiza la fracción arancelaria de la mercancía.
   *
   * @param {string} fraccionMercanciaArancelaria - Fracción arancelaria de la mercancía.
   */
  public setFraccionMercanciaArancelaria(
    fraccionMercanciaArancelaria: string
  ): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: {
        ...state.formularioMercancia,
        fraccionMercanciaArancelaria,
      },
    }));
  }

  /**
   * Actualiza el nombre comercial de la mercancía.
   *
   * @param {string} nombreComercialDelaMercancia - Nombre comercial de la mercancía.
   */
  public setNombreComercialDelaMercancia(
    nombreComercialDelaMercancia: string
  ): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: {
        ...state.formularioMercancia,
        nombreComercialDelaMercancia,
      },
    }));
  }

  /**
   * Actualiza el nombre técnico de la mercancía.
   *
   * @param {string} nombreTecnico - Nombre técnico de la mercancía.
   */
  public setNombreTecnico(nombreTecnico: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, nombreTecnico },
    }));
  }

  /**
   * Actualiza el nombre en inglés de la mercancía.
   *
   * @param {string} nombreEnIngles - Nombre en inglés de la mercancía.
   */
  public setNombreEnIngles(nombreEnIngles: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, nombreEnIngles },
    }));
  }

  /**
   * Actualiza el criterio de trato preferencial de la mercancía.
   *
   * @param {string} criterioTratoPreferencial - Criterio de trato preferencial.
   */
  public setCriterioTratoPreferencial(criterioTratoPreferencial: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: {
        ...state.formularioMercancia,
        criterioTratoPreferencial,
      },
    }));
  }

  /**
   * Actualiza el valor de contenido regional de la mercancía.
   *
   * @param {string} valorContenidoRegional - Valor de contenido regional.
   */
  public setValorContenidoRegional(valorContenidoRegional: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: {
        ...state.formularioMercancia,
        valorContenidoRegional,
      },
    }));
  }

  /**
   * Actualiza otras instancias relacionadas con la mercancía.
   *
   * @param {string} otrasInstancias - Otras instancias relacionadas.
   */
  public setOtrasInstancias(otrasInstancias: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, otrasInstancias },
    }));
  }

  /**
   * Actualiza la cantidad de la mercancía.
   *
   * @param {string} cantidad - Cantidad de la mercancía.
   */
  public setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, cantidad },
    }));
  }

  /**
   * Actualiza el país relacionado con la mercancía.
   *
   * @param {string} pais - País relacionado con la mercancía.
   */
  public setPais(pais: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, pais },
    }));
  }

  /**
   * Actualiza el valor de la mercancía.
   *
   * @param {string} valorDelaMercancia - Valor de la mercancía.
   */
  public setValorDelaMercancia(valorDelaMercancia: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, valorDelaMercancia },
    }));
  }
  /**
   * Actualiza el complemento de la descripción de la mercancía.
   *
   * @param {string} complementoDelaDescripcion - Complemento de la descripción de la mercancía.
   */
  public setComplementoDelaDescripcion(
    complementoDelaDescripcion: string
  ): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: {
        ...state.formularioMercancia,
        complementoDelaDescripcion,
      },
    }));
  }

  /**
   * Actualiza el número de factura de la mercancía.
   *
   * @param {string} numeroFactura - Número de factura de la mercancía.
   */
  public setNumeroFactura(numeroFactura: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, numeroFactura },
    }));
  }

  /**
   * Actualiza el tipo de factura de la mercancía.
   *
   * @param {string} tipoFactura - Tipo de factura de la mercancía.
   */
  public setTipoFactura(tipoFactura: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, tipoFactura },
    }));
  }

  /**
   * Actualiza la fecha relacionada con la mercancía.
   *
   * @param {string} fecha - Fecha relacionada con la mercancía.
   */
  public setFecha(fecha: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, fecha },
    }));
  }

  /**
   * Actualiza el número de serie de la mercancía.
   *
   * @param {string} numeroSerie - Número de serie de la mercancía.
   */
  public setNumeroSerie(numeroSerie: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, numeroSerie },
    }));
  }

  /**
   * Actualiza el tratado del grupo tratado.
   *
   * @param {string} tratado - Tratado del grupo tratado.
   */
  public setGrupoTratadoTratado(tratado: string): void {
    this.update((state) => ({
      ...state,
      grupoTratado: { ...state.grupoTratado, tratado: String(tratado) },
    }));
  }

  /**
   * Actualiza el país del grupo tratado.
   *
   * @param {string} pais - País del grupo tratado.
   */
  public setGrupoTratadoPais(pais: string): void {
    this.update((state) => ({
      ...state,
      grupoTratado: { ...state.grupoTratado, pais },
    }));
  }

  /**
   * Actualiza el grupo tratado completo.
   *
   * @param {GrupoTratado} grupoTratado - Objeto completo del grupo tratado.
   */
  public setGrupoTratado(grupoTratado: GrupoTratado): void {
    this.update((state) => ({
      ...state,
      grupoTratado,
    }));
  }

  /**
   * Actualiza la fracción arancelaria del grupo tratado.
   *
   * @param {string} fraccionArancelaria - Fracción arancelaria del grupo tratado.
   */
  public setGrupoTratadoFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      grupoTratado: { ...state.grupoTratado, fraccionArancelaria },
    }));
  }

  /**
   * Actualiza el número de registro del grupo tratado.
   *
   * @param {string} numeroRegistro - Número de registro del grupo tratado.
   */
  public setGrupoTratadoNumeroRegistro(numeroRegistro: string): void {
    this.update((state) => ({
      ...state,
      grupoTratado: { ...state.grupoTratado, numeroRegistro },
    }));
  }

  /**
   * Actualiza el nombre comercial del grupo tratado.
   *
   * @param {string} nombreComercial - Nombre comercial del grupo tratado.
   */
  public setGrupoTratadoNombreComercial(nombreComercial: string): void {
    this.update((state) => ({
      ...state,
      grupoTratado: { ...state.grupoTratado, nombreComercial },
    }));
  }

  /**
   * Actualiza la fecha final del grupo tratado.
   *
   * @param {string} fechaFinalInput - Fecha final del grupo tratado.
   */
  public setGrupoTratadoFechaFinalInput(fechaFinalInput: string): void {
    this.update((state) => ({
      ...state,
      grupoTratado: { ...state.grupoTratado, fechaFinalInput },
    }));
  }

  /**
   * Actualiza la fecha inicial del grupo tratado.
   *
   * @param {string} fechaInicialInput - Fecha inicial del grupo tratado.
   */
  public setGrupoTratadoFechaInicialInput(fechaInicialInput: string): void {
    this.update((state) => ({
      ...state,
      grupoTratado: { ...state.grupoTratado, fechaInicialInput },
    }));
  }
  /**
   * @method setGrupoReceptor
   * @description Actualiza la información del receptor en el estado del trámite.
   *
   * Este método permite establecer los datos del receptor en el grupo receptor del estado.
   *
   * @param {GrupoReceptor} grupoReceptor - Objeto que contiene la información del receptor a actualizar.
   *
   * @returns {void}
   */
  public setGrupoReceptor(grupoReceptor: GrupoReceptor): void {
    this.update((state) => ({
      ...state,
      grupoReceptor,
    }));
  }
  /**
   * @method setGrupoDeDirecciones
   * @description Actualiza la información de las direcciones del receptor en el estado del trámite.
   *
   * Este método permite establecer los datos del grupo de direcciones en el estado del trámite.
   *
   * @param {GrupoDeDirecciones} grupoDeDirecciones - Objeto que contiene la información de las direcciones a actualizar.
   *
   * @returns {void}
   */
  public setGrupoDeDirecciones(grupoDeDirecciones: GrupoDeDirecciones): void {
    this.update((state) => ({
      ...state,
      grupoDeDirecciones,
    }));
  }
  /**
   * @method setGrupoRepresentativo
   * @description Actualiza la información representativa del trámite en el estado.
   *
   * Este método permite establecer los datos del grupo representativo en el estado del trámite.
   *
   * @param {GrupoRepresentativo} grupoRepresentativo - Objeto que contiene la información representativa a actualizar.
   *
   * @returns {void}
   */
  public setGrupoRepresentativo(
    grupoRepresentativo: GrupoRepresentativo
  ): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo,
    }));
  }
  /**
   * @method setMercanciaTablaDatos
   * @description Actualiza la lista de mercancías seleccionadas en la tabla de datos del estado del trámite.
   *
   * Este método permite establecer las mercancías seleccionadas por el usuario en la tabla de datos.
   *
   * @param {SeleccionadasTabla[]} mercanciaSeleccionadasTablaDatos - Lista de mercancías seleccionadas a actualizar en el estado.
   *
   * @returns {void}
   */
  public setMercanciaTablaDatos(
    mercanciaSeleccionadasTablaDatos: SeleccionadasTabla[]
  ): void {
    this.update((state) => ({
      ...state,
      mercanciaSeleccionadasTablaDatos,
    }));
  }
  /**
   * @method setMercanciaDisponsiblesTablaDatos
   * @description Actualiza la lista de mercancías disponibles en la tabla de datos del estado del trámite.
   *
   * Este método permite establecer las mercancías disponibles para ser seleccionadas por el usuario en la tabla de datos.
   *
   * @param {DisponiblesTabla[]} mercanciaDisponsiblesTablaDatos - Lista de mercancías disponibles a actualizar en el estado.
   *
   * @returns {void}
   */
  public setMercanciaDisponsiblesTablaDatos(
    mercanciaDisponsiblesTablaDatos: DisponiblesTabla[]
  ): void {
    this.update((state) => ({
      ...state,
      mercanciaDisponsiblesTablaDatos,
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
   * @method setHistoricoMercanciaSeleccionadasTablaDatos
   * @description Actualiza el historial de mercancías seleccionadas en la tabla de datos del estado del trámite.
   *
   * Este método permite establecer los datos del historial de mercancías seleccionadas por el usuario.
   *
   * @param {SeleccionadasTabla[]} historicoMercanciaSeleccionadasTablaDatos - Lista de mercancías seleccionadas a actualizar en el historial.
   *
   * @returns {void}
   */
  public setHistoricoMercanciaSeleccionadasTablaDatos(
    historicoMercanciaSeleccionadasTablaDatos: SeleccionadasTabla[]
  ): void {
    this.update((state) => ({
      ...state,
      historicoMercanciaSeleccionadasTablaDatos,
    }));
  }
  /**
   * Actualiza el nombre del tercer operador.
   *
   * @param {string} nombreTercerOperador - Nombre del tercer operador.
   */
  public setNombreTercerOperador(nombreTercerOperador: string): void {
    this.update((state) => ({
      ...state,
      nombreTercerOperador,
    }));
  }

  /**
   * Actualiza el primer apellido del tercer operador.
   *
   * @param {string} primerApellidoTercerOperador - Primer apellido del tercer operador.
   */
  public setPrimerApellidoTercerOperador(
    primerApellidoTercerOperador: string
  ): void {
    this.update((state) => ({
      ...state,
      primerApellidoTercerOperador,
    }));
  }

  /**
   * Actualiza el segundo apellido del tercer operador.
   *
   * @param {string} segundoApellidoTercerOperador - Segundo apellido del tercer operador.
   */
  public setSegundoApellidoTercerOperador(
    segundoApellidoTercerOperador: string
  ): void {
    this.update((state) => ({
      ...state,
      segundoApellidoTercerOperador,
    }));
  }

  /**
   * Actualiza el registro fiscal del tercer operador.
   *
   * @param {string} registroFiscalTercerOperador - Registro fiscal del tercer operador.
   */
  public setRegistroFiscalTercerOperador(
    registroFiscalTercerOperador: string
  ): void {
    this.update((state) => ({
      ...state,
      registroFiscalTercerOperador,
    }));
  }

  /**
   * Actualiza la razón social del tercer operador.
   *
   * @param {string} razonSocialTercerOperador - Razón social del tercer operador.
   */
  public setRazonSocialTercerOperador(razonSocialTercerOperador: string): void {
    this.update((state) => ({
      ...state,
      razonSocialTercerOperador,
    }));
  }

  /**
   * Actualiza el grupo operador completo.
   *
   * @param {GrupoOperador} grupoOperador - Objeto que contiene la información del grupo operador.
   */
  public setGrupoOperador(grupoOperador: GrupoOperador): void {
    this.update((state) => ({
      ...state,
      grupoOperador,
    }));
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario histórico.
   * @param values - Valores a actualizar en el formulario.
   */
  setFormHistorico(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      formHistorico: {
        ...state.formHistorico,
        ...values,
      },
    }));
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario de productor.
   * @param values - Valores a actualizar en el formulario.
   */
  setAgregarFormDatosProductor(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      datosProductorFormulario: {
        ...state.datosProductorFormulario,
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
   * Actualiza la lista de mercancías asociadas a los productores en el estado del trámite.
   * @param mercancia Arreglo de objetos de tipo MercanciaTabla a asignar.
   */
  setMercanciaProductores(mercancia: Mercancia[]): void {
    this.update((state) => ({
      ...state,
      mercanciaProductores: mercancia,
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
      const UPDATEDLIST = mercanciaTabla.map((ITEM) => 
        ITEM.id === NUEVOARTICULO.id ? { ...ITEM, ...NUEVOARTICULO } : ITEM
      );
      return { ...STATE, mercanciaTabla: UPDATEDLIST };
    });
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
   * Establece el estado de bloque.
   * @param bloque - El valor de bloque.
   */
  public setBloque(bloque: string): void {
    this.update((state) => ({
      ...state,
      bloque,
    }));
  }

  /**
   * Establece los bloques de países disponibles.
   * @param paisBloques Lista de catálogos de países por bloque.
   */
  setPaisBloque(paisBloques: Catalogo[]): void {
    this.update((state) => ({ ...state, paisBloques }));
  }

  /**
   * Establece los bloques de países disponibles.
   * @param paisBloqu Lista de catálogos de países por bloque.
   */
  setPaisBloqu(paisBloqu: Catalogo[]): void {
    this.update((state) => ({ ...state, paisBloqu }));
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
   * Actualiza el idioma seleccionado para el trámite.
   *
   * Este método permite establecer el idioma seleccionado en el trámite.
   *
   * @param {Catalogo[]} idioma - El idioma a establecer.
   */
  public setIdiomaDatos(idiomaDatos: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      idiomaDatos,
    }));
  }

  /**
   * Actualiza la lista de entidades federativas disponibles.
   * @param {Catalogo[]} entidadFederativaDatos - Lista de entidades federativas a establecer.
   */
  public setEntidadFederativaDatos(entidadFederativaDatos: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      entidadFederativaDatos,
    }));
  }

  /**
   * Actualiza la lista de representaciones federales disponibles.
   * @param {Catalogo[]} representacionFederalDatos - Lista de representaciones federales a establecer.
   */
  public setRepresentacionFederalDatos(
    representacionFederalDatos: Catalogo[]
  ): void {
    this.update((state) => ({
      ...state,
      representacionFederalDatos,
    }));
  }

  /**
   * Establece los valores del formulario de fechas del certificado en el almacén.
   *
   * @param {Object} values - Un objeto con las claves y valores para actualizar las fechas del certificado.
   *
   * @returns {void} - No devuelve ningún valor.
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
   * Actualiza el idioma seleccionado del catálogo.
   * @param idiomaDatosSeleccion - El idioma seleccionado del catálogo.
   * @returns void
   */
  setIdiomaSeleccion(idiomaDatosSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      idiomaDatosSeleccion,
    }));
  }

  /**
   * Establece los representacionFederalSeleccion de países en el almacén.
   *
   * @param {Catalogo} representacionFederalSeleccion - Un array de objetos `Catalogo` que representa los representacionFederalSeleccion de países.
   *
   * @returns {void} - No devuelve ningún valor.
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
