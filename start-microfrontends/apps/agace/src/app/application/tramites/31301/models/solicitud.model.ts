import { CatalogosSelect } from '@libs/shared/data-access-user/src';
/**
 * Representa los datos de una persona que desea recibir notificaciones.
 */
export interface RecibirNotificaciones {
  /** Registro Federal de Contribuyentes */
  rfc: string;

  /** Clave Única de Registro de Población */
  curp: string;

  /** Nombre del solicitante */
  nombre: string;

  /** Apellido paterno del solicitante */
  apellidoPaterno: string;

  /** Apellido materno del solicitante */
  apellidoMaterno: string;
}

/**
 * Representa los datos de modificación de la razón social o denominación.
 */
export interface ModificacionDenominacionRazonSocial {
  /** Razón social anterior de la empresa */
  razonSocialAnterior: string;

  /** Nueva razón social de la empresa */
  razonSocialActual: string;
}

/**
 * Representa la información relacionada con una garantía.
 */
export interface DatosPorGarantia {
  /** Póliza de fianza actual */
  polizaDeFianza: number | string;

  /** Número de folio de la garantía */
  numeroFolio: string;

  /** RFC de la institución que otorga la garantía */
  rfcInstitucion: string;

  /** Fecha de expedición de la garantía */
  fechaExpedicion: string;

  /** Fecha de inicio de vigencia (sin formato) */
  fechaInicioVigenciaNo: string;

  /** Fecha de fin de vigencia (sin formato) */
  fechaFinVigenciaNo: string;

  /** Fecha de inicio de vigencia (con formato) */
  fechaInicioVigencia: string;

  /** Fecha de fin de vigencia (con formato) */
  fechaFinVigencia: string;

  /** Importe total cubierto por la garantía */
  importeTotal: string;

  /** Monto de la ampliación de la garantía */
  montoAmpliaActual: string;

  /** Monto garantizado actual */
  montoGarantizadoActual: string;

  /**
   * Identificador de la póliza de fianza anterior.
   * Puede ser un número o una cadena según el contexto.
   */
  polizaDeFianzaAnterior: number | string;

  /**
   * Número de folio de la póliza de fianza anterior.
   */
  numeroFolioAnterior: string;

  /**
   * RFC de la institución emisora de la póliza de fianza anterior.
   */
  rfcInstitucionAnterior: string;

  /**
   * Fecha de expedición de la póliza de fianza anterior.
   */
  fechaExpedicionAnterior: string;

  /**
   * Fecha de inicio de vigencia no anterior de la póliza.
   */
  fechaInicioVigenciaNoAnterior: string;

  /**
   * Fecha de fin de vigencia no anterior de la póliza.
   */
  fechaFinVigenciaNoAnterior: string;

  /**
   * Fecha de inicio de vigencia anterior de la póliza.
   */
  fechaInicioVigenciaAnterior: string;

  /**
   * Fecha de fin de vigencia anterior de la póliza.
   */
  fechaFinVigenciaAnterior: string;

  /**
   * Importe total de la póliza de fianza anterior.
   */
  importeTotalAnterior: string;

  /**
   * Identificador de la póliza de fianza actual.
   * Puede ser un número o una cadena según el contexto.
   */
  polizaDeFianzaActual: number | string;

  /**
   * Número de folio de la póliza de fianza actual.
   */
  numeroFolioActual: string;

  /**
   * RFC de la institución emisora de la póliza de fianza actual.
   */
  rfcInstitucionActual: string;

  /**
   * Fecha de expedición de la póliza de fianza actual.
   */
  fechaExpedicionActual: string;

  /**
   * Fecha de inicio de vigencia no actual de la póliza.
   */
  fechaInicioVigenciaNoActual: string;

  /**
   * Fecha de fin de vigencia no actual de la póliza.
   */
  fechaFinVigenciaNoActual: string;

  /**
   * Fecha de inicio de vigencia actual de la póliza.
   */
  fechaInicioVigenciaActual: string;

  /**
   * Fecha de fin de vigencia actual de la póliza.
   */
  fechaFinVigenciaActual: string;
}

/**
 * Representa un grupo de opciones de tipo radio.
 */

export interface InputRadio {
  /** Opciones disponibles para seleccionar */
  radioOptions: {
    /** Etiqueta visible de la opción */
    label: string;

    /** Valor asociado a la opción */
    value: string | number;

    /** Texto auxiliar u orientativo */
    hint?: string;
  }[];

  /** Indica si la selección es obligatoria */
  isRequired: boolean;
}

/**
 * Representa los distintos radios disponibles para los datos generales de la solicitud.
 */
export interface DatosGeneralesDeLaSolicitudRadioLista {
  /** Tipo de endoso a seleccionar */
  tipoDeEndoso: InputRadio;

