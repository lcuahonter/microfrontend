import { AgregarMiembroEmpresaTabla, ControlInventariosTabla, DomiciliosRfcSolicitanteTabla, EmpresaDelGrupo, NumeroEmpleadosTabla, TablaEnlaceOperativo, TercerosContratados, TransportistasTable } from '../modelos/oea-tercerizacion-logistica-registro.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';


/**
 * @interfaz
 * @nombre Tramites32617State
 * @descripción
 * Define la estructura del estado para el trámite 32617.
 * Contiene propiedades relacionadas con los datos del trámite, como información de pago, datos de vehículos, agentes y más.
 */

/**
 * Interface para la respuesta de la API
 * @template T - Tipo de datos que se espera en la respuesta.
 */
export interface StoreResponse {
  code: number;
  data: Tramites32617State;
  message: string;
}
export interface Tramites32617State {
  representanteRegistro: string; //Representante registro
  representanteRfc: string; //Representante RFC
  representanteNombre: string; //Representante nombre
  representanteApellidoPaterno: string; //Representante apellido paterno
  representanteApellidoMaterno: string; //Representante apellido materno
  representanteTelefono: string; //Representante teléfono
  representanteCorreo: string; //Representante correo
  registro: string; //Registro único del enlace operativo
  rfc: string; //RFC de la empresa
  nombre: string; //Nombre de la empresa
  apellidoPaterno: string; //Apellido paterno
  apellidoMaterno: string; //Apellido materno
  ciudad: string; //Ciudad
  cargo: string; //Cargo
  telefono: string; //Teléfono
  correo: string; //Correo
  suplente: boolean; //Indica si es suplente
  enlaceOperativoData: TablaEnlaceOperativo[]; //Datos del enlace operativo
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
  registros: string; // Indica si se han realizado registros
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
  registroEsquemaCertificacion: string; //Registro esquema certificación ('1' para Sí,'0' para No)
  tipoInformacionEmpresa: string; //Tipo información empresa ('1' para Pública,'0' para Privada)
  programaIMMEX: string; // Programa IMMEX ('1' para Sí,'0' para No)
  modalidadIVAAeIEPS: string; // Modalidad IVA e IEPS ('1' para Sí,'0' para No)
  documentaciónDeComercioExterior: string; // Documentación de comercio exterior ('1' para Sí,'0' para No)
  utilizandoSuPropioTransporte: string; // Utilizando su propio transporte ('1' para Sí,'0' para No)
  serviciosTercerosConCertificacion: string; // Servicios terceros con certificación ('1' para Sí,'0' para No)
  modalidadIVAAeIEPSFecha: string; // Fecha de modalidad IVA e IEPS
  modalidadIVAAeIEPSValor: string; // Valor de modalidad IVA e IEPS
  numeroDeAutorizacion: string; // Número de autorización
  ccat: string; //Número registro CAAT vigente transportista
  tablaDatos: EmpresaDelGrupo[]; //Lista empresas grupo comercial relacionadas
  tablaDatosTC: TercerosContratados[]; //Lista terceros contratados relacionados
  transportistasLista: TransportistasTable[]; //Lista transportistas autorizados
  autorizacionCBP: string; //Autorización CBP
  instalacionesCertificadasCBP: string; //Instalaciones certificadas CBP
  suspensionCancelacionCBP: string; //Suspensión o cancelación CBP
  rfcTerceroContratado: string; // RFC del tercero contratado
  rfcTC: string; // RFC del tercero contratado (solo lectura)
  nombreDenominacionTC: string; // Nombre o denominación del tercero contratado
  ctpatCertificadoTC: string; // Certificado CTPAT del tercero contratado
  registroEsquemaCertificacionTC: string; // Registro esquema certificación del tercero contratado
  registroSocioComercialCertificadoTC: string; // Registro socio comercial certificado del tercero contratado
  perfiles: Partial<PerfilesDatos>; // Perfiles de datos, con propiedades opcionales
}

