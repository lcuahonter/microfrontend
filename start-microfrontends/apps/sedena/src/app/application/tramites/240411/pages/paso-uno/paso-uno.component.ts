import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';

import { Subject, map, takeUntil } from 'rxjs';
import { PermisoOrdinarioProrrogaImportacionMaterialExplosivoService } from '../../services/permiso-ordinario-prorroga-importacion-material-explosivo.service';

/**
 * @title Paso Uno
 * @description Componente que representa el primer paso del flujo de solicitud. Contiene los datos del solicitante, datos del trámite, terceros relacionados y pago de derechos.
 * @summary Agrupa los subcomponentes necesarios para capturar la información inicial del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnInit, OnDestroy, AfterViewInit {

  /**
   * El índice de la pestaña actualmente seleccionada.
   */
  indice: number = 1;

  /**
   * Indica si la tabla está deshabilitada.
   */
  isTablDisabled: boolean = false;

  /**
   * Indica si los datos de respuesta están disponibles.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Notificador para destruir las suscripciones.
   * Se utiliza para cancelar suscripciones activas al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la consulta actual.
   */
  public consultaState!: ConsultaioState;

  /**
   * Referencia al componente SolicitanteComponent.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  constructor(
    private permisoOrdinarioProrrogaImportacionMaterialExplosivoService: PermisoOrdinarioProrrogaImportacionMaterialExplosivoService,
    private consultaQuery: ConsultaioQuery
  ) {
    // do nothing
  }

  /**
   * Método del ciclo de vida OnInit.
   * Inicializa las suscripciones y el estado del componente.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.consultaState = seccionState;
      })).subscribe();
    if(this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Guarda los datos del formulario y actualiza el estado del formulario.
   */
  guardarDatosFormulario(): void {
    this.permisoOrdinarioProrrogaImportacionMaterialExplosivoService
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.permisoOrdinarioProrrogaImportacionMaterialExplosivoService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Método del ciclo de vida AfterViewInit.
   * Llama al método para obtener el tipo de persona del solicitante.
   */
  ngAfterViewInit(): void {
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }

  /**
   * Método del ciclo de vida OnDestroy.
   * Limpia las suscripciones cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Selecciona una pestaña estableciendo su índice.
   * @param i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
}
