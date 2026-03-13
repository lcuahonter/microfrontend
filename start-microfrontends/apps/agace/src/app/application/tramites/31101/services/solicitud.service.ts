import {
  DatosGeneralesDeLaSolicitudCatologo,
  DatosGeneralesDeLaSolicitudRadioLista,
  DatosPorGarantia,
  Domicilios,
  EntidadFederativa,
  GarantiaCatalogo,
  ModificacionDenominacionRazonSocial,
  RecibirNotificaciones,
  SeccionSociosIC,
  Solicitud31101Model,
  SubContratistas,
  TipoDeInversion,
} from '../models/solicitud.model';
import { CatalogosSelect } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Solicitud31101Store } from '../estados/solicitud31101.store';


/**
 * Servicio encargado de obtener los datos necesarios para el llenado del formulario
 * de la solicitud 31101 a partir de archivos JSON locales.
 */
@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
  /**
   * Constructor que inyecta el cliente HTTP.
   * @param http - Cliente HTTP para realizar peticiones.
   */
  constructor(
    private http: HttpClient,
    public solicitud31101Store: Solicitud31101Store
  ) {
    // Lógica del constructor aquí
  }

  /**
   * Obtiene la lista de opciones para recibir notificaciones.
   */
  conseguirRecibirNotificaciones(): Observable<RecibirNotificaciones[]> {
    return this.http.get<RecibirNotificaciones[]>(
      'assets/json/31101/recibir-notificaciones.json'
    );
  }

  /**
   * Obtiene los datos para la modificación de denominación o razón social.
   */
  conseguirModificacionDenominacionRazonSocial(): Observable<ModificacionDenominacionRazonSocial> {
    return this.http.get<ModificacionDenominacionRazonSocial>(
      'assets/json/31101/modificacion-denominacion-razon-social.json'
    );
  }

  /**
   * Obtiene el catálogo de nombres de instituciones.
   */
  conseguirNombreInstitucionCatalogo(): Observable<GarantiaCatalogo> {
    return this.http.get<GarantiaCatalogo>(
      'assets/json/31101/nombre-institucion-catalogo.json'
    );
  }

  /**
   * Obtiene los datos relacionados a la garantía.
   */
  conseguirDatosPorGarantia(): Observable<DatosPorGarantia> {
    return this.http.get<DatosPorGarantia>(
      'assets/json/31101/datos-por-garantia.json'
    );
  }

  /**
   * Obtiene los datos generales de la solicitud (opciones de tipo radio).
   */
  conseguirDatosGeneralesOpcionDeRadio(): Observable<DatosGeneralesDeLaSolicitudRadioLista> {
    return this.http.get<DatosGeneralesDeLaSolicitudRadioLista>(
      'assets/json/31101/datos-generales-de-la-solicitud-radio-option.json'
    );
  }

  /**
   * Obtiene los catálogos generales de la solicitud.
   */
  conseguirDatosGeneralesCatologo(): Observable<DatosGeneralesDeLaSolicitudCatologo> {
    return this.http.get<DatosGeneralesDeLaSolicitudCatologo>(
      'assets/json/31101/datos-generales-de-la-solicitud-catologo.json'
    );
  }

  /**
   * Obtiene la lista de subcontratistas.
   */
  conseguirListaDeSubcontratistas(): Observable<SubContratistas[]> {
    return this.http.get<SubContratistas[]>(
      'assets/json/31101/lista-de-subcontratistas.json'
    );
  }

  /**
   * Obtiene la lista de regímenes aduaneros.
   */
  conseguirRegimenAduanero(): Observable<string[]> {
    return this.http.get<string[]>('assets/json/31101/regimen-aduanero.json');
  }

  /**
   * Obtiene la lista de miembros de la empresa (socios).
   */
  conseguirMiembrosDeLaEmpresa(): Observable<SeccionSociosIC[]> {
    return this.http.get<SeccionSociosIC[]>(
      'assets/json/31101/miembros-de-la-empresa.json'
    );
  }

  /**
   * Obtiene los tipos de inversión disponibles.
   */
  conseguirTipoDeInversionDatos(): Observable<TipoDeInversion[]> {
    return this.http.get<TipoDeInversion[]>(
      'assets/json/31101/tipo-de-inversion-datos.json'
    );
  }

  /**
   * Obtiene los domicilios registrados.
   */
  conseguirDomicilios(): Observable<Domicilios[]> {
    return this.http.get<Domicilios[]>('assets/json/31101/domicilios.json');
  }

  /**
   * @description Obtiene los datos de la entidad federativa desde un archivo JSON.
   * @returns {Observable<EntidadFederativa[]>} Observable con la lista de entidades federativas.
   */
  conseguirEntidadFederativaDatos(): Observable<EntidadFederativa[]> {
    return this.http.get<EntidadFederativa[]>(
      'assets/json/31101/entidad-federativa-datos.json'
    );
  }

  /**
   * Obtiene el catálogo de entidades federativas.
   *
   * @returns Un observable con los datos del catálogo de tipo `CatalogosSelect`,
   * cargado desde un archivo JSON local.
   */
  entidadFederativaCatalogo(): Observable<CatalogosSelect> {
    return this.http.get<CatalogosSelect>(
      'assets/json/31101/entidad-federativa-catalogo.json'
    );
  }

  /**
   * Guarda los datos del formulario.
   *
   * @returns Un observable con la respuesta del modelo `Solicitud31101Model`,
   * simulando una carga desde un archivo JSON local.
   */
  guardarDatosFormulario(): Observable<Solicitud31101Model> {
    return this.http.get<Solicitud31101Model>(
      'assets/json/31101/solicitud31101.json'
    );
  }

  /**
   * Actualiza el estado del formulario en el store.
   *
   * @param respuesta Objeto de tipo `Solicitud31101Model` que contiene la nueva información del formulario.
   */
  actualizarEstadoFormulario(respuesta: Solicitud31101Model): void {
    this.solicitud31101Store.actualizarTipoDeGarantia(respuesta.tipoDeGarantia);
    this.solicitud31101Store.actualizarModalidadDeLaGarantia(
      respuesta.modalidadDeLaGarantia
    );
    this.solicitud31101Store.actualizarTipoSector(respuesta.tipoSector);
    this.solicitud31101Store.actualizarConcepto(respuesta.concepto);
    this.solicitud31101Store.actualizar3500(respuesta[3500]);
    this.solicitud31101Store.actualizar3501(respuesta[3501]);
    this.solicitud31101Store.actualizar3502(respuesta[3502]);
    this.solicitud31101Store.actualizarDatosGeneralesRFC(
      respuesta.datosGeneralesRFC
    );
    this.solicitud31101Store.actualizar3503(respuesta[3503]);
    this.solicitud31101Store.actualizar3504(respuesta[3504]);
    this.solicitud31101Store.actualizar3505(respuesta[3505]);
    this.solicitud31101Store.actualizar3506(respuesta[3506]);
    this.solicitud31101Store.actualizar3507(respuesta[3507]);
    this.solicitud31101Store.actualizar3508(respuesta[3508]);
    this.solicitud31101Store.actualizar3509(respuesta[3509]);
    this.solicitud31101Store.actualizar3511(respuesta[3511]);
    this.solicitud31101Store.actualizar3512(respuesta[3512]);
    this.solicitud31101Store.actualizar3513(respuesta[3513]);
    this.solicitud31101Store.actualizarTextoGenerico1(respuesta.textoGenerico1);
    this.solicitud31101Store.actualizarTextoGenerico2(respuesta.textoGenerico2);
    this.solicitud31101Store.actualizar3514(respuesta[3514]);
    this.solicitud31101Store.actualizar3515(respuesta[3515]);
    this.solicitud31101Store.actualizar3516(respuesta[3516]);
    this.solicitud31101Store.actualizarTextoGenerico3(respuesta.textoGenerico3);
    this.solicitud31101Store.actualizar3517(respuesta[3517]);
    this.solicitud31101Store.actualizar3518(respuesta[3518]);
    this.solicitud31101Store.actualizar3519(respuesta[3519]);
    this.solicitud31101Store.actualizar3520(respuesta[3520]);
    this.solicitud31101Store.actualizarTipoInversion(respuesta.tipoInversion);
    this.solicitud31101Store.actualizarCantidadInversion(
      respuesta.cantidadInversion
    );
    this.solicitud31101Store.actualizarDescInversion(respuesta.descInversion);
    this.solicitud31101Store.actualizar3521(respuesta[3521]);
    this.solicitud31101Store.actualizar3522(respuesta[3522]);
    this.solicitud31101Store.actualizarClaveEnumeracionD0(
      respuesta.claveEnumeracionD0
    );
    this.solicitud31101Store.actualizarClaveEnumeracionD1(
      respuesta.claveEnumeracionD1
    );
    this.solicitud31101Store.actualizarClaveEnumeracionD2(
      respuesta.claveEnumeracionD2
    );
    this.solicitud31101Store.actualizarClaveEnumeracionD3(
      respuesta.claveEnumeracionD3
    );
    this.solicitud31101Store.actualizarClaveEnumeracionH(
      respuesta.claveEnumeracionH
    );
    this.solicitud31101Store.actualizarModalidadProgramaImmex(
      respuesta.modalidadProgramaImmex
    );
    this.solicitud31101Store.actualizarTextoGenerico4(respuesta.textoGenerico4);
    this.solicitud31101Store.actualizarTextoGenerico5(respuesta.textoGenerico5);
    this.solicitud31101Store.actualizar3523(respuesta[3523]);
    this.solicitud31101Store.actualizar3524(respuesta[3524]);
    this.solicitud31101Store.actualizar3525(respuesta[3525]);
    this.solicitud31101Store.actualizar3526(respuesta[3526]);
    this.solicitud31101Store.actualizar3527(respuesta[3527]);
    this.solicitud31101Store.actualizarFechaFinVigencia1(
      respuesta.fechaFinVigencia1
    );
    this.solicitud31101Store.actualizarNumeroAutorizacion1(
      respuesta.numeroAutorizacion1
    );
    this.solicitud31101Store.actualizarFechaFinVigencia2(
      respuesta.fechaFinVigencia2
    );
    this.solicitud31101Store.actualizarNumeroAutorizacion2(
      respuesta.numeroAutorizacion2
    );
    this.solicitud31101Store.actualizar3528(respuesta[3528]);
    this.solicitud31101Store.actualizar3529(respuesta[3529]);
    this.solicitud31101Store.actualizarTextoGenerico6(respuesta.textoGenerico6);
    this.solicitud31101Store.actualizarTextoGenerico7(respuesta.textoGenerico7);
    this.solicitud31101Store.actualizar3530(respuesta[3530]);
    this.solicitud31101Store.actualizar3531(respuesta[3531]);
    this.solicitud31101Store.actualizarTextoGenerico9(respuesta.textoGenerico9);
    this.solicitud31101Store.actualizarTextoGenerico10(
      respuesta.textoGenerico10
    );
    this.solicitud31101Store.actualizarTextoGenerico11(
      respuesta.textoGenerico11
    );
    this.solicitud31101Store.actualizarTextoGenerico12(
      respuesta.textoGenerico12
    );
    this.solicitud31101Store.actualizarTextoGenerico13(
      respuesta.textoGenerico13
    );
    this.solicitud31101Store.actualizarTextoGenerico14(
      respuesta.textoGenerico14
    );
    this.solicitud31101Store.actualizarTextoGenerico15(
      respuesta.textoGenerico15
    );
    this.solicitud31101Store.actualizarTextoGenerico16(
      respuesta.textoGenerico16
    );
    this.solicitud31101Store.actualizarTextoGenerico17(
      respuesta.textoGenerico17
    );
    this.solicitud31101Store.actualizarTextoGenerico18(
      respuesta.textoGenerico18
    );
    this.solicitud31101Store.actualizarTextoGenerico19(
      respuesta.textoGenerico19
    );
    this.solicitud31101Store.actualizarTextoGenerico20(
      respuesta.textoGenerico20
    );
    this.solicitud31101Store.actualizarTextoGenerico21(
      respuesta.textoGenerico21
    );
    this.solicitud31101Store.actualizarTextoGenerico22(
      respuesta.textoGenerico22
    );
    this.solicitud31101Store.actualizarTextoGenerico23(
      respuesta.textoGenerico23
    );
    this.solicitud31101Store.actualizarTextoGenerico24(
      respuesta.textoGenerico24
    );
    this.solicitud31101Store.actualizarAlerta2(respuesta.alerta2);
    this.solicitud31101Store.actualizarPolizaDeFianzaActual(
      respuesta.polizaDeFianzaActual
    );
    this.solicitud31101Store.actualizarNumeroFolio(respuesta.numeroFolio);
    this.solicitud31101Store.actualizarRfcInstitucion(respuesta.rfcInstitucion);
    this.solicitud31101Store.actualizarFechaExpedicion(
      respuesta.fechaExpedicion
    );
    this.solicitud31101Store.actualizarFechaInicioVigenciaNo(
      respuesta.fechaInicioVigenciaNo
    );
    this.solicitud31101Store.actualizarFechaFinVigenciaNo(
      respuesta.fechaFinVigenciaNo
    );
    this.solicitud31101Store.actualizarFechaInicioVigencia(
      respuesta.fechaInicioVigencia
    );
    this.solicitud31101Store.actualizarFechaFinVigencia(
      respuesta.fechaFinVigencia
    );
    this.solicitud31101Store.actualizarImporteTotal(respuesta.importeTotal);
    this.solicitud31101Store.actualizarRazonSocialAnterior(
      respuesta.razonSocialAnterior
    );
    this.solicitud31101Store.actualizarRazonSocialActual(
      respuesta.razonSocialActual
    );
    this.solicitud31101Store.actualizarRfc(respuesta.rfc);
    this.solicitud31101Store.actualizarCurp(respuesta.curp);
    this.solicitud31101Store.actualizarNombre(respuesta.nombre);
    this.solicitud31101Store.actualizarApellidoPaterno(
      respuesta.apellidoPaterno
    );
    this.solicitud31101Store.actualizarApellidoMaterno(
      respuesta.apellidoMaterno
    );
    this.solicitud31101Store.actualizarMiembroCaracterDe(
      respuesta.miembroCaracterDe
    );
    this.solicitud31101Store.actualizarMiembroTributarMexico(
      respuesta.miembroTributarMexico
    );
    this.solicitud31101Store.actualizarMiembroNacionalidad(
      respuesta.miembroNacionalidad
    );
    this.solicitud31101Store.actualizarMiembroRFC(respuesta.miembroRfc);
    this.solicitud31101Store.actualizarMiembroRegistroFederal(
      respuesta.miembroRegistroFederal
    );
    this.solicitud31101Store.actualizarMiembroNombreCompleto(
      respuesta.miembroNombreCompleto
    );
    this.solicitud31101Store.actualizarMiembroTipoPersonaMuestra(
      respuesta.miembroTipoPersonaMuestra
    );
    this.solicitud31101Store.actualizarMiembroNombre(respuesta.miembroNombre);
    this.solicitud31101Store.actualizarMiembroApellidoPaterno(
      respuesta.miembroApellidoPaterno
    );
    this.solicitud31101Store.actualizarMiembroApellidoMaterno(
      respuesta.miembroApellidoMaterno
    );
    this.solicitud31101Store.actualizarMiembroNombreEmpresa(
      respuesta.miembroNombreEmpresa
    );
    this.solicitud31101Store.actualizarEntidadFederativa(
      respuesta.entidadFederativa
    );
    this.solicitud31101Store.actualizarInstalacionesPrincipales(
      respuesta.instalacionesPrincipales
    );
    this.solicitud31101Store.actualizarMunicipio(respuesta.municipio);
    this.solicitud31101Store.actualizarTipoDeInstalacion(
      respuesta.tipoDeInstalacion
    );
    this.solicitud31101Store.actualizarFederativa(respuesta.federativa);
    this.solicitud31101Store.actualizarRegistroSE(respuesta.registroSE);
    this.solicitud31101Store.actualizarDesceripe(respuesta.desceripe);
    this.solicitud31101Store.actualizarCodigoPostal(respuesta.codigoPostal);
    this.solicitud31101Store.actualizarProcesoProductivo(
      respuesta.procesoProductivo
    );
  }
}