export interface PerfilesDatos {
  suspensionCancelacionCBP: string; // Suspensión o cancelación CBP
  perfiles: Partial<PerfilesDatos>; // Perfiles de datos, con propiedades opcionales
  describaProcedimiento: string; // Describa procedimiento
  indiqueLosCriterios: string; // Indique los criterios
  indiqueLosMetodos: string; // Indique los métodos
  describaLosIndicadores: string; // Describa los indicadores
  comercioExterior: string; // Comercio exterior
  candadosSeguridad: string; // Candados seguridad
  proveedorExterno: string; // Proveedor externo
  susceptibleContaminacion: string; // Susceptible contaminación
  encuentrenVacios: string; // Encuentren vacíos
  semirremolquesVacios: string; // Semirremolques vacíos
  utilizarCandado: string; // Utilizar candado
  seguridadMismas: string; // Seguridad mismas
  describaContratacion: string; // Describa contratación
  documentacionExigida: string; // Documentación exigida
  examenesSolicitados: string; // Exámenes solicitados
  conformeAnalisis: string; // Conforme análisis
  periodicidad: string; // Periodicidad
  confidencialidad: string; // Confidencialidad
  contratacionPersonal: string; // Contratación personal
  describaProcedimientoPersonal: string; // Describa procedimiento personal
  seguimientoProcedimiento: string; // Seguimiento procedimiento
  identificaciones: string; // Identificaciones
  sistemasInformaticos: string; // Sistemas informáticos
  proveedoresServicios: string; // Proveedores servicios
  administracionPersonal: string; // Administración personal
  expliqueBrevemente: string; // Explique brevemente
  encuentranFuera: string; // Encuentran fuera
  actualizacionesSeguridad: string; // Actualizaciones seguridad
  accesoLosMismos: string; // Acceso los mismos
  continuidadNegocio: string; // Continuidad negocio
  semanaCorresponda: string; // Semana corresponda
  recuperarInformacion: string; // Recuperar información
  informacionArchivada: string; // Información archivada
  procesoDatos: string; // Proceso datos
  copiasSeguridad: string; // Copias seguridad
  proteccionDeLaInformacion: string; // Protección de la información
  perdidaDeLaInformacion: string; // Pérdida de la información
  controlanSistemas: string; // Controlan sistemas
  accionesDelResto: string; // Acciones del resto
  sistemasConfidenciales: string; // Sistemas confidenciales
  proporcionaEsasContrasenas: string; // Proporciona esas contraseñas
  actualizacionesPeriodicas: string; // Actualizaciones periódicas
  falsificadosLicencias: string; // Falsificados licencias
  procesoDeImportacion: string; // Proceso de importación
  telecomunicaciones: string; // Telecomunicaciones
  sistemaComprometido: string; // Sistema comprometido
  seguridadDeLaTecnologia: string; // Seguridad de la tecnología
  mediosTransporte: string; // Medios transporte
  estaDifusion: string; // Está difusión
  enunciativaLimitativa: string; // Enunciativa limitativa
  procedimientosEmpresa: string; // Procedimientos empresa
  mediosDeTransporte: string; // Medios de transporte
  relacionadosSeguridad: string; // Relacionados seguridad
  reportarIncidentes: string; // Reportar incidentes
  actividadesSospechosas: string; // Actividades sospechosas
  brevementeSonsiste: string; // Brevemente consiste
  incidenteSeguridad: string; // Incidente seguridad
  caboInvestigacion: string; // Cabo investigación
  operacionCaboInvestigacion: string; // Operación cabo investigación
  domicilioDeLaInstalacion: string; // Domicilio de la instalación
  antiguedad: number | string; // Antigüedad
  productos: number | string; // Productos
  embarquesExp: number | string; // Embarques exp
  embarquesImp: number | string; // Embarques imp
  empleados: number | string; // Empleados
  superficie: number | string; // Superficie
  blCtpat: string; // BL CT-PAT
  niverCertificado?: string; // Nivel certificado (opcional)
  ctpatAccountNumber?: string; // CT-PAT account number (opcional)
  codigoMid?: string; // Código MID (opcional)
  fecUltimaCtapt?: Date | string; // Fecha última CTAPT (opcional)
  blnPip: string; // BLN PIP
  numRegistroPip?: string; // Número registro PIP (opcional)
  blnOea: string; // BLN OEA
  nomProgramapaisOea?: string; // Nombre programa país OEA (opcional)
  numRegistroOea?: string; // Número registro OEA (opcional)
  blnOtrosProgramasSegu: string; // BLN otros programas seguimiento
  nombreProgramaOtros?: string; // Nombre programa otros (opcional)
  numRegistroOtros?: string; // Número registro otros (opcional)
  fechaVigenciaOtros?: Date | string; // Fecha vigencia otros (opcional)
  nombre: string; // Nombre
  categoria: string; // Categoría
  vigencia: string; // Vigencia
  nombre2: string; // Nombre 2
  categoria2: string; // Categoría 2
  vigencia2: string; // Vigencia 2
  nombre3: string; // Nombre 3
  categoria3: string; // Categoría 3
  vigencia3: string; // Vigencia 3
  procedimientoDocumentado: string; // Procedimiento documentado
  indiqueNumero: string; // Indique número
  cargosFunciones: string; // Cargos funciones
  casoContratarse: string; // Caso contratarse
  casoContar: string; // Caso contar
  describirProcedimiento: string; // Describir procedimiento
  indiqueMecanismos: string; // Indique mecanismos
  indicarEmpleados: string; // Indicar empleados
  indiqueIdentifica: string; // Indique identifica
  describaEmpresa: string; // Describa empresa
  indiqueAsegura: string; // Indique asegura
  procedimientoParaControl: string; // Procedimiento para control
  senaleRegistros: string; // Señale registros
  senaleQuien: string; // Señale quién
  describaRecepion: string; // Describa recepción
  indiqueEncargado: string; // Indique encargado
  indiqueIdentfica: string; // Indique identifica
  senaleComo: string; // Señale cómo
  describaCaracteristicas: string; // Describa características
  senaleAccion: string; // Señale acción
  indiqueLleva: string; // Indique lleva
  describaProcedimientoDos: string; // Describa procedimiento dos
  indiqueSocios: string; // Indique socios
  indiqueForma: string; // Indique forma
  indiqueExisten: string; // Indique existen
  indiqueCuenta: string; // Indique cuenta
  procedimientoRealizar: string; // Procedimiento realizar
  indiquePeriodicidad: string; // Indique periodicidad
  describaComo: string; // Describa cómo
  comoAseguran: string; // Cómo aseguran
  indiqueFormatos: string; // Indique formatos
  senalarMedidas: string; // Señalar medidas
  indiqueAlmacenes: string; // Indique almacenes
  expliqueBrevemente2: string; // Explique brevemente 2
  indiqueCerciora: string; // Indique cerciora
  indiqueEstos: string; // Indique estos
  indiquePertenecen: string; // Indique pertenecen
  indiqueResponsable: string; // Indique responsable
  indiqueTecnologia: string; // Indique tecnología
  describirProcesamiento: string; // Describir procesamiento
  detalleComo: string; // Detalle cómo
  indiqueUtiliza: string; // Indique utiliza
  detalleValida: string; // Detalle valida
  comoNumero: string; // Cómo número
  senaleAsociados: string; // Señale asociados
  indiqueMateriales: string; // Indique materiales
  queForma: string; // Qué forma
  personalResponsable: string; // Personal responsable
  indiqueCuantas: string; // Indique cuántas
  indiqueMonitoreadas: string; // Indique monitoreadas
  detalleExisten: string; // Detalle existen
  describaAcceso: string; // Describa acceso
  describirTipo: string; // Describir tipo
  describaAreas: string; // Describa áreas
  senaleMismas: string; // Señale mismas
  casoNoContar: string; // Caso no contar
  periodicidadVerifica: string; // Periodicidad verifica
  indiqueTareas: string; // Indique tareas
  describaManera: string; // Describa manera
  indiqueSepara: string; // Indique separa
  senaleRestringido: string; // Señale restringido
  describaMonitoreo: string; // Describa monitoreo
  responsablesControlar: string; // Responsables controlar
  estacionamientos: string; // Estacionamientos
  llevaEntrada: string; // Lleva entrada
  politicasMecanismos: string; // Políticas mecanismos
  procedimientoOperacion: string; // Procedimiento operación
  senaleEncuentran: string; // Señale encuentran
  mencioneCuenta: string; // Mencione cuenta
  queManera: string; // Qué manera
  describaContactar: string; // Describa contactar
  indiqueOperativo: string; // Indique operativo
  indiqueAparatos: string; // Indique aparatos
  mantenimiento: string; // Mantenimiento
  politicasAparatos: string; // Políticas aparatos
  programaMantenimiento: string; // Programa mantenimiento
  indiqueRespaldo: string; // Indique respaldo
  describaAlarma: string; // Describa alarma
  indiqueUtilizan: string; // Indique utilizan
  describaSistemas: string; // Describa sistemas
  indicarCamaras: string; // Indicar cámaras
  mencioneInspeccion: string; // Mencione inspección
  senalarUbicacion: string; // Señalar ubicación
  indiqueHorarios: string; // Indique horarios
  indiqueRevisan: string; // Indique revisan
  indiqueDesignado: string; // Indique designado
  comoDocumentan: string; // Cómo documentan
  indiqueTiempo: string; // Indique tiempo
  contarPlanta: string; // Contar planta
  estosSistemas: string; // Estos sistemas
  indicarCircuito: string; // Indicar circuito
  describaImplementado: string; // Describa implementado
  formaControlan: string; // Forma controlan
  indiqueTodas: string; // Indique todas
  indiquePlanta: string; // Indique planta
  cuentaDocumentado: string; // Cuenta documentado
  indiquePuertas: string; // Indique puertas
  indiqueCerrado: string; // Indique cerrado
  indicarCircuitoCerrado: string; // Indicar circuito cerrado
  registroVisitantes: string; // Registro visitantes
  casoSocios: string; // Caso socios
  estosEmpresa: string; // Estos empresa
  comiteSeguridad: string; // Comité seguridad
  fuentesInformacion: string; // Fuentes información
  politica: string; // Política
  indique: string; // Indique
  periodicidad2: string; // Periodicidad 2
  programa: string; // Programa
  capacitacion: string; // Capacitación
  procedimiento: string; // Procedimiento
  descripcionProcedimiento: string; // Descripción procedimiento
  nombreProcedimiento: string; // Nombre procedimiento
  programacionAuditoria: string; // Programación auditoría
  participantesAuditoria: string; // Participantes auditoría
  enfoqueAuditoria: string; // Enfoque auditoría
  procesosAuditados: string; // Procesos auditados
  registrosAuditoria: string; // Registros auditoría
  programacion: string; // Programación
  registrosNombre: string; // Registros nombre
  registrosEmpresa: string; // Registros empresa
  planEmergencia: string; // Plan emergencia
  situacionesContempladas: string; // Situaciones contempladas
  mecanismosContinuidad: string; // Mecanismos continuidad
  simulacrosDocumentacion: string; // Simulacros documentación
}


