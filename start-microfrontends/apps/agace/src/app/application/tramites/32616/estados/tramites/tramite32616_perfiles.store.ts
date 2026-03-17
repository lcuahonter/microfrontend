import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa el estado de la solicitud para perfiles del formulario 32616.
 */
export interface Solicitud32616PerfilesState {

  /** ¿Existe un procedimiento documentado? */
  procedimientoDocumentado: string;

  /** Indique el número del procedimiento. */
  indiqueNumero: string;

  /** Describa los cargos y funciones relacionados. */
  cargosFunciones: string;

  /** ¿En qué caso se contrata personal externo? */
  casoContratarse: string;

  /** ¿En qué caso se cuenta con personal propio? */
  casoContar: string;

  /** Describa el procedimiento que se sigue. */
  describirProcedimiento: string;

  /** Indique los mecanismos utilizados. */
  indiqueMecanismos: string;

  /** Indique cuántos empleados están involucrados. */
  indicarEmpleados: string;

  /** Indique cómo se identifica al responsable. */
  indiqueIdentifica: string;

  /** Describa la empresa o entidad responsable. */
  describaEmpresa: string;

  /** Indique cómo se asegura el cumplimiento. */
  indiqueAsegura: string;

  /** Procedimiento establecido para el control. */
  procedimientoParaControl: string;

  /** Señale los registros que se utilizan. */
  senaleRegistros: string;

  /** Señale quién realiza cada acción. */
  senaleQuien: string;

  /** Describa la recepción del servicio o producto. */
  describaRecepion: string;

  /** Indique quién es el encargado. */
  indiqueEncargado: string;

  /** Indique cómo se identifica al encargado. */
  indiqueIdentfica: string;

  /** Señale cómo se realiza el proceso. */
  senaleComo: string;

  /** Describa las características del procedimiento. */
  describaCaracteristicas: string;

  /** Señale qué acción se toma en cada caso. */
  senaleAccion: string;

  /** Indique quién lleva a cabo el procedimiento. */
  indiqueLleva: string;

  /** Describa el procedimiento en detalle. */
  describaProcedimiento: string;

  /** Indique si hay socios involucrados. */
  indiqueSocios: string;

  /** Indique la forma en que se realiza. */
  indiqueForma: string;

  /** Indique si existen procedimientos similares. */
  indiqueExisten: string;

  /** Indique si se cuenta con recursos para ello. */
  indiqueCuenta: string;

  /** Procedimiento que se debe realizar. */
  procedimientoRealizar: string;

  /** Indique la periodicidad del procedimiento o actividad. */
  indiquePeriodicidad: string;

  /** Describa cómo se lleva a cabo el procedimiento. */
  describaComo: string;

  /** Explique cómo se asegura el cumplimiento del procedimiento. */
  comoAseguran: string;

  /** Indique los formatos utilizados. */
  indiqueFormatos: string;

  /** Señale las medidas implementadas. */
  senalarMedidas: string;

  /** Indique los almacenes o lugares de resguardo involucrados. */
  indiqueAlmacenes: string;

  /** Explique brevemente el proceso o actividad. */
  expliqueBrevemente: string;

  /** Indique cómo se cerciora del cumplimiento. */
  indiqueCerciora: string;

  /** Indique estos elementos o aspectos relevantes. */
  indiqueEstos: string;

  /** Indique a quién pertenecen los recursos o procesos. */
  indiquePertenecen: string;

  /** Indique el responsable del procedimiento o tarea. */
  indiqueResponsable: string;

  /** Indique la tecnología utilizada. */
  indiqueTecnologia: string;

  /** Describa cómo se lleva a cabo el procesamiento. */
  describirProcesamiento: string;

  /** Detalle cómo se ejecuta o implementa el proceso. */
  detalleComo: string;

  /** Indique qué herramienta o sistema se utiliza. */
  indiqueUtiliza: string;

  /** Detalle cómo se valida el procedimiento. */
  detalleValida: string;

  /** Indique el número correspondiente o asociado. */
  comoNumero: string;

  /** Señale los procesos o elementos asociados. */
  senaleAsociados: string;

  /** Indique los materiales involucrados. */
  indiqueMateriales: string;

  /** ¿De qué forma se realiza la actividad? */
  queForma: string;

  /** Personal responsable de la tarea o procedimiento. */
  personalResponsable: string;

  /** Indique cuántas instancias o unidades están involucradas. */
  indiqueCuantas: string;

  /** Indique si las actividades son monitoreadas. */
  indiqueMonitoreadas: string;

  /** Detalle si existen condiciones o elementos adicionales. */
  detalleExisten: string;

  /** Describa el acceso permitido o disponible. */
  describaAcceso: string;

  /** Describa el tipo de proceso, documento o recurso. */
  describirTipo: string;

  /** Describa las áreas involucradas. */
  describaAreas: string;

  /** Señale si son las mismas condiciones o elementos. */
  senaleMismas: string;

  /** En caso de no contar con el procedimiento, indique la razón. */
  casoNoContar: string;

  /** Indique la periodicidad con la que se verifica el procedimiento. */
  periodicidadVerifica: string;

  /** Indique las tareas específicas asignadas. */
  indiqueTareas: string;

  /** Describa de qué manera se realiza el procedimiento. */
  describaManera: string;

  /** Indique cómo se separan los elementos o actividades. */
  indiqueSepara: string;

  /** Señale si hay acceso restringido. */
  senaleRestringido: string;

  /** Describa cómo se realiza el monitoreo. */
  describaMonitoreo: string;

  /** Indique los responsables de controlar el procedimiento. */
  responsablesControlar: string;

  /** Describa el uso o disponibilidad de estacionamientos. */
  estacionamientos: string;

  /** Indique si se lleva registro de entrada. */
  llevaEntrada: string;

  /** Políticas y mecanismos implementados. */
  politicasMecanismos: string;

  /** Procedimiento relacionado con la operación. */
  procedimientoOperacion: string;

  /** Señale dónde se encuentran los elementos o recursos. */
  senaleEncuentran: string;

  /** Mencione si se cuenta con los recursos necesarios. */
  mencioneCuenta: string;

  /** ¿De qué manera se lleva a cabo el proceso? */
  queManera: string;

  /** Describa cómo contactar a los responsables o personal. */
  describaContactar: string;

  /** Indique si hay personal operativo asignado. */
  indiqueOperativo: string;

  /** Indique qué aparatos o equipos se utilizan. */
  indiqueAparatos: string;

  /** Describa las acciones de mantenimiento realizadas. */
  mantenimiento: string;

  /** Políticas relacionadas con el uso de aparatos. */
  politicasAparatos: string;

  /** Programa de mantenimiento establecido. */
  programaMantenimiento: string;

  /** Indique si se cuenta con respaldo de información o procesos. */
  indiqueRespaldo: string;

  /** Describa el sistema de alarma utilizado. */
  describaAlarma: string;

  /** Indique qué sistemas se utilizan actualmente. */
  indiqueUtilizan: string;

