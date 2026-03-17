import { ENVIRONMENT } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DomicilioState, DomicilioStore } from '../estados/stores/domicilio.store';

/**
 * Servicio para gestionar los datos relacionados con el domicilio y operaciones auxiliares.
 */
@Injectable({
  providedIn: 'root',
})
export class DatosServiceService {
  /**
   * Almacena el número o identificador del trámite (procedimiento) seleccionado o en curso.
   * Puede ser utilizado para compartir el valor del trámite entre componentes o servicios.
   * El tipo es 'any' para permitir flexibilidad en el tipo de dato almacenado.
   */
  public procedureNo: any;
  /**
   * URL base del servidor principal.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
  /**
   * URL base del servidor de catálogos auxiliares.
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar peticiones.
   * @param domicilioStore Tienda de estado para el domicilio.
   */
  constructor(
    private http: HttpClient,
    private domicilioStore: DomicilioStore,
  ) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario de domicilio en el store.
   * @param DATOS Objeto con los datos del domicilio a actualizar.
   */
  actualizarEstadoFormulario(DATOS: DomicilioState): void {
    this.domicilioStore.setrRfc(DATOS.rfc);
    this.domicilioStore.setDenominacion(DATOS.denominacion);
    this.domicilioStore.setCorreoElectronico(DATOS.correoElectronico);
    this.domicilioStore.setCodigoPostal(DATOS.codigoPostal);
    this.domicilioStore.setEstado(DATOS.estado);
    this.domicilioStore.setMunicipio(DATOS.municipio);
    this.domicilioStore.setLocalidad(DATOS.localidad);
    this.domicilioStore.setColonia(DATOS.colonia);
    this.domicilioStore.setCalle(DATOS.calle);
    this.domicilioStore.setLada(DATOS.lada);
    this.domicilioStore.setTelefono(DATOS.telefono);
    this.domicilioStore.setNoLicenciaSanitaria(DATOS.noLicenciaSanitaria);
    if (DATOS.regimenDestinado) {
      this.domicilioStore.setRegimenDestinado(DATOS.regimenDestinado);
    }
    if (DATOS.aduana) {
      this.domicilioStore.setAduana(DATOS.aduana);
    }

    if (DATOS.autorizacionIVAIEPS) {
      this.domicilioStore.setAutorizacionIVAIEPS(DATOS.autorizacionIVAIEPS);
    }
    this.domicilioStore.setNombreRazonSocial(DATOS.nombreRazonSocial);
    this.domicilioStore.setApellidoPaterno(DATOS.apellidoPaterno);
    this.domicilioStore.setApellidoMaterno(DATOS.apellidoMaterno);
  }

  /**
   * Obtiene los datos de registro para toma de muestras de mercancías desde un archivo JSON local.
   * @returns Observable con los datos del estado de domicilio.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<DomicilioState> {
    return this.http.get<DomicilioState>('assets/json/shared/datos.json');
  }

}
