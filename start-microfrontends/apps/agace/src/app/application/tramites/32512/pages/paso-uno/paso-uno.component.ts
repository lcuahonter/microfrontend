import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { map, takeUntil } from 'rxjs/operators';
import { AvisoComponent } from '../../components/aviso/aviso.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { SolicitudModel } from '../../models/solicitud.model';
import { SolicitudService } from '../../services/solicitud.service';
import { Subject } from 'rxjs';

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
    AvisoComponent,
  ],
  templateUrl: './paso-uno.component.html',
  styleUrls: ['./paso-uno.component.scss'],
})
export class PasoUnoComponent implements OnDestroy, OnInit {
  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Referencia al componente de aviso mostrado en el formulario.
   * Se utiliza para mostrar mensajes de alerta o confirmación al usuario.
   */
  @ViewChild(AvisoComponent) avisoComponent!: AvisoComponent;

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  /**
   * Índice utilizado para identificar la pestaña activa dentro del paso.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Determina si la pestaña de modificación de denominación o razón social debe estar habilitada.
   * @type {boolean}
   */
  isEnableModificacionTab: boolean = false;

   /**
   * Constructor del componente.
   *
   * Inyecta los servicios necesarios para manejar la lógica del componente:
   * - `ConsultaioQuery` para acceder al estado de la consulta.
   * - `SolicitudService` para obtener y actualizar datos relacionados con la solicitud.
   *
   * @param consultaQuery - Query que permite observar el estado de la sección de consulta.
   * @param solicitudService - Servicio encargado de manejar las operaciones de la solicitud.
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
      .subscribe((resp: SolicitudModel) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitudService.actualizarEstadoFormulario(resp);
        }
      });
  }

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
    if (evento === 3) {
      this.isEnableModificacionTab = true;
    } else {
      this.isEnableModificacionTab = false;
    }
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
