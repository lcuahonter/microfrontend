import {
  AgregarMiembroEmpresaTabla,
  ControlInventariosTabla,
  DomiciliosRfcSolicitanteTabla,
  NumeroEmpleadosTabla,
} from '../models/oea-textil-registro.model';
import { EmpresaDelGrupo } from '../constants/datos-comunes.enum';
import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
import { TablaEnlaceOperativo } from '../models/enlace-operativo-tabla.model';
import { TransportistasTable } from '../constants/datos-comunes.enum';
/**
 * Interfaz que define las propiedades relacionadas con listas de datos
 * de empleados, domicilios, socios, y enlaces operativos.
 */
export interface Solicitud32605State {
  sectorProductivo: string; // Sector productivo al que pertenece la empresa
  sectorServicio: string; // Sector productivo o de servicios al que pertenece la empresa
  cumplimientoFiscalAduanero: string; // Indica si se cumple con las obligaciones fiscales aduaneras
  autorizaOpinionSAT: string; // Indica si se autoriza la opinión del SAT
  cuentaConEmpleadosPropios: string; // Indica si la empresa cuenta con empleados propios
  bimestreUltimo: string; // Último bimestre reportado
  numeroDeEmpleadas: string; // Número de empleadas en el último bimestre
  retencionISRTrabajadores: string; // Indica si se retiene ISR a los trabajadores
  pagoCuotasIMSS: string; // Indica si se pagan cuotas al IMSS
  cuentaConSubcontratacionEspecializada: string; // Indica si se cuenta con subcontratación especializada
  registroPadronLFT: string; // Indica si se cuenta con registro en el padrón de la Ley Federal del Trabajo
  listadoSATArt69: string; // Lista de artículos 69 del SAT
  listadoSATArt69B: string; // Lista de artículos 69 del SAT
  listadoSATArt69BBis: string; // Lista de artículos 69-B Bis del SAT
  certificadosSellosVigentes: string; // Indica si los certificados de sellos digitales están vigentes
  infringioSupuestos17HBis: string; // Indica si se infringieron los supuestos del artículo 17-H Bis
  mediosContactoActualizadosBuzon: string; // Indica si los medios de contacto están actualizados en el buzón
  suspensionPadronImportadoresExportadores: string; // Indica si está suspendido en el padrón de importadores/exportadores
  archivoNacionales?: string; // Indica si se han archivado documentos nacionales
  proveedores: string; // Lista de proveedores asociados al trámite
  domiciliosRegistrados: string; // Indica si los domicilios están registrados
  numeroEmpleadosBimestre: NumeroEmpleadosTabla[]; // Lista de números de empleados por bimestre
  DomiciliosRfcSolicitante: DomiciliosRfcSolicitanteTabla[]; // Lista de domicilios del RFC solicitante
  controlInventarios: ControlInventariosTabla[]; // Lista de control de inventarios
  querellaSATUltimos3Anios: string; // Indica si hay querellas del SAT en los últimos 3 años
  ingresoInfoContableSAT: string; // Indica si se ingresa información contable al SAT
  agregarMiembroEmpresa: AgregarMiembroEmpresaTabla[];
  manifests: boolean; // Indica si se han agregado manifiestos
  bajoProtesta: boolean; // Indica si se realiza bajo protesta
  sistemaControlInventariosArt59: string;
  comercioExteriorRealizado: string; // Indica si se realiza comercio exterior
  fechaDePago: string; // Fecha de pago asociada a la solicitud
  fechaInicioComercio: string;
  esParteGrupoComercioExterior: string; // Indica si es parte de un grupo de comercio exterior
  rfcEnclaveOperativo: string; // RFC del enclave operativo
  enlaceOperativorfc: string; // RFC del enlace operativo
  denominacionRazonsocial: string; // Razón social del enlace operativo
  domicilio: string; // Domicilio del enlace operativo
  inputfechaDeLaUltimaOperacion: string; // Fecha de la última operación
  fusionEscisionConOperacionExterior: string; // Indica si hay fusión o escisión con operación exterior
  empresaExtranjeraIMMEX: string; // Indica si es una empresa extranjera IMMEX
  monto: string; // Monto total asociado a la solicitud
  operacionesBancarias: string; // Detalles de las operaciones bancarias relacionadas con la solicitud
  llavePago: string; // Llave de pago asociada a la solicitud
  cuentaConProgramaIMMEX: string; // Indica si cuenta con un programa IMMEX
  rubroCertificacion: string; // Rubro de certificación asociado a la solicitud
  fechaFinVigenciaRubro: string; // Fecha de fin de vigencia del rubro de certificación
  numeroOficio: string; // Número de oficio asociado a la solicitud
  declaracionAnualISRRepresentantes: string; // Indica si los representantes han presentado la declaración anual del ISR
  registroEsquemaCertificacionIVAIEPS: string; // Registro del esquema de certificación IVA e IEPS
  registroEsquemaCertificacion: string; // Registro del esquema de certificación
  tipoInformacionEmpresa: string; // Indica si la información de la empresa es clasificada
  ccat: string; // CAAT del enlace operativo
  tablaDatos: EmpresaDelGrupo[]; // Tabla de datos de empresas del grupo
  transportistasLista: TransportistasTable[]; // Lista de transportistas relacionados con la solicitud

  representanteRegistro: string;
  representanteRfc: string;
  representanteNombre: string;
  representanteApellidoPaterno: string;
  representanteApellidoMaterno: string;
  representanteTelefono: string;
  representanteCorreo: string;
  registro: string;
  rfc: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  ciudad: string;
  cargo: string;
  telefono: string;
  correo: string;
  suplente: boolean;
  enlaceOperativoData: TablaEnlaceOperativo[];
  cumpleAnexo24: boolean;
  lugarRadicacion: string;
  nombreSistema: string;

  autorizacionCBP: string;
  instalacionesCertificadasCBP: string;
  suspensionCancelacionCBP: string;

  /// perfiles
  perfiles: Partial<PerfilesDatos>;
}
/**
 * Interfaz para los datos de perfiles de seguridad y procedimientos.
 */
export interface PerfilesDatos {
  /**
   * Domicilio de la instalación.
   */
  domicilioDeLaInstalacion: string;

  /**
   * Procedimiento descrito para la instalación o proceso.
   */
  describaProcedimiento: string;

  /**
   * Criterios aplicados en la instalación.
   */
  indiqueLosCriterios: string;

  /**
   * Métodos utilizados para el control y seguridad.
   */
  indiqueLosMetodos: string;

  /**
   * Indicadores empleados en la supervisión de la instalación.
   */
  describaLosIndicadores: string;

  /**
   * Información relacionada con actividades de comercio exterior.
   */
  comercioExterior: string;

