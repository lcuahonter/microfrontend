import {
  Tramite240120State,
  Tramite240120Store,
} from './tramite240120Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio que permite consultar (leer) el estado del Trámite 240120
 * usando el patrón de Akita para manejo de estado.
 *
 * Proporciona observables para acceder a diferentes partes del estado,
 * como los datos del trámite, pestañas seleccionadas, tablas de proveedores,
 * destinatarios finales, mercancía y datos modificados de destinatarios y proveedores.
 *
 * @export
 * @class Tramite240120Query
 * @extends {Query<Tramite240120State>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite240120Query extends Query<Tramite240120State> {
  /**
   * Constructor que inicializa el query con el store correspondiente.
   *
   * @param {Tramite240120Store} store - Instancia del store para el Trámite 240120.
   */
  constructor(protected override store: Tramite240120Store) {
    super(store);
  }

  /**
   * Observable que emite el estado completo del trámite.
   *
   * @type {Observable<Tramite240120State>}
   */
  public selectTramiteState$ = this.select((state) => {
    return state;
  });

  /**
   * Observable que emite la pestaña actualmente seleccionada por el usuario.
   *
   * @type {Observable<string>}
   */
  public getTabSeleccionado$ = this.select((state) => state.tabSeleccionado);

  /**
   * Observable que emite el estado del formulario de datos del trámite.
   *
   * @type {Observable<DatosDelTramiteFormState>}
   */
  public getDatosDelTramite$ = this.select((state) => state.datosDelTramite);

  /**
   * Observable que emite el estado del formulario de pago de derechos.
   *
   * @type {Observable<PagoDerechosFormState>}
   */
  public getPagoDerechos$ = this.select((state) => state.pagoDerechos);

  /**
   * Observable que emite los datos de la tabla de proveedores.
   *
   * @type {Observable<Proveedor[]>}
   */
  public getProveedorTablaDatos$ = this.select(
    (state) => state.proveedorTablaDatos
  );

  /**
   * Observable que emite los datos de la tabla de destinatarios finales.
   *
   * @type {Observable<DestinoFinal[]>}
   */
  public getDestinatarioFinalTablaDatos$ = this.select(
    (state) => state.destinatarioFinalTablaDatos
  );

  /**
   * Observable que emite los datos de la tabla de mercancía.
   *
   * @type {Observable<MercanciaDetalle[]>}
   */
  public getMercanciaTablaDatos$ = this.select(
    (state) => state.merccancialTablaDatos
  );

  /**
   * Observable que emite los datos modificados del destinatario final.
   *
   * @type {Observable<DestinoFinal>}
   * @compodoc getmodificarDestinarioDatos$
   * @returns Observable con los datos modificados del destinatario.
   */
  public getmodificarDestinarioDatos$ = this.select(
    (state) => state.modificarDestinarioDatos
  );

  /**
   * Observable que emite los datos modificados del proveedor.
   *
   * @type {Observable<Proveedor>}
   * @compodoc getmodificarProveedorDatos$
   * @returns Observable con los datos modificados del proveedor.
   */
  public getmodificarProveedorDatos$ = this.select(
    (state) => state.modificarProveedorDatos
  );

   /**
   * @description
   * Selector que obtiene los datos de la tabla de mercancías modificadas desde el estado.
   *
   * @returns Observable con los datos de las mercancías modificadas.
   *
   */
  public getmodificarMercanciaTablaDatos$ = this.select((state) => {
    return state.modificarMercanciasDatos;
  });
}
