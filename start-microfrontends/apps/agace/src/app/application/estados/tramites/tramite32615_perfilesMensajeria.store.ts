import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que representa el estado de Solicitud32615.
 */
export interface Solicitud32615PerfilesMensajeriaState {
  /**
   * El valor de describaProcedimiento.
   */
  describaProcedimiento: string;
  /**
   * El valor de indiqueLosCriterios.
   */
  indiqueLosCriterios: string;
  /**
   * El valor de indiqueLosMetodos.
   */
  indiqueLosMetodos: string;
  /**
   * El valor de describaLosIndicadores.
   */
  describaLosIndicadores: string;
  /**
   * El valor de comercioExterior.
   */
  comercioExterior: string;
  /**
   * El valor de candadosSeguridad.
   */
  candadosSeguridad: string;
  /**
   * El valor de proveedorExterno.
   */
  proveedorExterno: string;
  /**
   * El valor de susceptibleContaminacion.
   */
  susceptibleContaminacion: string;
  /**
   * El valor de encuentrenVacios.
   */
  encuentrenVacios: string;
  /**
   * El valor de semirremolquesVacios.
   */
  semirremolquesVacios: string;
  /**
   * El valor de utilizarCandado.
   */
  utilizarCandado: string;
  /**
   * El valor de seguridadMismas.
   */
  seguridadMismas: string;
  /**
   * El valor de describaContratacion.
   */
  describaContratacion: string;
  /**
   * El valor de describaContratacion.
   */
  documentacionExigida: string;
  /**
   * El valor de examenesSolicitados.
   */
  examenesSolicitados: string;
  /**
   * El valor de conformeAnalisis.
   */
  conformeAnalisis: string;
  /**
   * El valor de periodicidad.
   */
  periodicidad: string;
  /**
   * El valor de confidencialidad.
   */
  confidencialidad: string;
  /**
   * El valor de contratacionPersonal.
   */
  contratacionPersonal: string;
  /**
   * El valor de describaProcedimientoPersonal.
   */
  describaProcedimientoPersonal: string;
  /**
   * El valor de seguimientoProcedimiento.
   */
  seguimientoProcedimiento: string;
  /**
   * El valor de identificaciones.
   */
  identificaciones: string;
  /**
   * El valor de sistemasInformaticos.
   */
  sistemasInformaticos: string;
  /**
   * El valor de proveedoresServicios.
   */
  proveedoresServicios: string;
  /**
   * El valor de administracionPersonal.
   */
  administracionPersonal: string;
  /**
   * El valor de expliqueBrevemente.
   */
  expliqueBrevemente: string;
  /**
   * El valor de encuentranFuera.
   */
  encuentranFuera: string;
  /**
   * El valor de actualizacionesSeguridad.
   */
  actualizacionesSeguridad: string;
  /**
   * El valor de accesoLosMismos.
   */
  accesoLosMismos: string;
  /**
   * El valor de continuidadNegocio.
   */
  continuidadNegocio: string;
  /**
   * El valor de semanaCorresponda.
   */
  semanaCorresponda: string;
  /**
   * El valor de semanaCorresponda.
   */
  recuperarInformacion: string;
  /**
   * El valor de informacionArchivada.
   */
  informacionArchivada: string;
  /**
   * El valor de procesoDatos.
   */
  procesoDatos: string;
  /**
   * El valor de copiasSeguridad.
   */
  copiasSeguridad: string;
  /**
   * El valor de proteccionDeLaInformacion.
   */
  proteccionDeLaInformacion: string;
  /**
   * El valor de perdidaDeLaInformacion.
   */
  perdidaDeLaInformacion: string;
  /**
   * El valor de controlanSistemas.
   */
  controlanSistemas: string;
  /**
   * El valor de accionesDelResto.
   */
  accionesDelResto: string;
  /**
   * El valor de sistemasConfidenciales.
   */
  sistemasConfidenciales: string;
  /**
   * El valor de proporcionaEsasContrasenas.
   */
  proporcionaEsasContrasenas: string;
  /**
   * El valor de actualizacionesPeriodicas.
   */
  actualizacionesPeriodicas: string;
  /**
   * El valor de falsificadosLicencias.
   */
  falsificadosLicencias: string;
  /**
   * El valor de procesoDeImportacion.
   */
  procesoDeImportacion: string;
  /**
   * El valor de telecomunicaciones.
   */
  telecomunicaciones: string;
  /**
   * El valor de sistemaComprometido.
   */
  sistemaComprometido: string;
  /**
   * El valor de seguridadDeLaTecnologia.
   */
  seguridadDeLaTecnologia: string;
  /**
   * El valor de mediosTransporte.
   */
  mediosTransporte: string;
  /**
   * El valor de estaDifusion.
   */
  estaDifusion: string;
  /**
   * El valor de enunciativaLimitativa.
   */
  enunciativaLimitativa: string;
  /**
   * El valor de procedimientosEmpresa.
   */
  procedimientosEmpresa: string;
  /**
   * El valor de mediosDeTransporte.
   */
  mediosDeTransporte: string;
  /**
   * El valor de relacionadosSeguridad.
   */
  relacionadosSeguridad: string;
  /**
   * El valor de reportarIncidentes.
   */
  reportarIncidentes: string;
  /**
   * El valor de actividadesSospechosas.
   */
  actividadesSospechosas: string;
  /**
   * El valor de brevementeSonsiste.
   */
  brevementeSonsiste: string;
  /**
   * El valor de incidenteSeguridad.
   */
  incidenteSeguridad: string;
  /**
   * El valor de caboInvestigacion.
   */
  caboInvestigacion: string;
  /**
   * El valor de operacionCaboInvestigacion.
   */
  operacionCaboInvestigacion: string;

