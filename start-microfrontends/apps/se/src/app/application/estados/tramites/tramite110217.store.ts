import {
  AgregarDatosProductorFormulario,
  DisponiblesTabla,
  FormularioMercancia,
  GrupoDeDomicilio,
  GrupoTratado,
  HistoricoColumnas,
  MercanciaTabla,
  SeleccionadasTabla,
} from '../../tramites/110217/models/certificado-origen.model';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { GrupoDeDirecciones } from '../../tramites/110217/models/certificado-origen.model';
import { GrupoDeTransporte } from '../../tramites/110217/models/certificado-origen.model';
import { GrupoOperador } from '../../tramites/110217/models/certificado-origen.model';
import { GrupoReceptor } from '../../tramites/110217/models/certificado-origen.model';
import { GrupoRepresentativo } from '../../tramites/110217/models/certificado-origen.model';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../shared/models/modificacion.enum';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
/**
 * Interfaz que define el estado inicial del trámite 110217.
 *
 * Esta interfaz contiene todas las propiedades necesarias para gestionar el estado
 * del trámite, incluyendo datos del productor, receptor, transporte, mercancía, entre otros.
 */
export interface Tramite110217State {
  /** ID de la solicitud */
  idSolicitud: number | null;

  /**
   * Observaciones generales del trámite.
   */
  observaciones: string;

  /**
   * Idioma seleccionado para el trámite.
   */
  idioma: string | null;

  /**
   * Entidad federativa seleccionada.
   */
  entidadFederativa: string | null;

  /**
   * Representación federal seleccionada.
   */
  representacionFederal: string | null;

  /**
   * Indica si los datos del productor son confidenciales.
   */
  datosConfidencialesProductor: boolean;

  /**
   * Indica si el productor es el mismo que el exportador.
   */
  productorMismoExportador: boolean;

  /**
   * Datos del formulario para agregar un productor.
   */
  agregarDatosProductorFormulario: AgregarDatosProductorFormulario;

  /**
   * Información del receptor.
   */
  grupoReceptor: GrupoReceptor;

  /**
   * Información de las direcciones del receptor.
   */
  grupoDeDirecciones: GrupoDeDirecciones;

  /**
   * Información representativa del trámite.
   */
  grupoRepresentativo: GrupoRepresentativo;

  /**
   * Información del transporte utilizado.
   */
  grupoDeTransporte: GrupoDeTransporte;

  /**
   * Paso activo en el flujo del trámite.
   */
  pasoActivo: number;

  /**
   * Pestaña activa en el flujo del trámite.
   */
  pestanaActiva: number;

  /**
   * Indica si hay un tercer operador involucrado.
   */
  tercerOperador: boolean;

  /**
   * Información del operador.
   */
  grupoOperador: GrupoOperador;

  /**
   * Información del domicilio.
   */
  grupoDeDomicilio: GrupoDeDomicilio;

  /**
   * Información del tratado comercial.
   */
  grupoTratado: GrupoTratado;

  /**
   * Información del formulario de mercancía.
   */
  formularioMercancia: FormularioMercancia;

  /**
   * Lista de mercancías seleccionadas para ser mostradas en la tabla de datos.
   *
   * Contiene los datos de las mercancías que han sido seleccionadas por el usuario durante el trámite.
   */
  mercanciaSeleccionadasTablaDatos: SeleccionadasTabla[];

  /**
   * Lista de mercancías disponibles para ser mostradas en la tabla de datos.
   *
   * Contiene los datos de las mercancías que están disponibles para ser seleccionadas por el usuario durante el trámite.
   */
  mercanciaDisponsiblesTablaDatos: DisponiblesTabla[];

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
  /**
   * @description
   * Indica si los diferentes campos o secciones del formulario son válidos.
   * Las claves representan el nombre del campo y el valor un booleano indicando su validez.
   */
  formaValida: { [key: string]: boolean };
  /**
   * @description
   * Lista de mercancías disponibles para seleccionar o procesar.
   */
  disponiblesDatos: Mercancia[];
  /**
   * @description
   * Tabla que contiene las mercancías agregadas o registradas en el formulario.
   */
  mercanciaTabla: Mercancia[];
  /**
   * @description
   * Contiene los valores del formulario de certificado.
   */
  formCertificado: { [key: string]: unknown };
  /**
   * @description
   * Estado o catálogo seleccionado actualmente.
   */
  estado: Catalogo;
  /**
   * @description
   * Objeto que almacena los valores del formulario de mercancía.
   */
  mercanciaForm: { [key: string]: unknown };
  /**
   * @description
   * Identifica el bloque o sección actual del proceso.
   */
  bloque: string;

