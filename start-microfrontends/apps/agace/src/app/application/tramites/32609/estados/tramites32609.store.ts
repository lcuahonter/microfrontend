import { AgregarMiembroEmpresaTabla, ControlInventariosTabla, DomiciliosRfcSolicitanteTabla, EmpresaDelGrupo, NumeroEmpleadosTabla, TablaEnlaceOperativo, TransportistasTable } from '../modelos/oea-textil-registro.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';


/**
 * @interfaz
 * @nombre Tramites32609State
 * @descripción
 * Define la estructura del estado para el trámite 32609.
 * Contiene propiedades relacionadas con los datos del trámite, como información de pago, datos de vehículos, agentes y más.
 */

/**
 * Interface para la respuesta de la API
 * @template T - Tipo de datos que se espera en la respuesta.
 */
export interface StoreResponse {
  code: number;
  data: Tramites32609State;
  message: string;
}

export interface PerfilesDatos {
  describaProcedimiento: string;
  indiqueLosCriterios: string;
  indiqueLosMetodos: string;
  describaLosIndicadores: string;
  comercioExterior: string;
  candadosSeguridad: string;
  proveedorExterno: string;
  susceptibleContaminacion: string;
  encuentrenVacios: string;
  semirremolquesVacios: string;
  utilizarCandado: string;
  seguridadMismas: string;
  describaContratacion: string;
  documentacionExigida: string;
  examenesSolicitados: string;
  conformeAnalisis: string;
  periodicidad: string;
  confidencialidad: string;
  contratacionPersonal: string;
  describaProcedimientoPersonal: string;
  seguimientoProcedimiento: string;
  identificaciones: string;
  sistemasInformaticos: string;
  proveedoresServicios: string;
  administracionPersonal: string;
  expliqueBrevemente: string;
  encuentranFuera: string;
  actualizacionesSeguridad: string;
  accesoLosMismos: string;
  continuidadNegocio: string;
  semanaCorresponda: string;
  recuperarInformacion: string;
  informacionArchivada: string;
  procesoDatos: string;
  copiasSeguridad: string;
  proteccionDeLaInformacion: string;
  perdidaDeLaInformacion: string;
  controlanSistemas: string;
  accionesDelResto: string;
  sistemasConfidenciales: string;
  proporcionaEsasContrasenas: string;
  actualizacionesPeriodicas: string;
  falsificadosLicencias: string;
  procesoDeImportacion: string;
  telecomunicaciones: string;
  sistemaComprometido: string;
  seguridadDeLaTecnologia: string;
  mediosTransporte: string;
  estaDifusion: string;
  enunciativaLimitativa: string;
  procedimientosEmpresa: string;
  mediosDeTransporte: string;
  relacionadosSeguridad: string;
  reportarIncidentes: string;
  actividadesSospechosas: string;
  brevementeSonsiste: string;
  incidenteSeguridad: string;
  caboInvestigacion: string;
  operacionCaboInvestigacion: string;
  antiguedad: number | string;
  productos: number | string;
  embarquesExp: number | string;
  embarquesImp: number | string;
  empleados: number | string;
  superficie: number | string;
  blCtpat: string;
  niverCertificado?: string;
  ctpatAccountNumber?: string;
  codigoMid?: string;
  fecUltimaCtapt?: Date | string;
  blnPip: string;
  numRegistroPip?: string;
  blnOea: string;
  nomProgramapaisOea?: string;
  numRegistroOea?: string;
  blnOtrosProgramasSegu: string;
  nombreProgramaOtros?: string;
  numRegistroOtros?: string;
  fechaVigenciaOtros?: Date | string;
  nombre: string;
  categoria: string;
  vigencia: string;
  nombre2: string;
  categoria2: string;
  vigencia2: string;
  nombre3: string;
  categoria3: string;
  vigencia3: string;

