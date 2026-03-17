import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  Catalogo,
  REGEX_SOLO_NUMEROS,
  ValidacionesFormularioService,
} from '@ng-mf/data-access-user';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { NotificacionesComponent, Notificacion } from '@libs/shared/data-access-user/src/tramites/components/notificaciones/notificaciones.component';
import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import {
  REGEX_CORREO_ELECTRONICO,
} from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';
import { Subject, map, takeUntil } from 'rxjs';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery, CategoriaMensaje, TipoNotificacionEnum } from '@ng-mf/data-access-user';
import { InputRadioComponent } from "@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component";
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/**
 * Enum para los tipos de tabla que maneja el modal
 */
export enum TipoTabla {
  FABRICANTE = 'fabricante',
  PROVEEDOR = 'proveedor',
  DISTRIBUIDOR = 'distribuidor',
  IMPORTADOR = 'importador',
  OTROS = 'otros'
}

/**
 * Interface para la configuración del modal
 */
export interface ConfiguracionModalTerceros {
  tipo: TipoTabla;
  titulo: string;
  camposRequeridos: string[];
  mostrarNacionalidad?: boolean;
  mostrarTipoPersona?: boolean;
  validacionesCustom?: { [key: string]: any };
}

/**
 * Componente modal reutilizable para gestionar terceros relacionados.
 * Puede manejar diferentes tipos de tablas (fabricante, proveedor, distribuidor, etc.)
 */
@Component({
  selector: 'app-terceros-relacionados-modal-popup',
  standalone: true,
  templateUrl: './terceros-relacionados-modal-popup.component.html',
  styleUrls: ['./terceros-relacionados-modal-popup.component.scss'],
  imports: [
    CommonModule,
    TituloComponent,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
    CatalogoSelectComponent,
    InputRadioComponent,
    TooltipModule,
    NotificacionesComponent
  ],
})
export class TercerosRelacionadosModalPopupComponent implements OnInit, OnDestroy, OnChanges {

  /** 
   * Indicador para destruir suscripciones y evitar fugas de memoria. 
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Configuración del modal recibida desde el componente padre
   */
  @Input() configuracion!: ConfiguracionModalTerceros;

  /**
   * Estado de visibilidad del modal
   */
  @Input() mostrarModal: boolean = false;

  /**
   * Datos para edición (opcional)
   */
  @Input() datosEdicion?: any;

  /**
   * Modo del formulario: 'agregar' o 'editar'
   */
  @Input() modo: 'agregar' | 'modificar' = 'agregar';

  /**
   * ID del procedimiento para cargar catálogos específicos
   */
  @Input() idProcedimiento!: number;

  /**
   * Indica si el formulario está en modo solo lectura
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * Evento emitido al guardar los datos
   */
  @Output() guardarDatos = new EventEmitter<any>();

  /**
   * Evento emitido al cancelar la operación
   */
  @Output() cancelar = new EventEmitter<void>();

  /**
   * Evento emitido al cerrar el modal
   */
  @Output() cerrarModal = new EventEmitter<void>();

  /**
   * FormGroup principal del modal
   */
  public tercerosRelacionadosModalFormGroup!: FormGroup;

  /**
   * Datos del catálogo de países
   */
  public paisDropdownData: Catalogo[] = [];

  /**
   * Catálogos dinámicos
   */
  public catalogos: { [key: string]: Catalogo[] } = {};

  /**
   * Notificaciones para mostrar errores o información
   */
  public notificaciones: Notificacion[] = [];

  /**
   * Indica si se están cargando datos
   */
  public cargando: boolean = false;

  /**
   * Enum TipoTabla para usar en el template
   */
  public TipoTabla = TipoTabla;

  constructor(
    private formBuilder: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    // Suscribirse al estado readonly
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState: { readonly: boolean }) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  ngOnChanges(): void {
    if (this.configuracion) {
      this.configurarFormulario();
    }

    if (this.datosEdicion && this.modo === 'modificar') {
      this.cargarDatosEdicion();
    }
  }

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Inicializa el formulario base
   */
  private inicializarFormulario(): void {
    this.tercerosRelacionadosModalFormGroup = this.formBuilder.group({
      denominacionRazonSocial: ['', Validators.required],
      pais: ['', Validators.required],
      estadoLocalidad: [''],
      codigoPostaloEquivalente: [''],
      calle: ['',Validators.required],
      numeroExterior: [''],
      numeroInterior: [''],
      lada: [''],
      telefono: [''],
      correoElectronico: ['', [Validators.email, Validators.pattern(REGEX_CORREO_ELECTRONICO)]]
    });
  }

  /**
   * Configura el formulario según el tipo de tabla
   */
  private configurarFormulario(): void {
    if (!this.configuracion) return;

    // Configurar validadores según el tipo
    const camposRequeridos = this.configuracion.camposRequeridos || [];
    
    camposRequeridos.forEach(campo => {
      const control = this.tercerosRelacionadosModalFormGroup.get(campo);
      if (control) {
        control.setValidators([Validators.required, ...this.obtenerValidadoresCustom(campo)]);
        control.updateValueAndValidity();
      }
    });
  }

  /**
   * Carga datos para edición
   */
  private cargarDatosEdicion(): void {
    if (this.datosEdicion) {
      // Los datos vienen ya mapeados desde el componente padre
      this.tercerosRelacionadosModalFormGroup.patchValue(this.datosEdicion);
    }
  }

