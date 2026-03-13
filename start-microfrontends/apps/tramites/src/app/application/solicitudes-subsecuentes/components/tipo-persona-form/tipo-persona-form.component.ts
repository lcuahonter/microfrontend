import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ExtranjeroFormComponent } from '.././extranjero-form/extranjero-form.component';
import { ExtranjeroMoralFormComponent } from '.././extranjero-moral-form/extranjero-moral-form.component';
import { NoContribuyenteFormComponent } from '.././no-contribuyente-form/no-contribuyente-form.component';
import { PersonaFisicaFormComponent } from '.././persona-fisica-form/persona-fisica-form.component';
import { PersonaMoralFormComponent } from '.././persona-moral-form/persona-moral-form.component';
import { TituloComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-tipo-persona-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PersonaFisicaFormComponent,
    PersonaMoralFormComponent,
    NoContribuyenteFormComponent,
    ExtranjeroMoralFormComponent,
    ExtranjeroFormComponent,
    TituloComponent
  ],
  templateUrl: './tipo-persona-form.component.html'
})
export class TipoPersonaFormComponent implements OnInit {
  form!: FormGroup;
  errorMessage = '';

  tiposPersona = [
    { value: 'fisica', label: 'Persona fisica' },
    { value: 'moral', label: 'Persona moral' },
    { value: 'no_contribuyentes', label: 'No contribuyentes' },
    { value: 'extranjero', label: 'Extranjero' },
    { value: 'extranjero_moral', label: 'Extranjero moral' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tipoPersona: ['']
    });

    this.form.get('tipoPersona')?.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  /**
   * Establece un mensaje de error
   * @param msg mensaje de error
   */
  setErrorMessage(msg: string): void {
    this.errorMessage = msg;
  }

  /**
   * Obtiene el tipo de persona seleccionado
   * @returns string
   */
  get selectedTipo(): string {
    return this.form.get('tipoPersona')?.value || '';
  }
}