  /**
   * Dirección o lugar de residencia registrado.
   */
  domicilio: string;

  /**
   * Antigüedad en años (u otra unidad de tiempo) desde la creación de la entidad o inicio de operaciones.
   */
  antiguedad: number;

  /**
   * Actividad en años (u otra unidad de tiempo) desde la creación de la entidad o inicio de operaciones.
   */
  actividad: number;

  /**
   * Número total de productos registrados o disponibles.
   */
  productos: number;

  /**
   * Total de embarques realizados con fines de exportación.
   */
  embarquesExp: number;

  /**
   * Total de embarques recibidos con fines de importación.
   */
  embarquesImp: number;

  /**
   * Número total de empleados de la entidad.
   */
  empleados: number;

  /**
   * Superficie o área de las instalaciones (por ejemplo, en metros cuadrados).
   */
  superficie: number;

  /**
   * Nombre principal o razón social de la entidad.
   */
  nombre: string;

  /**
   * Categoría o clasificación asignada a la entidad (por ejemplo, micro, pyme, gran empresa).
   */
  categoria: string;

  /**
   * Periodo de vigencia o validez del registro o licencia.
   */
  vigencia: string;

  /**
   * Segundo nombre o nombre alternativo relacionado con la entidad.
   */
  nombre2: string;

  /**
   * Segunda categoría o clasificación adicional relacionada con la entidad.
   */
  categoria2: string;

  /**
   * Segundo periodo de vigencia o validez del registro.
   */
  vigencia2: string;

  /**
   * Tercer nombre o nombre adicional relacionado con la entidad.
   */
  nombre3: string;

  /**
   * Tercera categoría o clasificación adicional de la entidad.
   */
  categoria3: string;

  /**
   * Tercer periodo de vigencia o validez del registro.
   */
  vigencia3: string;

    /**
     * Indica si la entidad participa en el programa Partners in Protection (PIP).
     */
    pip: string;
    /**
     * Indica si la entidad participa en el programa Operador Económico Autorizado (OEA).
     */
    oea: string;
    /**
     * Número de registro.
     */
    numeroRegistro: string;
    /**
     * Número de registro del OEA.
     */
    numeroRegistroOEA: string;
    /**
     * Número de programa OEA.
     */
    numeroPrograma: string;
    /**
     * Otros programas relacionados con la seguridad de la entidad.
     */
    otrosProgramas: string;
    /**
     * Número de programa para otros programas de seguridad.
     */
    numeroProgramaOtros: string;
    /**
     * Número de registro para otros programas de seguridad.
     */
    numeroRegistroOtros: string;
    /**
     * Fecha de vigencia del perfil.
     */
    fechaVigenciaProfile: string;
    /**
     * El valor de enliste.
     */
    enliste: string;
    /**
     * Breve descripción de los temas que se imparten en el programa.
     */
    breveDescripcion: string;
    /**
     * Breve descripción del programa de seguridad.
     */
    brevementePrograma: string;
    /**
     * Periodos específicos de capacitación.
     */
    periodosEspecificos: string;

    /**
     * Periodicidad de las capacitaciones.
     */
    periodicidadCapacitaciones: string;

    /**
     * Documentación de las capacitaciones.
     */
    documentacionCapacitaciones: string;

    /**
     * Participación de los empleados en las capacitaciones.
     */
    participacionEmpleados: string;
}
/**
 * Función para crear el estado inicial de Solicitud32615PerfilesMensajeria.
 * @returns {Solicitud32615PerfilesMensajeriaState} El estado inicial de Solicitud32615PerfilesMensajeria.
 */
