import { CargarDatosIniciales } from '../models/pantallas-captura.model';
import { CatalogosSelect } from '@ng-mf/data-access-user';
import { DatosDelTramiteRealizar } from '../models/pantallas-captura.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/** Servicio para obtener los datos de la solicitud */
@Injectable({
  providedIn: 'root',
})
/** Servicio para obtener los datos de la solicitud */
export class SolicitudPantallasService {
  /** URL para obtener los datos de la solicitud */
  private dataUrl =
    '../../../assets/json/220502/solicitud-pantallas-mock-data.json';

  /** Constructor para inyectar el servicio HttpClient */
  constructor(public http: HttpClient) {
    /** Llamar al método para obtener los datos */
    this.getData();
  }

  /** Método para obtener los datos de la solicitud
   * @returns Observable<CargarDatosIniciales>
   */
  getData(): Observable<CargarDatosIniciales> {
    return this.http.get<CargarDatosIniciales>(this.dataUrl).pipe();
  }

  /** Método para obtener los datos de la solicitud
   * @returns Observable<DatosDelTramiteRealizar>
   */
  getDataDatosDelTramite(): Observable<DatosDelTramiteRealizar> {
    return this.http.get<DatosDelTramiteRealizar>(this.dataUrl).pipe();
  }

  /** Método para obtener los datos de la solicitud
   * @returns Observable<CatalogosSelect>
   */
  getDataResponsableInspeccion(): Observable<{
    tipoContenedor: CatalogosSelect;
  }> {
    return this.http
      .get<{ tipoContenedor: CatalogosSelect }>(this.dataUrl)
      .pipe();
  }
}
