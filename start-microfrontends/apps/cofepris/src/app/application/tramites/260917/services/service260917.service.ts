import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MercanciasInfo, ScianModel } from '@libs/shared/data-access-user/src';

import { PagoDerechosState,PagoDerechosStore } from '../../../shared/estados/stores/pago-de-derechos.store';

import { Solicitud260917State, Tramite260917Store } from '../estados/tramites/tramite260917.store';

@Injectable({
  providedIn: 'root',
})
export class Solocitud260917Service {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
  /**
   * urlServerCatalogos es la URL base para los catálogos auxiliares, obtenida de la configuración del entorno.
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  constructor(private http: HttpClient, private tramite301Store: Tramite260917Store,private pagoDerechosStore: PagoDerechosStore) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * @param DATOS Estado con la información del solicitante y establecimiento.
   */
  actualizarEstadoFormulario(DATOS: Solicitud260917State): void {
    this.tramite301Store.setRFCResponsableSanitario(DATOS.rfcResponsableSanitario);
    this.tramite301Store.setRazonSocial(DATOS.razonSocial);
    this.tramite301Store.setCorreoElectronico(DATOS.correoElectronico);
    this.tramite301Store.setCodigoPostal(DATOS.codigoPostal);
    this.tramite301Store.setEstado(DATOS.estado);
    this.tramite301Store.setMuncipio(DATOS.muncipio);
    this.tramite301Store.setLocalidad(DATOS.localidad);
    this.tramite301Store.setColonia(DATOS.colonia);
    this.tramite301Store.setCalle(DATOS.calle);
    this.tramite301Store.setLada(DATOS.lada);
    this.tramite301Store.setTelefono(DATOS.telefono);
    this.tramite301Store.setAvisoCheckbox(DATOS.avisoCheckbox);
    this.tramite301Store.setLicenciaSanitaria(DATOS.licenciaSanitaria);
    this.tramite301Store.setMarcarEnCasoDeQueSea(DATOS.marcarEnCasoDeQueSea);
    this.tramite301Store.setRegimen(DATOS.regimen);
    this.tramite301Store.setAduanasEntradas(DATOS.aduanasEntradas);
    this.tramite301Store.setRFCRepresentante(DATOS.rfcRepresentante);
    this.tramite301Store.setRazonSocialRepresentante(DATOS.razonSocialRepresentante);
    this.tramite301Store.setApellidoPaternoRepresentante(DATOS.apellidoPaternoRepresentante);
    this.tramite301Store.setApellidoMaternoRepresentante(DATOS.apellidoMaternoRepresentante);
    this.tramite301Store.setAceptaPublicacion(DATOS.aceptaPublicacion);
    this.tramite301Store.setTipoOperacion(DATOS.tipoOperacion);
    this.tramite301Store.setJustificacion(DATOS.justificacion);
    this.tramite301Store.setAceptaManifiestos(DATOS.aceptaManifiestos)
    
  }

  /**
 * Actualiza los datos relacionados con el pago de derechos en el formulario,
 * utilizando la información proporcionada en el estado de PermisoImportacionBiologica.
 *
 * @param DATOS - Objeto que contiene los datos necesarios para actualizar el pago de derechos,
 * incluyendo clave de referencia, cadena de la dependencia, llave de pago, fecha e importe.
 */
actualizarPagoDerechosFormulario(DATOS: PagoDerechosState): void {
    this.pagoDerechosStore.setCadenaDependencia(DATOS.cadenaDependencia);
    this.pagoDerechosStore.setClaveReferencia(DATOS.claveReferencia);
    this.pagoDerechosStore.setllavePago(DATOS.llavePago);
    this.pagoDerechosStore.setFechaPago(DATOS.fechaPago);
    this.pagoDerechosStore.setImportePago(DATOS.importePago);
    this.pagoDerechosStore.setBanco(DATOS.banco);
    this.pagoDerechosStore.setEstado(DATOS.estado);
}

  /**
   * Obtiene los datos del registro de toma de muestras de mercancías.
   * @returns Observable con el estado de los datos del solicitante.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud260917State> {
    return this.http.get<Solicitud260917State>('assets/json/260917/serviciosExtraordinarios.json');
  }
    /**
     * Recupera los datos de SCIAN desde un archivo JSON local.
     * @returns {Observable<ScianModel[]>} Un observable con los datos de SCIAN.
     */
    getScianDatos(): Observable<ScianModel[]> {
      return this.http.get<ScianModel[]>('assets/json/260917/scianDatos.json');
    }

    /**
     * Recupera los datos de mercancías desde un archivo JSON local.
     * @returns {Observable<MercanciasInfo[]>} Un observable con los datos de mercancías.
     */
    getMercanciasDatos(): Observable<MercanciasInfo[]> {
      return this.http.get<MercanciasInfo[]>('assets/json/260917/mercanciasInfo.json');
    }

     /**
   * Obtiene los datos del pago de derechos.
   * @returns Observable con el estado del permiso de importación biológica.
   */
  getPagoDerechos(): Observable<PagoDerechosState> {
    return this.http.get<PagoDerechosState>('assets/json/260917/pagoDerechos.json');
  }
}