  /** Tipo de garantía que se presenta */
  tipoDeGarantia: InputRadio;

  /** Modalidad bajo la cual se otorga la garantía */
  modalidadDeLaGarantia: InputRadio;

  /** Tipo de sector al que pertenece la solicitud */
  tipoSector: InputRadio;

  /** Requisitos que deben cumplirse */
  requisitos: InputRadio;
}

/**
 * Representa los catálogos disponibles para los datos generales de la solicitud.
 */
export interface DatosGeneralesDeLaSolicitudCatologo {
  /** Concepto relacionado con la solicitud */
  concepto: CatalogosSelect;

  /** Tipo de inversión a realizar */
  tipoDeInversion: CatalogosSelect;
}

/**
 * Representa la información de un subcontratista.
 */
export interface SubContratistas {
  /** RFC del subcontratista */
  rfc: string;

  /** Razón social del subcontratista */
  razonSocial: string;
}

/**
 * Representa la información de un socio o miembro de la empresa.
 */
export interface SeccionSociosIC {
  /** Identificador del miembro en la empresa */
  idMiembroEmpresa?: string;

  /** Identificador de la solicitud relacionada */
  idSolicitud?: string;

  /** Tipo de persona (Física o Moral) */
  tipoPersona?: string;

  /** Tipo de persona mostrado al usuario */
  tipoPersonaMuestra: string;

  /** Nombre completo del miembro */
  nombreCompleto: string;

  /** RFC del miembro */
  rfc: string;

  /** Carácter o rol dentro de la empresa */
  caracterDe: string;

  /** Almacena la nacionalidad del usuario o solicitante */
  nacionalidad: string;

  /** Nombre del país de origen */
  paisNombre: string;

  /** Tipo de carácter (adicional) */
  tipoCaracter?: string;

  /** Clave del país */
  paisClave?: string;

  /** Indica si tributa en México */
  tributarMexico: string;

  /** Nombre de la empresa */
  nombreEmpresa: string;

  /** Nombre de la persona (si aplica) */
  nombre?: string;

  /** Apellido paterno (si aplica) */
  apellidoPaterno?: string;

  /** Apellido materno (si aplica) */
  apellidoMaterno?: string;

  /** Razón social (si aplica) */
  razonSocial?: string;
}

/**
 * Representa un tipo de inversión.
 */
export interface TipoDeInversion {
  /** Identificador del registro */
  idRegistro?: string;

  /** Tipo de inversión */
  tipoInversion: string;

  /** Descripción de la inversión */
  descripcion: string;

  /** Valor asignado a la inversión */
  valor: string;

  /** Clave del tipo de inversión */
  cveTipoInversion?: string;
}

/**
 * Representa los domicilios relacionados con la empresa o instalación.
 */
export interface Domicilios {
  /** Indica si es instalación principal */
  instalacionPrincipal: string;

  /** Clave del tipo de instalación */
  cveTipoInstalacion?: string;

  /** Tipo de instalación */
  tipoInstalacion: string;

  /** Clave de la entidad federativa */
  cveEntidadFederativa?: string;

  /** Nombre de la entidad federativa */
  entidadFederativa: string;

  /** Clave de delegación o municipio */
  cveDelegacionMunicipio?: string;

  /** Nombre del municipio o delegación */
  municipioDelegacion: string;

  /** Dirección completa */
  direccion: string;

  /** Código postal del domicilio */
  codigoPostal: string;

  /** Registro en SESAT */
  registroSESAT: string;

  /** Proceso productivo en el domicilio */
  procesoProductivo: string;

  /** Fecha de última modificación */
  fechaModificacion?: string;

  /** Clave del estatus del domicilio */
  cveEstatus?: string;

  /** Descripción del estatus */
  estatus: string;

  /** Número exterior del domicilio */
  noExterior?: string;

  /** Número interior del domicilio */
  noInterior?: string;

  /** Clave de la colonia */
  cveColonia?: string;

  /** Nombre de la calle */
  calle?: string;

  /** Descripción de la colonia */
  descCol?: string;

  /** Identificador del recinto */
  idRecinto?: string;

  /** Número de folio del acuse */
  numFolioAcuse?: string;

  /** Observaciones adicionales del domicilio */
  observaciones?: string;
}

/**
 * Representa los datos generales proporcionados en una solicitud.
 */
export interface DatosGeneralesDeLaSolicitudDatos {
  /** Tipo de endoso de la solicitud */
  tipoDeEndoso: string;

  /** Tipo de garantía de la solicitud */
  tipoDeGarantia: number;

  /** Modalidad de la garantía */
  modalidadDeLaGarantia: number;

  /** Tipo de sector relacionado con la solicitud */
  tipoSector: string;

