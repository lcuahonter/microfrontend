import { Catalogo, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Solicitud30506State, Tramite30506Store } from '../state/tramite30506.store ';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  /**
    * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
    */
  urlServer = ENVIRONMENT.URL_SERVER;
  /**
   * urlServerCatalogos es la URL del servidor para los catálogos auxiliares.
   * Se utiliza para obtener datos de catálogos desde un archivo JSON.
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor del servicio.
   * Se utiliza para la inyección de dependencias.
   *
   * @param http Cliente HTTP para realizar solicitudes a servicios externos.
   */
  constructor(
    private http: HttpClient, private tramite30506Store: Tramite30506Store
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
     * Actualiza el estado global del formulario con los datos proporcionados.
     * @param DATOS Objeto con los datos del formulario de tipo Solicitud30506State.
     */
  actualizarEstadoFormulario(DATOS: Solicitud30506State): void {
    this.tramite30506Store.setBanco(DATOS.banco);
    this.tramite30506Store.setNumeroOperacion(DATOS.numeroOperacion);
    this.tramite30506Store.setFechaInicio(DATOS.fechaInicio);
    this.tramite30506Store.setFechaFinal(DATOS.fechaFinal);
    this.tramite30506Store.setLlave(DATOS.llave);
    this.tramite30506Store.setFechaPago(DATOS.fechaPago);
    this.tramite30506Store.setManifiesto1(DATOS.manifiesto1);
    this.tramite30506Store.setManifiesto2(DATOS.manifiesto2);
    this.tramite30506Store.setClaveReferencia(DATOS.claveReferencia);
    this.tramite30506Store.setCadenaDependecia(DATOS.cadenaDependecia ); 
    this.tramite30506Store.setImportePago(DATOS.importePago);
  }
  /**
     * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
     * @returns Observable con los datos del formulario.
     */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud30506State> {
    return this.http.get<Solicitud30506State>('assets/json/30506/registro_toma_muestras_mercancias.json');
  }
  /**
   * Obtiene los datos del catálogo de bancos.
   * Realiza una solicitud HTTP para obtener la lista de bancos desde un archivo JSON.
   *
   * @returns Un observable que emite una lista de objetos de tipo `Catalogo`.
   */
  obtenerDatosBanco(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/30506/banco.json');
  }

}
