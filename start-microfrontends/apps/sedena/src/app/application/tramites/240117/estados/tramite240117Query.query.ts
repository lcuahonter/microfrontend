import {
  Tramite240117State,
  Tramite240117Store,
} from './tramite240117Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio que permite consultar (leer) el estado del Trámite 240117
 * usando el patrón de Akita para manejo de estado.
 */

/**
 * @description Servicio de consulta (Query) para el Trámite 240117.
 * Proporciona observables para acceder al estado del trámite y sus diferentes secciones.
 *
 * @example
 * ```typescript
 * constructor(private tramite240117Query: Tramite240117Query) {}
 *
 * this.tramite240117Query.getTabSeleccionado$.subscribe(tab => {
 *   console.log('Pestaña seleccionada:', tab);
 * });
 * ```
 *
 * @class Tramite240117Query
 * @extends {Query<Tramite240117State>}
 * @see {@link Tramite240117Store}
 */
@Injectable({ providedIn: 'root' })
export class Tramite240117Query extends Query<Tramite240117State> {
  /**
   * Constructor que inicializa el query con el store correspondiente.
   *
   * @param {Tramite240117Store} store - Instancia del store para el Trámite 240117.
   */
  constructor(protected override store: Tramite240117Store) {
    super(store);
  }

  /**
   * Observable que emite el estado completo del trámite.
   *
   * @property {Observable<Tramite240117State>} selectTramiteState$
   */
  public selectTramiteState$ = this.select((state) => {
    return state;
  });

  /**
   * Observable que emite la pestaña actualmente seleccionada por el usuario.
   *
   * @property {Observable<string>} getTabSeleccionado$
   */
  public getTabSeleccionado$ = this.select((state) => state.tabSeleccionado);

  /**
   * Observable que emite el estado del formulario de datos del trámite.
   *
   * @property {Observable<DatosDelTramiteFormState>} getDatosDelTramite$
   */
  public getDatosDelTramite$ = this.select((state) => state.datosDelTramite);

  /**
   * Observable que emite el estado del formulario de pago de derechos.
   *
   * @property {Observable<PagoDerechosFormState>} getPagoDerechos$
   */
  public getPagoDerechos$ = this.select((state) => state.pagoDerechos);

  /**
   * Observable que emite los datos de la tabla de proveedores.
   *
   * @property {Observable<Proveedor[]>} getProveedorTablaDatos$
   */
  public getProveedorTablaDatos$ = this.select(
    (state) => state.proveedorTablaDatos
  );

  /**
   * Observable que emite los datos de la tabla de destinatarios finales.
   *
   * @property {Observable<DestinoFinal[]>} getDestinatarioFinalTablaDatos$
   */
  public getDestinatarioFinalTablaDatos$ = this.select(
    (state) => state.destinatarioFinalTablaDatos
  );

  /**
   * Observable que emite los datos de la tabla de mercancía.
   *
   * @property {Observable<MercanciaDetalle[]>} getMercanciaTablaDatos$
   */
  public getMercanciaTablaDatos$ = this.select(
    (state) => state.merccancialTablaDatos
  );

  /**
   * Observable que emite los datos de terceros relacionados.
   * Este observable combina los datos de destinatarios y proveedores.
   *
   * @property {Observable<DestinoFinal | Proveedor | null>} obtenerTercerosDatos$
   */
  public obtenerTercerosDatos$ = this.select((state) => {
    return state.modificarDestinarioDatos || state.modificarProveedorDatos || null;
  });
}
