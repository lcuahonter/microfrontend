import { InstalacionesPrincipalesRespuestaTabla, PersonaRespuestaTabla, RespuestaTabla } from '@libs/shared/data-access-user/src/core/models/32616/dato-comunes.model';
import { Solicitud32616MensajeriaState, Tramite32616MensajeriaStore } from '../../estados/tramites/tramite32616_mensajeria.store';
import { Solicitud32616PerfilesMensajeriaState, Tramite32616PerfilesMensajeriaStore } from '../../estados/tramites/tramite32616_perfilesMensajeria.store';
import { Solicitud32616PerfilesState, Tramite32616PerfilesStore } from '../../estados/tramites/tramite32616_perfiles.store';
import { Solicitud32616State, Tramite32616Store } from '../../estados/tramites/tramite32616.store';
import { Solicitud32616TercerosState, Tramite32616TercerosStore } from '../../estados/tramites/tramite32616_terceros.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de invocar y obtener los datos necesarios
 * para la solicitud de registro del trámite 32616.
 * Se encarga de consumir archivos JSON locales que simulan las respuestas
 * de diferentes catálogos o entidades relacionadas con el trámite.
 *
 * @export
 * @class SolicitudDeRegistroInvocarService
 */
@Injectable({
  providedIn: 'root'
})
export class SolicitudDeRegistroInvocarService {

  /**
   * Crea una instancia del servicio de invocación.
   *
   * @param {HttpClient} http - Cliente HTTP utilizado para realizar peticiones a los recursos JSON locales.
   * @memberof SolicitudDeRegistroInvocarService
   */
  constructor(private http: HttpClient,private tramite32616MensajeriaStore:Tramite32616MensajeriaStore, private tramite32616PerfilesStore:Tramite32616PerfilesStore, private tramite32616PerfilesMensajeriaStore:Tramite32616PerfilesMensajeriaStore, private tramite32616TercerosStore:Tramite32616TercerosStore, private tramite32616Store:Tramite32616Store ) {
    // Constructor vacío, puede incluir lógica si es necesario.
  }

  /**
   * Obtiene los datos de la tabla de mercancías.
   * Carga un archivo JSON que contiene información simulada para llenar la tabla de mercancías.
   *
   * @returns {Observable<RespuestaTabla>} Un observable con los datos de la tabla.
   * @memberof SolicitudDeRegistroInvocarService
   */
  obtenerTablaDatos(): Observable<RespuestaTabla> {
    return this.http.get<RespuestaTabla>('assets/json/32616/mercancias-tabla.json');
  }

  /**
   * Obtiene los datos de la tabla de instalaciones principales.
   * Utiliza un recurso JSON para simular la respuesta de una tabla de instalaciones principales.
   *
   * @returns {Observable<InstalacionesPrincipalesRespuestaTabla>} Un observable con los datos de la tabla de instalaciones principales.
   * @memberof SolicitudDeRegistroInvocarService
   */
  obtenerInstalacionesPrincipalesTablaDatos(): Observable<InstalacionesPrincipalesRespuestaTabla> {
    return this.http.get<InstalacionesPrincipalesRespuestaTabla>('assets/json/32616/instalacionesPrincipales-tabla.json');
  }

  /**
   * Obtiene los datos de la tabla de personas.
   * Realiza una petición a un recurso local en formato JSON que contiene datos relacionados con personas.
   *
   * @returns {Observable<PersonaRespuestaTabla>} Un observable con los datos de la tabla de personas.
   * @memberof SolicitudDeRegistroInvocarService
   */
  obtenerPersonaTablaDatos(): Observable<PersonaRespuestaTabla> {
    return this.http.get<PersonaRespuestaTabla>('assets/json/32616/personapara.json');
  }


  /**
 * Obtiene los datos del registro de toma de muestras de mercancías.
 *
 * Realiza una solicitud HTTP GET para recuperar la información almacenada en el archivo JSON
 * correspondiente a la toma de muestras de mercancías para el trámite 32616.
 *
 * @returns Un observable que emite el estado de la solicitud 32616 (`Solicitud32616State`).
 */
getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud32616MensajeriaState> {
    return this.http.get<Solicitud32616MensajeriaState>('assets/json/32616/tramite32616_mensajeria.json');
  }

  getRegistroperfilessData(): Observable<Solicitud32616PerfilesState> {
    return this.http.get<Solicitud32616PerfilesState>('assets/json/32616/tramite32616_perfiles.json');
  }

  getRegistroTperfilesMensajeriassData(): Observable<Solicitud32616PerfilesMensajeriaState> {
    return this.http.get<Solicitud32616PerfilesMensajeriaState>('assets/json/32616/tramite32616_permensajeria.json');
  }

