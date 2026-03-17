import { EnlaceOperativo } from '../models/solicitud.model';
import { GuardarDatosFormulario } from '../models/solicitud.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inventarios } from '../models/solicitud.model';
import { Observable } from 'rxjs';
import { RecibirNotificaciones } from '../models/solicitud.model';
import { RepresentanteLegal } from '../models/solicitud.model';
import { SeccionSubcontratados } from '../models/solicitud.model';
import { Solicitud32614Store } from '../estados/solicitud32614.store';
import { SolicitudCatologoSelectLista } from '../models/solicitud.model';
import { SolicitudRadioLista } from '../models/solicitud.model';
import { TransportistasTable } from '../models/solicitud.model';

/**
 * Servicio encargado de obtener los datos necesarios para el llenado del formulario
 * de la solicitud 32614 a partir de archivos JSON locales.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Servicio encargado de obtener los datos necesarios para el llenado del formulario
 * de la solicitud 32614 a partir de archivos JSON locales.
 */
export class SolicitudService {
  /**
   * Constructor que inyecta el cliente HTTP.
   * @param http - Cliente HTTP para realizar peticiones.
   */
  constructor(
    private http: HttpClient,
    public solicitud32614Store: Solicitud32614Store
  ) {
    // Lógica del constructor aquí
  }

  /**
   * Obtiene la lista de opciones para recibir notificaciones.
   */
  conseguirRecibirNotificaciones(): Observable<RecibirNotificaciones[]> {
    return this.http.get<RecibirNotificaciones[]>(
      'assets/json/32614/recibir-notificaciones.json'
    );
  }

  /**
   * Obtiene la lista de enlaces operativos desde un archivo JSON local.
   * @returns Observable con un arreglo de EnlaceOperativo.
   */
  conseguirEnlaceOperativoDatos(): Observable<EnlaceOperativo[]> {
    return this.http.get<EnlaceOperativo[]>(
      'assets/json/32614/enlace-operativo-datos.json'
    );
  }

  /**
   * Obtiene los datos del representante legal desde un archivo JSON local.
   * @returns Observable con un objeto de tipo RepresentanteLegal.
   */
  conseguirRepresentanteLegalDatos(): Observable<RepresentanteLegal> {
    return this.http.get<RepresentanteLegal>(
      'assets/json/32614/representante-legal-datos.json'
    );
  }

  /**
   * Obtiene las opciones de radio de la solicitud desde un archivo JSON local.
   * @returns Observable con un objeto de tipo SolicitudRadioLista.
   */
  conseguirOpcionDeRadio(): Observable<SolicitudRadioLista> {
    return this.http.get<SolicitudRadioLista>(
      'assets/json/32614/solicitud-radio-lista.json'
    );
  }

  /**
   * Obtiene la lista de transportistas desde un archivo JSON local.
   * @returns Observable con un arreglo de TransportistasTable.
   */
  conseguirTransportistasLista(): Observable<TransportistasTable[]> {
    return this.http.get<TransportistasTable[]>(
      'assets/json/32614/transportistas-lista.json'
    );
  }

  /**
   * Obtiene los catálogos selectivos de la solicitud desde un archivo JSON local.
   * @returns Observable con un objeto de tipo SolicitudCatologoSelectLista.
   */
  conseguirSolicitudCatologoSelectLista(): Observable<SolicitudCatologoSelectLista> {
    return this.http.get<SolicitudCatologoSelectLista>(
      'assets/json/32614/solicitud-catologo-select-lista.json'
    );
  }

  /**
   * Obtiene los datos de la sección de subcontratados desde un archivo JSON local.
   * @returns Observable con un objeto de tipo SeccionSubcontratados.
   */
  conseguirSeccionSubcontratados(): Observable<SeccionSubcontratados> {
    return this.http.get<SeccionSubcontratados>(
      'assets/json/32614/seccion-subcontratados.json'
    );
  }

  /**
   * Obtiene los inventarios registrados desde un archivo JSON local.
   * @returns Observable con un arreglo de Inventarios.
   */
  conseguirInventarios(): Observable<Inventarios[]> {
    return this.http.get<Inventarios[]>(
      'assets/json/32614/inventarios-datos.json'
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
      'assets/json/32614/guardar-datos-formulario.json'
    );
  }

