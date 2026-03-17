import { Solicitud301State, Tramite301Store } from '../../../core/estados/tramites/tramite301.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Solocitud301Service {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  constructor(private http: HttpClient, private tramite301Store: Tramite301Store,) {
    // Lógica de inicialización si es necesario
  }

  actualizarEstadoFormulario(DATOS: Solicitud301State): void {
    this.tramite301Store.setRegistro(DATOS.registro);
    this.tramite301Store.setMercancia(DATOS.mercancia);
    this.tramite301Store.setFolio(DATOS.folio);
    this.tramite301Store.setFraccionArancelaria(DATOS.fraccionArancelaria);
    this.tramite301Store.setDescripcionFraccion(DATOS.descripcionFraccion);
    this.tramite301Store.setNico(DATOS.nico);
    this.tramite301Store.setDescripcionNico(DATOS.descripcionNico);
    this.tramite301Store.setNombreQuimico(DATOS.nombreQuimico);
    this.tramite301Store.setNombreComercial(DATOS.nombreComercial);
    this.tramite301Store.setNumeroCAS(DATOS.numeroCAS);
    this.tramite301Store.setEstadoFisico(DATOS.estadoFisico);
    this.tramite301Store.setAcondicionamiento(DATOS.acondicionamiento);
    this.tramite301Store.setLinea(DATOS.linea);
    this.tramite301Store.setLineaCheckbox(DATOS.lineaCheckbox);
  }

  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud301State> {
    return this.http.get<Solicitud301State>('assets/json/301/registro_toma_muestras_mercancias.json');
  }

}
