import { AcuseYResolucionesFolioTramite } from '../../../models/shared/acuse-y-resoluciones-folio-tramite.model';
import { AcuseYResolucionesFolioTramiteDetalles } from '../../../models/shared/acuse-y-resoluciones-foilio-tramite-detalles.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar las operaciones relacionadas con los acuses y resoluciones por folio de trámite.
 */
@Injectable({
  providedIn: 'root',
})
export class AcuseYResolucionesFolioTramiteService {
  /**
   * Constructor de la clase.
   * @param http Cliente HTTP para realizar peticiones a servicios externos.
   */
  constructor(private http: HttpClient) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Obtiene la lista de acuses y resoluciones por folio de trámite.
   * @returns Un observable que emite un arreglo de objetos del tipo `AcuseYResolucionesFolioTramite`.
   */
  getAcuseYResolucionesFolioTramite(): Observable<AcuseYResolucionesFolioTramite[]> {
    return this.http.get<AcuseYResolucionesFolioTramite[]>('./assets/json/shared/acuses-y-resoluciones-folio-tramite.json');
  }

  /**
   * Obtiene los detalles de los acuses y resoluciones por folio de trámite.
   * @returns Un observable que emite un arreglo de objetos del tipo `AcuseYResolucionesFolioTramiteDetalles`.
   */
  getAcuseYResolucionesFolioTramiteDetalles(): Observable<AcuseYResolucionesFolioTramiteDetalles[]> {
    return this.http.get<AcuseYResolucionesFolioTramiteDetalles[]>('./assets/json/shared/acuses-y-resoluciones-folio-tramite-detalles.json');
  }
}