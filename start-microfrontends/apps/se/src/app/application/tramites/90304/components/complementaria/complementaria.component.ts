import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { Mercancias, MercanciasResquesta, PlantasTabla, ProductorIndirecto, ProductorIndirectoResquesta, SectorTabla } from '../../../../shared/models/complementaria.model';
import { PlantasComponent } from '../../../../shared/components/plantas/plantas.component';
import { ProducirMercanciasComponent } from '../../../../shared/components/producir-mercancias/producir-mercancias.component';
import { ProductorIndirectoComponent } from '../../../../shared/components/productor-indirecto/productor-indirecto.component';
import { ProsecService } from '../../services/prosec/prosec.service';
import { SectorComponent } from '../../../../shared/components/sector/sector.component';

/**
 * Componente para mostrar la información complementaria de un trámite.
 * @component ComplementariaComponent
 */
@Component({
  selector: 'app-complementaria',
  standalone: true,
  imports: [
    PlantasComponent,
    SectorComponent,
    ProducirMercanciasComponent,
    ProductorIndirectoComponent
  ],
  templateUrl: './complementaria.component.html',
  styleUrl: './complementaria.component.scss'
})
export class ComplementariaComponent implements OnInit, OnDestroy {
  /**
   * Lista de plantas obtenidas del servicio
   * @type {PlantasTabla[]}
   */
  plantasTablaDatos: PlantasTabla[] = [];

  /**
   * Lista de sectores obtenidos del servicio
   * @type {SectorTabla[]}
   */
  sectorTablaDatos: SectorTabla[] = [];

  /**
   * Lista de mercancías obtenidas del servicio
   * @type {Mercancias[]}
   */
  listaTablaMercancia: Mercancias[] = [];

  /**
   * Lista de productores indirectos obtenidos del servicio
   * @type {ProductorIndirecto[]}
   */
  productoIndirectoDatos: ProductorIndirecto[] = [];

  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param {ProsecService} prosecService - Servicio para obtener los datos de la complementaria.
   */
  constructor(
    private prosecService: ProsecService
  ) {
    // constructor vacío
  }

  /**
   * Se ejecuta al inicializar el componente.
   * Llama a los métodos para obtener los datos de plantas, sectores, mercancías y productores indirectos.
   * @returns {void}
   */
  ngOnInit(): void {
    this.obtenerPlantasDatos();
    this.obtenerSectorDatos();
    this.obtenerMercanciasProducir();
    this.obtenerProductoIndirectoDatos();
  }

  /**
   * Método para obtener los datos de las plantas
   * @returns {void}
   */
  obtenerPlantasDatos(): void {
    this.prosecService.obtenerPlantasDatos()
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe((plantas: PlantasTabla[]) => {
        this.plantasTablaDatos = plantas.length > 0 ? plantas : [];
      });
  }

  /**
   * Método para obtener los datos de los sectores
   * @returns {void}
   */
  obtenerSectorDatos(): void {
    this.prosecService.obtenerSectorDatos()
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe((sectores: SectorTabla[]) => {
        this.sectorTablaDatos = sectores.length > 0 ? sectores : [];
      });
  }

  /**
   * Método para obtener los datos de las mercancías a producir
   * @returns {void}
   */

 obtenerMercanciasProducir(): void {
    this.prosecService
      .obtenerMercanciasProducir()
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe((data: MercanciasResquesta) => {
        this.listaTablaMercancia = data.data;
      });
  }

  /**
   * Método para obtener los datos de los productores indirectos
   * @returns {void}
   */
  obtenerProductoIndirectoDatos(): void {
    this.prosecService.obtenerProductoIndirectoDatos()
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe((productoIndirecto: ProductorIndirectoResquesta) => {
        this.productoIndirectoDatos = productoIndirecto.data.length > 0 ? productoIndirecto.data : [];
      });
  }

  /**
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
   * @return {void}
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
}