  /** Describa los sistemas implementados. */
  describaSistemas: string;

  /** Indique si se utilizan cámaras de seguridad. */
  indicarCamaras: string;

  /** Mencione si se realiza inspección regularmente. */
  mencioneInspeccion: string;

  /** Señale la ubicación de los dispositivos o recursos. */
  senalarUbicacion: string;

  /** Indique los horarios establecidos. */
  indiqueHorarios: string;

  /** Indique quién revisa el procedimiento o elemento. */
  indiqueRevisan: string;

  /** Indique la persona designada para la tarea. */
  indiqueDesignado: string;

  /** Describa cómo se documenta el procedimiento. */
  comoDocumentan: string;

  /** Indique el tiempo que toma realizar la actividad. */
  indiqueTiempo: string;

  /** Indique si se cuenta con personal en planta. */
  contarPlanta: string;

  /** Señale si estos sistemas están implementados. */
  estosSistemas: string;

  /** Indique si se utiliza circuito cerrado de vigilancia. */
  indicarCircuito: string;

  /** Describa cómo se ha implementado el sistema o procedimiento. */
  describaImplementado: string;

  /** Indique de qué forma se controlan los procesos o accesos. */
  formaControlan: string;

  /** Indique si se incluyen todas las áreas o elementos. */
  indiqueTodas: string;

  /** Indique si se cuenta con planta física. */
  indiquePlanta: string;

  /** Señale si el procedimiento está documentado. */
  cuentaDocumentado: string;

  /** Indique cuántas puertas hay y su tipo. */
  indiquePuertas: string;

  /** Indique si se mantienen cerradas las puertas. */
  indiqueCerrado: string;

  /** Indique si se utiliza un sistema de circuito cerrado. */
  indicarCircuitoCerrado: string;

  /** Registro de visitantes a la instalación. */
  registroVisitantes: string;

  /** En caso de tener socios, especifique la situación. */
  casoSocios: string;

  /** Indique si estos elementos pertenecen a la empresa. */
  estosEmpresa: string;

  /** Indique si se cuenta con un comité de seguridad. */
  comiteSeguridad: string;

  /** Fuentes de información utilizadas. */
  fuentesInformacion: string;

  /** Políticas generales relacionadas con el procedimiento. */
  politica: string;

  /** Información adicional o específica que se debe indicar. */
  indique: string;

  /** Periodicidad con la que se realiza el procedimiento. */
  periodicidad: string;

  /** Programa relacionado con la actividad o control. */
  programa: string;

  /** Proceso de capacitación establecido. */
  capacitacion: string;

  /** Procedimiento que se debe seguir. */
  procedimiento: string;

  /** Descripción detallada del procedimiento. */
  descripcionProcedimiento: string;

  /** Nombre asignado al procedimiento. */
  nombreProcedimiento: string;

  /** Programación de auditorías internas o externas. */
  programacionAuditoria: string;

  /** Participantes involucrados en la auditoría. */
  participantesAuditoria: string;

  /** Enfoque o tipo de auditoría aplicada. */
  enfoqueAuditoria: string;

  /** Procesos que serán auditados. */
  procesosAuditados: string;

  /** Registros generados a partir de la auditoría. */
  registrosAuditoria: string;

  /** Programación general de actividades. */
  programacion: string;

  /** Nombres de los registros utilizados. */
  registrosNombre: string;

  /** Empresa responsable de los registros. */
  registrosEmpresa: string;

  /** Plan de emergencia implementado. */
  planEmergencia: string;

  /** Situaciones contempladas en el plan de emergencia. */
  situacionesContempladas: string;

  /** Mecanismos de continuidad operativa. */
  mecanismosContinuidad: string;

  /** Documentación de simulacros realizados. */
  simulacrosDocumentacion: string;
}

/**
 * Crea el estado inicial del formulario `Solicitud32616PerfilesState`.
 * Todos los campos se inicializan como cadenas vacías.
 *
 * @returns El estado inicial con todos los campos del formulario vacíos.
 */