  getRegistroTotercerosData(): Observable<Solicitud32616TercerosState> {
    return this.http.get<Solicitud32616TercerosState>('assets/json/32616/tramite32616_terceros.json');
  }
  getRegistroTotramite32616Data(): Observable<Solicitud32616State> {
    return this.http.get<Solicitud32616State>('assets/json/32616/tramite32616.json');
  }


  setRegistroTomaMuestrasMercanciasData(datos:Solicitud32616MensajeriaState){
    this.tramite32616MensajeriaStore.setLaSolicitante(datos.laSolicitante);
this.tramite32616MensajeriaStore.setSusFiliales(datos.susFiliales);
this.tramite32616MensajeriaStore.setLasEmpresas(datos.lasEmpresas);
this.tramite32616MensajeriaStore.setFinDeVigencia(datos.finDeVigencia);
this.tramite32616MensajeriaStore.setNumeroDeOficio(datos.numeroDeOficio);
this.tramite32616MensajeriaStore.setFechaDePresentacion(datos.fechaDePresentacion);
this.tramite32616MensajeriaStore.setMensajeriaPaqueteria(datos.mensajeriaPaqueteria);
this.tramite32616MensajeriaStore.setLaSolicitanteInterna(datos.laSolicitanteInterna);
this.tramite32616MensajeriaStore.setSubsidiaria(datos.subsidiaria ?? '');
this.tramite32616MensajeriaStore.setFiliales(datos.filiales ?? '');
this.tramite32616MensajeriaStore.setMatrices(datos.matrices ?? '');
this.tramite32616MensajeriaStore.setAeronauticaCivil(datos.aeronauticaCivil ?? '');
this.tramite32616MensajeriaStore.setConformidadArticulos(datos.conformidadArticulos ?? '');
this.tramite32616MensajeriaStore.setRfc(datos.rfc ?? '');
this.tramite32616MensajeriaStore.setDocumentosMercancias(datos.documentosMercancias ?? '');
this.tramite32616MensajeriaStore.setRfcLasEmpresas(datos.rfcLasEmpresas ?? '');
this.tramite32616MensajeriaStore.setGeneralAeronauticaCivil(datos.generalAeronauticaCivil ?? '');
this.tramite32616MensajeriaStore.setExteriorConformidad(datos.exteriorConformidad ?? '');
this.tramite32616MensajeriaStore.setReconocimientoMutuo(datos.reconocimientoMutuo ?? '');
this.tramite32616MensajeriaStore.setRfcListado(datos.rfcListado ?? '');
this.tramite32616MensajeriaStore.setNombreRazonSocialListado(datos.nombreRazonSocialListado ?? '');
this.tramite32616MensajeriaStore.setDireccionFiscalListado(datos.direccionFiscalListado ?? '');
this.tramite32616MensajeriaStore.setPaginaElectronicaListado(datos.paginaElectronicaListado ?? '');
this.tramite32616MensajeriaStore.setCorreoElectronicaListado(datos.correoElectronicaListado ?? '');
this.tramite32616MensajeriaStore.setTelefonoContactoListado(datos.telefonoContactoListado ?? '');
this.tramite32616MensajeriaStore.setInformacionProporcionada(datos.informacionProporcionada ?? '');
this.tramite32616MensajeriaStore.setClaveReferencia(datos.claveReferencia ?? '');
this.tramite32616MensajeriaStore.setNumeroOperacion(datos.numeroOperacion ?? '');
this.tramite32616MensajeriaStore.setCadenaDependencia(datos.cadenaDependencia ?? '');
this.tramite32616MensajeriaStore.setBanco(datos.banco ?? '');
this.tramite32616MensajeriaStore.setLlavePago(datos.llavePago ?? '');
this.tramite32616MensajeriaStore.setFechaFactura(datos.fechaFactura ?? '');
this.tramite32616MensajeriaStore.setLaSolicitante(datos.laSolicitante);
this.tramite32616MensajeriaStore.setSusFiliales(datos.susFiliales);
this.tramite32616MensajeriaStore.setLasEmpresas(datos.lasEmpresas);
this.tramite32616MensajeriaStore.setFinDeVigencia(datos.finDeVigencia);
this.tramite32616MensajeriaStore.setNumeroDeOficio(datos.numeroDeOficio);
this.tramite32616MensajeriaStore.setFechaDePresentacion(datos.fechaDePresentacion);
this.tramite32616MensajeriaStore.setMensajeriaPaqueteria(datos.mensajeriaPaqueteria);
this.tramite32616MensajeriaStore.setLaSolicitanteInterna(datos.laSolicitanteInterna);
this.tramite32616MensajeriaStore.setSubsidiaria(datos.subsidiaria ?? '');
this.tramite32616MensajeriaStore.setFiliales(datos.filiales ?? '');
this.tramite32616MensajeriaStore.setMatrices(datos.matrices ?? '');
this.tramite32616MensajeriaStore.setAeronauticaCivil(datos.aeronauticaCivil ?? '');
this.tramite32616MensajeriaStore.setConformidadArticulos(datos.conformidadArticulos ?? '');
this.tramite32616MensajeriaStore.setRfc(datos.rfc ?? '');
this.tramite32616MensajeriaStore.setDocumentosMercancias(datos.documentosMercancias ?? '');
this.tramite32616MensajeriaStore.setRfcLasEmpresas(datos.rfcLasEmpresas ?? '');
this.tramite32616MensajeriaStore.setGeneralAeronauticaCivil(datos.generalAeronauticaCivil ?? '');
this.tramite32616MensajeriaStore.setExteriorConformidad(datos.exteriorConformidad ?? '');
this.tramite32616MensajeriaStore.setReconocimientoMutuo(datos.reconocimientoMutuo ?? '');
this.tramite32616MensajeriaStore.setRfcListado(datos.rfcListado ?? '');
this.tramite32616MensajeriaStore.setNombreRazonSocialListado(datos.nombreRazonSocialListado ?? '');
this.tramite32616MensajeriaStore.setDireccionFiscalListado(datos.direccionFiscalListado ?? '');
this.tramite32616MensajeriaStore.setPaginaElectronicaListado(datos.paginaElectronicaListado ?? '');
this.tramite32616MensajeriaStore.setCorreoElectronicaListado(datos.correoElectronicaListado ?? '');
this.tramite32616MensajeriaStore.setTelefonoContactoListado(datos.telefonoContactoListado ?? '');
this.tramite32616MensajeriaStore.setInformacionProporcionada(datos.informacionProporcionada ?? '');
this.tramite32616MensajeriaStore.setClaveReferencia(datos.claveReferencia ?? '');
this.tramite32616MensajeriaStore.setNumeroOperacion(datos.numeroOperacion ?? '');
this.tramite32616MensajeriaStore.setCadenaDependencia(datos.cadenaDependencia ?? '');
this.tramite32616MensajeriaStore.setBanco(datos.banco ?? '');
this.tramite32616MensajeriaStore.setLlavePago(datos.llavePago ?? '');
this.tramite32616MensajeriaStore.setFechaFactura(datos.fechaFactura ?? '');
this.tramite32616MensajeriaStore.setImportePago(datos.importePago ?? '');
  }


actualizarTodosCampos(datos: Solicitud32616PerfilesState): void {
  this.tramite32616PerfilesStore.setProcedimientoDocumentado(datos.procedimientoDocumentado);
  this.tramite32616PerfilesStore.setIndiqueNumero(datos.indiqueNumero);
  this.tramite32616PerfilesStore.setCargosFunciones(datos.cargosFunciones);
  this.tramite32616PerfilesStore.setCasoContratarse(datos.casoContratarse);
  this.tramite32616PerfilesStore.setCasoContar(datos.casoContar);
  this.tramite32616PerfilesStore.setDescribirProcedimiento(datos.describirProcedimiento);
  this.tramite32616PerfilesStore.setIndiqueMecanismos(datos.indiqueMecanismos);
  this.tramite32616PerfilesStore.setIndicarEmpleados(datos.indicarEmpleados);
  this.tramite32616PerfilesStore.setIndiqueIdentifica(datos.indiqueIdentifica);
  this.tramite32616PerfilesStore.setDescribaEmpresa(datos.describaEmpresa);
  this.tramite32616PerfilesStore.setIndiqueAsegura(datos.indiqueAsegura);
  this.tramite32616PerfilesStore.setProcedimientoParaControl(datos.procedimientoParaControl);
  this.tramite32616PerfilesStore.setSenaleRegistros(datos.senaleRegistros);
  this.tramite32616PerfilesStore.setSenaleQuien(datos.senaleQuien);
  this.tramite32616PerfilesStore.setDescribaRecepion(datos.describaRecepion);
  this.tramite32616PerfilesStore.setIndiqueEncargado(datos.indiqueEncargado);
  this.tramite32616PerfilesStore.setIndiqueIdentfica(datos.indiqueIdentfica);
  this.tramite32616PerfilesStore.setSenaleComo(datos.senaleComo);
  this.tramite32616PerfilesStore.setDescribaCaracteristicas(datos.describaCaracteristicas);
  this.tramite32616PerfilesStore.setSenaleAccion(datos.senaleAccion);
  this.tramite32616PerfilesStore.setIndiqueLleva(datos.indiqueLleva);
  this.tramite32616PerfilesStore.setDescribaProcedimiento(datos.describaProcedimiento);
  this.tramite32616PerfilesStore.setIndiqueSocios(datos.indiqueSocios);
  this.tramite32616PerfilesStore.setIndiqueForma(datos.indiqueForma);
  this.tramite32616PerfilesStore.setIndiqueExisten(datos.indiqueExisten);
  this.tramite32616PerfilesStore.setIndiqueCuenta(datos.indiqueCuenta);
  this.tramite32616PerfilesStore.setProcedimientoRealizar(datos.procedimientoRealizar);
  this.tramite32616PerfilesStore.setIndiquePeriodicidad(datos.indiquePeriodicidad);
  this.tramite32616PerfilesStore.setDescribaComo(datos.describaComo);
  this.tramite32616PerfilesStore.setComoAseguran(datos.comoAseguran);
  this.tramite32616PerfilesStore.setIndiqueFormatos(datos.indiqueFormatos);
  this.tramite32616PerfilesStore.setSenalarMedidas(datos.senalarMedidas);
  this.tramite32616PerfilesStore.setIndiqueAlmacenes(datos.indiqueAlmacenes);
  this.tramite32616PerfilesStore.setExpliqueBrevemente(datos.expliqueBrevemente);
  this.tramite32616PerfilesStore.setIndiqueCerciora(datos.indiqueCerciora);
  this.tramite32616PerfilesStore.setIndiqueEstos(datos.indiqueEstos);
  this.tramite32616PerfilesStore.setIndiquePertenecen(datos.indiquePertenecen);
  this.tramite32616PerfilesStore.setIndiqueResponsable(datos.indiqueResponsable);
  this.tramite32616PerfilesStore.setIndiqueTecnologia(datos.indiqueTecnologia);
  this.tramite32616PerfilesStore.setDescribirProcesamiento(datos.describirProcesamiento);
  this.tramite32616PerfilesStore.setDetalleComo(datos.detalleComo);
  this.tramite32616PerfilesStore.setIndiqueUtiliza(datos.indiqueUtiliza);
  this.tramite32616PerfilesStore.setDetalleValida(datos.detalleValida);
  this.tramite32616PerfilesStore.setComoNumero(datos.comoNumero);
  this.tramite32616PerfilesStore.setSenaleAsociados(datos.senaleAsociados);
  this.tramite32616PerfilesStore.setIndiqueMateriales(datos.indiqueMateriales);
  this.tramite32616PerfilesStore.setQueForma(datos.queForma);
  this.tramite32616PerfilesStore.setPersonalResponsable(datos.personalResponsable);
  this.tramite32616PerfilesStore.setIndiqueCuantas(datos.indiqueCuantas);
  this.tramite32616PerfilesStore.setIndiqueMonitoreadas(datos.indiqueMonitoreadas);
  this.tramite32616PerfilesStore.setDetalleExisten(datos.detalleExisten);
  this.tramite32616PerfilesStore.setDescribaAcceso(datos.describaAcceso);
  this.tramite32616PerfilesStore.setDescribirTipo(datos.describirTipo);
  this.tramite32616PerfilesStore.setDescribaAreas(datos.describaAreas);
  this.tramite32616PerfilesStore.setSenaleMismas(datos.senaleMismas);
  this.tramite32616PerfilesStore.setCasoNoContar(datos.casoNoContar);
  this.tramite32616PerfilesStore.setPeriodicidadVerifica(datos.periodicidadVerifica);
  this.tramite32616PerfilesStore.setIndiqueTareas(datos.indiqueTareas);
  this.tramite32616PerfilesStore.setDescribaManera(datos.describaManera);
  this.tramite32616PerfilesStore.setIndiqueSepara(datos.indiqueSepara);
  this.tramite32616PerfilesStore.setSenaleRestringido(datos.senaleRestringido);
  this.tramite32616PerfilesStore.setDescribaMonitoreo(datos.describaMonitoreo);
  this.tramite32616PerfilesStore.setResponsablesControlar(datos.responsablesControlar);
  this.tramite32616PerfilesStore.setEstacionamientos(datos.estacionamientos);
  this.tramite32616PerfilesStore.setLlevaEntrada(datos.llevaEntrada);
  this.tramite32616PerfilesStore.setPoliticasMecanismos(datos.politicasMecanismos);
  this.tramite32616PerfilesStore.setProcedimientoOperacion(datos.procedimientoOperacion);
  this.tramite32616PerfilesStore.setSenaleEncuentran(datos.senaleEncuentran);
  this.tramite32616PerfilesStore.setMencioneCuenta(datos.mencioneCuenta);
  this.tramite32616PerfilesStore.setQueManera(datos.queManera);
  this.tramite32616PerfilesStore.setDescribaContactar(datos.describaContactar);
  this.tramite32616PerfilesStore.setIndiqueOperativo(datos.indiqueOperativo);
  this.tramite32616PerfilesStore.setIndiqueAparatos(datos.indiqueAparatos);
  this.tramite32616PerfilesStore.setMantenimiento(datos.mantenimiento);
  this.tramite32616PerfilesStore.setPoliticasAparatos(datos.politicasAparatos);
  this.tramite32616PerfilesStore.setProgramaMantenimiento(datos.programaMantenimiento);
  this.tramite32616PerfilesStore.setIndiqueRespaldo(datos.indiqueRespaldo);
  this.tramite32616PerfilesStore.setDescribaAlarma(datos.describaAlarma);
  this.tramite32616PerfilesStore.setIndiqueUtilizan(datos.indiqueUtilizan);
  this.tramite32616PerfilesStore.setDescribaSistemas(datos.describaSistemas);
  this.tramite32616PerfilesStore.setIndicarCamaras(datos.indicarCamaras);
  this.tramite32616PerfilesStore.setMencioneInspeccion(datos.mencioneInspeccion);
  this.tramite32616PerfilesStore.setSenalarUbicacion(datos.senalarUbicacion);
  this.tramite32616PerfilesStore.setIndiqueHorarios(datos.indiqueHorarios);
  this.tramite32616PerfilesStore.setIndiqueRevisan(datos.indiqueRevisan);
  this.tramite32616PerfilesStore.setIndiqueDesignado(datos.indiqueDesignado);
  this.tramite32616PerfilesStore.setComoDocumentan(datos.comoDocumentan);
  this.tramite32616PerfilesStore.setIndiqueTiempo(datos.indiqueTiempo);
  this.tramite32616PerfilesStore.setContarPlanta(datos.contarPlanta);
  this.tramite32616PerfilesStore.setEstosSistemas(datos.estosSistemas);
  this.tramite32616PerfilesStore.setIndicarCircuito(datos.indicarCircuito);
  this.tramite32616PerfilesStore.setDescribaImplementado(datos.describaImplementado);
  this.tramite32616PerfilesStore.setFormaControlan(datos.formaControlan);
  this.tramite32616PerfilesStore.setIndiqueTodas(datos.indiqueTodas);
  this.tramite32616PerfilesStore.setIndiquePlanta(datos.indiquePlanta);
  this.tramite32616PerfilesStore.setCuentaDocumentado(datos.cuentaDocumentado);
  this.tramite32616PerfilesStore.setIndiquePuertas(datos.indiquePuertas);
  this.tramite32616PerfilesStore.setIndiqueCerrado(datos.indiqueCerrado);
  this.tramite32616PerfilesStore.setIndicarCircuitoCerrado(datos.indicarCircuitoCerrado);
  this.tramite32616PerfilesStore.setRegistroVisitantes(datos.registroVisitantes);
  this.tramite32616PerfilesStore.setCasoSocios(datos.casoSocios);
  this.tramite32616PerfilesStore.setEstosEmpresa(datos.estosEmpresa);
  this.tramite32616PerfilesStore.setComiteSeguridad(datos.comiteSeguridad);
  this.tramite32616PerfilesStore.setFuentesInformacion(datos.fuentesInformacion);
  this.tramite32616PerfilesStore.setPolitica(datos.politica);
  this.tramite32616PerfilesStore.setIndique(datos.indique);
  this.tramite32616PerfilesStore.setPeriodicidad(datos.periodicidad);
  this.tramite32616PerfilesStore.setPrograma(datos.programa);
  this.tramite32616PerfilesStore.setCapacitacion(datos.capacitacion);
  this.tramite32616PerfilesStore.setProcedimiento(datos.procedimiento);
  this.tramite32616PerfilesStore.setDescripcionProcedimiento(datos.descripcionProcedimiento);
  this.tramite32616PerfilesStore.setNombreProcedimiento(datos.nombreProcedimiento);
  this.tramite32616PerfilesStore.setProgramacionAuditoria(datos.programacionAuditoria);
  this.tramite32616PerfilesStore.setParticipantesAuditoria(datos.participantesAuditoria);
  this.tramite32616PerfilesStore.setEnfoqueAuditoria(datos.enfoqueAuditoria);
  this.tramite32616PerfilesStore.setProcesosAuditados(datos.procesosAuditados);
  this.tramite32616PerfilesStore.setRegistrosAuditoria(datos.registrosAuditoria);
  this.tramite32616PerfilesStore.setProgramacion(datos.programacion);
  this.tramite32616PerfilesStore.setRegistrosNombre(datos.registrosNombre);
  this.tramite32616PerfilesStore.setRegistrosEmpresa(datos.registrosEmpresa);
  this.tramite32616PerfilesStore.setPlanEmergencia(datos.planEmergencia);
  this.tramite32616PerfilesStore.setSituacionesContempladas(datos.situacionesContempladas);
  this.tramite32616PerfilesStore.setMecanismosContinuidad(datos.mecanismosContinuidad);
}

actualizarTodosCamposPerfilesMensajeria(datos: Solicitud32616PerfilesMensajeriaState): void {
  this.tramite32616PerfilesMensajeriaStore.setDescribaProcedimiento(datos.describaProcedimiento);
  this.tramite32616PerfilesMensajeriaStore.setIndiqueLosCriterios(datos.indiqueLosCriterios);
  this.tramite32616PerfilesMensajeriaStore.setIndiqueLosMetodos(datos.indiqueLosMetodos);
  this.tramite32616PerfilesMensajeriaStore.setDescribaLosIndicadores(datos.describaLosIndicadores);
  this.tramite32616PerfilesMensajeriaStore.setComercioExterior(datos.comercioExterior);
  this.tramite32616PerfilesMensajeriaStore.setCandadosSeguridad(datos.candadosSeguridad);
  this.tramite32616PerfilesMensajeriaStore.setProveedorExterno(datos.proveedorExterno);
  this.tramite32616PerfilesMensajeriaStore.setSusceptibleContaminacion(datos.susceptibleContaminacion);
  this.tramite32616PerfilesMensajeriaStore.setEncuentrenVacios(datos.encuentrenVacios);
  this.tramite32616PerfilesMensajeriaStore.setSemirremolquesVacios(datos.semirremolquesVacios);
  this.tramite32616PerfilesMensajeriaStore.setUtilizarCandado(datos.utilizarCandado);
  this.tramite32616PerfilesMensajeriaStore.setSeguridadMismas(datos.seguridadMismas);
  this.tramite32616PerfilesMensajeriaStore.setDescribaContratacion(datos.describaContratacion);
  this.tramite32616PerfilesMensajeriaStore.setDocumentacionExigida(datos.documentacionExigida);
  this.tramite32616PerfilesMensajeriaStore.setExamenesSolicitados(datos.examenesSolicitados);
  this.tramite32616PerfilesMensajeriaStore.setConformeAnalisis(datos.conformeAnalisis);
  this.tramite32616PerfilesMensajeriaStore.setPeriodicidad(datos.periodicidad);
  this.tramite32616PerfilesMensajeriaStore.setConfidencialidad(datos.confidencialidad);
  this.tramite32616PerfilesMensajeriaStore.setContratacionPersonal(datos.contratacionPersonal);
  this.tramite32616PerfilesMensajeriaStore.setDescribaProcedimientoPersonal(datos.describaProcedimientoPersonal);
  this.tramite32616PerfilesMensajeriaStore.setSeguimientoProcedimiento(datos.seguimientoProcedimiento);
  this.tramite32616PerfilesMensajeriaStore.setIdentificaciones(datos.identificaciones);
  this.tramite32616PerfilesMensajeriaStore.setSistemasInformaticos(datos.sistemasInformaticos);
  this.tramite32616PerfilesMensajeriaStore.setProveedoresServicios(datos.proveedoresServicios);
  this.tramite32616PerfilesMensajeriaStore.setAdministracionPersonal(datos.administracionPersonal);
  this.tramite32616PerfilesMensajeriaStore.setExpliqueBrevemente(datos.expliqueBrevemente);
  this.tramite32616PerfilesMensajeriaStore.setEncuentranFuera(datos.encuentranFuera);
  this.tramite32616PerfilesMensajeriaStore.setActualizacionesSeguridad(datos.actualizacionesSeguridad);
  this.tramite32616PerfilesMensajeriaStore.setAccesoLosMismos(datos.accesoLosMismos);
  this.tramite32616PerfilesMensajeriaStore.setContinuidadNegocio(datos.continuidadNegocio);
  this.tramite32616PerfilesMensajeriaStore.setSemanaCorresponda(datos.semanaCorresponda);
  this.tramite32616PerfilesMensajeriaStore.setRecuperarInformacion(datos.recuperarInformacion);
  this.tramite32616PerfilesMensajeriaStore.setInformacionArchivada(datos.informacionArchivada);
  this.tramite32616PerfilesMensajeriaStore.setProcesoDatos(datos.procesoDatos);
  this.tramite32616PerfilesMensajeriaStore.setCopiasSeguridad(datos.copiasSeguridad);
  this.tramite32616PerfilesMensajeriaStore.setProteccionDeLaInformacion(datos.proteccionDeLaInformacion);
  this.tramite32616PerfilesMensajeriaStore.setPerdidaDeLaInformacion(datos.perdidaDeLaInformacion);
  this.tramite32616PerfilesMensajeriaStore.setControlanSistemas(datos.controlanSistemas);
  this.tramite32616PerfilesMensajeriaStore.setAccionesDelResto(datos.accionesDelResto);
  this.tramite32616PerfilesMensajeriaStore.setSistemasConfidenciales(datos.sistemasConfidenciales);
  this.tramite32616PerfilesMensajeriaStore.setProporcionaEsasContrasenas(datos.proporcionaEsasContrasenas);
  this.tramite32616PerfilesMensajeriaStore.setActualizacionesPeriodicas(datos.actualizacionesPeriodicas);
  this.tramite32616PerfilesMensajeriaStore.setFalsificadosLicencias(datos.falsificadosLicencias);
  this.tramite32616PerfilesMensajeriaStore.setProcesoDeImportacion(datos.procesoDeImportacion);
  this.tramite32616PerfilesMensajeriaStore.setTelecomunicaciones(datos.telecomunicaciones);
  this.tramite32616PerfilesMensajeriaStore.setSistemaComprometido(datos.sistemaComprometido);
  this.tramite32616PerfilesMensajeriaStore.setSeguridadDeLaTecnologia(datos.seguridadDeLaTecnologia);
  this.tramite32616PerfilesMensajeriaStore.setMediosTransporte(datos.mediosTransporte);
  this.tramite32616PerfilesMensajeriaStore.setEstaDifusion(datos.estaDifusion);
  this.tramite32616PerfilesMensajeriaStore.setEnunciativaLimitativa(datos.enunciativaLimitativa);
  this.tramite32616PerfilesMensajeriaStore.setProcedimientosEmpresa(datos.procedimientosEmpresa);
  this.tramite32616PerfilesMensajeriaStore.setMediosDeTransporte(datos.mediosDeTransporte);
  this.tramite32616PerfilesMensajeriaStore.setRelacionadosSeguridad(datos.relacionadosSeguridad);
  this.tramite32616PerfilesMensajeriaStore.setReportarIncidentes(datos.reportarIncidentes);
  this.tramite32616PerfilesMensajeriaStore.setActividadesSospechosas(datos.actividadesSospechosas);
  this.tramite32616PerfilesMensajeriaStore.setBrevementeSonsiste(datos.brevementeSonsiste);
  this.tramite32616PerfilesMensajeriaStore.setIncidenteSeguridad(datos.incidenteSeguridad);
  this.tramite32616PerfilesMensajeriaStore.setCaboInvestigacion(datos.caboInvestigacion);
  this.tramite32616PerfilesMensajeriaStore.setOperacionCaboInvestigacion(datos.operacionCaboInvestigacion);
  this.tramite32616PerfilesMensajeriaStore.setDomicilio(datos.domicilio);
  this.tramite32616PerfilesMensajeriaStore.setAntiguedad(datos.antiguedad);
  this.tramite32616PerfilesMensajeriaStore.setProductos(datos.productos);
  this.tramite32616PerfilesMensajeriaStore.setEmbarquesExp(datos.embarquesExp);
  this.tramite32616PerfilesMensajeriaStore.setEmbarquesImp(datos.embarquesImp);
  this.tramite32616PerfilesMensajeriaStore.setEmpleados(datos.empleados);
  this.tramite32616PerfilesMensajeriaStore.setSuperficie(datos.superficie);
  this.tramite32616PerfilesMensajeriaStore.setNombre(datos.nombre);
  this.tramite32616PerfilesMensajeriaStore.setCategoria(datos.categoria);
  this.tramite32616PerfilesMensajeriaStore.setVigencia(datos.vigencia);
  this.tramite32616PerfilesMensajeriaStore.setNombre2(datos.nombre2);
  this.tramite32616PerfilesMensajeriaStore.setCategoria2(datos.categoria2);
  this.tramite32616PerfilesMensajeriaStore.setVigenciaDos(datos.vigencia2);
  this.tramite32616PerfilesMensajeriaStore.setNombre3(datos.nombre3);
  this.tramite32616PerfilesMensajeriaStore.setCategoria3(datos.categoria3);
  this.tramite32616PerfilesMensajeriaStore.setVigenciaTres(datos.vigencia3);
}

actualizarTodosCamposTerceros(datos: Solicitud32616TercerosState): void {
  this.tramite32616TercerosStore.setResigtro(datos.resigtro);
  this.tramite32616TercerosStore.setTelefono(datos.telefono);
  this.tramite32616TercerosStore.setCorreo(datos.correo);
  this.tramite32616TercerosStore.setResigtroFedral(datos.resigtroFedral);
  this.tramite32616TercerosStore.setCargo(datos.cargo);
  this.tramite32616TercerosStore.setTelefonoEnlace(datos.telefonoEnlace);
  this.tramite32616TercerosStore.setCorreoEnlace(datos.correoEnlace);
  this.tramite32616TercerosStore.setSuplente(datos.suplente);
}

actualizarTodosCamposTramite(datos: Solicitud32616State): void {
  this.tramite32616Store.setSectorProductivo(datos.sectorProductivo);
  this.tramite32616Store.setServicio(datos.servicio);
  this.tramite32616Store.setSolicitudDeInspeccion(datos.solicitudDeInspeccion);
  this.tramite32616Store.setIndiqueAutorizo(datos.indiqueAutorizo);
  this.tramite32616Store.setSenaleCuentaEmpleados(datos.senaleCuentaEmpleados);
  this.tramite32616Store.setBimestre(datos.bimestre);
  this.tramite32616Store.setNumeroDeEmpleados(datos.numeroDeEmpleados);
  this.tramite32616Store.setCumpleConLaObligacion(datos.cumpleConLaObligacion);
  this.tramite32616Store.setAcreditaRealizar(datos.acreditaRealizar);
  this.tramite32616Store.setSenaleSiAlMomento(datos.senaleSiAlMomento);
  this.tramite32616Store.setRfc(datos.rfc);
  this.tramite32616Store.setNumeroDeEmpleadosForma(datos.numeroDeEmpleadosForma);
  this.tramite32616Store.setBimestreForma(datos.bimestreForma);
  this.tramite32616Store.setAcreditaCumplir(datos.acreditaCumplir);
  this.tramite32616Store.setFraccionVI(datos.fraccionVI);
  this.tramite32616Store.setNovenoParrafoDelCff(datos.novenoParrafoDelCff);
  this.tramite32616Store.setDigitalesEstanVigentes(datos.digitalesEstanVigentes);
  this.tramite32616Store.setUltimosDoceMeses(datos.ultimosDoceMeses);
  this.tramite32616Store.setPrestacionDeServicios(datos.prestacionDeServicios);
  this.tramite32616Store.setInstalacionesPrincipales(datos.instalacionesPrincipales);
  this.tramite32616Store.setMunicipioAlcaldia(datos.municipioAlcaldia);
  this.tramite32616Store.setTipoDeInstalcion(datos.tipoDeInstalcion);
  this.tramite32616Store.setProcesoProductivo(datos.procesoProductivo);
  this.tramite32616Store.setAcreditacionDelUso(datos.acreditacionDelUso);
  this.tramite32616Store.setPrefilMensajeria(datos.prefilMensajeria);
  this.tramite32616Store.setArticuloDelCff(datos.articuloDelCff);
  this.tramite32616Store.setExportadoresSectorial(datos.exportadoresSectorial);
  this.tramite32616Store.setArchivoNacionales(datos.archivoNacionales);
  this.tramite32616Store.setProveedores(datos.proveedores);
  this.tramite32616Store.setSolicitudDeCertificacion(datos.solicitudDeCertificacion);
  this.tramite32616Store.setControlInventarios(datos.controlInventarios);
  this.tramite32616Store.setNombreDelSistema(datos.nombreDelSistema);
  this.tramite32616Store.setLugarDeRadicacion(datos.lugarDeRadicacion);
  this.tramite32616Store.setPrevistas(datos.previstas);
  this.tramite32616Store.setDelCffLasReglas(datos.delCffLasReglas);
  this.tramite32616Store.setEnSeCaracter(datos.enSeCaracter);
  this.tramite32616Store.setObligadoTributar(datos.obligadoTributar);
  this.tramite32616Store.setNacionalidad(datos.nacionalidad);
  this.tramite32616Store.setConformidad(datos.conformidad);
  this.tramite32616Store.setEsquemaIntegralCertificacion(datos.esquemaIntegralCertificacion);
  this.tramite32616Store.setModificadasRevocadas(datos.modificadasRevocadas);
}
}
