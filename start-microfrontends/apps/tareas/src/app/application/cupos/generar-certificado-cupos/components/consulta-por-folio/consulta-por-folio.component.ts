import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConsultaPorFolioRequest } from '../../service/model/request/consulta-certificado.model';

@Component({
  selector: 'app-consulta-por-folio',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './consulta-por-folio.component.html',
})
export class ConsultaPorFolioComponent {
  @Output() buscar = new EventEmitter<ConsultaPorFolioRequest>();
  @Output() errors = new EventEmitter<string[]>();
  @Output() successMessage = new EventEmitter<string>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      numeroFolio: [null, Validators.required]
    });
  }

  onBuscar(): void {
    if (this.form.invalid) {
      this.errors.emit(['El Numero Folio Tramite es requerido']);
      return;
    }
    this.errors.emit([]);
    this.buscar.emit(this.form.value);
  }
}
