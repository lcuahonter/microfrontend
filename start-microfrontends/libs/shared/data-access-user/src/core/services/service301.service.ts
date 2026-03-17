import { Solicitud301State, Tramite301Store } from '../../../src/core/estados/tramite301.store';
import { ENVIRONMENT } from '../../enviroments/enviroment'
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Solocitud301Service {
  /**
   * URL base del servidor principal.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
  /**
   * La URL del servidor utilizada para operaciones auxiliares con JSON.
   * Este valor se obtiene de la configuración del entorno.
   */
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

  /**
   * Recupera los datos del "Registro de Toma de Muestras de Mercancías" desde un archivo JSON local.
   *
   * @returns Un Observable que emite el estado actual de Solicitud301.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud301State> {
    return this.http.get<Solicitud301State>('assets/json/301/registro_toma_muestras_mercancias.json');
  }

}
