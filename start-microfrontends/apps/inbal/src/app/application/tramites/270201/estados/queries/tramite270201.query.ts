/**
 * Importa las dependencias necesarias para crear un servicio de consulta de estado.
 */
import {
  Tramite270201State,
  Tramite270201Store,
} from '../tramites/tramite270201.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio que extiende la clase Query de Akita para consultar el estado del trámite 270201.
 * Este servicio proporciona observables para acceder a diferentes partes del estado del trámite.
 * 
 * @class Tramite270201Query
 * @extends {Query<Tramite270201State>}
 */
@Injectable({
  /**
   * Indica que este servicio debe ser proporcionado en el nivel raíz de la aplicación.
   */
  providedIn: 'root',
})
export class Tramite270201Query extends Query<Tramite270201State> {
  /**
   * Observable que selecciona la operación actual del estado del trámite.
   * 
   * @type {Observable<catalogoResponse | null>}
   */
  selectedOperacion$ = this.select((state) => state.tipoDeOperacion);

  /**
   * Observable que selecciona el movimiento actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar del movimiento.
   * 
   * @type {Observable<catalogoResponse | null>}
   */
  selectedMovimiento$ = this.select((state) => state.tipoDeMovimiento); // Corregido

  /**
   * Observable que selecciona el motivo actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar del motivo.
   * 
   * @type {Observable<catalogoResponse | null>}
   */
  selectedMotivo$ = this.select((state) => state.motivo); // Corregido

  /**
   * Observable que selecciona el país actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar del país.
   * 
   * @type {Observable<catalogoResponse | null>}
   */
  selectedPais$ = this.select((state) => state.pais); // Corregido

  /**
   * Observable que selecciona la ciudad actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar de la ciudad.
   * 
   * @type {Observable<string>}
   */
  selectedCiudad$ = this.select((state) => state.ciudad); // Corregido

  /**
   * Observable que selecciona el transporte actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar del transporte.
   * 
   * @type {Observable<catalogoResponse | null>}
   */
  selectedTransporte$ = this.select((state) => state.medioTransporte); // Corregido

  /**
   * Observable que selecciona la aduana actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar de la aduana.
   * 
   * @type {Observable<catalogoResponse | null>}
   */
  selectedAduana$ = this.select((state) => state.aduanaEntrada); // Corregido

  /**
   * Observable que selecciona el autor actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar del autor.
   * 
   * @type {Observable<string>}
   */
  selectedAutor$ = this.select((state) => state.autor); // Corregido

  /**
   * Observable que selecciona el título actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar del título.
   * 
   * @type {Observable<string>}
   */
  selectedTitulo$ = this.select((state) => state.titulo); // Corregido

  /**
   * Observable que selecciona la técnica actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar de la técnica.
   * 
   * @type {Observable<string>}
   */
  selectedTecnica$ = this.select((state) => state.tecnicaDeRealizacion); // Corregido

  /**
   * Observable que selecciona el alto actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar del alto.
   * 
   * @type {Observable<string>}
   */
  selectedAlto$ = this.select((state) => state.alto); // Corregido

  /**
   * Observable que selecciona el ancho actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar del ancho.
   * 
   * @type {Observable<string>}
   */
  selectedAncho$ = this.select((state) => state.ancho); // Corregido

  /**
   * Observable que selecciona la profundidad actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar de la profundidad.
   * 
   * @type {Observable<string>}
   */
  selectedProfundidad$ = this.select((state) => state.profundidad); // Corregido

  /**
   * Observable que selecciona el diámetro actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar del diámetro.
   * 
   * @type {Observable<string>}
   */
  selectedDiametro$ = this.select((state) => state.diametro); // Corregido

  /**
   * Observable que selecciona las variables adicionales actuales del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar de las variables.
   * 
   * @type {Observable<string>}
   */
  selectedVariables$ = this.select((state) => state.variables); // Corregido

  /**
   * Observable que selecciona el año de creación actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar del año de creación.
   * 
   * @type {Observable<string>}
   */
  selectedAnoDeCreacion$ = this.select((state) => state.anoDeCreacion); // Corregido

  /**
   * Observable que selecciona el avalúo actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar del avalúo.
   * 
   * @type {Observable<string>}
   */
  selectedAvaluo$ = this.select((state) => state.avaluo); // Corregido

  /**
   * Observable que selecciona la moneda actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar de la moneda.
   * 
   * @type {Observable<catalogoResponse | null>}
   */
  selectedMoneda$ = this.select((state) => state.moneda); // Corregido

  /**
   * Observable que selecciona el propietario actual del estado del trámite.
   * 
   * @type {Observable<string>}
   */
  selectedPropietario = this.select((state) => state.propietario);

  /**
   * Observable que selecciona la fracción arancelaria actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar de la fracción arancelaria.
   * 
   * @type {Observable<catalogoResponse | null>}
   */
  selectedFraccionArancelaria$ = this.select((state) => state.fraccionArancelaria); // Corregido

  /**
   * Observable que selecciona la descripción de la fracción arancelaria actual del estado del trámite.
   * **Nota:** Actualmente está configurado para seleccionar la operación en lugar de la descripción.
   * 
   * @type {Observable<string>}
   */
  selectedDescripcionArancelaria$ = this.select((state) => state.descripcionArancelaria); // Corregido

  /**
   * Observable que selecciona todos los datos de la solicitud del estado del trámite.
   * 
   * @type {Observable<Tramite270201State>}
   */
  selectDatosSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del servicio que inyecta la tienda del trámite 270201.
   * 
   * @param {Tramite270201Store} tramiteStore
   */
  constructor(private tramiteStore: Tramite270201Store) {
    super(tramiteStore);
  }
}