  /** Concepto relacionado con la solicitud */
  concepto: number;

  /** Valor o campo específico relacionado con la solicitud */
  '3500': number;

  /** Otro campo específico (3501) de la solicitud */
  '3501': number;

  /** Otro campo específico (3502) de la solicitud */
  '3502': number;

  /** RFC del solicitante */
  datosGeneralesRFC: string;

  /** Otro campo específico (3503) de la solicitud */
  '3503': number;

  /** Otro campo específico (3504) de la solicitud */
  '3504': number;

  /** Otro campo específico (3505) de la solicitud */
  '3505': number;

  /** Otro campo específico (3506) de la solicitud */
  '3506': number;

  /** Otro campo específico (3507) de la solicitud */
  '3507': number;

  /** Otro campo específico (3508) de la solicitud */
  '3508': number;

  /** Otro campo específico (3509) de la solicitud */
  '3509': number;

  /** Otro campo específico (3511) de la solicitud */
  '3511': number;

  /** Otro campo específico (3512) de la solicitud */
  '3512': number;

  /** Otro campo específico (3513) de la solicitud */
  '3513': number;

  /** Texto adicional (1) para la solicitud */
  textoGenerico1: string;

  /** Texto adicional (2) para la solicitud */
  textoGenerico2: string;

  /** Otro campo específico (3514) de la solicitud */
  '3514': number;

  /** Otro campo específico (3515) de la solicitud */
  '3515': number;

  /** Otro campo específico (3516) de la solicitud */
  '3516': number;

  /** Texto adicional (3) para la solicitud */
  textoGenerico3: string;

  /** Otro campo específico (3517) de la solicitud */
  '3517': number;

  /** Otro campo específico (3518) de la solicitud */
  '3518': number;

  /** Otro campo específico (3519) de la solicitud */
  '3519': number;

  /** Otro campo específico (3520) de la solicitud */
  '3520': number;

  /** Tipo de inversión para la solicitud */
  tipoInversion: number;

  /** Cantidad de la inversión */
  cantidadInversion: string;

  /** Descripción de la inversión */
  descInversion: string;

  /** Otro campo específico (3521) de la solicitud */
  '3521': number;

  /** Otro campo específico (3522) de la solicitud */
  '3522': number;

  /** Clave de enumeración D0 */
  claveEnumeracionD0: string;

  /** Clave de enumeración D1 */
  claveEnumeracionD1: string;

  /** Clave de enumeración D2 */
  claveEnumeracionD2: string;

  /** Clave de enumeración D3 */
  claveEnumeracionD3: string;

  /** Clave de enumeración H */
  claveEnumeracionH: string;

  /** Texto adicional (4) para la solicitud */
  textoGenerico4: string;

  /** Texto adicional (5) para la solicitud */
  textoGenerico5: string;

  /** Otro campo específico (3523) de la solicitud */
  '3523': number;

  /** Otro campo específico (3528) de la solicitud */
  '3528': number;

  /** Otro campo específico (3529) de la solicitud */
  '3529': number;

  /** Texto adicional (6) para la solicitud */
  textoGenerico6: string;

  /** Texto adicional (7) para la solicitud */
  textoGenerico7: string;

  /** Otro campo específico (3530) de la solicitud */
  '3530': number;

  /** Otro campo específico (3531) de la solicitud */
  '3531': number;

  /** Texto adicional (9) para la solicitud */
  textoGenerico9: string;

  /** Otro campo específico (10) de la solicitud */
  textoGenerico10: number;

  /** Otro campo específico (11) de la solicitud */
  textoGenerico11: number;

  /** Otro campo específico (12) de la solicitud */
  textoGenerico12: number;

  /** Otro campo específico (13) de la solicitud */
  textoGenerico13: number;

  /** Otro campo específico (14) de la solicitud */
  textoGenerico14: number;

  /** Otro campo específico (15) de la solicitud */
  textoGenerico15: number;

  /** Otro campo específico (16) de la solicitud */
  textoGenerico16: number;

  /** Otro campo específico (17) de la solicitud */
  textoGenerico17: number;

  /** Otro campo específico (18) de la solicitud */
  textoGenerico18: number;

  /** Otro campo específico (19) de la solicitud */
  textoGenerico19: number;

  /** Otro campo específico (20) de la solicitud */
  textoGenerico20: number;

  /** Otro campo específico (21) de la solicitud */
  textoGenerico21: number;

  /** Otro campo específico (22) de la solicitud */
  textoGenerico22: number;

  /** Otro campo específico (23) de la solicitud */
  textoGenerico23: number;

  /** Otro campo específico (24) de la solicitud */
  textoGenerico24: number;

  /** Alerta relacionada con la solicitud (1) */
  alerta1: boolean;