  /**
   * Medidas implementadas para el uso de candados de seguridad.
   */
  candadosSeguridad: string;

  /**
   * Indica si se cuenta con un proveedor externo.
   */
  proveedorExterno: string;

  /**
   * Define si la instalación es susceptible de contaminación.
   */
  susceptibleContaminacion: string;

  /**
   * Describe si se encuentran vacíos los espacios de carga.
   */
  encuentrenVacios: string;

  /**
   * Indica si los semirremolques se encuentran vacíos.
   */
  semirremolquesVacios: string;

  /**
   * Indica si se deben utilizar candados de seguridad.
   */
  utilizarCandado: string;

  /**
   * Describe las medidas de seguridad implementadas en las instalaciones.
   */
  seguridadMismas: string;

  /**
   * Proceso de contratación del personal.
   */
  describaContratacion: string;

  /**
   * Documentación exigida a empleados o proveedores.
   */
  documentacionExigida: string;

  /**
   * Exámenes solicitados a empleados o proveedores.
   */
  examenesSolicitados: string;

  /**
   * Análisis de conformidad.
   */
  conformeAnalisis: string;
  /**
   * Periodicidad de los procedimientos o controles aplicados.
   */
  periodicidad: string;

  /**
   * Medidas adoptadas para garantizar la confidencialidad.
   */
  confidencialidad: string;

  /**
   * Procedimientos de contratación de personal.
   */
  contratacionPersonal: string;

  /**
   * Descripción de los procedimientos aplicados al personal.
   */
  describaProcedimientoPersonal: string;

  /**
   * Seguimiento de los procedimientos implementados.
   */
  seguimientoProcedimiento: string;

  /**
   * Uso y control de identificaciones en la organización.
   */
  identificaciones: string;

  /**
   * Medidas de seguridad implementadas en los sistemas informáticos.
   */
  sistemasInformaticos: string;

  /**
   * Gestión de proveedores de servicios externos.
   */
  proveedoresServicios: string;

  /**
   * Procedimientos para la administración del personal.
   */
  administracionPersonal: string;

  /**
   * Breve explicación de los controles o procedimientos aplicados.
   */
  expliqueBrevemente: string;

  /**
   * Control del personal o actividades realizadas fuera de las instalaciones.
   */
  encuentranFuera: string;

  /**
   * Proceso de actualizaciones en materia de seguridad.
   */
  actualizacionesSeguridad: string;

  /**
   * Control de accesos relacionados con el personal y las instalaciones.
   */
  accesoLosMismos: string;

  /**
   * Medidas implementadas para la continuidad del negocio.
   */
  continuidadNegocio: string;

  /**
   * Semana correspondiente al registro o control.
   */
  semanaCorresponda: string;

  /**
   * Procedimientos para la recuperación de información.
   */
  recuperarInformacion: string;
  /**
   * Manejo de información archivada.
   */
  informacionArchivada: string;

  /**
   * Proceso de tratamiento y gestión de datos.
   */
  procesoDatos: string;

  /**
   * Implementación de copias de seguridad.
   */
  copiasSeguridad: string;

  /**
   * Medidas de protección de la información.
   */
  proteccionDeLaInformacion: string;

  /**
   * Procedimientos ante la pérdida de información.
   */
  perdidaDeLaInformacion: string;

  /**
   * Controles aplicados a los sistemas informáticos.
   */
  controlanSistemas: string;

  /**
   * Acciones realizadas por el resto de los usuarios o personal.
   */
  accionesDelResto: string;

  /**
   * Seguridad aplicada a los sistemas confidenciales.
   */
  sistemasConfidenciales: string;

  /**
   * Procedimiento para proporcionar contraseñas.
   */
  proporcionaEsasContrasenas: string;

  /**
   * Actualizaciones periódicas de sistemas y seguridad.
   */
  actualizacionesPeriodicas: string;

  /**
   * Control sobre licencias falsificadas.
   */
  falsificadosLicencias: string;

  /**
   * Procedimientos del proceso de importación.
   */
  procesoDeImportacion: string;

  /**
   * Seguridad en telecomunicaciones.
   */
  telecomunicaciones: string;

  /**
   * Medidas a tomar en caso de que un sistema sea comprometido.
   */
  sistemaComprometido: string;

  /**
   * Seguridad de la tecnología utilizada.
   */
  seguridadDeLaTecnologia: string;

  /**
   * Controles implementados en los medios de transporte.
   */
  mediosTransporte: string;

  /**
   * Procedimientos de difusión de información.
   */
  estaDifusion: string;

  /**
   * Alcance enunciativo y no limitativo de las medidas de seguridad.
   */
  enunciativaLimitativa: string;

  /**
   * Procedimientos de seguridad implementados por la empresa.
   */
  procedimientosEmpresa: string;

  /**
   * Medios de transporte adicionales involucrados en la operación.
   */
  mediosDeTransporte: string;

  /**
   * Factores relacionados con la seguridad en la cadena logística.
   */
  relacionadosSeguridad: string;

  /**
   * Procedimiento para reportar incidentes de seguridad.
   */
  reportarIncidentes: string;

  /**
   * Identificación de actividades sospechosas.
   */
  actividadesSospechosas: string;

  /**
   * Descripción breve de medidas o procedimientos.
   */
  brevementeSonsiste: string;

  /**
   * Detalle de incidentes de seguridad ocurridos.
   */
  incidenteSeguridad: string;

  /**
   * Procedimientos para llevar a cabo una investigación.
   */
  caboInvestigacion: string;

  /**
   * Operación específica al llevar a cabo la investigación.
   */
  operacionCaboInvestigacion: string;

  /**
   * Antigüedad de la empresa (en años o como texto).
   */
  antiguedad: number | string;

  /**
   * Cantidad de productos manejados.
   */
  productos: number | string;

  /**
   * Número de embarques de exportación.
   */
  embarquesExp: number | string;

  /**
   * Número de embarques de importación.
   */
  embarquesImp: number | string;

  /**
   * Número de empleados registrados.
   */
  empleados: number | string;

  /**
   * Superficie ocupada por la instalación (en m² u otra unidad).
   */
  superficie: number | string;

  /**
   * Indica si aplica el programa CTPAT.
   */
  blCtpat: string;

  /**
   * Nivel de certificado CTPAT.
   */
  niverCertificado?: string;

  /**
   * Número de cuenta del programa CTPAT.
   */
  ctpatAccountNumber?: string;

  /**
   * Código MID asociado.
   */
  codigoMid?: string;

  /**
   * Fecha de la última certificación CTPAT.
   */
  fecUltimaCtapt?: Date | string;

  /**
   * Indica si aplica el programa PIP.
   */
  blnPip: string;