  /**
   * Obtiene validadores personalizados para un campo
   */
  private obtenerValidadoresCustom(campo: string): any[] {
    const validadores = [];
    
    switch (campo) {
      case 'correoElectronico':
        validadores.push(Validators.email, Validators.pattern(REGEX_CORREO_ELECTRONICO));
        break;
      case 'telefono':
        validadores.push(Validators.pattern(REGEX_SOLO_NUMEROS));
        break;
      case 'codigoPostaloEquivalente':
        validadores.push(Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(12));
        break;
      case 'lada':
        validadores.push(Validators.pattern(REGEX_SOLO_NUMEROS));
        break;
    }

    return validadores;
  }

  /**
   * Maneja el cambio de tipo de persona
   */
  public cambiarTipoPersona(valor: string): void {
    // Esta función puede ser implementada según necesidades específicas
  }

  /**
   * Guarda los datos del formulario
   */
  public guardar(): void {
    if (this.tercerosRelacionadosModalFormGroup.valid) {
      const formData = this.tercerosRelacionadosModalFormGroup.value;
      
      // Map only the form fields, with denominacionRazonSocial mapped to nombre
      const datos: any = {
        nombre: formData.denominacionRazonSocial, // Map denominacionRazonSocial to nombre for table display
        pais: formData.pais,
        estadoLocalidad: formData.estadoLocalidad,
        codigoPostaloEquivalente: formData.codigoPostaloEquivalente,
        calle: formData.calle,
        numeroExterior: formData.numeroExterior,
        numeroInterior: formData.numeroInterior,
        lada: formData.lada,
        telefono: formData.telefono,
        correoElectronico: formData.correoElectronico,
        tipo: this.configuracion.tipo,
        modo: this.modo
      };

      // Include original index for update operations
      if (this.modo === 'modificar' && this.datosEdicion && this.datosEdicion._originalIndex !== undefined) {
        datos._originalIndex = this.datosEdicion._originalIndex;
      }
      
      this.guardarDatos.emit(datos);
      this.limpiarFormulario();
    } else {
      this.marcarCamposInvalidos();
      this.mostrarNotificacion('Por favor complete todos los campos requeridos', 'error');
    }
  }

  /**
   * Valida si un campo es válido
   */
  public esValido(campo: string, form: FormGroup): boolean {
    const control = form.get(campo);
    return control ? control.valid && control.touched : false;
  }

  /**
   * Valida si un campo es inválido
   */
  public esInvalido(campo: string): boolean {
    const control = this.tercerosRelacionadosModalFormGroup.get(campo);
    return control ? control.invalid && control.touched : false;
  }

  /**
   * Limpia el formulario
   */
  public limpiar(form: FormGroup): void {
    // Reset with empty values to ensure fields are cleared
    form.reset({
      denominacionRazonSocial: '',
      pais: '',
      estadoLocalidad: '',
      codigoPostaloEquivalente: '',
      calle: '',
      numeroInterior: '',
      lada: '',
      telefono: '',
      correoElectronico: '',
      numeroExterior: ''
    });
    
    // Mark all fields as untouched and pristine
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
        control.setErrors(null);
      }
    });
    
    this.notificaciones = [];
  }

  /**
   * Cierra el modal fabricante
   */
  public toggleDivFabricante(action: string): void {
    this.cerrar();
  }

  /**
   * Envía el formulario de fabricante
   */
  public submitFabricanteForm(form: FormGroup): void {
    if (form.valid) {
      this.guardar();
    } else {
      this.marcarCamposInvalidos();
    }
  }

  /**
   * Marca el campo país como touched
   */
  public markPaisTouched(form: FormGroup): boolean {
    const control = form.get('pais');
    if (control) {
      control.markAsTouched();
      return control.invalid && control.touched;
    }
    return false;
  }

  /**
   * Cancela la operación
   */
  public cancelarOperacion(): void {
    this.limpiarFormulario();
    this.cancelar.emit();
  }

  /**
   * Cierra el modal
   */
  public cerrar(): void {
    this.limpiarFormulario();
    this.cerrarModal.emit();
  }

  /**
   * Limpia el formulario
   */
  private limpiarFormulario(): void {
    // Reset with empty values to ensure fields are cleared
    this.tercerosRelacionadosModalFormGroup.reset({
      denominacionRazonSocial: '',
      pais: '',
      estadoLocalidad: '',
      codigoPostaloEquivalente: '',
      calle: '',
      numeroInterior: '',
      lada: '',
      telefono: '',
      correoElectronico: '',
      numeroExterior: ''
    });
    
    // Mark all fields as untouched and pristine
    Object.keys(this.tercerosRelacionadosModalFormGroup.controls).forEach(key => {
      const control = this.tercerosRelacionadosModalFormGroup.get(key);
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
        control.setErrors(null);
      }
    });
    
    this.notificaciones = [];
  }

  /**
   * Marca todos los campos inválidos para mostrar errores
   */
  private marcarCamposInvalidos(): void {
    Object.keys(this.tercerosRelacionadosModalFormGroup.controls).forEach(key => {
      const control = this.tercerosRelacionadosModalFormGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Muestra una notificación
   */
  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'warning' | 'info'): void {
    const notificacion: Notificacion = {
      mensaje,
      categoria: tipo === 'error' ? CategoriaMensaje.ERROR : CategoriaMensaje.INFORMACION,
      tipoNotificacion: TipoNotificacionEnum.TOASTR,
      modo: 'info',
      titulo: '',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar'
    };
    this.notificaciones = [notificacion];
  }

  /**
   * Obtiene el título del modal según la configuración
   */
  public obtenerTitulo(): string {
    if (!this.configuracion) {
      return 'Agregar Tercero';
    }
    const accion = this.modo === 'modificar' ? 'Modificar' : 'Agregar';
    return `${accion} ${this.configuracion.titulo || 'Tercero'}`;
  }

  /**
   * Determina si un campo debe mostrarse
   */
  public mostrarCampo(campo: string): boolean {
    // En la versión simplificada, todos los campos se muestran por defecto
    return true;
  }
}