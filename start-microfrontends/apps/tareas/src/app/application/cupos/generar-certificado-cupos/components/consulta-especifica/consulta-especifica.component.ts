import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InputFecha, InputFechaComponent } from "@libs/shared/data-access-user/src";
import { CatalogoMock } from '../../service/model/response/certificado-cupo.model';
import { CommonModule } from '@angular/common';
import { ConsultaEspecificaRequest } from '../../service/model/request/consulta-certificado.model';
import { ConsultaService } from '../../service/consulta.service';

@Component({
  selector: 'app-consulta-especifica',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputFechaComponent],
  templateUrl: './consulta-especifica.component.html',
})
export class ConsultaEspecificaComponent implements OnInit {
  /**
   * Evento al hacer click en Buscar
   */
  @Output() buscar = new EventEmitter<ConsultaEspecificaRequest>();
  /**
   * Evento al hacer click en Exportar
   */
  @Output() exportar = new EventEmitter<ConsultaEspecificaRequest>();
  form: FormGroup;

  fechaDesdeConfig: InputFecha;
  fechaHastaConfig: InputFecha;

  /**
   * Lista de tratados y acuerdos
   */
  tratadosAcuerdos: CatalogoMock[] = [];
  /**
   * Lista de paises
   */
  paises: CatalogoMock[] = [];
  /**
   * Lista de representacion federal
   */
  representacionFederal: CatalogoMock[] = [];
  /**
   * Evento al hacer click en Exportar
   */
  @Output() errors = new EventEmitter<string[]>();
  /**
   * Evento al hacer click en Exportar
   */
  @Output() successMessage = new EventEmitter<string>();

  constructor(
    private fb: FormBuilder,
    private consultaService: ConsultaService
  ) {
    this.form = this.fb.group({
      rfc: [null, [this.caracteresAlfanumericosValidator]],
      tratadoAcuerdo: [null],
      pais: [null],
      fechaDesde: [null],
      fechaHasta: [null],
      estadoCertificado: [null],
      representacionFederal: [null, [Validators.required]]
    });

    this.fechaDesdeConfig = {
      labelNombre: 'Fecha desde',
      required: true,
      habilitado: true
    };
    this.fechaHastaConfig = {
      labelNombre: 'Fecha hasta',
      required: true,
      habilitado: true
    };
  }

  get tratadosAcuerdosValue(): string {
    return this.form.get('tratadoAcuerdo')?.value;
  }

  ngOnInit(): void {
    this.consultaService.getTratadosAcuerdos().subscribe((data) => {
      this.tratadosAcuerdos = data;
    });
    this.consultaService.getPaises().subscribe((data) => {
      this.paises = data;
    });
    this.consultaService.getRepresentacionFederal().subscribe((data) => {
      this.representacionFederal = data;
    });
  }

  /**
   * Validador para caracteres alfanumericos
   * @param control Control a validar
   * @returns ValidationErrors | null
   */
  private caracteresAlfanumericosValidator(control: AbstractControl): ValidationErrors | null {
    const VALUE = control.value;
    if (VALUE && !/^[a-zA-Z0-9]*$/.test(VALUE)) {
      return { caracteresAlfanumericos: true };
    }
    return null;
  }

  /**
   * Maneja el evento de cambio de fecha de inicio
   * @param fecha Fecha seleccionada
   */
  onFechaDesdeChange(fecha: string): void {
    this.form.get('fechaDesde')?.setValue(fecha);
  }

  /**
   * Maneja el evento de cambio de fecha de fin
   * @param fecha Fecha seleccionada
   */
  onFechaHastaChange(fecha: string): void {
    this.form.get('fechaHasta')?.setValue(fecha);
  }

  /**
   * Maneja el evento de búsqueda
   */
  onBuscar(): void {
    if (this.form.get('representacionFederal')?.invalid) {
      this.errors.emit(['(Representación Federal) es un campo requerido']);
      return;
    }
    this.errors.emit([]); // Clear errors on success
    this.buscar.emit(this.form.value);
  }
}
