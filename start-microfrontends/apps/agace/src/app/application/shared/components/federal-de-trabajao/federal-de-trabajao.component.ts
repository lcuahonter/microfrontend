import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Catalogo, CatalogoSelectComponent, ConfiguracionColumna, REGEX_RFC, TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Component, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { MENCIONE_TABLA,Mencione } from '../../models/datos-comunes.model';
import { Subject,map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosComunesService } from '../../services/datos-comunes.service';

/**
 * Componente que representa la funcionalidad de Federal De Trabajao.
 * Este componente es autónomo e incluye varias características como tablas dinámicas,
 * manejo de formularios e interacciones con modales.
 */
@Component({
  selector: 'app-federal-de-trabajao',
  standalone: true,
  providers: [BsModalService],
  imports: [CommonModule, TablaDinamicaComponent, CatalogoSelectComponent, ReactiveFormsModule],
  templateUrl: './federal-de-trabajao.component.html',
  styleUrl: './federal-de-trabajao.component.scss',
})
export class FederalDeTrabajaoComponent implements OnInit, OnDestroy {

  /**
   * Formulario reactivo para gestionar datos relacionados con empleados.
   */
  public numeroDeEmpleadosForm!: FormGroup;

  /**
   * Configuración para el tipo de selección de la tabla.
   */
  public tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Fuente de datos para la tabla dinámica.
   */
  public mencioneTablaDatos: Mencione[] = [];

  /**
   * Configuración para las columnas de la tabla.
   */
  public configuracionTabla: ConfiguracionColumna<Mencione>[] = MENCIONE_TABLA;

  /**
   * Subject utilizado para gestionar el ciclo de vida de las suscripciones y prevenir fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al modal actualmente abierto, si existe.
   */
  modalRef?: BsModalRef;

  /**
   * Datos del catálogo para el tercer bimestre.
   */
  public bimestreTresCatalogo: Catalogo[] = [];
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando se establece en `true`, los campos del formulario no son editables por el usuario.
   */
  public esFormularioSoloLectura: boolean = false;

  /** Almacena la fila seleccionada de la tabla de empleados para su edición o consulta. */
  private seleccionadaDatos: Mencione | null = null;

/**
 * Validador personalizado que verifica si el valor del control es un número entero.
 *
 * @param control - El control de formulario que se está validando.
 * @returns Un objeto de error con la propiedad `notInteger` si el valor no es un número entero,
 *          o `null` si el valor es válido o está vacío.
 */
static integerValidator(control: AbstractControl): ValidationErrors | null {
  const VALUE = control.value;
  if (VALUE === null || VALUE === '') {
    return null;
  }
  return Number.isInteger(Number(VALUE)) ? null : { notInteger: true };
}

