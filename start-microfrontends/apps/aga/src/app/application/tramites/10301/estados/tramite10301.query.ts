import { Solicitud10301State, Tramite10301Store } from './tramite10301.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta (Query) para el estado del trámite 10301.
 * Permite acceder de forma reactiva a los datos almacenados en el `Tramite10301Store`.
 */
@Injectable({ providedIn: 'root' })
export class Tramite10301Query extends Query<Solicitud10301State> {
  /**
   * Constructor que inyecta el store y lo pasa a la clase base Query.
   * @param store Instancia del store donde se mantiene el estado del formulario.
   */
  constructor(protected override store: Tramite10301Store) {
    super(store);
  }

  /**
   * Selecciona el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Selecciona el valor del manifiesto.
   */
  selectManifesto$ = this.select((state) => state.manifesto);

  /**
   * Selecciona la lista de aduanas disponibles.
   */
  selectAduana$ = this.select((state) => state.aduana);

  /**
   * Selecciona el catálogo de años.
   */
  selectAno$ = this.select((state) => state.ano);

  /**
   * Selecciona el catálogo de condiciones de la mercancía.
   */
  selectCondicion$ = this.select((state) => state.condicion);

  /**
   * Selecciona el catálogo de países.
   */
  selectPais$ = this.select((state) => state.pais);

  /**
   * Selecciona el catálogo de tipos de documentos.
   */
  selectTipoDocumento$ = this.select((state) => state.tipoDocumento);

  /**
   * Selecciona las fechas disponibles para selección.
   */
  selectFechasSeleccionadas$ = this.select((state) => state.fechasSeleccionadas);

  /**
   * Selecciona los fines elegidos por el usuario.
   */
  selectFinesElegidos$ = this.select((state) => state.finesElegidos);

  /**
   * Selecciona el rango de días seleccionado.
   */
  selectSelectRangoDias$ = this.select((state) => state.selectRangoDias);

  /**
   * Selecciona las fechas utilizadas o mostradas en pantalla.
   */
  selectFechasDatos$ = this.select((state) => state.fechasDatos);

  /**
   * Selecciona la fecha actual o predeterminada.
   */
  selectFecha$ = this.select((state) => state.fecha);

  /**
   * Selecciona la fecha seleccionada por el usuario.
   */
  selectFechaSeleccionada$ = this.select((state) => state.fechaSeleccionada);

  /**
   * Selecciona el valor actualmente seleccionado en un control dinámico.
   */
  selectValorSeleccionado$ = this.select((state) => state.valorSeleccionado);

  /**
   * Selecciona los documentos cargados o disponibles en la solicitud.
   */
  selectDocumento$ = this.select((state) => state.documentos);
}