export function createInitialState(): Solicitud32615PerfilesMensajeriaState {
  return {
    /**
     * El valor de describaProcedimiento.
     */
    describaProcedimiento: '',
    /**
     * El valor de indiqueLosCriterios.
     */
    indiqueLosCriterios: '',
    /**
     * El valor de indiqueLosMetodos.   `
     */
    indiqueLosMetodos: '',
    /**
     * El valor de describaLosIndicadores.
     */
    describaLosIndicadores: '',
    /**
     * El valor de comercioExterior.
     */
    comercioExterior: '',
    /**
     * El valor de candadosSeguridad.
     */
    candadosSeguridad: '',
    /**
     * El valor de proveedorExterno.
     */
    proveedorExterno: '',
    /**
     * El valor de susceptibleContaminacion.
     */
    susceptibleContaminacion: '',
    /**
     * El valor de encuentrenVacios.
     */
    encuentrenVacios: '',
    /**
     * El valor de semirremolquesVacios.
     */
    semirremolquesVacios: '',
    /**
     * El valor de utilizarCandado.
     */
    utilizarCandado: '',
    /**
     * El valor de seguridadMismas.
     */
    seguridadMismas: '',
    /**
     * El valor de describaContratacion.
     */
    describaContratacion: '',
    /**
     * El valor de documentacionExigida.
     */
    documentacionExigida: '',
    /**
     * El valor de examenesSolicitados.
     */
    examenesSolicitados: '',
    /**
     * El valor de conformeAnalisis.
     */
    conformeAnalisis: '',
    /**
     * El valor de periodicidad.
     */
    periodicidad: '',
    /**
     * El valor de confidencialidad.
     */
    confidencialidad: '',
    /**
     * El valor de contratacionPersonal.
     */
    contratacionPersonal: '',
    /**
     * El valor de describaProcedimientoPersonal.
     */
    describaProcedimientoPersonal: '',
    /**
     * El valor de seguimientoProcedimiento.
     */
    seguimientoProcedimiento: '',
    /**
     * El valor de identificaciones.
     */
    identificaciones: '',
    /**
     * El valor de sistemasInformaticos.
     */
    sistemasInformaticos: '',
    /**
     * El valor de proveedoresServicios.
     */
    proveedoresServicios: '',
    /**
     * El valor de administracionPersonal.
     */
    administracionPersonal: '',
    /**
     * El valor de expliqueBrevemente.
     */
    expliqueBrevemente: '',
    /**
     * El valor de encuentranFuera.
     */
    encuentranFuera: '',
    /**
     * El valor de actualizacionesSeguridad.
     */
    actualizacionesSeguridad: '',
    /**
     * El valor de accesoLosMismos.
     */
    accesoLosMismos: '',
    /**
     * El valor de continuidadNegocio.
     */
    continuidadNegocio: '',
    /**
     * El valor de semanaCorresponda.
     */
    semanaCorresponda: '',
    /**
     * El valor de recuperarInformacion.
     */
    recuperarInformacion: '',
    /**
     * El valor de informacionArchivada.
     */
    informacionArchivada: '',
    /**
     * El valor de procesoDatos.
     */
    procesoDatos: '',
    /**
     * El valor de copiasSeguridad.
     */
    copiasSeguridad: '',
    /**
     * El valor de proteccionDeLaInformacion.
     */
    proteccionDeLaInformacion: '',
    /**
     * El valor de perdidaDeLaInformacion.
     */
    perdidaDeLaInformacion: '',
    /**
     * El valor de controlanSistemas.
     */
    controlanSistemas: '',
    /**
     * El valor de accionesDelResto.
     */
    accionesDelResto: '',
    /**
     * El valor de sistemasConfidenciales.
     */
    sistemasConfidenciales: '',
    /**
     * El valor de proporcionaEsasContrasenas.
     */
    proporcionaEsasContrasenas: '',
    /**
     * El valor de actualizacionesPeriodicas.
     */
    actualizacionesPeriodicas: '',
    /**
     * El valor de falsificadosLicencias.
     */
    falsificadosLicencias: '',
    /**
     * El valor de procesoDeImportacion.
     */
    procesoDeImportacion: '',
    /**
     * El valor de telecomunicaciones.
     */
    telecomunicaciones: '',
    /**
     * El valor de sistemaComprometido.
     */
    sistemaComprometido: '',
    /**
     * El valor de seguridadDeLaTecnologia.
     */
    seguridadDeLaTecnologia: '',
    /**
     * El valor de mediosTransporte.
     */
    mediosTransporte: '',
    /**
     * El valor de estaDifusion.
     */
    estaDifusion: '',
    /**
     * El valor de enunciativaLimitativa.
     */
    enunciativaLimitativa: '',
    /**
     * El valor de procedimientosEmpresa.
     */
    procedimientosEmpresa: '',
    /**
     * El valor de mediosDeTransporte.
     */
    mediosDeTransporte: '',
    /**
     * El valor de relacionadosSeguridad.
     */
    relacionadosSeguridad: '',
    /**
     * El valor de reportarIncidentes.
     */
    reportarIncidentes: '',
    /**
     * El valor de actividadesSospechosas.
     */
    actividadesSospechosas: '',
    /**
     * El valor de brevementeSonsiste.
     */
    brevementeSonsiste: '',
    /**
     * El valor de incidenteSeguridad.
     */
    incidenteSeguridad: '',
    /**
     * El valor de caboInvestigacion.
     */
    caboInvestigacion: '',
    /**
     * El valor de operacionCaboInvestigacion.
     */
    operacionCaboInvestigacion: '',
    /**
     * Dirección o lugar de residencia registrado.
     */
    domicilio: '',
    /**
     * Antigüedad en años (o la unidad que aplique) de la entidad o actividad.
     */
    antiguedad: 0,
    /**
     * Actividad en años (u otra unidad de tiempo) desde la creación de la entidad o inicio de operaciones.
     */
    actividad: 0,

    /**
     * Número total de productos registrados.
     */
    productos: 0,

    /**
     * Cantidad de embarques realizados con fines de exportación.
     */
    embarquesExp: 0,

    /**
     * Cantidad de embarques recibidos con fines de importación.
     */
    embarquesImp: 0,

    /**
     * Número total de empleados asociados a la entidad.
     */
    empleados: 0,

    /**
     * Área o superficie (por ejemplo, en m²) de las instalaciones.
     */
    superficie: 0,

    /**
     * Nombre principal o oficial de la entidad o empresa.
     */
    nombre: '',

    /**
     * Categoría o clasificación de la entidad (por ejemplo, micro, pyme, gran empresa).
     */
    categoria: '',

    /**
     * Vigencia o periodo de validez del registro.
     */
    vigencia: '',

    /**
     * Segundo nombre o nombre alternativo relacionado con la entidad.
     */
    nombre2: '',

    /**
     * Segunda categoría o clasificación adicional de la entidad.
     */
    categoria2: '',

    /**
     * Segunda vigencia o periodo alternativo de validez.
     */
    vigencia2: '',

    /**
     * Tercer nombre o nombre adicional relacionado con la entidad.
     */
    nombre3: '',

    /**
     * Tercera categoría o clasificación adicional.
     */
    categoria3: '',

    /**
     * Tercer periodo de vigencia o validez asociado.
     */
    vigencia3: '',
    /**
     * El valor de pip.
     */
    pip: '',
    /**
     * El valor de oea.
     */
    oea: '',
    /**
     * El valor de numeroRegistro.
     */
    numeroRegistro: '',
    /**
     * El valor de numeroRegistroOEA.
     */
    numeroRegistroOEA: '',  
    /**
     * El valor de numeroPrograma.
     */
    numeroPrograma: '',
    /**
     * El valor de otrosProgramas.
     */
    otrosProgramas: '',
    /**
     * El valor de numeroProgramaOtros.
     */
    numeroProgramaOtros: '',
    /**
     * El valor de numeroRegistroOtros.
     */
    numeroRegistroOtros: '',
    /**
     * Fecha de vigencia del perfil.
     */
    fechaVigenciaProfile: '',
    /**
     * El valor de enliste.
     */
    enliste: '',
    /**
     * Breve descripción del programa de seguridad.
     */
    breveDescripcion: '',
    /**
     * Breve descripción de los temas que se imparten en el programa.
     */
    brevementePrograma: '',
    /**
     * Documentación de las capacitaciones.
     */
    documentacionCapacitaciones: '',
    /**
     * Participación de los empleados en las capacitaciones.
     */
    participacionEmpleados: '',
    /**
     * Periodos específicos de capacitación.
     */
    periodosEspecificos: '',
    /**
     * Periodicidad de las capacitaciones.
     */
    periodicidadCapacitaciones: '',
  };
}

