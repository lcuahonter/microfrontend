import { Observable, map } from 'rxjs';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notificadores } from '../../models/303/notificadores.model';
import { PagoDerechos } from '../../models/303/pago-derechos.model';
import { RepresentanteLegal } from '../../models/303/representante-legal.model';

@Injectable({
  providedIn: 'root'
})
export class Tramite303Service {

  /**
   * Constructor del servicio Tramite303Service.
   * @param http HttpClient para realizar peticiones HTTP.
   */
  constructor(private http: HttpClient) { }

  /** Método para buscar un representante legal por su RFC */
  buscarFisicaPorRFC(rfc: string): Observable<RepresentanteLegal | undefined> {
    return this.http
      .get<RepresentanteLegal[]>(`/assets/json/303/representante-legal.json`)
      .pipe(map(list => list.find(t => t.rfc === rfc)));
  }

  /**
   * Consulta los notificadores.
   * @returns Observable con la lista de notificadores.
   */
  consultaNotificadores(): Observable<Notificadores[]> {
    return this.http.get<Notificadores[]>(`/assets/json/303/notificadores.json`);
  }
/**
 * Consulta los bancos.
 * @returns Observable con la lista de bancos.
 */
  consultaBanco(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`/assets/json/303/cat-banco.json`);
  }

  /**
   * Consulta los importes de pago.
   * @returns Observable con la lista de importes de pago.
   */
  consultaImportePago(): Observable<PagoDerechos> {
    return this.http.get<PagoDerechos>(`/assets/json/303/importe-pago.json`);
  }
}
