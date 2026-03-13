import { InstalacionesPrincipalesRespuestaTabla, PersonaRespuestaTabla, RespuestaTabla } from '@libs/shared/data-access-user/src/core/models/32614/dato-comunes.model';
import { Solicitud32614MensajeriaState, Tramite32614MensajeriaStore } from '../estados/tramites/tramite32614_mensajeria.store';
import { Solicitud32614PerfilesMensajeriaState, Tramite32614PerfilesMensajeriaStore } from '../estados/tramites/tramite32614_perfilesMensajeria.store';
import { Solicitud32614PerfilesState, Tramite32614PerfilesStore } from '../estados/tramites/tramite32614_perfiles.store';
import { Solicitud32614State, Tramite32614Store } from '../estados/tramites/tramite32614.store';
import { Solicitud32614TercerosState, Tramite32614TercerosStore } from '../estados/tramites/tramite32614_terceros.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Service responsible for invoking and obtaining the necessary data
 * for the registration request of procedure 32614.
 * It handles consuming local JSON files that simulate responses
 * from different catalogs or entities related to the procedure.
 *
 * @export
 * @class SolicitudDeRegistroInvocarService
 */
@Injectable({
  providedIn: 'root'
})
export class SolicitudDeRegistroInvocarService {

  /**
   * Creates an instance of the invocation service.
   *
   * @param {HttpClient} http - HTTP client used to make requests to local JSON resources.
   * @memberof SolicitudDeRegistroInvocarService
   */
  constructor(private http: HttpClient,private tramite32614MensajeriaStore:Tramite32614MensajeriaStore, private tramite32614PerfilesStore:Tramite32614PerfilesStore, private tramite32614PerfilesMensajeriaStore:Tramite32614PerfilesMensajeriaStore, private tramite32614TercerosStore:Tramite32614TercerosStore, private tramite32614Store:Tramite32614Store ) {
  }

  /**
   * Gets the merchandise table data.
   * Loads a JSON file containing simulated information to populate the merchandise table.
   *
   * @returns {Observable<RespuestaTabla>} An observable with the table data.
   * @memberof SolicitudDeRegistroInvocarService
   */
  obtenerTablaDatos(): Observable<RespuestaTabla> {
    return this.http.get<RespuestaTabla>('assets/json/32614/mercancias-tabla.json');
  }

  /**
   * Gets the main installations table data.
   * Uses a JSON resource to simulate the response from a main installations table.
   *
   * @returns {Observable<InstalacionesPrincipalesRespuestaTabla>} An observable with the main installations table data.
   * @memberof SolicitudDeRegistroInvocarService
   */
  obtenerInstalacionesPrincipalesTablaDatos(): Observable<InstalacionesPrincipalesRespuestaTabla> {
    return this.http.get<InstalacionesPrincipalesRespuestaTabla>('assets/json/32614/instalacionesPrincipales-tabla.json');
  }

  /**
   * Gets the person table data.
   * Makes a request to a local resource in JSON format containing data related to persons.
   *
   * @returns {Observable<PersonaRespuestaTabla>} An observable with the person table data.
   * @memberof SolicitudDeRegistroInvocarService
   */
  obtenerPersonaTablaDatos(): Observable<PersonaRespuestaTabla> {
    return this.http.get<PersonaRespuestaTabla>('assets/json/32614/personapara.json');
  }


  /**
 * Gets the merchandise sampling registration data.
 *
 * Makes an HTTP GET request to retrieve the information stored in the JSON file
 * corresponding to merchandise sampling for procedure 32614.
 *
 * @returns An observable that emits the 32614 request state (`Solicitud32614State`).
 */
getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud32614MensajeriaState> {
    return this.http.get<Solicitud32614MensajeriaState>('assets/json/32614/tramite32614_mensajeria.json');
  }

  /**
   * Gets the profiles registration data.
   * 
   * @returns {Observable<Solicitud32614PerfilesState>} An observable with the profiles data.
   */
  getRegistroperfilessData(): Observable<Solicitud32614PerfilesState> {
    return this.http.get<Solicitud32614PerfilesState>('assets/json/32614/tramite32614_perfiles.json');
  }

  /**
   * Gets the profiles messaging registration data.
   * 
   * @returns {Observable<Solicitud32614PerfilesMensajeriaState>} An observable with the profiles messaging data.
   */
  getRegistroTperfilesMensajeriassData(): Observable<Solicitud32614PerfilesMensajeriaState> {
    return this.http.get<Solicitud32614PerfilesMensajeriaState>('assets/json/32614/tramite32614_permensajeria.json');
  }

