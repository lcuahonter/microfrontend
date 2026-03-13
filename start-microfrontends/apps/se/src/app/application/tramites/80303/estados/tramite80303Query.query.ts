import {
  Tramite80303State,
  Tramite80303Store,
} from './tramite80303Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio que permite consultar (leer) el estado del Trámite 80303
 * usando el patrón de Akita para manejo de estado.
 */

@Injectable({ providedIn: 'root' })
export class Tramite80303Query extends Query<Tramite80303State> {
  /**
   * Constructor que inicializa el query con el store correspondiente.
   *
   * @param {Tramite80303Store} store - Instancia del store para el Trámite 80303.
   */
  constructor(protected override store: Tramite80303Store) {
    super(store);
  }

  /**
   * Observable que emite el estado completo del trámite.
   *
   * @property {Observable<Tramite80303State>} selectTramiteState$
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
   * Observable que emite la pestaña actualmente seleccionada por el usuario.
   *
   * @property {Observable<string>} getSubTabSeleccionado$
   */
    public getSubTabSeleccionado$ = this.select((state) => state.subTabSeleccionado);
    
   /**
    * Selector para obtener el estado completo de la solicitud del trámite 80303.
    * @returns {Tramite80303State} El estado completo de la solicitud.
    */
   selectSolicitud$ = this.select((state) => {
     return state;
   });
  
  /**
   * Observable que emite el ID de la solicitud actual.
   */
  selectIdSolicitud$ = this.select((state) => state.idSolicitud);

  /**
   * Observable que emite los datos de la tabla de empresas submanufactureras.
   */
  selectSubmanufacturerasTablaDatos$ = this.select(
    (state) => state.empresasSubmanufacturerasTablaDatos
  );

  /**
   * Observable que emite los datos de la tabla de exportación del anexo.
   */
  selectAnexoExportacionTablaDatos$ = this.select(
    (state) => state.anexoExportacionTablaDatos
  );

  /**
   * Observable que emite los datos de la tabla de importación del anexo.
   */
  selectAnexoImportacionTablaDatos$ = this.select(
    (state) => state.anexoImportacionTablaDatos
  );

  /**
   * Observable que emite los datos de la tabla de fracciones sensibles.
   */
  selectSensiblesTablaDatos$ = this.select(
    (state) => state.sensiblesTablaDatos
  );

  /**
   * Observable que emite los datos de modificación.
   */
  selectDatosModificacion$ = this.select((state) => state.datosModificacion);
}