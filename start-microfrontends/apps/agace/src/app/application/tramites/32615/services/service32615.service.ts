import { Solicitud32615MensajeriaState, Tramite32615MensajeriaStore } from '../../../estados/tramites/tramite32615_mensajeria.store';
import { Solicitud32615PerfilesMensajeriaState, Tramite32615PerfilesMensajeriaStore } from '../../../estados/tramites/tramite32615_perfilesMensajeria.store';
import { Solicitud32615PerfilesState, Tramite32615PerfilesStore } from '../../../estados/tramites/tramite32615_perfiles.store';
import { Solicitud32615State, Tramite32615Store } from '../../../estados/tramites/tramite32615.store';
import {Solicitud32615TercerosState, Tramite32615TercerosStore} from '../../../estados/tramites/tramite32615_terceros.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

/**
 * Servicio encargado de manejar la lógica relacionada con la solicitud del trámite 32615.
 * Se encarga de actualizar el estado de la solicitud en el store y de obtener datos precargados desde archivos JSON.
 */
@Injectable({
  providedIn: 'root',
})
export class Solicitud32615Service {
  /**
   * URL base del servidor principal.
   */
  urlServer = ENVIRONMENT.URL_SERVER;

  /**
   * URL base del servidor que contiene los catálogos auxiliares en formato JSON.
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes a servicios o archivos locales.
   * @param tramite32615Store Store personalizado para el manejo del estado del trámite 32615.
   */
  constructor(
    private http: HttpClient,
    private tramite32615Store: Tramite32615Store,
    private tramite32615PerfilesStore: Tramite32615PerfilesStore,
    private tramite32615PerfilesMensajeriaStore: Tramite32615PerfilesMensajeriaStore,
    private tramite32615MensajeriaStore: Tramite32615MensajeriaStore,
    private tramite32615TercerosStore: Tramite32615TercerosStore
  ) {
    // Lógica de inicialización si es necesario
  }

   /**
   * Actualiza el estado del formulario de la solicitud en el store con la información proporcionada.
   * Cada propiedad del objeto recibido es asignada al store correspondiente.
   * 
   * @param DATOS Objeto con la estructura completa del estado del formulario del trámite 32615.
   */
  actualizarEstadoFormulario(DATOS: Solicitud32615State): void {
    this.tramite32615Store.setSectorProductivo(DATOS.sectorProductivo);
    this.tramite32615Store.setServicio(DATOS.servicio);
    this.tramite32615Store.setPreOperativo(DATOS.preOperativo);
    this.tramite32615Store.setSolicitudDeInspeccion(DATOS.solicitudDeInspeccion);
    this.tramite32615Store.setIndiqueAutorizo(DATOS.indiqueAutorizo);
    this.tramite32615Store.setSenaleCuentaEmpleados(DATOS.senaleCuentaEmpleados);
    this.tramite32615Store.setBimestre(DATOS.bimestre);
    this.tramite32615Store.setNumeroDeEmpleados(DATOS.numeroDeEmpleados);
    this.tramite32615Store.setCumpleConLaObligacion(DATOS.cumpleConLaObligacion);
    this.tramite32615Store.setAcreditaRealizar(DATOS.acreditaRealizar);
    this.tramite32615Store.setSenaleSiAlMomento(DATOS.senaleSiAlMomento);
    this.tramite32615Store.setRfc(DATOS.rfc);
    this.tramite32615Store.setNumeroDeEmpleadosForma(DATOS.numeroDeEmpleadosForma);
    this.tramite32615Store.setBimestreForma(DATOS.bimestreForma);
    this.tramite32615Store.setAcreditaCumplir(DATOS.acreditaCumplir);
    this.tramite32615Store.setFraccionVI(DATOS.fraccionVI);
    this.tramite32615Store.setCuartoParrafoDelCff(DATOS.cuartoParrafoDelCff);
    this.tramite32615Store.setNovenoParrafoDelCff(DATOS.novenoParrafoDelCff);
    this.tramite32615Store.setDigitalesEstanVigentes(DATOS.digitalesEstanVigentes);
    this.tramite32615Store.setUltimosDoceMeses(DATOS.ultimosDoceMeses);
    this.tramite32615Store.setPrestacionDeServicios(DATOS.prestacionDeServicios);
    this.tramite32615Store.setInstalacionesPrincipales(DATOS.instalacionesPrincipales);
    this.tramite32615Store.setMunicipioAlcaldia(DATOS.municipioAlcaldia);
    this.tramite32615Store.setTipoDeInstalcion(DATOS.tipoDeInstalcion);
    this.tramite32615Store.setProcesoProductivo(DATOS.procesoProductivo);
    this.tramite32615Store.setAcreditacionDelUso(DATOS.acreditacionDelUso);
    this.tramite32615Store.setPrefilMensajeria(DATOS.prefilMensajeria);
    this.tramite32615Store.setArticuloDelCff(DATOS.articuloDelCff);
    this.tramite32615Store.setExportadoresSectorial(DATOS.exportadoresSectorial);
    this.tramite32615Store.setArchivoNacionales(DATOS.archivoNacionales);
    this.tramite32615Store.setProveedores(DATOS.proveedores);
    this.tramite32615Store.setSolicitudDeCertificacion(DATOS.solicitudDeCertificacion);
    this.tramite32615Store.setControlInventarios(DATOS.controlInventarios);
    this.tramite32615Store.setNombreDelSistema(DATOS.nombreDelSistema);
    this.tramite32615Store.setLugarDeRadicacion(DATOS.lugarDeRadicacion);
    this.tramite32615Store.setPrevistas(DATOS.previstas);
    this.tramite32615Store.setDelCffLasReglas(DATOS.delCffLasReglas);
    this.tramite32615Store.setEnSeCaracter(DATOS.enSeCaracter);
    this.tramite32615Store.setObligadoTributar(DATOS.obligadoTributar);
    this.tramite32615Store.setNacionalidad(DATOS.nacionalidad);
    this.tramite32615Store.setConformidad(DATOS.conformidad);
    this.tramite32615Store.setEsquemaIntegralCertificacion(DATOS.esquemaIntegralCertificacion);
    this.tramite32615Store.setModificadasRevocadas(DATOS.modificadasRevocadas);
  }

