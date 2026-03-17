import { Agregar270301Store, Solicitud270301State } from '../estados/tramites/agregar270301.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de manejar la lógica y comunicación relacionada con el trámite 270301.
 * Proporciona métodos para actualizar el estado del formulario y obtener datos de consulta.
 */
@Injectable({
  providedIn: 'root',
})
export class Service270301Service {
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
   * @param tramite270301Store Almacén de estado para el trámite 270301.
   */
  constructor(private http: HttpClient, private agregar270301Store: Agregar270301Store,) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario en el store a partir de los datos proporcionados.
   * @param DATOS Estado actual del formulario de trámite 270301.
   */
  actualizarEstadoFormulario(DATOS: Solicitud270301State): void {

    this.agregar270301Store.settipoDeOperacion(DATOS.tipoDeOperacion);
    this.agregar270301Store.settipoDeMovimiento(DATOS.tipoDeMovimiento);
    this.agregar270301Store.setmotivo(DATOS.motivo);
    this.agregar270301Store.setpais(DATOS.pais);
    this.agregar270301Store.setmedioTransporte(DATOS.medioTransporte);
    this.agregar270301Store.setdestinofinal(DATOS.destinofinal);
    this.agregar270301Store.setperiodoEstancia(DATOS.periodoEstancia);
    this.agregar270301Store.setaduanaEntrada(DATOS.aduanaEntrada);
    this.agregar270301Store.setmanifiesto(DATOS.manifiesto);
    if (DATOS.ciudad) {
      this.agregar270301Store.setciudad(DATOS.ciudad);
    }
    if (DATOS.emprsaTransportista) {
      this.agregar270301Store.setemprsaTransportista(DATOS.emprsaTransportista);
    }
     this.agregar270301Store.setObraDeArte(DATOS.ObraDeArte);
    
  }

  /**
   * Obtiene los datos de consulta para el registro de toma de muestras de mercancías.
   * @returns Observable con el estado del trámite 270301.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud270301State> {
    return this.http.get<Solicitud270301State>('assets/json/270301/consulta.json');
  }

}