  procedimientoDocumentado: string;
indiqueNumero: string;
cargosFunciones: string;
casoContratarse: string;
casoContar: string;
describirProcedimiento: string;
indiqueMecanismos: string;
indicarEmpleados: string;
indiqueIdentifica: string;
describaEmpresa: string;
indiqueAsegura: string;
procedimientoParaControl: string;
senaleRegistros: string;
senaleQuien: string;
describaRecepion: string;
indiqueEncargado: string;
indiqueIdentfica: string;
senaleComo: string;
describaCaracteristicas: string;
senaleAccion: string;
indiqueLleva: string;
describaProcedimientoDos: string;
indiqueSocios: string;
indiqueForma: string;
indiqueExisten: string;
indiqueCuenta: string;
procedimientoRealizar: string;
indiquePeriodicidad: string;
describaComo: string;
comoAseguran: string;
indiqueFormatos: string;
senalarMedidas: string;
indiqueAlmacenes: string;
expliqueBrevemente2: string;
indiqueCerciora: string;
indiqueEstos: string;
indiquePertenecen: string;
indiqueResponsable: string;
indiqueTecnologia: string;
describirProcesamiento: string;
detalleComo: string;
indiqueUtiliza: string;
detalleValida: string;
comoNumero: string;
senaleAsociados: string;
indiqueMateriales: string;
queForma: string;
personalResponsable: string;
indiqueCuantas: string;
indiqueMonitoreadas: string;
detalleExisten: string;
describaAcceso: string;
describirTipo: string;
describaAreas: string;
senaleMismas: string;
casoNoContar: string;
periodicidadVerifica: string;
indiqueTareas: string;
describaManera: string;
indiqueSepara: string;
senaleRestringido: string;
describaMonitoreo: string;
responsablesControlar: string;
estacionamientos: string;
llevaEntrada: string;
politicasMecanismos: string;
procedimientoOperacion: string;
senaleEncuentran: string;
mencioneCuenta: string;
queManera: string;
describaContactar: string;
indiqueOperativo: string;
indiqueAparatos: string;
mantenimiento: string;
politicasAparatos: string;
programaMantenimiento: string;
indiqueRespaldo: string;
describaAlarma: string;
indiqueUtilizan: string;
describaSistemas: string;
indicarCamaras: string;
mencioneInspeccion: string;
senalarUbicacion: string;
indiqueHorarios: string;
indiqueRevisan: string;
indiqueDesignado: string;
comoDocumentan: string;
indiqueTiempo: string;
contarPlanta: string;
estosSistemas: string;
indicarCircuito: string;
describaImplementado: string;
formaControlan: string;
indiqueTodas: string;
indiquePlanta: string;
cuentaDocumentado: string;
indiquePuertas: string;
indiqueCerrado: string;
indicarCircuitoCerrado: string;
registroVisitantes: string;
casoSocios: string;
estosEmpresa: string;
comiteSeguridad: string;
fuentesInformacion: string;
politica: string;
indique: string;
periodicidad2: string;
programa: string;
capacitacion: string;
procedimiento: string;
descripcionProcedimiento: string;
nombreProcedimiento: string;
programacionAuditoria: string;
participantesAuditoria: string;
enfoqueAuditoria: string;
procesosAuditados: string;
registrosAuditoria: string;
programacion: string;
registrosNombre: string;
registrosEmpresa: string;
planEmergencia: string;
situacionesContempladas: string;
mecanismosContinuidad: string;
simulacrosDocumentacion: string;

}
export interface Tramites32609State {
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
  numeroEmpleadosBimestre:NumeroEmpleadosTabla[]; // Lista de números de empleados por bimestre
  DomiciliosRfcSolicitante:DomiciliosRfcSolicitanteTabla[], // Lista de domicilios del RFC solicitante
  controlInventarios:ControlInventariosTabla[]; // Lista de control de inventarios
  querellaSATUltimos3Anios: string; // Indica si hay querellas del SAT en los últimos 3 años
  ingresoInfoContableSAT:string; // Indica si se ingresa información contable al SAT
  agregarMiembroEmpresa:AgregarMiembroEmpresaTabla[]; 
  manifests:boolean; // Indica si se han agregado manifiestos
  bajoProtesta:boolean; // Indica si se realiza bajo protesta
  sistemaControlInventariosArt59:string;
  comercioExteriorRealizado: string; // Indica si se realiza comercio exterior
  fechaDePago:string; // Fecha de pago asociada a la solicitud
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
  
