import {Catalogo} from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MercanciasTabla } from '../../modelos/modificación-del-permiso-sanitario-de-importación-de-insumo.model';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { RespuestaTabla } from '../../modelos/modificación-del-permiso-sanitario-de-importación-de-insumo.model';

// Interface para el representante legal
export interface RepresentanteLegal {
  rfc: string;
  nombreDenominacionORazonSocial: string;
}

@Injectable({
  providedIn: 'root',
})
export class DomicilioDelEstablecimientoService {
  private readonly tablaDatosUrl =
    '../../../../../assets/json/260904/tablaDatos.json';
  private readonly estadoListUrl =
    '../../../../../assets/json/260904/seleccion.json';
  private readonly mercanciasDatosUrl =
    '../../../../../assets/json/260904/mercanciasDatos.json';

  constructor(private http: HttpClient) {
    //constructor
  }

  /**
   * Método para obtener los datos de la tabla NICO.
   * @returns {Observable<RespuestaTabla>} Observable con los datos de la tabla.
   */
  obtenerTablaDatos(): Observable<RespuestaTabla> {
    return this.http.get<RespuestaTabla>(this.tablaDatosUrl);
  }

  /**
   * Método para obtener la lista de estados.
   * @returns {Observable<RespuestaCatalogos>} Observable con los datos de los estados.
   */
  obtenerEstadoList(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(this.estadoListUrl);
  }

  /**
   * Método para obtener los datos de mercancías.
   * @returns {Observable<MercanciasTabla>} Observable con los datos de mercancías.
   */
  obtenerMercanciasDatos(): Observable<MercanciasTabla> {
    return this.http.get<MercanciasTabla>(this.mercanciasDatosUrl);
  }
  /**
   * Obtiene la lista de representaciones federales desde un archivo JSON local.
   * @returns Observable que emite los datos de las representaciones federales.
   */
  getRepresentacion(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260904/descriptionClave.json');
  }
   /**
   * Obtiene la lista de entidades federativas desde un archivo JSON local.
   * @returns Observable que emite los datos de las entidades federativas.
   */
  getEntidad(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260904/clavescian.json');
  }
  buscarRepresentanteLegalPorRFC(
      rfc: string
    ): Observable<{ nombre: string; apellidoPaterno: string; apellidoMaterno: string } | null> {
      // Busca el RFC en el archivo destinatario-de-tabla.json
      return new Observable(observer => {
        this.http.get<RepresentanteLegal[]>('assets/json/260904/destinatario-de-tabla.json').subscribe(data => {
          const FOUND = data.find(item => item.rfc === rfc);
          if (FOUND) {
            // Separar nombre en nombre, apellidoPaterno, apellidoMaterno si es posible
            const NOMBRE_COMPLETO = FOUND.nombreDenominacionORazonSocial || '';
            const PARTES = NOMBRE_COMPLETO.split(' ');
            observer.next({
              nombre: PARTES[0] || '',
              apellidoPaterno: PARTES[1] || '',
              apellidoMaterno: PARTES.slice(2).join(' ') || ''
            });
          } else {
            observer.next(null);
          }
          observer.complete();
        }, () => {
          observer.next(null);
          observer.complete();
        });
      });
    }
}
