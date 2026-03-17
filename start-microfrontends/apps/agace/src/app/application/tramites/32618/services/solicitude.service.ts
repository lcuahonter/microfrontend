import { HttpClient } from '@angular/common/http';
// eslint-disable-next-line sort-imports
import { EnlaceOperativo, Inventarios, RecibirNotificaciones, RepresentanteLegal, SeccionSubcontratados, SolicitudCatologoSelectLista, SolicitudRadioLista } from '../models/solicitud.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SolicitudStore } from '../estados/solicitud.store';


@Injectable({
  providedIn: 'root'
})
export class SolicitudeService {

  constructor(
     private http: HttpClient,
        public solicitudStore: SolicitudStore
  ) { }
  /**
     * Obtiene los inventarios registrados desde un archivo JSON local.
     * @returns Observable con un arreglo de Inventarios.
     */
    conseguirInventarios(): Observable<Inventarios[]> {
      return this.http.get<Inventarios[]>(
        'assets/json/32605/inventarios-datos.json'
      );
    }
    
      /**
       * Obtiene los catálogos selectivos de la solicitud desde un archivo JSON local.
       * @returns Observable con un objeto de tipo SolicitudCatologoSelectLista.
       */
      conseguirSolicitudCatologoSelectLista(): Observable<SolicitudCatologoSelectLista> {
        return this.http.get<SolicitudCatologoSelectLista>(
          'assets/json/32605/solicitud-catologo-select-lista.json'
        );
      }
      /**
         * Obtiene las opciones de radio de la solicitud desde un archivo JSON local.
         * @returns Observable con un objeto de tipo SolicitudRadioLista.
         */
        conseguirOpcionDeRadio(): Observable<SolicitudRadioLista> {
          return this.http.get<SolicitudRadioLista>(
            'assets/json/32605/solicitud-radio-lista.json'
          );
        }
         /**
           * Obtiene los datos de la sección de subcontratados desde un archivo JSON local.
           * @returns Observable con un objeto de tipo SeccionSubcontratados.
           */
          conseguirSeccionSubcontratados(): Observable<SeccionSubcontratados> {
            return this.http.get<SeccionSubcontratados>(
              'assets/json/32605/seccion-subcontratados.json'
            );
          }

           /**
             * Obtiene la lista de opciones para recibir notificaciones.
             */
            conseguirRecibirNotificaciones(): Observable<RecibirNotificaciones[]> {
              return this.http.get<RecibirNotificaciones[]>(
                'assets/json/32605/recibir-notificaciones.json'
              );
            }
             /**
               * Obtiene la lista de enlaces operativos desde un archivo JSON local.
               * @returns Observable con un arreglo de EnlaceOperativo.
               */
              conseguirEnlaceOperativoDatos(): Observable<EnlaceOperativo[]> {
                return this.http.get<EnlaceOperativo[]>(
                  'assets/json/32605/enlace-operativo-datos.json'
                );
              }
              /**
                 * Obtiene los datos del representante legal desde un archivo JSON local.
                 * @returns Observable con un objeto de tipo RepresentanteLegal.
                 */
                conseguirRepresentanteLegalDatos(): Observable<RepresentanteLegal> {
                  return this.http.get<RepresentanteLegal>(
                    'assets/json/32605/representante-legal-datos.json'
                  );
                }
}
