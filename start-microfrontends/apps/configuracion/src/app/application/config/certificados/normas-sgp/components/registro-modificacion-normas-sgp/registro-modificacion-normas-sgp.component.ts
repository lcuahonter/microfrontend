import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputFecha, InputFechaComponent, TituloComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { NormaSGP } from '../../service/model/response/norma-sgp.model';

@Component({
  selector: 'app-registro-modificacion-normas-sgp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, InputFechaComponent],
  templateUrl: './registro-modificacion-normas-sgp.component.html'
})
export class RegistroModificacionNormasSgpComponent implements OnInit {
  @Input() datos: NormaSGP | null = null;
  @Input() bloquePaisPreviamenteSeleccionado: string = '';
  
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<NormaSGP>();

  form: FormGroup;
  
  fechaInicioConfig: InputFecha = {
    labelNombre: 'Fecha Inicio Vigencia',
    required: true,
    habilitado: true
  };

  fechaFinConfig: InputFecha = {
    labelNombre: 'Fecha Fin Vigencia',
    required: false,
    habilitado: true
  };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      bloquePais: [{ value: null, disabled: true }],
      literal: [null],
      posicionFraccion: [null],
      posicionValor: [false],
      activo: [false],
      fechaInicioVigencia: [null, Validators.required],
      fechaFinVigencia: [null]
    });
  }

  ngOnInit(): void {
    if (this.datos) {
      this.form.patchValue(this.datos);
    } else {
      this.form.patchValue({ bloquePais: this.bloquePaisPreviamenteSeleccionado });
    }
  }

  onFechaInicioChange(fecha: string): void {
    this.form.get('fechaInicioVigencia')?.setValue(fecha);
  }

  onFechaFinChange(fecha: string): void {
    this.form.get('fechaFinVigencia')?.setValue(fecha);
  }

  /*
  * Emite el evento guardar con los datos del formulario
  */
  onGuardar(): void {
    if (this.form.valid) {
      const FORM_VALUE = this.form.getRawValue();
      this.guardar.emit(FORM_VALUE);
    }
  }

  /*
  * Emite el evento cerrar
  */
  onCancelar(): void {
    this.cerrar.emit();
  }
}