  /**
   * Número de registro del programa PIP.
   */
  numRegistroPip?: string;

  /**
   * Indica si aplica el programa OEA.
   */
  blnOea: string;

  /**
   * Nombre del programa OEA en el país correspondiente.
   */
  nomProgramapaisOea?: string;

  /**
   * Número de registro del programa OEA.
   */
  numRegistroOea?: string;

  /**
   * Indica si existen otros programas de seguridad.
   */
  blnOtrosProgramasSegu: string;

  /**
   * Nombre de otros programas de seguridad.
   */
  nombreProgramaOtros?: string;

  /**
   * Número de registro de otros programas.
   */
  numRegistroOtros?: string;

  /**
   * Fecha de vigencia de otros programas.
   */
  fechaVigenciaOtros?: Date | string;

  /**
   * Nombre de la certificación adicional 1.
   */
  nombre: string;

  /**
   * Categoría de la certificación adicional 1.
   */
  categoria: string;

  /**
   * Vigencia de la certificación adicional 1.
   */
  vigencia: string;

  /**
   * Nombre de la certificación adicional 2.
   */
  nombre2: string;

  /**
   * Categoría de la certificación adicional 2.
   */
  categoria2: string;

  /**
   * Vigencia de la certificación adicional 2.
   */
  vigencia2: string;

  /**
   * Nombre de la certificación adicional 3.
   */
  nombre3: string;

  /**
   * Categoría de la certificación adicional 3.
   */
  categoria3: string;

  /**
   * Vigencia de la certificación adicional 3.
   */
  vigencia3: string;

  /**
   * Describe si la empresa cuenta con un procedimiento documentado.
   */
  procedimientoDocumentado: string;

  /**
   * Indique el número o código de referencia del procedimiento.
   */
  indiqueNumero: string;

  /**
   * Cargos y funciones de las personas involucradas en el procedimiento.
   */
  cargosFunciones: string;

  /**
   * Acciones a seguir en caso de contratar personal externo.
   */
  casoContratarse: string;

  /**
   * Acciones a seguir en caso de contar con recursos internos.
   */
  casoContar: string;

  /**
   * Describir el procedimiento general aplicado en la empresa.
   */
  describirProcedimiento: string;

  /**
   * Indique los mecanismos de control aplicados.
   */
  indiqueMecanismos: string;

  /**
   * Señale los empleados responsables de aplicar el procedimiento.
   */
  indicarEmpleados: string;

  /**
   * Indique cómo se identifican las personas involucradas.
   */
  indiqueIdentifica: string;

  /**
   * Breve descripción de la empresa relacionada al procedimiento.
   */
  describaEmpresa: string;

  /**
   * Indique cómo la empresa asegura el cumplimiento del procedimiento.
   */
  indiqueAsegura: string;

  /**
   * Procedimiento para control y supervisión de las actividades.
   */
  procedimientoParaControl: string;

  /**
   * Señale los registros que se generan en el procedimiento.
   */
  senaleRegistros: string;

  /**
   * Señale quién es responsable de cada parte del proceso.
   */
  senaleQuien: string;

  /**
   * Describa cómo se realiza la recepción de información o materiales.
   */
  describaRecepion: string;

  /**
   * Indique quién es el encargado del procedimiento.
   */
  indiqueEncargado: string;

  /**
   * Indique cómo se identifican las responsabilidades asignadas.
   */
  indiqueIdentfica: string;

  /**
   * Señale cómo se realizan las actividades dentro del procedimiento.
   */
  senaleComo: string;

  /**
   * Describa las características específicas del procedimiento.
   */
  describaCaracteristicas: string;

  /**
   * Señale la acción a tomar en caso de incidentes o irregularidades.
   */
  senaleAccion: string;

  /**
   * Indique si la empresa lleva registros o bitácoras del procedimiento.
   */
  indiqueLleva: string;

  /**
   * Describa un segundo procedimiento relacionado (si aplica).
   */
  describaProcedimientoDos: string;

  /**
   * Indique si existen socios o terceros involucrados en el procedimiento.
   */
  indiqueSocios: string;

  /**
   * Indique la forma en que se aplican los controles.
   */
  indiqueForma: string;

  /**
   * Indique si existen documentos o pruebas que respalden el procedimiento.
   */
  indiqueExisten: string;

  /**
   * Indique con qué recursos o elementos se cuenta para el procedimiento.
   */
  indiqueCuenta: string;

  /**
   * Procedimiento que debe realizarse según la política de la empresa.
   */
  procedimientoRealizar: string;

  /**
   * Indique la periodicidad con la que se lleva a cabo el procedimiento.
   */
  indiquePeriodicidad: string;

  /**
   * Describa cómo se realiza el procedimiento de forma general.
   */
  describaComo: string;

  /**
   * Indique cómo se asegura el cumplimiento del procedimiento.
   */
  comoAseguran: string;

  /**
   * Formatos utilizados en la aplicación del procedimiento.
   */
  indiqueFormatos: string;

  /**
   * Señalar las medidas de seguridad implementadas.
   */
  senalarMedidas: string;

  /**
   * Indique los almacenes o áreas de resguardo relacionadas al procedimiento.
   */
  indiqueAlmacenes: string;

  /**
   * Explique brevemente el funcionamiento del procedimiento.
   */
  expliqueBrevemente2: string;

  /**
   * Indique cómo la empresa se cerciora del cumplimiento.
   */
  indiqueCerciora: string;

  /**
   * Indique los elementos específicos que forman parte del procedimiento.
   */
  indiqueEstos: string;

  /**
   * Indique a qué área o unidad pertenecen los elementos involucrados.
   */
  indiquePertenecen: string;

  /**
   * Indique la persona responsable de ejecutar o supervisar el procedimiento.
   */
  indiqueResponsable: string;

  /**
   * Indique la tecnología utilizada para apoyar el procedimiento.
   */
  indiqueTecnologia: string;

  /**
   * Describir el procesamiento aplicado dentro del procedimiento.
   */
  describirProcesamiento: string;

  /**
   * Detalle cómo se lleva a cabo cada paso del procedimiento.
   */
  detalleComo: string;

  /**
   * Indique qué herramientas o sistemas se utilizan.
   */
  indiqueUtiliza: string;

  /**
   * Detalle cómo se valida la información o el procedimiento.
   */
  detalleValida: string;

  /**
   * Indique cómo se maneja el número o código de control.
   */
  comoNumero: string;

  /**
   * Señale los socios asociados al procedimiento (si aplica).
   */
  senaleAsociados: string;

  /**
   * Indique los materiales utilizados en el proceso.
   */
  indiqueMateriales: string;

  /**
   * Explique de qué forma se ejecuta o implementa el procedimiento.
   */
  queForma: string;

