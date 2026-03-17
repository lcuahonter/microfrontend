import { EnlaceOperativo, Instalacions } from '../models/solicitud.model';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { GuardarDatosFormulario } from '../models/solicitud.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inventarios } from '../models/solicitud.model';
import { Observable } from 'rxjs';
import { RecibirNotificaciones } from '../models/solicitud.model';
import { RepresentanteLegal } from '../models/solicitud.model';
import { SeccionSubcontratados } from '../models/solicitud.model';
import { Solicitud32607Store } from '../estados/solicitud32607.store';
import { SolicitudCatologoSelectLista } from '../models/solicitud.model';
import { SolicitudRadioLista } from '../models/solicitud.model';
import { TransportistasTable } from '../models/solicitud.model';

/**
 * Servicio encargado de obtener los datos necesarios para el llenado del formulario
 * de la solicitud 32607 a partir de archivos JSON locales.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Servicio encargado de obtener los datos necesarios para el llenado del formulario
 * de la solicitud 32607 a partir de archivos JSON locales.
 */
export class SolicitudService {
  /**
   * Constructor que inyecta el cliente HTTP.
   * @param http - Cliente HTTP para realizar peticiones.
   */
  constructor(
    private http: HttpClient,
    public solicitud32607Store: Solicitud32607Store
  ) {
    // Lógica del constructor aquí
  }

  /**
   * Obtiene la lista de opciones para recibir notificaciones.
   */
  conseguirRecibirNotificaciones(): Observable<RecibirNotificaciones[]> {
    return this.http.get<RecibirNotificaciones[]>(
      'assets/json/32607/recibir-notificaciones.json'
    );
  }

  /**
   * Obtiene la lista de enlaces operativos desde un archivo JSON local.
   * @returns Observable con un arreglo de EnlaceOperativo.
   */
  conseguirEnlaceOperativoDatos(): Observable<EnlaceOperativo[]> {
    return this.http.get<EnlaceOperativo[]>(
      'assets/json/32607/enlace-operativo-datos.json'
    );
  }

  /**
   * Obtiene los datos del representante legal desde un archivo JSON local.
   * @returns Observable con un objeto de tipo RepresentanteLegal.
   */
  conseguirRepresentanteLegalDatos(): Observable<RepresentanteLegal> {
    return this.http.get<RepresentanteLegal>(
      'assets/json/32607/representante-legal-datos.json'
    );
  }

  /**
   * Obtiene las opciones de radio de la solicitud desde un archivo JSON local.
   * @returns Observable con un objeto de tipo SolicitudRadioLista.
   */
  conseguirOpcionDeRadio(): Observable<SolicitudRadioLista> {
    return this.http.get<SolicitudRadioLista>(
      'assets/json/32607/solicitud-radio-lista.json'
    );
  }

  /**
   * Obtiene la lista de transportistas desde un archivo JSON local.
   * @returns Observable con un arreglo de TransportistasTable.
   */
  conseguirTransportistasLista(): Observable<TransportistasTable[]> {
    return this.http.get<TransportistasTable[]>(
      'assets/json/32607/transportistas-lista.json'
    );
  }

  /**
   * Obtiene los catálogos selectivos de la solicitud desde un archivo JSON local.
   * @returns Observable con un objeto de tipo SolicitudCatologoSelectLista.
   */
  conseguirSolicitudCatologoSelectLista(): Observable<SolicitudCatologoSelectLista> {
    return this.http.get<SolicitudCatologoSelectLista>(
      'assets/json/32607/solicitud-catologo-select-lista.json'
    );
  }

  /**
   * Obtiene los datos de la sección de subcontratados desde un archivo JSON local.
   * @returns Observable con un objeto de tipo SeccionSubcontratados.
   */
  conseguirSeccionSubcontratados(): Observable<SeccionSubcontratados> {
    return this.http.get<SeccionSubcontratados>(
      'assets/json/32607/seccion-subcontratados.json'
    );
  }

  /**
   * Obtiene los inventarios registrados desde un archivo JSON local.
   * @returns Observable con un arreglo de Inventarios.
   */
  conseguirInventarios(): Observable<Inventarios[]> {
    return this.http.get<Inventarios[]>(
      'assets/json/32607/inventarios-datos.json'
    );
  }

  /**
   * Realiza una solicitud HTTP GET para obtener los datos guardados del formulario
   * desde un archivo JSON local.
   *
   * @returns {Observable<GuardarDatosFormulario>} Un observable que emite los datos del formulario.
   */
  guardarDatosFormulario(): Observable<GuardarDatosFormulario> {
    return this.http.get<GuardarDatosFormulario>(
      'assets/json/32607/guardar-datos-formulario.json'
    );
  }

