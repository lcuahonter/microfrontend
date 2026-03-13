import { Store, StoreConfig } from '@datorama/akita';
import { ColumnasTabla } from '../models/certificado.model';
import { Injectable } from '@angular/core';

/**
 * Representa un catálogo con un identificador y una descripción.
 */
export interface Catalogo {
  /** Identificador único del catálogo. */
  id: number;

  /** Descripción del catálogo. */
  descripcion: string;

  /** Clave única del catálogo para identificación interna. */
  clave?: string;
}

/**
 * Representa una mercancía asociada al certificado.
 */
export interface MercanciaCertificado {
  /** Número de orden de la mercancía. */
  numeroOrden: number;

  /** Fracción arancelaria de la mercancía. */
  fraccionArancelaria: string;

  /** Nombre técnico de la mercancía. */
  nombreTecnico: string;

  /** Nombre comercial de la mercancía. */
  nombreComercial: string;

  /** Nombre en inglés de la mercancía. */
  nombreIngles: string;

  /** Descripción complementaria de la mercancía. */
  complementoDescripcion: string;

  /** Número de certificado asociado a la mercancía. */
  numeroCertificado: string;

  /** País o bloque asociado a la mercancía. */
  pais: string;

  /** Tratado o acuerdo asociado a la mercancía. */
  tratado: string;

  /** Fecha de expedición del certificado. */
  fechaExpedicion: string;

  /** Fecha de vencimiento del certificado. */
  fechaVencimiento: string;
}

/**
 * Representa un productor asociado al certificado.
 */
export interface ProductorAsociado {
  /** Identificador único del productor. */
  id: number;

  /** Nombre del productor. */
  nombre: string;

  /** Dirección del productor. */
  direccion: string;

  /** País del productor. */
  pais: string;
}

/**
 * Representa los datos del formulario de validación para la búsqueda de certificados.
 */
export interface ValidacionForm {
  /** Número de certificado asociado al trámite. */
  numeroCertificado: string;
  
  /** Lista de tratados o acuerdos comerciales seleccionados. */
  tratado: Catalogo[];
  
  /** Lista de países o bloques comerciales seleccionados. */
  pais: Catalogo[];
  
  /** Fecha inicial del rango de búsqueda en formato string. */
  fechaInicial: string;
  
  /** Fecha final del rango de búsqueda en formato string. */
  fechaFinal: string;
}

/**
 * Estado inicial para la interfaz del trámite 110219.
 */
export interface Solicitud110219State {
  /** ID de la solicitud */
  idSolicitud: number | null;

  /** Lista de catálogos disponibles. */
  catalogos: Catalogo[];

  /** Lista de mercancías asociadas al certificado. */
  mercancias: MercanciaCertificado[];

  /** Lista de productores asociados al certificado. */
  productores: ProductorAsociado[];

  /** Datos del formulario de validación para la búsqueda de certificados. */
  validacionForm: ValidacionForm;

  /** Paso actual del asistente. */
  pasoActual: number;

  /** Indica si el certificado de origen está habilitado. */
  certificadoDeOrigen: string;

  /** Número de certificado asociado al trámite. */
  numeroCertificado: string;

  /** Lista de países asociados al trámite. */
  pais: Catalogo[];

  /** Lista de tratados asociados al trámite. */
  tratado: Catalogo[];

  /** Fecha inicial del trámite. */
  fechaInicial: string;

  /** Fecha final del trámite. */
  fechaFinal: string;

  /** Motivo de cancelación del trámite. */
  motivoCancelacion: string;

  /** Fecha de expedición del certificado. */
  fechaExpedicion: string;

  /** Fecha de vencimiento del certificado. */
  fechaVencimiento: string;
  
  /** Bloque comercial asociado al trámite. */
  bloque: string;
  
  /** Acuerdo comercial asociado al trámite. */
  acuerdo: string;
  
  /** Observaciones adicionales del trámite. */
  observaciones: string;
  
  /** Nombre del solicitante. */
  nombre: string;
  
  /** Primer apellido del solicitante. */
  primerApellido: string;
  