  /**
   * Personal responsable de la supervisión o ejecución del procedimiento.
   */
  personalResponsable: string;

  /**
   * Indique cuántas unidades, equipos o elementos están involucrados.
   */
  indiqueCuantas: string;

  /**
   * Indique cuáles son monitoreadas o supervisadas regularmente.
   */
  indiqueMonitoreadas: string;

  /**
   * Detalle si existen mecanismos adicionales relacionados al procedimiento.
   */
  detalleExisten: string;

  /**
   * Describa el acceso a las instalaciones, áreas o recursos.
   */
  describaAcceso: string;

  /**
   * Describir el tipo de procedimiento, equipo o mecanismo utilizado.
   */
  describirTipo: string;

  /**
   * Describa las áreas relacionadas con el procedimiento.
   */
  describaAreas: string;

  /**
   * Señale las mismas áreas, equipos o recursos previamente mencionados.
   */
  senaleMismas: string;

  /**
   * Caso de no contar con los recursos o equipos necesarios.
   */
  casoNoContar: string;

  /**
   * Periodicidad con la que se verifican los procedimientos o equipos.
   */
  periodicidadVerifica: string;

  /**
   * Indique las tareas que forman parte del procedimiento.
   */
  indiqueTareas: string;

  /**
   * Describa la manera en la que se llevan a cabo las tareas.
   */
  describaManera: string;

  /**
   * Indique si existe separación de responsabilidades o áreas.
   */
  indiqueSepara: string;

  /**
   * Señale las áreas de acceso restringido.
   */
  senaleRestringido: string;

  /**
   * Describa el monitoreo que se realiza en las áreas o sistemas.
   */
  describaMonitoreo: string;

  /**
   * Indique los responsables de controlar las áreas o equipos.
   */
  responsablesControlar: string;

  /**
   * Información sobre los estacionamientos relacionados al procedimiento.
   */
  estacionamientos: string;

  /**
   * Indique si se lleva un control de entrada y salida.
   */
  llevaEntrada: string;

  /**
   * Políticas y mecanismos aplicados en la operación.
   */
  politicasMecanismos: string;

  /**
   * Procedimiento de operación correspondiente al sistema o proceso.
   */
  procedimientoOperacion: string;

  /**
   * Señale si los recursos o equipos se encuentran en buen estado.
   */
  senaleEncuentran: string;

  /**
   * Mencione si la empresa cuenta con sistemas o mecanismos específicos.
   */
  mencioneCuenta: string;

  /**
   * De qué manera se realiza el procedimiento o actividad.
   */
  queManera: string;

  /**
   * Describa el proceso para contactar con las personas responsables.
   */
  describaContactar: string;

  /**
   * Indique si existe un operativo relacionado al procedimiento.
   */
  indiqueOperativo: string;

  /**
   * Indique los aparatos o equipos utilizados en el proceso.
   */
  indiqueAparatos: string;

  /**
   * Describa el mantenimiento realizado a los equipos o instalaciones.
   */
  mantenimiento: string;

  /**
   * Políticas relacionadas con el uso de aparatos o sistemas.
   */
  politicasAparatos: string;

  /**
   * Programa de mantenimiento aplicado periódicamente.
   */
  programaMantenimiento: string;

  /**
   * Indique si existe respaldo de información o sistemas.
   */
  indiqueRespaldo: string;

  /**
   * Describa la alarma o sistema de alerta implementado.
   */
  describaAlarma: string;

  /**
   * Indique qué mecanismos o equipos se utilizan en el procedimiento.
   */
  indiqueUtilizan: string;

  /**
   * Describa los sistemas de seguridad o control aplicados.
   */
  describaSistemas: string;

  /**
   * Indicar las cámaras utilizadas en las instalaciones o sistemas de seguridad.
   */
  indicarCamaras: string;

  /**
   * Mencione la inspección realizada en las áreas, procesos o instalaciones.
   */
  mencioneInspeccion: string;

  /**
   * Señalar la ubicación de los equipos, cámaras o recursos mencionados.
   */
  senalarUbicacion: string;

  /**
   * Indique los horarios en los que se realizan inspecciones o controles.
   */
  indiqueHorarios: string;

  /**
   * Indique quién revisa los procedimientos, instalaciones o equipos.
   */
  indiqueRevisan: string;

  /**
   * Indique la persona designada como responsable del proceso.
   */
  indiqueDesignado: string;

  /**
   * Explique cómo se documentan los procesos o actividades de seguridad.
   */
  comoDocumentan: string;

  /**
   * Indique el tiempo de respuesta, duración o frecuencia del proceso.
   */
  indiqueTiempo: string;

  /**
   * Señale si la planta cuenta con los recursos o mecanismos mencionados.
   */
  contarPlanta: string;

  /**
   * Describa estos sistemas aplicados en la planta o instalaciones.
   */
  estosSistemas: string;

  /**
   * Indicar si se utiliza un circuito de vigilancia o monitoreo.
   */
  indicarCircuito: string;

  /**
   * Describa cómo se implementó el sistema o procedimiento.
   */
  describaImplementado: string;

  /**
   * Indique la forma en que se controlan los accesos, procesos o sistemas.
   */
  formaControlan: string;

  /**
   * Indique si todas las áreas, procesos o equipos cuentan con control.
   */
  indiqueTodas: string;

  /**
   * Indique si la planta en su totalidad cuenta con los mecanismos requeridos.
   */
  indiquePlanta: string;

  /**
   * Señale si la empresa cuenta con un procedimiento documentado.
   */
  cuentaDocumentado: string;

  /**
   * Indique las puertas que forman parte del control de acceso.
   */
  indiquePuertas: string;

  /**
   * Indique si se mantiene cerrado el acceso a ciertas áreas o instalaciones.
   */
  indiqueCerrado: string;

  /**
   * Indicar si existe un circuito cerrado de televisión (CCTV).
   */
  indicarCircuitoCerrado: string;

  /**
   * Registro de visitantes a las instalaciones.
   */
  registroVisitantes: string;

  /**
   * Caso en el que los socios estén involucrados en el proceso o control.
   */
  casoSocios: string;

  /**
   * Indique si estos sistemas o medidas aplican a la empresa en su totalidad.
   */
  estosEmpresa: string;

  /**
   * Composición o existencia de un comité de seguridad en la empresa.
   */
  comiteSeguridad: string;

  /**
   * Fuentes de información utilizadas en el procedimiento o programa.
   */
  fuentesInformacion: string;

  /**
   * Política aplicada dentro del sistema o proceso.
   */
  politica: string;

  /**
   * Indicación específica relacionada con el proceso o procedimiento.
   */
  indique: string;

