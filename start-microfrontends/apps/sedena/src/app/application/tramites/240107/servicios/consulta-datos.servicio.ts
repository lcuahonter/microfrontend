/**
 * Servicio para consultar y actualizar los datos del trámite 240107.
 * Proporciona métodos para actualizar diferentes secciones del estado del formulario
 * y obtener los datos de la solicitud desde un archivo JSON.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { Tramite240107State } from '../estados/tramite240107Store.store';
import { Tramite240107Store } from '../estados/tramite240107Store.store';

/**
 * Servicio para consultar y actualizar los datos del trámite 240107.
 * Proporciona métodos para actualizar diferentes secciones del estado del formulario
 * y obtener los datos de la solicitud desde un archivo JSON.
 *
 * @author
 * @version 1.0
 * @since 2025-06-24
 */
@Injectable({
  providedIn: 'root',
})
/**
 * @description
 * Servicio Angular inyectable para el manejo de los datos del trámite 240107.
 * Permite actualizar el estado del formulario y obtener datos de la solicitud desde un archivo JSON.
 *
 * @see Tramite240107Store
 * @see Tramite240107State
 */
export class ConsultaDatosService {
  constructor(
    private http: HttpClient,
    private readonly tramiteStore: Tramite240107Store,
    private readonly seccionStore: SeccionLibStore
  ) {
    // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * @description Actualiza los datos de la datosDel en el store.
   * @param datosDel Datos de la datosDel.
   */
  updateDatosDel(datosDel: Tramite240107State['datosDelTramite']): void {
    this.tramiteStore.updateDatosDelTramiteFormState(datosDel);
  }

  /**
   * @description Actualiza los datos generales pagoDerchos en el store.
   * @param pagoDerchos Datos generales pagoDerchos.
   */
  updatePagoDerechos(pagoDerchos: Tramite240107State['pagoDerechos']): void {
    this.tramiteStore.updatePagoDerechosFormState(pagoDerchos);
  }
  /**
   * @description Actualiza los datos generales destinatario en el store.
   * @param destinatario Datos generales destinatario.
   */
  updateDestinatario(
    destinatario: Tramite240107State['destinatarioFinalTablaDatos']
  ): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(destinatario);
  }
  /**
   * @description Actualiza los datos generales internos en el store.
   * @param proveedor Datos generales internos.
   */
  updateProveedor(proveedor: Tramite240107State['proveedorTablaDatos']): void {
    this.tramiteStore.updateProveedorTablaDatos(proveedor);
  }
  /**
   * @description Actualiza los datos generales internos en el store.
   * @param mercancia Datos generales internos.
   */
  updateMercancia(
    mercancia: Tramite240107State['merccancialTablaDatos']
  ): void {
    this.tramiteStore.updateMercanciaTablaDatos(mercancia);
  }

  /**
   * @description Actualiza el estado completo del formulario en el store.
   * @param {Tramite240107State} DATOS - Objeto con todos los datos del formulario.
   */
  actualizarEstadoFormulario(DATOS: Tramite240107State): void {
    this.tramiteStore.update((state) => ({
      ...state,
      ...DATOS
    }));
  }

  /**
   * Obtiene los datos de la solicitud desde un archivo JSON.
   * @returns Observable con los datos de la solicitud.
   */
  /**
   * Obtiene los datos de la solicitud desde un archivo JSON.
   * @returns Observable con los datos de la solicitud.
   */
  getDatosDeLaSolicitudData(): Observable<Tramite240107State> {
    return this.http.get<Tramite240107State>(
      'assets/json/240107/consulta-datos.json'
    );
  }
}
