/**
 * Componente para la modificación de unidades de arrastre en el trámite 40103.
 *
 * Permite agregar, modificar y eliminar unidades de arrastre.
 *
 * @module ModificacionUnidadComponent
 */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';

import { Catalogo, ConsultaioQuery, ConsultaioState, TablaSeleccion } from '@ng-mf/data-access-user';

import { Tramite40103Query } from '../../../../estados/tramite40103.query';
import { Tramite40103Store } from '../../../../estados/tramite40103.store';

import { obtenerColumnasUnidad } from '../../../../enum/unidad-de-arrastre.enum';

import { CatalogoLista,DatosUnidad } from '../../../../models/registro-muestras-mercancias.model';

import { modificarTerrestreService } from '../../../services/modificacar-terrestre.service';


@Component({
  selector: 'app-modificacion-unidad',
  templateUrl: './modificacion-unidad.component.html',
  styleUrls: ['./modificacion-unidad.component.scss']
})
/**
 * Componente para gestionar la modificación de unidades de arrastre.
 *
 * @class
 */
export class ModificacionUnidadComponent implements OnInit, OnDestroy {
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
   * Indica si se muestra la alerta informativa.
   * @type {boolean}
   */
  showInfoAlert = true;
  /**
   * Lista de unidades de arrastre.
   * @type {UnidadTabla[]}
   */
  unidadesArrastre: DatosUnidad[] = [];
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
   * Se genera dinámicamente usando los catálogos cargados.
   * @returns {ConfiguracionColumna<UnidadTabla>[]}
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
   * Índice de la unidad seleccionada en la tabla.
   * @type {number | null}
   */
  selectedUnidadIndex: number | null = null;

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
   * Constructor del componente `ModificacionUnidadComponent`.
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
    this.tramiteQuery.select(state => state.unidades_arrastre_modification)
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
   * @param {UnidadTabla[]} event - Evento de selección de la tabla.
   * @returns {void}
   */
  onUnidadRowSelected(event: DatosUnidad[]): void {

    if (event && event.length > 0) {
      const UNIDAD_SELECCIONADA = event[0];
      this.selectedUnidadIndex = this.unidadesArrastre.findIndex(u => 
        (UNIDAD_SELECCIONADA.vinVehiculo && u.vinVehiculo === UNIDAD_SELECCIONADA.vinVehiculo) ||
        (UNIDAD_SELECCIONADA.idDeVehiculo && u.idDeVehiculo === UNIDAD_SELECCIONADA.idDeVehiculo) ||
        (UNIDAD_SELECCIONADA.numeroPlaca && u.numeroPlaca === UNIDAD_SELECCIONADA.numeroPlaca && 
         UNIDAD_SELECCIONADA.numeroEconomico && u.numeroEconomico === UNIDAD_SELECCIONADA.numeroEconomico)
      );
      
      if (this.selectedUnidadIndex === -1) {
        this.selectedUnidadIndex = this.unidadesArrastre.indexOf(UNIDAD_SELECCIONADA);
      }
    } else {
      this.selectedUnidadIndex = null;
    }
  }
 /**
   * Agrega una unidad actualizada desde el diálogo y la selecciona.
   * @param {DatosUnidad} updatedUnidad - Unidad actualizada.
   * @returns {void}
   */
  alGuardarDialogoUnidad(updatedUnidad: DatosUnidad): void {
  
    const UNIDAS = [...this.unidadesArrastre];
    if (this.selectedUnidadIndex !== null && this.selectedUnidadIndex > -1) {
      UNIDAS[this.selectedUnidadIndex] = updatedUnidad;
    } else {
      UNIDAS.push(updatedUnidad);
    }
    this.store.setUnidadesArrastreModification(UNIDAS);
    this.mostrarDialogoUnidad = false;
    this.selectedUnidadIndex = null;
    this.cdr.detectChanges();
  }
 /**
   * Elimina la fila de unidad seleccionada.
   * @returns {void}
   */
  deleteUnidadRow(): void {
    if (this.selectedUnidadIndex !== null && this.selectedUnidadIndex >= 0) {
      const UNIDAS = this.unidadesArrastre.filter((_, index) => index !== this.selectedUnidadIndex);
      this.store.setUnidadesArrastreModification(UNIDAS);
      this.selectedUnidadIndex = null;
    }
  }
  /**
   * Abre el modal para agregar datos de unidades de arrastre mediante búsqueda.
   * Inicializa el diálogo para permitir al usuario buscar y agregar unidades al listado.
   * 
   * @returns {void}
   */
  agregarModal(): void {
    if (this.selectedUnidadIndex !== null) {
      this.datosDialogoUnidad = this.unidadesArrastre[this.selectedUnidadIndex];
    } else {
      this.datosDialogoUnidad = null;
    }
    this.mostrarDialogoUnidad = true;
  }
}