  /** Segundo apellido del solicitante. */
  segundoApellido: string;
  
  /** Registro fiscal (RFC) del solicitante. */
  registroFiscal: string;
  
  /** Razón social del solicitante. */
  razonSocial: string;
  
  /** Calle del domicilio fiscal del solicitante. */
  calle: string;
  
  /** Número y letra del domicilio fiscal del solicitante. */
  numeroLetra: string;
  
  /** Teléfono de contacto del solicitante. */
  telefono: number;
  
  /** Ciudad del domicilio fiscal del solicitante. */
  ciudad: number;
  
  /** Fax de contacto del solicitante. */
  fax: number;
  
  /** Correo electrónico de contacto del solicitante. */
  correoElectronico: string;

  /**
   * Representa el estado de la solicitud para el trámite 110219.
   * Contiene información relevante sobre la solicitud, incluyendo datos del solicitante,
   * mercancías, productores, fechas, catálogos, certificados y otros detalles asociados al trámite.
   */
  columnasTabla: ColumnasTabla[];
}

/**
 * Crea el estado inicial para la solicitud del trámite 110219.
 * @returns Estado inicial de tipo `Solicitud110219State`.
 */
export function createInitialState(): Solicitud110219State {
  return {
    idSolicitud: 0,
    catalogos: [],
    mercancias: [],
    productores: [],
    validacionForm: {
      numeroCertificado: '',
      tratado: [],
      pais: [],
      fechaInicial: '',
      fechaFinal: ''
    },
    pasoActual: 1,
    certificadoDeOrigen: '',
    numeroCertificado: '',
    pais: [],
    tratado: [],
    fechaInicial: '',
    fechaFinal: '',
    motivoCancelacion: '',
    fechaExpedicion: '',
    fechaVencimiento: '',
    bloque: '',
    acuerdo: '',
    observaciones: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    registroFiscal: '',
    razonSocial: '',
    calle: '',
    numeroLetra: '',
    telefono: 0,
    ciudad: 0,
    fax: 0,
    correoElectronico: '',
    columnasTabla: [],
  };
}

