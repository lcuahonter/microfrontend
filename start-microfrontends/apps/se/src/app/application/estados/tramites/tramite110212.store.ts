import {
  AgregarDatosProductorFormulario,
  DisponiblesTabla,
  FormularioMercancia,
  GrupoCertificadoOrigen,
  GrupoTratado,
} from '../../tramites/110212/models/validacion-posteriori.model';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { GrupoDeDirecciones } from '../../tramites/110212/models/validacion-posteriori.model';
import { GrupoOperador } from '../../tramites/110212/models/validacion-posteriori.model';
import { GrupoReceptor } from '../../tramites/110212/models/validacion-posteriori.model';
import { GrupoRepresentativo } from '../../tramites/110212/models/validacion-posteriori.model';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../shared/models/modificacion.enum';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
/**
 * Interfaz que define el estado inicial del trámite 110212.
 *
 * Esta interfaz contiene todas las propiedades necesarias para gestionar el estado
 * del trámite, incluyendo datos del productor, receptor, transporte, mercancía, entre otros.
 */
export interface Tramite110212State {
  id: number | null;
  /** ID de la solicitud */
  idSolicitud: number | null;

  /**
   * El valor de observaciones.
   */
  observaciones: string;

  /**
   * Lista de mercancías disponibles.
   * 
   * @type {Mercancia[]}
   */
  disponiblesDatos: Mercancia[];

  /** Lista de idiomas disponibles. */
  idioma: string | null;

  /** Lista de idiomas disponibles como catálogo */
  idiomaDatos: Catalogo[];

  /** Lista de entidades federativas disponibles */
  entidadFederativaDatos: Catalogo[];

  /**
 * Entidad federativa seleccionada.
 */
  entidadFederativa: string | null;


  /** Lista de representaciones federales disponibles */
  representacionFederalDatos: Catalogo[];

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
   * Información de contacto del certificado de origen.
   */
  grupoCertificadoOrigen: GrupoCertificadoOrigen;

  /**
   * Información representativa del trámite.
   */
  grupoRepresentativo: GrupoRepresentativo;

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
   * Información del tratado comercial.
   */
  grupoTratado: GrupoTratado;

  /**
   * Información del formulario de mercancía.
   */
  formularioMercancia: FormularioMercancia;
  /**
   * @property {SeleccionadasTabla[]} mercanciaSeleccionadasTablaDatos
   * @description Lista de mercancías seleccionadas para ser mostradas en la tabla de datos.
   *
   * Contiene los datos de las mercancías que han sido seleccionadas por el usuario durante el trámite.
   */
  mercanciaSeleccionadasTablaDatos: Mercancia[];
  /**
   * @property {DisponiblesTabla[]} mercanciaDisponsiblesTablaDatos
   * @description Lista de mercancías disponibles para ser mostradas en la tabla de datos.
   *
   * Contiene los datos de las mercancías que están disponibles para ser seleccionadas por el usuario durante el trámite.
   */
  mercanciaDisponsiblesTablaDatos: DisponiblesTabla[];
  /** Formulario con los datos específicos del destinatario */
  formDatosDelDestinatario: { [key: string]: unknown };
  /** Formulario general del destinatario */
  formDestinatario: { [key: string]: unknown };
 /**
   * @description
   * Objeto que almacena los valores del formulario de mercancía.
   */
  mercanciaForm: { [key: string]: unknown };
  /**
   * Datos del formulario relacionados con los detalles del certificado.
   * Estructura dinámica y flexible.
   */
  formDatosCertificado: { [key: string]: unknown };

  /** Representación federal seleccionada */
  representacionFederalSeleccion: Catalogo;

  /**
   * Objeto que contiene banderas booleanas para validar formularios.
   * Cada clave representa una sección del formulario.
   */
  formaValida: { [key: string]: boolean };
  /**
 * @description
 * Objeto que contiene los valores actuales del formulario de certificado.
 */
  formCertificado: { [key: string]: unknown };
}

/**
 * Función que crea el estado inicial del trámite 110212.
 *
 * @returns {Tramite110212State} El estado inicial del trámite.
 */
