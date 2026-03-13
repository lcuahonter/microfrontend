/**
 * Componente para la modificación de vehículos en el trámite 40103.
 *
 * Permite agregar, modificar y eliminar vehículos del parque vehicular.
 *
 * @module ModificacionVehiculoComponent
 */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite40103Query } from '../../../../estados/tramite40103.query';
import { Tramite40103Store } from '../../../../estados/tramite40103.store';

import { Catalogo, ConsultaioQuery, ConsultaioState, TablaSeleccion } from '@ng-mf/data-access-user';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';

import { CatalogoLista, DatosVehiculo } from '../../../../models/registro-muestras-mercancias.model';
import { modificarTerrestreService } from '../../../services/modificacar-terrestre.service';
import { obtenerColumnasVehiculo } from '../../../../enum/parque-vehicular.enum';

@Component({
  selector: 'app-modificacion-vehiculo',
  templateUrl: './modificacion-vehiculo.component.html',
  styleUrls: ['./modificacion-vehiculo.component.scss']
})
/**
 * Componente para gestionar la modificación de vehículos.
 *
 * @class
 */
export class ModificacionVehiculoComponent implements OnInit, OnDestroy {
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
   * Indica si se muestra la alerta informativa.
   * @type {boolean}
   */
  showInfoAlert = true;

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
   * Índice del vehículo seleccionado en la tabla.
   * @type {number | null}
   */
  selectedVehiculoIndex: number | null = null;
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
  /*
   * Constructor del componente `ModificacionVehiculoComponent`.
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
    this.tramiteQuery.select(state => state.parque_vehicular_modification)
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
   * @param {VehiculoTabla[]} event - Evento de selección de la tabla.
   * @returns {void}
   */
  onVehiculoRowSelected(event: DatosVehiculo[]): void {
    if (event && event.length > 0) {
      const VEHICULO_SELECCIONADO = event[0];
      this.selectedVehiculoIndex = this.vehiculosParque.findIndex(v => 
        (VEHICULO_SELECCIONADO.numero && v.numero === VEHICULO_SELECCIONADO.numero) ||
        (VEHICULO_SELECCIONADO.idDeVehiculo && v.idDeVehiculo === VEHICULO_SELECCIONADO.idDeVehiculo) ||
        (VEHICULO_SELECCIONADO.numeroPlaca && v.numeroPlaca === VEHICULO_SELECCIONADO.numeroPlaca && 
         VEHICULO_SELECCIONADO.marca && v.marca === VEHICULO_SELECCIONADO.marca)
      );
      
      if (this.selectedVehiculoIndex === -1) {
        this.selectedVehiculoIndex = this.vehiculosParque.indexOf(VEHICULO_SELECCIONADO);
      }
    } else {
      this.selectedVehiculoIndex = null;
    }
  }
  /**
   * Agrega un vehículo actualizado desde el diálogo y lo selecciona.
   * @param {DatosVehiculo} updatedVehiculo - Vehículo actualizado.
   * @returns {void}
   */
  onVehiculoDialogSave(updatedVehiculo: DatosVehiculo): void {

    const VEHICULOS = [...this.vehiculosParque];
    if (this.selectedVehiculoIndex !== null && this.selectedVehiculoIndex > -1) {
      VEHICULOS[this.selectedVehiculoIndex] = updatedVehiculo;
    } else {
      VEHICULOS.push(updatedVehiculo);
    }
    this.store.setParqueVehicularModification(VEHICULOS);
    this.showVehiculoDialog = false;
    this.selectedVehiculoIndex = null;
    this.cdr.detectChanges();
  }
  /**
   * Elimina la fila de vehículo seleccionada.
   * @returns {void}
   */
  deleteVehiculoRow(): void {
    if (this.selectedVehiculoIndex !== null && this.selectedVehiculoIndex >= 0) {
      const VEHICULOS = this.vehiculosParque.filter((_, index) => index !== this.selectedVehiculoIndex);
      this.store.setParqueVehicularModification(VEHICULOS);
      this.selectedVehiculoIndex = null;
    }
  }
  /**
   * Abre el modal para agregar datos de vehículos mediante búsqueda.
   * Inicializa el diálogo para permitir al usuario buscar y agregar vehículos al parque vehicular.
   * 
   * @returns {void}
   */
  agregarModal(): void {
    if (this.selectedVehiculoIndex !== null) {
      this.vehiculoDialogData = this.vehiculosParque[this.selectedVehiculoIndex];
    } else {
      this.vehiculoDialogData = null;
    }
    this.showVehiculoDialog = true;
  }
}