import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL,
  FormularioDinamico,
  PERSONA_MORAL_NACIONAL,
  SolicitanteComponent,
} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { BitacoraComponent } from '../../components/bitacora/bitacora.component';
import { CommonModule } from '@angular/common';
import { ModificacionComponent } from '../../components/modificacion/modificacion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { Tramite80301Store } from '../../estados/tramite80301.store';

/**
 * @component PasoUnoComponent
 * @description Componente que representa el primer paso de un formulario multipaso.
 * Gestiona la navegación entre pestañas mediante un índice activo.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  standalone: true,
  imports: [CommonModule, SolicitanteComponent ,ReactiveFormsModule,BitacoraComponent,ModificacionComponent],
})
/**
 * Clase que representa el componente del primer paso en un formulario multipaso.
 * @class PasoUnoComponent
 */
export class PasoUnoComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * @property {number} indice
   * @description Índice de la pestaña actualmente seleccionada.
   * Controla cuál de las secciones del formulario está activa.
   * @default 1
   */
  indice: number = 1;

  /**
   * Estado actual de la consulta para el componente.
   *
   * Esta propiedad almacena la información relacionada con el estado de la consulta
   * en el flujo del trámite. Utiliza el tipo `ConsultaioState` para definir la estructura
   * de los datos gestionados.
   */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Lista de formularios dinámicos para la persona.
   *
   * Esta propiedad contiene un array de objetos `FormularioDinamico` que representan los formularios dinámicos de la persona.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Lista de formularios dinámicos para el domicilio fiscal.
   *
   * Esta propiedad contiene un array de objetos `FormularioDinamico` que representan los formularios dinámicos del domicilio fiscal.
   */
  domicilioFiscal: FormularioDinamico[] = [];
  /**
   * Constructor del componente PasoUno.
   *
   * @param consultaQuery Servicio para consultar el estado de la consulta.
   * @param serviciosPermisoSanitarioService Servicio para gestionar los permisos sanitarios.
   *
   * Al inicializar, se suscribe al observable del estado de la consulta y actualiza la propiedad `consultaState`.
   * Si el estado indica que se debe actualizar (`update`), guarda los datos del formulario.
   * En caso contrario, establece la bandera `esDatosRespuesta` en verdadero.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    public solicitudService: SolicitudService,
    public tramite80301Store: Tramite80301Store,
  ) {
    // Constructor vacío
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Aquí se configuran las suscripciones necesarias para obtener los datos iniciales.
   * @return {void}
   */
  ngOnInit(): void {    
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;

          if (this.consultaState.update) {
            this.guardarDatosFormulario(this.consultaState?.id_solicitud);
            this.tramite80301Store.setIdSolicitud(Number(this.consultaState?.id_solicitud));
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();
    
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(id_solicitud: string): void {
    this.solicitudService
      .getMostrarSolicitud(id_solicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp?.datos) {
          const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;
          if (DATOS) {
            const MAPPED_DATA = this.solicitudService.reverseBuildSolicitud80301(DATOS as Record<string, unknown>);
            this.solicitudService.actualizarEstadoFormulario(MAPPED_DATA);
          }
          this.esDatosRespuesta = true;
        }
      });
  }

  /**
   * Método que se ejecuta después de que la vista ha sido inicializada.
   */
  ngAfterViewInit(): void {
    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
  }
  /**
   * @method seleccionaTab
   * @description Cambia el índice de la pestaña seleccionada.
   * Se utiliza para cambiar de paso en el formulario multipaso.
   * @param {number} i - Índice de la pestaña que se desea seleccionar.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
   * Método para emitir un evento de continuar.
   *
   * Este método emite un evento `continuarEvento` con una cadena vacía como valor.
   * Se utiliza para indicar que se debe continuar al siguiente paso en el proceso.
   *
   * @example
   * // Llamar al método para emitir el evento de continuar
   * this.continuar();
   */
  ngOnDestroy(): void {
    // Se ejecuta al destruir el componente
    this.destroyNotifier$.next(); // Emite el evento de destrucción
    this.destroyNotifier$.complete(); // Completa el subject para limpiar suscripciones
  }
}
