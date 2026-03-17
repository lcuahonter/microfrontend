import { CancelacionesState, CancelacionesStore } from '../estados/cancelaciones.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  constructor(private http: HttpClient, private cancelacionesStore: CancelacionesStore,) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario de cancelaciones en el store correspondiente.
   * 
   * Este método toma un objeto `CancelacionesState` con los datos del formulario y actualiza
   * los valores en el store de cancelaciones utilizando los métodos setters apropiados.
   * Solo actualiza los campos de entidad federativa, colonia, localidad y municipio si están presentes.
   * 
   * @param DATOS - Objeto que contiene el estado actual del formulario de cancelaciones.
   */
  actualizarEstadoFormulario(DATOS: CancelacionesState): void {
    // Actualiza el municipio o alcaldía en el store solo si el dato está presente en el objeto DATOS.
    if (DATOS.entidadFederativa) {
      this.cancelacionesStore.setEntidadFed(DATOS.entidadFederativa);
    }
    // Actualiza el municipio o alcaldía en el store solo si el dato está presente en el objeto DATOS.
    if (DATOS.colonia) {
      this.cancelacionesStore.setColonia(DATOS.colonia);
    }

    // Actualiza el municipio o alcaldía en el store solo si el dato está presente en el objeto DATOS.
    if (DATOS.localidad) {
      this.cancelacionesStore.setLocalidad(DATOS.localidad);
    }

    // Actualiza el municipio o alcaldía en el store solo si el dato está presente en el objeto DATOS.
    if (DATOS.municipio) {
      this.cancelacionesStore.setMunicipiosAlcaldia(DATOS.municipio);
    }
    this.cancelacionesStore.setPaisInput(DATOS.paisInput);
    this.cancelacionesStore.setNumeroInterior(DATOS.numeroInterior);
    this.cancelacionesStore.setCodigoPostal(DATOS.codigoPostal);
    this.cancelacionesStore.setTelefono(DATOS.telefono);
    this.cancelacionesStore.setNombre(DATOS.nombre);
    this.cancelacionesStore.setApellidoPaterno(DATOS.apellidoPaterno);
    this.cancelacionesStore.setCorreoElectronico(DATOS.correoElectronico);
    this.cancelacionesStore.setRfcIngresado(DATOS.rfcIngresado);
    this.cancelacionesStore.setMotivoCancelacion(DATOS.motivoCancelacion);
    this.cancelacionesStore.setEntidadExterna(DATOS.entidadExterna);
    this.cancelacionesStore.setNombreSolicitanteIPC(DATOS.nombreSolicitanteIPC);
    this.cancelacionesStore.setCargoSolicitanteIPC(DATOS.cargoSolicitanteIPC);
    this.cancelacionesStore.setFolioOficioSolicitudIPC(DATOS.folioOficioSolicitudIPC);
    this.cancelacionesStore.setCorreoSolicitanteIPC(DATOS.correoSolicitanteIPC);
  }

  /**
   * Obtiene los datos del estado de cancelaciones para el registro de toma de muestras de mercancías.
   * Realiza una solicitud HTTP GET para recuperar la información desde un archivo JSON local.
   *
   * @returns Un observable que emite el estado de cancelaciones (`CancelacionesState`).
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<CancelacionesState> {
    return this.http.get<CancelacionesState>('assets/json/140201/actualizar-datos-estado.json');
  }

}