  /**
   * Actualiza el estado del formulario de la solicitud en el store con la información proporcionada.
   * Cada propiedad del objeto recibido es asignada al store correspondiente.
   * 
   * @param DATOS Objeto con la estructura completa del estado del formulario del trámite 32615.
   */
  actualizarEstadoFormularioPerfiles(DATOS: Solicitud32615PerfilesState): void {
    this.tramite32615PerfilesStore.setActualizacion(DATOS.actualizacion);
    this.tramite32615PerfilesStore.setProcedimientoDocumentado(DATOS.procedimientoDocumentado);
    this.tramite32615PerfilesStore.setIndiqueNumero(DATOS.indiqueNumero);
    this.tramite32615PerfilesStore.setCargosFunciones(DATOS.cargosFunciones);
    this.tramite32615PerfilesStore.setCasoContratarse(DATOS.casoContratarse);
    this.tramite32615PerfilesStore.setCasoContar(DATOS.casoContar);
    this.tramite32615PerfilesStore.setDescribirProcedimiento(DATOS.describirProcedimiento);
    this.tramite32615PerfilesStore.setIndiqueMecanismos(DATOS.indiqueMecanismos);
    this.tramite32615PerfilesStore.setIndicarEmpleados(DATOS.indicarEmpleados);
    this.tramite32615PerfilesStore.setIndiqueIdentifica(DATOS.indiqueIdentifica);
    this.tramite32615PerfilesStore.setDescribaEmpresa(DATOS.describaEmpresa);
    this.tramite32615PerfilesStore.setIndiqueAsegura(DATOS.indiqueAsegura);
    this.tramite32615PerfilesStore.setProcedimientoParaControl(DATOS.procedimientoParaControl);
    this.tramite32615PerfilesStore.setSenaleRegistros(DATOS.senaleRegistros);
    this.tramite32615PerfilesStore.setSenaleQuien(DATOS.senaleQuien);
    this.tramite32615PerfilesStore.setDescribaRecepion(DATOS.describaRecepion);
    this.tramite32615PerfilesStore.setIndiqueEncargado(DATOS.indiqueEncargado);
    this.tramite32615PerfilesStore.setIndiqueIdentfica(DATOS.indiqueIdentfica);
    this.tramite32615PerfilesStore.setSenaleComo(DATOS.senaleComo);
    this.tramite32615PerfilesStore.setDescribaCaracteristicas(DATOS.describaCaracteristicas);
    this.tramite32615PerfilesStore.setSenaleAccion(DATOS.senaleAccion);
    this.tramite32615PerfilesStore.setIndiqueLleva(DATOS.indiqueLleva);
    this.tramite32615PerfilesStore.setDescribaProcedimiento(DATOS.describaProcedimiento);
    this.tramite32615PerfilesStore.setIndiqueSocios(DATOS.indiqueSocios);
    this.tramite32615PerfilesStore.setIndiqueForma(DATOS.indiqueForma);
    this.tramite32615PerfilesStore.setIndiqueExisten(DATOS.indiqueExisten);
    this.tramite32615PerfilesStore.setIndiqueCuenta(DATOS.indiqueCuenta);
    this.tramite32615PerfilesStore.setProcedimientoRealizar(DATOS.procedimientoRealizar);
    this.tramite32615PerfilesStore.setIndiquePeriodicidad(DATOS.indiquePeriodicidad);
    this.tramite32615PerfilesStore.setDescribaComo(DATOS.describaComo);
    this.tramite32615PerfilesStore.setComoAseguran(DATOS.comoAseguran);
    this.tramite32615PerfilesStore.setIndiqueFormatos(DATOS.indiqueFormatos);
    this.tramite32615PerfilesStore.setSenalarMedidas(DATOS.senalarMedidas);
    this.tramite32615PerfilesStore.setIndiqueAlmacenes(DATOS.indiqueAlmacenes);
    this.tramite32615PerfilesStore.setExpliqueBrevemente(DATOS.expliqueBrevemente);
    this.tramite32615PerfilesStore.setIndiqueCerciora(DATOS.indiqueCerciora);
    this.tramite32615PerfilesStore.setIndiqueEstos(DATOS.indiqueEstos);
    this.tramite32615PerfilesStore.setIndiquePertenecen(DATOS.indiquePertenecen);
    this.tramite32615PerfilesStore.setIndiqueResponsable(DATOS.indiqueResponsable);
    this.tramite32615PerfilesStore.setIndiqueTecnologia(DATOS.indiqueTecnologia);
    this.tramite32615PerfilesStore.setDescribirProcesamiento(DATOS.describirProcesamiento);
    this.tramite32615PerfilesStore.setDetalleComo(DATOS.detalleComo);
    this.tramite32615PerfilesStore.setIndiqueUtiliza(DATOS.indiqueUtiliza);
    this.tramite32615PerfilesStore.setDetalleValida(DATOS.detalleValida);
    this.tramite32615PerfilesStore.setComoNumero(DATOS.comoNumero);
    this.tramite32615PerfilesStore.setSenaleAsociados(DATOS.senaleAsociados);
    this.tramite32615PerfilesStore.setIndiqueMateriales(DATOS.indiqueMateriales);
    this.tramite32615PerfilesStore.setQueForma(DATOS.queForma);
    this.tramite32615PerfilesStore.setPersonalResponsable(DATOS.personalResponsable);
    this.tramite32615PerfilesStore.setIndiqueCuantas(DATOS.indiqueCuantas);
    this.tramite32615PerfilesStore.setIndiqueMonitoreadas(DATOS.indiqueMonitoreadas);
    this.tramite32615PerfilesStore.setDetalleExisten(DATOS.detalleExisten);
    this.tramite32615PerfilesStore.setDescribaAcceso(DATOS.describaAcceso);
    this.tramite32615PerfilesStore.setDescribirTipo(DATOS.describirTipo);
    this.tramite32615PerfilesStore.setDescribaAreas(DATOS.describaAreas);
    this.tramite32615PerfilesStore.setSenaleMismas(DATOS.senaleMismas);
    this.tramite32615PerfilesStore.setCasoNoContar(DATOS.casoNoContar);
    this.tramite32615PerfilesStore.setPeriodicidadVerifica(DATOS.periodicidadVerifica);
    this.tramite32615PerfilesStore.setIndiqueTareas(DATOS.indiqueTareas);
    this.tramite32615PerfilesStore.setDescribaManera(DATOS.describaManera);
    this.tramite32615PerfilesStore.setIndiqueSepara(DATOS.indiqueSepara);
    this.tramite32615PerfilesStore.setSenaleRestringido(DATOS.senaleRestringido);
    this.tramite32615PerfilesStore.setDescribaMonitoreo(DATOS.describaMonitoreo);
    this.tramite32615PerfilesStore.setResponsablesControlar(DATOS.responsablesControlar);
    this.tramite32615PerfilesStore.setEstacionamientos(DATOS.estacionamientos);
    this.tramite32615PerfilesStore.setLlevaEntrada(DATOS.llevaEntrada);
    this.tramite32615PerfilesStore.setPoliticasMecanismos(DATOS.politicasMecanismos);
    this.tramite32615PerfilesStore.setProcedimientoOperacion(DATOS.procedimientoOperacion);
    this.tramite32615PerfilesStore.setSenaleEncuentran(DATOS.senaleEncuentran);
    this.tramite32615PerfilesStore.setMencioneCuenta(DATOS.mencioneCuenta);
    this.tramite32615PerfilesStore.setQueManera(DATOS.queManera);
    this.tramite32615PerfilesStore.setDescribaContactar(DATOS.describaContactar);
    this.tramite32615PerfilesStore.setIndiqueOperativo(DATOS.indiqueOperativo);
    this.tramite32615PerfilesStore.setIndiqueAparatos(DATOS.indiqueAparatos);
    this.tramite32615PerfilesStore.setMantenimiento(DATOS.mantenimiento);
    this.tramite32615PerfilesStore.setPoliticasAparatos(DATOS.politicasAparatos);
    this.tramite32615PerfilesStore.setProgramaMantenimiento(DATOS.programaMantenimiento);
    this.tramite32615PerfilesStore.setIndiqueRespaldo(DATOS.indiqueRespaldo);
    this.tramite32615PerfilesStore.setDescribaAlarma(DATOS.describaAlarma);
    this.tramite32615PerfilesStore.setIndiqueUtilizan(DATOS.indiqueUtilizan);
    this.tramite32615PerfilesStore.setDescribaSistemas(DATOS.describaSistemas);
    this.tramite32615PerfilesStore.setIndicarCamaras(DATOS.indicarCamaras);
    this.tramite32615PerfilesStore.setMencioneInspeccion(DATOS.mencioneInspeccion);
    this.tramite32615PerfilesStore.setSenalarUbicacion(DATOS.senalarUbicacion);
    this.tramite32615PerfilesStore.setIndiqueHorarios(DATOS.indiqueHorarios);
    this.tramite32615PerfilesStore.setIndiqueRevisan(DATOS.indiqueRevisan);
    this.tramite32615PerfilesStore.setIndiqueDesignado(DATOS.indiqueDesignado);
    this.tramite32615PerfilesStore.setComoDocumentan(DATOS.comoDocumentan);
    this.tramite32615PerfilesStore.setIndiqueTiempo(DATOS.indiqueTiempo);
    this.tramite32615PerfilesStore.setContarPlanta(DATOS.contarPlanta);
    this.tramite32615PerfilesStore.setEstosSistemas(DATOS.estosSistemas);
    this.tramite32615PerfilesStore.setIndicarCircuito(DATOS.indicarCircuito);
    this.tramite32615PerfilesStore.setDescribaImplementado(DATOS.describaImplementado);
    this.tramite32615PerfilesStore.setFormaControlan(DATOS.formaControlan);
    this.tramite32615PerfilesStore.setIndiqueTodas(DATOS.indiqueTodas);
    this.tramite32615PerfilesStore.setIndiquePlanta(DATOS.indiquePlanta);
    this.tramite32615PerfilesStore.setCuentaDocumentado(DATOS.cuentaDocumentado);
    this.tramite32615PerfilesStore.setIndiquePuertas(DATOS.indiquePuertas);
    this.tramite32615PerfilesStore.setIndiqueCerrado(DATOS.indiqueCerrado);
    this.tramite32615PerfilesStore.setIndicarCircuitoCerrado(DATOS.indicarCircuitoCerrado);
    this.tramite32615PerfilesStore.setRegistroVisitantes(DATOS.registroVisitantes);
    this.tramite32615PerfilesStore.setCasoSocios(DATOS.casoSocios);
    this.tramite32615PerfilesStore.setEstosEmpresa(DATOS.estosEmpresa);
    this.tramite32615PerfilesStore.setComiteSeguridad(DATOS.comiteSeguridad);
    this.tramite32615PerfilesStore.setFuentesInformacion(DATOS.fuentesInformacion);
    this.tramite32615PerfilesStore.setPolitica(DATOS.politica);
    this.tramite32615PerfilesStore.setIndique(DATOS.indique);
    this.tramite32615PerfilesStore.setPeriodicidad(DATOS.periodicidad);
    this.tramite32615PerfilesStore.setPrograma(DATOS.programa);
    this.tramite32615PerfilesStore.setCapacitacion(DATOS.capacitacion);
    this.tramite32615PerfilesStore.setProcedimiento(DATOS.procedimiento);
    this.tramite32615PerfilesStore.setDescripcionProcedimiento(DATOS.descripcionProcedimiento);
    this.tramite32615PerfilesStore.setNombreProcedimiento(DATOS.nombreProcedimiento);
    this.tramite32615PerfilesStore.setProgramacionAuditoria(DATOS.programacionAuditoria);
    this.tramite32615PerfilesStore.setParticipantesAuditoria(DATOS.participantesAuditoria);
    this.tramite32615PerfilesStore.setEnfoqueAuditoria(DATOS.enfoqueAuditoria);
    this.tramite32615PerfilesStore.setProcesosAuditados(DATOS.procesosAuditados);
    this.tramite32615PerfilesStore.setRegistrosAuditoria(DATOS.registrosAuditoria);
    this.tramite32615PerfilesStore.setProgramacion(DATOS.programacion);
    this.tramite32615PerfilesStore.setRegistrosNombre(DATOS.registrosNombre);
    this.tramite32615PerfilesStore.setRegistrosEmpresa(DATOS.registrosEmpresa);
    this.tramite32615PerfilesStore.setPlanEmergencia(DATOS.planEmergencia);
    this.tramite32615PerfilesStore.setSituacionesContempladas(DATOS.situacionesContempladas);
    this.tramite32615PerfilesStore.setMecanismosContinuidad(DATOS.mecanismosContinuidad);
    this.tramite32615PerfilesStore.setSimulacrosDocumentacion(DATOS.simulacrosDocumentacion);
    this.tramite32615PerfilesStore.setResultados(DATOS.resultados);
    this.tramite32615PerfilesStore.setNaturaleza(DATOS.naturaleza);
    this.tramite32615PerfilesStore.setDetalleSuUbicacion(DATOS.detalleSuUbicacion);
    this.tramite32615PerfilesStore.setDescribaDetalleSuUbicacion(DATOS.describaDetalleSuUbicacion);
    this.tramite32615PerfilesStore.setDescribaMantenimiento(DATOS.describaMantenimiento);
    this.tramite32615PerfilesStore.setProcedimientoDocumentadoMencionar(DATOS.procedimientoDocumentadoMencionar);
    this.tramite32615PerfilesStore.setEncargado(DATOS.encargado);
    this.tramite32615PerfilesStore.setVerificarCorrecta(DATOS.verificarCorrecta);
    this.tramite32615PerfilesStore.setRestringido(DATOS.restringido);
    this.tramite32615PerfilesStore.setEntregasMensajeria(DATOS.entregasMensajeria);
    this.tramite32615PerfilesStore.setRecintoFiscalizado(DATOS.recintoFiscalizado);
  }

