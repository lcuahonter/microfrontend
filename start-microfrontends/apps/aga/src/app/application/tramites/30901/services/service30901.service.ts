import { Solicitud30901State, Solicitud30901Store } from '../estados/tramites30901.store'
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Solocitud30901Service {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;
/**
 * Servicio para manejar la lógica de negocio relacionada con la solicitud 30901.
 */
  constructor(private http: HttpClient, private solicitud30901Store: Solicitud30901Store,) {
    // Lógica de inicialización si es necesario
  }

/**
 * Actualiza el estado del formulario con los datos proporcionados.
 * @param DATOS - Objeto que contiene los datos del formulario.
 */

  actualizarEstadoFormulario(DATOS: Solicitud30901State): void {
    this.solicitud30901Store.setOpcionDeImportador(DATOS.opcionDeImportador);
    this.solicitud30901Store.setTomaMuestraDespacho(DATOS.tomaMuestraDespacho);
    this.solicitud30901Store.setDescMotivoFaltaMuestra(DATOS.descMotivoFaltaMuestra);
    this.solicitud30901Store.setComboFraccionConcatenada(DATOS.comboFraccionConcatenada);
    this.solicitud30901Store.setFraccionConcatenada(DATOS.fraccionConcatenada);
    this.solicitud30901Store.setComboNicos(DATOS.comboNicos);
    this.solicitud30901Store.setFraccionDescripcion(DATOS.fracciondescripcion);
    this.solicitud30901Store.setNombreQuimico(DATOS.nombreQuimico);
    this.solicitud30901Store.setNombreComercial(DATOS.nombreComercial);
    this.solicitud30901Store.setNumeroCAS(DATOS.numeroCAS);
    this.solicitud30901Store.setNicoDescripcion(DATOS.nicoDescripcion);
    this.solicitud30901Store.setIdeGenerica(DATOS.ideGenerica);
    this.solicitud30901Store.setDescClobGenerica(DATOS.descClobGenerica);
    this.solicitud30901Store.setFechaInicioVigencia(DATOS.fechaInicioVigencia);
    this.solicitud30901Store.setFechaFinVigencia(DATOS.fechaFinVigencia);
    this.solicitud30901Store.setLineaCaptura(DATOS.lineaCaptura);
    this.solicitud30901Store.setValorPago(DATOS.valorPago); 
    this.solicitud30901Store.setPagoDerechosLista(DATOS.pagoDerechosLista);
  }
/**
 * Obtiene los datos de registro de toma de muestras de mercancías desde un archivo JSON.
 */
  getRegistroRenovacionesMuestrasMercanciasData(): Observable<Solicitud30901State> {
    return this.http.get<Solicitud30901State>('assets/json/30901/registro_toma_muestras_mercancias.json');
  }

}