  /**
   * Actualiza el estado del formulario en el store `solicitud32614Store`
   * con los datos proporcionados en la respuesta.
   *
   * @param {GuardarDatosFormulario} resp - Objeto con la información del formulario a actualizar.
   */
  actualizarEstadoFormulario(resp: GuardarDatosFormulario): void {
    this.solicitud32614Store.actualizar190(resp[190]);
    this.solicitud32614Store.actualizar191(resp[191]);
    this.solicitud32614Store.actualizar199(resp[199]);
    this.solicitud32614Store.actualizar2034(resp[2034]);
    this.solicitud32614Store.actualizar236(resp[236]);
    this.solicitud32614Store.actualizar237(resp[237]);
    this.solicitud32614Store.actualizar238(resp[238]);
    this.solicitud32614Store.actualizar239(resp[239]);
    this.solicitud32614Store.actualizar240(resp[240]);
    this.solicitud32614Store.actualizar243(resp[243]);
    this.solicitud32614Store.actualizar244(resp[244]);
    this.solicitud32614Store.actualizar245(resp[245]);
    this.solicitud32614Store.actualizar246(resp[246]);
    this.solicitud32614Store.actualizar247(resp[247]);
    this.solicitud32614Store.actualizar248(resp[248]);
    this.solicitud32614Store.actualizar249(resp[249]);
    this.solicitud32614Store.actualizar250(resp[250]);
    this.solicitud32614Store.actualizar251(resp[251]);
    this.solicitud32614Store.actualizarIdPersonaSolicitud(
      resp.idPersonaSolicitud
    );
    this.solicitud32614Store.actualizarRfcTercero(resp.rfcTercero);
    this.solicitud32614Store.actualizarRfc(resp.rfc);
    this.solicitud32614Store.actualizarNombre(resp.nombre);
    this.solicitud32614Store.actualizarApellidoPaterno(resp.apellidoPaterno);
    this.solicitud32614Store.actualizarApellidoMaterno(resp.apellidoMaterno);
    this.solicitud32614Store.actualizarTelefono(resp.telefono);
    this.solicitud32614Store.actualizarCorreoElectronico(
      resp.correoElectronico
    );
    this.solicitud32614Store.actualizarEnlaceRfcTercero(
      resp.agregarEnlaceRfcTercero
    );
    this.solicitud32614Store.actualizarEnlaceRfc(resp.agregarEnlaceRfc);
    this.solicitud32614Store.actualizarEnlaceNombre(resp.agregarEnlaceNombre);
    this.solicitud32614Store.actualizarEnlaceApellidoPaterno(
      resp.agregarEnlaceApellidoPaterno
    );
    this.solicitud32614Store.actualizarEnlaceApellidoMaterno(
      resp.agregarEnlaceApellidoMaterno
    );
    this.solicitud32614Store.actualizarEnlaceCiudadEstado(
      resp.agregarEnlaceCiudadEstado
    );
    this.solicitud32614Store.actualizarEnlaceCargo(resp.agregarEnlaceCargo);
    this.solicitud32614Store.actualizarEnlaceTelefono(
      resp.agregarEnlaceTelefono
    );
    this.solicitud32614Store.actualizarEnlaceCorreoElectronico(
      resp.agregarEnlaceCorreoElectronico
    );
    this.solicitud32614Store.actualizarEnlaceSuplente(
      resp.agregarEnlaceSuplente
    );
    this.solicitud32614Store.actualizar2089(resp[2089]);
    this.solicitud32614Store.actualizar2090(resp[2090]);
    this.solicitud32614Store.actualizar2091(resp[2091]);
    this.solicitud32614Store.actualizar2042(resp[2042]);
    this.solicitud32614Store.actualizar2043(resp[2043]);
    this.solicitud32614Store.actualizar2044(resp[2044]);
    this.solicitud32614Store.actualizarFechaInicioComercio(
      resp.fechaInicioComercio
    );
    this.solicitud32614Store.actualizarFechaPago(resp.fechaPago);
    this.solicitud32614Store.actualizarMonto(resp.monto);
    this.solicitud32614Store.actualizarOperacionesBancarias(
      resp.operacionesBancarias
    );
    this.solicitud32614Store.actualizarLlavePago(resp.llavePago);
    this.solicitud32614Store.actualizarTransportistaRFC(resp.transportistaRFC);
    this.solicitud32614Store.actualizarTransportistaRFCModifTrans(
      resp.transportistaRFCModifTrans
    );
    this.solicitud32614Store.actualizarTransportistaRazonSocial(
      resp.transportistaRazonSocial
    );
    this.solicitud32614Store.actualizarTransportistaDomicilio(
      resp.transportistaDomicilio
    );
    this.solicitud32614Store.actualizarTransportistaCaat(
      resp.transportistaCaat
    );
    this.solicitud32614Store.actualizarTransportistaIdDomicilio(
      resp.transportistaIdDomicilio
    );
    this.solicitud32614Store.actualizarTransportistaIdRFC(
      resp.transportistaIdRFC
    );
    this.solicitud32614Store.actualizarTransportistaIdRazonSocial(
      resp.transportistaIdRazonSocial
    );
    this.solicitud32614Store.actualizarTransportistaIdCaat(
      resp.transportistaIdCaat
    );
    this.solicitud32614Store.actualizarMiembroCaracterDe(
      resp.miembroCaracterDe
    );
    this.solicitud32614Store.actualizarMiembroTributarMexico(
      resp.miembroTributarMexico
    );
    this.solicitud32614Store.actualizarMiembroNacionalidad(
      resp.miembroNacionalidad
    );
    this.solicitud32614Store.actualizarMiembroRFC(resp.miembroRfc);
    this.solicitud32614Store.actualizarMiembroRegistroFederal(
      resp.miembroRegistroFederal
    );
    this.solicitud32614Store.actualizarMiembroNombreCompleto(
      resp.miembroNombreCompleto
    );
    this.solicitud32614Store.actualizarMiembroTipoPersonaMuestra(
      resp.miembroTipoPersonaMuestra
    );
    this.solicitud32614Store.actualizarMiembroNombre(resp.miembroNombre);
    this.solicitud32614Store.actualizarMiembroApellidoPaterno(
      resp.miembroApellidoPaterno
    );
    this.solicitud32614Store.actualizarMiembroApellidoMaterno(
      resp.miembroApellidoMaterno
    );
    this.solicitud32614Store.actualizarMiembroNombreEmpresa(
      resp.miembroNombreEmpresa
    );
    this.solicitud32614Store.actualizarSubcontrataRFCBusqueda(
      resp.subcontrataRFCBusqueda
    );
    this.solicitud32614Store.actualizarSubcontrataRFC(resp.subcontrataRFC);
    this.solicitud32614Store.actualizarSubcontrataRazonSocial(
      resp.subcontrataRazonSocial
    );
    this.solicitud32614Store.actualizarSubcontrataEmpleados(
      resp.subcontrataEmpleados
    );
    this.solicitud32614Store.actualizarSubcontrataBimestre(
      resp.subcontrataBimestre
    );
    this.solicitud32614Store.actualizarPrincipales(resp.principales);
    this.solicitud32614Store.actualizarMunicipio(resp.municipio);
    this.solicitud32614Store.actualizarTipoDeInstalacion(
      resp.tipoDeInstalacion
    );
    this.solicitud32614Store.actualizarEntidadFederativa(
      resp.entidadFederativa
    );
    this.solicitud32614Store.actualizarRegistroSESAT(resp.registroSESAT);
    this.solicitud32614Store.actualizarDescripcion(resp.descripcion);
    this.solicitud32614Store.actualizarCodigoPostal(resp.codigoPostal);
    this.solicitud32614Store.actualizarProcesoProductivo(
      resp.procesoProductivo
    );
    this.solicitud32614Store.actualizarGoceDelInmueble(resp.goceDelInmueble);
    this.solicitud32614Store.actualizarEmpresa(resp.empresa);
    this.solicitud32614Store.actualizarComercioExterior(resp.comercioExterior);
    this.solicitud32614Store.actualizarMutuo(resp.mutuo);
    this.solicitud32614Store.actualizarCatseleccionados(resp.catseleccionados);
    this.solicitud32614Store.actualizarServicio(resp.servicio);
    this.solicitud32614Store.actualizarEmpleados(resp.empleados);
    this.solicitud32614Store.actualizarBimestre(resp.bimestre);
    this.solicitud32614Store.actualizarIndiqueTodos(resp.indiqueTodos);
    this.solicitud32614Store.actualizarFile1(resp.file1);
    this.solicitud32614Store.actualizarFile2(resp.file2);
    this.solicitud32614Store.actualizarIdentificacion(resp.identificacion);
    this.solicitud32614Store.actualizarLugarDeRadicacion(
      resp.lugarDeRadicacion
    );
    this.solicitud32614Store.actualizarCheckbox1(resp.checkbox1);
    this.solicitud32614Store.actualizarCheckbox2(resp.checkbox2);
    this.solicitud32614Store.actualizarCheckbox3(resp.checkbox3);
    this.solicitud32614Store.actualizarActualmente2(resp.actualmente2);
    this.solicitud32614Store.actualizarActualmente1(resp.actualmente1);
  }
}