  /**
   * Periodicidad con la que se realiza la actividad o procedimiento.
   */
  periodicidad2: string;

  /**
   * Programa establecido para cumplir con los requisitos del proceso.
   */
  programa: string;

  /**
   * Actividades de capacitación realizadas para el personal.
   */
  capacitacion: string;

  /**
   * Procedimiento implementado en la empresa.
   */
  procedimiento: string;

  /**
   * Descripción detallada del procedimiento.
   */
  descripcionProcedimiento: string;

  /**
   * Nombre asignado al procedimiento.
   */
  nombreProcedimiento: string;

  /**
   * Programación establecida para auditorías internas o externas.
   */
  programacionAuditoria: string;

  /**
   * Participantes que intervienen en la auditoría.
   */
  participantesAuditoria: string;

  /**
   * Enfoque definido para la auditoría (criterios, objetivos, alcance).
   */
  enfoqueAuditoria: string;

  /**
   * Procesos que son objeto de la auditoría.
   */
  procesosAuditados: string;

  /**
   * Registros generados durante o después de la auditoría.
   */
  registrosAuditoria: string;

  /**
   * Programación establecida para la actividad o proceso.
   */
  programacion: string;

  /**
   * Nombre de los registros asociados al procedimiento.
   */
  registrosNombre: string;

  /**
   * Registros específicos relacionados con la empresa.
   */
  registrosEmpresa: string;

  /**
   * Plan de emergencia definido por la empresa.
   */
  planEmergencia: string;

  /**
   * Situaciones contempladas dentro del plan de emergencia.
   */
  situacionesContempladas: string;

  /**
   * Mecanismos de continuidad del negocio implementados.
   */
  mecanismosContinuidad: string;

  /**
   * Documentación relacionada con simulacros de emergencia.
   */
  simulacrosDocumentacion: string;
}
/**
 * Crea el estado inicial para `Solicitud32605State`.
 *
 * @returns El estado inicial con valores predeterminados.
 */