/**
 * Decorador Injectable para hacer que la tienda esté disponible a nivel raíz.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Decorador StoreConfig para configurar la tienda con un nombre y una opción de restablecimiento.
 * @param {Object} config - El objeto de configuración.
 * @param {string} config.name - El nombre de la tienda.
 * @param {boolean} config.resettable - Indica si la tienda es restablecible.
 */
@StoreConfig({ name: 'tramite32615PerfilesMensajeria', resettable: true })
export class Tramite32615PerfilesMensajeriaStore extends Store<Solicitud32615PerfilesMensajeriaState> {
  /**
   * Crea una instancia de Tramite32615Store.
   * Inicializa la tienda con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece el estado de describaProcedimiento.
   * @param describaProcedimiento - El valor de describaProcedimiento.
   */
  public setDescribaProcedimiento(describaProcedimiento: string): void {
    this.update((state) => ({
      ...state,
      describaProcedimiento,
    }));
  }
  /**
   * Establece el estado de indiqueLosCriterios.
   * @param indiqueLosCriterios - El valor de indiqueLosCriterios.
   */
  public setIndiqueLosCriterios(indiqueLosCriterios: string): void {
    this.update((state) => ({
      ...state,
      indiqueLosCriterios,
    }));
  }
  /**
   * Establece el estado de indiqueLosMetodos.
   * @param indiqueLosMetodos - El valor de indiqueLosMetodos.
   */
  public setIndiqueLosMetodos(indiqueLosMetodos: string): void {
    this.update((state) => ({
      ...state,
      indiqueLosMetodos,
    }));
  }
  /**
   * Establece el estado de describaLosIndicadores.
   * @param describaLosIndicadores - El valor de describaLosIndicadores.
   */
  public setDescribaLosIndicadores(describaLosIndicadores: string): void {
    this.update((state) => ({
      ...state,
      describaLosIndicadores,
    }));
  }
  /**
   * Establece el estado de comercioExterior.
   * @param comercioExterior - El valor de comercioExterior.
   */
  public setComercioExterior(comercioExterior: string): void{
    this.update((state) => ({
      ...state,
      comercioExterior,
    }));
  }
  /**
   * Establece el estado de candadosSeguridad.
   * @param candadosSeguridad - El valor de candadosSeguridad.
   */
  public setCandadosSeguridad(candadosSeguridad: string): void {
    this.update((state) => ({
      ...state,
      candadosSeguridad,
    }));
  }
  /**
   * Establece el estado de proveedorExterno.
   * @param proveedorExterno - El valor de proveedorExterno.
   */
  public setProveedorExterno(proveedorExterno: string): void {
    this.update((state) => ({
      ...state,
      proveedorExterno,
    }));
  }
  /**
   * Establece el estado de susceptibleContaminacion.
   * @param susceptibleContaminacion - El valor de susceptibleContaminacion.
   */
  public setSusceptibleContaminacion(susceptibleContaminacion: string): void {
    this.update((state) => ({
      ...state,
      susceptibleContaminacion,
    }));
  }
  /**
   * Establece el estado de encuentrenVacios.
   * @param encuentrenVacios - El valor de encuentrenVacios.
   */
  public setEncuentrenVacios(encuentrenVacios: string): void {
    this.update((state) => ({
      ...state,
      encuentrenVacios,
    }));
  }
  /**
   * Establece el estado de semirremolquesVacios.
   * @param semirremolquesVacios - El valor de semirremolquesVacios.
   */
  public setSemirremolquesVacios(semirremolquesVacios: string): void {
    this.update((state) => ({
      ...state,
      semirremolquesVacios,
    }));
  }
  /**
   * Establece el estado de utilizarCandado.
   * @param utilizarCandado - El valor de utilizarCandado.
   */
  public setUtilizarCandado(utilizarCandado: string): void {
    this.update((state) => ({
      ...state,
      utilizarCandado,
    }));
  }
  /**
   * Establece el estado de seguridadMismas.
   * @param seguridadMismas - El valor de seguridadMismas.
   */
  public setSeguridadMismas(seguridadMismas: string): void {
    this.update((state) => ({
      ...state,
      seguridadMismas,
    }));
  }
  /**
   * Establece el estado de describaContratacion.
   * @param describaContratacion - El valor de describaContratacion.
   */
  public setDescribaContratacion(describaContratacion: string): void {
    this.update((state) => ({
      ...state,
      describaContratacion,
    }));
  }
  /**
   * Establece el estado de documentacionExigida.
   * @param documentacionExigida - El valor de documentacionExigida.
   */
  public setDocumentacionExigida(documentacionExigida: string): void {
    this.update((state) => ({
      ...state,
      documentacionExigida,
    }));
  }
  /**
   * Establece el estado de examenesSolicitados.
   * @param examenesSolicitados - El valor de examenesSolicitados.
   */
  public setExamenesSolicitados(examenesSolicitados: string): void {
    this.update((state) => ({
      ...state,
      examenesSolicitados,
    }));
  }
  /**
   * Establece el estado de conformeAnalisis.
   * @param conformeAnalisis - El valor de conformeAnalisis.
   */
  public setConformeAnalisis(conformeAnalisis: string): void {
    this.update((state) => ({
      ...state,
      conformeAnalisis,
    }));
  }
  /**
   * Establece el estado de periodicidad.
   * @param periodicidad - El valor de periodicidad.
   */
  public setPeriodicidad(periodicidad: string): void {
    this.update((state) => ({
      ...state,
      periodicidad,
    }));
  }
  /**
   * Establece el estado de confidencialidad.
   * @param confidencialidad - El valor de confidencialidad.
   */
  public setConfidencialidad(confidencialidad: string): void {
    this.update((state) => ({
      ...state,
      confidencialidad,
    }));
  }
  /**
   * Establece el estado de contratacionPersonal.
   * @param contratacionPersonal - El valor de contratacionPersonal.
   */
  public setContratacionPersonal(contratacionPersonal: string): void {
    this.update((state) => ({
      ...state,
      contratacionPersonal,
    }));
  }
  /**
   * Establece el estado de describaProcedimientoPersonal.
   * @param describaProcedimientoPersonal - El valor de describaProcedimientoPersonal.
   */
  public setDescribaProcedimientoPersonal(
    describaProcedimientoPersonal: string
  ): void {
    this.update((state) => ({
      ...state,
      describaProcedimientoPersonal,
    }));
  }
  /**
   * Establece el estado de seguimientoProcedimiento.
   * @param seguimientoProcedimiento - El valor de seguimientoProcedimiento.
   */
  public setSeguimientoProcedimiento(seguimientoProcedimiento: string): void {
    this.update((state) => ({
      ...state,
      seguimientoProcedimiento,
    }));
  }
  /**
   * Establece el estado de identificaciones.
   * @param identificaciones - El valor de identificaciones.
   */
  public setIdentificaciones(identificaciones: string): void {
    this.update((state) => ({
      ...state,
      identificaciones,
    }));
  }
  /**
   * Establece el estado de sistemasInformaticos.
   * @param sistemasInformaticos - El valor de sistemasInformaticos.
   */
  public setSistemasInformaticos(sistemasInformaticos: string): void {
    this.update((state) => ({
      ...state,
      sistemasInformaticos,
    }));
  }
  /**
   * Establece el estado de proveedoresServicios.
   * @param proveedoresServicios - El valor de proveedoresServicios.
   */
  public setProveedoresServicios(proveedoresServicios: string): void {
    this.update((state) => ({
      ...state,
      proveedoresServicios,
    }));
  }
  /**
   * Establece el estado de administracionPersonal.
   * @param administracionPersonal - El valor de administracionPersonal.
   */
  public setAdministracionPersonal(administracionPersonal: string): void {
    this.update((state) => ({
      ...state,
      administracionPersonal,
    }));
  }
  /**
   * Establece el estado de expliqueBrevemente.
   * @param expliqueBrevemente - El valor de expliqueBrevemente.
   */
  public setExpliqueBrevemente(expliqueBrevemente: string): void {
    this.update((state) => ({
      ...state,
      expliqueBrevemente,
    }));
  }
  /**
   * Establece el estado de encuentranFuera.
   * @param encuentranFuera - El valor de encuentranFuera.
   */
  public setEncuentranFuera(encuentranFuera: string): void {
    this.update((state) => ({
      ...state,
      encuentranFuera,
    }));
  }
  /**
   * Establece el estado de actualizacionesSeguridad.
   * @param actualizacionesSeguridad - El valor de actualizacionesSeguridad.
   */
  public setActualizacionesSeguridad(actualizacionesSeguridad: string): void {
    this.update((state) => ({
      ...state,
      actualizacionesSeguridad,
    }));
  }
  /**
   * Establece el estado de accesoLosMismos.
   * @param accesoLosMismos - El valor de accesoLosMismos.
   */
  public setAccesoLosMismos(accesoLosMismos: string): void{
    this.update((state) => ({
      ...state,
      accesoLosMismos,
    }));
  }
  /**
   * Establece el estado de continuidadNegocio.
   * @param continuidadNegocio - El valor de continuidadNegocio.
   */
  public setContinuidadNegocio(continuidadNegocio: string): void {
    this.update((state) => ({
      ...state,
      continuidadNegocio,
    }));
  }
  /**
   * Establece el estado de semanaCorresponda.
   * @param semanaCorresponda - El valor de semanaCorresponda.
   */
  public setSemanaCorresponda(semanaCorresponda: string): void {
    this.update((state) => ({
      ...state,
      semanaCorresponda,
    }));
  }
  /**
   * Establece el estado de recuperarInformacion.
   * @param recuperarInformacion - El valor de recuperarInformacion.
   */
  public setRecuperarInformacion(recuperarInformacion: string): void {
    this.update((state) => ({
      ...state,
      recuperarInformacion,
    }));
  }
  /**
   * Establece el estado de informacionArchivada.
   * @param informacionArchivada - El valor de informacionArchivada.
   */
  public setInformacionArchivada(informacionArchivada: string): void {
    this.update((state) => ({
      ...state,
      informacionArchivada,
    }));
  }
  /**
   * Establece el estado de procesoDatos.
   * @param procesoDatos - El valor de procesoDatos.
   */
  public setProcesoDatos(procesoDatos: string): void {
    this.update((state) => ({
      ...state,
      procesoDatos,
    }));
  }
  /**
   * Establece el estado de copiasSeguridad.
   * @param copiasSeguridad - El valor de copiasSeguridad.
   */
  public setCopiasSeguridad(copiasSeguridad: string): void {
    this.update((state) => ({
      ...state,
      copiasSeguridad,
    }));
  }
  /**
   * Establece el estado de proteccionDeLaInformacion.
   * @param proteccionDeLaInformacion - El valor de proteccionDeLaInformacion.
   */
  public setProteccionDeLaInformacion(proteccionDeLaInformacion: string): void {
    this.update((state) => ({
      ...state,
      proteccionDeLaInformacion,
    }));
  }
  /**
   * Establece el estado de perdidaDeLaInformacion.
   * @param perdidaDeLaInformacion - El valor de perdidaDeLaInformacion.
   */
  public setPerdidaDeLaInformacion(perdidaDeLaInformacion: string): void {
    this.update((state) => ({
      ...state,
      perdidaDeLaInformacion,
    }));
  }
  /**
   * Establece el estado de controlanSistemas.
   * @param controlanSistemas - El valor de controlanSistemas.
   */
  public setControlanSistemas(controlanSistemas: string): void {
    this.update((state) => ({
      ...state,
      controlanSistemas,
    }));
  }
  /**
   * Establece el estado de accionesDelResto.
   * @param accionesDelResto - El valor de accionesDelResto.
   */
  public setAccionesDelResto(accionesDelResto: string): void {
    this.update((state) => ({
      ...state,
      accionesDelResto,
    }));
  }
  /**
   * Establece el estado de sistemasConfidenciales.
   * @param sistemasConfidenciales - El valor de sistemasConfidenciales.
   */
  public setSistemasConfidenciales(sistemasConfidenciales: string): void {
    this.update((state) => ({
      ...state,
      sistemasConfidenciales,
    }));
  }
  /**
   * Establece el estado de proporcionaEsasContrasenas.
   * @param proporcionaEsasContrasenas - El valor de proporcionaEsasContrasenas.
   */
  public setProporcionaEsasContrasenas(proporcionaEsasContrasenas: string): void {
    this.update((state) => ({
      ...state,
      proporcionaEsasContrasenas,
    }));
  }
  /**
   * Establece el estado de actualizacionesPeriodicas.
   * @param actualizacionesPeriodicas - El valor de actualizacionesPeriodicas.
   */
  public setActualizacionesPeriodicas(actualizacionesPeriodicas: string): void {
    this.update((state) => ({
      ...state,
      actualizacionesPeriodicas,
    }));
  }
  /**
   * Establece el estado de falsificadosLicencias.
   * @param falsificadosLicencias - El valor de falsificadosLicencias.
   */
  public setFalsificadosLicencias(falsificadosLicencias: string): void {
    this.update((state) => ({
      ...state,
      falsificadosLicencias,
    }));
  }
  /**
   * Establece el estado de procesoDeImportacion.
   * @param procesoDeImportacion - El valor de procesoDeImportacion.
   */
  public setProcesoDeImportacion(procesoDeImportacion: string): void {
    this.update((state) => ({
      ...state,
      procesoDeImportacion,
    }));
  }
  /**
   * Establece el estado de telecomunicaciones.
   * @param telecomunicaciones - El valor de telecomunicaciones.
   */
  public setTelecomunicaciones(telecomunicaciones: string): void {
    this.update((state) => ({
      ...state,
      telecomunicaciones,
    }));
  }
  /**
   * Establece el estado de sistemaComprometido.
   * @param sistemaComprometido - El valor de sistemaComprometido.
   */
  public setSistemaComprometido(sistemaComprometido: string): void {
    this.update((state) => ({
      ...state,
      sistemaComprometido,
    }));
  }
  /**
   * Establece el estado de seguridadDeLaTecnologia.
   * @param seguridadDeLaTecnologia - El valor de seguridadDeLaTecnologia.
   */
  public setSeguridadDeLaTecnologia(seguridadDeLaTecnologia: string): void {
    this.update((state) => ({
      ...state,
      seguridadDeLaTecnologia,
    }));
  }
  /**
   * Establece el estado de mediosTransporte.
   * @param mediosTransporte - El valor de mediosTransporte.
   */
  public setMediosTransporte(mediosTransporte: string): void {
    this.update((state) => ({
      ...state,
      mediosTransporte,
    }));
  }
  /**
   * Establece el estado de estaDifusion.
   * @param estaDifusion - El valor de estaDifusion.
   */
  public setEstaDifusion(estaDifusion: string): void {
    this.update((state) => ({
      ...state,
      estaDifusion,
    }));
  }
  /**
   * Establece el estado de enunciativaLimitativa.
   * @param enunciativaLimitativa - El valor de enunciativaLimitativa.
   */
  public setEnunciativaLimitativa(enunciativaLimitativa: string): void {
    this.update((state) => ({
      ...state,
      enunciativaLimitativa,
    }));
  }
  /**
   * Establece el estado de procedimientosEmpresa.
   * @param procedimientosEmpresa - El valor de procedimientosEmpresa.
   */
  public setProcedimientosEmpresa(procedimientosEmpresa: string): void {
    this.update((state) => ({
      ...state,
      procedimientosEmpresa,
    }));
  }
  /**
   * Establece el estado de mediosDeTransporte.
   * @param mediosDeTransporte - El valor de mediosDeTransporte.
   */
  public setMediosDeTransporte(mediosDeTransporte: string): void {
    this.update((state) => ({
      ...state,
      mediosDeTransporte,
    }));
  }
  /**
   * Establece el estado de relacionadosSeguridad.
   * @param relacionadosSeguridad - El valor de relacionadosSeguridad.
   */
  public setRelacionadosSeguridad(relacionadosSeguridad: string): void {
    this.update((state) => ({
      ...state,
      relacionadosSeguridad,
    }));
  }
  /**
   * Establece el estado de reportarIncidentes.
   * @param reportarIncidentes - El valor de reportarIncidentes.
   */
  public setReportarIncidentes(reportarIncidentes: string): void {
    this.update((state) => ({
      ...state,
      reportarIncidentes,
    }));
  }
  /**
   * Establece el estado de actividadesSospechosas.
   * @param actividadesSospechosas - El valor de actividadesSospechosas.
   */
  public setActividadesSospechosas(actividadesSospechosas: string): void {
    this.update((state) => ({
      ...state,
      actividadesSospechosas,
    }));
  }
  /**
   * Establece el estado de brevementeSonsiste.
   * @param brevementeSonsiste - El valor de brevementeSonsiste.
   */
  public setBrevementeSonsiste(brevementeSonsiste: string): void {
    this.update((state) => ({
      ...state,
      brevementeSonsiste,
    }));
  }
  /**
   * Establece el estado de incidenteSeguridad.
   * @param incidenteSeguridad - El valor de incidenteSeguridad.
   */
  public setIncidenteSeguridad(incidenteSeguridad: string): void {
    this.update((state) => ({
      ...state,
      incidenteSeguridad,
    }));
  }
  /**
   * Establece el estado de caboInvestigacion.
   * @param caboInvestigacion - El valor de caboInvestigacion.
   */
  public setCaboInvestigacion(caboInvestigacion: string): void {
    this.update((state) => ({
      ...state,
      caboInvestigacion,
    }));
  }
  /**
   * Establece el estado de operacionCaboInvestigacion.
   * @param operacionCaboInvestigacion - El valor de operacionCaboInvestigacion.
   */
  public setOperacionCaboInvestigacion(operacionCaboInvestigacion: string): void {
    this.update((state) => ({
      ...state,
      operacionCaboInvestigacion,
    }));
  }