export function createInitialState(): Solicitud32616PerfilesState {
  return {

    /** Indique si el procedimiento está documentado. */
    procedimientoDocumentado: '',

    /** Indique el número correspondiente. */
    indiqueNumero: '',

    /** Detalle los cargos y funciones involucrados. */
    cargosFunciones: '',

    /** En caso de contratarse, detalle el procedimiento. */
    casoContratarse: '',

    /** En caso de contar con un procedimiento, especifique. */
    casoContar: '',

    /** Describa el procedimiento general. */
    describirProcedimiento: '',

    /** Indique los mecanismos utilizados. */
    indiqueMecanismos: '',

    /** Indicar los empleados involucrados. */
    indicarEmpleados: '',

    /** Indique cómo se identifica el proceso o elemento. */
    indiqueIdentifica: '',

    /** Describa la empresa relacionada. */
    describaEmpresa: '',

    /** Indique cómo se asegura el cumplimiento. */
    indiqueAsegura: '',

    /** Procedimiento para el control correspondiente. */
    procedimientoParaControl: '',

    /** Señale los registros utilizados. */
    senaleRegistros: '',

    /** Señale quién es responsable. */
    senaleQuien: '',

    /** Describa el procedimiento de recepción. */
    describaRecepion: '',

    /** Indique el encargado del procedimiento. */
    indiqueEncargado: '',

    /** Indique cómo se identifica a los responsables. */
    indiqueIdentfica: '',

    /** Señale cómo se realiza el procedimiento. */
    senaleComo: '',

    /** Describa las características del procedimiento. */
    describaCaracteristicas: '',

    /** Señale la acción tomada. */
    senaleAccion: '',

    /** Indique quién lleva el registro o seguimiento. */
    indiqueLleva: '',

    /** Describa el procedimiento con mayor detalle. */
    describaProcedimiento: '',

    /** Indique si hay socios involucrados. */
    indiqueSocios: '',

    /** Indique la forma de operación. */
    indiqueForma: '',

    /** Indique si existen documentos, sistemas, etc. */
    indiqueExisten: '',

    /** Indique si se cuenta con los elementos necesarios. */
    indiqueCuenta: '',

    /** Procedimiento que se debe realizar. */
    procedimientoRealizar: '',

    /** Indique la periodicidad de la acción o procedimiento. */
    indiquePeriodicidad: '',

    /** Describa cómo se realiza la actividad. */
    describaComo: '',

    /** Explique cómo se aseguran los procesos. */
    comoAseguran: '',

    /** Indique los formatos utilizados. */
    indiqueFormatos: '',

    /** Señale las medidas implementadas. */
    senalarMedidas: '',

    /** Indique los almacenes o sitios de resguardo. */
    indiqueAlmacenes: '',

    /** Explique brevemente el proceso o situación. */
    expliqueBrevemente: '',

    /** Indique cómo se cerciora del cumplimiento del procedimiento. */
    indiqueCerciora: '',

    /** Indique si estos elementos están implementados o en uso. */
    indiqueEstos: '',

    /** Indique si pertenecen a la organización. */
    indiquePertenecen: '',

    /** Indique quién es el responsable de esta actividad. */
    indiqueResponsable: '',

    /** Indique la tecnología utilizada en el proceso. */
    indiqueTecnologia: '',

    /** Describa cómo se realiza el procesamiento de datos o actividades. */
    describirProcesamiento: '',

    /** Detalle cómo se realiza el procedimiento. */
    detalleComo: '',

    /** Indique qué herramientas o recursos se utilizan. */
    indiqueUtiliza: '',

    /** Detalle cómo se valida el procedimiento o sistema. */
    detalleValida: '',

    /** Indique cómo se asigna un número o código identificador. */
    comoNumero: '',

    /** Señale los elementos asociados al procedimiento. */
    senaleAsociados: '',

    /** Indique los materiales involucrados en el proceso. */
    indiqueMateriales: '',

    /** Indique de qué forma se lleva a cabo la actividad. */
    queForma: '',

    /** Personal responsable de la ejecución o control. */
    personalResponsable: '',

    /** Indique cuántas unidades o elementos hay. */
    indiqueCuantas: '',

    /** Indique si las actividades están siendo monitoreadas. */
    indiqueMonitoreadas: '',

    /** Detalle si existen procedimientos adicionales. */
    detalleExisten: '',

    /** Describa cómo se gestiona el acceso. */
    describaAcceso: '',

    /** Describa el tipo de procedimiento o sistema. */
    describirTipo: '',

    /** Describa las áreas involucradas. */
    describaAreas: '',

    /** Señale si las condiciones son las mismas. */
    senaleMismas: '',

    /** En caso de no contar con el procedimiento, indique el motivo. */
    casoNoContar: '',

    /** Periodicidad con la que se verifica el procedimiento. */
    periodicidadVerifica: '',

    /** Indique las tareas asignadas. */
    indiqueTareas: '',

    /** Describa de qué manera se realiza la actividad. */
    describaManera: '',

    /** Indique cómo se separan los elementos o responsabilidades. */
    indiqueSepara: '',

    /** Señale si el acceso es restringido. */
    senaleRestringido: '',

    /** Describa cómo se realiza el monitoreo. */
    describaMonitoreo: '',

    /** Personas responsables del control del proceso. */
    responsablesControlar: '',

    /** Indique la disponibilidad o uso de estacionamientos. */
    estacionamientos: '',

    /** Indique si se lleva un registro de entrada. */
    llevaEntrada: '',

    /** Políticas y mecanismos aplicados en la organización. */
    politicasMecanismos: '',

    /** Procedimiento operativo aplicado en el proceso. */
    procedimientoOperacion: '',

    /** Señale dónde se encuentran los recursos o elementos. */
    senaleEncuentran: '',

    /** Mencione si se cuenta con los recursos, sistemas o procedimientos. */
    mencioneCuenta: '',

    /** Indique de qué manera se realiza la acción o el procedimiento. */
    queManera: '',

    /** Describa cómo se debe contactar al responsable o área. */
    describaContactar: '',

    /** Indique si el procedimiento está operativo o en funcionamiento. */
    indiqueOperativo: '',

    /** Indique qué aparatos o equipos están involucrados. */
    indiqueAparatos: '',

    /** Indique si se realiza mantenimiento regularmente. */
    mantenimiento: '',

    /** Políticas relacionadas con el uso y manejo de los aparatos. */
    politicasAparatos: '',

    /** Programa de mantenimiento establecido para los equipos o procesos. */
    programaMantenimiento: '',

    /** Indique si existe un respaldo de información o recursos. */
    indiqueRespaldo: '',

    /** Describa el sistema o tipo de alarma implementada. */
    describaAlarma: '',

    /** Indique qué sistemas o recursos se utilizan. */
    indiqueUtilizan: '',

    /** Describa los sistemas implementados en el proceso. */
    describaSistemas: '',

    /** Indicar si se cuenta con cámaras de seguridad y su uso. */
    indicarCamaras: '',

    /** Mencione si se realiza una inspección regular. */
    mencioneInspeccion: '',

    /** Señalar la ubicación de los elementos, recursos o instalaciones. */
    senalarUbicacion: '',

    /** Indique los horarios establecidos para la actividad o supervisión. */
    indiqueHorarios: '',

    /** Indique si se revisan los procedimientos o instalaciones. */
    indiqueRevisan: '',

    /** Indique quién ha sido designado para la tarea o proceso. */
    indiqueDesignado: '',

    /** Indique cómo se documentan los procedimientos o registros. */
    comoDocumentan: '',

    /** Indique el tiempo destinado o transcurrido para el procedimiento. */
    indiqueTiempo: '',

    /** Indique si se cuenta con una planta física. */
    contarPlanta: '',

    /** Indique si estos sistemas están activos o disponibles. */
    estosSistemas: '',

    /** Indicar si se utiliza un circuito (por ejemplo, cerrado de TV). */
    indicarCircuito: '',

    /** Describa cómo se ha implementado el procedimiento o sistema. */
    describaImplementado: '',

    /** Indique de qué forma se controlan los recursos o procesos. */
    formaControlan: '',

    /** Indique si se consideran todas las áreas o procesos. */
    indiqueTodas: '',

    /** Indique si la planta forma parte del procedimiento o sistema. */
    indiquePlanta: '',

    /** Indique si se encuentra documentado el proceso. */
    cuentaDocumentado: '',

    /** Indique cuántas puertas están involucradas o controladas. */
    indiquePuertas: '',

    /** Indique si las instalaciones están cerradas o controladas. */
    indiqueCerrado: '',

    /** Indicar si se utiliza un sistema de circuito cerrado de televisión (CCTV). */
    indicarCircuitoCerrado: '',

    /** Registro de visitantes que ingresan a las instalaciones. */
    registroVisitantes: '',

    /** En caso de contar con socios, describa su participación. */
    casoSocios: '',

    /** Indique si estos elementos pertenecen a la empresa. */
    estosEmpresa: '',

    /** Indique si existe un comité de seguridad activo en la organización. */
    comiteSeguridad: '',

    /** Fuentes de información utilizadas para el análisis o verificación. */
    fuentesInformacion: '',

    /** Política relacionada con el procedimiento o control. */
    politica: '',

    /** Indique el valor, dato o información requerida. */
    indique: '',

    /** Periodicidad con la que se realizan las actividades o verificaciones. */
    periodicidad: '',

    /** Programa implementado relacionado con el procedimiento. */
    programa: '',

    /** Descripción de las actividades de capacitación realizadas. */
    capacitacion: '',

    /** Procedimiento documentado que se debe seguir. */
    procedimiento: '',

    /** Descripción del procedimiento que se implementa. */
    descripcionProcedimiento: '',

    /** Nombre del procedimiento implementado. */
    nombreProcedimiento: '',

    /** Programación establecida para las auditorías. */
    programacionAuditoria: '',

    /** Personas que participan en el proceso de auditoría. */
    participantesAuditoria: '',

    /** Enfoque o metodología utilizada para la auditoría. */
    enfoqueAuditoria: '',

    /** Procesos que serán auditados. */
    procesosAuditados: '',

    /** Registros generados como resultado de las auditorías. */
    registrosAuditoria: '',

    /** Programación general de las actividades. */
    programacion: '',

    /** Nombre asignado a los registros generados. */
    registrosNombre: '',

    /** Empresa responsable de generar o conservar los registros. */
    registrosEmpresa: '',

    /** Plan de emergencia en caso de eventos imprevistos. */
    planEmergencia: '',

    /** Situaciones contempladas dentro del plan de emergencia. */
    situacionesContempladas: '',

    /** Mecanismos establecidos para garantizar la continuidad del negocio. */
    mecanismosContinuidad: '',

    /** Documentación de simulacros realizados para evaluar la preparación. */
    simulacrosDocumentacion: '',
  };
}

