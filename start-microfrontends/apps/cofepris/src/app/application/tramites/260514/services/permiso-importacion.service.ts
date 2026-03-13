import {
  MercanciasTabla,
  RespuestaTabla,
} from '../../../shared/components/domicilio-establecimiento-aduanas/domicilio-establecimiento-aduanas.component';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpCoreService } from '@libs/shared/data-access-user/src/core/services/shared/http/http.service';
import { Injectable } from '@angular/core';
import { PROC_260514 } from '../servers/api-route';
import { Solicitud260514State } from '../../../estados/tramites/260514/tramite260514.store';
import { Tramite260514Query } from '../../../estados/queries/260514/tramite260514.query';


@Injectable({
  providedIn: 'root',
})
export class DatosDomicilioService {


  /**
   * Subject utilizado para emitir y escuchar eventos personalizados dentro del servicio.
   * Puede ser suscrito para comunicación basada en eventos entre componentes o servicios.
   * @private
   */
  private eventSubject = new Subject();
  /**
   * Flujo observable que emite eventos desde el subject interno de eventos.
   * Suscríbete a este observable para escuchar notificaciones de eventos.
   */
  event$ = this.eventSubject.asObservable();
  /**
   * Servicio para obtener datos de terceros relacionados y permisos.
   *
   * @param http - Instancia de HttpClient para realizar solicitudes HTTP.
   */
  constructor(
    public http: HttpClient,
    private query: Tramite260514Query,
    public httpService: HttpCoreService,
  ) {
    // Constructor del servicio
  }

  /**
       * Obtiene todos los datos del estado almacenado en el store.
       * @returns {Observable<Solicitud260514State>} Observable con todos los datos del estado.
      */
    getAllState(): Observable<Solicitud260514State> {
      return this.query.allStoreData$;
    }

    /**
       * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
       *
       * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
       * @returns Observable con la respuesta de la solicitud POST.
       */
      guardarDatosPost(body: Record<string, unknown>): Observable<Record<string, unknown>> {
        return this.httpService.post<Record<string, unknown>>(PROC_260514.GUARDAR, { body: body });
      }

  /**
   * Obtiene los datos de la tabla desde un archivo JSON local.
   *
   * @returns Observable que emite un objeto RespuestaTabla.
   */
  getObtenerTablaDatos(): Observable<RespuestaTabla> {
    return this.http.get<RespuestaTabla>('assets/json/cofepris/clave-scian.json');
  }

  /**
   * Obtiene los datos de mercancías desde un archivo JSON local.
   *
   * @returns Observable que emite un objeto MercanciasTabla.
   */
  getObtenerMercanciasDatos(): Observable<MercanciasTabla> {
    return this.http.get<MercanciasTabla>(
      'assets/json/cofepris/mercancias-tabla.json'
    );
  }

  /**
   * Emite un evento booleano a los suscriptores a través de eventSubject.
   *
   * @param datos - El valor booleano que se emitirá a los observadores.
   */
  emitEvent(datos: boolean): void {
    this.eventSubject.next(datos);
  }
}
