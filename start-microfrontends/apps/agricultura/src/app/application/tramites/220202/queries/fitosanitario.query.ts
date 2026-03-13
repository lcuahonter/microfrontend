import { FitosanitarioStore } from '../estados/fitosanitario.store';
import { Injectable } from '@angular/core';
import { ListaDeDatosFinal } from '../models/220202/fitosanitario.model';
import { Query } from '@datorama/akita';

/**
 * @summary Servicio de consulta para el estado de fitosanitarios.
 *
 * @description
 * La clase `FitosanitarioQuery` extiende de `Query<ListaDeDatosFinal>`
 * y proporciona una interfaz para consultar el estado del almacenamiento
 * de datos fitosanitarios mediante Akita.
 *
 * @injectable
 */
@Injectable({ providedIn: 'root' })
export class FitosanitarioQuery extends Query<ListaDeDatosFinal> {
  /**
   * @summary Constructor del servicio.
   *
   * @param store Instancia del `FitosanitarioStore` utilizada para
   * inicializar la consulta.
   */
  constructor(protected override store: FitosanitarioStore) {
    super(store);
  }

  /**
   * Selector para obtener la lista de terceros relacionados.
   *
   * @readonly
   * @type {Observable<any>}
   * @memberof FitosanitarioQuery
   */
  seleccionarTercerosRelacionados$ = this.select(
    (estado) => estado.seletedTerceros
  );

  /**
   * Selector para obtener los datos de pago de derechos.
   *
   * @readonly
   * @type {Observable<any>}
   * @memberof FitosanitarioQuery
   */
  seleccionarPagoDerechos$ = this.select((estado) => estado.pago);

  /**
   * Selector para obtener los datos de movilización.
   *
   * @readonly
   * @type {Observable<any>}
   * @memberof FitosanitarioQuery
   */
  seleccionarState$ = this.select((estado) => estado);

  /**
   * Selector para obtener los datos de movilización nacional.
   *
   * @readonly
   * @type {Observable<any>}
   * @memberof FitosanitarioQuery
   */
  seleccionarMovilizacionNacional$ = this.select(
    (estado) => estado.movilizacion
  );

  /**
   * Se obtiene del estado global usando un selector que accede a la propiedad `tablaDatos`.
   * Generalmente se utiliza para mostrar o manipular la información de mercancías en componentes.
   * @type {Observable<any>}
   */
  seleccionarMarcancia$ = this.select((estado) => estado.tablaDatos);

  /**
   * Selector para obtener los datos seleccionados.
   *
   * @readonly
   * @type {Observable<FilaSolicitud[]>}
   * @memberof FitosanitarioQuery
   */
  seleccionarDatosSeleccionados$ = this.select(
    (estado) => estado.selectedDatos
  );


  /**
   * Observable que emite los datos relacionados con las normas desde el estado global.
   * Se obtiene utilizando un selector que accede a la propiedad `usoCrossListDatos`
   * asociada al uso cruzado de datos.
   * @type {Observable<string[]>}
   */
  public getNormaDatos$ = this.select((state) => state.usoCrossListDatos);


  seleccionarDestinatarios$ = this.select(estado => estado.seletedTerceros);

  /**
   * Selector para obtener el exportador seleccionado.
   * 
   * @readonly
   * @type {Observable<TercerosrelacionadosdestinoTable>}
   * @memberof FitosanitarioQuery
   */
  seleccionarExportador$ = this.select(estado => estado.seletedExdora);
  /**
   * Selector para obtener el formulario seleccionado.
   * 
   * @readonly
   * @type {Observable<DatosForma>}
   * @memberof FitosanitarioQuery
   */

  seleccionarDatosForma$ = this.select(estado => estado.datos);
}
