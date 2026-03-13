import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import {DatosDomicilioLegalState, DatosDomicilioLegalStore,} from '../../estados/stores/datos-domicilio-legal.store';
import {FormBuilder,FormGroup,ReactiveFormsModule,Validators,} from '@angular/forms';
import { InputRadioComponent,TituloComponent,} from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import CumplimientoOptions from '@libs/shared/theme/assets/json/260501/cumplimiento-options.json';
import { DatosDomicilioLegalQuery } from '../../estados/queries/datos-domicilio-legal.query';
import { MANIFIESTOS_DECLARACION } from '../../constantes/aviso-de-funcionamiento.enum';
import { MENSAJE_DE_ALERTA } from '../../constantes/datos-domicilio-legal.enum';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { Shared2605Service } from '../../services/shared2605/shared2605.service';

/**
 * @description
 * Componente principal para gestionar el formulario de manifiestos y declaraciones.
 * Este componente permite capturar y validar datos relacionados con el cumplimiento
 * de manifiestos y declaraciones en el sistema.
 */
@Component({
  selector: 'app-manifiestos',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    InputRadioComponent,
  ],
  templateUrl: './manifiestos-declaraciones.component.html',
  styleUrl: './manifiestos-declaraciones.component.scss',
})
export class ManifiestosComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   * Radio value from parent, used to enable/disable fields based on selection.
   */
  @Input() tipoTramite: string = '';
  /**
   * Indica si el comportamiento es específico para el procedimiento.
   */
  @Input() esProcedimientoEspecifico: boolean = true;


  @Output() formValidityChange = new EventEmitter<boolean>();
  
  @Input() public idProcedimiento!: number;
  /**
   * @description
   * Mensaje de alerta que se muestra en el componente.
   */
  public mensaje = MENSAJE_DE_ALERTA.message;

  mensajeManifiestos: string = '';

  /**
   * @description
   * Estado actual de la solicitud.
   */
  public solicitudState!: DatosDomicilioLegalState;

  /**
   * @description
   * Notificador para destruir observables y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @description
   * Opciones de cumplimiento cargadas desde un archivo JSON.
   */
  cumplimientoOptions = CumplimientoOptions;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @description
   * Grupo de formularios para capturar los datos de manifiestos.
   */
  isUpdateDatos: boolean = false;

  /**
   * @description
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos.
   * @param DatosDomicilioLegalStore Store para gestionar el estado del domicilio legal.
   * @param DatosDomicilioLegalQuery Query para obtener datos del estado del domicilio legal.
   */
  constructor(
    private fb: FormBuilder,
    private DatosDomicilioLegalStore: DatosDomicilioLegalStore,
    private DatosDomicilioLegalQuery: DatosDomicilioLegalQuery,
    private consultaioQuery: ConsultaioQuery,
    private servicioDeFormularioService: ServicioDeFormularioService,
  private sharedSvc: Shared2605Service
    
  ) {
    //Reservado para futuras inyecciones de dependencias o inicializaciones.
  }

  /**
   * @description
   * Grupo de formularios principal para capturar los datos de manifiestos.
   */
  manifiestos!: FormGroup;

  /**
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario reactivo y sus valores iniciales basados en el estado de la solicitud.
   */
  ngOnInit(): void {

    /**
    * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
    *
    * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
    * - Llama a `configurarGrupoForm()` para aplicar configuraciones basadas en el estado recibido.
    * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
    */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.isUpdateDatos = seccionState.update;
          this.configurarGrupoForm(); // Configura el formulario reactivo.
        })
      )
      .subscribe()
  }

  

  ngOnChanges(): void {
    if (this.manifiestos && this.esProcedimientoEspecifico) {
      if (this.tipoTramite === '1') {
        this.manifiestos.get('mensaje')?.enable();
        this.manifiestos.get('cumplimiento')?.enable();
      } else {
        this.manifiestos.get('mensaje')?.disable();
        this.manifiestos.get('cumplimiento')?.disable();
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.manifiestos && this.esProcedimientoEspecifico) {
      this.manifiestos.get('mensaje')?.disable();
      this.manifiestos.get('cumplimiento')?.disable();
    }
  }

  public getStoreState(): any {
    return this.DatosDomicilioLegalQuery.getValue();
  }

  /**
   * @method configurarGrupoForm
   * @description Configura el formulario reactivo para los manifiestos, estableciendo los controles necesarios
   * y asignando valores iniciales desde el estado de la solicitud.
   */
  configurarGrupoForm(): void {
    this.mensajeManifiestos = MANIFIESTOS_DECLARACION.MANIFIESTOS;
    this.DatosDomicilioLegalQuery.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state) => {
        this.solicitudState = state;
        this.manifiestos?.patchValue({
          mensaje: state?.mensaje,
          cumplimiento: state?.cumplimiento,
      });
    });

  this.manifiestos = this.fb.group({
    mensaje: [this.solicitudState?.mensaje, Validators.requiredTrue],
    cumplimiento: [this.solicitudState?.cumplimiento, Validators.required],
  });


  if (this.esFormularioSoloLectura && this.manifiestos) {
    this.manifiestos.disable();
  } else {
    this.manifiestos.get('mensaje')?.disable();
    this.manifiestos.get('cumplimiento')?.disable();
  }

   /*
     * Si el formulario está en modo solo lectura, deshabilita todos los campos.
     * En caso contrario, habilita los campos para permitir la edición.
     * Esto asegura que el formulario refleje correctamente el estado de solo lectura.
     */
    if (this.esFormularioSoloLectura && this.manifiestos ) {
      this.manifiestos.disable();
    } else {
      this.manifiestos.enable();
    }

    this.servicioDeFormularioService.registerForm('manifiestosForm', this.manifiestos);
    this.servicioDeFormularioService.formTouched$.subscribe((formName) => {
      if (formName === 'manifiestosForm') {
        this.manifiestos.markAllAsTouched();
      }
    })
    this.formValidityChange.emit(this.manifiestos.valid);
    this.sharedSvc.manifiestosValidity=this.manifiestos.valid;
}
  /**
   * @description
   * Método que actualiza el estado del store con los valores del formulario.
   * @param form Formulario reactivo que contiene los datos.
   * @param campo Nombre del campo del formulario que se desea actualizar.
   * @param metodoNombre Nombre del método del store que se invocará.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof DatosDomicilioLegalStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (
      this.DatosDomicilioLegalStore[metodoNombre] as (
        value: string | number | boolean
      ) => void
    )(VALOR);

    this.servicioDeFormularioService.setFormValue('manifiestosForm', {
        [campo]: VALOR,
      });

    this.formValidityChange.emit(this.manifiestos.valid);
  }
  /**
 * Valida el clic del botón verificando que todos los formularios requeridos
 * (producto terminado, domicilio del establecimiento, representante legal,
 * denominación y SCIAN) estén correctamente definidos para su evaluación.
 */

validarClickDeBoton(): boolean {
    let ISVALID = true;
    if(this.manifiestos.invalid){
     this.manifiestos.markAllAsTouched();
     ISVALID = false;
    }
    return ISVALID? true : false;
}
/**
 * Marca como “touched” todos los controles de un FormGroup,
 * incluyendo los grupos anidados de forma recursiva,
 * para forzar la visualización de mensajes de validación.
 */

private markFormGroupTouched(form: FormGroup): void {
  Object.values(form.controls).forEach(control => {
    if (control instanceof FormGroup) {
      this.markFormGroupTouched(control); // recursive for nested groups
    } else {
      control.markAsTouched();
    }
  });
}

  /**
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia los observables para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}