/**
 * Clase que representa el almacén de datos para el trámite 110219.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite110219', resettable: true })
export class Tramite110219Store extends Store<Solicitud110219State> {
  /**
   * Constructor del almacén.
   * Inicializa el estado con los valores predeterminados.
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
   * Actualiza el número de certificado en el estado.
   * @param numeroCertificado Número de certificado a actualizar.
   */
  public setNumeroCertificado(numeroCertificado: string): void {
    this.update((state) => ({ ...state, numeroCertificado }));
  }

  /**
   * Actualiza la lista de países en el estado.
   * @param pais Lista de países a actualizar.
   */
  public setPais(pais: Catalogo[]): void {
    this.update((state) => ({ ...state, pais }));
  }

  /**
   * Actualiza la lista de tratados en el estado.
   * @param tratado Lista de tratados a actualizar.
   */
  public setTratado(tratado: Catalogo[]): void {
    this.update((state) => ({ ...state, tratado }));
  }

  /**
   * Actualiza la fecha inicial en el estado.
   * @param fechaInicial Fecha inicial a actualizar.
   */
  public setFechaInicial(fechaInicial: string): void {
    this.update((state) => ({ ...state, fechaInicial }));
  }

  /**
   * Actualiza la fecha final en el estado.
   * @param fechaFinal Fecha final a actualizar.
   */
  public setFechaFinal(fechaFinal: string): void {
    this.update((state) => ({ ...state, fechaFinal }));
  }

  /**
   * Actualiza el motivo de cancelación en el estado.
   * @param motivoCancelacion Motivo de cancelación a actualizar.
   */
  public setMotivoCancelacion(motivoCancelacion: string): void {
    this.update((state) => ({ ...state, motivoCancelacion }));
  }

  /**
   * Actualiza el certificado de origen en el estado.
   * @param certificadoDeOrigen Certificado de origen a actualizar.
   */
  public setCertificadoDeorigen(certificadoDeOrigen: string): void {
    this.update((state) => ({ ...state, certificadoDeOrigen }));
  }
  /**
   * Actualiza la fecha de expedición en el estado.
   * @param fechaExpedicion Fecha de expedición a actualizar.
   */
  public setFechaExpedicion(fechaExpedicion: string): void {
    this.update((state) => ({ ...state, fechaExpedicion }));
  }

  /**
   * Actualiza la fecha de vencimiento en el estado.
   * @param fechaVencimiento Fecha de vencimiento a actualizar.
   */
  public setFechaVencimiento(fechaVencimiento: string): void {
    this.update((state) => ({ ...state, fechaVencimiento }));
  }

  /**
   * Actualiza el bloque comercial en el estado.
   * @param bloque Bloque comercial a actualizar.
   */
  public setBloque(bloque: string): void {
    this.update((state) => ({ ...state, bloque }));
  }

  /**
   * Actualiza el acuerdo comercial en el estado.
   * @param acuerdo Acuerdo comercial a actualizar.
   */
  public setAcuerdo(acuerdo: string): void {
    this.update((state) => ({ ...state, acuerdo }));
  }

  /**
   * Actualiza el valor de observaciones en el estado.
   * @param observaciones Valor a actualizar.
   */
  public setObservaciones(observaciones: string): void {
    this.update((state) => ({ ...state, observaciones }));
  }

  /**
   * Actualiza el valor de nombre en el estado.
   * @param nombre Valor a actualizar.
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({ ...state, nombre }));
  }

  /**
   * Actualiza el valor de primerApellido en el estado.
   * @param primerApellido Valor a actualizar.
   */
  public setPrimerApellido(primerApellido: string): void {
    this.update((state) => ({ ...state, primerApellido }));
  }

  /**
   * Actualiza el valor de segundoApellido en el estado.
   * @param segundoApellido Valor a actualizar.
   */
  public setSegundoApellido(segundoApellido: string): void {
    this.update((state) => ({ ...state, segundoApellido }));
  }

  /**
   * Actualiza el registro fiscal (RFC) en el estado.
   * @param registroFiscal Registro fiscal (RFC) a actualizar.
   */
  public setRegistroFiscal(registroFiscal: string): void {
    this.update((state) => ({ ...state, registroFiscal }));
  }

  /**
   * Actualiza el valor de razonSocial en el estado.
   * @param razonSocial Valor a actualizar.
   */
  public setRazonSocial(razonSocial: string): void {
    this.update((state) => ({ ...state, razonSocial }));
  }

  /**
   * Actualiza el valor de calle en el estado.
   * @param calle Valor a actualizar.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({ ...state, calle }));
  }

  /**
   * Actualiza el número y letra del domicilio en el estado.
   * @param numeroLetra Número y letra del domicilio a actualizar.
   */
  public setNumeroLetra(numeroLetra: string): void {
    this.update((state) => ({ ...state, numeroLetra }));
  }

  /**
   * Actualiza el número de teléfono de contacto en el estado.
   * @param telefono Número de teléfono a actualizar.
   */
  public setTelefono(telefono: number): void {
    this.update((state) => ({ ...state, telefono }));
  }

  /**
   * Actualiza la ciudad del domicilio fiscal en el estado.
   * @param ciudad Ciudad del domicilio fiscal a actualizar.
   */
  public setCiudad(ciudad: number): void {
    this.update((state) => ({ ...state, ciudad }));
  }

  /**
   * Actualiza el número de fax de contacto en el estado.
   * @param fax Número de fax a actualizar.
   */
  public setFax(fax: number): void {
    this.update((state) => ({ ...state, fax }));
  }

  /**
   * Actualiza el correo electrónico de contacto en el estado.
   * @param correoElectronico Dirección de correo electrónico a actualizar.
   */
  public setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({ ...state, correoElectronico }));
  }

  /**
   * Actualiza el formulario de validación completo en el estado.
   * @param validacionForm Datos del formulario de validación a actualizar.
   */
  public setValidacionForm(validacionForm: ValidacionForm): void {
    this.update((state) => ({ ...state, validacionForm }));
  }
}
