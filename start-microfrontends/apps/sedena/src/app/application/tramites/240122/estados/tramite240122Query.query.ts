import {
    Tramite240122State,
    Tramite240122Store,
} from './tramite240122Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio que permite consultar (leer) el estado del Trámite 240122
 * usando el patrón de Akita para manejo de estado.
 */

/**
 * @description Servicio de consulta (Query) para el Trámite 240122.
 * Proporciona observables para acceder al estado del trámite y sus diferentes secciones.
 *
 * @example
 * ```typescript
 * constructor(private tramite240122Query: Tramite240122Query) {}
 *
 * this.tramite240122Query.getTabSeleccionado$.subscribe(tab => {
 *   console.log('Pestaña seleccionada:', tab);
 * });
 * ```
 *
 * @class Tramite240122Query
 * @extends {Query<Tramite240122State>}
 * @see {@link Tramite240122Store}
 */
@Injectable({ providedIn: 'root' })
export class Tramite240122Query extends Query<Tramite240122State> {
    /**
     * Constructor que inicializa el query con el store correspondiente.
     *
     * @param {Tramite240122Store} store - Instancia del store para el Trámite 240122.
     */
    constructor(protected override store: Tramite240122Store) {
        super(store);
    }

    /**
     * Observable que emite el estado completo del trámite.
     *
     * @property {Observable<Tramite240122State>} selectTramiteState$
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
     * Observable que emite los datos de terceros relacionados (destinatarios o proveedores).
     *
     * @property {Observable<DestinoFinal | Proveedor | null>} obtenerTercerosDatos$
     * @remarks Este observable combina los datos de destinatarios y proveedores para su uso en la vista.
     */
    public obtenerTercerosDatos$ = this.select((state) => {
        return state.modificarDestinarioDatos || state.modificarProveedorDatos || null;
    });
}