  /**
   * Constructor del componente.
   * 
   * @param datosComunesSvc - Servicio para obtener datos comunes.
   * @param fb - Instancia de FormBuilder para crear formularios reactivos.
   * @param modalService - Servicio para gestionar modales.
   */
  constructor(
    private datosComunesSvc: DatosComunesService,
    private fb: FormBuilder,
    @Inject(BsModalService)
    private modalService: BsModalService,
    private consultaQuery: ConsultaioQuery
  ) {
      this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
      })).subscribe();
  }

  /**
   * Hook del ciclo de vida que se llama después de inicializar el componente.
   * Obtiene datos iniciales y configura el formulario reactivo.
   */
  ngOnInit(): void {
    this.getMencioneDatos();
    this.getBancoCatalogDatos();
    this.cerearFormulario();
    this.inicializarEstadoFormulario();
  }

    /**
     * Inicializa el formulario llamando al método para restablecer o crear la estructura del formulario.
     * Este método debe ser invocado para asegurar que el formulario esté en su estado inicial.
     */
    public inicializarFormulario(): void {
        this.cerearFormulario();
    }

  /**
   * Inicializa el formulario reactivo con reglas de validación.
   */
  public cerearFormulario(): void {
    this.numeroDeEmpleadosForm = this.fb.group({
      rfc: ['', [Validators.required, Validators.pattern(REGEX_RFC)]],
      razonSocial: [{value: '', disabled: true}, [Validators.required, Validators.minLength(3)]],
      numeroEmpleados: ['', [Validators.required, FederalDeTrabajaoComponent.integerValidator]],
      registro: [{value: '', disabled: true}, [Validators.required]],
      comboBimestresTres: [''],
    });
  }

    /**
     * Inicializa el estado del formulario según el modo de solo lectura.
     *
     * Si el formulario está en modo solo lectura (`esFormularioSoloLectura` es true),
     * ejecuta el método `guardarFormulario` para guardar el formulario.
     * De lo contrario, inicializa el formulario llamando a `inicializarFormulario`.
     */
    public inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarFormulario();
    } else {
      this.inicializarFormulario();
    }
    }

  /**
   * Obtiene datos para la tabla dinámica y los asigna al estado del componente.
   */
  public getMencioneDatos(): void {
    this.datosComunesSvc.getTablaDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const DATOS = JSON.parse(JSON.stringify(response));
      this.mencioneTablaDatos = DATOS.data;
    });
  }

  /**
   * Abre un cuadro de diálogo modal con la plantilla especificada.
   * 
   * @param template - Referencia de la plantilla para el contenido del modal.
   */
  public abrirModal(template: TemplateRef<unknown>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  /**
   * Obtiene datos del catálogo para el tercer bimestre y los asigna al estado del componente.
   */
  public getBancoCatalogDatos(): void {
    this.datosComunesSvc.getBancoDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const API_DATOS = JSON.parse(JSON.stringify(response));
      this.bimestreTresCatalogo = API_DATOS.data;
    });
  }

  /**
   * Inicializa el formulario y establece su estado habilitado o deshabilitado según la bandera de solo lectura.
   * - Llama a `inicializarFormulario()` para restablecer o inicializar el formulario.
   * - Si el formulario está en modo solo lectura (`esFormularioSoloLectura` es true), deshabilita `numeroDeEmpleadosForm`.
   * - De lo contrario, habilita `numeroDeEmpleadosForm`.
   */
  public guardarFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.numeroDeEmpleadosForm.disable();
    } else {
      this.numeroDeEmpleadosForm.enable();
    }
  }

/**
 * Maneja la acción de aceptar en el formulario del modal.
 *
 * Si el formulario `numeroDeEmpleadosForm` es inválido, marca todos los controles como tocados para mostrar los errores de validación y no cierra el modal.
 * Si el formulario es válido, cierra el modal ocultándolo.
 */
onAceptar(): void {
  if (this.numeroDeEmpleadosForm.invalid) {
    this.numeroDeEmpleadosForm.markAllAsTouched();
    return; 
  }
  this.modalRef?.hide();
}

/**
 * Maneja la acción de cancelar en el formulario del modal.
 *
 * Este método restablece el formulario `numeroDeEmpleadosForm` a su estado inicial
 * y cierra el modal ocultándolo.
 */
onCancelar(): void {
  this.numeroDeEmpleadosForm.reset();
  this.modalRef?.hide();
}

/** Busca el RFC ingresado y asigna datos simulados de registro y razón social al formulario si el RFC es válido. */
  buscar(): void {
    if (this.numeroDeEmpleadosForm.get('rfc')?.valid) {
      this.numeroDeEmpleadosForm.patchValue({
        registro: this.numeroDeEmpleadosForm.get('rfc')?.value,
        razonSocial: 'INTEGRADORA DE URBANIZACIONES SIGNUM, S DE RL CV'
      })
    } else {
      this.numeroDeEmpleadosForm.get('rfc')?.markAsTouched();
    }
  }

  /** Almacena la fila seleccionada de la tabla de empleados para su edición o consulta. */
  onFilaSeleccionada(event: Mencione): void {
    if (event) {
      this.seleccionadaDatos = event;
    }
  }

  /** Abre el modal para modificar el registro de empleados y carga los datos seleccionados en el formulario. */
  modificar(template: TemplateRef<unknown>): void {
    if (this.seleccionadaDatos) {
      this.abrirModal(template);
      this.numeroDeEmpleadosForm.patchValue({
        rfc: this.seleccionadaDatos?.rfc,
        razonSocial: 'INTEGRADORA DE URBANIZACIONES SIGNUM, S DE RL CV',
        numeroEmpleados: this.seleccionadaDatos?.numeroDeEmpleados,
        registro: this.seleccionadaDatos?.rfc,
        comboBimestresTres: this.seleccionadaDatos?.bimestre,
      })
    }
  }

/**
 * Hook del ciclo de vida que se llama cuando el componente es destruido.
 * Limpia las suscripciones para prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
