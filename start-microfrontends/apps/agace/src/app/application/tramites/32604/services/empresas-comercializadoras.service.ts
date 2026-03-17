import { EnlaceOperativo, GuardarDatosFormulario, RecibirNotificaciones, RepresentanteLegal, RespuestaConsulta, SeccionSubcontratados, SolicitudCatologoSelectLista, SolicitudRadioLista, TransportistasTable } from '../models/empresas-comercializadoras.model';
import { Instalaciones, RespuestaAduanas } from '../constants/agregar.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Solicitud32604Store } from '../estados/solicitud32604.store';

/**
 * Servicio encargado de obtener los datos necesarios para el llenado del formulario
 * de la solicitud 32604 a partir de archivos JSON locales.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Servicio encargado de obtener los datos necesarios para el llenado del formulario
 * de la solicitud 32604 a partir de archivos JSON locales.
 */
export class EmpresasComercializadorasService {
  /**
   * Constructor que inyecta el cliente HTTP.
   * @param http - Cliente HTTP para realizar peticiones.
   */
  constructor(
    private http: HttpClient,
    public solicitud32604Store: Solicitud32604Store
  ) {
    // Lógica del constructor aquí
  }

  /**
   * Obtiene la lista de opciones para recibir notificaciones.
   */
  conseguirRecibirNotificaciones(): Observable<RecibirNotificaciones[]> {
    return this.http.get<RecibirNotificaciones[]>(
      'assets/json/32604/recibir-notificaciones.json'
    );
  }

  /**
   * Obtiene la lista de enlaces operativos desde un archivo JSON local.
   * @returns Observable con un arreglo de EnlaceOperativo.
   */
  conseguirEnlaceOperativoDatos(): Observable<EnlaceOperativo[]> {
    return this.http.get<EnlaceOperativo[]>(
      'assets/json/32604/enlace-operativo-datos.json'
    );
  }

  /**
   * Obtiene los datos del representante legal desde un archivo JSON local.
   * @returns Observable con un objeto de tipo RepresentanteLegal.
   */
  conseguirRepresentanteLegalDatos(): Observable<RepresentanteLegal> {
    return this.http.get<RepresentanteLegal>(
      'assets/json/32604/representante-legal-datos.json'
    );
  }

  /**
   * Obtiene las opciones de radio de la solicitud desde un archivo JSON local.
   * @returns Observable con un objeto de tipo SolicitudRadioLista.
   */
  conseguirOpcionDeRadio(): Observable<SolicitudRadioLista> {
    return this.http.get<SolicitudRadioLista>(
      'assets/json/32604/solicitud-radio-lista.json'
    );
  }

  /**
   * Obtiene la lista de transportistas desde un archivo JSON local.
   * @returns Observable con un arreglo de TransportistasTable.
   */
  conseguirTransportistasLista(): Observable<TransportistasTable[]> {
    return this.http.get<TransportistasTable[]>(
      'assets/json/32604/transportistas-lista.json'
    );
  }

  /**
   * Obtiene los catálogos selectivos de la solicitud desde un archivo JSON local.
   * @returns Observable con un objeto de tipo SolicitudCatologoSelectLista.
   */
  conseguirSolicitudCatologoSelectLista(): Observable<SolicitudCatologoSelectLista> {
    return this.http.get<SolicitudCatologoSelectLista>(
      'assets/json/32604/solicitud-catologo-select-lista.json'
    );
  }

  /**
   * Obtiene los datos de la sección de subcontratados desde un archivo JSON local.
   * @returns Observable con un objeto de tipo SeccionSubcontratados.
   */
  conseguirSeccionSubcontratados(): Observable<SeccionSubcontratados> {
    return this.http.get<SeccionSubcontratados>(
      'assets/json/32604/seccion-subcontratados.json'
    );
  }

  /**
   * Realiza una solicitud HTTP GET para obtener los datos guardados del formulario
   * desde un archivo JSON local.
   *
   * @returns {Observable<GuardarDatosFormulario>} Un observable que emite los datos del formulario.
   */
  guardarDatosFormulario(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>(
      'assets/json/32604/guardar-datos-formulario.json'
    );
  }

  /**
   * Obtiene la lista de entidades desde un archivo JSON local.
   *
   * @returns Un Observable que emite la respuesta con la lista de aduanas (RespuestaAduanas).
   */
  getEntidadList(): Observable<RespuestaAduanas> {
    return this.http.get<RespuestaAduanas>(
      'assets/json/32604/entidad-list.json'
    );
  }

    /**
   * Obtener datos de la tabla
   * 
   * @returns {Observable<RespuestaCatalogos[]>} Un observable con la respuesta de los datos de la tabla.
   */
  getDatosTableData(): Observable<Instalaciones[]> {
    return this.http.get<Instalaciones[]>(`assets/json/32604/datosTabla.json`);
  }

