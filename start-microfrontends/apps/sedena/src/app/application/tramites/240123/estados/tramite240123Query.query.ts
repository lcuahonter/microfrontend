import {
  Tramite240123State,
  Tramite240123Store,
} from './tramite240123Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio que permite consultar (leer) el estado del Trámite 240123
 * usando el patrón de Akita para manejo de estado.
 */

@Injectable({ providedIn: 'root' })
export class Tramite240123Query extends Query<Tramite240123State> {
  /**
   * Constructor que inicializa el query con el store correspondiente.
   *
   * @param {Tramite240123Store} store - Instancia del store para el Trámite 240123.
   */
  constructor(protected override store: Tramite240123Store) {
    super(store);
  }

  /**
   * Observable que emite el estado completo del trámite.
   *
   * @property {Observable<Tramite240123State>} selectTramiteState$
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
   * Observable que emite los datos de los destinatarios y proveedores que se deben modificar.
   * Retorna los datos del destinatario final o proveedor si alguno de ellos está siendo modificado.
   *
   * @property {Observable<DestinoFinal | Proveedor | null>} obtenerTercerosDatos$
   */
  public obtenerTercerosDatos$ = this.select((state) => {
    return state.modificarDestinarioDatos || state.modificarProveedorDatos || null;
  });
}
