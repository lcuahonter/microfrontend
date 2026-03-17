import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, TituloComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosGeneralesDeLaSolicitudComponent } from '../../components/datos-generales-de-la-solicitud/datos-generales-de-la-solicitud.component';
import { DatosPorGarantiaComponent } from '../../components/datos-por-garantia/datos-por-garantia.component';
import { ModificacionDeDenominacionORazorsSocialComponent } from '../../components/modificacion-de-denominacion-o-razors-social/modificacion-de-denominacion-o-razors-social.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { Solicitud31301State } from '../../estados/solicitud31301.store';
import { SolicitudService } from '../../services/solicitud.service';
import { TercerosRelacionadosComponent } from '../../components/terceros-relacionados/terceros-relacionados.component';


/**
 * Componente que representa el primer paso de un trámite.
 * Maneja la visualización y activación de diferentes secciones (tabs) según el tipo de endoso.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SolicitanteComponent,
    DatosGeneralesDeLaSolicitudComponent,
    DatosPorGarantiaComponent,
    ModificacionDeDenominacionORazorsSocialComponent,
    TercerosRelacionadosComponent,
    TituloComponent
  ],
  templateUrl: './paso-uno.component.html',
  styleUrls: ['./paso-uno.component.scss'],
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  /**
   * Constructor del componente.
   *
   * @param consultaQuery Inyección del servicio de consulta del estado de la sección.
   * @param solicitudService Servicio para manejar la lógica relacionada con la solicitud.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    public solicitudService: SolicitudService
  ) {}

  /**
   * Ciclo de vida `ngOnInit`.
   *
   * - Se suscribe al estado de `consultaQuery` para obtener el estado actual de la sección.
   * - Si el estado indica una actualización (`update`), se ejecuta `guardarDatosFormulario`.
   * - En caso contrario, se establece `esDatosRespuesta` en `true`.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.solicitudService
      .guardarDatosFormulario()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp: Solicitud31301State) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitudService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Índice utilizado para identificar la pestaña activa dentro del paso.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Determina si la pestaña de modificación de denominación o razón social debe estar habilitada.
   * @type {number}
   */
  isEnableModificacionTab: string | number = 0;

  /**
   * Cambia la pestaña activa según el índice proporcionado.
   * @param i - El índice de la pestaña que se desea activar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Maneja el cambio de tipo de endoso y habilita o deshabilita la pestaña de modificación
   * dependiendo del valor seleccionado.
   *
   * @param evento - El tipo de endoso seleccionado (puede ser string o número).
   */
  tipoDeEndosoChanges(evento: string | number): void {
    this.isEnableModificacionTab = evento;
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Este método emite un valor al `destroyNotifier$` y lo completa para cancelar
   * todas las suscripciones activas y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