  representanteRegistro: string; // Registro del representante legal
  representanteRfc: string; // RFC del representante legal
  representanteNombre: string; // Nombre del representante legal
  representanteApellidoPaterno: string; // Apellido paterno del representante legal
  representanteApellidoMaterno: string; // Apellido materno del representante legal
  representanteTelefono: string; // Teléfono del representante legal
  representanteCorreo: string; // Correo del representante legal
  registro: string; // Registro del representante legal
  rfc: string; // RFC del representante legal
  nombre: string; // Nombre del representante legal
  apellidoPaterno: string; // Apellido paterno del representante legal
  apellidoMaterno: string; // Apellido materno del representante legal
  ciudad: string; // Ciudad del representante legal
  cargo: string; // Cargo del representante legal
  telefono: string; // Teléfono del representante legal
  correo: string; // Correo del representante legal
  suplente: boolean; // Indica si el representante es suplente
  enlaceOperativoData: TablaEnlaceOperativo[]; // Datos del enlace operativo, incluyendo RFC, nombre, apellidos, teléfono y correo electrónico

  autorizacionCBP: string, // Autorización CBP (Customs and Border Protection)
  instalacionesCertificadasCBP: string, // Indica si las instalaciones están certificadas por CBP
  suspensionCancelacionCBP: string // Indica si hay suspensión o cancelación por parte de CBP

/// perfiles
  perfiles: Partial<PerfilesDatos>;


}


/**
 * @función
 * @nombre createInitialState
 * @descripción
 * Crea y devuelve el estado inicial para el trámite 32609.
 * 
 * @retorna {Tramites32609State} El estado inicial del trámite.
 */
