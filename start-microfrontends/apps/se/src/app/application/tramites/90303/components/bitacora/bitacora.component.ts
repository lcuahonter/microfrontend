import { Component, OnDestroy } from '@angular/core';
import {
  ConfiguracionColumna,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Bitacora } from '../../../../shared/models/bitacora.model';
import { BitacoraTablaComponent } from '../../../../shared/components/bitacora/bitacora.component';
import { CONFIGURACION_BITACORA } from '../../constantes/constantes90303.enum';
import { CatalogosService } from '../../service/catalogos.service';
import { CommonModule } from '@angular/common';
import { Solicitud90303State } from '../../state/Tramite90303.store';
import { Tramite90303Query } from '../../state/Tramite90303.query';

/**
 * Componente para gestionar y mostrar la tabla de bitácoras.
 * Este componente también incluye tablas relacionadas con plantas, sectores,
 * mercancías y productores indirectos.
 */
@Component({
  selector: 'app-bitacora',
  standalone: true,
  imports: [
    CommonModule, 
    BitacoraTablaComponent, 
    TablaDinamicaComponent,
    TituloComponent
  ],
  templateUrl: './bitacora.component.html',
  styleUrl: './bitacora.component.scss',
})
export class BitacoraComponent implements OnDestroy {
  /**
   * Lista de datos para la tabla de bitácoras
   * @property {Bitacora[]} datosBitacora
   */
  datosBitacora: Bitacora[] = [];

  /**
   * Configuración de la tabla para la bitácora.
   * Define las columnas y su configuración utilizando la constante `CONFIGURACION_BITACORA`.
   * @property {ConfiguracionColumna<Bitacora>[]} configuracionTablaBitacora
   */
  configuracionTablaBitacora: ConfiguracionColumna<Bitacora>[] =
    CONFIGURACION_BITACORA;

  /**
   * Estado de la solicitud del trámite 90303.
   * @property {Solicitud90303State} solicitudState
   */
  solicitudState!: Solicitud90303State;

  /**
   * ReplaySubject utilizado para gestionar la destrucción de observables.
   * Se emite un valor cuando el componente se destruye para cancelar las suscripciones activas.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    
  /**
   * Constructor del componente.
   * @param catalogo Servicio utilizado para obtener los datos de las tablas.
   * @param tramite90303Query Query para obtener datos del estado del trámite 90303.
   */
  constructor(
    private catalogo: CatalogosService,
    private tramite90303Query: Tramite90303Query
  ) {
    this.tramite90303Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((solicitudState) => {
          this.solicitudState = solicitudState;
        })
      )
      .subscribe();
    
    if (this.solicitudState.selectedIdPrograma) {
      this.obtenerTablaBitacora(this.solicitudState.selectedIdPrograma);
    }
  }

  /**
   * Obtiene los datos de la tabla de bitácoras desde el servicio.
   * @param {string} idPrograma - Identificador del programa para el cual se obtendrán los datos de la bitácora.
   * @returns {void}
   */
  obtenerTablaBitacora(idPrograma: string): void {
    this.catalogo
      .obtenerTablaBitacora(idPrograma)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((respuesta) => {
        this.datosBitacora = respuesta.datos || [];
      });
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Emite un valor en `destroyed$` para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