export function createInitialState(): Tramite110212State {
  return {
    id: null,
    idSolicitud: 0,
    observaciones: '',
    pasoActivo: 1,
    pestanaActiva: 1,
    idioma: null,
    /** Lista de idiomas disponibles */
    idiomaDatos: [],
    /** Lista de entidades federativas disponibles */
    entidadFederativaDatos: [],
    /** Lista de representaciones federales disponibles */
    representacionFederalDatos: [],
    entidadFederativa: null,
    representacionFederal: null,
    datosConfidencialesProductor: false,
    productorMismoExportador: false,
    disponiblesDatos: [],
    agregarDatosProductorFormulario: {
      numeroRegistroFiscal: '',
      fax: '',
    },
    grupoReceptor: {
      nombre: '',
      apellidoPrimer: '',
      apellidoSegundo: '',
      numeroFiscal: '',
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
      pais: '',
    },
    grupoCertificadoOrigen: {
      pais: '',
      ciudad: '',
      calle: '',
      numeroLetra: '',
      lada: '',
      telefono: '',
      fax: '',
      correoElectronico: '',
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
    tercerOperador: false,
    grupoOperador: {
      nombre: '',
      apellidoPrimer: '',
      apellidoSegundo: '',
      numeroFiscal: '',
      razonSocial: '',
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
    /** Formulario con información fiscal y general del destinatario */
    formDatosDelDestinatario: {
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      numeroDeRegistroFiscal: '',
      razonSocial: ''
    },
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

    /** Formulario de datos adicionales del certificado */
    formDatosCertificado: {
      observacionesDates: '',
      idiomaDates: '',
      precisaDates: '',
      EntidadFederativaDates: '',
      representacionFederalDates: '',
    },
    /** Representación federal seleccionada */
    representacionFederalSeleccion: { id: -1, descripcion: '' },
    /** Estado de validación de los diferentes formularios */
    formaValida: {
      certificado: true,
      datos: true,
      destinatrio: true,
      datosDestinatario: true,
    },
  };
}
/**
 * Servicio para gestionar el estado del trámite 110212.
 *
 * Este servicio utiliza Akita para manejar el estado del trámite, permitiendo
 * actualizaciones y consultas de las propiedades definidas en el estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite110212', resettable: true })
export class Tramite110212Store extends Store<Tramite110212State> {
  /**
   * Constructor de la clase Tramite110212Store.
   *
   * Inicializa el estado del trámite utilizando la función `createInitialState`.
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
   * @param {Catalogo[]} idioma - El idioma a establecer.
   */
  public setIdioma(idioma: string | null): void {
    this.update((state) => ({
      ...state,
      idioma,
    }));
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
 * Actualiza la entidad federativa seleccionada para el trámite.
 *
 * Este método permite establecer la entidad federativa seleccionada en el trámite.
 *
 * @param {string} entidadFederativa - La entidad federativa a establecer.
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
  public setGrupoReceptorNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, nombre },
    }));
  }

  /**
   * Actualiza el primer apellido del receptor en el grupo receptor.
   *
   * Este método permite establecer el primer apellido del receptor en el grupo receptor.
   *
   * @param {string} apellidoPrimer - El primer apellido del receptor a establecer.
   */
  public setGrupoReceptorApellidoPrimer(apellidoPrimer: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, apellidoPrimer },
    }));
  }

  /**
   * Actualiza el segundo apellido del receptor en el grupo receptor.
   *
   * Este método permite establecer el segundo apellido del receptor en el grupo receptor.
   *
   * @param {string} apellidoSegundo - El segundo apellido del receptor a establecer.
   */
  public setGrupoReceptorApellidoSegundo(apellidoSegundo: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, apellidoSegundo },
    }));
  }

  /**
   * Actualiza el número fiscal del receptor en el grupo receptor.
   *
   * Este método permite establecer el número fiscal del receptor en el grupo receptor.
   *
   * @param {string} numeroFiscal - El número fiscal del receptor a establecer.
   */
  public setGrupoReceptorNumeroFiscal(numeroFiscal: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, numeroFiscal },
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
   * Actualiza el país en el grupo certificado de origen.
   *
   * Este método permite establecer el país en el grupo certificado de origen.
   *
   * @param {string} pais - El país a establecer.
   */
  public setGrupoCertificadoOrigenPais(pais: string): void {
    this.update((state) => ({
      ...state,
      grupoCertificadoOrigen: { ...state.grupoCertificadoOrigen, pais },
    }));
  }

  /**
   * Actualiza la ciudad en el grupo certificado de origen.
   *
   * Este método permite establecer la ciudad en el grupo certificado de origen.
   *
   * @param {string} ciudad - La ciudad a establecer.
   */
  public setGrupoCertificadoOrigenCiudad(ciudad: string): void {
    this.update((state) => ({
      ...state,
      grupoCertificadoOrigen: { ...state.grupoCertificadoOrigen, ciudad },
    }));
  }

  /**
   * Actualiza la calle en el grupo certificado de origen.
   *
   * Este método permite establecer la calle en el grupo certificado de origen.
   *
   * @param {string} calle - La calle a establecer.
   */
  public setGrupoCertificadoOrigenCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      grupoCertificadoOrigen: { ...state.grupoCertificadoOrigen, calle },
    }));
  }

  /**
   * Actualiza el número y/o letra en el grupo certificado de origen.
   *
   * Este método permite establecer el número y/o letra en el grupo certificado de origen.
   *
   * @param {string} numeroLetra - El número y/o letra a establecer.
   */
  public setGrupoCertificadoOrigenNumeroLetra(numeroLetra: string): void {
    this.update((state) => ({
      ...state,
      grupoCertificadoOrigen: { ...state.grupoCertificadoOrigen, numeroLetra },
    }));
  }

  /**
   * Actualiza la lada en el grupo certificado de origen.
   *
   * Este método permite establecer la lada en el grupo certificado de origen.
   *
   * @param {string} lada - La lada a establecer.
   */
  public setGrupoCertificadoOrigenLada(lada: string): void {
    this.update((state) => ({
      ...state,
      grupoCertificadoOrigen: { ...state.grupoCertificadoOrigen, lada },
    }));
  }

  /**
   * Actualiza el teléfono en el grupo certificado de origen.
   *
   * Este método permite establecer el teléfono en el grupo certificado de origen.
   *
   * @param {string} telefono - El teléfono a establecer.
   */
  public setGrupoCertificadoOrigenTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      grupoCertificadoOrigen: { ...state.grupoCertificadoOrigen, telefono },
    }));
  }

  /**
   * Actualiza el fax en el grupo certificado de origen.
   *
   * Este método permite establecer el fax en el grupo certificado de origen.
   *
   * @param {string} fax - El fax a establecer.
   */
  public setGrupoCertificadoOrigenFax(fax: string): void {
    this.update((state) => ({
      ...state,
      grupoCertificadoOrigen: { ...state.grupoCertificadoOrigen, fax },
    }));
  }

  /**
   * Actualiza el correo electrónico en el grupo certificado de origen.
   *
   * Este método permite establecer el correo electrónico en el grupo certificado de origen.
   *
   * @param {string} correoElectronico - El correo electrónico a establecer.
   */
  public setGrupoCertificadoOrigenCorreoElectronico(
    correoElectronico: string
  ): void {
    this.update((state) => ({
      ...state,
      grupoCertificadoOrigen: {
        ...state.grupoCertificadoOrigen,
        correoElectronico,
      },
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
   * @method setGrupoOperador
   * @description Actualiza la información del operador en el estado del trámite.
   *
   * Este método permite establecer los datos del operador en el grupo operador del estado.
   *
   * @param {GrupoOperador} grupoOperador - Objeto que contiene la información del operador a actualizar.
   *
   * @returns {void}
   */
  public setGrupoOperador(grupoOperador: GrupoOperador): void {
    this.update((state) => ({
      ...state,
      grupoOperador,
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
  public setMercanciaTablaDatos(mercanciaSeleccionadasTablaDatos: Mercancia[]): void {
    this.update((STATE) => {
      const LISTAEXISTENTE = STATE.mercanciaSeleccionadasTablaDatos || [];
      const NUEVOARTICULO = { ...mercanciaSeleccionadasTablaDatos[0] };

      if (NUEVOARTICULO.id === 0) {
        // Agregar nuevo elemento con una identificación generada
        NUEVOARTICULO.id = (LISTAEXISTENTE.length || 0) + 1;
        const UPDATEDLIST = [...LISTAEXISTENTE, NUEVOARTICULO];
        return { ...STATE, mercanciaSeleccionadasTablaDatos: UPDATEDLIST };
      }

      // Actualizar el elemento existente cuando id > 0
      const UPDATEDLIST = LISTAEXISTENTE.map((ITEM) =>
        ITEM.id === NUEVOARTICULO.id ? { ...ITEM, ...NUEVOARTICULO } : ITEM
      );
      return { ...STATE, mercanciaSeleccionadasTablaDatos: UPDATEDLIST };
    });
  }

  /**
   * @method updateMercanciaSeleccionadasTablaDatos
   * @description Actualiza la lista de mercancías seleccionadas en la tabla de datos del estado del trámite.
   * *
   * Este método permite actualizar las mercancías seleccionadas por el usuario en la tabla de datos.
   */
  updateMercanciaSeleccionadasTablaDatos(mercanciaSeleccionadasTablaDatos: Mercancia[]): void {
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
   * Actualiza el estado del formulario de datos del destinatario con nuevos valores
   * @param values Objeto con los valores a actualizar en el formulario.
   */
  setFormDatosDelDestinatario(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      formDatosDelDestinatario: {
        ...state.formDatosDelDestinatario, ...values,
      },
    }));
  }
  /*
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
   * @method setFormDestinatario
   * @description
   * Actualiza el estado de datos del destinatario en el almacén.
   * @param datosDestinatario Objeto que contiene los datos del destinatario a actualizar.
   * */
  setFormDestinatario(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      formDestinatario: {
        ...state.formDestinatario,
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
 * @method setBloque
 * @description
 * Actualiza los bloques de países en el almacén.
 * @param paisBloques Array de objetos `Catalogo` que representa los bloques de países.
 */
  setBloque(paisBloques: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      paisBloques,
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

}
