import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DatosDelSolicituteSeccionState } from '../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDelSolicituteSeccionStateStore } from '../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { PermisoImportacionBiologicaState } from '../../../shared/estados/permiso-importacion-biologica.store';
import { PermisoImportacionBiologicaStore } from '../../../shared/estados/permiso-importacion-biologica.store';


@Injectable({
  providedIn: 'root',
})
export class Solocitud260905Service {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
  /**
   * urlServerCatalogos es la URL base para los catálogos auxiliares, obtenida de la configuración del entorno.
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes.
   * @param tramite260402Store Store para el estado de la sección de datos del solicitante.
   * @param tramite260402 Store para el estado del permiso de importación biológica.
   */
  constructor(private http: HttpClient, private tramite260402Store: DatosDelSolicituteSeccionStateStore, private tramite260402: PermisoImportacionBiologicaStore) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * @param DATOS Estado con la información del solicitante y establecimiento.
   */
  actualizarEstadoFormulario(DATOS: DatosDelSolicituteSeccionState): void {
    this.tramite260402Store.setIdeGenerica(DATOS.ideGenerica);
    this.tramite260402Store.setEstablecimientoRFCResponsableSanitario(DATOS.establecimientoRFCResponsableSanitario)
    this.tramite260402Store.setEstablecimientoRazonSocial(DATOS.establecimientoRazonSocial);
    this.tramite260402Store.setEstablecimientoCorreoElectronico(DATOS.establecimientoCorreoElectronico);
    this.tramite260402Store.setEstablecimientoDomicilioCodigoPostal(DATOS.establecimientoDomicilioCodigoPostal);
    this.tramite260402Store.setEstablecimientoEstados(DATOS.establecimientoEstados);
    this.tramite260402Store.setDescripcionMunicipio(DATOS.descripcionMunicipio);
    this.tramite260402Store.setLocalidad(DATOS.localidad);
    this.tramite260402Store.setEstablishomentoColonias(DATOS.establishomentoColonias);
    this.tramite260402Store.setCalle(DATOS.calle);
    this.tramite260402Store.setLada(DATOS.lada);
    this.tramite260402Store.setTelefono(DATOS.telefono);
    this.tramite260402Store.setRfcDelProfesionalResponsable(DATOS.rfcDelProfesionalResponsable);
    this.tramite260402Store.setNombreDelProfesionalResponsable(DATOS.nombreDelProfesionalResponsable);
    this.tramite260402Store.setRepresentanteRfc(DATOS.representanteRfc);
    this.tramite260402Store.setRepresentanteNombre(DATOS.representanteNombre); 
    this.tramite260402Store.setRepresentanteApellidos(DATOS.apellidoMaterno,DATOS.apellidoPaterno);
    this.tramite260402Store.setInformacionConfidencial(DATOS.informacionConfidencialRadio)
    this.tramite260402Store.setAduanasEntradas(DATOS.aduanasEntradas);
    this.tramite260402Store.setRegimen(DATOS.regimen);
    this.tramite260402Store.setNoDeLicenciaSanitariaObservaciones(DATOS.noDeLicenciaSanitariaObservaciones);
    this.tramite260402Store.setNoLicenciaSanitaria(DATOS.noLicenciaSanitaria);
    this.tramite260402Store.setManifests(DATOS.manifests);
  }


  
/**
 * Actualiza los datos relacionados con el pago de derechos en el formulario,
 * utilizando la información proporcionada en el estado de PermisoImportacionBiologica.
 *
 * @param DATOS - Objeto que contiene los datos necesarios para actualizar el pago de derechos,
 * incluyendo clave de referencia, cadena de la dependencia, llave de pago, fecha e importe.
 */
actualizarPagoDerechosFormulario(DATOS: PermisoImportacionBiologicaState): void {
    this.tramite260402.setClaveDeReferncia(DATOS.setClaveDeReferncia);
    this.tramite260402.setCadenaDeLaDependencia(DATOS.setCadenaDeLaDependencia);
    this.tramite260402.setLlaveDePago(DATOS.setLlaveDePago);
    this.tramite260402.setFechaDePago(DATOS.setFechaDePago);
    this.tramite260402.setImporteDePago(DATOS.setImporteDePago);
   
      if (DATOS.setBanco) {
        this.tramite260402.setBanco(DATOS.setBanco);
      }
    
}
  /**
   * Obtiene los datos del registro de toma de muestras de mercancías.
   * @returns Observable con el estado de los datos del solicitante.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<DatosDelSolicituteSeccionState> {
    return this.http.get<DatosDelSolicituteSeccionState>('assets/json/260905/serviciosExtraordinarios.json');
  }

  /**
   * Obtiene los datos del pago de derechos.
   * @returns Observable con el estado del permiso de importación biológica.
   */
  getPagoDerechos(): Observable<PermisoImportacionBiologicaState> {
    return this.http.get<PermisoImportacionBiologicaState>('assets/json/260905/pagoDerechos.json');
  }
}