  /** Alerta relacionada con la solicitud (2) */
  alerta2: boolean;
}

/**
 * Representa el conjunto de mensajes informativos que se muestran
 * en el sistema relacionados con los requisitos legales o fiscales
 * según el tipo de garantía presentada.
 *
 * Cada propiedad corresponde a un bloque de texto utilizado en la
 * interfaz para orientar al usuario sobre las obligaciones normativas.
 */
export interface NotaMensaja {
  /** Mensaje informativo correspondiente al primer nodo (ej. póliza de fianza en oficinas AGACE). */
  node_uno: string;

  /** Mensaje complementario relacionado con requisitos del Código Fiscal (artículos 18 y 18-A). */
  node_dos: string;

  /** Mensaje relacionado con la presentación de carta de crédito en oficinas AGACE. */
  node_tres: string;

  /** Mensaje complementario para la carta de crédito, incluyendo requisitos legales. */
  node_cuatro: string;
}

/**
 * Representa las etiquetas de texto que se muestran en los distintos
 * formularios y secciones de la solicitud, incluyendo campos fiscales,
 * declaraciones legales, archivos requeridos y mensajes informativos.
 *
 * Las claves numéricas (ej. 3500, 3511, 3530, etc.) corresponden a
 * identificadores únicos definidos por el sistema para cada pregunta
 * o campo del formulario.
 */
export interface LabelModels {
  /** Etiqueta relacionada con el cumplimiento de obligaciones fiscales y aduaneras. */
  3500: string;

  /** Autorización para hacer pública la opinión positiva del SAT. */
  3501: string;

  /** Denominación o razón social de subcontratistas. */
  RFC: string;

  /** Información sobre registro de personal ante el IMSS y cumplimiento de obligaciones fiscales. */
  3502: string;

  /** Presencia en listados del SAT conforme al artículo 69 del CFF. */
  3503: string;

  /** Presencia en listados conforme al artículo 69-B del CFF. */
  3504: string;

  /** Presencia en listados conforme al artículo 69-B Bis del CFF. */
  3505: string;

  /** Vigencia de certificados de sello digital. */
  3506: string;

  /** Medios de contacto actualizados en el buzón tributario. */
  3507: string;

  /** Situación en los padrones de importadores/exportadores. */
  3508: string;

  /** Archivo con clientes y proveedores extranjeros. */
  file: string;

  /** Archivo con RFC de proveedores nacionales. */
  filedos: string;

  /** Sistema de control de inventarios según la Ley. */
  3511: string;

  /** Querellas o denuncias en contra de representantes o socios. */
  3512: string;

  /** Sistema de control de inventarios conforme al Anexo 24. */
  3513: string;

  /** Contabilidad en medios electrónicos conforme al CFF. */
  3514: string;

  /** Advertencia: archivo con reporte de saldos según Anexo 24. */
  alertTres: string;

  /** Información contable ingresada mensualmente al SAT. */
  3515: string;

  /** Cumplimiento fiscal de socios y representantes. */
  3516: string;

  /** Opinión positiva vigente de obligaciones fiscales. */
  textoGenerico3: string;

  /** Relación con empresas a las que se haya cancelado su certificación. */
  3517: string;

  /** Proveedores en listados del SAT conforme a artículos del CFF. */
  3518: string;

  /** Créditos fiscales firmes en los últimos 12 meses. */
  3519: string;

  /** Inversión en territorio nacional y su legal posesión. */
  3520: string;

  /** Antecedente de certificación previa IVA e IEPS. */
  3521: string;

  /** Cumplimiento del Anexo 30 en certificaciones anteriores. */
  3522: string;

  /** Lista de domicilios registrados y activos relacionados con el proceso productivo. */
  domiciliosLabel: string;

  /** Declaración de operaciones bajo el programa IMMEX. */
  3523: string;

  /** Infraestructura adecuada para la operación solicitada. */
  3528: string;

  /** Resoluciones de improcedencia del IVA y montos negados. */
  3529: string;

  /** Porcentaje y monto de devoluciones improcedentes. */
  porcentajeLabel: string;

  /** Capacidad financiera para llevar a cabo el proyecto. */
  3530: string;

  /** Archivo con monto anual de importaciones temporales. */
  fileUno: string;

  /** Transformación o retorno de al menos el 50% de importaciones. */
  3531: string;

  /** Valor total de importaciones temporales. */
  textoGenerico9: string;

  /** Archivo con empresas receptoras de transferencias de mercancía (CTM). */
  alertInfoUno: string;

  /** Declaración de cumplimiento conforme a reglas 7.4.1 a 7.4.7. */
  alertInfoDos: string;

  /** Declaración bajo protesta sobre veracidad y representación legal. */
  alertInfoTres: string;
}