  /**
   * Establece el domicilio en el estado actual.
   *
   * @param domicilio - Dirección o lugar de residencia del usuario o entidad.
   */
  public setDomicilio(domicilio: string): void {
    this.update((state) => ({
      ...state,
      domicilio,
    }));
  }

  /**
   * Establece la antigüedad en el estado actual.
   *
   * @param antiguedad - Cantidad de tiempo (en años, meses, etc.) que ha transcurrido desde cierto evento, como la creación de la empresa.
   */
  public setAntiguedad(antiguedad: number): void {
    this.update((state) => ({
      ...state,
      antiguedad,
    }));
  }
    /**
     * Establece la actividad en el estado actual.
     *
     * @param actividad - Tiempo transcurrido desde el inicio de las operaciones o actividad de la entidad.
     */
  public setActividad(actividad: number): void {
    this.update((state) => ({
      ...state,
      actividad,
    }));
  }

  /**
   * Establece la cantidad de productos en el estado actual.
   *
   * @param productos - Número total de productos disponibles o registrados.
   */
  public setProductos(productos: number): void {
    this.update((state) => ({
      ...state,
      productos,
    }));
  }

  /**
   * Establece el número de embarques de exportación en el estado actual.
   *
   * @param embarquesExp - Total de embarques realizados con fines de exportación.
   */
  public setEmbarquesExp(embarquesExp: number): void {
    this.update((state) => ({
      ...state,
      embarquesExp,
    }));
  }

