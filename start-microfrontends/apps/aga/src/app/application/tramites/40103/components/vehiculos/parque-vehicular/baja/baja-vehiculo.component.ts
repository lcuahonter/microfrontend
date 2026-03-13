/**
 * Componente para la baja de vehículos en el trámite 40103.
 *
 * Permite seleccionar, eliminar y gestionar vehículos del parque vehicular.
 *
 * @module BajaVehiculoComponent
 */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';

import { Catalogo, ConsultaioQuery, ConsultaioState, TablaSeleccion } from '@ng-mf/data-access-user';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';

import { CatalogoLista, DatosVehiculo } from '../../../../models/registro-muestras-mercancias.model';
import { Tramite40103Query } from '../../../../estados/tramite40103.query';
import { Tramite40103Store } from '../../../../estados/tramite40103.store';
import { modificarTerrestreService } from '../../../services/modificacar-terrestre.service';
import { obtenerColumnasVehiculo } from '../../../../enum/parque-vehicular.enum';

@Component({
  selector: 'app-baja-vehiculo',
  templateUrl: './baja-vehiculo.component.html',
  styleUrls: ['./baja-vehiculo.component.scss']
})
/**
 * Componente para gestionar la baja de vehículos.
 *
 * @class
 */
export class BajaVehiculoComponent implements OnInit, OnDestroy {
  /**
   * Catálogo de tipos de vehículo.
   * @type {Catalogo[]}
   */
  tipoDeVehiculoCatalogo: Catalogo[] = [];

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
   * Catálogo de colores de vehículos.
   * @type {Catalogo[]}
   */
  colorVehiculoCatalogo: Catalogo[] = [];
  /**
   * Lista de vehículos en el parque vehicular.
   * @type {VehiculoTabla[]}
   */
  vehiculosParque: DatosVehiculo[] = [];
  /**
   * Configuración de columnas para la tabla de vehículos.
   * Utiliza la configuración centralizada del enum.
   * @type {ConfiguracionColumna<VehiculoTabla>[]}
   */  
  columnasVehiculo: ConfiguracionColumna<DatosVehiculo>[] = [];
  /**
   * Tipo de selección de la tabla (radio, checkbox, etc).
   * @type {TablaSeleccion}
   */
  tipoSeleccionTabla = TablaSeleccion.RADIO;
  /**
   * Vehículos seleccionados en la tabla.
   * @type {VehiculoTabla[]}
   */
  vehiculosParqueSelected: DatosVehiculo[] = [];
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
   * Indica si se muestra el diálogo de vehículo.
   * @type {boolean}
   */
  showVehiculoDialog = false;

  /**
   * Datos para el diálogo de vehículo.
   * @type {DatosVehiculo | null}
   */
  vehiculoDialogData: DatosVehiculo | null = null;
  /**
   * Constructor del componente `BajaVehiculoComponent`.
   *
   * @constructor
   * @param {ConsultaioQuery} consultaioQuery - Servicio para consultar el estado de consulta y determinar el modo de solo lectura.
   * @param {modificarTerrestreService} modificarTerrestreService - Servicio para obtener catálogos.
   * @param {ChangeDetectorRef} cdr - Servicio para detectar cambios en la vista.
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
    this.tramiteQuery.select(state => state.parque_vehicular_retirada)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(data => {
        this.vehiculosParque = data || [];
        this.cdr.detectChanges();
      });

    this.modificarTerrestreService.obtenerTipoDeVehiculo()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.tipoDeVehiculoCatalogo = datos.datos;
        this.actualizarColumnasVehiculo();
      });

    this.modificarTerrestreService.obtenerPaisEmisor()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.paisEmisorCatalogo = datos.datos;
        this.actualizarColumnasVehiculo();
      });

    this.modificarTerrestreService.obtenerAno()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.anoCatalogo = datos.datos;
        this.actualizarColumnasVehiculo();
      });

    this.modificarTerrestreService.obtenerColorVehiculo()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.colorVehiculoCatalogo = datos.datos as Catalogo[];
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
   * Actualiza la configuración de columnas para la tabla de vehículos.
   * Se ejecuta cuando se cargan los catálogos necesarios.
   * @returns {void}
   */
  private actualizarColumnasVehiculo(): void {
    if (this.tipoDeVehiculoCatalogo.length > 0 && this.paisEmisorCatalogo.length > 0 && this.anoCatalogo.length > 0) {
      this.columnasVehiculo = obtenerColumnasVehiculo(this.tipoDeVehiculoCatalogo, this.paisEmisorCatalogo, this.anoCatalogo);
      this.cdr.detectChanges();
    }
  }
  /**
   * Maneja la selección de filas en la tabla de vehículos.
   * @param {VehiculoTabla[]} event - Vehículos seleccionados.
   * @returns {void}
   */
  onVehiculoRowSelected(event: DatosVehiculo[]): void {
    this.vehiculosParqueSelected = event || [];
  }
  /**
   * Elimina los vehículos seleccionados del parque vehicular.
   * @returns {void}
   */
  eliminarVehiculo(): void {
    if (this.vehiculosParqueSelected.length === 0) {
      return;
    }
    
    const VEHICULOS = this.vehiculosParque.filter(v => !this.vehiculosParqueSelected.includes(v));
    this.store.setParqueVehicularRetirada(VEHICULOS);
    
    this.vehiculosParqueSelected = [];
  }
  /**
   * Agrega un vehículo actualizado desde el diálogo y lo selecciona.
   * @param {DatosVehiculo} updatedVehiculo - Vehículo actualizado.
   * @returns {void}
   */
  onVehiculoDialogSave(updatedVehiculo: DatosVehiculo): void {
    const VEHICULOS = [...this.vehiculosParque, updatedVehiculo];
    this.store.setParqueVehicularRetirada(VEHICULOS);
    this.showVehiculoDialog = false;
    this.cdr.detectChanges();
  }
  /**
   * Elimina la fila de vehículo seleccionada.
   * @returns {void}
   */
  deleteVehiculoRow(): void {
    this.eliminarVehiculo();
  }

  /**
   * Abre el modal para agregar datos de vehículos mediante búsqueda.
   * Inicializa el diálogo para permitir al usuario buscar y agregar vehículos al parque vehicular.
   * 
   * @returns {void}
   */
  agregarModal(): void {
    this.vehiculoDialogData = null;
    this.showVehiculoDialog = true;
  }
}