/**
 * Componente para la baja de unidades de arrastre en el trámite 40103.
 *
 * Permite seleccionar, eliminar y gestionar unidades de arrastre.
 *
 * @module BajaUnidadComponent
 */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';

import { Catalogo, ConsultaioQuery, ConsultaioState, TablaSeleccion } from '@ng-mf/data-access-user';
import { CatalogoLista, DatosUnidad } from '../../../../models/registro-muestras-mercancias.model';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';

import { Tramite40103Query } from '../../../../estados/tramite40103.query';
import { Tramite40103Store } from '../../../../estados/tramite40103.store';
import { modificarTerrestreService } from '../../../services/modificacar-terrestre.service';
import { obtenerColumnasUnidad } from '../../../../enum/unidad-de-arrastre.enum';

@Component({
  selector: 'app-baja-unidad',
  templateUrl: './baja-unidad.component.html',
  styleUrls: ['./baja-unidad.component.scss']
})
/**
 * Componente para gestionar la baja de unidades de arrastre.
 *
 * @class
 */
export class BajaUnidadComponent implements OnInit, OnDestroy {
  /**
   * Catálogo de tipos de unidad de arrastre.
   * @type {Catalogo[]}
   */
  tipoDeUnidadCatalogo: Catalogo[] = [];
  /**
   * Catálogo de países emisores.
   * @type {Catalogo[]}
   */
  paisEmisorCatalogo: Catalogo[] = [];
  /**
   * Catálogo de años.
   * @type {Catalogo[]}
   */
  anoCatalogo: Catalogo[] = [];

  /**
   * Catálogo de tipos de arrastre.
   * @type {Catalogo[]}
   */
  tipoArrastre: Catalogo[] = [];
  /**
   * Lista de unidades de arrastre.
   * @type {UnidadTabla[]}
   */ unidadesArrastre: DatosUnidad[] = [];
  /**
   * Getter que convierte UnidadTabla[] a DatosUnidad[] para el componente de diálogo.
   * @returns {DatosUnidad[]}
   */
  get unidadesArrastreDatos(): DatosUnidad[] {
    return this.unidadesArrastre.map(unidad => ({ 
      ...unidad,
      colorVehiculo: '',
      numero2daPlaca: '',
      estado2daPlaca: '',
      paisEmisor2daPlaca: '',
      descripcion: ''
    }));
  }
  /**
   * Configuración de columnas para la tabla de unidades.
   * Utiliza la configuración centralizada del enum.
   * @type {ConfiguracionColumna<UnidadTabla>[]}
   */
  get columnasUnidad(): ConfiguracionColumna<DatosUnidad>[] {
    return obtenerColumnasUnidad(this.tipoDeUnidadCatalogo, this.paisEmisorCatalogo);
  }
  /**
   * Tipo de selección de la tabla (radio, checkbox, etc).
   * @type {TablaSeleccion}
   */
  tipoSeleccionTabla = TablaSeleccion.RADIO;
  /**
   * Unidades de arrastre seleccionadas en la tabla.
   * @type {UnidadTabla[]}
   */
  unidadesArrastreSelected: DatosUnidad[] = [];
  /**
   * Indica si la vista es de solo lectura.
   * @type {boolean}
   */
  esSoloLectura: boolean = false;

  /**
   * @property {Subject<void>}
   * Sujeto para destruir las suscripciones.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {ConsultaioState}
   * Almacena el estado de consulta actual.
   */
  datosConsulta!: ConsultaioState;

  /**
   * Indica si se muestra el diálogo de unidad.
   * @type {boolean}
   */
  mostrarDialogoUnidad = false;

  /**
   * Datos para el diálogo de unidad.
   * @type {DatosUnidad | null}
   */
  datosDialogoUnidad: DatosUnidad | null = null;
  /**
   * Constructor del componente `BajaUnidadComponent`.
   *
   * @constructor
   * @param {ConsultaioQuery} consultaioQuery - Servicio para consultar el estado de consulta y determinar el modo de solo lectura.
   * @param {modificarTerrestreService} modificarTerrestreService - Servicio para obtener catálogos.
   */
  constructor(
    private consultaioQuery: ConsultaioQuery,
    private modificarTerrestreService: modificarTerrestreService,
    private cdr: ChangeDetectorRef,
    private tramiteQuery: Tramite40103Query,
    private store: Tramite40103Store
  ) { }
  /**
   * Método de ciclo de vida de Angular que se llama cuando el componente se inicializa.
   */
  ngOnInit(): void {
    this.tramiteQuery.select(state => state.unidades_arrastre_retirada)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(data => {
        this.unidadesArrastre = data || [];
        this.cdr.detectChanges();
      });

    this.modificarTerrestreService.obtenerTipoArrastre()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.tipoDeUnidadCatalogo = datos.datos as Catalogo[];
      });

    this.modificarTerrestreService.obtenerPaisEmisor()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.paisEmisorCatalogo = datos.datos as Catalogo[];
      });

    this.modificarTerrestreService.obtenerAno()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.anoCatalogo = datos.datos as Catalogo[];
      });
    /**
     * Suscribe al estado de consulta para determinar si el formulario debe estar en modo solo lectura.
     * Si el estado indica `readonly`, actualiza las propiedades `datosConsulta` e `esSoloLectura` del componente.
     *
     * @observable selectConsultaioState$
     * @effect Actualiza el modo de solo lectura del formulario según el estado de consulta.
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          if (seccionState.readonly) {
            this.datosConsulta = seccionState;
            this.esSoloLectura = this.datosConsulta.readonly;
          }
        })
      ).subscribe();
  }
  /**
   * Método de ciclo de vida de Angular que se llama cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
  /**
   * Maneja la selección de filas en la tabla de unidades de arrastre.
   * @param {UnidadTabla[]} event - Unidades seleccionadas.
   * @returns {void}
   */
  onUnidadRowSelected(event: DatosUnidad[]): void {
    this.unidadesArrastreSelected = event || [];
  }
  /**
   * Elimina las unidades seleccionadas del listado.
   * @returns {void}
   */
  eliminarUnidad(): void {
    if (this.unidadesArrastreSelected.length === 0) {
      return;
    }
    
    const UNIDAS = this.unidadesArrastre.filter(u => !this.unidadesArrastreSelected.includes(u));
    this.store.setUnidadesArrastreRetirada(UNIDAS);
    
    this.unidadesArrastreSelected = [];
  }
  /**
   * Agrega una unidad actualizada desde el diálogo y la selecciona.
   * @param {DatosUnidad} updatedUnidad - Unidad actualizada.
   * @returns {void}
   */
  alGuardarDialogoUnidad(updatedUnidad: DatosUnidad): void {
    const UNIDAS = [...this.unidadesArrastre, updatedUnidad];
    this.store.setUnidadesArrastreRetirada(UNIDAS);
    this.mostrarDialogoUnidad = false;
    this.cdr.detectChanges();
  }
  /**
   * Elimina la fila de unidad seleccionada.
   * @returns {void}
   */
  eliminarUnidadRow(): void {
    this.eliminarUnidad();
  }

  /**
   * Abre el modal para agregar datos de unidades de arrastre mediante búsqueda.
   * Inicializa el diálogo para permitir al usuario buscar y agregar unidades al listado.
   * 
   * @returns {void}
   */
  agregarModal(): void {
    this.datosDialogoUnidad = null;
    this.mostrarDialogoUnidad = true;
  }
}