export function createInitialState(): Tramites32609State {
  return {
  sectorProductivo: '',
  sectorServicio: '',
  cumplimientoFiscalAduanero: '',
  autorizaOpinionSAT: '',
  cuentaConEmpleadosPropios: '',
  bimestreUltimo: '',
  numeroDeEmpleadas: '',
  retencionISRTrabajadores: '',
  pagoCuotasIMSS: '',
  cuentaConSubcontratacionEspecializada: '',
  registroPadronLFT: '',
  listadoSATArt69: '',
  listadoSATArt69B: '',
  listadoSATArt69BBis: '',
  certificadosSellosVigentes: '',
  infringioSupuestos17HBis: '',
  mediosContactoActualizadosBuzon: '',
  suspensionPadronImportadoresExportadores: '',
  archivoNacionales: '',
  proveedores: '',
  domiciliosRegistrados:'',
  numeroEmpleadosBimestre:[],
  DomiciliosRfcSolicitante:[],
  controlInventarios: [],
  querellaSATUltimos3Anios: '',
  ingresoInfoContableSAT: '',
  agregarMiembroEmpresa: [],
  manifests:false,
  bajoProtesta:false,
  sistemaControlInventariosArt59: '',
  comercioExteriorRealizado:'',
  fechaDePago: '',
  fechaInicioComercio: '',
  esParteGrupoComercioExterior: '',
  rfcEnclaveOperativo: '',
  enlaceOperativorfc:'',
  denominacionRazonsocial: '',
  domicilio: '',
  inputfechaDeLaUltimaOperacion: '',
  fusionEscisionConOperacionExterior: '',
  empresaExtranjeraIMMEX: '',
  monto: '',
  operacionesBancarias: '',
  llavePago: '',
  cuentaConProgramaIMMEX: '',
  rubroCertificacion: '',
  fechaFinVigenciaRubro: '',
  numeroOficio: '',
  declaracionAnualISRRepresentantes: '',
  registroEsquemaCertificacionIVAIEPS: '',
  registroEsquemaCertificacion: '',
  tipoInformacionEmpresa: '',
  ccat: '',
  tablaDatos: [],
  transportistasLista: [],

  representanteRegistro: '',
  representanteRfc: '',
  representanteNombre: '',
  representanteApellidoPaterno: '',
  representanteApellidoMaterno: '',
  representanteTelefono: '',
  representanteCorreo: '',
  registro: '',
  rfc: '',
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  ciudad: '',
  cargo: '',
  telefono: '',
  correo: '',
  suplente: false,
  enlaceOperativoData: [],

  autorizacionCBP: '',
  instalacionesCertificadasCBP: '',
  suspensionCancelacionCBP: '',

  //perfiles
  perfiles: {
    describaProcedimiento: '',
    indiqueLosCriterios: '',
    indiqueLosMetodos: '',
    describaLosIndicadores: '',
    comercioExterior: '',
    candadosSeguridad: '',
    proveedorExterno: '',
    susceptibleContaminacion: '',
    encuentrenVacios: '',
    semirremolquesVacios: '',
    utilizarCandado: '',
    seguridadMismas: '',
    describaContratacion: '',
    documentacionExigida: '',
    examenesSolicitados: '',
    conformeAnalisis: '',
    periodicidad: '',
    confidencialidad: '',
    contratacionPersonal: '',
    describaProcedimientoPersonal: '',
    seguimientoProcedimiento: '',
    identificaciones: '',
    sistemasInformaticos: '',
    proveedoresServicios: '',
    administracionPersonal: '',
    expliqueBrevemente: '',
    encuentranFuera: '',
    actualizacionesSeguridad: '',
    accesoLosMismos: '',
    continuidadNegocio: '',
    semanaCorresponda: '',
    recuperarInformacion: '',
    informacionArchivada: '',
    procesoDatos: '',
    copiasSeguridad: '',
    proteccionDeLaInformacion: '',
    perdidaDeLaInformacion: '',
    controlanSistemas: '',
    accionesDelResto: '',
    sistemasConfidenciales: '',
    proporcionaEsasContrasenas: '',
    actualizacionesPeriodicas: '',
    falsificadosLicencias: '',
    procesoDeImportacion: '',
    telecomunicaciones: '',
    sistemaComprometido: '',
    seguridadDeLaTecnologia: '',
    mediosTransporte: '',
    estaDifusion: '',
    enunciativaLimitativa: '',
    procedimientosEmpresa: '',
    mediosDeTransporte: '',
    relacionadosSeguridad: '',
    reportarIncidentes: '',
    actividadesSospechosas: '',
    brevementeSonsiste: '',
    incidenteSeguridad: '',
    caboInvestigacion: '',
    operacionCaboInvestigacion: '',
    antiguedad: '',
    productos: '',
    embarquesExp: '',
    embarquesImp: '',
    empleados: '',
    superficie: '',
    blCtpat: '',
    niverCertificado: '',
    ctpatAccountNumber: '',
    codigoMid: '',
    fecUltimaCtapt: '',
    blnPip: '',
    numRegistroPip: '',
    blnOea: '',
    nomProgramapaisOea: '',
    numRegistroOea: '',
    blnOtrosProgramasSegu: '',
    nombreProgramaOtros: '',
    numRegistroOtros: '',
    fechaVigenciaOtros: '',
    nombre: '',
    categoria: '',
    vigencia: '',
    nombre2: '',
    categoria2: '',
    vigencia2: '',
    nombre3: '',
    categoria3: '',
    vigencia3: '',
    procedimientoDocumentado: '',
  indiqueNumero: '',
  cargosFunciones: '',
  casoContratarse: '',
  casoContar: '',
  describirProcedimiento: '',
  indiqueMecanismos: '',
  indicarEmpleados: '',
  indiqueIdentifica: '',
  describaEmpresa: '',
  indiqueAsegura: '',
  procedimientoParaControl: '',
  senaleRegistros: '',
  senaleQuien: '',
  describaRecepion: '',
  indiqueEncargado: '',
  indiqueIdentfica: '',
  senaleComo: '',
  describaCaracteristicas: '',
  senaleAccion: '',
  indiqueLleva: '',
  describaProcedimientoDos: '',
  indiqueSocios: '',
  indiqueForma: '',
  indiqueExisten: '',
  indiqueCuenta: '',
  procedimientoRealizar: '',
  indiquePeriodicidad: '',
  describaComo: '',
  comoAseguran: '',
  indiqueFormatos: '',
  senalarMedidas: '',
  indiqueAlmacenes: '',
  expliqueBrevemente2: '',
  indiqueCerciora: '',
  indiqueEstos: '',
  indiquePertenecen: '',
  indiqueResponsable: '',
  indiqueTecnologia: '',
  describirProcesamiento: '',
  detalleComo: '',
  indiqueUtiliza: '',
  detalleValida: '',
  comoNumero: '',
  senaleAsociados: '',
  indiqueMateriales: '',
  queForma: '',
  personalResponsable: '',
  indiqueCuantas: '',
  indiqueMonitoreadas: '',
  detalleExisten: '',
  describaAcceso: '',
  describirTipo: '',
  describaAreas: '',
  senaleMismas: '',
  casoNoContar: '',
  periodicidadVerifica: '',
  indiqueTareas: '',
  describaManera: '',
  indiqueSepara: '',
  senaleRestringido: '',
  describaMonitoreo: '',
  responsablesControlar: '',
  estacionamientos: '',
  llevaEntrada: '',
  politicasMecanismos: '',
  procedimientoOperacion: '',
  senaleEncuentran: '',
  mencioneCuenta: '',
  queManera: '',
  describaContactar: '',
  indiqueOperativo: '',
  indiqueAparatos: '',
  mantenimiento: '',
  politicasAparatos: '',
  programaMantenimiento: '',
  indiqueRespaldo: '',
  describaAlarma: '',
  indiqueUtilizan: '',
  describaSistemas: '',
  indicarCamaras: '',
  mencioneInspeccion: '',
  senalarUbicacion: '',
  indiqueHorarios: '',
  indiqueRevisan: '',
  indiqueDesignado: '',
  comoDocumentan: '',
  indiqueTiempo: '',
  contarPlanta: '',
  estosSistemas: '',
  indicarCircuito: '',
  describaImplementado: '',
  formaControlan: '',
  indiqueTodas: '',
  indiquePlanta: '',
  cuentaDocumentado: '',
  indiquePuertas: '',
  indiqueCerrado: '',
  indicarCircuitoCerrado: '',
  registroVisitantes: '',
  casoSocios: '',
  estosEmpresa: '',
  comiteSeguridad: '',
  fuentesInformacion: '',
  politica: '',
  indique: '',
  periodicidad2: '',
  programa: '',
  capacitacion: '',
  procedimiento: '',
  descripcionProcedimiento: '',
  nombreProcedimiento: '',
  programacionAuditoria: '',
  participantesAuditoria: '',
  enfoqueAuditoria: '',
  procesosAuditados: '',
  registrosAuditoria: '',
  programacion: '',
  registrosNombre: '',
  registrosEmpresa: '',
  planEmergencia: '',
  situacionesContempladas: '',
  mecanismosContinuidad: '',
  simulacrosDocumentacion: ''
  }
  
};
}