  /**
   * Actualiza el estado del formulario de la solicitud en el store con la información proporcionada.
   * Cada propiedad del objeto recibido es asignada al store correspondiente.
   * 
   * @param DATOS Objeto con la estructura completa del estado del formulario del trámite 32615.
   */
  actualizarEstadoFormularioPerfilesMensajeria(DATOS: Solicitud32615PerfilesMensajeriaState): void {
    this.tramite32615PerfilesMensajeriaStore.setDescribaProcedimiento(DATOS.describaProcedimiento);
    this.tramite32615PerfilesMensajeriaStore.setIndiqueLosCriterios(DATOS.indiqueLosCriterios);
    this.tramite32615PerfilesMensajeriaStore.setIndiqueLosMetodos(DATOS.indiqueLosMetodos);
    this.tramite32615PerfilesMensajeriaStore.setDescribaLosIndicadores(DATOS.describaLosIndicadores);
    this.tramite32615PerfilesMensajeriaStore.setComercioExterior(DATOS.comercioExterior);
    this.tramite32615PerfilesMensajeriaStore.setCandadosSeguridad(DATOS.candadosSeguridad);
    this.tramite32615PerfilesMensajeriaStore.setProveedorExterno(DATOS.proveedorExterno);
    this.tramite32615PerfilesMensajeriaStore.setSusceptibleContaminacion(DATOS.susceptibleContaminacion);
    this.tramite32615PerfilesMensajeriaStore.setEncuentrenVacios(DATOS.encuentrenVacios);
    this.tramite32615PerfilesMensajeriaStore.setSemirremolquesVacios(DATOS.semirremolquesVacios);
    this.tramite32615PerfilesMensajeriaStore.setUtilizarCandado(DATOS.utilizarCandado);
    this.tramite32615PerfilesMensajeriaStore.setSeguridadMismas(DATOS.seguridadMismas);
    this.tramite32615PerfilesMensajeriaStore.setDescribaContratacion(DATOS.describaContratacion);
    this.tramite32615PerfilesMensajeriaStore.setDocumentacionExigida(DATOS.documentacionExigida);
    this.tramite32615PerfilesMensajeriaStore.setExamenesSolicitados(DATOS.examenesSolicitados);
    this.tramite32615PerfilesMensajeriaStore.setConformeAnalisis(DATOS.conformeAnalisis);
    this.tramite32615PerfilesMensajeriaStore.setPeriodicidad(DATOS.periodicidad);
    this.tramite32615PerfilesMensajeriaStore.setConfidencialidad(DATOS.confidencialidad);
    this.tramite32615PerfilesMensajeriaStore.setContratacionPersonal(DATOS.contratacionPersonal);
    this.tramite32615PerfilesMensajeriaStore.setDescribaProcedimientoPersonal(DATOS.describaProcedimientoPersonal);
    this.tramite32615PerfilesMensajeriaStore.setSeguimientoProcedimiento(DATOS.seguimientoProcedimiento);
    this.tramite32615PerfilesMensajeriaStore.setIdentificaciones(DATOS.identificaciones);
    this.tramite32615PerfilesMensajeriaStore.setSistemasInformaticos(DATOS.sistemasInformaticos);
    this.tramite32615PerfilesMensajeriaStore.setProveedoresServicios(DATOS.proveedoresServicios);
    this.tramite32615PerfilesMensajeriaStore.setAdministracionPersonal(DATOS.administracionPersonal);
    this.tramite32615PerfilesMensajeriaStore.setExpliqueBrevemente(DATOS.expliqueBrevemente);
    this.tramite32615PerfilesMensajeriaStore.setEncuentranFuera(DATOS.encuentranFuera);
    this.tramite32615PerfilesMensajeriaStore.setActualizacionesSeguridad(DATOS.actualizacionesSeguridad);
    this.tramite32615PerfilesMensajeriaStore.setAccesoLosMismos(DATOS.accesoLosMismos);
    this.tramite32615PerfilesMensajeriaStore.setContinuidadNegocio(DATOS.continuidadNegocio);
    this.tramite32615PerfilesMensajeriaStore.setSemanaCorresponda(DATOS.semanaCorresponda);
    this.tramite32615PerfilesMensajeriaStore.setRecuperarInformacion(DATOS.recuperarInformacion);
    this.tramite32615PerfilesMensajeriaStore.setInformacionArchivada(DATOS.informacionArchivada);
    this.tramite32615PerfilesMensajeriaStore.setProcesoDatos(DATOS.procesoDatos);
    this.tramite32615PerfilesMensajeriaStore.setCopiasSeguridad(DATOS.copiasSeguridad);
    this.tramite32615PerfilesMensajeriaStore.setProteccionDeLaInformacion(DATOS.proteccionDeLaInformacion);
    this.tramite32615PerfilesMensajeriaStore.setPerdidaDeLaInformacion(DATOS.perdidaDeLaInformacion);
    this.tramite32615PerfilesMensajeriaStore.setControlanSistemas(DATOS.controlanSistemas);
    this.tramite32615PerfilesMensajeriaStore.setAccionesDelResto(DATOS.accionesDelResto);
    this.tramite32615PerfilesMensajeriaStore.setSistemasConfidenciales(DATOS.sistemasConfidenciales);
    this.tramite32615PerfilesMensajeriaStore.setProporcionaEsasContrasenas(DATOS.proporcionaEsasContrasenas);
    this.tramite32615PerfilesMensajeriaStore.setActualizacionesPeriodicas(DATOS.actualizacionesPeriodicas);
    this.tramite32615PerfilesMensajeriaStore.setFalsificadosLicencias(DATOS.falsificadosLicencias);
    this.tramite32615PerfilesMensajeriaStore.setProcesoDeImportacion(DATOS.procesoDeImportacion);
    this.tramite32615PerfilesMensajeriaStore.setTelecomunicaciones(DATOS.telecomunicaciones);
    this.tramite32615PerfilesMensajeriaStore.setSistemaComprometido(DATOS.sistemaComprometido);
    this.tramite32615PerfilesMensajeriaStore.setSeguridadDeLaTecnologia(DATOS.seguridadDeLaTecnologia);
    this.tramite32615PerfilesMensajeriaStore.setMediosTransporte(DATOS.mediosTransporte);
    this.tramite32615PerfilesMensajeriaStore.setEstaDifusion(DATOS.estaDifusion);
    this.tramite32615PerfilesMensajeriaStore.setEnunciativaLimitativa(DATOS.enunciativaLimitativa);
    this.tramite32615PerfilesMensajeriaStore.setProcedimientosEmpresa(DATOS.procedimientosEmpresa);
    this.tramite32615PerfilesMensajeriaStore.setMediosDeTransporte(DATOS.mediosDeTransporte);
    this.tramite32615PerfilesMensajeriaStore.setRelacionadosSeguridad(DATOS.relacionadosSeguridad);
    this.tramite32615PerfilesMensajeriaStore.setReportarIncidentes(DATOS.reportarIncidentes);
    this.tramite32615PerfilesMensajeriaStore.setActividadesSospechosas(DATOS.actividadesSospechosas);
    this.tramite32615PerfilesMensajeriaStore.setBrevementeSonsiste(DATOS.brevementeSonsiste);
    this.tramite32615PerfilesMensajeriaStore.setIncidenteSeguridad(DATOS.incidenteSeguridad);
    this.tramite32615PerfilesMensajeriaStore.setCaboInvestigacion(DATOS.caboInvestigacion);
    this.tramite32615PerfilesMensajeriaStore.setOperacionCaboInvestigacion(DATOS.operacionCaboInvestigacion);
    this.tramite32615PerfilesMensajeriaStore.setDomicilio(DATOS.domicilio);
    this.tramite32615PerfilesMensajeriaStore.setAntiguedad(DATOS.antiguedad);
    this.tramite32615PerfilesMensajeriaStore.setActividad(DATOS.actividad);
    this.tramite32615PerfilesMensajeriaStore.setProductos(DATOS.productos);
    this.tramite32615PerfilesMensajeriaStore.setEmbarquesExp(DATOS.embarquesExp);
    this.tramite32615PerfilesMensajeriaStore.setEmbarquesImp(DATOS.embarquesImp);
    this.tramite32615PerfilesMensajeriaStore.setEmpleados(DATOS.empleados);
    this.tramite32615PerfilesMensajeriaStore.setSuperficie(DATOS.superficie);
    this.tramite32615PerfilesMensajeriaStore.setNombre(DATOS.nombre);
    this.tramite32615PerfilesMensajeriaStore.setCategoria(DATOS.categoria);
    this.tramite32615PerfilesMensajeriaStore.setVigencia(DATOS.vigencia);
    this.tramite32615PerfilesMensajeriaStore.setNombre2(DATOS.nombre2);
    this.tramite32615PerfilesMensajeriaStore.setCategoria2(DATOS.categoria2);
    this.tramite32615PerfilesMensajeriaStore.setVigenciaDos(DATOS.vigencia2);
    this.tramite32615PerfilesMensajeriaStore.setNombre3(DATOS.nombre3);
    this.tramite32615PerfilesMensajeriaStore.setCategoria3(DATOS.categoria3);
    this.tramite32615PerfilesMensajeriaStore.setVigenciaTres(DATOS.vigencia3);
    this.tramite32615PerfilesMensajeriaStore.setPip(DATOS.pip);
    this.tramite32615PerfilesMensajeriaStore.setOea(DATOS.oea);
    this.tramite32615PerfilesMensajeriaStore.setNumeroRegistro(DATOS.numeroRegistro);
    this.tramite32615PerfilesMensajeriaStore.setNumeroRegistroOEA(DATOS.numeroRegistroOEA);
    this.tramite32615PerfilesMensajeriaStore.setNumeroPrograma(DATOS.numeroPrograma);
    this.tramite32615PerfilesMensajeriaStore.setOtrosProgramas(DATOS.otrosProgramas);
    this.tramite32615PerfilesMensajeriaStore.setNumeroProgramaOtros(DATOS.numeroProgramaOtros);
    this.tramite32615PerfilesMensajeriaStore.setNumeroRegistroOtros(DATOS.numeroRegistroOtros);
    this.tramite32615PerfilesMensajeriaStore.setFechaVigenciaProfile(DATOS.fechaVigenciaProfile);
    this.tramite32615PerfilesMensajeriaStore.setEnliste(DATOS.enliste);
    this.tramite32615PerfilesMensajeriaStore.setBreveDescripcion(DATOS.breveDescripcion);
    this.tramite32615PerfilesMensajeriaStore.setBrevementePrograma(DATOS.brevementePrograma);
    this.tramite32615PerfilesMensajeriaStore.setPeriodosEspecificos(DATOS.periodosEspecificos);
    this.tramite32615PerfilesMensajeriaStore.setPeriodicidadCapacitaciones(DATOS.periodicidadCapacitaciones);
    this.tramite32615PerfilesMensajeriaStore.setDocumentacionCapacitaciones(DATOS.documentacionCapacitaciones);
    this.tramite32615PerfilesMensajeriaStore.setParticipacionEmpleados(DATOS.participacionEmpleados);

  }

