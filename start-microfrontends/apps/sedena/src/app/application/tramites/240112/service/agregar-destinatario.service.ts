import { Tramite240112State, Tramite240112Store } from '../estados/tramite240112Store.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar la obtención y actualización de datos relacionados con destinatarios
 * y otros elementos del trámite 240112.
 * 
 * @remarks
 * Este servicio consume datos desde un archivo JSON local y actualiza el estado centralizado
 * del trámite mediante el store `Tramite240112Store`.
 * 
 * @example
 * ```typescript
 * this.agregarDestinatarioService.getAcuiculturaData().subscribe(data => {
 *   console.log(data);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AgregarDestinatarioService {

  /**
   * Constructor que inyecta las dependencias necesarias para realizar peticiones HTTP
   * y manipular el estado global del trámite.
   * 
   * @param httpClient Servicio HttpClient para realizar peticiones HTTP.
   * @param store Instancia de Tramite240112Store para gestionar el estado del trámite.
   */
  constructor(
    private httpClient: HttpClient, 
    private store: Tramite240112Store
  ) { }

  /**
   * Obtiene los datos del formulario de certificados de origen desde un archivo JSON local.
   * 
   * @returns {Observable<Tramite240112State>} Observable que emite el estado completo del trámite.
   */
  public getAcuiculturaData(): Observable<Tramite240112State> {
    return this.httpClient.get<Tramite240112State>('assets/json/240112/forma.json');
  }

  /**
   * Actualiza el estado completo del formulario en el store del trámite 240112.
   * Cada campo del objeto recibido es asignado al store correspondiente para mantener sincronizado el estado.
   * 
   * @param DATOS Objeto de tipo Tramite240112State con los datos a actualizar en el store.
   */
  public actualizarEstadoFormulario(DATOS: Tramite240112State): void {
    this.store.updateTabSeleccionado(DATOS.tabSeleccionado ?? 0);
    this.store.updateDatosDelTramiteFormState(DATOS.datosDelTramite);
    this.store.updatePagoDerechosFormState(DATOS.pagoDerechos);
    this.store.updateDestinatarioFinalTablaDatos(DATOS.destinatarioFinalTablaDatos);
    this.store.updateProveedorTablaDatos(DATOS.proveedorTablaDatos);
    this.store.updateMercanciaTablaDatos(DATOS.merccancialTablaDatos);
  }
}
