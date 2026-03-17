/**
 * ImportarSuministrosService
 * Servicio para manejar la importación de suministros y la gestión de datos del solicitante.
 */
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DatosDelSolicituteSeccionState } from '../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDelSolicituteSeccionStateStore } from '../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { PermisoImportacionBiologicaState } from '../../../shared/estados/permiso-importacion-biologica.store';
import { PermisoImportacionBiologicaStore } from '../../../shared/estados/permiso-importacion-biologica.store';
/**
 * ImportarSuministrosService es un servicio que maneja la lógica de negocio
 * relacionada con la importación de suministros y la gestión de datos del solicitante.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * ImportarSuministrosService
 * Este servicio se encarga de manejar la lógica relacionada con la importación de suministros y la gestión de datos del solicitante,
 */
export class ImportarSuministrosService {
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
     * @param tramiteStore Store para el estado de la sección de datos del solicitante.
     * @param tramiteStore Store para el estado del permiso de importación biológica.
     */
    constructor(private http: HttpClient, private tramiteStore: DatosDelSolicituteSeccionStateStore, private tramiteStoreData: PermisoImportacionBiologicaStore) {
      // Lógica de inicialización si es necesario
    }
  
    /**
     * Actualiza el estado del formulario con los datos proporcionados.
     * @param DATOS Estado con la información del solicitante y establecimiento.
     */
    actualizarEstadoFormulario(DATOS: DatosDelSolicituteSeccionState): void {
      this.tramiteStore.setIdeGenerica(DATOS.ideGenerica);
      this.tramiteStore.setEstablecimientoRFCResponsableSanitario(DATOS.establecimientoRFCResponsableSanitario)
      this.tramiteStore.setEstablecimientoRazonSocial(DATOS.establecimientoRazonSocial);
      this.tramiteStore.setEstablecimientoCorreoElectronico(DATOS.establecimientoCorreoElectronico);
      this.tramiteStore.setEstablecimientoDomicilioCodigoPostal(DATOS.establecimientoDomicilioCodigoPostal);
      this.tramiteStore.setEstablecimientoEstados(DATOS.establecimientoEstados);
      this.tramiteStore.setDescripcionMunicipio(DATOS.descripcionMunicipio);
      this.tramiteStore.setLocalidad(DATOS.localidad);
      this.tramiteStore.setEstablishomentoColonias(DATOS.establishomentoColonias);
      this.tramiteStore.setCalle(DATOS.calle);
      this.tramiteStore.setLada(DATOS.lada);
      this.tramiteStore.setTelefono(DATOS.telefono);
      this.tramiteStore.setRfcDelProfesionalResponsable(DATOS.rfcDelProfesionalResponsable);
      this.tramiteStore.setNombreDelProfesionalResponsable(DATOS.nombreDelProfesionalResponsable);
      this.tramiteStore.setRepresentanteRfc(DATOS.representanteRfc);
      this.tramiteStore.setRepresentanteNombre(DATOS.representanteNombre); 
      this.tramiteStore.setRepresentanteApellidos(DATOS.apellidoMaterno,DATOS.apellidoPaterno);
      this.tramiteStore.setInformacionConfidencial(DATOS.informacionConfidencialRadio)
      this.tramiteStore.setAduanasEntradas(DATOS.aduanasEntradas);
      this.tramiteStore.setRegimen(DATOS.regimen);
      this.tramiteStore.setNoDeLicenciaSanitariaObservaciones(DATOS.noDeLicenciaSanitariaObservaciones);
      this.tramiteStore.setNoLicenciaSanitaria(DATOS.noLicenciaSanitaria);
      this.tramiteStore.setManifests(DATOS.manifests);
    }
  
  /**
   * Actualiza los datos relacionados con el pago de derechos en el formulario,
   * utilizando la información proporcionada en el estado de PermisoImportacionBiologica.
   *
   * @param DATOS - Objeto que contiene los datos necesarios para actualizar el pago de derechos,
   * incluyendo clave de referencia, cadena de la dependencia, llave de pago, fecha e importe.
   */
  actualizarPagoDerechosFormulario(DATOS: PermisoImportacionBiologicaState): void {
      this.tramiteStoreData.setClaveDeReferncia(DATOS.setClaveDeReferncia);
      this.tramiteStoreData.setCadenaDeLaDependencia(DATOS.setCadenaDeLaDependencia);
      this.tramiteStoreData.setLlaveDePago(DATOS.setLlaveDePago);
      this.tramiteStoreData.setFechaDePago(DATOS.setFechaDePago);
      this.tramiteStoreData.setImporteDePago(DATOS.setImporteDePago);
     
        if (DATOS.setBanco) {
          this.tramiteStoreData.setBanco(DATOS.setBanco);
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