  /**
   * @property {HistoricoColumnas[]} productoresExportador
   * @description Lista de productores asociados al exportador.
   */
  productoresExportador: HistoricoColumnas[];

  /** Lista de productores exportador agregados al estado del trámite. */
  agregarProductoresExportador: HistoricoColumnas[];

  /** Lista de mercancías asociadas a los productores en el estado del trámite. */
  mercanciaProductores: MercanciaTabla[];

  formDatosCertificado: { [key: string]: unknown };

  /**
 * Objeto que indica la validez de los diferentes formularios del trámite.
 * Cada propiedad representa un formulario y su valor indica si es válido.
 */
  formValidity?: {
    datosCertificado?: boolean;
    datosDestinatario?: boolean;
    domicilioDestinatario?: boolean;
    datosRepresentante?: boolean;
    detallesTransporte?: boolean;
    histProductores?: boolean;
    certificadoOrigen?: boolean;
  };
  continuarTriggered?: boolean; 
}

/**
 * Función que crea el estado inicial del trámite 110217.
 *
 * @returns {Tramite110217State} El estado inicial del trámite.
 */
export function createInitialState(): Tramite110217State {
  return {
    idSolicitud: 0,
    observaciones: '',
    pasoActivo: 1,
    pestanaActiva: 2,
    idioma: null,
    entidadFederativa: null,
    representacionFederal: null,
    datosConfidencialesProductor: false,
    productorMismoExportador: false,
    agregarDatosProductorFormulario: {
      numeroRegistroFiscal: '',
      fax: '',
    },
    grupoReceptor: {
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      numeroDeRegistroFiscal: '',
      razonSocial: '',
    },
    grupoDeDirecciones: {
      ciudad: '',
      calle: '',
      numeroLetra: '',
      lada: '',
      telefono: '',
      fax: '',
      correoElectronico: '',
      pais: ''
    },
    grupoRepresentativo: {
      lugar: '',
      nombreExportador: '',
      empresa: '',
      cargo: '',
      lada: '',
      telefono: '',
      fax: '',
      correoElectronico: '',
    },
    grupoDeTransporte: {
      puertoEmbarque: '',
      puertoDesembarque: '',
      puertoTransito: '',
      nombreEmbarcacion: '',
      numeroVuelo: '',
    },
    tercerOperador: false,
    grupoOperador: {
      nombre: '',
      apellidoPrimer: '',
      apellidoSegundo: '',
      numeroFiscal: '',
      razonSocial: '',
    },
    grupoDeDomicilio: {
      pais: '',
      ciudad: '',
      calle: '',
      numeroLetra: '',
      lada: '',
      telefono: '',
      fax: '',
      correoElectronico: '',
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
    formularioMercancia: {
      fraccionMercanciaArancelaria: '',
      nombreTecnico: '',
      nombreComercialDelaMercancia: '',
      criterioParaConferir: '',
      nombreEnIngles: '',
      otrasInstancias: '',
      cantidad: '',
      pais: '',
      valorDelaMercancia: '',
      complementoDelaDescripcion: '',
      tipoFactura: '',
      fecha: '',
      numeroFactura: '',
    },
    mercanciaSeleccionadasTablaDatos: [],
    mercanciaDisponsiblesTablaDatos: [],
    formHistorico: {
      datosConfidencialesProductor: '',
      productorMismoExportador: '',
    },
    datosProductorFormulario: {
      numeroRegistroFiscal: '',
      fax: '',
    },
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
    productoresExportador: [],
    agregarProductoresExportador: [],
    mercanciaProductores: [],
    formDatosCertificado: {
    observacionesDates: '',
    idiomaDates: '',
    precisaDates: '',
    EntidadFederativaDates: '',
    representacionFederalDates: '',
  },
  formValidity: {},
  continuarTriggered: false,
  };
}
/**
 * Servicio para gestionar el estado del trámite 110217.
 *
 * Este servicio utiliza Akita para manejar el estado del trámite, permitiendo
 * actualizaciones y consultas de las propiedades definidas en el estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite110217', resettable: true })
export class Tramite110217Store extends Store<Tramite110217State> {
  /**
   * Constructor de la clase Tramite110217Store.
   *
   * Inicializa el estado del trámite utilizando la función `createInitialState`.
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
   * Actualiza el paso activo en el flujo del trámite.
   *
   * Este método permite establecer el paso actual en el flujo del trámite.
   *
   * @param {number} pasoActivo - El número del paso activo a establecer.
   */
  public setPasoActivo(pasoActivo: number): void {
    this.update((state) => ({
      ...state,
      pasoActivo,
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
   * Actualiza la pestaña activa en el flujo del trámite.
   *
   * Este método permite establecer la pestaña activa en el flujo del trámite.
   *
   * @param {number} pestanaActiva - El número de la pestaña activa a establecer.
   */
  public setPestanaActiva(pestanaActiva: number): void {
    this.update((state) => ({
      ...state,
      pestanaActiva,
    }));
  }

  /**
   * Actualiza las observaciones generales del trámite.
   *
   * Este método permite establecer las observaciones relacionadas con el trámite.
   *
   * @param {string} observaciones - Las observaciones a establecer.
   */
  public setObservaciones(observaciones: string): void {
    this.update((state) => ({
      ...state,
      observaciones,
    }));
  }

  /**
   * Actualiza el idioma seleccionado para el trámite.
   *
   * Este método permite establecer el idioma seleccionado en el trámite.
   *
   * @param {Catalogo} idioma - El idioma a establecer.
   */
  public setIdioma(idioma: string): void {
    this.update((state) => ({
      ...state,
      idioma,
    }));
  }

  /**
   * Actualiza la entidad federativa seleccionada para el trámite.
   *
   * Este método permite establecer la entidad federativa seleccionada en el trámite.
   *
   * @param {Catalogo} entidadFederativa - La entidad federativa a establecer.
   */
  public setEntidadFederativa(entidadFederativa: string): void {
    this.update((state) => ({
      ...state,
      entidadFederativa,
    }));
  }

  /**
   * Actualiza la representación federal seleccionada para el trámite.
   *
   * Este método permite establecer la representación federal seleccionada en el trámite.
   *
   * @param {Catalogo} representacionFederal - La representación federal a establecer.
   */
  public setRepresentacionFederal(representacionFederal: string): void {
    this.update((state) => ({
      ...state,
      representacionFederal,
    }));
  }

  /**
   * Actualiza los datos del formulario de certificado.
   *
   * Este método permite establecer múltiples campos del certificado de una vez.
   *
   * @param {object} datosCertificado - Objeto con los datos del certificado a actualizar.
   */
  public setFormDatosCertificado(datosCertificado: { [key: string]: unknown }): void {
    this.update((state) => ({
      formDatosCertificado: {
        ...state.formDatosCertificado,
        ...datosCertificado,
      },
    }));
  }

  /**
   * Actualiza si los datos del productor son confidenciales.
   *
   * Este método permite establecer si los datos del productor son confidenciales.
   *
   * @param {boolean} datosConfidencialesProductor - Valor booleano que indica si los datos son confidenciales.
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
   * Actualiza si el productor es el mismo que el exportador.
   *
   * Este método permite establecer si el productor es el mismo que el exportador.
   *
   * @param {boolean} productorMismoExportador - Valor booleano que indica si el productor es el mismo que el exportador.
   */
  public setProductorMismoExportador(productorMismoExportador: boolean): void {
    this.update((state) => ({
      ...state,
      productorMismoExportador,
    }));
  }
  /**
   * Actualiza el fax del productor en el formulario de agregar datos.
   *
   * Este método permite establecer el valor del fax en el formulario de agregar datos del productor.
   *
   * @param {string} fax - El número de fax a establecer.
   */
  public setAgregarDatosProductorFax(fax: string): void {
    this.update((state) => ({
      ...state,
      agregarDatosProductorFormulario: {
        ...state.agregarDatosProductorFormulario,
        fax,
      },
    }));
  }

  /**
   * Actualiza el número de registro fiscal del productor en el formulario de agregar datos.
   *
   * Este método permite establecer el número de registro fiscal en el formulario de agregar datos del productor.
   *
   * @param {string} numeroRegistroFiscal - El número de registro fiscal a establecer.
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
   * Actualiza el nombre del receptor en el grupo receptor.
   *
   * Este método permite establecer el nombre del receptor en el grupo receptor.
   *
   * @param {string} nombre - El nombre del receptor a establecer.
   */
  public setGrupoReceptorNombre(nombres: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, nombres },
    }));
  }

  /**
   * Actualiza el primer apellido del receptor en el grupo receptor.
   *
   * Este método permite establecer el primer apellido del receptor en el grupo receptor.
   *
   * @param {string} primerApellido - El primer apellido del receptor a establecer.
   */
  public setGrupoReceptorApellidoPrimer(primerApellido: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, primerApellido },
    }));
  }

  /**
   * Actualiza el segundo apellido del receptor en el grupo receptor.
   *
   * Este método permite establecer el segundo apellido del receptor en el grupo receptor.
   *
   * @param {string} segundoApellido - El segundo apellido del receptor a establecer.
   */
  public setGrupoReceptorApellidoSegundo(segundoApellido: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, segundoApellido },
    }));
  }

  /**
   * Actualiza el número fiscal del receptor en el grupo receptor.
   *
   * Este método permite establecer el número fiscal del receptor en el grupo receptor.
   *
   * @param {string} numeroDeRegistroFiscal - El número fiscal del receptor a establecer.
   */
  public setGrupoReceptorNumeroFiscal(numeroDeRegistroFiscal: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, numeroDeRegistroFiscal },
    }));
  }

  /**
   * Actualiza la razón social del receptor en el grupo receptor.
   *
   * Este método permite establecer la razón social del receptor en el grupo receptor.
   *
   * @param {string} razonSocial - La razón social del receptor a establecer.
   */
  public setGrupoReceptorRazonSocial(razonSocial: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, razonSocial },
    }));
  }

  /**
   * Actualiza la ciudad en el grupo de direcciones.
   *
   * Este método permite establecer la ciudad en el grupo de direcciones del receptor.
   *
   * @param {string} ciudad - La ciudad a establecer.
   */
  public setGrupoDeDireccionesCiudad(ciudad: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDirecciones: { ...state.grupoDeDirecciones, ciudad },
    }));
  }
  /**
   * Actualiza la calle en el grupo de direcciones.
   *
   * Este método permite establecer la calle en el grupo de direcciones del receptor.
   *
   * @param {string} calle - La calle a establecer.
   */
  public setGrupoDeDireccionesCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDirecciones: { ...state.grupoDeDirecciones, calle },
    }));
  }

  /**
   * Actualiza el número o letra en el grupo de direcciones.
   *
   * Este método permite establecer el número o letra en el grupo de direcciones del receptor.
   *
   * @param {string} numeroLetra - El número o letra a establecer.
   */
  public setGrupoDeDireccionesNumeroLetra(numeroLetra: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDirecciones: { ...state.grupoDeDirecciones, numeroLetra },
    }));
  }

  /**
   * Actualiza la lada en el grupo de direcciones.
   *
   * Este método permite establecer la lada en el grupo de direcciones del receptor.
   *
   * @param {string} lada - La lada a establecer.
   */
  public setGrupoDeDireccionesLada(lada: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDirecciones: { ...state.grupoDeDirecciones, lada },
    }));
  }

  /**
   * Actualiza el teléfono en el grupo de direcciones.
   *
   * Este método permite establecer el teléfono en el grupo de direcciones del receptor.
   *
   * @param {string} telefono - El teléfono a establecer.
   */
  public setGrupoDeDireccionesTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDirecciones: { ...state.grupoDeDirecciones, telefono },
    }));
  }

  /**
   * Actualiza el fax en el grupo de direcciones.
   *
   * Este método permite establecer el fax en el grupo de direcciones del receptor.
   *
   * @param {string} fax - El fax a establecer.
   */
  public setGrupoDeDireccionesFax(fax: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDirecciones: { ...state.grupoDeDirecciones, fax },
    }));
  }

  /**
   * Actualiza el correo electrónico en el grupo de direcciones.
   *
   * Este método permite establecer el correo electrónico en el grupo de direcciones del receptor.
   *
   * @param {string} correoElectronico - El correo electrónico a establecer.
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
   * Actualiza el correo electrónico en el grupo de direcciones.
   *
   * Este método permite establecer el correo electrónico en el grupo de direcciones del receptor.
   *
   * @param {string} correoElectronico - El correo electrónico a establecer.
   */
  public setGrupoDeDireccionesPais(
    pais: string
  ): void {
    this.update((state) => ({
      ...state,
      grupoDeDirecciones: { ...state.grupoDeDirecciones, pais },
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
   * @param {string} nombreExportador - El nombre del exportador a establecer.
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
   * Actualiza la lada en el grupo representativo.
   *
   * Este método permite establecer la lada en el grupo representativo del trámite.
   *
   * @param {string} lada - La lada a establecer.
   */
  public setGrupoRepresentativoLada(lada: string): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo: { ...state.grupoRepresentativo, lada },
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
   * Actualiza el fax en el grupo representativo.
   *
   * Este método permite establecer el fax en el grupo representativo del trámite.
   *
   * @param {string} fax - El fax a establecer.
   */
  public setGrupoRepresentativoFax(fax: string): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo: { ...state.grupoRepresentativo, fax },
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

  /**
   * Actualiza el puerto de embarque en el grupo de transporte.
   *
   * Este método permite establecer el puerto de embarque en el grupo de transporte del trámite.
   *
   * @param {string} puertoEmbarque - El puerto de embarque a establecer.
   */
  public setgrupoDeTransportePuertoEmbarque(puertoEmbarque: string): void {
    this.update((state) => ({
      ...state,
      grupoDeTransporte: { ...state.grupoDeTransporte, puertoEmbarque },
    }));
  }

  /**
   * Actualiza el puerto de desembarque en el grupo de transporte.
   *
   * Este método permite establecer el puerto de desembarque en el grupo de transporte del trámite.
   *
   * @param {string} puertoDesembarque - El puerto de desembarque a establecer.
   */
  public setgrupoDeTransportePuertoDesembarque(
    puertoDesembarque: string
  ): void {
    this.update((state) => ({
      ...state,
      grupoDeTransporte: { ...state.grupoDeTransporte, puertoDesembarque },
    }));
  }

  /**
   * Actualiza el puerto de tránsito en el grupo de transporte.
   *
   * Este método permite establecer el puerto de tránsito en el grupo de transporte del trámite.
   *
   * @param {string} puertoTransito - El puerto de tránsito a establecer.
   */
  public setgrupoDeTransportePuertoTransito(puertoTransito: string): void {
    this.update((state) => ({
      ...state,
      grupoDeTransporte: { ...state.grupoDeTransporte, puertoTransito },
    }));
  }

  /**
   * Actualiza el nombre de la embarcación en el grupo de transporte.
   *
   * Este método permite establecer el nombre de la embarcación en el grupo de transporte del trámite.
   *
   * @param {string} nombreEmbarcacion - El nombre de la embarcación a establecer.
   */
  public setgrupoDeTransporteNombreEmbarcacion(
    nombreEmbarcacion: string
  ): void {
    this.update((state) => ({
      ...state,
      grupoDeTransporte: { ...state.grupoDeTransporte, nombreEmbarcacion },
    }));
  }

  /**
   * Actualiza el número de vuelo en el grupo de transporte.
   *
   * Este método permite establecer el número de vuelo en el grupo de transporte del trámite.
   *
   * @param {string} numeroVuelo - El número de vuelo a establecer.
   */
  public setgrupoDeTransporteNumeroVuelo(numeroVuelo: string): void {
    this.update((state) => ({
      ...state,
      grupoDeTransporte: { ...state.grupoDeTransporte, numeroVuelo },
    }));
  }

  /**
   * Actualiza si hay un tercer operador involucrado.
   *
   * Este método permite establecer si hay un tercer operador involucrado en el trámite.
   *
   * @param {boolean} tercerOperador - Valor booleano que indica si hay un tercer operador.
   */
  public setTercerOperador(tercerOperador: boolean): void {
    this.update((state) => ({
      ...state,
      tercerOperador,
    }));
  }

  /**
   * Actualiza el nombre del operador en el grupo operador.
   *
   * Este método permite establecer el nombre del operador en el grupo operador del trámite.
   *
   * @param {string} nombre - El nombre del operador a establecer.
   */
  public setGrupoOperadorNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      grupoOperador: { ...state.grupoOperador, nombre },
    }));
  }

  /**
   * Actualiza el primer apellido del operador en el grupo operador.
   *
   * Este método permite establecer el primer apellido del operador en el grupo operador del trámite.
   *
   * @param {string} apellidoPrimer - El primer apellido del operador a establecer.
   */
  public setGrupoOperadorApellidoPrimer(apellidoPrimer: string): void {
    this.update((state) => ({
      ...state,
      grupoOperador: { ...state.grupoOperador, apellidoPrimer },
    }));
  }
  /**
   * Actualiza el segundo apellido del operador en el grupo operador.
   *
   * Este método permite establecer el segundo apellido del operador en el grupo operador del trámite.
   *
   * @param {string} apellidoSegundo - El segundo apellido del operador a establecer.
   */
  public setGrupoOperadorSegundo(apellidoSegundo: string): void {
    this.update((state) => ({
      ...state,
      grupoOperador: { ...state.grupoOperador, apellidoSegundo },
    }));
  }

  /**
   * Actualiza el número fiscal del operador en el grupo operador.
   *
   * Este método permite establecer el número fiscal del operador en el grupo operador del trámite.
   *
   * @param {string} numeroFiscal - El número fiscal del operador a establecer.
   */
  public setGrupoOperadorNumeroFiscal(numeroFiscal: string): void {
    this.update((state) => ({
      ...state,
      grupoOperador: { ...state.grupoOperador, numeroFiscal },
    }));
  }

  /**
   * Actualiza la razón social del operador en el grupo operador.
   *
   * Este método permite establecer la razón social del operador en el grupo operador del trámite.
   *
   * @param {string} razonSocial - La razón social del operador a establecer.
   */
  public setGrupoOperadorRazonSocial(razonSocial: string): void {
    this.update((state) => ({
      ...state,
      grupoOperador: { ...state.grupoOperador, razonSocial },
    }));
  }

  /**
   * Actualiza el país en el grupo de domicilio.
   *
   * Este método permite establecer el país en el grupo de domicilio del trámite.
   *
   * @param {string} pais - El país a establecer.
   */
  public setGrupoDeDomicilioPais(pais: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDomicilio: { ...state.grupoDeDomicilio, pais },
    }));
  }

  /**
   * Actualiza la ciudad en el grupo de domicilio.
   *
   * Este método permite establecer la ciudad en el grupo de domicilio del trámite.
   *
   * @param {string} ciudad - La ciudad a establecer.
   */
  public setGrupoDeDomicilioCiudad(ciudad: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDomicilio: { ...state.grupoDeDomicilio, ciudad },
    }));
  }

  /**
   * Actualiza la calle en el grupo de domicilio.
   *
   * Este método permite establecer la calle en el grupo de domicilio del trámite.
   *
   * @param {string} calle - La calle a establecer.
   */
  public setGrupoDeDomicilioCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDomicilio: { ...state.grupoDeDomicilio, calle },
    }));
  }

  /**
   * Actualiza el número o letra en el grupo de domicilio.
   *
   * Este método permite establecer el número o letra en el grupo de domicilio del trámite.
   *
   * @param {string} numeroLetra - El número o letra a establecer.
   */
  public setGrupoDeDomicilioNumeroLetra(numeroLetra: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDomicilio: { ...state.grupoDeDomicilio, numeroLetra },
    }));
  }

  /**
   * Actualiza la lada en el grupo de domicilio.
   *
   * Este método permite establecer la lada en el grupo de domicilio del trámite.
   *
   * @param {string} lada - La lada a establecer.
   */
  public setGrupoDeDomicilioLada(lada: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDomicilio: { ...state.grupoDeDomicilio, lada },
    }));
  }

  /**
   * Actualiza el teléfono en el grupo de domicilio.
   *
   * Este método permite establecer el teléfono en el grupo de domicilio del trámite.
   *
   * @param {string} telefono - El teléfono a establecer.
   */
  public setGrupoDeDomicilioTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDomicilio: { ...state.grupoDeDomicilio, telefono },
    }));
  }

  /**
   * Actualiza el fax en el grupo de domicilio.
   *
   * Este método permite establecer el fax en el grupo de domicilio del trámite.
   *
   * @param {string} fax - El fax a establecer.
   */
  public setGrupoDeDomicilioFax(fax: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDomicilio: { ...state.grupoDeDomicilio, fax },
    }));
  }

  /**
   * Actualiza el correo electrónico en el grupo de domicilio.
   *
   * Este método permite establecer el correo electrónico en el grupo de domicilio del trámite.
   *
   * @param {string} correoElectronico - El correo electrónico a establecer.
   */
  public setGrupoDeDomicilioCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({
      ...state,
      grupoDeDomicilio: { ...state.grupoDeDomicilio, correoElectronico },
    }));
  }

  /**
   * Actualiza todo el grupo de domicilio.
   *
   * Este método permite establecer todos los valores del grupo de domicilio del trámite.
   *
   * @param {GrupoDeDomicilio} grupoDeDomicilio - El objeto que contiene los valores del grupo de domicilio a establecer.
   */
  public setGrupoDeDomicilio(grupoDeDomicilio: GrupoDeDomicilio): void {
    this.update((state) => ({
      ...state,
      grupoDeDomicilio,
    }));
  }

  /**
   * Actualiza el tratado en el grupo tratado.
   *
   * Este método permite establecer el tratado en el grupo tratado del trámite.
   *
   * @param {string} tratado - El tratado a establecer.
   */
  public setGrupoTratadoTratado(tratado: string): void {
    this.update((state) => ({
      ...state,
      grupoTratado: { ...state.grupoTratado, tratado },
    }));
  }

  /**
   * Actualiza el país en el grupo tratado.
   *
   * Este método permite establecer el país en el grupo tratado del trámite.
   *
   * @param {string} pais - El país a establecer.
   */
  public setGrupoTratadoPais(pais: string): void {
    this.update((state) => ({
      ...state,
      grupoTratado: { ...state.grupoTratado, pais },
    }));
  }

  /**
   * Actualiza todo el grupo tratado.
   *
   * Este método permite establecer todos los valores del grupo tratado del trámite.
   *
   * @param {GrupoTratado} grupoTratado - El objeto que contiene los valores del grupo tratado a establecer.
   */
  public setGrupoTratado(grupoTratado: GrupoTratado): void {
    this.update((state) => ({
      ...state,
      grupoTratado,
    }));
  }

  /**
   * Actualiza la fracción arancelaria en el grupo tratado.
   *
   * Este método permite establecer la fracción arancelaria en el grupo tratado del trámite.
   *
   * @param {string} fraccionArancelaria - La fracción arancelaria a establecer.
   */
  public setGrupoTratadoFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      grupoTratado: { ...state.grupoTratado, fraccionArancelaria },
    }));
  }

  /**
   * Actualiza el número de registro en el grupo tratado.
   *
   * Este método permite establecer el número de registro en el grupo tratado del trámite.
   *
   * @param {string} numeroRegistro - El número de registro a establecer.
   */
  public setGrupoTratadoNumeroRegistro(numeroRegistro: string): void {
    this.update((state) => ({
      ...state,
      grupoTratado: { ...state.grupoTratado, numeroRegistro },
    }));
  }

  /**
   * Actualiza el nombre comercial en el grupo tratado.
   *
   * Este método permite establecer el nombre comercial en el grupo tratado del trámite.
   *
   * @param {string} nombreComercial - El nombre comercial a establecer.
   */
  public setGrupoTratadoNombreComercial(nombreComercial: string): void {
    this.update((state) => ({
      ...state,
      grupoTratado: { ...state.grupoTratado, nombreComercial },
    }));
  }

  /**
   * Actualiza la fecha final en el grupo tratado.
   *
   * Este método permite establecer la fecha final en el grupo tratado del trámite.
   *
   * @param {string} fechaFinalInput - La fecha final a establecer.
   */
  public setGrupoTratadoFechaFinalInput(fechaFinalInput: string): void {
    this.update((state) => ({
      ...state,
      grupoTratado: { ...state.grupoTratado, fechaFinalInput },
    }));
  }

  /**
   * Actualiza la fecha inicial en el grupo tratado.
   *
   * Este método permite establecer la fecha inicial en el grupo tratado del trámite.
   *
   * @param {string} fechaInicialInput - La fecha inicial a establecer.
   */
  public setGrupoTratadoFechaInicialInput(fechaInicialInput: string): void {
    this.update((state) => ({
      ...state,
      grupoTratado: { ...state.grupoTratado, fechaInicialInput },
    }));
  }

  /**
   * Actualiza la fracción arancelaria de la mercancía en el formulario de mercancía.
   *
   * Este método permite establecer la fracción arancelaria de la mercancía en el formulario.
   *
   * @param {string} fraccionMercanciaArancelaria - La fracción arancelaria de la mercancía a establecer.
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
   * Actualiza el nombre comercial de la mercancía en el formulario de mercancía.
   *
   * Este método permite establecer el nombre comercial de la mercancía en el formulario.
   *
   * @param {string} nombreComercialDelaMercancia - El nombre comercial de la mercancía a establecer.
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
   * Actualiza el nombre técnico de la mercancía en el formulario de mercancía.
   *
   * Este método permite establecer el nombre técnico de la mercancía en el formulario.
   *
   * @param {string} nombreTecnico - El nombre técnico de la mercancía a establecer.
   */
  public setNombreTecnico(nombreTecnico: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, nombreTecnico },
    }));
  }

  /**
   * Actualiza el nombre en inglés de la mercancía en el formulario de mercancía.
   *
   * Este método permite establecer el nombre en inglés de la mercancía en el formulario.
   *
   * @param {string} nombreEnIngles - El nombre en inglés de la mercancía a establecer.
   */
  public setNombreEnIngles(nombreEnIngles: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, nombreEnIngles },
    }));
  }

  /**
   * Actualiza las otras instancias relacionadas con la mercancía en el formulario de mercancía.
   *
   * Este método permite establecer las otras instancias relacionadas con la mercancía en el formulario.
   *
   * @param {string} otrasInstancias - Las otras instancias a establecer.
   */
  public setOtrasInstancias(otrasInstancias: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, otrasInstancias },
    }));
  }

  /**
   * Actualiza el criterio para conferir en el formulario de mercancía.
   *
   * Este método permite establecer el criterio para conferir en el formulario de mercancía.
   *
   * @param {string} criterioParaConferir - El criterio para conferir a establecer.
   */
  public setCriterioParaConferir(criterioParaConferir: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: {
        ...state.formularioMercancia,
        criterioParaConferir,
      },
    }));
  }

  /**
   * Actualiza la cantidad de la mercancía en el formulario de mercancía.
   *
   * Este método permite establecer la cantidad de la mercancía en el formulario.
   *
   * @param {string} cantidad - La cantidad de la mercancía a establecer.
   */
  public setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, cantidad },
    }));
  }

  /**
   * Actualiza el valor de la mercancía en el formulario de mercancía.
   *
   * Este método permite establecer el valor de la mercancía en el formulario.
   *
   * @param {string} valorDelaMercancia - El valor de la mercancía a establecer.
   */
  public setValorDelaMercancia(valorDelaMercancia: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, valorDelaMercancia },
    }));
  }

  /**
   * Actualiza el complemento de la descripción en el formulario de mercancía.
   *
   * Este método permite establecer el complemento de la descripción de la mercancía en el formulario.
   *
   * @param {string} complementoDelaDescripcion - El complemento de la descripción a establecer.
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
   * Actualiza el número de factura en el formulario de mercancía.
   *
   * Este método permite establecer el número de factura en el formulario.
   *
   * @param {string} numeroFactura - El número de factura a establecer.
   */
  public setNumeroFactura(numeroFactura: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, numeroFactura },
    }));
  }

  /**
   * Actualiza el tipo de factura en el formulario de mercancía.
   *
   * Este método permite establecer el tipo de factura en el formulario.
   *
   * @param {string} tipoFactura - El tipo de factura a establecer.
   */
  public setTipoFactura(tipoFactura: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, tipoFactura },
    }));
  }

  /**
   * Actualiza la fecha en el formulario de mercancía.
   *
   * Este método permite establecer la fecha en el formulario.
   *
   * @param {string} fecha - La fecha a establecer.
   */
  public setFecha(fecha: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, fecha },
    }));
  }

  /**
   * Actualiza el país en el formulario de mercancía.
   *
   * Este método permite establecer el país relacionado con la mercancía en el formulario.
   *
   * @param {string} pais - El país a establecer.
   */
  public setPais(pais: string): void {
    this.update((state) => ({
      ...state,
      formularioMercancia: { ...state.formularioMercancia, pais },
    }));
  }

  /**
   *  Actualiza el estado del trámite con los datos del formulario de mercancía.
   *  Este método permite establecer los datos del formulario de mercancía en el estado del trámite.
   *  @param {FormularioMercancia} formularioMercancia - Objeto que contiene los datos del formulario de mercancía.
   */
  public setGrupoOperador(grupoOperador: GrupoOperador): void {
    this.update((state) => ({
      ...state,
      grupoOperador,
    }));
  }

  /**
   * Actualiza el grupo representativo en el estado del trámite.
   *  Este método permite establecer los datos del grupo representativo en el estado del trámite.
   * @param {GrupoRepresentativo} grupoRepresentativo - Objeto que contiene los datos del grupo representativo.
   *  @returns {void}
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
   * Actualiza el estado del trámite con los datos del formulario de mercancía.
   *  Este método permite establecer los datos del formulario de mercancía en el estado del trámite.
   * @param {FormularioMercancia} formularioMercancia - Objeto que contiene los datos del formulario de mercancía.
   *  @returns {void}
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
   * Actualiza la información de las mercancías disponibles en la tabla de datos.
   *  Este método permite establecer los datos de las mercancías disponibles en la tabla de datos del trámite.
   * @param {DisponiblesTabla[]} mercanciaDisponsiblesTablaDatos - Lista de mercancías disponibles en la tabla de datos.
   *  @returns {void}
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
   * Actualiza el grupo de transporte en el estado del trámite.
   *  Este método permite establecer los datos del grupo de transporte del trámite.
   * @param {GrupoDeTransporte} grupoDeTransporte - Objeto que contiene los datos del grupo de transporte.
   *   @returns {void}
   */
  public setGrupoDeTransporte(grupoDeTransporte: GrupoDeTransporte): void {
    this.update((state) => ({
      ...state,
      grupoDeTransporte,
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
   * Actualiza el estado del trámite con los datos del grupo receptor.
   *  Este método permite establecer los datos del grupo receptor en el estado del trámite.
   * @param {GrupoReceptor} grupoReceptor - Objeto que contiene los datos del grupo receptor.
   *  @returns {void}
   */
  public setGrupoReceptor(grupoReceptor: GrupoReceptor): void {
    this.update((state) => ({
      ...state,
      grupoReceptor,
    }));
  }


  /**
   * Actualiza la información del grupo de direcciones en el estado del trámite.
   *
   * Este método permite establecer los datos del grupo de direcciones del receptor.
   *
   * @param {GrupoDeDirecciones} grupoDeDirecciones - Objeto que contiene la información de las direcciones a actualizar.
   * @returns {void}
   */
  public setGrupoDeDirecciones(grupoDeDirecciones: GrupoDeDirecciones): void {
    this.update((state) => ({
      ...state,
      grupoDeDirecciones,
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