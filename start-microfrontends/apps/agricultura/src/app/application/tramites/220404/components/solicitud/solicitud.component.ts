import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ConsultaioQuery,
  FechasService,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, map, takeUntil, tap } from 'rxjs';
import { DesistimientoForm } from '../../modelos/desistimiento.model';
import { DesistimientoQuery } from '../../estados/tramite220404.query';
import { DesistimientoService } from '../../services/desistimiento.service';
import { DesistimientoStore } from '../../estados/tramite220404.store';
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
})
export class SolicitudComponent implements OnInit, OnDestroy {
  /** Variables para manejar los estados de suscripción y el formulario */
  public unsubscribe$ = new Subject<void>();

   /**
   * @description Constructor del componente.
   * Inicializa el componente y establece el índice de la pestaña seleccionada.
   */
   @Input() formularioDeshabilitado: boolean = false;
  /**
   * Estado actual del formulario de desistimiento.
   * Almacena los datos de la solicitud de desistimiento.
   */
  desistimientoFormState!: DesistimientoForm;

  /**
   * Formulario reactivo para gestionar los permisos de desistimiento.
   * Contiene los controles del formulario necesarios para esta funcionalidad.
   */
  formPermisoDesistir!: FormGroup;

  /**
   * Subject para controlar las suscripciones y evitar fugas de memoria.
   * Se utiliza para cancelar todas las suscripciones al destruir el componente.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de las secciones obtenidas del store.
   * Almacena las secciones y su estado de validación.
   */
  public seccion!: SeccionLibState;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /** Inyectamos los servicios necesarios*/
  constructor(
    private fb: FormBuilder,
    public desistimientoStore: DesistimientoStore,
    public fechaService: FechasService,
    public desistimientoService: DesistimientoService,
    public desistimientoQuery: DesistimientoQuery,
    public validacionesService: ValidacionesFormularioService,
    private seccionStore: SeccionLibStore,
    private seccionQuery: SeccionLibQuery,
    private consultaQuery: ConsultaioQuery
  ) {
    /** El constructor está intencionalmente vacío para la inyección de dependencias */
  }

  /** Método que se ejecuta al iniciar el componente */
  ngOnInit(): void {

    /**  Inicializa el formulario de desistimiento */
    this.crearFormDesistimiento();
  
    /**  Obtiene los datos necesarios para el desistimiento desde el servicio */
    this.getDesistimiento();
    
    /**  Suscribe a los cambios en el estado de "desistimiento" */
    this.desistimientoQuery.selectDesistimiento$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((desistimiento) => {
          /**  Asigna el estado del desistimiento al formulario */
          this.desistimientoFormState = desistimiento;
          /**  Vuelve a crear el formulario con los datos actualizados */
          this.crearFormDesistimiento();

        })
      )
      .subscribe();

    /**  Suscribe a los cambios en el estado de "seccion" */
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          /**  Actualiza el estado de la sección con el nuevo estado */
          this.seccion = seccionState;
        })
      )
      .subscribe();

    /**  Suscribe a los cambios en el estado del formulario y verifica la validación */
    this.formPermisoDesistir.statusChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        tap((_value) => {
          /**  Actualiza las validaciones en el estado del formulario */
          this.actualizarValidationInStore();
        })
      )
      .subscribe();

    /**
     * Suscribe a los cambios en el estado de "consulta" para actualizar el modo de solo lectura del formulario.
     * Cuando el estado cambia, se actualiza la variable 'esFormularioSoloLectura' y se inicializa el estado del formulario.
     */
    this.consultaQuery.selectConsultaioState$
      .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.esFormularioSoloLectura = seccionState.readonly;
        this.inicializarEstadoFormulario();
      })
      )
      .subscribe();
      
  }

/**
 * Inicializa el estado del formulario según el modo de solo lectura.
 * Si el formulario no existe, lo crea. Si el modo es solo lectura, deshabilita el formulario.
 */
inicializarEstadoFormulario(): void {
  if (!this.formPermisoDesistir) {
    this.crearFormDesistimiento();
  }
  if (this.esFormularioSoloLectura) {
    this.formPermisoDesistir.disable();
  }
}
  /**
   * Actualiza las validaciones del estado global basadas en el estado del formulario actual.
   * Si la sección activa es válida, actualiza el estado de validación correspondiente en el store.
   */
  actualizarValidationInStore(): void {
    let seccion: number | null = 0;
    const FORMAS_VALIDAS = this.seccion.formaValida;

    for (let i = 0; i < this.seccion.seccion.length; i++) {
      if (this.seccion.seccion[i] === true) {
        seccion = i;
        break;
      } else {
        seccion = null;
      }
    }

    if (seccion !== null) {
      if (this.formPermisoDesistir.valid) {
        FORMAS_VALIDAS[seccion] = true;
        this.seccionStore.establecerFormaValida(FORMAS_VALIDAS);
      } else {
        FORMAS_VALIDAS[seccion] = false;
        this.seccionStore.establecerFormaValida(FORMAS_VALIDAS);
      }
    }
  }

  /** Método para crear el formulario de retiro */
  crearFormDesistimiento(): void {
    this.formPermisoDesistir = this.fb.group({
      folio: [
        { value: this.desistimientoFormState?.folio || '', disabled: true },
      ],
      tipoDeSolicitud: [
        {
          value: this.desistimientoFormState?.tipoDeSolicitud || '',
          disabled: true,
        },
      ],
      descripcion: [
        { value: this.desistimientoFormState?.descripcion, disabled: false },
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(250)
        ],
      ],
    });
   
     if (this.formularioDeshabilitado) {
      this.formPermisoDesistir.disable();
    }
  }

  /**
   * Obtiene los datos de la solicitud de desistimiento desde el servicio.
   * Este método llama al servicio para recuperar los datos de la solicitud de desistimiento
   * y actualiza el formulario con los valores obtenidos si el folio está vacío.
   */
  getDesistimiento(): void {
    this.desistimientoService
      .getDesistimientoSolicitud()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        /**  Actualizamos los valores del formulario con los datos obtenidos */
        if (this.desistimientoFormState.folio === '') {
          this.formPermisoDesistir.patchValue(data);
          this.desistimientoFormState = data;
        }
      });
  }

  /**  Método que se ejecuta cuando cambia la descripción */
  onDescripcionChange(): void {
    const DESCRIPCION = this.formPermisoDesistir.get('descripcion')?.value;
    /**  Actualizamos la descripción en el estado global */
    this.desistimientoStore.setDescripcion(
      this.desistimientoFormState,
      DESCRIPCION
    );
    this.formPermisoDesistir.get('descripcion')?.updateValueAndValidity();
    this.actualizarValidationInStore();
  }

  /**
   * Verifica si un campo específico en un formulario es válido.
   *
   * @param {FormGroup} form - El formulario que contiene el campo a validar.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} - Retorna `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) ?? false;
  }

  /**  Método que se ejecuta cuando se destruye el componente */
  ngOnDestroy(): void {
    /**  Liberamos los recursos y notificamos a todos los observadores */
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