  /**
   * Gets the third parties registration data.
   * 
   * @returns {Observable<Solicitud32614TercerosState>} An observable with the third parties data.
   */
  getRegistroTotercerosData(): Observable<Solicitud32614TercerosState> {
    return this.http.get<Solicitud32614TercerosState>('assets/json/32614/tramite32614_terceros.json');
  }

  /**
   * Gets the procedure 32614 registration data.
   * 
   * @returns {Observable<Solicitud32614State>} An observable with the procedure 32614 data.
   */
  getRegistroTotramite32614Data(): Observable<Solicitud32614State> {
    return this.http.get<Solicitud32614State>('assets/json/32614/tramite32614.json');
  }


  /**
   * Sets the merchandise sampling registration data.
   * Updates the messaging store with the provided data, handling both required and optional fields.
   * 
   * @param {Solicitud32614MensajeriaState} datos - The messaging data to set in the store.
   */
  setRegistroTomaMuestrasMercanciasData(datos: Solicitud32614MensajeriaState): void {
    this.setRequiredMensajeriaFields(datos);
    
    this.setOptionalMensajeriaFields(datos);
  }

  /**
   * Sets the required messaging fields in the store.
   * 
   * @param {Solicitud32614MensajeriaState} datos - The messaging data containing required fields.
   */
  private setRequiredMensajeriaFields(datos: Solicitud32614MensajeriaState): void {
    this.tramite32614MensajeriaStore.setLaSolicitante(datos.laSolicitante);
    this.tramite32614MensajeriaStore.setSusFiliales(datos.susFiliales);
    this.tramite32614MensajeriaStore.setLasEmpresas(datos.lasEmpresas);
    this.tramite32614MensajeriaStore.setFinDeVigencia(datos.finDeVigencia);
    this.tramite32614MensajeriaStore.setNumeroDeOficio(datos.numeroDeOficio);
    this.tramite32614MensajeriaStore.setFechaDePresentacion(datos.fechaDePresentacion);
    this.tramite32614MensajeriaStore.setMensajeriaPaqueteria(datos.mensajeriaPaqueteria);
    this.tramite32614MensajeriaStore.setLaSolicitanteInterna(datos.laSolicitanteInterna);
  }

  /**
   * Sets the optional messaging fields in the store by delegating to specific field groups.
   * 
   * @param {Solicitud32614MensajeriaState} datos - The messaging data containing optional fields.
   */
  private setOptionalMensajeriaFields(datos: Solicitud32614MensajeriaState): void {
    this.setBasicOptionalFields(datos);
    this.setContactOptionalFields(datos);
    this.setPaymentOptionalFields(datos);
  }

  /**
   * Sets the basic optional fields in the messaging store.
   * 
   * @param {Solicitud32614MensajeriaState} datos - The messaging data containing basic optional fields.
   */
  private setBasicOptionalFields(datos: Solicitud32614MensajeriaState): void {
    this.tramite32614MensajeriaStore.setSubsidiaria(datos.subsidiaria ?? '');
    this.tramite32614MensajeriaStore.setFiliales(datos.filiales ?? '');
    this.tramite32614MensajeriaStore.setMatrices(datos.matrices ?? '');
    this.tramite32614MensajeriaStore.setAeronauticaCivil(datos.aeronauticaCivil ?? '');
    this.tramite32614MensajeriaStore.setConformidadArticulos(datos.conformidadArticulos ?? '');
    this.tramite32614MensajeriaStore.setRfc(datos.rfc ?? '');
    this.tramite32614MensajeriaStore.setDocumentosMercancias(datos.documentosMercancias ?? '');
    this.tramite32614MensajeriaStore.setRfcLasEmpresas(datos.rfcLasEmpresas ?? '');
    this.tramite32614MensajeriaStore.setGeneralAeronauticaCivil(datos.generalAeronauticaCivil ?? '');
  }

  /**
   * Sets the contact-related optional fields in the messaging store.
   * 
   * @param {Solicitud32614MensajeriaState} datos - The messaging data containing contact optional fields.
   */
  private setContactOptionalFields(datos: Solicitud32614MensajeriaState): void {
    this.tramite32614MensajeriaStore.setExteriorConformidad(datos.exteriorConformidad ?? '');
    this.tramite32614MensajeriaStore.setReconocimientoMutuo(datos.reconocimientoMutuo ?? '');
    this.tramite32614MensajeriaStore.setRfcListado(datos.rfcListado ?? '');
    this.tramite32614MensajeriaStore.setNombreRazonSocialListado(datos.nombreRazonSocialListado ?? '');
    this.tramite32614MensajeriaStore.setDireccionFiscalListado(datos.direccionFiscalListado ?? '');
    this.tramite32614MensajeriaStore.setPaginaElectronicaListado(datos.paginaElectronicaListado ?? '');
    this.tramite32614MensajeriaStore.setCorreoElectronicaListado(datos.correoElectronicaListado ?? '');
    this.tramite32614MensajeriaStore.setTelefonoContactoListado(datos.telefonoContactoListado ?? '');
    this.tramite32614MensajeriaStore.setInformacionProporcionada(datos.informacionProporcionada ?? '');
  }

