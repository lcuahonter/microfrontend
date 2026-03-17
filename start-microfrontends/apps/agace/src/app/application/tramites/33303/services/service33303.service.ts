import { UnicoState, UnicoStore } from '../estados/renovacion.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de manejar la lógica y comunicación relacionada con el trámite 317.
 * Proporciona métodos para actualizar el estado del formulario y obtener datos de consulta.
 */
@Injectable({
  providedIn: 'root',
})
export class Service33303Service {
  /**
   * URL del servidor principal.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
  /**
   * URL del servidor de catálogos auxiliares.
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar peticiones.
   * @param tramite33303Store Almacén de estado para el trámite 33303.
   */
  constructor(private http: HttpClient, private unicoStore: UnicoStore,) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario en el store a partir de los datos proporcionados.
   * @param DATOS Estado actual del formulario de trámite 33303.
   */
  actualizarEstadoFormulario(DATOS: UnicoState): void {
    if (DATOS.numeroOperacion) {
      this.unicoStore.setnumeroOperacion(DATOS.numeroOperacion);
    }
    if (DATOS.banco) {
      this.unicoStore.setbanco(DATOS.banco);
    }
    if (DATOS.llavePago) {
      this.unicoStore.setllavePago(DATOS.llavePago);
    }
    if (DATOS.fechaPago) {
      this.unicoStore.setfechaPago(DATOS.fechaPago);
    }
    if (DATOS.mapTipoTramite) {
      this.unicoStore.setmapTipoTramite(DATOS.mapTipoTramite);
    }
   
    if (DATOS.foreignClientsSuppliers) {
      this.unicoStore.setforeignClientsSuppliers(DATOS.foreignClientsSuppliers);
    }
    if (DATOS.nationalSuppliers) {
      this.unicoStore.setnationalSuppliers(DATOS.nationalSuppliers);
    }
    if (DATOS.modificationsMembers) {
      this.unicoStore.setmodificationsMembers(DATOS.modificationsMembers);
    }
    if (DATOS.changesToLegalDocuments) {
      this.unicoStore.setchangesToLegalDocuments(DATOS.changesToLegalDocuments);
    }
    if (DATOS.mergerOrSplitNotice) {
      this.unicoStore.setmergerOrSplitNotice(DATOS.mergerOrSplitNotice);
    }
    if (DATOS.additionFractions) {
      this.unicoStore.setadditionFractions(DATOS.additionFractions);
    }
    if (DATOS.additionmodificación) {
      this.unicoStore.setadditionmodificación(DATOS.additionmodificación);
    }
    if (DATOS.additionPresentación) {
      this.unicoStore.setadditionPresentación(DATOS.additionPresentación);
    }
    if (DATOS.acepto253) {
      this.unicoStore.setacepto253(DATOS.acepto253);
    }
  }

  /**
   * Obtiene los datos de consulta para el registro de toma de muestras de mercancías.
   * @returns Observable con el estado del trámite 317.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<UnicoState> {
    return this.http.get<UnicoState>('assets/json/33303/consulta.json');
  }

}
