import {
  DatosGeneralesDeLaSolicitudCatologo,
  DatosGeneralesDeLaSolicitudDatos,
  DatosGeneralesDeLaSolicitudRadioLista,
  DatosPorGarantia,
  Domicilios,
  ModificacionDenominacionRazonSocial,
  RecibirNotificaciones,
  SeccionSociosIC,
  SubContratistas,
  TipoDeInversion,
} from '../models/solicitud.model';
import {
  Solicitud31301State,
  Solicitud31301Store,
} from '../estados/solicitud31301.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de obtener los datos necesarios para el llenado del formulario
 * de la solicitud 31301 a partir de archivos JSON locales.
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
    public solicitud31301Store: Solicitud31301Store
  ) {
    // Lógica del constructor aquí
  }

  /**
   * Obtiene la lista de opciones para recibir notificaciones.
   */
  conseguirRecibirNotificaciones(): Observable<RecibirNotificaciones[]> {
    return this.http.get<RecibirNotificaciones[]>(
      'assets/json/31301/recibir-notificaciones.json'
    );
  }

  /**
   * Obtiene los datos para la modificación de denominación o razón social.
   */
  conseguirModificacionDenominacionRazonSocial(): Observable<ModificacionDenominacionRazonSocial> {
    return this.http.get<ModificacionDenominacionRazonSocial>(
      'assets/json/31301/modificacion-denominacion-razon-social.json'
    );
  }

  /**
   * Obtiene el catálogo de nombres de instituciones.
   */
  conseguirNombreInstitucionCatalogo(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      'assets/json/31301/nombre-institucion-catalogo.json'
    );
  }

  /**
   * Obtiene los datos relacionados a la garantía.
   */
  conseguirDatosPorGarantia(): Observable<DatosPorGarantia> {
    return this.http.get<DatosPorGarantia>(
      'assets/json/31301/datos-por-garantia.json'
    );
  }

  /**
   * Obtiene los datos generales de la solicitud (opciones de tipo radio).
   */
  conseguirDatosGeneralesOpcionDeRadio(): Observable<DatosGeneralesDeLaSolicitudRadioLista> {
    return this.http.get<DatosGeneralesDeLaSolicitudRadioLista>(
      'assets/json/31301/datos-generales-de-la-solicitud-radio-option.json'
    );
  }

  /**
   * Obtiene los catálogos generales de la solicitud.
   */
  conseguirDatosGeneralesCatologo(): Observable<DatosGeneralesDeLaSolicitudCatologo> {
    return this.http.get<DatosGeneralesDeLaSolicitudCatologo>(
      'assets/json/31301/datos-generales-de-la-solicitud-catologo.json'
    );
  }

  /**
   * Obtiene la lista de subcontratistas.
   */
  conseguirListaDeSubcontratistas(): Observable<SubContratistas[]> {
    return this.http.get<SubContratistas[]>(
      'assets/json/31301/lista-de-subcontratistas.json'
    );
  }

  /**
   * Obtiene la lista de regímenes aduaneros.
   */
  conseguirRegimenAduanero(): Observable<string[]> {
    return this.http.get<string[]>('assets/json/31301/regimen-aduanero.json');
  }

  /**
   * Obtiene la lista de miembros de la empresa (socios).
   */
  conseguirMiembrosDeLaEmpresa(): Observable<SeccionSociosIC[]> {
    return this.http.get<SeccionSociosIC[]>(
      'assets/json/31301/miembros-de-la-empresa.json'
    );
  }

  /**
   * Obtiene los tipos de inversión disponibles.
   */
  conseguirTipoDeInversionDatos(): Observable<TipoDeInversion[]> {
    return this.http.get<TipoDeInversion[]>(
      'assets/json/31301/tipo-de-inversion-datos.json'
    );
  }

  /**
   * Obtiene los domicilios registrados.
   */
  conseguirDomicilios(): Observable<Domicilios[]> {
    return this.http.get<Domicilios[]>('assets/json/31301/domicilios.json');
  }

  /**
   * Obtiene todos los datos generales de la solicitud necesarios para el llenado del formulario.
   */
  conseguirDatosGeneralesDeLaSolicitudDatos(): Observable<DatosGeneralesDeLaSolicitudDatos> {
    return this.http.get<DatosGeneralesDeLaSolicitudDatos>(
      'assets/json/31301/datos-generales-de-la-solicitud-datos.json'
    );
  }

  /**
   * @description
   * Obtiene los datos del formulario de la solicitud 31301 desde un archivo JSON local.
   *
   * @returns Observable<Solicitud31301State> Un observable que emite el estado de la solicitud 31301.
   */
  guardarDatosFormulario(): Observable<Solicitud31301State> {
    return this.http.get<Solicitud31301State>(
      'assets/json/31301/solicitud-31301-datos.json'
    );
  }

  /**
 * Actualiza el estado del formulario en el store con la información proporcionada.
 *
 * Objeto que contiene el estado actual de la solicitud,
 * incluyendo el tipo de endoso que debe actualizarse en el store.
 */
  actualizarEstadoFormulario(resp: Solicitud31301State): void {
    this.solicitud31301Store.actualizarTipoDeEndoso(resp.tipoDeEndoso);
    this.solicitud31301Store.actualizarTipoDeGarantia(resp.tipoDeGarantia);
    this.solicitud31301Store.actualizarModalidadDeLaGarantia(
      resp.modalidadDeLaGarantia
    );
    this.solicitud31301Store.actualizarTipoSector(resp.tipoSector);
    this.solicitud31301Store.actualizarConcepto(resp.concepto);
    this.solicitud31301Store.actualizar3500(resp['3500']);
    this.solicitud31301Store.actualizar3501(resp['3501']);
    this.solicitud31301Store.actualizar3502(resp['3502']);
    this.solicitud31301Store.actualizarDatosGeneralesRFC(
      resp.datosGeneralesRFC
    );
    this.solicitud31301Store.actualizar3503(resp['3503']);
    this.solicitud31301Store.actualizar3504(resp['3504']);
    this.solicitud31301Store.actualizar3505(resp['3505']);
    this.solicitud31301Store.actualizar3506(resp['3506']);
    this.solicitud31301Store.actualizar3507(resp['3507']);
    this.solicitud31301Store.actualizar3508(resp['3508']);
    this.solicitud31301Store.actualizar3509(resp['3509']);
    this.solicitud31301Store.actualizar3511(resp['3511']);
    this.solicitud31301Store.actualizar3512(resp['3512']);
    this.solicitud31301Store.actualizar3513(resp['3513']);
    this.solicitud31301Store.actualizarTextoGenerico1(resp.textoGenerico1);
    this.solicitud31301Store.actualizarTextoGenerico2(resp.textoGenerico2);
    this.solicitud31301Store.actualizar3514(resp['3514']);
    this.solicitud31301Store.actualizar3515(resp['3515']);
    this.solicitud31301Store.actualizar3516(resp['3516']);
    this.solicitud31301Store.actualizarTextoGenerico3(resp.textoGenerico3);
    this.solicitud31301Store.actualizar3517(resp['3517']);
    this.solicitud31301Store.actualizar3518(resp['3518']);
    this.solicitud31301Store.actualizar3519(resp['3519']);
    this.solicitud31301Store.actualizar3520(resp['3520']);
    this.solicitud31301Store.actualizarTipoInversion(resp.tipoInversion);
    this.solicitud31301Store.actualizarCantidadInversion(
      resp.cantidadInversion
    );
    this.solicitud31301Store.actualizarDescInversion(resp.descInversion);
    this.solicitud31301Store.actualizar3521(resp['3521']);
    this.solicitud31301Store.actualizar3522(resp['3522']);
    this.solicitud31301Store.actualizarClaveEnumeracionD0(
      resp.claveEnumeracionD0
    );
    this.solicitud31301Store.actualizarClaveEnumeracionD1(
      resp.claveEnumeracionD1
    );
    this.solicitud31301Store.actualizarClaveEnumeracionD2(
      resp.claveEnumeracionD2
    );
    this.solicitud31301Store.actualizarClaveEnumeracionD3(
      resp.claveEnumeracionD3
    );
    this.solicitud31301Store.actualizarClaveEnumeracionH(
      resp.claveEnumeracionH
    );
    this.solicitud31301Store.actualizarTextoGenerico4(resp.textoGenerico4);
    this.solicitud31301Store.actualizarTextoGenerico5(resp.textoGenerico5);
    this.solicitud31301Store.actualizar3523(resp['3523']);
    this.solicitud31301Store.actualizar3528(resp['3528']);
    this.solicitud31301Store.actualizar3529(resp['3529']);
    this.solicitud31301Store.actualizarTextoGenerico6(resp.textoGenerico6);
    this.solicitud31301Store.actualizarTextoGenerico7(resp.textoGenerico7);
    this.solicitud31301Store.actualizar3530(resp['3530']);
    this.solicitud31301Store.actualizar3531(resp['3531']);
    this.solicitud31301Store.actualizarTextoGenerico9(resp.textoGenerico9);
    this.solicitud31301Store.actualizarTextoGenerico10(resp.textoGenerico10);
    this.solicitud31301Store.actualizarTextoGenerico11(resp.textoGenerico11);
    this.solicitud31301Store.actualizarTextoGenerico12(resp.textoGenerico12);
    this.solicitud31301Store.actualizarTextoGenerico13(resp.textoGenerico13);
    this.solicitud31301Store.actualizarTextoGenerico14(resp.textoGenerico14);
    this.solicitud31301Store.actualizarTextoGenerico15(resp.textoGenerico15);
    this.solicitud31301Store.actualizarTextoGenerico16(resp.textoGenerico16);
    this.solicitud31301Store.actualizarTextoGenerico17(resp.textoGenerico17);
    this.solicitud31301Store.actualizarTextoGenerico18(resp.textoGenerico18);
    this.solicitud31301Store.actualizarTextoGenerico19(resp.textoGenerico19);
    this.solicitud31301Store.actualizarTextoGenerico20(resp.textoGenerico20);
    this.solicitud31301Store.actualizarTextoGenerico21(resp.textoGenerico21);
    this.solicitud31301Store.actualizarTextoGenerico22(resp.textoGenerico22);
    this.solicitud31301Store.actualizarTextoGenerico23(resp.textoGenerico23);
    this.solicitud31301Store.actualizarTextoGenerico24(resp.textoGenerico24);
    this.solicitud31301Store.actualizarAlerta1(resp.alerta1);
    this.solicitud31301Store.actualizarAlerta2(resp.alerta2);
    this.solicitud31301Store.actualizarPolizaDeFianzaActual(
      resp.polizaDeFianzaActual
    );
    this.solicitud31301Store.actualizarNumeroFolio(resp.numeroFolio);
    this.solicitud31301Store.actualizarRfcInstitucion(resp.rfcInstitucion);
    this.solicitud31301Store.actualizarFechaExpedicion(resp.fechaExpedicion);
    this.solicitud31301Store.actualizarFechaInicioVigenciaNo(
      resp.fechaInicioVigenciaNo
    );
    this.solicitud31301Store.actualizarFechaFinVigenciaNo(
      resp.fechaFinVigenciaNo
    );
    this.solicitud31301Store.actualizarFechaInicioVigencia(
      resp.fechaInicioVigencia
    );
    this.solicitud31301Store.actualizarFechaFinVigencia(resp.fechaFinVigencia);
    this.solicitud31301Store.actualizarImporteTotal(resp.importeTotal);
    this.solicitud31301Store.actualizarRazonSocialAnterior(
      resp.razonSocialAnterior
    );
    this.solicitud31301Store.actualizarRazonSocialActual(
      resp.razonSocialActual
    );
    this.solicitud31301Store.actualizarRfc(resp.rfc);
    this.solicitud31301Store.actualizarCurp(resp.curp);
    this.solicitud31301Store.actualizarNombre(resp.nombre);
    this.solicitud31301Store.actualizarApellidoPaterno(resp.apellidoPaterno);
    this.solicitud31301Store.actualizarApellidoMaterno(resp.apellidoMaterno);
  }
}