  /**
   * Establece el número de embarques de importación en el estado actual.
   *
   * @param embarquesImp - Total de embarques recibidos con fines de importación.
   */
  public setEmbarquesImp(embarquesImp: number): void {
    this.update((state) => ({
      ...state,
      embarquesImp,
    }));
  }

  /**
   * Establece el número de empleados en el estado actual.
   *
   * @param empleados - Cantidad total de empleados que forman parte de la entidad.
   */
  public setEmpleados(empleados: number): void {
    this.update((state) => ({
      ...state,
      empleados,
    }));
  }

  /**
   * Establece la superficie en el estado actual.
   *
   * @param superficie - Medida del área o espacio físico (por ejemplo, en metros cuadrados) de las instalaciones.
   */
  public setSuperficie(superficie: number): void {
    this.update((state) => ({
      ...state,
      superficie,
    }));
  }

  /**
   * Establece el nombre en el estado actual.
   *
   * @param nombre - Nombre oficial o registrado de la entidad o empresa.
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre,
    }));
  }

  /**
   * Establece la categoría en el estado actual.
   *
   * @param categoria - Clasificación o tipo al que pertenece la entidad (por ejemplo, microempresa, pyme, gran empresa).
   */
  public setCategoria(categoria: string): void {
    this.update((state) => ({
      ...state,
      categoria,
    }));
  }