  /**
   * Actualiza el estado del formulario de la solicitud en el store con la información proporcionada.
   * Cada propiedad del objeto recibido es asignada al store correspondiente.
   * 
   * @param DATOS Objeto con la estructura completa del estado del formulario del trámite 32615.
   */
  actualizarEstadoFormularioMensajeria(DATOS: Solicitud32615MensajeriaState): void {
    this.tramite32615MensajeriaStore.setComercioExterior(DATOS.comercioExterior);
    this.tramite32615MensajeriaStore.setRecintoFiscalizado(DATOS.recintoFiscalizado);
    this.tramite32615MensajeriaStore.setCancelacionRecintoFiscalizado(DATOS.cancelacionRecintoFiscalizado);
    this.tramite32615MensajeriaStore.setPerfilRecintoFiscalizado(DATOS.perfilRecintoFiscalizado);
    this.tramite32615MensajeriaStore.setNumeroDeOficio(DATOS.numeroDeOficio);
    this.tramite32615MensajeriaStore.setFechaDePresentacion(DATOS.fechaDePresentacion);
    this.tramite32615MensajeriaStore.setMensajeriaPaqueteria(DATOS.mensajeriaPaqueteria);
    this.tramite32615MensajeriaStore.setLaSolicitanteInterna(DATOS.laSolicitanteInterna);
    this.tramite32615MensajeriaStore.setSubsidiaria(DATOS.subsidiaria);
    this.tramite32615MensajeriaStore.setFiliales(DATOS.filiales);
    this.tramite32615MensajeriaStore.setMatrices(DATOS.matrices);
    this.tramite32615MensajeriaStore.setAeronauticaCivil(DATOS.aeronauticaCivil);
    this.tramite32615MensajeriaStore.setConformidadArticulos(DATOS.conformidadArticulos);
    this.tramite32615MensajeriaStore.setRfc(DATOS.rfc);
    this.tramite32615MensajeriaStore.setDocumentosMercancias(DATOS.documentosMercancias);
    this.tramite32615MensajeriaStore.setRfcLasEmpresas(DATOS.rfcLasEmpresas);
    this.tramite32615MensajeriaStore.setGeneralAeronauticaCivil(DATOS.generalAeronauticaCivil);
    this.tramite32615MensajeriaStore.setExteriorConformidad(DATOS.exteriorConformidad);
    this.tramite32615MensajeriaStore.setReconocimientoMutuo(DATOS.reconocimientoMutuo);
    this.tramite32615MensajeriaStore.setRfcListado(DATOS.rfcListado);
    this.tramite32615MensajeriaStore.setNombreRazonSocialListado(DATOS.nombreRazonSocialListado);
    this.tramite32615MensajeriaStore.setDireccionFiscalListado(DATOS.direccionFiscalListado);
    this.tramite32615MensajeriaStore.setPaginaElectronicaListado(DATOS.paginaElectronicaListado);
    this.tramite32615MensajeriaStore.setCorreoElectronicaListado(DATOS.correoElectronicaListado);
    this.tramite32615MensajeriaStore.setTelefonoContactoListado(DATOS.telefonoContactoListado);
    this.tramite32615MensajeriaStore.setInformacionProporcionada(DATOS.informacionProporcionada);
    this.tramite32615MensajeriaStore.setClaveReferencia(DATOS.claveReferencia);
    this.tramite32615MensajeriaStore.setNumeroOperacion(DATOS.numeroOperacion);
    this.tramite32615MensajeriaStore.setCadenaDependencia(DATOS.cadenaDependencia);
    this.tramite32615MensajeriaStore.setBanco(DATOS.banco);
    this.tramite32615MensajeriaStore.setLlavePago(DATOS.llavePago);
    this.tramite32615MensajeriaStore.setFechaFactura(DATOS.fechaFactura);
    this.tramite32615MensajeriaStore.setImportePago(DATOS.importePago);
    this.tramite32615MensajeriaStore.setFechaInicioComercioExterior(DATOS.fechaInicioComercioExterior);
    this.tramite32615MensajeriaStore.setFechaVigencia(DATOS.fechaVigencia);
    this.tramite32615MensajeriaStore.setNumeroAutorizacion(DATOS.numeroAutorizacion);

  }