/**
 * Servicio que gestiona el estado de la solicitud 32616 para los perfiles.
 * Se utiliza para almacenar y gestionar los datos del estado relacionado con los perfiles de la solicitud.
 *
 * @Injectable: Define que este servicio es inyectable en el sistema.
 * @StoreConfig: Configura el almacenamiento del estado para la solicitud 32616.
 * El nombre del estado es `tramite32616Perfiles` y se establece como reseteable.
 */
@Injectable({
  providedIn: 'root', // Proporciona el servicio a nivel de toda la aplicación.
})
@StoreConfig({ name: 'tramite32616Perfiles', resettable: true }) // Configuración del estado en la tienda
export class Tramite32616PerfilesStore extends Store<Solicitud32616PerfilesState> {
  /**
   * Constructor que inicializa el estado del almacén utilizando la función `createInitialState()`.
   * La función `createInitialState()` establece los valores iniciales del estado.
   */
  constructor() {
    super(createInitialState()); // Inicializa el estado con los valores predeterminados.
  }

/**
 * Método para actualizar el valor del campo `procedimientoDocumentado` en el estado.
 * 
 * @param procedimientoDocumentado: El nuevo valor para el campo `procedimientoDocumentado`.
 * Este valor se asigna al estado utilizando la función `update()`, la cual actualiza solo el campo correspondiente.
 */
public setProcedimientoDocumentado(procedimientoDocumentado: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      procedimientoDocumentado, // Se actualiza solo el campo `procedimientoDocumentado`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueNumero` en el estado.
   * 
   * @param indiqueNumero: El nuevo valor para el campo `indiqueNumero`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueNumero(indiqueNumero: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueNumero, // Se actualiza solo el campo `indiqueNumero`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `cargosFunciones` en el estado.
   * 
   * @param cargosFunciones: El nuevo valor para el campo `cargosFunciones`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setCargosFunciones(cargosFunciones: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      cargosFunciones, // Se actualiza solo el campo `cargosFunciones`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `casoContratarse` en el estado.
   * 
   * @param casoContratarse: El nuevo valor para el campo `casoContratarse`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setCasoContratarse(casoContratarse: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      casoContratarse, // Se actualiza solo el campo `casoContratarse`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `casoContar` en el estado.
   * 
   * @param casoContar: El nuevo valor para el campo `casoContar`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setCasoContar(casoContar: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      casoContar, // Se actualiza solo el campo `casoContar`
    }));
  }


/**
 * Método para actualizar el valor del campo `describirProcedimiento` en el estado.
 * 
 * @param describirProcedimiento: El nuevo valor para el campo `describirProcedimiento`.
 * Este valor se asigna al estado utilizando la función `update()`, que actualiza solo el campo correspondiente.
 */
public setDescribirProcedimiento(describirProcedimiento: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      describirProcedimiento, // Se actualiza solo el campo `describirProcedimiento`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueMecanismos` en el estado.
   * 
   * @param indiqueMecanismos: El nuevo valor para el campo `indiqueMecanismos`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueMecanismos(indiqueMecanismos: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueMecanismos, // Se actualiza solo el campo `indiqueMecanismos`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indicarEmpleados` en el estado.
   * 
   * @param indicarEmpleados: El nuevo valor para el campo `indicarEmpleados`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndicarEmpleados(indicarEmpleados: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indicarEmpleados, // Se actualiza solo el campo `indicarEmpleados`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueIdentifica` en el estado.
   * 
   * @param indiqueIdentifica: El nuevo valor para el campo `indiqueIdentifica`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueIdentifica(indiqueIdentifica: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueIdentifica, // Se actualiza solo el campo `indiqueIdentifica`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `describaEmpresa` en el estado.
   * 
   * @param describaEmpresa: El nuevo valor para el campo `describaEmpresa`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDescribaEmpresa(describaEmpresa: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      describaEmpresa, // Se actualiza solo el campo `describaEmpresa`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueAsegura` en el estado.
   * 
   * @param indiqueAsegura: El nuevo valor para el campo `indiqueAsegura`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueAsegura(indiqueAsegura: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueAsegura, // Se actualiza solo el campo `indiqueAsegura`
    }));
  }

  /**
 * Método para actualizar el valor del campo `procedimientoParaControl` en el estado.
 * 
 * @param procedimientoParaControl: El nuevo valor para el campo `procedimientoParaControl`.
 * Este valor se asigna al estado utilizando la función `update()`, que actualiza solo el campo correspondiente.
 */
public setProcedimientoParaControl(procedimientoParaControl: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      procedimientoParaControl, // Se actualiza solo el campo `procedimientoParaControl`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `senaleRegistros` en el estado.
   * 
   * @param senaleRegistros: El nuevo valor para el campo `senaleRegistros`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setSenaleRegistros(senaleRegistros: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      senaleRegistros, // Se actualiza solo el campo `senaleRegistros`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `senaleQuien` en el estado.
   * 
   * @param senaleQuien: El nuevo valor para el campo `senaleQuien`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setSenaleQuien(senaleQuien: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      senaleQuien, // Se actualiza solo el campo `senaleQuien`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `describaRecepion` en el estado.
   * 
   * @param describaRecepion: El nuevo valor para el campo `describaRecepion`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDescribaRecepion(describaRecepion: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      describaRecepion, // Se actualiza solo el campo `describaRecepion`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueEncargado` en el estado.
   * 
   * @param indiqueEncargado: El nuevo valor para el campo `indiqueEncargado`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueEncargado(indiqueEncargado: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueEncargado, // Se actualiza solo el campo `indiqueEncargado`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueIdentfica` en el estado.
   * 
   * @param indiqueIdentfica: El nuevo valor para el campo `indiqueIdentfica`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueIdentfica(indiqueIdentfica: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueIdentfica, // Se actualiza solo el campo `indiqueIdentfica`
    }));
  }

/**
 * Método para actualizar el valor del campo `senaleComo` en el estado.
 * 
 * @param senaleComo: El nuevo valor para el campo `senaleComo`.
 * Este valor se asigna al estado utilizando la función `update()`, que actualiza solo el campo correspondiente.
 */
public setSenaleComo(senaleComo: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      senaleComo, // Se actualiza solo el campo `senaleComo`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `describaCaracteristicas` en el estado.
   * 
   * @param describaCaracteristicas: El nuevo valor para el campo `describaCaracteristicas`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDescribaCaracteristicas(describaCaracteristicas: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      describaCaracteristicas, // Se actualiza solo el campo `describaCaracteristicas`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `senaleAccion` en el estado.
   * 
   * @param senaleAccion: El nuevo valor para el campo `senaleAccion`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setSenaleAccion(senaleAccion: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      senaleAccion, // Se actualiza solo el campo `senaleAccion`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueLleva` en el estado.
   * 
   * @param indiqueLleva: El nuevo valor para el campo `indiqueLleva`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueLleva(indiqueLleva: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueLleva, // Se actualiza solo el campo `indiqueLleva`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `describaProcedimiento` en el estado.
   * 
   * @param describaProcedimiento: El nuevo valor para el campo `describaProcedimiento`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDescribaProcedimiento(describaProcedimiento: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      describaProcedimiento, // Se actualiza solo el campo `describaProcedimiento`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueSocios` en el estado.
   * 
   * @param indiqueSocios: El nuevo valor para el campo `indiqueSocios`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueSocios(indiqueSocios: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueSocios, // Se actualiza solo el campo `indiqueSocios`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueForma` en el estado.
   * 
   * @param indiqueForma: El nuevo valor para el campo `indiqueForma`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueForma(indiqueForma: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueForma, // Se actualiza solo el campo `indiqueForma`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueExisten` en el estado.
   * 
   * @param indiqueExisten: El nuevo valor para el campo `indiqueExisten`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueExisten(indiqueExisten: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueExisten, // Se actualiza solo el campo `indiqueExisten`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueCuenta` en el estado.
   * 
   * @param indiqueCuenta: El nuevo valor para el campo `indiqueCuenta`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueCuenta(indiqueCuenta: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueCuenta, // Se actualiza solo el campo `indiqueCuenta`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `procedimientoRealizar` en el estado.
   * 
   * @param procedimientoRealizar: El nuevo valor para el campo `procedimientoRealizar`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setProcedimientoRealizar(procedimientoRealizar: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      procedimientoRealizar, // Se actualiza solo el campo `procedimientoRealizar`
    }));
  }

/**
 * Método para actualizar el valor del campo `indiquePeriodicidad` en el estado.
 * 
 * @param indiquePeriodicidad: El nuevo valor para el campo `indiquePeriodicidad`.
 * Este valor se asigna al estado utilizando la función `update()`.
 */
public setIndiquePeriodicidad(indiquePeriodicidad: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiquePeriodicidad, // Se actualiza solo el campo `indiquePeriodicidad`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `describaComo` en el estado.
   * 
   * @param describaComo: El nuevo valor para el campo `describaComo`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDescribaComo(describaComo: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      describaComo, // Se actualiza solo el campo `describaComo`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `comoAseguran` en el estado.
   * 
   * @param comoAseguran: El nuevo valor para el campo `comoAseguran`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setComoAseguran(comoAseguran: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      comoAseguran, // Se actualiza solo el campo `comoAseguran`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueFormatos` en el estado.
   * 
   * @param indiqueFormatos: El nuevo valor para el campo `indiqueFormatos`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueFormatos(indiqueFormatos: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueFormatos, // Se actualiza solo el campo `indiqueFormatos`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `senalarMedidas` en el estado.
   * 
   * @param senalarMedidas: El nuevo valor para el campo `senalarMedidas`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setSenalarMedidas(senalarMedidas: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      senalarMedidas, // Se actualiza solo el campo `senalarMedidas`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueAlmacenes` en el estado.
   * 
   * @param indiqueAlmacenes: El nuevo valor para el campo `indiqueAlmacenes`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueAlmacenes(indiqueAlmacenes: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueAlmacenes, // Se actualiza solo el campo `indiqueAlmacenes`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `expliqueBrevemente` en el estado.
   * 
   * @param expliqueBrevemente: El nuevo valor para el campo `expliqueBrevemente`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setExpliqueBrevemente(expliqueBrevemente: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      expliqueBrevemente, // Se actualiza solo el campo `expliqueBrevemente`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueCerciora` en el estado.
   * 
   * @param indiqueCerciora: El nuevo valor para el campo `indiqueCerciora`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueCerciora(indiqueCerciora: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueCerciora, // Se actualiza solo el campo `indiqueCerciora`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueEstos` en el estado.
   * 
   * @param indiqueEstos: El nuevo valor para el campo `indiqueEstos`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueEstos(indiqueEstos: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueEstos, // Se actualiza solo el campo `indiqueEstos`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiquePertenecen` en el estado.
   * 
   * @param indiquePertenecen: El nuevo valor para el campo `indiquePertenecen`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiquePertenecen(indiquePertenecen: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiquePertenecen, // Se actualiza solo el campo `indiquePertenecen`
    }));
  }

/**
 * Método para actualizar el valor del campo `indiqueResponsable` en el estado.
 * 
 * @param indiqueResponsable: El nuevo valor para el campo `indiqueResponsable`.
 * Este valor se asigna al estado utilizando la función `update()`.
 */
public setIndiqueResponsable(indiqueResponsable: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueResponsable, // Se actualiza solo el campo `indiqueResponsable`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueTecnologia` en el estado.
   * 
   * @param indiqueTecnologia: El nuevo valor para el campo `indiqueTecnologia`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueTecnologia(indiqueTecnologia: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueTecnologia, // Se actualiza solo el campo `indiqueTecnologia`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `describirProcesamiento` en el estado.
   * 
   * @param describirProcesamiento: El nuevo valor para el campo `describirProcesamiento`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDescribirProcesamiento(describirProcesamiento: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      describirProcesamiento, // Se actualiza solo el campo `describirProcesamiento`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `detalleComo` en el estado.
   * 
   * @param detalleComo: El nuevo valor para el campo `detalleComo`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDetalleComo(detalleComo: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      detalleComo, // Se actualiza solo el campo `detalleComo`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueUtiliza` en el estado.
   * 
   * @param indiqueUtiliza: El nuevo valor para el campo `indiqueUtiliza`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueUtiliza(indiqueUtiliza: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueUtiliza, // Se actualiza solo el campo `indiqueUtiliza`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `detalleValida` en el estado.
   * 
   * @param detalleValida: El nuevo valor para el campo `detalleValida`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDetalleValida(detalleValida: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      detalleValida, // Se actualiza solo el campo `detalleValida`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `comoNumero` en el estado.
   * 
   * @param comoNumero: El nuevo valor para el campo `comoNumero`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setComoNumero(comoNumero: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      comoNumero, // Se actualiza solo el campo `comoNumero`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `senaleAsociados` en el estado.
   * 
   * @param senaleAsociados: El nuevo valor para el campo `senaleAsociados`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setSenaleAsociados(senaleAsociados: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      senaleAsociados, // Se actualiza solo el campo `senaleAsociados`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueMateriales` en el estado.
   * 
   * @param indiqueMateriales: El nuevo valor para el campo `indiqueMateriales`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueMateriales(indiqueMateriales: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueMateriales, // Se actualiza solo el campo `indiqueMateriales`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `queForma` en el estado.
   * 
   * @param queForma: El nuevo valor para el campo `queForma`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setQueForma(queForma: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      queForma, // Se actualiza solo el campo `queForma`
    }));
  }

/**
 * Método para actualizar el valor del campo `personalResponsable` en el estado.
 * 
 * @param personalResponsable: El nuevo valor para el campo `personalResponsable`.
 * Este valor se asigna al estado utilizando la función `update()`.
 */
public setPersonalResponsable(personalResponsable: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      personalResponsable, // Se actualiza solo el campo `personalResponsable`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueCuantas` en el estado.
   * 
   * @param indiqueCuantas: El nuevo valor para el campo `indiqueCuantas`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueCuantas(indiqueCuantas: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueCuantas, // Se actualiza solo el campo `indiqueCuantas`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueMonitoreadas` en el estado.
   * 
   * @param indiqueMonitoreadas: El nuevo valor para el campo `indiqueMonitoreadas`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueMonitoreadas(indiqueMonitoreadas: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueMonitoreadas, // Se actualiza solo el campo `indiqueMonitoreadas`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `detalleExisten` en el estado.
   * 
   * @param detalleExisten: El nuevo valor para el campo `detalleExisten`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDetalleExisten(detalleExisten: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      detalleExisten, // Se actualiza solo el campo `detalleExisten`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `describaAcceso` en el estado.
   * 
   * @param describaAcceso: El nuevo valor para el campo `describaAcceso`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDescribaAcceso(describaAcceso: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      describaAcceso, // Se actualiza solo el campo `describaAcceso`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `describirTipo` en el estado.
   * 
   * @param describirTipo: El nuevo valor para el campo `describirTipo`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDescribirTipo(describirTipo: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      describirTipo, // Se actualiza solo el campo `describirTipo`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `describaAreas` en el estado.
   * 
   * @param describaAreas: El nuevo valor para el campo `describaAreas`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDescribaAreas(describaAreas: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      describaAreas, // Se actualiza solo el campo `describaAreas`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `senaleMismas` en el estado.
   * 
   * @param senaleMismas: El nuevo valor para el campo `senaleMismas`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setSenaleMismas(senaleMismas: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      senaleMismas, // Se actualiza solo el campo `senaleMismas`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `casoNoContar` en el estado.
   * 
   * @param casoNoContar: El nuevo valor para el campo `casoNoContar`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setCasoNoContar(casoNoContar: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      casoNoContar, // Se actualiza solo el campo `casoNoContar`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `periodicidadVerifica` en el estado.
   * 
   * @param periodicidadVerifica: El nuevo valor para el campo `periodicidadVerifica`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setPeriodicidadVerifica(periodicidadVerifica: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      periodicidadVerifica, // Se actualiza solo el campo `periodicidadVerifica`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueTareas` en el estado.
   * 
   * @param indiqueTareas: El nuevo valor para el campo `indiqueTareas`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueTareas(indiqueTareas: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueTareas, // Se actualiza solo el campo `indiqueTareas`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `describaManera` en el estado.
   * 
   * @param describaManera: El nuevo valor para el campo `describaManera`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDescribaManera(describaManera: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      describaManera, // Se actualiza solo el campo `describaManera`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueSepara` en el estado.
   * 
   * @param indiqueSepara: El nuevo valor para el campo `indiqueSepara`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueSepara(indiqueSepara: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueSepara, // Se actualiza solo el campo `indiqueSepara`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `senaleRestringido` en el estado.
   * 
   * @param senaleRestringido: El nuevo valor para el campo `senaleRestringido`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setSenaleRestringido(senaleRestringido: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      senaleRestringido, // Se actualiza solo el campo `senaleRestringido`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `describaMonitoreo` en el estado.
   * 
   * @param describaMonitoreo: El nuevo valor para el campo `describaMonitoreo`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDescribaMonitoreo(describaMonitoreo: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      describaMonitoreo, // Se actualiza solo el campo `describaMonitoreo`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `responsablesControlar` en el estado.
   * 
   * @param responsablesControlar: El nuevo valor para el campo `responsablesControlar`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setResponsablesControlar(responsablesControlar: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      responsablesControlar, // Se actualiza solo el campo `responsablesControlar`
    }));
  }

/**
 * Método para actualizar el valor del campo `estacionamientos` en el estado.
 * 
 * @param estacionamientos: El nuevo valor para el campo `estacionamientos`.
 * Este valor se asigna al estado utilizando la función `update()`.
 */
public setEstacionamientos(estacionamientos: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      estacionamientos, // Se actualiza solo el campo `estacionamientos`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `llevaEntrada` en el estado.
   * 
   * @param llevaEntrada: El nuevo valor para el campo `llevaEntrada`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setLlevaEntrada(llevaEntrada: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      llevaEntrada, // Se actualiza solo el campo `llevaEntrada`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `politicasMecanismos` en el estado.
   * 
   * @param politicasMecanismos: El nuevo valor para el campo `politicasMecanismos`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setPoliticasMecanismos(politicasMecanismos: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      politicasMecanismos, // Se actualiza solo el campo `politicasMecanismos`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `procedimientoOperacion` en el estado.
   * 
   * @param procedimientoOperacion: El nuevo valor para el campo `procedimientoOperacion`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setProcedimientoOperacion(procedimientoOperacion: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      procedimientoOperacion, // Se actualiza solo el campo `procedimientoOperacion`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `senaleEncuentran` en el estado.
   * 
   * @param senaleEncuentran: El nuevo valor para el campo `senaleEncuentran`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setSenaleEncuentran(senaleEncuentran: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      senaleEncuentran, // Se actualiza solo el campo `senaleEncuentran`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `mencioneCuenta` en el estado.
   * 
   * @param mencioneCuenta: El nuevo valor para el campo `mencioneCuenta`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setMencioneCuenta(mencioneCuenta: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      mencioneCuenta, // Se actualiza solo el campo `mencioneCuenta`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `queManera` en el estado.
   * 
   * @param queManera: El nuevo valor para el campo `queManera`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setQueManera(queManera: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      queManera, // Se actualiza solo el campo `queManera`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `describaContactar` en el estado.
   * 
   * @param describaContactar: El nuevo valor para el campo `describaContactar`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDescribaContactar(describaContactar: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      describaContactar, // Se actualiza solo el campo `describaContactar`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueOperativo` en el estado.
   * 
   * @param indiqueOperativo: El nuevo valor para el campo `indiqueOperativo`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueOperativo(indiqueOperativo: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueOperativo, // Se actualiza solo el campo `indiqueOperativo`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueAparatos` en el estado.
   * 
   * @param indiqueAparatos: El nuevo valor para el campo `indiqueAparatos`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueAparatos(indiqueAparatos: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueAparatos, // Se actualiza solo el campo `indiqueAparatos`
    }));
  }
  

/**
 * Método para actualizar el valor del campo `mantenimiento` en el estado.
 * 
 * @param mantenimiento: El nuevo valor para el campo `mantenimiento`.
 * Este valor se asigna al estado utilizando la función `update()`.
 */
public setMantenimiento(mantenimiento: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      mantenimiento, // Se actualiza solo el campo `mantenimiento`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `politicasAparatos` en el estado.
   * 
   * @param politicasAparatos: El nuevo valor para el campo `politicasAparatos`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setPoliticasAparatos(politicasAparatos: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      politicasAparatos, // Se actualiza solo el campo `politicasAparatos`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `programaMantenimiento` en el estado.
   * 
   * @param programaMantenimiento: El nuevo valor para el campo `programaMantenimiento`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setProgramaMantenimiento(programaMantenimiento: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      programaMantenimiento, // Se actualiza solo el campo `programaMantenimiento`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueRespaldo` en el estado.
   * 
   * @param indiqueRespaldo: El nuevo valor para el campo `indiqueRespaldo`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueRespaldo(indiqueRespaldo: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueRespaldo, // Se actualiza solo el campo `indiqueRespaldo`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `describaAlarma` en el estado.
   * 
   * @param describaAlarma: El nuevo valor para el campo `describaAlarma`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDescribaAlarma(describaAlarma: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      describaAlarma, // Se actualiza solo el campo `describaAlarma`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueUtilizan` en el estado.
   * 
   * @param indiqueUtilizan: El nuevo valor para el campo `indiqueUtilizan`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueUtilizan(indiqueUtilizan: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueUtilizan, // Se actualiza solo el campo `indiqueUtilizan`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `describaSistemas` en el estado.
   * 
   * @param describaSistemas: El nuevo valor para el campo `describaSistemas`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDescribaSistemas(describaSistemas: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      describaSistemas, // Se actualiza solo el campo `describaSistemas`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indicarCamaras` en el estado.
   * 
   * @param indicarCamaras: El nuevo valor para el campo `indicarCamaras`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndicarCamaras(indicarCamaras: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indicarCamaras, // Se actualiza solo el campo `indicarCamaras`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `mencioneInspeccion` en el estado.
   * 
   * @param mencioneInspeccion: El nuevo valor para el campo `mencioneInspeccion`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setMencioneInspeccion(mencioneInspeccion: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      mencioneInspeccion, // Se actualiza solo el campo `mencioneInspeccion`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `senalarUbicacion` en el estado.
   * 
   * @param senalarUbicacion: El nuevo valor para el campo `senalarUbicacion`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setSenalarUbicacion(senalarUbicacion: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      senalarUbicacion, // Se actualiza solo el campo `senalarUbicacion`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueHorarios` en el estado.
   * 
   * @param indiqueHorarios: El nuevo valor para el campo `indiqueHorarios`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueHorarios(indiqueHorarios: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueHorarios, // Se actualiza solo el campo `indiqueHorarios`
    }));
  }
  

/**
 * Método para actualizar el valor del campo `indiqueRevisan` en el estado.
 * 
 * @param indiqueRevisan: El nuevo valor para el campo `indiqueRevisan`.
 * Este valor se asigna al estado utilizando la función `update()`.
 */
public setIndiqueRevisan(indiqueRevisan: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueRevisan, // Se actualiza solo el campo `indiqueRevisan`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueDesignado` en el estado.
   * 
   * @param indiqueDesignado: El nuevo valor para el campo `indiqueDesignado`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueDesignado(indiqueDesignado: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueDesignado, // Se actualiza solo el campo `indiqueDesignado`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `comoDocumentan` en el estado.
   * 
   * @param comoDocumentan: El nuevo valor para el campo `comoDocumentan`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setComoDocumentan(comoDocumentan: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      comoDocumentan, // Se actualiza solo el campo `comoDocumentan`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueTiempo` en el estado.
   * 
   * @param indiqueTiempo: El nuevo valor para el campo `indiqueTiempo`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueTiempo(indiqueTiempo: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueTiempo, // Se actualiza solo el campo `indiqueTiempo`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `contarPlanta` en el estado.
   * 
   * @param contarPlanta: El nuevo valor para el campo `contarPlanta`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setContarPlanta(contarPlanta: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      contarPlanta, // Se actualiza solo el campo `contarPlanta`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `estosSistemas` en el estado.
   * 
   * @param estosSistemas: El nuevo valor para el campo `estosSistemas`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setEstosSistemas(estosSistemas: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      estosSistemas, // Se actualiza solo el campo `estosSistemas`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indicarCircuito` en el estado.
   * 
   * @param indicarCircuito: El nuevo valor para el campo `indicarCircuito`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndicarCircuito(indicarCircuito: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indicarCircuito, // Se actualiza solo el campo `indicarCircuito`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `describaImplementado` en el estado.
   * 
   * @param describaImplementado: El nuevo valor para el campo `describaImplementado`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDescribaImplementado(describaImplementado: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      describaImplementado, // Se actualiza solo el campo `describaImplementado`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `formaControlan` en el estado.
   * 
   * @param formaControlan: El nuevo valor para el campo `formaControlan`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setFormaControlan(formaControlan: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      formaControlan, // Se actualiza solo el campo `formaControlan`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueTodas` en el estado.
   * 
   * @param indiqueTodas: El nuevo valor para el campo `indiqueTodas`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueTodas(indiqueTodas: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueTodas, // Se actualiza solo el campo `indiqueTodas`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiquePlanta` en el estado.
   * 
   * @param indiquePlanta: El nuevo valor para el campo `indiquePlanta`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiquePlanta(indiquePlanta: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiquePlanta, // Se actualiza solo el campo `indiquePlanta`
    }));
  }
  

/**
 * Método para actualizar el valor del campo `cuentaDocumentado` en el estado.
 * 
 * @param cuentaDocumentado: El nuevo valor para el campo `cuentaDocumentado`.
 * Este valor se asigna al estado utilizando la función `update()`.
 */
public setCuentaDocumentado(cuentaDocumentado: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      cuentaDocumentado, // Se actualiza solo el campo `cuentaDocumentado`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiquePuertas` en el estado.
   * 
   * @param indiquePuertas: El nuevo valor para el campo `indiquePuertas`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiquePuertas(indiquePuertas: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiquePuertas, // Se actualiza solo el campo `indiquePuertas`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indiqueCerrado` en el estado.
   * 
   * @param indiqueCerrado: El nuevo valor para el campo `indiqueCerrado`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndiqueCerrado(indiqueCerrado: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indiqueCerrado, // Se actualiza solo el campo `indiqueCerrado`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indicarCircuitoCerrado` en el estado.
   * 
   * @param indicarCircuitoCerrado: El nuevo valor para el campo `indicarCircuitoCerrado`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndicarCircuitoCerrado(indicarCircuitoCerrado: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indicarCircuitoCerrado, // Se actualiza solo el campo `indicarCircuitoCerrado`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `registroVisitantes` en el estado.
   * 
   * @param registroVisitantes: El nuevo valor para el campo `registroVisitantes`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setRegistroVisitantes(registroVisitantes: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      registroVisitantes, // Se actualiza solo el campo `registroVisitantes`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `casoSocios` en el estado.
   * 
   * @param casoSocios: El nuevo valor para el campo `casoSocios`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setCasoSocios(casoSocios: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      casoSocios, // Se actualiza solo el campo `casoSocios`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `estosEmpresa` en el estado.
   * 
   * @param estosEmpresa: El nuevo valor para el campo `estosEmpresa`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setEstosEmpresa(estosEmpresa: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      estosEmpresa, // Se actualiza solo el campo `estosEmpresa`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `comiteSeguridad` en el estado.
   * 
   * @param comiteSeguridad: El nuevo valor para el campo `comiteSeguridad`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setComiteSeguridad(comiteSeguridad: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      comiteSeguridad, // Se actualiza solo el campo `comiteSeguridad`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `fuentesInformacion` en el estado.
   * 
   * @param fuentesInformacion: El nuevo valor para el campo `fuentesInformacion`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setFuentesInformacion(fuentesInformacion: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      fuentesInformacion, // Se actualiza solo el campo `fuentesInformacion`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `politica` en el estado.
   * 
   * @param politica: El nuevo valor para el campo `politica`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setPolitica(politica: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      politica, // Se actualiza solo el campo `politica`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `indique` en el estado.
   * 
   * @param indique: El nuevo valor para el campo `indique`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setIndique(indique: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      indique, // Se actualiza solo el campo `indique`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `periodicidad` en el estado.
   * 
   * @param periodicidad: El nuevo valor para el campo `periodicidad`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setPeriodicidad(periodicidad: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      periodicidad, // Se actualiza solo el campo `periodicidad`
    }));
  }


/**
 * Método para actualizar el valor del campo `programa` en el estado.
 * 
 * @param programa: El nuevo valor para el campo `programa`.
 * Este valor se asigna al estado utilizando la función `update()`.
 */
public setPrograma(programa: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      programa, // Se actualiza solo el campo `programa`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `capacitacion` en el estado.
   * 
   * @param capacitacion: El nuevo valor para el campo `capacitacion`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setCapacitacion(capacitacion: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      capacitacion, // Se actualiza solo el campo `capacitacion`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `procedimiento` en el estado.
   * 
   * @param procedimiento: El nuevo valor para el campo `procedimiento`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setProcedimiento(procedimiento: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      procedimiento, // Se actualiza solo el campo `procedimiento`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `descripcionProcedimiento` en el estado.
   * 
   * @param descripcionProcedimiento: El nuevo valor para el campo `descripcionProcedimiento`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setDescripcionProcedimiento(descripcionProcedimiento: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      descripcionProcedimiento, // Se actualiza solo el campo `descripcionProcedimiento`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `nombreProcedimiento` en el estado.
   * 
   * @param nombreProcedimiento: El nuevo valor para el campo `nombreProcedimiento`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setNombreProcedimiento(nombreProcedimiento: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      nombreProcedimiento, // Se actualiza solo el campo `nombreProcedimiento`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `programacionAuditoria` en el estado.
   * 
   * @param programacionAuditoria: El nuevo valor para el campo `programacionAuditoria`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setProgramacionAuditoria(programacionAuditoria: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      programacionAuditoria, // Se actualiza solo el campo `programacionAuditoria`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `participantesAuditoria` en el estado.
   * 
   * @param participantesAuditoria: El nuevo valor para el campo `participantesAuditoria`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setParticipantesAuditoria(participantesAuditoria: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      participantesAuditoria, // Se actualiza solo el campo `participantesAuditoria`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `enfoqueAuditoria` en el estado.
   * 
   * @param enfoqueAuditoria: El nuevo valor para el campo `enfoqueAuditoria`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setEnfoqueAuditoria(enfoqueAuditoria: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      enfoqueAuditoria, // Se actualiza solo el campo `enfoqueAuditoria`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `procesosAuditados` en el estado.
   * 
   * @param procesosAuditados: El nuevo valor para el campo `procesosAuditados`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setProcesosAuditados(procesosAuditados: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      procesosAuditados, // Se actualiza solo el campo `procesosAuditados`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `registrosAuditoria` en el estado.
   * 
   * @param registrosAuditoria: El nuevo valor para el campo `registrosAuditoria`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setRegistrosAuditoria(registrosAuditoria: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      registrosAuditoria, // Se actualiza solo el campo `registrosAuditoria`
    }));
  }
  
  /**
 * Método para actualizar el valor del campo `programacion` en el estado.
 * 
 * @param programacion: El nuevo valor para el campo `programacion`.
 * Este valor se asigna al estado utilizando la función `update()`.
 */
public setProgramacion(programacion: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      programacion, // Se actualiza solo el campo `programacion`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `registrosNombre` en el estado.
   * 
   * @param registrosNombre: El nuevo valor para el campo `registrosNombre`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setRegistrosNombre(registrosNombre: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      registrosNombre, // Se actualiza solo el campo `registrosNombre`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `registrosEmpresa` en el estado.
   * 
   * @param registrosEmpresa: El nuevo valor para el campo `registrosEmpresa`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setRegistrosEmpresa(registrosEmpresa: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      registrosEmpresa, // Se actualiza solo el campo `registrosEmpresa`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `planEmergencia` en el estado.
   * 
   * @param planEmergencia: El nuevo valor para el campo `planEmergencia`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setPlanEmergencia(planEmergencia: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      planEmergencia, // Se actualiza solo el campo `planEmergencia`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `situacionesContempladas` en el estado.
   * 
   * @param situacionesContempladas: El nuevo valor para el campo `situacionesContempladas`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setSituacionesContempladas(situacionesContempladas: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      situacionesContempladas, // Se actualiza solo el campo `situacionesContempladas`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `mecanismosContinuidad` en el estado.
   * 
   * @param mecanismosContinuidad: El nuevo valor para el campo `mecanismosContinuidad`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setMecanismosContinuidad(mecanismosContinuidad: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      mecanismosContinuidad, // Se actualiza solo el campo `mecanismosContinuidad`
    }));
  }
  
  /**
   * Método para actualizar el valor del campo `simulacrosDocumentacion` en el estado.
   * 
   * @param simulacrosDocumentacion: El nuevo valor para el campo `simulacrosDocumentacion`.
   * Este valor se asigna al estado utilizando la función `update()`.
   */
  public setSimulacrosDocumentacion(simulacrosDocumentacion: string): void {
    this.update((state) => ({
      ...state, // Se copia el estado anterior
      simulacrosDocumentacion, // Se actualiza solo el campo `simulacrosDocumentacion`
    }));
  }
  
}
