import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ConsultaDatosService } from '../../servicios/consulta-datos.servicio';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { DatosDelTramiteContenedoraComponent } from '../../components/datos-del-tramite-contenedora/datos-del-tramite-contenedora.component';
import { EventEmitter } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PersonaTerceros } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject } from 'rxjs';
import { TercerosRelacionadosContenedoraComponent } from '../../components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';
import { Tramite240111Query } from '../../estados/tramite240111Query.query';
import { Tramite240111Store } from '../../estados/tramite240111Store.store';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * Paso uno del asistente de solicitud.
 * Administra los datos generales del trámite y navegación por pestañas.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    DatosDelTramiteContenedoraComponent,
    TercerosRelacionadosContenedoraComponent,
    PagoDeDerechosContenedoraComponent,
  ],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.css',
})
export class PasoUnoComponent implements OnDestroy, OnInit {
  /**
 * Índice del tab seleccionado.
 */
  @Input() indice: number = 1;

  /**
   * Evento emitido al cambiar de pestaña.
   */
  @Output() tabChanged = new EventEmitter<number>();

  /**
   * Estado de la consulta actual.
   */
  public consultaState!: ConsultaioState;

  /**
   * Indica si existen datos de respuesta.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Indica si el formulario es de solo lectura.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Personas relacionadas con el trámite.
   */
  public personas: PersonaTerceros[] = [];

  /**
   * Subíndice del tab interno.
   */
  public subIndice: number = 1;

  /**
   * Subject para cancelar suscripciones al destruir el componente.
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Inyecta dependencias para manejo de estado y consulta de datos.
   */
  constructor(
    private readonly tramite240111Query: Tramite240111Query,
    private readonly tramite240111Store: Tramite240111Store,
    private readonly consultaDatosService: ConsultaDatosService,
    private readonly consultaQuery: ConsultaioQuery
  ) { }

  /**
   * Inicializa el componente y sincroniza el estado del tab
   * y la información del formulario.
   */
  ngOnInit(): void {
    this.tramite240111Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab ?? 1;
      });

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.consultaState = state;
          this.esFormularioSoloLectura = state.readonly;

          if (state.update) {
            this.guardarDatosFormulario();
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();
  }

  /**
   * Libera recursos y cancela suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Obtiene y guarda los datos del formulario desde el servicio.
   */
  guardarDatosFormulario(): void {
    this.consultaDatosService
      .getDatosDeLaSolicitudData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.personas =
            (resp as { personas?: PersonaTerceros[] }).personas || [];
          this.consultaDatosService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Cambia el tab activo del formulario.
   * @param i Índice del tab seleccionado
   */
  public seleccionaTab(i: number): void {
    this.tramite240111Store.updateTabSeleccionado(i);
  }
}
