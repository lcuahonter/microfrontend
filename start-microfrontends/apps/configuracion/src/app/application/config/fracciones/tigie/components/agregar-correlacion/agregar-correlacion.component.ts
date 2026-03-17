import { CargarArchivoMenusComponent, ErrorMessagesComponent, InputFecha, InputFechaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AltaFraccionService } from '../../service/alta-fraccion.service';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-correlacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    ErrorMessagesComponent,
    CargarArchivoMenusComponent,
    InputFechaComponent
],
  templateUrl: './agregar-correlacion.component.html'
})
export class AgregarCorrelacionComponent implements OnInit {
  @ViewChild('modalCarga') modalElement!: ElementRef;
  @ViewChild('modalValidando') modalValidandoElement!: ElementRef;

  configuracionFechaFin: InputFecha = {
    labelNombre: 'Fecha Fin de Vigencia',
    required: true,
    habilitado: true
  };

  configuracionFechaInicio: InputFecha = {
    labelNombre: 'Fecha Inicio de Vigencia',
    required: true,
    habilitado: false
  };

  form!: FormGroup;
  errors: string[] = [];
  modalInstance: Modal | null = null;
  modalValidandoInstance: Modal | null = null;
  isValidating = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private altaFraccionService: AltaFraccionService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      fraccionArancelaria: [null, [Validators.required, Validators.minLength(8)]],
      tipoOperacion: [null, Validators.required],
      unidadMedida: [{ value: null, disabled: false }],
      prohibida: [{ value: false, disabled: true }],
      exenta: [{ value: false, disabled: true }],
      impuestoAdValorem: [{ value: null, disabled: false }],
      impuestoEspecifico: [{ value: null, disabled: false }],
      tipoImpuestoEspecifico: [{ value: null, disabled: false }],
      descripcion: [{ value: null, disabled: false }],
      fechaInicio: [{ value: null, disabled: false }],
      fechaFin: [{ value: null, disabled: false }]
    });
  }

  /**
   * Valida y actualiza los errores al cambiar la fracción arancelaria
   */
  onFraccionChange(): void {
    const FRACCION = this.form.get('fraccionArancelaria');
    const OPERACION = this.form.get('tipoOperacion')?.value;

    this.updateErrorMessages();

    if (FRACCION?.valid && OPERACION && !this.isValidating) {
      this.validarFraccion();
    }
  }

  /**
   * Actualiza los errores al cambiar la fracción arancelaria
   */
  private updateErrorMessages(): void {
    const CONTROL = this.form.get('fraccionArancelaria');
    const ERRORS: string[] = [];

    if (CONTROL?.touched || CONTROL?.dirty) {
      if (CONTROL?.hasError('required')) {
        ERRORS.push('1. Fracción Arancelaria es un campo requerido.');
      }
      if (CONTROL?.hasError('minlength')) {
        ERRORS.push('2. Fracción Arancelaria debe tener al menos 8 caracteres de longitud.');
      }
    }
    
    this.errors = ERRORS;
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
            this.errors = [`3. ${FRACCION} no es una Fracción Arancelaria válida.`];
          }
        },
        error: () => {
          this.isValidating = false;
          this.modalValidandoInstance?.hide();
          this.errors = ['Ocurrió un error al validar la fracción.'];
        }
      });
    }
  }

  /**
   * Abre el modal de carga masiva
   */
  onAgregarCargaMasiva(): void {
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
