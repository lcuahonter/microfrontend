import { COMUN_URL, Catalogo, CatalogoServices } from '@libs/shared/data-access-user/src';
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * Servicio para gestionar las solicitudes relacionadas con los catálogos y datos del trámite 110201.
 */
@Injectable({
  providedIn: 'root',
})
export class DestinatarioService {
  /** URL base del host para las solicitudes */
  host: string;

  /** Constructor del servicio DestinatarioService */
  constructor(private catalogoServices: CatalogoServices) {
    this.host = `${COMUN_URL.BASE_URL}`
  }

  /** Obtiene la lista de países de destino para el trámite especificado */
  getPaisDestino(tramite: string): Observable<Catalogo[]> {
    if (tramite === '110201') {
      return this.catalogoServices.paisesBloqueCatalogo(tramite).pipe(
        map(res => res?.datos ?? [])
      );
    }
    else if (tramite === '110202') {
      return this.catalogoServices.paisesCatalogo(tramite).pipe(
        map(res => res?.datos ?? [])
      );
    }
    return this.catalogoServices.paisesDestinoCatalogo(tramite).pipe(
      map(res => res?.datos ?? [])
    );

  }

  /** Obtiene la lista de medios de transporte para el trámite especificado */
  getTransporte(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.catalogoMedioTransporte(tramite).pipe(
      map(res => res?.datos ?? [])
    );
  }

}
