import { Tramite240108State, Tramite240108Store } from '../estados/tramite240108Store.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SeccionLibStore } from '@ng-mf/data-access-user';

/**
 * @service ConsultaDatosService
 * @description
 * Servicio para la consulta, carga y actualización del estado relacionado con el trámite 240108.
 * Permite interactuar con los stores de estado (`Tramite240108Store` y `SeccionLibStore`) y obtener información simulada desde un archivo local JSON.
 * 
 * @remarks
 * Este servicio sigue el patrón de "Service + Store" para la administración del estado de formularios en un flujo de trámite.
 * 
 * @example
 * ```ts
 * constructor(private consultaDatosService: ConsultaDatosService) {}
 * 
 * // Actualizar una sección del formulario
 * this.consultaDatosService.updateDatosDel(datos);
 * 
 * // Obtener datos simulados desde archivo local
 * this.consultaDatosService.getDatosDeLaSolicitudData().subscribe(data => console.log(data));
 * ```
 *
 * @see Tramite240108Store
 * @see SeccionLibStore
 */
@Injectable({
  providedIn: 'root',
})
export class ConsultaDatosService {
  /**
   * @constructor
   * @description
   * Constructor del servicio. Inyecta dependencias necesarias para interactuar con el store y realizar peticiones HTTP.
   * 
   * @param {HttpClient} http Cliente HTTP para realizar peticiones a archivos o APIs.
   * @param {Tramite240108Store} tramiteStore Store de Akita encargado de manejar el estado global del trámite 240108.
   * @param {SeccionLibStore} seccionStore Store de Akita utilizado para manejar el estado de secciones del formulario.
   */
  constructor(
    private http: HttpClient,
    private readonly tramiteStore: Tramite240108Store,
    private readonly seccionStore: SeccionLibStore
  ) {}

  /**
   * @method updateDatosDel
   * @description
   * Actualiza los datos generales del formulario de trámite en el store.
   * 
   * @param {Tramite240108State['datosDelTramite']} datosDel Objeto que representa los datos generales del formulario.
   */
  updateDatosDel(datosDel: Tramite240108State['datosDelTramite']): void {
    this.tramiteStore.updateDatosDelTramiteFormState(datosDel);
  }

  /**
   * @method updatePagoDerechos
   * @description
   * Actualiza la sección de pago de derechos en el store.
   * 
   * @param {Tramite240108State['pagoDerechos']} pagoDerchos Datos de pago a actualizar.
   */
  updatePagoDerechos(pagoDerchos: Tramite240108State['pagoDerechos']): void {
    this.tramiteStore.updatePagoDerechosFormState(pagoDerchos);
  }

  /**
   * @method updateDestinatario
   * @description
   * Actualiza la lista de destinatarios finales en el store.
   * 
   * @param {Tramite240108State['destinatarioFinalTablaDatos']} destinatario Lista de destinatarios.
   */
  updateDestinatario(
    destinatario: Tramite240108State['destinatarioFinalTablaDatos']
  ): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(destinatario);
  }

  /**
   * @method updateProveedor
   * @description
   * Actualiza la lista de proveedores en el store.
   * 
   * @param {Tramite240108State['proveedorTablaDatos']} proveedor Lista de proveedores.
   */
  updateProveedor(proveedor: Tramite240108State['proveedorTablaDatos']): void {
    this.tramiteStore.updateProveedorTablaDatos(proveedor);
  }

  /**
   * @method updateMercancia
   * @description
   * Actualiza la lista de mercancías en el store.
   * 
   * @param {Tramite240108State['merccancialTablaDatos']} mercancia Lista de mercancías.
   */
  updateMercancia(
    mercancia: Tramite240108State['merccancialTablaDatos']
  ): void {
    this.tramiteStore.updateMercanciaTablaDatos(mercancia);
  }

  /**
   * @method actualizarEstadoFormulario
   * @description
   * Actualiza completamente el estado del formulario en el store usando un objeto completo.
   * 
   * @param {Tramite240108State} DATOS Objeto con el estado completo del formulario.
   */
  actualizarEstadoFormulario(DATOS: Tramite240108State): void {
    this.tramiteStore.update((state) => ({
      ...state,
      ...DATOS
    }));
  }

  /**
   * @method getDatosDeLaSolicitudData
   * @description
   * Realiza una petición HTTP para obtener los datos de una solicitud simulada desde un archivo JSON.
   * 
   * @returns {Observable<Tramite240108State>} Observable con los datos del trámite simulados.
   */
  getDatosDeLaSolicitudData(): Observable<Tramite240108State> {
    return this.http.get<Tramite240108State>(
      'assets/json/240108/consulta-datos.json'
    );
  }
}