  /**
   * Sets the payment-related optional fields in the messaging store.
   * 
   * @param {Solicitud32614MensajeriaState} datos - The messaging data containing payment optional fields.
   */
  public setPaymentOptionalFields(datos: Solicitud32614MensajeriaState): void {
    this.tramite32614MensajeriaStore.setClaveReferencia(datos.claveReferencia ?? '');
    this.tramite32614MensajeriaStore.setNumeroOperacion(datos.numeroOperacion ?? '');
    this.tramite32614MensajeriaStore.setCadenaDependencia(datos.cadenaDependencia ?? '');
    this.tramite32614MensajeriaStore.setBanco(datos.banco ?? '');
    this.tramite32614MensajeriaStore.setLlavePago(datos.llavePago ?? '');
    this.tramite32614MensajeriaStore.setFechaFactura(datos.fechaFactura ?? '');
    this.tramite32614MensajeriaStore.setImportePago(datos.importePago ?? '');
  }


/**
 * Updates all profile fields in the profiles store.
 * Sets all the profile-related data fields in the corresponding store.
 * 
 * @param {Solicitud32614PerfilesState} datos - The profile data to update in the store.
 */
actualizarTodosCampos(datos: Solicitud32614PerfilesState): void {
  this.tramite32614PerfilesStore.setProcedimientoDocumentado(datos.procedimientoDocumentado);
  this.tramite32614PerfilesStore.setIndiqueNumero(datos.indiqueNumero);
  this.tramite32614PerfilesStore.setCargosFunciones(datos.cargosFunciones);
  this.tramite32614PerfilesStore.setCasoContratarse(datos.casoContratarse);
  this.tramite32614PerfilesStore.setCasoContar(datos.casoContar);
  this.tramite32614PerfilesStore.setDescribirProcedimiento(datos.describirProcedimiento);
  this.tramite32614PerfilesStore.setIndiqueMecanismos(datos.indiqueMecanismos);
  this.tramite32614PerfilesStore.setIndicarEmpleados(datos.indicarEmpleados);
  this.tramite32614PerfilesStore.setIndiqueIdentifica(datos.indiqueIdentifica);
  this.tramite32614PerfilesStore.setDescribaEmpresa(datos.describaEmpresa);
  this.tramite32614PerfilesStore.setIndiqueAsegura(datos.indiqueAsegura);
  this.tramite32614PerfilesStore.setProcedimientoParaControl(datos.procedimientoParaControl);
  this.tramite32614PerfilesStore.setSenaleRegistros(datos.senaleRegistros);
  this.tramite32614PerfilesStore.setSenaleQuien(datos.senaleQuien);
  this.tramite32614PerfilesStore.setDescribaRecepion(datos.describaRecepion);
  this.tramite32614PerfilesStore.setIndiqueEncargado(datos.indiqueEncargado);
  this.tramite32614PerfilesStore.setIndiqueIdentfica(datos.indiqueIdentfica);
  this.tramite32614PerfilesStore.setSenaleComo(datos.senaleComo);
  this.tramite32614PerfilesStore.setDescribaCaracteristicas(datos.describaCaracteristicas);
  this.tramite32614PerfilesStore.setSenaleAccion(datos.senaleAccion);
  this.tramite32614PerfilesStore.setIndiqueLleva(datos.indiqueLleva);
  this.tramite32614PerfilesStore.setDescribaProcedimiento(datos.describaProcedimiento);
  this.tramite32614PerfilesStore.setIndiqueSocios(datos.indiqueSocios);
  this.tramite32614PerfilesStore.setIndiqueForma(datos.indiqueForma);
  this.tramite32614PerfilesStore.setIndiqueExisten(datos.indiqueExisten);
  this.tramite32614PerfilesStore.setIndiqueCuenta(datos.indiqueCuenta);
  this.tramite32614PerfilesStore.setProcedimientoRealizar(datos.procedimientoRealizar);
  this.tramite32614PerfilesStore.setIndiquePeriodicidad(datos.indiquePeriodicidad);
  this.tramite32614PerfilesStore.setDescribaComo(datos.describaComo);
  this.tramite32614PerfilesStore.setComoAseguran(datos.comoAseguran);
  this.tramite32614PerfilesStore.setIndiqueFormatos(datos.indiqueFormatos);
  this.tramite32614PerfilesStore.setSenalarMedidas(datos.senalarMedidas);
  this.tramite32614PerfilesStore.setIndiqueAlmacenes(datos.indiqueAlmacenes);
  this.tramite32614PerfilesStore.setExpliqueBrevemente(datos.expliqueBrevemente);
  this.tramite32614PerfilesStore.setIndiqueCerciora(datos.indiqueCerciora);
  this.tramite32614PerfilesStore.setIndiqueEstos(datos.indiqueEstos);
  this.tramite32614PerfilesStore.setIndiquePertenecen(datos.indiquePertenecen);
  this.tramite32614PerfilesStore.setIndiqueResponsable(datos.indiqueResponsable);
  this.tramite32614PerfilesStore.setIndiqueTecnologia(datos.indiqueTecnologia);
  this.tramite32614PerfilesStore.setDescribirProcesamiento(datos.describirProcesamiento);
  this.tramite32614PerfilesStore.setDetalleComo(datos.detalleComo);
  this.tramite32614PerfilesStore.setIndiqueUtiliza(datos.indiqueUtiliza);
  this.tramite32614PerfilesStore.setDetalleValida(datos.detalleValida);
  this.tramite32614PerfilesStore.setComoNumero(datos.comoNumero);
  this.tramite32614PerfilesStore.setSenaleAsociados(datos.senaleAsociados);
  this.tramite32614PerfilesStore.setIndiqueMateriales(datos.indiqueMateriales);
  this.tramite32614PerfilesStore.setQueForma(datos.queForma);
  this.tramite32614PerfilesStore.setPersonalResponsable(datos.personalResponsable);
  this.tramite32614PerfilesStore.setIndiqueCuantas(datos.indiqueCuantas);
  this.tramite32614PerfilesStore.setIndiqueMonitoreadas(datos.indiqueMonitoreadas);
  this.tramite32614PerfilesStore.setDetalleExisten(datos.detalleExisten);
  this.tramite32614PerfilesStore.setDescribaAcceso(datos.describaAcceso);
  this.tramite32614PerfilesStore.setDescribirTipo(datos.describirTipo);
  this.tramite32614PerfilesStore.setDescribaAreas(datos.describaAreas);
  this.tramite32614PerfilesStore.setSenaleMismas(datos.senaleMismas);
  this.tramite32614PerfilesStore.setCasoNoContar(datos.casoNoContar);
  this.tramite32614PerfilesStore.setPeriodicidadVerifica(datos.periodicidadVerifica);
  this.tramite32614PerfilesStore.setIndiqueTareas(datos.indiqueTareas);
  this.tramite32614PerfilesStore.setDescribaManera(datos.describaManera);
  this.tramite32614PerfilesStore.setIndiqueSepara(datos.indiqueSepara);
  this.tramite32614PerfilesStore.setSenaleRestringido(datos.senaleRestringido);
  this.tramite32614PerfilesStore.setDescribaMonitoreo(datos.describaMonitoreo);
  this.tramite32614PerfilesStore.setResponsablesControlar(datos.responsablesControlar);
  this.tramite32614PerfilesStore.setEstacionamientos(datos.estacionamientos);
  this.tramite32614PerfilesStore.setLlevaEntrada(datos.llevaEntrada);
  this.tramite32614PerfilesStore.setPoliticasMecanismos(datos.politicasMecanismos);
  this.tramite32614PerfilesStore.setProcedimientoOperacion(datos.procedimientoOperacion);
  this.tramite32614PerfilesStore.setSenaleEncuentran(datos.senaleEncuentran);
  this.tramite32614PerfilesStore.setMencioneCuenta(datos.mencioneCuenta);
  this.tramite32614PerfilesStore.setQueManera(datos.queManera);
  this.tramite32614PerfilesStore.setDescribaContactar(datos.describaContactar);
  this.tramite32614PerfilesStore.setIndiqueOperativo(datos.indiqueOperativo);
  this.tramite32614PerfilesStore.setIndiqueAparatos(datos.indiqueAparatos);
  this.tramite32614PerfilesStore.setMantenimiento(datos.mantenimiento);
  this.tramite32614PerfilesStore.setPoliticasAparatos(datos.politicasAparatos);
  this.tramite32614PerfilesStore.setProgramaMantenimiento(datos.programaMantenimiento);
  this.tramite32614PerfilesStore.setIndiqueRespaldo(datos.indiqueRespaldo);
  this.tramite32614PerfilesStore.setDescribaAlarma(datos.describaAlarma);
  this.tramite32614PerfilesStore.setIndiqueUtilizan(datos.indiqueUtilizan);
  this.tramite32614PerfilesStore.setDescribaSistemas(datos.describaSistemas);
  this.tramite32614PerfilesStore.setIndicarCamaras(datos.indicarCamaras);
  this.tramite32614PerfilesStore.setMencioneInspeccion(datos.mencioneInspeccion);
  this.tramite32614PerfilesStore.setSenalarUbicacion(datos.senalarUbicacion);
  this.tramite32614PerfilesStore.setIndiqueHorarios(datos.indiqueHorarios);
  this.tramite32614PerfilesStore.setIndiqueRevisan(datos.indiqueRevisan);
  this.tramite32614PerfilesStore.setIndiqueDesignado(datos.indiqueDesignado);
  this.tramite32614PerfilesStore.setComoDocumentan(datos.comoDocumentan);
  this.tramite32614PerfilesStore.setIndiqueTiempo(datos.indiqueTiempo);
  this.tramite32614PerfilesStore.setContarPlanta(datos.contarPlanta);
  this.tramite32614PerfilesStore.setEstosSistemas(datos.estosSistemas);
  this.tramite32614PerfilesStore.setIndicarCircuito(datos.indicarCircuito);
  this.tramite32614PerfilesStore.setDescribaImplementado(datos.describaImplementado);
  this.tramite32614PerfilesStore.setFormaControlan(datos.formaControlan);
  this.tramite32614PerfilesStore.setIndiqueTodas(datos.indiqueTodas);
  this.tramite32614PerfilesStore.setIndiquePlanta(datos.indiquePlanta);
  this.tramite32614PerfilesStore.setCuentaDocumentado(datos.cuentaDocumentado);
  this.tramite32614PerfilesStore.setIndiquePuertas(datos.indiquePuertas);
  this.tramite32614PerfilesStore.setIndiqueCerrado(datos.indiqueCerrado);
  this.tramite32614PerfilesStore.setIndicarCircuitoCerrado(datos.indicarCircuitoCerrado);
  this.tramite32614PerfilesStore.setRegistroVisitantes(datos.registroVisitantes);
  this.tramite32614PerfilesStore.setCasoSocios(datos.casoSocios);
  this.tramite32614PerfilesStore.setEstosEmpresa(datos.estosEmpresa);
  this.tramite32614PerfilesStore.setComiteSeguridad(datos.comiteSeguridad);
  this.tramite32614PerfilesStore.setFuentesInformacion(datos.fuentesInformacion);
  this.tramite32614PerfilesStore.setPolitica(datos.politica);
  this.tramite32614PerfilesStore.setIndique(datos.indique);
  this.tramite32614PerfilesStore.setPeriodicidad(datos.periodicidad);
  this.tramite32614PerfilesStore.setPrograma(datos.programa);
  this.tramite32614PerfilesStore.setCapacitacion(datos.capacitacion);
  this.tramite32614PerfilesStore.setProcedimiento(datos.procedimiento);
  this.tramite32614PerfilesStore.setDescripcionProcedimiento(datos.descripcionProcedimiento);
  this.tramite32614PerfilesStore.setNombreProcedimiento(datos.nombreProcedimiento);
  this.tramite32614PerfilesStore.setProgramacionAuditoria(datos.programacionAuditoria);
  this.tramite32614PerfilesStore.setParticipantesAuditoria(datos.participantesAuditoria);
  this.tramite32614PerfilesStore.setEnfoqueAuditoria(datos.enfoqueAuditoria);
  this.tramite32614PerfilesStore.setProcesosAuditados(datos.procesosAuditados);
  this.tramite32614PerfilesStore.setRegistrosAuditoria(datos.registrosAuditoria);
  this.tramite32614PerfilesStore.setProgramacion(datos.programacion);
  this.tramite32614PerfilesStore.setRegistrosNombre(datos.registrosNombre);
  this.tramite32614PerfilesStore.setRegistrosEmpresa(datos.registrosEmpresa);
  this.tramite32614PerfilesStore.setPlanEmergencia(datos.planEmergencia);
  this.tramite32614PerfilesStore.setSituacionesContempladas(datos.situacionesContempladas);
  this.tramite32614PerfilesStore.setMecanismosContinuidad(datos.mecanismosContinuidad);
}

/**
 * Updates all profile messaging fields in the profiles messaging store.
 * Sets all the profile messaging-related data fields in the corresponding store.
 * 
 * @param {Solicitud32614PerfilesMensajeriaState} datos - The profile messaging data to update in the store.
 */
actualizarTodosCamposPerfilesMensajeria(datos: Solicitud32614PerfilesMensajeriaState): void {
  this.tramite32614PerfilesMensajeriaStore.setDescribaProcedimiento(datos.describaProcedimiento);
  this.tramite32614PerfilesMensajeriaStore.setIndiqueLosCriterios(datos.indiqueLosCriterios);
  this.tramite32614PerfilesMensajeriaStore.setIndiqueLosMetodos(datos.indiqueLosMetodos);
  this.tramite32614PerfilesMensajeriaStore.setDescribaLosIndicadores(datos.describaLosIndicadores);
  this.tramite32614PerfilesMensajeriaStore.setComercioExterior(datos.comercioExterior);
  this.tramite32614PerfilesMensajeriaStore.setCandadosSeguridad(datos.candadosSeguridad);
  this.tramite32614PerfilesMensajeriaStore.setProveedorExterno(datos.proveedorExterno);
  this.tramite32614PerfilesMensajeriaStore.setSusceptibleContaminacion(datos.susceptibleContaminacion);
  this.tramite32614PerfilesMensajeriaStore.setEncuentrenVacios(datos.encuentrenVacios);
  this.tramite32614PerfilesMensajeriaStore.setSemirremolquesVacios(datos.semirremolquesVacios);
  this.tramite32614PerfilesMensajeriaStore.setUtilizarCandado(datos.utilizarCandado);
  this.tramite32614PerfilesMensajeriaStore.setSeguridadMismas(datos.seguridadMismas);
  this.tramite32614PerfilesMensajeriaStore.setDescribaContratacion(datos.describaContratacion);
  this.tramite32614PerfilesMensajeriaStore.setDocumentacionExigida(datos.documentacionExigida);
  this.tramite32614PerfilesMensajeriaStore.setExamenesSolicitados(datos.examenesSolicitados);
  this.tramite32614PerfilesMensajeriaStore.setConformeAnalisis(datos.conformeAnalisis);
  this.tramite32614PerfilesMensajeriaStore.setPeriodicidad(datos.periodicidad);
  this.tramite32614PerfilesMensajeriaStore.setConfidencialidad(datos.confidencialidad);
  this.tramite32614PerfilesMensajeriaStore.setContratacionPersonal(datos.contratacionPersonal);
  this.tramite32614PerfilesMensajeriaStore.setDescribaProcedimientoPersonal(datos.describaProcedimientoPersonal);
  this.tramite32614PerfilesMensajeriaStore.setSeguimientoProcedimiento(datos.seguimientoProcedimiento);
  this.tramite32614PerfilesMensajeriaStore.setIdentificaciones(datos.identificaciones);
  this.tramite32614PerfilesMensajeriaStore.setSistemasInformaticos(datos.sistemasInformaticos);
  this.tramite32614PerfilesMensajeriaStore.setProveedoresServicios(datos.proveedoresServicios);
  this.tramite32614PerfilesMensajeriaStore.setAdministracionPersonal(datos.administracionPersonal);
  this.tramite32614PerfilesMensajeriaStore.setExpliqueBrevemente(datos.expliqueBrevemente);
  this.tramite32614PerfilesMensajeriaStore.setEncuentranFuera(datos.encuentranFuera);
  this.tramite32614PerfilesMensajeriaStore.setActualizacionesSeguridad(datos.actualizacionesSeguridad);
  this.tramite32614PerfilesMensajeriaStore.setAccesoLosMismos(datos.accesoLosMismos);
  this.tramite32614PerfilesMensajeriaStore.setContinuidadNegocio(datos.continuidadNegocio);
  this.tramite32614PerfilesMensajeriaStore.setSemanaCorresponda(datos.semanaCorresponda);
  this.tramite32614PerfilesMensajeriaStore.setRecuperarInformacion(datos.recuperarInformacion);
  this.tramite32614PerfilesMensajeriaStore.setInformacionArchivada(datos.informacionArchivada);
  this.tramite32614PerfilesMensajeriaStore.setProcesoDatos(datos.procesoDatos);
  this.tramite32614PerfilesMensajeriaStore.setCopiasSeguridad(datos.copiasSeguridad);
  this.tramite32614PerfilesMensajeriaStore.setProteccionDeLaInformacion(datos.proteccionDeLaInformacion);
  this.tramite32614PerfilesMensajeriaStore.setPerdidaDeLaInformacion(datos.perdidaDeLaInformacion);
  this.tramite32614PerfilesMensajeriaStore.setControlanSistemas(datos.controlanSistemas);
  this.tramite32614PerfilesMensajeriaStore.setAccionesDelResto(datos.accionesDelResto);
  this.tramite32614PerfilesMensajeriaStore.setSistemasConfidenciales(datos.sistemasConfidenciales);
  this.tramite32614PerfilesMensajeriaStore.setProporcionaEsasContrasenas(datos.proporcionaEsasContrasenas);
  this.tramite32614PerfilesMensajeriaStore.setActualizacionesPeriodicas(datos.actualizacionesPeriodicas);
  this.tramite32614PerfilesMensajeriaStore.setFalsificadosLicencias(datos.falsificadosLicencias);
  this.tramite32614PerfilesMensajeriaStore.setProcesoDeImportacion(datos.procesoDeImportacion);
  this.tramite32614PerfilesMensajeriaStore.setTelecomunicaciones(datos.telecomunicaciones);
  this.tramite32614PerfilesMensajeriaStore.setSistemaComprometido(datos.sistemaComprometido);
  this.tramite32614PerfilesMensajeriaStore.setSeguridadDeLaTecnologia(datos.seguridadDeLaTecnologia);
  this.tramite32614PerfilesMensajeriaStore.setMediosTransporte(datos.mediosTransporte);
  this.tramite32614PerfilesMensajeriaStore.setEstaDifusion(datos.estaDifusion);
  this.tramite32614PerfilesMensajeriaStore.setEnunciativaLimitativa(datos.enunciativaLimitativa);
  this.tramite32614PerfilesMensajeriaStore.setProcedimientosEmpresa(datos.procedimientosEmpresa);
  this.tramite32614PerfilesMensajeriaStore.setMediosDeTransporte(datos.mediosDeTransporte);
  this.tramite32614PerfilesMensajeriaStore.setRelacionadosSeguridad(datos.relacionadosSeguridad);
  this.tramite32614PerfilesMensajeriaStore.setReportarIncidentes(datos.reportarIncidentes);
  this.tramite32614PerfilesMensajeriaStore.setActividadesSospechosas(datos.actividadesSospechosas);
  this.tramite32614PerfilesMensajeriaStore.setBrevementeSonsiste(datos.brevementeSonsiste);
  this.tramite32614PerfilesMensajeriaStore.setIncidenteSeguridad(datos.incidenteSeguridad);
  this.tramite32614PerfilesMensajeriaStore.setCaboInvestigacion(datos.caboInvestigacion);
  this.tramite32614PerfilesMensajeriaStore.setOperacionCaboInvestigacion(datos.operacionCaboInvestigacion);
  this.tramite32614PerfilesMensajeriaStore.setDomicilio(datos.domicilio);
  this.tramite32614PerfilesMensajeriaStore.setAntiguedad(datos.antiguedad);
  this.tramite32614PerfilesMensajeriaStore.setProductos(datos.productos);
  this.tramite32614PerfilesMensajeriaStore.setEmbarquesExp(datos.embarquesExp);
  this.tramite32614PerfilesMensajeriaStore.setEmbarquesImp(datos.embarquesImp);
  this.tramite32614PerfilesMensajeriaStore.setEmpleados(datos.empleados);
  this.tramite32614PerfilesMensajeriaStore.setSuperficie(datos.superficie);
  this.tramite32614PerfilesMensajeriaStore.setNombre(datos.nombre);
  this.tramite32614PerfilesMensajeriaStore.setCategoria(datos.categoria);
  this.tramite32614PerfilesMensajeriaStore.setVigencia(datos.vigencia);
  this.tramite32614PerfilesMensajeriaStore.setNombre2(datos.nombre2);
  this.tramite32614PerfilesMensajeriaStore.setCategoria2(datos.categoria2);
  this.tramite32614PerfilesMensajeriaStore.setVigenciaDos(datos.vigencia2);
  this.tramite32614PerfilesMensajeriaStore.setNombre3(datos.nombre3);
  this.tramite32614PerfilesMensajeriaStore.setCategoria3(datos.categoria3);
  this.tramite32614PerfilesMensajeriaStore.setVigenciaTres(datos.vigencia3);
}

/**
 * Updates all third parties fields in the third parties store.
 * Sets all the third parties-related data fields in the corresponding store.
 * 
 * @param {Solicitud32614TercerosState} datos - The third parties data to update in the store.
 */
actualizarTodosCamposTerceros(datos: Solicitud32614TercerosState): void {
  this.tramite32614TercerosStore.setResigtro(datos.resigtro);
  this.tramite32614TercerosStore.setTelefono(datos.telefono);
  this.tramite32614TercerosStore.setCorreo(datos.correo);
  this.tramite32614TercerosStore.setResigtroFedral(datos.resigtroFedral);
  this.tramite32614TercerosStore.setCargo(datos.cargo);
  this.tramite32614TercerosStore.setTelefonoEnlace(datos.telefonoEnlace);
  this.tramite32614TercerosStore.setCorreoEnlace(datos.correoEnlace);
  this.tramite32614TercerosStore.setSuplente(datos.suplente);
}

/**
 * Updates all procedure fields in the procedure store.
 * Sets all the procedure-related data fields in the corresponding store.
 * 
 * @param {Solicitud32614State} datos - The procedure data to update in the store.
 */
actualizarTodosCamposTramite(datos: Solicitud32614State): void {
  this.tramite32614Store.setSectorProductivo(datos.sectorProductivo);
  this.tramite32614Store.setServicio(datos.servicio);
  this.tramite32614Store.setSolicitudDeInspeccion(datos.solicitudDeInspeccion);
  this.tramite32614Store.setIndiqueAutorizo(datos.indiqueAutorizo);
  this.tramite32614Store.setSenaleCuentaEmpleados(datos.senaleCuentaEmpleados);
  this.tramite32614Store.setBimestre(datos.bimestre);
  this.tramite32614Store.setNumeroDeEmpleados(datos.numeroDeEmpleados);
  this.tramite32614Store.setCumpleConLaObligacion(datos.cumpleConLaObligacion);
  this.tramite32614Store.setAcreditaRealizar(datos.acreditaRealizar);
  this.tramite32614Store.setSenaleSiAlMomento(datos.senaleSiAlMomento);
  this.tramite32614Store.setRfc(datos.rfc);
  this.tramite32614Store.setNumeroDeEmpleadosForma(datos.numeroDeEmpleadosForma);
  this.tramite32614Store.setBimestreForma(datos.bimestreForma);
  this.tramite32614Store.setAcreditaCumplir(datos.acreditaCumplir);
  this.tramite32614Store.setFraccionVI(datos.fraccionVI);
  this.tramite32614Store.setNovenoParrafoDelCff(datos.novenoParrafoDelCff);
  this.tramite32614Store.setDigitalesEstanVigentes(datos.digitalesEstanVigentes);
  this.tramite32614Store.setUltimosDoceMeses(datos.ultimosDoceMeses);
  this.tramite32614Store.setPrestacionDeServicios(datos.prestacionDeServicios);
  this.tramite32614Store.setInstalacionesPrincipales(datos.instalacionesPrincipales);
  this.tramite32614Store.setMunicipioAlcaldia(datos.municipioAlcaldia);
  this.tramite32614Store.setTipoDeInstalcion(datos.tipoDeInstalcion);
  this.tramite32614Store.setProcesoProductivo(datos.procesoProductivo);
  this.tramite32614Store.setAcreditacionDelUso(datos.acreditacionDelUso);
  this.tramite32614Store.setPrefilMensajeria(datos.prefilMensajeria);
  this.tramite32614Store.setArticuloDelCff(datos.articuloDelCff);
  this.tramite32614Store.setExportadoresSectorial(datos.exportadoresSectorial);
  this.tramite32614Store.setArchivoNacionales(datos.archivoNacionales);
  this.tramite32614Store.setProveedores(datos.proveedores);
  this.tramite32614Store.setSolicitudDeCertificacion(datos.solicitudDeCertificacion);
  this.tramite32614Store.setControlInventarios(datos.controlInventarios);
  this.tramite32614Store.setNombreDelSistema(datos.nombreDelSistema);
  this.tramite32614Store.setLugarDeRadicacion(datos.lugarDeRadicacion);
  this.tramite32614Store.setPrevistas(datos.previstas);
  this.tramite32614Store.setDelCffLasReglas(datos.delCffLasReglas);
  this.tramite32614Store.setEnSeCaracter(datos.enSeCaracter);
  this.tramite32614Store.setObligadoTributar(datos.obligadoTributar);
  this.tramite32614Store.setNacionalidad(datos.nacionalidad);
  this.tramite32614Store.setConformidad(datos.conformidad);
  this.tramite32614Store.setEsquemaIntegralCertificacion(datos.esquemaIntegralCertificacion);
  this.tramite32614Store.setModificadasRevocadas(datos.modificadasRevocadas);
}
}