export function createInitialSolicitudState(): Solicitud32605State {
  return {
    /** Sector productivo al que pertenece la empresa */
    sectorProductivo: '',

    /** Sector de servicios en el que participa la empresa */
    sectorServicio: '',

    /** Información sobre cumplimiento fiscal y aduanero */
    cumplimientoFiscalAduanero: '',

    /** Autoriza la consulta de opinión ante el SAT */
    autorizaOpinionSAT: '',

    /** Indica si cuenta con empleados propios */
    cuentaConEmpleadosPropios: '',

    /** Último bimestre reportado */
    bimestreUltimo: '',

    /** Número de empleadas registradas */
    numeroDeEmpleadas: '',

    /** Retención de ISR a trabajadores */
    retencionISRTrabajadores: '',

    /** Pago de cuotas al IMSS */
    pagoCuotasIMSS: '',

    /** Indica si cuenta con subcontratación especializada */
    cuentaConSubcontratacionEspecializada: '',

    /** Registro en el padrón conforme a la LFT */
    registroPadronLFT: '',

    /** Listado SAT artículo 69 */
    listadoSATArt69: '',

    /** Listado SAT artículo 69-B */
    listadoSATArt69B: '',

    /** Listado SAT artículo 69-B Bis */
    listadoSATArt69BBis: '',

    /** Certificados de sellos vigentes */
    certificadosSellosVigentes: '',

    /** Indica si se infringieron supuestos del artículo 17-H Bis */
    infringioSupuestos17HBis: '',

    /** Medios de contacto actualizados en el buzón tributario */
    mediosContactoActualizadosBuzon: '',

    /** Suspensión en el padrón de importadores/exportadores */
    suspensionPadronImportadoresExportadores: '',

    /** Archivo de nacionales relacionado */
    archivoNacionales: '',

    /** Proveedores de la empresa */
    proveedores: '',

    /** Domicilios registrados */
    domiciliosRegistrados: '',

    /** Número de empleados por bimestre */
    numeroEmpleadosBimestre: [],

    /** RFC de domicilios del solicitante */
    DomiciliosRfcSolicitante: [],

    /** Información del control de inventarios */
    controlInventarios: [],

    /** Querella ante el SAT en los últimos 3 años */
    querellaSATUltimos3Anios: '',

    /** Ingreso de información contable al SAT */
    ingresoInfoContableSAT: '',

    /** Lista de miembros de la empresa */
    agregarMiembroEmpresa: [],

    /** Indica si existe manifestación expresa */
    manifests: false,

    /** Declaración bajo protesta de decir verdad */
    bajoProtesta: false,

    /** Sistema de control de inventarios conforme al Art. 59 */
    sistemaControlInventariosArt59: '',

    /** Comercio exterior realizado */
    comercioExteriorRealizado: '',

    /** Fecha de pago registrada */
    fechaDePago: '',

    /** Fecha de inicio en comercio exterior */
    fechaInicioComercio: '',

    /** Indica si forma parte de un grupo de comercio exterior */
    esParteGrupoComercioExterior: '',

    /** RFC en el enclave operativo */
    rfcEnclaveOperativo: '',

    /** RFC del enlace operativo */
    enlaceOperativorfc: '',

    /** Denominación o razón social */
    denominacionRazonsocial: '',
    /** Domicilio principal registrado */
    domicilio: '',

    /** Fecha de la última operación realizada */
    inputfechaDeLaUltimaOperacion: '',

    /** Indica si hubo fusión o escisión con operación en el exterior */
    fusionEscisionConOperacionExterior: '',

    /** Señala si es una empresa extranjera con programa IMMEX */
    empresaExtranjeraIMMEX: '',

    /** Monto asociado a la operación o certificación */
    monto: '',

    /** Operaciones bancarias registradas */
    operacionesBancarias: '',

    /** Llave de pago utilizada */
    llavePago: '',

    /** Indica si cuenta con programa IMMEX */
    cuentaConProgramaIMMEX: '',

    /** Rubro de certificación asignado */
    rubroCertificacion: '',

    /** Fecha de fin de vigencia del rubro de certificación */
    fechaFinVigenciaRubro: '',

    /** Número de oficio emitido */
    numeroOficio: '',

    /** Declaración anual de ISR de los representantes legales */
    declaracionAnualISRRepresentantes: '',

    /** Registro en esquema de certificación IVA-IEPS */
    registroEsquemaCertificacionIVAIEPS: '',

    /** Registro en otro esquema de certificación */
    registroEsquemaCertificacion: '',

    /** Tipo de información de la empresa */
    tipoInformacionEmpresa: '',

    /** Código CCAAT relacionado */
    ccat: '',

    /** Tabla de datos complementarios */
    tablaDatos: [],

    /** Lista de transportistas asociados */
    transportistasLista: [],

    /** Número de registro del representante legal */
    representanteRegistro: '',

    /** RFC del representante legal */
    representanteRfc: '',

    /** Nombre del representante legal */
    representanteNombre: '',

    /** Apellido paterno del representante legal */
    representanteApellidoPaterno: '',

    /** Apellido materno del representante legal */
    representanteApellidoMaterno: '',

    /** Teléfono de contacto del representante legal */
    representanteTelefono: '',

    /** Correo electrónico del representante legal */
    representanteCorreo: '',

    /** Registro asociado al enlace operativo */
    registro: '',

    /** RFC de la persona de enlace operativo */
    rfc: '',

    /** Nombre de la persona de enlace operativo */
    nombre: '',

    /** Apellido paterno del enlace operativo */
    apellidoPaterno: '',

    /** Apellido materno del enlace operativo */
    apellidoMaterno: '',

    /** Ciudad de residencia del enlace operativo */
    ciudad: '',

    /** Cargo o puesto de la persona de enlace operativo */
    cargo: '',

    /** Teléfono de contacto del enlace operativo */
    telefono: '',

    /** Correo electrónico del enlace operativo */
    correo: '',

    /** Indica si el enlace operativo tiene suplente */
    suplente: false,

    /** Datos adicionales del enlace operativo */
    enlaceOperativoData: [],

    /** Indica si cumple con el Anexo 24 de control de inventarios */
    cumpleAnexo24: false,

    /** Lugar de radicación del sistema de inventarios */
    lugarRadicacion: '',

    /** Nombre del sistema de control de inventarios */
    nombreSistema: '',

    /** Indica si cuenta con autorización por parte de CBP */
    autorizacionCBP: '',

    /** Señala si las instalaciones se encuentran certificadas por CBP */
    instalacionesCertificadasCBP: '',

    /** Define si existe suspensión o cancelación de certificaciones del CBP */
    suspensionCancelacionCBP: '',

    //perfiles
    perfiles: {
      /** Domicilio exacto de la instalación */
      domicilioDeLaInstalacion: '',

      /** Procedimiento descrito que se lleva a cabo en la instalación */
      describaProcedimiento: '',

      /** Criterios utilizados dentro del procedimiento */
      indiqueLosCriterios: '',

      /** Métodos aplicados para ejecutar el procedimiento */
      indiqueLosMetodos: '',

      /** Indicadores que permiten evaluar el procedimiento */
      describaLosIndicadores: '',

      /** Actividades relacionadas con el comercio exterior */
      comercioExterior: '',

      /** Uso de candados de seguridad en instalaciones o transporte */
      candadosSeguridad: '',

      /** Participación de proveedores externos en los procedimientos */
      proveedorExterno: '',

      /** Si la instalación es susceptible de contaminación */
      susceptibleContaminacion: '',

      /** Validación de que los contenedores se encuentren vacíos */
      encuentrenVacios: '',

      /** Revisión de semirremolques vacíos */
      semirremolquesVacios: '',

      /** Uso obligatorio de candados */
      utilizarCandado: '',

      /** Seguridad implementada en las mismas instalaciones */
      seguridadMismas: '',

      /** Procedimientos relacionados con la contratación de personal */
      describaContratacion: '',

      /** Documentación exigida para el cumplimiento de los procedimientos */
      documentacionExigida: '',

      /** Exámenes solicitados al personal como parte del control de seguridad */
      examenesSolicitados: '',

      /** Validación de resultados conforme a un análisis */
      conformeAnalisis: '',

      /** Periodicidad con la que se realizan las verificaciones */
      periodicidad: '',

      /** Medidas de confidencialidad aplicadas en los procedimientos */
      confidencialidad: '',
      /** Proceso de contratación del personal */
      contratacionPersonal: '',

      /** Procedimiento detallado de contratación del personal */
      describaProcedimientoPersonal: '',

      /** Seguimiento del procedimiento de contratación */
      seguimientoProcedimiento: '',

      /** Identificaciones requeridas para personal/visitantes */
      identificaciones: '',

      /** Sistemas informáticos implementados en la empresa */
      sistemasInformaticos: '',

      /** Proveedores de servicios utilizados */
      proveedoresServicios: '',

      /** Administración de personal dentro de la organización */
      administracionPersonal: '',

      /** Explicación breve de medidas o procedimientos */
      expliqueBrevemente: '',

      /** Situaciones en las que se encuentran fuera de control o área designada */
      encuentranFuera: '',

      /** Actualizaciones de seguridad realizadas */
      actualizacionesSeguridad: '',

      /** Acceso a los mismos sistemas o instalaciones */
      accesoLosMismos: '',

      /** Planes de continuidad de negocio */
      continuidadNegocio: '',

      /** Semana que corresponde a la aplicación del control/procedimiento */
      semanaCorresponda: '',

      /** Procedimiento para recuperar información */
      recuperarInformacion: '',

      /** Manejo de información archivada */
      informacionArchivada: '',

      /** Procesamiento de datos en la empresa */
      procesoDatos: '',

      /** Copias de seguridad implementadas */
      copiasSeguridad: '',

      /** Mecanismos de protección de la información */
      proteccionDeLaInformacion: '',

      /** Acciones ante pérdida de información */
      perdidaDeLaInformacion: '',

      /** Sistemas que controlan la información y procesos */
      controlanSistemas: '',

      /** Acciones ejecutadas por el resto del personal o áreas */
      accionesDelResto: '',

      /** Sistemas que manejan información confidencial */
      sistemasConfidenciales: '',

      /** Procedimiento de provisión y manejo de contraseñas */
      proporcionaEsasContrasenas: '',
      /** Actualizaciones periódicas realizadas a sistemas y procesos */
      actualizacionesPeriodicas: '',

      /** Registro de licencias falsificadas */
      falsificadosLicencias: '',

      /** Detalle del proceso de importación */
      procesoDeImportacion: '',

      /** Telecomunicaciones implementadas */
      telecomunicaciones: '',

      /** Indica si algún sistema ha sido comprometido */
      sistemaComprometido: '',

      /** Medidas de seguridad tecnológica aplicadas */
      seguridadDeLaTecnologia: '',

      /** Medios de transporte utilizados */
      mediosTransporte: '',

      /** Difusión de información relevante */
      estaDifusion: '',

      /** Enunciativa o limitativa de procedimientos */
      enunciativaLimitativa: '',

      /** Procedimientos implementados por la empresa */
      procedimientosEmpresa: '',

      /** Medios de transporte registrados (duplicado opcional) */
      mediosDeTransporte: '',

      /** Procesos relacionados con seguridad */
      relacionadosSeguridad: '',

      /** Procedimiento para reportar incidentes */
      reportarIncidentes: '',

      /** Registro de actividades sospechosas */
      actividadesSospechosas: '',

      /** Explicación breve de la seguridad implementada */
      brevementeSonsiste: '',

      /** Detalle de incidentes de seguridad */
      incidenteSeguridad: '',

      /** Encargado de la investigación de incidentes */
      caboInvestigacion: '',

      /** Operación realizada por el encargado de la investigación */
      operacionCaboInvestigacion: '',

      /** Antigüedad de la empresa o instalación */
      antiguedad: '',

      /** Productos manejados por la empresa */
      productos: '',

      /** Número de embarques de exportación */
      embarquesExp: '',

      /** Número de embarques de importación */
      embarquesImp: '',

      /** Número de empleados */
      empleados: '',

      /** Superficie de las instalaciones */
      superficie: '',

      /** Número de CTPAT BL */
      blCtpat: '',

      /** Nivel del certificado CTPAT */
      niverCertificado: '',

      /** Número de cuenta CTPAT */
      ctpatAccountNumber: '',

      /** Código MID de la empresa */
      codigoMid: '',

      /** Fecha de última certificación CTPAT */
      fecUltimaCtapt: '',

      /** Indicador de participación en PIP */
      blnPip: '',

      /** Número de registro PIP */
      numRegistroPip: '',
      /** Indicador de participación en el programa OEA */
      blnOea: '',

      /** Nombre del programa y país correspondiente al OEA */
      nomProgramapaisOea: '',

      /** Número de registro en el programa OEA */
      numRegistroOea: '',

      /** Indicador de participación en otros programas de seguimiento */
      blnOtrosProgramasSegu: '',

      /** Nombre de otros programas en los que participa la empresa */
      nombreProgramaOtros: '',

      /** Número de registro en otros programas */
      numRegistroOtros: '',

      /** Fecha de vigencia de otros programas */
      fechaVigenciaOtros: '',

      /** Nombre del primer programa de certificación interno */
      nombre: '',

      /** Categoría del primer programa */
      categoria: '',

      /** Vigencia del primer programa */
      vigencia: '',

      /** Nombre del segundo programa de certificación interno */
      nombre2: '',

      /** Categoría del segundo programa */
      categoria2: '',

      /** Vigencia del segundo programa */
      vigencia2: '',

      /** Nombre del tercer programa de certificación interno */
      nombre3: '',

      /** Categoría del tercer programa */
      categoria3: '',

      /** Vigencia del tercer programa */
      vigencia3: '',

      /** Procedimiento documentado en la empresa */
      procedimientoDocumentado: '',

      /** Número de procedimiento documentado */
      indiqueNumero: '',

      /** Cargos y funciones relacionados al procedimiento */
      cargosFunciones: '',

      /** Indica si el procedimiento se contrata */
      casoContratarse: '',

      /** Indica si el procedimiento se cuenta internamente */
      casoContar: '',

      /** Descripción detallada del procedimiento */
      describirProcedimiento: '',

      /** Mecanismos utilizados en el procedimiento */
      indiqueMecanismos: '',

      /** Número de empleados involucrados */
      indicarEmpleados: '',

      /** Identificación de los empleados implicados */
      indiqueIdentifica: '',

      /** Descripción de la empresa o área responsable */
      describaEmpresa: '',

      /** Medidas para asegurar el cumplimiento del procedimiento */
      indiqueAsegura: '',

      /** Procedimiento implementado para control interno */
      procedimientoParaControl: '',
      /** Señala los registros correspondientes */
      senaleRegistros: '',

      /** Indica quién es responsable de los registros */
      senaleQuien: '',

      /** Descripción de la recepción de documentos o procesos */
      describaRecepion: '',

      /** Indica el encargado de un procedimiento */
      indiqueEncargado: '',

      /** Identificación del encargado */
      indiqueIdentfica: '',

      /** Señala cómo se realiza un procedimiento */
      senaleComo: '',

      /** Descripción de las características del procedimiento */
      describaCaracteristicas: '',

      /** Señala las acciones realizadas */
      senaleAccion: '',

      /** Indica qué lleva a cabo el responsable */
      indiqueLleva: '',

      /** Descripción de un segundo procedimiento relacionado */
      describaProcedimientoDos: '',

      /** Indica los socios involucrados */
      indiqueSocios: '',

      /** Forma en que se realiza el procedimiento */
      indiqueForma: '',

      /** Indica si existen elementos relacionados */
      indiqueExisten: '',

      /** Indica la cuenta asociada al procedimiento */
      indiqueCuenta: '',

      /** Procedimiento a realizar */
      procedimientoRealizar: '',

      /** Periodicidad del procedimiento */
      indiquePeriodicidad: '',

      /** Descripción de cómo se realiza el procedimiento */
      describaComo: '',

      /** Cómo se asegura la correcta ejecución */
      comoAseguran: '',

      /** Formatos utilizados en el procedimiento */
      indiqueFormatos: '',

      /** Medidas señaladas para seguridad o control */
      senalarMedidas: '',

      /** Indica los almacenes involucrados */
      indiqueAlmacenes: '',

      /** Breve explicación del procedimiento */
      expliqueBrevemente2: '',

      /** Indica cómo se cerciora el responsable */
      indiqueCerciora: '',

      /** Señala los elementos involucrados */
      indiqueEstos: '',

      /** Indica a qué pertenecen los elementos */
      indiquePertenecen: '',

      /** Indica el responsable del procedimiento */
      indiqueResponsable: '',

      /** Tecnología utilizada en el procedimiento */
      indiqueTecnologia: '',

      /** Descripción del procesamiento de información o materiales */
      describirProcesamiento: '',

      /** Detalle de cómo se ejecuta el procedimiento */
      detalleComo: '',

      /** Indica la utilización de recursos o herramientas */
      indiqueUtiliza: '',

      /** Detalle de validaciones realizadas */
      detalleValida: '',

      /** Número asociado al procedimiento o proceso */
      comoNumero: '',

      /** Señala los asociados involucrados */
      senaleAsociados: '',

      /** Indica los materiales involucrados */
      indiqueMateriales: '',

      /** Forma en que se realiza un procedimiento o acción */
      queForma: '',

      /** Personal responsable de las tareas */
      personalResponsable: '',

      /** Cuántas personas están involucradas */
      indiqueCuantas: '',

      /** Indica las tareas monitoreadas */
      indiqueMonitoreadas: '',

      /** Detalle de elementos existentes */
      detalleExisten: '',

      /** Descripción de accesos */
      describaAcceso: '',

      /** Tipo de procesos realizados */
      describirTipo: '',

      /** Áreas involucradas */
      describaAreas: '',

      /** Señala las mismas áreas o elementos */
      senaleMismas: '',

      /** Caso en que no se cuentan elementos */
      casoNoContar: '',

      /** Periodicidad de verificación */
      periodicidadVerifica: '',

      /** Tareas específicas a realizar */
      indiqueTareas: '',

      /** Descripción de la manera en que se realiza el procedimiento */
      describaManera: '',

      /** Indica cómo se separan áreas o recursos */
      indiqueSepara: '',

      /** Señala áreas restringidas */
      senaleRestringido: '',

      /** Descripción del monitoreo realizado */
      describaMonitoreo: '',

      /** Responsables de controlar las actividades */
      responsablesControlar: '',

      /** Información sobre estacionamientos */
      estacionamientos: '',

      /** Control de acceso mediante entradas */
      llevaEntrada: '',

      /** Políticas y mecanismos aplicados */
      politicasMecanismos: '',

      /** Procedimientos de operación */
      procedimientoOperacion: '',

      /** Señala dónde se encuentran los elementos o personal */
      senaleEncuentran: '',

      /** Cuenta los elementos o recursos */
      mencioneCuenta: '',

      /** Indica de qué manera se realiza el control */
      queManera: '',

      /** Cómo se contacta al personal responsable */
      describaContactar: '',

      /** Indica los operativos involucrados */
      indiqueOperativo: '',

      /** Aparatos utilizados para seguridad o monitoreo */
      indiqueAparatos: '',

      /** Mantenimiento de instalaciones o equipos */
      mantenimiento: '',

      /** Políticas relacionadas con aparatos de seguridad */
      politicasAparatos: '',

      /** Programa de mantenimiento implementado */
      programaMantenimiento: '',

      /** Indica el respaldo de información o sistemas */
      indiqueRespaldo: '',

      /** Descripción de la alarma instalada */
      describaAlarma: '',

      /** Indica los sistemas que utilizan */
      indiqueUtilizan: '',

      /** Descripción de los sistemas implementados */
      describaSistemas: '',

      /** Indica las cámaras de seguridad */
      indicarCamaras: '',

      /** Menciones de inspecciones realizadas */
      mencioneInspeccion: '',

      /** Señala la ubicación de sistemas o controles */
      senalarUbicacion: '',

      /** Horarios de operación o monitoreo */
      indiqueHorarios: '',

      /** Indica quién revisa o controla */
      indiqueRevisan: '',

      /** Personal designado para tareas de seguridad */
      indiqueDesignado: '',

      /** Cómo se documentan los procedimientos */
      comoDocumentan: '',

      /** Indica el tiempo de monitoreo o revisión */
      indiqueTiempo: '',

      /** Cuenta de plantas o instalaciones */
      contarPlanta: '',

      /** Sistemas implementados */
      estosSistemas: '',

      /** Circuito de seguridad o control */
      indicarCircuito: '',

      /** Descripción de cómo se implementa el control */
      describaImplementado: '',

      /** Forma en que se controla un área o proceso */
      formaControlan: '',

      /** Indica todos los elementos involucrados */
      indiqueTodas: '',

      /** Indica la planta o área específica */
      indiquePlanta: '',

      /** Cuenta documentada de procesos o recursos */
      cuentaDocumentado: '',
      /** Indica las puertas de acceso */
      indiquePuertas: '',

      /** Estado de cierre de las puertas */
      indiqueCerrado: '',

      /** Indica el circuito cerrado implementado */
      indicarCircuitoCerrado: '',

      /** Registro de visitantes en instalaciones */
      registroVisitantes: '',

      /** Casos relacionados con socios de la empresa */
      casoSocios: '',

      /** Información sobre otras empresas relacionadas */
      estosEmpresa: '',

      /** Comité de seguridad encargado */
      comiteSeguridad: '',

      /** Fuentes de información utilizadas */
      fuentesInformacion: '',

      /** Políticas aplicadas */
      politica: '',

      /** Indicaciones generales */
      indique: '',

      /** Periodicidad de actividades o controles */
      periodicidad2: '',

      /** Programas de seguridad o gestión implementados */
      programa: '',

      /** Capacitación del personal */
      capacitacion: '',

      /** Procedimientos documentados */
      procedimiento: '',

      /** Descripción detallada del procedimiento */
      descripcionProcedimiento: '',

      /** Nombre del procedimiento */
      nombreProcedimiento: '',

      /** Programación de auditorías internas o externas */
      programacionAuditoria: '',

      /** Participantes de las auditorías */
      participantesAuditoria: '',

      /** Enfoque de la auditoría realizada */
      enfoqueAuditoria: '',

      /** Procesos auditados */
      procesosAuditados: '',

      /** Registros de auditoría */
      registrosAuditoria: '',

      /** Programación de actividades relacionadas */
      programacion: '',

      /** Nombre de los registros auditados */
      registrosNombre: '',

      /** Empresa responsable de los registros */
      registrosEmpresa: '',

      /** Plan de emergencia implementado */
      planEmergencia: '',

      /** Situaciones contempladas en el plan */
      situacionesContempladas: '',

      /** Mecanismos de continuidad del negocio */
      mecanismosContinuidad: '',

      /** Documentación de simulacros realizados */
      simulacrosDocumentacion: '',
    }
  };
}
/**
 * Store encargado de manejar el estado de la solicitud 32605.
 * Extiende de Akita Store y permite actualizar el estado de forma parcial.
 * Realiza merge profundo en el objeto perfiles para evitar sobrescribir datos existentes.
 * const store = new Solicitud32605Store();
 * store.actualizarEstado({ nombre: 'Empresa S.A.', perfiles: { domicilioDeLaInstalacion: 'CDMX' } });
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'solicitud32605',
  resettable: true,
})
/** Clase encargada de manejar el estado de 'Solicitud32605' mediante el uso de un store.
 *  Esta clase extiende de la clase 'Store', lo que permite la gestión centralizada del estado.
 */
export class Solicitud32605Store extends Store<Solicitud32605State> {
  /**
   * Constructor que inicializa el estado de la solicitud.
   * Utiliza la función `createInitialSolicitudState` para establecer el estado inicial.
   */
  constructor() {
    super(createInitialSolicitudState());
  }

  /**
   * Actualiza el estado del store con los valores proporcionados.
   * Valores parciales para actualizar el estado.
   */
  public actualizarEstado(valores: Partial<Solicitud32605State>): void {
    this.update((state) => {
      const { perfiles: PERFILES, ...OTHER_VALUES } = valores;

      const NEW_STATE = {
        ...state,
        ...OTHER_VALUES,
        ...(PERFILES && {
          perfiles: {
            ...state.perfiles,
            ...PERFILES,
          },
        }),
      };

      return NEW_STATE;
    });
  }
}
