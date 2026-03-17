import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { Tramite240111State } from '../estados/tramite240111Store.store';
import { Tramite240111Store } from '../estados/tramite240111Store.store';

@Injectable({
  providedIn: 'root',
})
export class ConsultaDatosService {
  /**
   * Constructor for the service that handles data queries.
   *
   * @param http - The Angular HttpClient used for making HTTP requests.
   * @param tramiteStore - Store for managing the state of Tramite240111.
   * @param seccionStore - Store for managing the state of SeccionLib.
   *
   * This constructor initializes the service with the necessary dependencies.
   * Additional logic can be added here if required.
   */
  constructor(
    private http: HttpClient,
    private readonly tramiteStore: Tramite240111Store,
    private readonly seccionStore: SeccionLibStore
  ) {
    // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * @description Actualiza los datos de la datosDel en el store.
   * @param datosDel Datos de la datosDel.
   */
  updateDatosDel(datosDel: Tramite240111State['datosDelTramite']): void {
    this.tramiteStore.updateDatosDelTramiteFormState(datosDel);
  }

  /**
   * @description Actualiza los datos generales pagoDerchos en el store.
   * @param pagoDerchos Datos generales pagoDerchos.
   */
  updatePagoDerechos(pagoDerchos: Tramite240111State['pagoDerechos']): void {
    this.tramiteStore.updatePagoDerechosFormState(pagoDerchos);
  }
  /**
   * @description Actualiza los datos generales destinatario en el store.
   * @param destinatario Datos generales destinatario.
   */
  updateDestinatario(
    destinatario: Tramite240111State['destinatarioFinalTablaDatos']
  ): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(destinatario);
  }
  /**
   * @description Actualiza los datos generales internos en el store.
   * @param proveedor Datos generales internos.
   */
  updateProveedor(proveedor: Tramite240111State['proveedorTablaDatos']): void {
    this.tramiteStore.updateProveedorTablaDatos(proveedor);
  }
  /**
   * @description Actualiza los datos generales internos en el store.
   * @param mercancia Datos generales internos.
   */
  updateMercancia(
    mercancia: Tramite240111State['merccancialTablaDatos']
  ): void {
    this.tramiteStore.updateMercanciaTablaDatos(mercancia);
  }

  /**
   * @description Actualiza el estado completo del formulario en el store.
   * @param {Tramite240111State} DATOS - Objeto con todos los datos del formulario.
   */
  actualizarEstadoFormulario(DATOS: Tramite240111State): void {
       this.tramiteStore.update((state) => ({
      ...state,
      ...DATOS
    }))
  }

  /**
   * Obtiene los datos de la solicitud desde un archivo JSON.
   * @returns Observable con los datos de la solicitud.
   */
  getDatosDeLaSolicitudData(): Observable<Tramite240111State> {
    return this.http.get<Tramite240111State>(
      'assets/json/240111/consulta-datos.json'
    );
  }
}
