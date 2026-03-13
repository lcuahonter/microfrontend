/**
 * paso-uno.component.ts
 * Componente que representa el primer paso en un proceso de múltiples pasos para el trámite 630103.
 * Permite inicializar el estado, gestionar la selección de pestañas y actualizar datos del formulario.
 */
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { map, takeUntil } from 'rxjs';
import { RetornoImportacionTemporalService } from '../../services/retorno-importacion-temporal.service';
import { SolicitudComponent } from '../solicitud/solicitud.component';
import { Subject } from 'rxjs';

/**
 * Componente que representa el primer paso en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  standalone:false,
})
export class PasoUnoComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * El índice de la pestaña actualmente seleccionada.
   * Inicialmente establecido en 1.
   */
  indice: number = 1;  
  /**
   * Indica si el formulario está deshabilitado.
   * Por defecto es false (habilitado).
   */
  formularioDeshabilitado: boolean = false;

  /**
   * Evento emitido cuando la pestaña seleccionada cambia.
   * Útil para notificar a componentes padres sobre el cambio de pestaña.
   */
  @Output() tabChanged = new EventEmitter<void>();

  /**
   * Evento emitido cuando el usuario hace clic en Continuar y todos los formularios son válidos.
   * Permite navegar al siguiente paso (Paso 2).
   */
  @Output() continuarPaso = new EventEmitter<void>();

  /**
   * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Referencia al componente SolicitudComponent para acceder a sus métodos de validación.
   */
  @ViewChild('solicitud') solicitudComponent!: SolicitudComponent;

  /**
   * Indica si los datos de respuesta del servidor están disponibles para actualizar el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Subject para notificar la destrucción del componente y cancelar suscripciones activas.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la consulta actual, obtenido desde el store.
   */
  public consultaState!: ConsultaioState;

  /**
   * Selecciona una pestaña estableciendo su índice.
   * Permite cambiar de pestaña sin bloquear por validación.
   * La validación debe ocurrir solo al intentar continuar al siguiente paso.
   * @param i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.tabChanged.emit();
  }

  /**
   * Constructor del componente.
   * retornoImportacionTemporalService - Servicio para obtener y actualizar datos del formulario.
   * consultaQuery - Query para observar el estado de la consulta.
   */
  constructor(
    private retornoImportacionTemporalService: RetornoImportacionTemporalService,
    private consultaQuery: ConsultaioQuery,
    private cdr: ChangeDetectorRef
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }
 
  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe al estado de la consulta y decide si cargar datos o mostrar respuesta.
   */
 ngOnInit(): void {
  this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.consultaState = seccionState;
      })
    )
    .subscribe({
      next: () => {
        if (this.consultaState?.update) {
          this.cargarDatosFormulario();
        } else {
          this.esDatosRespuesta = true;
        }
      },
      error: () => {
        this.esDatosRespuesta = true;
      }
    });
}

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  cargarDatosFormulario(): void {
    this.retornoImportacionTemporalService
      .getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        this.esDatosRespuesta = true;
        this.retornoImportacionTemporalService.actualizarEstadoFormulario(resp);
      });
  }

  /**
   * Valida todos los formularios de los componentes del paso uno.
   * @returns {boolean} Estado de validación de todos los formularios.
   */
  public validarTodosFormulariosPasoUno(): boolean {
    let ES_VALIDO = true;

    // Validar Solicitante (siempre debe estar presente)
    if (this.solicitante?.form) {
      if (this.solicitante.form.invalid) {
        this.solicitante.form.markAllAsTouched();
        ES_VALIDO = false;
      }
    } else {
      ES_VALIDO = false;
    }

    // Siempre validar componentes de solicitud, independientemente de esDatosRespuesta
    // para asegurar que se muestren todos los errores inline
    if (this.solicitudComponent) {
      const SOLICITUD_VALIDA = this.validarComponentesSolicitud();
      if (!SOLICITUD_VALIDA) {
        ES_VALIDO = false;
      }
    } else if (this.esDatosRespuesta) {
      // Solo marcar como inválido por componente faltante si los datos están cargados
      ES_VALIDO = false;
    }

    return ES_VALIDO;
  }

  /**
   * Valida los componentes internos del módulo de solicitud.
   * @returns {boolean} true si todos los componentes son válidos
   */
  private validarComponentesSolicitud(): boolean {
    // Verificar que el componente de solicitud esté disponible y sus ViewChild componentes estén inicializados
    if (this.solicitudComponent && typeof this.solicitudComponent.validarFormularios === 'function') {
      // Forzar detección de cambios para asegurar que los ViewChild estén disponibles
      setTimeout(() => {
        if (this.solicitudComponent) {
          this.solicitudComponent.validarFormularios();
        }
      }, 0);
      return this.solicitudComponent.validarFormularios();
    }
    return false;
  }

  /**
   * Maneja el click en el botón Continuar. Valida todos los formularios y navega o muestra errores.
   */
  continuar(): void {
    const ES_VALIDO = this.validarTodosFormulariosPasoUno();
    if (!ES_VALIDO) {
      // Cambia a la pestaña Solicitud para mostrar errores inline
      this.indice = 2;
    } else {
      // Emite evento para navegar al siguiente paso (Paso 2)
      this.continuarPaso.emit();
    }
  }

  /**
   * Se ejecuta después de que la vista ha sido inicializada.
   * Llama al método obtenerTipoPersona del componente SolicitanteComponent
   * para establecer el tipo de persona como MORAL_NACIONAL.
   */
 ngAfterViewInit(): void {
  if (this.solicitante?.obtenerTipoPersona) {
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }
}

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
