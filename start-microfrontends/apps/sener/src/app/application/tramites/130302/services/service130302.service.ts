import { ExportarIlustraciones130302State, Tramite130302Store } from '../estados/tramite130302.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de manejar la lógica y comunicación relacionada con el trámite 130302.
 * Proporciona métodos para actualizar el estado del formulario y obtener datos de consulta.
 */
@Injectable({
  providedIn: 'root',
})
export class Service130302Service {
  /**
   * URL del servidor principal.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
  /**
   * URL del servidor de catálogos auxiliares.
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar peticiones.
   * @param tramite130302Store Almacén de estado para el trámite 130302.
   */
  constructor(private http: HttpClient, private tramite130302Store: Tramite130302Store) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario en el store a partir de los datos proporcionados.
   * @param DATOS Estado actual del formulario de trámite 130302.
   */
  actualizarEstadoFormulario(DATOS: ExportarIlustraciones130302State): void {
   
    if (DATOS.fechaPago) {
      this.tramite130302Store.setfechaPago(DATOS.fechaPago);

    }
     if (DATOS.prorrogaAl) {
      this.tramite130302Store.setprorrogaAl(DATOS.prorrogaAl);
    }
    if (DATOS.motivoJustificacion) {
      this.tramite130302Store.setmotivoJustificacion(DATOS.motivoJustificacion);
    }
     if (DATOS.otrasDeclaraciones) {
      this.tramite130302Store.setotrasDeclaraciones(DATOS.otrasDeclaraciones);
    }
  }

  /**
   * Obtiene los datos de consulta para el registro de toma de muestras de mercancías.
   * @returns Observable con el estado del trámite 130302.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<ExportarIlustraciones130302State> {
    return this.http.get<ExportarIlustraciones130302State>('assets/json/130302/consulta.json');
  }

}