   /**
   * Actualiza el estado del formulario de la solicitud en el store con la información proporcionada.
   * Cada propiedad del objeto recibido es asignada al store correspondiente.
   * 
   * @param DATOS Objeto con la estructura completa del estado del formulario del trámite 32615.
   */
  actualizarEstadoFormularioTerceros(DATOS: Solicitud32615TercerosState): void {
    this.tramite32615TercerosStore.setResigtro(DATOS.resigtro);
    this.tramite32615TercerosStore.setTelefono(DATOS.telefono);
    this.tramite32615TercerosStore.setCorreo(DATOS.correo);
    this.tramite32615TercerosStore.setResigtroFedral(DATOS.resigtroFedral);
    this.tramite32615TercerosStore.setCargo(DATOS.cargo);
    this.tramite32615TercerosStore.setTelefonoEnlace(DATOS.telefonoEnlace);
    this.tramite32615TercerosStore.setCorreoEnlace(DATOS.correoEnlace);
    this.tramite32615TercerosStore.setSuplente(DATOS.suplente);

  }

  /**
   * Obtiene los datos precargados desde un archivo JSON relacionado con el registro de toma de muestras de mercancías.
   * Este archivo contiene información que se puede utilizar para precargar el estado del formulario.
   * 
   * @returns Observable con la estructura del estado de la solicitud.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud32615State> {
    return this.http.get<Solicitud32615State>('assets/json/32615/registro_toma_muestras_mercancias.json');
  }

  /**
   * Obtiene los datos precargados desde un archivo JSON relacionado con el registro de toma de muestras de mercancías.
   * Este archivo contiene información que se puede utilizar para precargar el estado del formulario.
   * 
   * @returns Observable con la estructura del estado de la solicitud.
   */
  getRegistroTomaMuestrasMercanciasDataPerfiles(): Observable<Solicitud32615PerfilesState> {
    return this.http.get<Solicitud32615PerfilesState>('assets/json/32615/registro_toma_muestras_mercancias_perfiles.json');
  }