  /**
   * Obtener una lista de Contenedores
   * 
   * @returns {Observable<RespuestaContenedores>} Un observable con la respuesta de contenedores.
   */
  getContenedores(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`assets/json/32604/tipoLista.json`);
  }
  /**
   * Obtener una lista de obtenerTipoInstalacion
   * 
   * @returns {Observable<RespuestaContenedores>} Un observable con respuesta de contenedor para obtenerTipoInstalacion.
   */
  obtenerTipoInstalacion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`assets/json/32604/tipoInstalacion.json`);
  }
  /**
   * Obtener una lista de Contenedores
   * 
   * @returns {Observable<RespuestaContenedores>} Un observable con la respuesta de contenedores.
   */
  getNationalidad(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`assets/json/32604/nacionalidad.json`);
  }
  /**
   * Obtener una lista de Contenedores
   * 
   * @returns {Observable<RespuestaContenedores>} Un observable con la respuesta de contenedores.
   */
  getTipPersona(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`assets/json/32604/tipo-persona.json`);
  }
  /**
   * Actualiza el estado del formulario en el store `solicitud32604Store`
   * con los datos proporcionados en la respuesta.
   *
   * @param {GuardarDatosFormulario} resp - Objeto con la información del formulario a actualizar.
   */
  actualizarEstadoFormulario(resp: GuardarDatosFormulario): void {
    this.solicitud32604Store.actualizar190(resp[190]);
    this.solicitud32604Store.actualizar191(resp[191]);
    this.solicitud32604Store.actualizar199(resp[199]);
    this.solicitud32604Store.actualizar2034(resp[2034]);
    this.solicitud32604Store.actualizar236(resp[236]);
    this.solicitud32604Store.actualizar237(resp[237]);
    this.solicitud32604Store.actualizar238(resp[238]);
    this.solicitud32604Store.actualizar239(resp[239]);
    this.solicitud32604Store.actualizar240(resp[240]);
    this.solicitud32604Store.actualizar243(resp[243]);
    this.solicitud32604Store.actualizar244(resp[244]);
    this.solicitud32604Store.actualizar245(resp[245]);
    this.solicitud32604Store.actualizar246(resp[246]);
    this.solicitud32604Store.actualizar247(resp[247]);
    this.solicitud32604Store.actualizar248(resp[248]);
    this.solicitud32604Store.actualizar249(resp[249]);
    this.solicitud32604Store.actualizar250(resp[250]);
    this.solicitud32604Store.actualizar251(resp[251]);
    this.solicitud32604Store.actualizarIdPersonaSolicitud(
      resp.idPersonaSolicitud
    );
    this.solicitud32604Store.actualizarRfcTercero(resp.rfcTercero);
    this.solicitud32604Store.actualizarRfc(resp.rfc);
    this.solicitud32604Store.actualizarNombre(resp.nombre);
    this.solicitud32604Store.actualizarApellidoPaterno(resp.apellidoPaterno);
    this.solicitud32604Store.actualizarApellidoMaterno(resp.apellidoMaterno);
    this.solicitud32604Store.actualizarTelefono(resp.telefono);
    this.solicitud32604Store.actualizarCorreoElectronico(
      resp.correoElectronico
    );
    this.solicitud32604Store.actualizarEnlaceRfcTercero(
      resp.agregarEnlaceRfcTercero
    );
    this.solicitud32604Store.actualizarEnlaceRfc(resp.agregarEnlaceRfc);
    this.solicitud32604Store.actualizarEnlaceNombre(resp.agregarEnlaceNombre);
    this.solicitud32604Store.actualizarEnlaceApellidoPaterno(
      resp.agregarEnlaceApellidoPaterno
    );
    this.solicitud32604Store.actualizarEnlaceApellidoMaterno(
      resp.agregarEnlaceApellidoMaterno
    );
    this.solicitud32604Store.actualizarEnlaceCiudadEstado(
      resp.agregarEnlaceCiudadEstado
    );
    this.solicitud32604Store.actualizarEnlaceCargo(resp.agregarEnlaceCargo);
    this.solicitud32604Store.actualizarEnlaceTelefono(
      resp.agregarEnlaceTelefono
    );
    this.solicitud32604Store.actualizarEnlaceCorreoElectronico(
      resp.agregarEnlaceCorreoElectronico
    );
    this.solicitud32604Store.actualizarEnlaceSuplente(
      resp.agregarEnlaceSuplente
    );
    this.solicitud32604Store.actualizar2089(resp[2089]);
    this.solicitud32604Store.actualizar2090(resp[2090]);
    this.solicitud32604Store.actualizar2091(resp[2091]);
    this.solicitud32604Store.actualizar2042(resp[2042]);
    this.solicitud32604Store.actualizar2043(resp[2043]);
    this.solicitud32604Store.actualizar2044(resp[2044]);
    this.solicitud32604Store.actualizarFechaInicioComercio(
      resp.fechaInicioComercio
    );
    this.solicitud32604Store.actualizarFechaPago(resp.fechaPago);
    this.solicitud32604Store.actualizarMonto(resp.monto);
    this.solicitud32604Store.actualizarOperacionesBancarias(
      resp.operacionesBancarias
    );
    this.solicitud32604Store.actualizarLlavePago(resp.llavePago);
    this.solicitud32604Store.actualizarTransportistaRFC(resp.transportistaRFC);
    this.solicitud32604Store.actualizarTransportistaRFCModifTrans(
      resp.transportistaRFCModifTrans
    );
    this.solicitud32604Store.actualizarTransportistaRazonSocial(
      resp.transportistaRazonSocial
    );
    this.solicitud32604Store.actualizarTransportistaDomicilio(
      resp.transportistaDomicilio
    );
    this.solicitud32604Store.actualizarTransportistaCaat(
      resp.transportistaCaat
    );
    this.solicitud32604Store.actualizarTransportistaIdDomicilio(
      resp.transportistaIdDomicilio
    );
    this.solicitud32604Store.actualizarTransportistaIdRFC(
      resp.transportistaIdRFC
    );
    this.solicitud32604Store.actualizarTransportistaIdRazonSocial(
      resp.transportistaIdRazonSocial
    );
    this.solicitud32604Store.actualizarTransportistaIdCaat(
      resp.transportistaIdCaat
    );
    this.solicitud32604Store.actualizarMiembroCaracterDe(
      resp.miembroCaracterDe
    );
    this.solicitud32604Store.actualizarMiembroTributarMexico(
      resp.miembroTributarMexico
    );
    this.solicitud32604Store.actualizarMiembroNacionalidad(
      resp.miembroNacionalidad
    );
    this.solicitud32604Store.actualizarMiembroRFC(resp.miembroRfc);
    this.solicitud32604Store.actualizarMiembroRegistroFederal(
      resp.miembroRegistroFederal
    );
    this.solicitud32604Store.actualizarMiembroNombreCompleto(
      resp.miembroNombreCompleto
    );
    this.solicitud32604Store.actualizarMiembroTipoPersonaMuestra(
      resp.miembroTipoPersonaMuestra
    );
    this.solicitud32604Store.actualizarMiembroNombre(resp.miembroNombre);
    this.solicitud32604Store.actualizarMiembroApellidoPaterno(
      resp.miembroApellidoPaterno
    );
    this.solicitud32604Store.actualizarMiembroApellidoMaterno(
      resp.miembroApellidoMaterno
    );
    this.solicitud32604Store.actualizarMiembroNombreEmpresa(
      resp.miembroNombreEmpresa
    );
    this.solicitud32604Store.actualizarSubcontrataRFCBusqueda(
      resp.subcontrataRFCBusqueda
    );
    this.solicitud32604Store.actualizarSubcontrataRFC(resp.subcontrataRFC);
    this.solicitud32604Store.actualizarSubcontrataRazonSocial(
      resp.subcontrataRazonSocial
    );
    this.solicitud32604Store.actualizarSubcontrataEmpleados(
      resp.subcontrataEmpleados
    );
    this.solicitud32604Store.actualizarSubcontrataBimestre(
      resp.subcontrataBimestre
    );
    this.solicitud32604Store.actualizarPrincipales(resp.principales);
    this.solicitud32604Store.actualizarMunicipio(resp.municipio);
    this.solicitud32604Store.actualizarTipoDeInstalacion(
      resp.tipoDeInstalacion
    );
    this.solicitud32604Store.actualizarEntidadFederativa(
      resp.entidadFederativa
    );
    this.solicitud32604Store.actualizarRegistroSESAT(resp.registroSESAT);
    this.solicitud32604Store.actualizarDescripcion(resp.descripcion);
    this.solicitud32604Store.actualizarCodigoPostal(resp.codigoPostal);
    this.solicitud32604Store.actualizarProcesoProductivo(
      resp.procesoProductivo
    );
    this.solicitud32604Store.actualizarGoceDelInmueble(resp.goceDelInmueble);
    this.solicitud32604Store.actualizarEmpresa(resp.empresa);
    this.solicitud32604Store.actualizarComercioExterior(resp.comercioExterior);
    this.solicitud32604Store.actualizarMutuo(resp.mutuo);
    this.solicitud32604Store.actualizarCatseleccionados(resp.catseleccionados);
    this.solicitud32604Store.actualizarServicio(resp.servicio);
    this.solicitud32604Store.actualizarEmpleados(resp.empleados);
    this.solicitud32604Store.actualizarBimestre(resp.bimestre);
    this.solicitud32604Store.actualizarIndiqueTodos(resp.indiqueTodos);
    this.solicitud32604Store.actualizarFile1(resp.file1);
    this.solicitud32604Store.actualizarFile2(resp.file2);
    this.solicitud32604Store.actualizarIdentificacion(resp.identificacion);
    this.solicitud32604Store.actualizarLugarDeRadicacion(
      resp.lugarDeRadicacion
    );
    this.solicitud32604Store.actualizarCheckbox1(resp.checkbox1);
    this.solicitud32604Store.actualizarCheckbox2(resp.checkbox2);
    this.solicitud32604Store.actualizarCheckbox3(resp.checkbox3);
    this.solicitud32604Store.actualizarActualmente2(resp.actualmente2);
    this.solicitud32604Store.actualizarActualmente1(resp.actualmente1);
  }
}
