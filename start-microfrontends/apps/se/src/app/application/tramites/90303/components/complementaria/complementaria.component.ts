import { Component, OnDestroy } from '@angular/core';
import { Mercancias, PlantasTabla, ProductorIndirecto, SectorTabla } from '../../../../shared/models/complementaria.model';
import { Solicitud90303State, Tramite90303Store } from '../../state/Tramite90303.store';
import { Subject, filter, take, takeUntil } from 'rxjs';
import { CatalogosService } from '../../service/catalogos.service';
import { CommonModule } from '@angular/common';
import { DISCRIMINATOR_VALUE } from '../../constantes/constantes90303.enum';
import { PlantasComponent } from '../../../../shared/components/plantas/plantas.component';
import { ProducirMercanciasComponent } from '../../../../shared/components/producir-mercancias/producir-mercancias.component';
import { ProductorIndirectoComponent } from '../../../../shared/components/productor-indirecto/productor-indirecto.component';
import { SectorComponent } from '../../../../shared/components/sector/sector.component';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { Tramite90303Query } from '../../state/Tramite90303.query';

/**
 * Componente ComplementariaComponent que maneja la visualización de tablas complementarias.
 * Proporciona funcionalidades para cargar y mostrar las tablas de plantas, sectores,
 * mercancías y productores indirectos.
 * @component ComplementariaComponent
 */
@Component({
  selector: 'app-complementaria',
  standalone: true,
  imports: [
    CommonModule,
    PlantasComponent, 
    SectorComponent, 
    ProducirMercanciasComponent, 
    ProductorIndirectoComponent,
    TablaDinamicaComponent
  ],
  templateUrl: './complementaria.component.html',
  styleUrl: './complementaria.component.scss',
})
/**
 * Componente ComplementariaComponent que maneja la visualización de tablas complementarias.
 * Proporciona funcionalidades para cargar y mostrar las tablas de plantas, sectores,
 * mercancías y productores indirectos.
 * @component ComplementariaComponent
 */
export class ComplementariaComponent implements OnDestroy {
  /**
   * Lista de datos para la tabla de plantas.
   * @type {PlantasTabla[]}
   */
  listaPlantasTabla: PlantasTabla[] = [];

  /**
   * Lista de datos para la tabla de sectores.
   * @type {SectorTabla[]}
   */
  listaSectorTabla: SectorTabla[] = [];

  /**
   * Lista de datos para la tabla de mercancías.
   * @type {Mercancias[]}
   */
  listaTablaMercancia: Mercancias[] = [];

  /**
   * Lista de datos para la tabla de productores indirectos.
   * @type {ProductorIndirecto[]}
   */
  listaTablaProductor: ProductorIndirecto[] = [];

  /**
   * Arreglo para buscar ID de solicitud.
   * @type {string}
   */
  buscarIdSolicitud!: string;

  /**
   * Tipo de programa (IMMEX o PROSEC)
   * @type {string}
   */
  tipoPrograma: string = '';

  /**
   * ID del programa autorizado.
   * @type {string}
   */
  idProgramaAutorizado: string = '';

  /**
   * Estado de la solicitud 90303.
   * @type {Solicitud90303State}
   */
  solicitud90303State!: Solicitud90303State;

  /**
   * ReplaySubject utilizado para gestionar la destrucción de observables.
   * Se emite un valor cuando el componente se destruye para cancelar las suscripciones activas.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param catalogo Servicio utilizado para obtener los datos de las tablas.
   * @param tramite90303Query Consulta para obtener el estado del trámite 90303.
   * @param tramite90303Store Almacén para manejar el estado del trámite 90303.
   */
  constructor(
    private catalogo: CatalogosService,
    private tramite90303Query: Tramite90303Query,
    private tramite90303Store: Tramite90303Store
  ) {
    this.tramite90303Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        filter((solicitud) => Boolean(solicitud?.buscarIdSolicitud?.length)),
        take(1)
      )
      .subscribe((solicitud) => {
        this.buscarIdSolicitud = solicitud?.buscarIdSolicitud || "";
        this.tipoPrograma = solicitud?.tipoPrograma || '';
        this.idProgramaAutorizado = solicitud?.selectedIdPrograma || '';

        if (this.buscarIdSolicitud.length > 0) {
          this.obtenerTablaPlantas();
          this.obtenerTablaSector();
          this.obtenerTablaMercancia();
          this.obtenerTablaProductor();
        }
      });
  }

  /**
   * Obtiene los datos de la tabla de plantas desde el servicio.
   */
  public obtenerTablaPlantas(): void {
    const PAYLOAD = {
      idSolicitud: this.buscarIdSolicitud,
      idProgramaAutorizado: this.idProgramaAutorizado,
      discriminador: DISCRIMINATOR_VALUE,
      fechaProsec: new Date().getTime(),
      idSolicitudNueva: ""
    };

    this.catalogo
      .obtenerTablaPlantas(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.listaPlantasTabla = respuesta.datos || [];
      });
    this.tramite90303Store.setPlantasTablaDatos(this.listaPlantasTabla);
  }

  /**
   * Obtiene los datos de la tabla de sectores desde el servicio.
   */
  public obtenerTablaSector(): void {
    this.catalogo
      .obtenerTablaSector(this.buscarIdSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.listaSectorTabla = respuesta.datos || [];
      });
    this.tramite90303Store.setSectorTablaDatos(this.listaSectorTabla);
  }

  /**
   * Obtiene los datos de la tabla de mercancías desde el servicio.
   */
  public obtenerTablaMercancia(): void {
    const PAYLOAD = {
      idSolicitud: this.buscarIdSolicitud,
      fechaProsec: new Date().getTime(),
    };

    this.catalogo
      .obtenerTablaMercancia(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.listaTablaMercancia = respuesta.datos?.map((item) => ({
          fraccionArancelaria: {
            cveFraccion: item.fraccionArancelaria?.cveFraccion || '',
          },
          cveSector: item.cveSector || '',
          descripcionTestado: item.descripcionTestado || '',
        })) || [];
      });
    this.tramite90303Store.setMercanciaTablaDatos(this.listaTablaMercancia);
  }

  /**
   * Obtiene los datos de la tabla de productores indirectos desde el servicio.
   */
  public obtenerTablaProductor(): void {
    const PAYLOAD = {
      idSolicitud: this.buscarIdSolicitud,
      fechaProsec: new Date().getTime(),
    };

    this.catalogo
      .obtenerTablaProductor(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.listaTablaProductor = respuesta.datos || [];
      });
    this.tramite90303Store.setProductorTablaDatos(this.listaTablaProductor);
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Este método emite un valor en el Subject `destroyNotifier$` para completar las suscripciones activas
   * y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
