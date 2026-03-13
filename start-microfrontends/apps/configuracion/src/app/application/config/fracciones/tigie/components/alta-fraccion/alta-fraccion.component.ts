import { CargarArchivoMenusComponent, CategoriaMensaje, ErrorMessagesComponent, InputFechaComponent, Notificacion, NotificacionesComponent, TipoNotificacionEnum, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AltaFraccionService } from '../../service/alta-fraccion.service';
import { CommonModule } from '@angular/common';
import { InputFecha } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta-fraccion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    InputFechaComponent,
    CargarArchivoMenusComponent,
    ErrorMessagesComponent,
    NotificacionesComponent
  ],
  templateUrl: './alta-fraccion.component.html'
})
export class AltaFraccionComponent implements OnInit {
  @ViewChild('modalCarga') modalElement!: ElementRef;
  @ViewChild('modalValidando') modalValidandoElement!: ElementRef;
  
  form!: FormGroup;
  modalInstance: Modal | null = null;
  modalValidandoInstance: Modal | null = null;
  errors: string[] = [];
  isValidating = false;
  notificacionConfig?: Notificacion;
  successMessage: string = '';

  unidadMedidaOptions = [
    'Amperios', 'Barril', 'Botella', 'Cabeza', 'Caja', 'Cientos', 'Decenas', 
    'Docenas', 'Docenas par', 'Gramo', 'Gramo Neto', 'Juego', 'Kilo voltios', 
    'Kilogramo', 'Kilowatt', 'Kilowatt / Hora', 'Litro', 'Mega voltios', 
    'Metro Cúbico', 'Metro Lineal', 'Metros Cuadrados', 'Micro amperios', 
    'Mili amperios', 'Millar', 'Número', 'Par', 'Pieza', 'Tonelada', 
    'Tonelada métrica', 'Voltios', 'kilogramo de rendimiento limpio'
  ];

  fechaInicioConfig: InputFecha = { labelNombre: 'Fecha de Inicio de Vigencia', required: true, habilitado: false };
  fechaFinConfig: InputFecha = { labelNombre: 'Fecha de Fin de Vigencia:', required: false, habilitado: true };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private altaFraccionService: AltaFraccionService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.listenProhibidaChanges();
    this.listenTipoOperacionChanges();
  }

  private initForm(): void {
    this.form = this.fb.group({
      fraccionArancelaria: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      tipoOperacion: [null, Validators.required],
      unidadMedida: [null, Validators.required],
      prohibida: [false, Validators.required],
      exenta: [false, Validators.required],
      impuestoAdValorem: [null, [Validators.required, Validators.maxLength(18)]],
      impuestoEspecifico: [null, [Validators.required, Validators.maxLength(18)]],
      tipoImpuestoEspecifico: [{ value: 'Dlls/Kg', disabled: true }],
      descripcion: [null, Validators.required],
      fechaInicio: [null, Validators.required],
      fechaFin: [null]
    });
  }

  /**
   * Escucha los cambios en el campo prohibida
   */
  private listenProhibidaChanges(): void {
    this.form.get('prohibida')?.valueChanges.subscribe(prohibidaValue => {
      const EXENTA_CONTROL = this.form.get('exenta');
      if (prohibidaValue === true) {
        EXENTA_CONTROL?.setValue(true);
        EXENTA_CONTROL?.disable();
      } else {
        EXENTA_CONTROL?.enable();
      }
    });
  }

  /**
   * Escucha los cambios en el campo tipoOperacion
   */
  private listenTipoOperacionChanges(): void {
    this.form.get('tipoOperacion')?.valueChanges.subscribe(value => {
      const FRACCION = this.form.get('fraccionArancelaria');
      if (value && FRACCION?.valid && !this.isValidating) {
        this.validarFraccion();
      }
    });
  }

  /**
   * Valida la fracción arancelaria y busca la fracción seleccionada
   */
  private validarFraccion(): void {
    const FRACCION = this.form.get('fraccionArancelaria')?.value;
    const OPERACION = this.form.get('tipoOperacion')?.value;

    if (this.modalValidandoElement && !this.isValidating) {
      this.isValidating = true;
      this.modalValidandoInstance = new Modal(this.modalValidandoElement.nativeElement, { backdrop: 'static', keyboard: false });
      this.modalValidandoInstance.show();
      
      this.altaFraccionService.getFraccion(FRACCION, OPERACION).subscribe({
        next: (res) => {
          this.isValidating = false;
          this.modalValidandoInstance?.hide();
          if (res.codigo === '00' && res.datos) {
            this.form.patchValue(res.datos, { emitEvent: false });
            this.errors = [];
          } else {
            this.errors = [res.mensaje];
          }
          this.updateErrorMessages();
        },
        error: () => {
          this.isValidating = false;
          this.modalValidandoInstance?.hide();
          this.errors = ['Ocurrió un error al obtener la información de la fracción.'];
          this.updateErrorMessages();
        }
      });
    }
  }

  /**
   * Actualiza los errores al cambiar la fracción arancelaria
   */
  updateErrorMessages(): void {
    const CONTROLS = this.form.controls;
    const NEW_ERRORS: string[] = [...this.errors];

    if (CONTROLS['fraccionArancelaria'].errors?.['minlength']) {
      NEW_ERRORS.push('Fraccion Arancelaria debe tener al menos 8 caracteres de longitud');
    }

    this.errors = Array.from(new Set(NEW_ERRORS));
  }

  /**
   * Maneja el evento de aceptar
   */
  onAceptar(): void {
    this.updateErrorMessages();
    this.successMessage = '';
    if (this.form.valid && this.errors.length === 0) {
      const FRACCION = this.form.get('fraccionArancelaria')?.value;
      const OPERACION = this.form.get('tipoOperacion')?.value === 'importacion' ? 'IMPORTACIÓN' : 'EXPORTACIÓN';
      
      this.notificacionConfig = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.INFORMACION,
        modo: 'confirmacion',
        titulo: 'Alta de la Fracción Arancelaria',
        mensaje: `Confirmar el Alta de la Fracción Arancelaria [${FRACCION}] [${OPERACION}]`,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar'
      };
    } else {
      this.form.markAllAsTouched();
    }
  }

  /**
   * Maneja el evento de confirmar alta
   */
  onConfirmarAlta(confirmado: boolean): void {
    this.notificacionConfig = undefined;
    if (confirmado) {
      const FRACCION = this.form.get('fraccionArancelaria')?.value;
      const OPERACION = this.form.get('tipoOperacion')?.value === 'importacion' ? 'IMPORTACIÓN' : 'EXPORTACIÓN';
      
      this.successMessage = `La Fracción Arancelaria (${FRACCION}) (${OPERACION}) fue procesada exitosamente.`;
      this.form.reset();
      this.initForm();
    }
  }

  /**
   * Abre el modal de carga masiva
   */
  onAltaCargaMasiva(): void {
    if (this.modalElement) {
      this.modalInstance = new Modal(this.modalElement.nativeElement);
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    this.modalInstance?.hide();
  }

  onCancelar(): void {
    this.router.navigate(['/configuracion', 'fracciones']);
  }
}
