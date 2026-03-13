import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PARTIDAS_TABLA, PartidasForma, PartidasInfo } from '@libs/shared/data-access-user/src/core/models/130301/solicitud-prorroga.model';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Solicitud130301State } from '../../../../estados/tramites/tramite130301.store';
import { SolicitudProrrogaService } from '../../services/solicitudProrroga/solicitud-prorroga.service';
import { Tramite130301Query } from '../../../../estados/queries/tramite130301.query';

/**
 * Componente para gestionar las partidas de la mercancía.
 */
@Component({
  selector: 'app-partidas-de-la-mercancia',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    TablaDinamicaComponent,
    ReactiveFormsModule
  ],
  templateUrl: './partidas-de-la-mercancia.component.html',
  styleUrl: './partidas-de-la-mercancia.component.scss',
})
export class PartidasDeLaMercanciaComponent implements OnInit, OnDestroy {
  /**
   * Configuración de las columnas de la tabla de partidas.
   */
  partidasTabla: ConfiguracionColumna<PartidasInfo>[] = PARTIDAS_TABLA;

  /**
   * Datos de la tabla de partidas obtenidos del servicio.
   */
  partidasTablaDatos: PartidasInfo[] = [];

  /**
   * Notificador para destruir observables activos y evitar pérdidas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Datos del formulario de partidas obtenidos del servicio.
   */
  partidasFormDatos: PartidasForma[] = [];

  /**
   * Formulario reactivo para las partidas de la mercancía.
   */
  partidas!: FormGroup;

  /**
   * País(es) de procedencia de la mercancía.
   */
  pais!: string;

  /**
   * Solicitud del estado actual del trámite 130301.
   */
  public solicitudState!: Solicitud130301State;

  /**
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos.
   * @param service Servicio para obtener los datos de las partidas.
   */
  constructor(
    private fb: FormBuilder,
    private service: SolicitudProrrogaService,
    private tramiteQuery: Tramite130301Query
  ) {
    this.tramiteQuery.selectSolicitud$
      .pipe(
      takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.crearFormulario();
  }
  /**
   * Crea y configura un formulario reactivo para gestionar las partidas de la mercancía con campos deshabilitados.
   */
  crearFormulario():void{
    this.partidas = this.fb.group({
      usoEspecificoMercancia: [{ value: '', disabled: true }],
      justificacionBeneficio: [{ value: '', disabled: true }],
      observaciones: [{ value: '', disabled: true }],
      representacionFederal: [{ value: '', disabled: true }]
    });
  }

  /**
   * Obtiene los datos de la tabla de partidas desde el servicio.
   */
  obtenerTablaDatos(): void {
    const ID_SOLICITUD = this.solicitudState?.partidasIdSolicitud;

    if(ID_SOLICITUD) {
      this.service.obtenerPartidasTablaDatos(ID_SOLICITUD)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((datos) => {
          const DATOS = datos?.datos;
          this.partidasTablaDatos = [...DATOS];
      });
    }
  }

  /**
   * Obtiene los datos del formulario de partidas desde el servicio.
   */
  obtenerFormDatos(): void {
    this.pais = this.solicitudState?.pais || '';

    this.partidas.patchValue({
      usoEspecificoMercancia: this.solicitudState?.usoEspecifico,
      justificacionBeneficio: this.solicitudState?.justificacionImportacionExportacion,
      observaciones: this.solicitudState?.observaciones,
      representacionFederal: this.solicitudState?.representacionFederal
    });

    this.obtenerTablaDatos();
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Libera los recursos y destruye los observables activos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}