/**
 * @función
 * @nombre createInitialState
 * @descripción
 * Crea y devuelve el estado inicial para el trámite 32617.
 * 
 * @retorna {Tramites32617State} El estado inicial del trámite.
 */
export function createInitialState(): Tramites32617State {
  return {
    representanteRegistro: '', // Representante registro
    representanteRfc: '', // Representante RFC
    representanteNombre: '', // Representante nombre
    representanteApellidoPaterno: '', // Representante apellido paterno
    representanteApellidoMaterno: '', // Representante apellido materno
    representanteTelefono: '', // Representante teléfono
    representanteCorreo: '', // Representante correo
    registro: '', // Registro único del enlace operativo
    rfc: '', // RFC de la empresa
    nombre: '', // Nombre de la empresa
    apellidoPaterno: '', // Apellido paterno
    apellidoMaterno: '', // Apellido materno
    ciudad: '', // Ciudad
    cargo: '', // Cargo
    telefono: '', // Teléfono
    correo: '', // Correo
    suplente: false, // Indica si es suplente
    enlaceOperativoData: [], // Datos del enlace operativo
    sectorProductivo: '', // Sector productivo
    sectorServicio: '', // Sector servicio
    cumplimientoFiscalAduanero: '', // Cumplimiento fiscal aduanero
    autorizaOpinionSAT: '', // Autoriza opinión SAT
    cuentaConEmpleadosPropios: '', // Cuenta con empleados propios
    bimestreUltimo: '', // Bimestre último
    numeroDeEmpleadas: '', // Número de empleadas
    retencionISRTrabajadores: '', // Retención ISR trabajadores
    pagoCuotasIMSS: '', // Pago cuotas IMSS
    cuentaConSubcontratacionEspecializada: '', // Cuenta con subcontratación especializada
    registroPadronLFT: '', // Registro padrón LFT
    listadoSATArt69: '', // Listado SAT Art 69
    listadoSATArt69B: '', // Listado SAT Art 69 B
    listadoSATArt69BBis: '', // Listado SAT Art 69 B Bis
    certificadosSellosVigentes: '', // Certificados sellos vigentes
    infringioSupuestos17HBis: '', // Infringió supuestos 17 H Bis
    mediosContactoActualizadosBuzon: '', // Medios contacto actualizados buzón
    suspensionPadronImportadoresExportadores: '', // Suspensión padrón importadores/exportadores
    registros: '1',
    archivoNacionales: '', // Archivo nacionales
    proveedores: '', // Proveedores
    domiciliosRegistrados: '', // Domicilios registrados
    numeroEmpleadosBimestre: [], // Número empleados bimestre
    DomiciliosRfcSolicitante: [], // Domicilios RFC solicitante
    controlInventarios: [], // Control inventarios
    querellaSATUltimos3Anios: '', // Querella SAT últimos 3 años
    ingresoInfoContableSAT: '', // Ingreso info contable SAT
    agregarMiembroEmpresa: [], // Agregar miembro empresa
    manifests: true, // Manifests
    bajoProtesta: true, // Bajo protesta
    sistemaControlInventariosArt59: '', // Sistema control inventarios Art 59
    comercioExteriorRealizado: '', // Indica si la empresa realiza operaciones de comercio exterior ('1' para Sí,'0' para No)
    fechaDePago: '', // Fecha de pago asociado a la solicitud (DD/MM/YYYY)
    fechaInicioComercio: '', // Fecha inicio operaciones comercio exterior (DD/MM/YYYY)
    esParteGrupoComercioExterior: '', // Indica si es parte de grupo comercio exterior ('1' para Sí,'0' para No)
    rfcEnclaveOperativo: '', // RFC o clave operativa de la empresa del enlace operativo
    enlaceOperativorfc: '', // RFC del enlace operativo (solo lectura)
    denominacionRazonsocial: '', // Denominación social o razón social del enlace operativo
    domicilio: '', // Domicilio fiscal completo del enlace operativo
    inputfechaDeLaUltimaOperacion: '', // Fecha última operación comercial (DD/MM/YYYY)
    fusionEscisionConOperacionExterior: '', // Fusión o escisión con operaciones comercio exterior ('1' para Sí,'0' para No)
    empresaExtranjeraIMMEX: '', // Empresa extranjera IMMEX ('1' para Sí,'0' para No)
    modalidadIVAAeIEPSFecha: '21/06/2025', // Fecha de modalidad IVA e IEPS (DD/MM/YYYY)
    modalidadIVAAeIEPSValor: 'AAA', // Valor de modalidad IVA e IEPS
    numeroDeAutorizacion: '2500301600320259910000060-000054', // Número de autorización
    monto: '', // Monto total en pesos mexicanos
    operacionesBancarias: '', // Detalles operaciones bancarias
    llavePago: '', // Llave de pago única
    registroEsquemaCertificacion: '', // Registro esquema certificación ('1' para Sí,'0' para No)
    tipoInformacionEmpresa: '', // Tipo información empresa ('1' para Pública,'0' para Privada)
    programaIMMEX: '', // Programa IMMEX ('1' para Sí,'0' para No)
    modalidadIVAAeIEPS: '', // Modalidad IVA e IEPS ('1' para Sí,'0' para No)
    documentaciónDeComercioExterior: '', // Documentación de comercio exterior ('1' para Sí,'0' para No)
    utilizandoSuPropioTransporte: '', // Utilizando su propio transporte ('1' para Sí,'0' para No)
    serviciosTercerosConCertificacion: '', // Servicios terceros con certificación ('1' para Sí,'0' para No)
    ccat: '', // Número registro CAAT vigente transportista
    tablaDatos: [], // Lista empresas grupo comercial relacionadas
    tablaDatosTC: [], // Lista terceros contratados relacionados
    transportistasLista: [], // Lista transportistas autorizados
    autorizacionCBP: '', // Autorización CBP
    instalacionesCertificadasCBP: '', // Instalaciones certificadas CBP
    suspensionCancelacionCBP: '', // Suspensión o cancelación CBP
    rfcTerceroContratado: '', // RFC del tercero contratado
    rfcTC: '', // RFC del tercero contratado (solo lectura)
    nombreDenominacionTC: '', // Nombre o denominación del tercero contratado
    ctpatCertificadoTC: '', // Certificado CTPAT del tercero contratado
    registroEsquemaCertificacionTC: '', // Registro esquema certificación del tercero contratado
    registroSocioComercialCertificadoTC: '', // Registro socio comercial certificado del tercero contratado
    perfiles: {
      // Perfiles de datos, con propiedades opcionales
      describaProcedimiento: '', // Describa el procedimiento de seguridad
      indiqueLosCriterios: '', // Indique los criterios de seguridad
      indiqueLosMetodos: '', // Indique los métodos de seguridad
      describaLosIndicadores: '', // Describa los indicadores de seguridad
      comercioExterior: '', // Comercio exterior
      candadosSeguridad: '', // Candados de seguridad
      proveedorExterno: '', // Proveedor externo
      susceptibleContaminacion: '', // Susceptible a contaminación
      encuentrenVacios: '', // Encuentren vacíos
      semirremolquesVacios: '', // Semirremolques vacíos
      utilizarCandado: '', // Utilizar candado
      seguridadMismas: '', // Seguridad mismas
      describaContratacion: '', // Describa contratación
      documentacionExigida: '', // Documentación exigida
      examenesSolicitados: '', // Exámenes solicitados
      conformeAnalisis: '', // Conforme análisis
      periodicidad: '', // Periodicidad
      confidencialidad: '', // Confidencialidad
      contratacionPersonal: '', // Contratación personal
      describaProcedimientoPersonal: '', // Describa procedimiento personal
      seguimientoProcedimiento: '', // Seguimiento procedimiento
      identificaciones: '', // Identificaciones
      sistemasInformaticos: '', // Sistemas informáticos
      proveedoresServicios: '', // Proveedores servicios
      administracionPersonal: '', // Administración personal
      expliqueBrevemente: '', // Explique brevemente
      encuentranFuera: '', // Encuentran fuera
      actualizacionesSeguridad: '', // Actualizaciones seguridad
      accesoLosMismos: '', // Acceso los mismos
      continuidadNegocio: '', // Continuidad negocio
      semanaCorresponda: '', // Semana corresponda
      recuperarInformacion: '', // Recuperar información
      informacionArchivada: '', // Información archivada
      procesoDatos: '', // Proceso datos
      copiasSeguridad: '', // Copias seguridad
      proteccionDeLaInformacion: '', // Protección de la información
      perdidaDeLaInformacion: '', // Pérdida de la información
      controlanSistemas: '', // Controlan sistemas
      accionesDelResto: '', // Acciones del resto
      sistemasConfidenciales: '', // Sistemas confidenciales
      proporcionaEsasContrasenas: '', // Proporciona esas contraseñas
      actualizacionesPeriodicas: '', // Actualizaciones periódicas
      falsificadosLicencias: '', // Falsificados licencias
      procesoDeImportacion: '', // Proceso de importación
      telecomunicaciones: '', // Telecomunicaciones
      sistemaComprometido: '', // Sistema comprometido
      seguridadDeLaTecnologia: '', // Seguridad de la tecnología
      mediosTransporte: '', // Medios transporte
      estaDifusion: '', // Está difusión
      enunciativaLimitativa: '', // Enunciativa limitativa
      procedimientosEmpresa: '', // Procedimientos empresa
      mediosDeTransporte: '', // Medios de transporte
      relacionadosSeguridad: '', // Relacionados seguridad
      reportarIncidentes: '', // Reportar incidentes
      actividadesSospechosas: '', // Actividades sospechosas
      brevementeSonsiste: '', // Brevemente consiste
      incidenteSeguridad: '', // Incidente seguridad
      caboInvestigacion: '', // Cabo investigación
      operacionCaboInvestigacion: '', // Operación cabo investigación
      antiguedad: '', // Antigüedad
      domicilioDeLaInstalacion: '', // Domicilio de la instalación
      productos: '', // Productos
      embarquesExp: '', // Embarques exp
      embarquesImp: '', // Embarques imp
      empleados: '', // Empleados
      superficie: '', // Superficie
      blCtpat: '', // BL CT-PAT
      niverCertificado: '', // Nivel certificado
      ctpatAccountNumber: '', // CTPAT account number
      codigoMid: '', // Código MID
      fecUltimaCtapt: '', // Fecha última CTPAT
      blnPip: '', // BLN PIP
      numRegistroPip: '', // Número registro PIP
      blnOea: '', // BLN OEA
      nomProgramapaisOea: '', // Nombre programa país OEA
      numRegistroOea: '', // Número registro OEA
      blnOtrosProgramasSegu: '', // BLN otros programas seguimiento
      nombreProgramaOtros: '', // Nombre programa otros
      numRegistroOtros: '', // Número registro otros
      fechaVigenciaOtros: '', // Fecha vigencia otros
      nombre: '', // Nombre
      categoria: '', // Categoría
      vigencia: '', // Vigencia
      nombre2: '', // Nombre 2
      categoria2: '', // Categoría 2
      vigencia2: '', // Vigencia 2
      nombre3: '', // Nombre 3
      categoria3: '', // Categoría 3
      vigencia3: '', // Vigencia 3
      procedimientoDocumentado: '', // Procedimiento documentado
      indiqueNumero: '', // Indique número
      cargosFunciones: '', // Cargos y funciones
      casoContratarse: '', // Caso contratarse
      casoContar: '', // Caso contar
      describirProcedimiento: '', // Describir procedimiento
      indiqueMecanismos: '', // Indique mecanismos
      indicarEmpleados: '', // Indicar empleados
      indiqueIdentifica: '', // Indique identifica
      describaEmpresa: '', // Describa empresa
      indiqueAsegura: '', // Indique asegura
      procedimientoParaControl: '', // Procedimiento para control
      senaleRegistros: '', // Señale registros
      senaleQuien: '', // Señale quién
      describaRecepion: '', // Describa recepción
      indiqueEncargado: '', // Indique encargado
      indiqueIdentfica: '', // Indique identifica
      senaleComo: '', // Señale cómo
      describaCaracteristicas: '', // Describa características
      senaleAccion: '', // Señale acción
      indiqueLleva: '', // Indique lleva
      describaProcedimientoDos: '', // Describa procedimiento dos
      indiqueSocios: '', // Indique socios
      indiqueForma: '', // Indique forma
      indiqueExisten: '', // Indique existen
      indiqueCuenta: '', // Indique cuenta
      procedimientoRealizar: '', // Procedimiento realizar
      indiquePeriodicidad: '', // Indique periodicidad
      describaComo: '', // Describa cómo
      comoAseguran: '', // Cómo aseguran
      indiqueFormatos: '', // Indique formatos
      senalarMedidas: '', // Señalar medidas
      indiqueAlmacenes: '', // Indique almacenes
      expliqueBrevemente2: '', // Explique brevemente 2
      indiqueCerciora: '', // Indique cerciorar
      indiqueEstos: '', // Indique estos
      indiquePertenecen: '', // Indique pertenecen
      indiqueResponsable: '', // Indique responsable
      indiqueTecnologia: '', // Indique tecnología
      describirProcesamiento: '', // Describir procesamiento
      detalleComo: '', // Detalle cómo
      indiqueUtiliza: '', // Indique utiliza
      detalleValida: '', // Detalle valida
      comoNumero: '', // Cómo número
      senaleAsociados: '', // Señale asociados
      indiqueMateriales: '', // Indique materiales
      queForma: '', // Qué forma
      personalResponsable: '', // Personal responsable
      indiqueCuantas: '', // Indique cuántas
      indiqueMonitoreadas: '', // Indique monitoreadas
      detalleExisten: '', // Detalle existen
      describaAcceso: '', // Describa acceso
      describirTipo: '', // Describir tipo
      describaAreas: '', // Describa áreas
      senaleMismas: '', // Señale mismas
      casoNoContar: '', // Caso no contar
      periodicidadVerifica: '', // Periodicidad verifica
      indiqueTareas: '', // Indique tareas
      describaManera: '', // Describa manera
      indiqueSepara: '', // Indique separa
      senaleRestringido: '', // Señale restringido
      describaMonitoreo: '', // Describa monitoreo
      responsablesControlar: '', // Responsables controlar
      estacionamientos: '', // Estacionamientos
      llevaEntrada: '', // Lleva entrada
      politicasMecanismos: '', // Políticas mecanismos
      procedimientoOperacion: '', // Procedimiento operación
      senaleEncuentran: '', // Señale encuentran
      mencioneCuenta: '', // Mencione cuenta
      queManera: '', // Qué manera
      describaContactar: '', // Describa contactar
      indiqueOperativo: '', // Indique operativo
      indiqueAparatos: '', // Indique aparatos
      mantenimiento: '', // Mantenimiento
      politicasAparatos: '', // Políticas aparatos
      programaMantenimiento: '', // Programa mantenimiento
      indiqueRespaldo: '', // Indique respaldo
      describaAlarma: '', // Describa alarma
      indiqueUtilizan: '', // Indique utilizan
      describaSistemas: '', // Describa sistemas
      indicarCamaras: '', // Indicar cámaras
      mencioneInspeccion: '', // Mencione inspección
      senalarUbicacion: '', // Señalar ubicación
      indiqueHorarios: '', // Indique horarios
      indiqueRevisan: '', // Indique revisan
      indiqueDesignado: '', // Indique designado
      comoDocumentan: '', // Cómo documentan
      indiqueTiempo: '', // Indique tiempo
      contarPlanta: '', // Contar planta
      estosSistemas: '', // Estos sistemas
      indicarCircuito: '', // Indicar circuito
      describaImplementado: '', // Describa implementado
      formaControlan: '', // Forma controlan
      indiqueTodas: '', // Indique todas
      indiquePlanta: '', // Indique planta
      cuentaDocumentado: '', // Cuenta documentado
      indiquePuertas: '', // Indique puertas
      indiqueCerrado: '', // Indique cerrado
      indicarCircuitoCerrado: '', // Indicar circuito cerrado
      registroVisitantes: '', // Registro visitantes
      casoSocios: '', // Caso socios
      estosEmpresa: '', // Estos empresa
      comiteSeguridad: '', // Comité seguridad
      fuentesInformacion: '', // Fuentes información
      politica: '', // Política
      indique: '', // Indique
      periodicidad2: '', // Periodicidad 2
      programa: '', // Programa
      capacitacion: '', // Capacitación
      procedimiento: '', // Procedimiento
      descripcionProcedimiento: '', // Descripción procedimiento
      nombreProcedimiento: '', // Nombre procedimiento
      programacionAuditoria: '', // Programación auditoría
      participantesAuditoria: '', // Participantes auditoría
      enfoqueAuditoria: '', // Enfoque auditoría
      procesosAuditados: '', // Procesos auditados
      registrosAuditoria: '', // Registros auditoría
      programacion: '', // Programación
      registrosNombre: '', // Registros nombre
      registrosEmpresa: '', // Registros empresa
      planEmergencia: '', // Plan emergencia
      situacionesContempladas: '', // Situaciones contempladas
      mecanismosContinuidad: '', // Mecanismos continuidad
      simulacrosDocumentacion: '', // Simulacros documentación
    },
};
}

/**
 * @clase
 * @nombre Tramite32617Store
 * @descripción
 * Clase que extiende de `Store` de Akita para gestionar el estado del trámite 32617.
 * Proporciona métodos para actualizar diferentes partes del estado, como datos de vehículos, agentes y registros.
 * 
 * @decorador @Injectable
 * @decorador @StoreConfig
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramites32617', resettable: true })
export class Tramite32617Store extends Store<Tramites32617State> {
   
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
   * 
   * @param {Partial<Tramites32617State>} values - Valores parciales para actualizar el estado.
   */
  public establecerDatos(valores: Partial<Tramites32617State>): void {    
    this.update((state) => {
      const { perfiles: PERFILES, ...OTHER_VALUES } = valores;
      return {
        ...state,
        ...OTHER_VALUES,
        ...(PERFILES && {
          perfiles: {
            ...state.perfiles,
            ...PERFILES,
          },
        }),
      };
    });
  }
}