  /**
   * Obtiene los datos precargados desde un archivo JSON relacionado con el registro de toma de muestras de mercancías.
   * Este archivo contiene información que se puede utilizar para precargar el estado del formulario.
   * 
   * @returns Observable con la estructura del estado de la solicitud.
   */
  getRegistroTomaMuestrasMercanciasDataPerfilesMensajeria(): Observable<Solicitud32615PerfilesMensajeriaState> {
    return this.http.get<Solicitud32615PerfilesMensajeriaState>('assets/json/32615/registro_toma_muestras_mercancias_perfiles_mensajeria.json');
  }

  /**
   * Obtiene los datos precargados desde un archivo JSON relacionado con el registro de toma de muestras de mercancías.
   * Este archivo contiene información que se puede utilizar para precargar el estado del formulario.
   * 
   * @returns Observable con la estructura del estado de la solicitud.
   */
  getRegistroTomaMuestrasMercanciasDataMensajeria(): Observable<Solicitud32615MensajeriaState> {
    return this.http.get<Solicitud32615MensajeriaState>('assets/json/32615/registro_toma_muestras_mercancias_mensajeria.json');
  }

  /**
   * Obtiene los datos precargados desde un archivo JSON relacionado con el registro de toma de muestras de mercancías.
   * Este archivo contiene información que se puede utilizar para precargar el estado del formulario.
   * 
   * @returns Observable con la estructura del estado de la solicitud.
   */
  getRegistroTomaMuestrasMercanciasDataTerceros(): Observable<Solicitud32615TercerosState> {
    return this.http.get<Solicitud32615TercerosState>('assets/json/32615/registro_toma_muestras_mercancias_terceros.json');
  }

}