  guardarInstalacions(): Observable<Instalacions[]> {
    return this.http.get<Instalacions[]>('assets/json/32607/instalacions.json');
  }

  guardarEntidadFederative(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      'assets/json/32607/entidad-federative.json'
    );
  }

  /**
   * Actualiza el estado del formulario en el store `solicitud32607Store`
   * con los datos proporcionados en la respuesta.
   *
   * @param {GuardarDatosFormulario} resp - Objeto con la información del formulario a actualizar.
   */
  actualizarEstadoFormulario(resp: GuardarDatosFormulario): void {
    this.solicitud32607Store.actualizar190(resp[190]);
    this.solicitud32607Store.actualizar191(resp[191]);
    this.solicitud32607Store.actualizar199(resp[199]);
    this.solicitud32607Store.actualizar2034(resp[2034]);
    this.solicitud32607Store.actualizar236(resp[236]);
    this.solicitud32607Store.actualizar237(resp[237]);
    this.solicitud32607Store.actualizar238(resp[238]);
    this.solicitud32607Store.actualizar239(resp[239]);
    this.solicitud32607Store.actualizar240(resp[240]);
    this.solicitud32607Store.actualizar243(resp[243]);
    this.solicitud32607Store.actualizar244(resp[244]);
    this.solicitud32607Store.actualizar245(resp[245]);
    this.solicitud32607Store.actualizar246(resp[246]);
    this.solicitud32607Store.actualizar247(resp[247]);
    this.solicitud32607Store.actualizar248(resp[248]);
    this.solicitud32607Store.actualizar249(resp[249]);
    this.solicitud32607Store.actualizar250(resp[250]);
    this.solicitud32607Store.actualizar251(resp[251]);
    this.solicitud32607Store.actualizarIdPersonaSolicitud(
      resp.idPersonaSolicitud
    );
    this.solicitud32607Store.actualizarRfcTercero(resp.rfcTercero);
    this.solicitud32607Store.actualizarRfc(resp.rfc);
    this.solicitud32607Store.actualizarNombre(resp.nombre);
    this.solicitud32607Store.actualizarApellidoPaterno(resp.apellidoPaterno);
    this.solicitud32607Store.actualizarApellidoMaterno(resp.apellidoMaterno);
    this.solicitud32607Store.actualizarTelefono(resp.telefono);
    this.solicitud32607Store.actualizarCorreoElectronico(
      resp.correoElectronico
    );
    this.solicitud32607Store.actualizarEnlaceRfcTercero(
      resp.agregarEnlaceRfcTercero
    );
    this.solicitud32607Store.actualizarEnlaceRfc(resp.agregarEnlaceRfc);
    this.solicitud32607Store.actualizarEnlaceNombre(resp.agregarEnlaceNombre);
    this.solicitud32607Store.actualizarEnlaceApellidoPaterno(
      resp.agregarEnlaceApellidoPaterno
    );
    this.solicitud32607Store.actualizarEnlaceApellidoMaterno(
      resp.agregarEnlaceApellidoMaterno
    );
    this.solicitud32607Store.actualizarEnlaceCiudadEstado(
      resp.agregarEnlaceCiudadEstado
    );
    this.solicitud32607Store.actualizarEnlaceCargo(resp.agregarEnlaceCargo);
    this.solicitud32607Store.actualizarEnlaceTelefono(
      resp.agregarEnlaceTelefono
    );
    this.solicitud32607Store.actualizarEnlaceCorreoElectronico(
      resp.agregarEnlaceCorreoElectronico
    );
    this.solicitud32607Store.actualizarEnlaceSuplente(
      resp.agregarEnlaceSuplente
    );
    this.solicitud32607Store.actualizar2089(resp[2089]);
    this.solicitud32607Store.actualizar2090(resp[2090]);
    this.solicitud32607Store.actualizar2091(resp[2091]);
    this.solicitud32607Store.actualizar2042(resp[2042]);
    this.solicitud32607Store.actualizar2043(resp[2043]);
    this.solicitud32607Store.actualizar2044(resp[2044]);
    this.solicitud32607Store.actualizarFechaInicioComercio(
      resp.fechaInicioComercio
    );
    this.solicitud32607Store.actualizarFechaPago(resp.fechaPago);
    this.solicitud32607Store.actualizarMonto(resp.monto);
    this.solicitud32607Store.actualizarOperacionesBancarias(
      resp.operacionesBancarias
    );
    this.solicitud32607Store.actualizarLlavePago(resp.llavePago);
    this.solicitud32607Store.actualizarTransportistaRFC(resp.transportistaRFC);
    this.solicitud32607Store.actualizarTransportistaRFCModifTrans(
      resp.transportistaRFCModifTrans
    );
    this.solicitud32607Store.actualizarTransportistaRazonSocial(
      resp.transportistaRazonSocial
    );
    this.solicitud32607Store.actualizarTransportistaDomicilio(
      resp.transportistaDomicilio
    );
    this.solicitud32607Store.actualizarTransportistaCaat(
      resp.transportistaCaat
    );
    this.solicitud32607Store.actualizarTransportistaIdDomicilio(
      resp.transportistaIdDomicilio
    );
    this.solicitud32607Store.actualizarTransportistaIdRFC(
      resp.transportistaIdRFC
    );
    this.solicitud32607Store.actualizarTransportistaIdRazonSocial(
      resp.transportistaIdRazonSocial
    );
    this.solicitud32607Store.actualizarTransportistaIdCaat(
      resp.transportistaIdCaat
    );
    this.solicitud32607Store.actualizarMiembroCaracterDe(
      resp.miembroCaracterDe
    );
    this.solicitud32607Store.actualizarMiembroTributarMexico(
      resp.miembroTributarMexico
    );
    this.solicitud32607Store.actualizarMiembroNacionalidad(
      resp.miembroNacionalidad
    );
    this.solicitud32607Store.actualizarMiembroRFC(resp.miembroRfc);
    this.solicitud32607Store.actualizarMiembroRegistroFederal(
      resp.miembroRegistroFederal
    );
    this.solicitud32607Store.actualizarMiembroNombreCompleto(
      resp.miembroNombreCompleto
    );
    this.solicitud32607Store.actualizarMiembroTipoPersonaMuestra(
      resp.miembroTipoPersonaMuestra
    );
    this.solicitud32607Store.actualizarMiembroNombre(resp.miembroNombre);
    this.solicitud32607Store.actualizarMiembroApellidoPaterno(
      resp.miembroApellidoPaterno
    );
    this.solicitud32607Store.actualizarMiembroApellidoMaterno(
      resp.miembroApellidoMaterno
    );
    this.solicitud32607Store.actualizarMiembroNombreEmpresa(
      resp.miembroNombreEmpresa
    );
    this.solicitud32607Store.actualizarSubcontrataRFCBusqueda(
      resp.subcontrataRFCBusqueda
    );
    this.solicitud32607Store.actualizarSubcontrataRFC(resp.subcontrataRFC);
    this.solicitud32607Store.actualizarSubcontrataRazonSocial(
      resp.subcontrataRazonSocial
    );
    this.solicitud32607Store.actualizarSubcontrataEmpleados(
      resp.subcontrataEmpleados
    );
    this.solicitud32607Store.actualizarSubcontrataBimestre(
      resp.subcontrataBimestre
    );
    this.solicitud32607Store.actualizarPrincipales(resp.principales);
    this.solicitud32607Store.actualizarMunicipio(resp.municipio);
    this.solicitud32607Store.actualizarTipoDeInstalacion(
      resp.tipoDeInstalacion
    );
    this.solicitud32607Store.actualizarEntidadFederativa(
      resp.entidadFederativa
    );
    this.solicitud32607Store.actualizarRegistroSESAT(resp.registroSESAT);
    this.solicitud32607Store.actualizarDescripcion(resp.descripcion);
    this.solicitud32607Store.actualizarCodigoPostal(resp.codigoPostal);
    this.solicitud32607Store.actualizarProcesoProductivo(
      resp.procesoProductivo
    );
    this.solicitud32607Store.actualizarGoceDelInmueble(resp.goceDelInmueble);
    this.solicitud32607Store.actualizarEmpresa(resp.empresa);
    this.solicitud32607Store.actualizarComercioExterior(resp.comercioExterior);
    this.solicitud32607Store.actualizarMutuo(resp.mutuo);
    this.solicitud32607Store.actualizarCatseleccionados(resp.catseleccionados);
    this.solicitud32607Store.actualizarServicio(resp.servicio);
    this.solicitud32607Store.actualizarEmpleados(resp.empleados);
    this.solicitud32607Store.actualizarBimestre(resp.bimestre);
    this.solicitud32607Store.actualizarIndiqueTodos(resp.indiqueTodos);
    this.solicitud32607Store.actualizarFile1(resp.file1);
    this.solicitud32607Store.actualizarFile2(resp.file2);
    this.solicitud32607Store.actualizarIdentificacion(resp.identificacion);
    this.solicitud32607Store.actualizarLugarDeRadicacion(
      resp.lugarDeRadicacion
    );
    this.solicitud32607Store.actualizarCheckbox1(resp.checkbox1);
    this.solicitud32607Store.actualizarCheckbox2(resp.checkbox2);
    this.solicitud32607Store.actualizarCheckbox3(resp.checkbox3);
    this.solicitud32607Store.actualizarActualmente2(resp.actualmente2);
    this.solicitud32607Store.actualizarActualmente1(resp.actualmente1);
  }
}