  /**
   * Establece la vigencia en el estado actual.
   *
   * @param vigencia - Período o duración de validez de la entidad o registro.
   */
  public setVigencia(vigencia: string): void {
    this.update((state) => ({
      ...state,
      vigencia,
    }));
  }

  /**
   * Establece el segundo nombre en el estado actual.
   *
   * @param nombre2 - Segundo nombre o nombre alternativo relacionado con la entidad.
   */
  public setNombre2(nombre2: string): void {
    this.update((state) => ({
      ...state,
      nombre2,
    }));
  }

  /**
   * Establece la segunda categoría en el estado actual.
   *
   * @param categoria2 - Segunda clasificación o tipo adicional asociado a la entidad.
   */
  public setCategoria2(categoria2: string): void {
    this.update((state) => ({
      ...state,
      categoria2,
    }));
  }

  /**
   * Establece la segunda vigencia en el estado actual.
   *
   * @param vigencia2 - Segundo período o duración alternativa de validez de la entidad o registro.
   */
  public setVigenciaDos(vigencia2: string): void {
    this.update((state) => ({
      ...state,
      vigencia2,
    }));
  }

  /**
   * Establece el tercer nombre en el estado actual.
   *
   * @param nombre3 - Tercer nombre o nombre adicional relacionado con la entidad.
   */
  public setNombre3(nombre3: string): void {
    this.update((state) => ({
      ...state,
      nombre3,
    }));
  }