/**
 * @clase
 * @nombre Tramite32609Store
 * @descripción
 * Clase que extiende de `Store` de Akita para gestionar el estado del trámite 32609.
 * Proporciona métodos para actualizar diferentes partes del estado, como datos de vehículos, agentes y registros.
 * 
 * @decorador @Injectable
 * @decorador @StoreConfig
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramites32609', resettable: true })
export class Tramite32609Store extends Store<Tramites32609State> {
   
  /**
   * @constructor
   * @descripción
   * Constructor que inicializa la tienda con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @método
   * @nombre establecerDatos
   * @descripción
   * Actualiza el estado con los valores proporcionados.
   * Realiza una fusión profunda para objetos anidados como 'perfiles'.
   * 
   * @param {Partial<Tramites32609State>} values - Valores parciales para actualizar el estado.
   */
  public establecerDatos(values: Partial<Tramites32609State>): void {    
    this.update((state) => {
      // Extract perfiles from values to handle separately
      const { perfiles: PERFILES, ...OTHER_VALUES } = values;
      
      const NEW_STATE = {
        ...state,
        ...OTHER_VALUES,
        // Deep merge for perfiles if provided
        ...(PERFILES && {
          perfiles: {
            ...state.perfiles,
            ...PERFILES,
          }
        }),
      };
      
      return NEW_STATE;
    });
  }
}