import { Tramite260212State, Tramite260212Store } from '../estados/tramite260212.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio injectable en la raíz de la aplicación que extiende la clase `Query` 
 * para gestionar el estado de la solicitud `Tramite260212State`.
 * 
 * Este servicio proporciona métodos para seleccionar y acceder a diferentes 
 * partes del estado de la solicitud, como datos de tablas relacionadas con 
 * fabricantes, destinatarios finales, proveedores y facturadores.
 * 
 * @example
 * ```typescript
 * constructor(private tramiteQuery: Tramite260212Query) {
 *   tramiteQuery.getFabricanteTablaDatos$.subscribe((datos) => {
 *     console.log(datos);
 *   });
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class Tramite260212Query extends Query<Tramite260212State> {
  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: Tramite260212Store) {
    super(store);
  }
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectTramiteState$ = this.select((state) => {
    return state;
  });


  /**
   * Obtiene un observable que selecciona los datos de la tabla de fabricantes desde el estado de la aplicación.
   * 
   * Este método utiliza la función `select` para acceder a la propiedad `fabricanteTablaDatos` del estado.
   * Es útil para suscribirse a los cambios en los datos de la tabla de fabricantes y reaccionar a ellos en tiempo real.
   * 
   * @returns Un observable que emite los datos de la tabla de fabricantes desde el estado de la aplicación.
   */
  public getFabricanteTablaDatos$ = this.select(
    (state) => state.fabricanteTablaDatos
  );

  /**
   * @component
   * Método para obtener un observable que selecciona los datos de la tabla 
   * relacionados con el destinatario final desde el estado de la aplicación.
   * 
   * Este método utiliza la función `select` para acceder a la propiedad 
   * `destinatarioFinalTablaDatos` del estado, permitiendo que otros 
   * componentes o servicios puedan suscribirse a los cambios en esta 
   * información.
   * 
   * @returns Observable que emite los datos de la tabla del destinatario final.
   */
  public getDestinatarioFinalTablaDatos$ = this.select(
    (state) => state.destinatarioFinalTablaDatos
  );

  /**
   * Método para obtener un observable que selecciona los datos de la tabla 
   * relacionados con el proveedor desde el estado de la aplicación.
   * 
   * Este método utiliza la función `select` para acceder a la propiedad 
   * `proveedorTablaDatos` del estado, permitiendo que otros componentes o 
   * servicios puedan suscribirse a los cambios en esta información.
   * 
   * @returns Observable que emite los datos de la tabla del proveedor.
   */
  public getProveedorTablaDatos$ = this.select(
    (state) => state.proveedorTablaDatos
  );

  /**
   * Método para obtener un observable que selecciona los datos de la tabla 
   * relacionados con el facturador desde el estado de la aplicación.
   * 
   * Este método utiliza la función `select` para acceder a la propiedad 
   * `facturadorTablaDatos` del estado, permitiendo que otros componentes o 
   * servicios puedan suscribirse a los cambios en esta información.
   * 
   * @returns Observable que emite los datos de la tabla del facturador.
   */
  public getFacturadorTablaDatos$ = this.select(
    (state) => state.facturadorTablaDatos
  );
}