  /**
   * Establece la tercera categoría en el estado actual.
   *
   * @param categoria3 - Tercera clasificación o tipo adicional relacionado con la entidad.
   */
  public setCategoria3(categoria3: string): void {
    this.update((state) => ({
      ...state,
      categoria3,
    }));
  }

  /**
   * Establece la tercera vigencia en el estado actual.
   *
   * @param vigencia3 - Tercer período o duración alternativa de validez de la entidad o registro.
   */
  public setVigenciaTres(vigencia3: string): void {
    this.update((state) => ({
      ...state,
      vigencia3,
    }));
  }
    /**
     * Establece si la entidad participa en el programa Partners in Protection (PIP).
     *
     * @param pip - Indica si la entidad está registrada en el programa PIP.
     */
    public setPip(pip: string): void {
        this.update((state) => ({
            ...state,
            pip,
        }));
    }
    /**
     * Establece el número de registro de la entidad.
     *
     * @param numeroRegistro - Número de registro asociado al programa OEA.
     */
    public setNumeroRegistro(numeroRegistro: string): void {
        this.update((state) => ({
            ...state,
            numeroRegistro,
        }));
    }
    /**
     * Establece si la entidad participa en el programa Operador Económico Autorizado (OEA).
     *
     * @param oea - Indica si la entidad está registrada en el programa OEA.
     */
    public setOea(oea: string): void {
        this.update((state) => ({
            ...state,
            oea,
        }));
    }
    /**
     * Establece el número de registro OEA de la entidad.
     *
     * @param numeroRegistroOEA - Número de registro asociado al programa OEA.
     */
    public setNumeroRegistroOEA(numeroRegistroOEA: string): void {
        this.update((state) => ({
            ...state,
            numeroRegistroOEA,
        }));
    }
    /**
     * Establece el número de programa de la entidad.
     *
     * @param numeroPrograma - Número de programa asociado a la entidad.
     */
    public setNumeroPrograma(numeroPrograma: string): void {
        this.update((state) => ({
            ...state,
            numeroPrograma,
        }));
    }
    /**
     * Establece otros programas asociados a la entidad.
     *
     * @param otrosProgramas - Detalles de otros programas en los que participa la entidad.
     */
    public setOtrosProgramas(otrosProgramas: string): void {
        this.update((state) => ({
            ...state,
            otrosProgramas,
        }));
    }
    /**
     * Establece el número de programa de otros programas asociados a la entidad.
     *
     * @param numeroProgramaOtros - Número de programa asociado a otros programas.
     */
    public setNumeroProgramaOtros(numeroProgramaOtros: string): void {
        this.update((state) => ({
            ...state,
            numeroProgramaOtros,
        }));
    }
    /**
     * Establece el número de registro de otros programas asociados a la entidad.
     *
     * @param numeroRegistroOtros - Número de registro asociado a otros programas.
     */
    public setNumeroRegistroOtros(numeroRegistroOtros: string): void {
        this.update((state) => ({
            ...state,
            numeroRegistroOtros,
        }));
    }
    /**
     * Establece la fecha de vigencia del perfil.
     *
     * @param fechaVigenciaProfile - Fecha de vigencia del perfil.
     */
    public setFechaVigenciaProfile(fechaVigenciaProfile: string): void {
        this.update((state) => ({
            ...state,
            fechaVigenciaProfile,
        }));
    }
    /**
     * Establece el valor de enliste.
     *
     * @param enliste - Valor de enliste.
     */
    public setEnliste(enliste: string): void {
        this.update((state) => ({
            ...state,
            enliste,
        }));
    }
    /**
         * Establece una breve descripción del programa de seguridad.
         *
         * @param breveDescripcion - Breve descripción del programa de seguridad.
         */
    public setBreveDescripcion(breveDescripcion: string): void {
        this.update((state) => ({
            ...state,
            breveDescripcion,
        }));
    }
    /**
     * Establece el valor de brevementePrograma.
     *
     * @param brevementePrograma - Valor de brevementePrograma.
     */
    public setBrevementePrograma(brevementePrograma: string): void {
        this.update((state) => ({
            ...state,
            brevementePrograma,
        }));
    }
    /**
     * Establece la documentación de las capacitaciones.
     *
     * @param documentacionCapacitaciones - Documentación de las capacitaciones.
     */
    public setDocumentacionCapacitaciones(documentacionCapacitaciones: string): void {
        this.update((state) => ({
            ...state,
            documentacionCapacitaciones,
        }));
    }
    /**
     * Establece la participación de los empleados en las capacitaciones.
     *
     * @param participacionEmpleados - Participación de los empleados en las capacitaciones.
     */
    public setParticipacionEmpleados(participacionEmpleados: string): void {
        this.update((state) => ({
            ...state,
            participacionEmpleados,
        }));
    }
    /**
     * Establece los periodos específicos de capacitación.
     *
     * @param periodosEspecificos - Periodos específicos de capacitación.
     */
    public setPeriodosEspecificos(periodosEspecificos: string): void {
        this.update((state) => ({
            ...state,
            periodosEspecificos,
        }));
    }
    /**
     * Establece la periodicidad de las capacitaciones.
     *
     * @param periodicidadCapacitaciones - Periodicidad de las capacitaciones.
     */
    public setPeriodicidadCapacitaciones(periodicidadCapacitaciones: string): void {
        this.update((state) => ({
            ...state,
            periodicidadCapacitaciones,
        }));
    }
}