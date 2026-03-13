/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatosDelTramite } from '../modelos/acuicola.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagoDeDerechos } from '../modelos/acuicola.model';
import { PagoDeDerechosRevision } from '../modelos/acuicola.model';
import { ResponsableInspección } from '../modelos/acuicola.model';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Subject } from 'rxjs';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcuicolaService {

  private apiUrl = 'assets/json/220701/';
  private unsubscribe$ = new Subject<void>();

  constructor(
    private http: HttpClient
    // eslint-disable-next-line no-empty-function
  ) {

  }

  /**
   * @description Obtiene los detalles de un catálogo desde un archivo JSON.
   * @param nombreDelArchivo Nombre del archivo JSON del catálogo.
   * @returns Observable con la respuesta del catálogo.
   */
  obtenerDetallesDelCatalogo(nombreDelArchivo: string): Observable<RespuestaCatalogos> {
    const BASEURL: string = this.apiUrl + nombreDelArchivo; 
    return this.http.get<RespuestaCatalogos>(BASEURL);
  }

  obtenerDatosCertificados(): Observable<DatosDelTramite> {
    return this.http.get<DatosDelTramite>(`${this.apiUrl}datos-certificados.json`).pipe(
      map((res: any) => res.data),
      takeUntil(this.unsubscribe$)
    );
  }

  getHoraDeInspeccion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}hora-de-inspeccion.json`).pipe(
      map(response => response),
      takeUntil(this.unsubscribe$)
    );
  }

  getAduanaDeIngreso(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}aduana-de-ingreso.json`).pipe(
      map(response => response),
      takeUntil(this.unsubscribe$)
    );
  }

  getOficinaDeInspeccion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}oficina-de-inspeccion.json`).pipe(
      map(response => response),
      takeUntil(this.unsubscribe$)
    );
  }

  getPuntoDeInspeccion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}punto-de-inspeccion.json`).pipe(
      map(response => response),
      takeUntil(this.unsubscribe$)
    );
  }

  obtenerResponsableDatos(): Observable<ResponsableInspección> {
    return this.http.get<ResponsableInspección>(`${this.apiUrl}responsable-inspeccion.json`).pipe(
      map((res: any) => res.data),
      takeUntil(this.unsubscribe$)
    );
  }

  getTipoContenedor(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}tipo-contenedor.json`).pipe(
      map(response => response),
      takeUntil(this.unsubscribe$)
    );
  }

  getMedioDeTransporte(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}medio-de-transporte.json`).pipe(
      map(response => response),
      takeUntil(this.unsubscribe$)
    );
  }

  getBancoDatos(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}banco-datos.json`).pipe(
      map(response => response),
      takeUntil(this.unsubscribe$)
    );
  }


  pagoDeCargarDatos(): Observable<PagoDeDerechos> {
    return this.http.get<PagoDeDerechos>(`${this.apiUrl}pago-de-derechos.json`).pipe(
      map((res: any) => res.data),
      takeUntil(this.unsubscribe$)
    );
  }

  getPagoDerechosRevision(): Observable<PagoDeDerechosRevision> {
    return this.http.get<PagoDeDerechosRevision>(`${this.apiUrl}pago-de-derechos-revision.json`).pipe(
      map((res: any) => res.data),
      takeUntil(this.unsubscribe$)
    );
  }

}
