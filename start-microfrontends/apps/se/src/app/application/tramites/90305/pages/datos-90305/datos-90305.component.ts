/**
 * compo doc
 * @component Datos90305Component
 * @description
 * Componente que gestiona la información del solicitante en el trámite 90305.
 * Permite seleccionar el tipo de persona y cambiar entre diferentes pestañas de datos.
 * Gestiona el estado de consulta y la carga de datos del formulario.
 */

import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent, TIPO_PERSONA } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';

/**
 * compo doc
 * @selector app-datos-90305
 */
@Component({
  selector: 'app-datos-90305',
  templateUrl: './datos-90305.component.html',
})
export class Datos90305Component implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();
  
  /**
   * Estado de consulta que contiene la información del formulario y su estado.
   * Se obtiene a través de la consulta ConsultaioQuery.
   */
  public consultaState!: ConsultaioState;

  /**
   * Índice actual del subtítulo seleccionado en la interfaz.
   */
  indice: number = 1;

  /**
   * Constructor del componente Datos90305Component.
   * 
   * @param solicitud90305Service - Servicio para manejar la lógica de negocio relacionada con el trámite 90305.
   * @param consultaQuery - Consulta para obtener el estado actual del formulario y su configuración.
   */
  constructor(
    private solicitud90305Service: ProsecModificacionServiceTsService,
    private consultaQuery: ConsultaioQuery
  ) {}


  /**
   * Método que se ejecuta al inicializar el componente.
   * Se suscribe al estado de consulta para obtener la información del formulario.
   * Si el estado indica que se está actualizando, se llama a `guardarDatosFormulario`.
   * De lo contrario, se establece `esDatosRespuesta` como verdadero.
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

    if (this.consultaState?.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Método para guardar los datos del formulario.
   * Se suscribe al servicio `getRegistroTomaMuestrasMercanciasData` para obtener los datos del formulario.
   * Si la respuesta es válida, se actualiza el estado del formulario con los datos obtenidos.
   */
  guardarDatosFormulario(): void {
    /**
     * Se obtiene la información del formulario a través del servicio `solicitud90305Service`.
     * Se utiliza `takeUntil` para asegurarse de que la suscripción se cancele cuando el componente se destruya.
     */
    this.solicitud90305Service
      .getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitud90305Service.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Se ejecuta después de que la vista ha sido inicializada.
   * Llama al método `obtenerTipoPersona` del componente SolicitanteComponent
   * para establecer el tipo de persona como MORAL_NACIONAL.
   */
  ngAfterViewInit(): void {
    if (this.solicitante) {
      this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
    }
  }

  /**
   * Método para actualizar el índice del subtítulo seleccionado.
   * 
   * @param i - Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método que se ejecuta cuando el componente se destruye.
   * Cancela las suscripciones activas y libera recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
