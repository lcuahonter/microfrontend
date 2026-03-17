import * as moment from 'moment';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Catalogo, CatalogosSelect, InputFecha, InputFechaComponent, Notificacion, NotificacionesComponent } from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-criterios-busqueda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFechaComponent, NotificacionesComponent],
  templateUrl: './criterios-busqueda.component.html',
  styleUrls: ['./criterios-busqueda.component.scss']
})
export class CriteriosBusquedaComponent implements OnInit {
  /**
   * Evento al hacer click en Buscar
   */
  @Output() buscar = new EventEmitter<Record<string, unknown>>();
  
  /**
   * Evento al hacer click en Exportar
   */
  @Output() exportar = new EventEmitter<Record<string, unknown>>();

  form!: FormGroup;
  configNotificacion: Notificacion | null = null;

  /**
   * Configuración de la fecha de inicio
   */
  configFechaInicio: InputFecha = {
    labelNombre: 'Fecha inicio vigencia:',
    required: false,
    habilitado: true
  };

  /**
   * Configuración de la fecha de fin
   */
  configFechaFin: InputFecha = {
    labelNombre: 'Fecha fin vigencia:',
    required: false,
    habilitado: true
  };

  /**
   * Configuración del tipo de trámite
   */
  configTipoTramite: CatalogosSelect = {
    labelNombre: 'Tipo trámite:',
    required: false,
    primerOpcion: 'Selecciona un valor',
    catalogos: [
      { id: 1, descripcion: 'Autorización', clave: 'A1' },
      { id: 2, descripcion: 'Prórroga', clave: 'A2' },
      { id: 3, descripcion: 'Modificación', clave: 'A3' },
      { id: 4, descripcion: 'Cancelación autoridad', clave: 'A4' },
      { id: 5, descripcion: 'Cancelación solicitante', clave: 'A5' }
    ]
  };

  constructor(private fb: FormBuilder) {}

  private initForm(): void {
    this.form = this.fb.group({
      fechaInicio: [''],
      fechaFin: [''],
      tipoTramite: [null]
    }, { validators: this.dateRangeValidator() });
  }

  /**
   * Validador para rango de fechas
   */
  private dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const FORM_GROUP = control as FormGroup;
      const START = FORM_GROUP.get('fechaInicio')?.value;
      const END = FORM_GROUP.get('fechaFin')?.value;

      if (START && END) {
        const START_DATE = moment(START, 'DD/MM/YYYY');
        const END_DATE = moment(END, 'DD/MM/YYYY');

        if (END_DATE.isBefore(START_DATE)) {
          return { dateRangeInvalid: true };
        }
      }
      return null;
    };
  }

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Maneja el evento de cambio de fecha de inicio
   * @param fecha Fecha seleccionada
   */
  onFechaInicioChange(fecha: string): void {
    this.form.get('fechaInicio')?.setValue(fecha);
  }

  /**
   * Maneja el evento de cambio de fecha de fin
   * @param fecha Fecha seleccionada
   */
  onFechaFinChange(fecha: string): void {
    this.form.get('fechaFin')?.setValue(fecha);
  }

  /**
   * Maneja el evento de cambio de tipo de trámite
   * @param catalogo Catalogo seleccionado
   */
  onTipoTramiteChange(catalogo: Catalogo): void {
    this.form.get('tipoTramite')?.setValue(catalogo);
  }

  /**
   * Maneja el evento de búsqueda
   */
  onBuscar(): void {
    const VALUES = this.form.value;
    const HAS_VALUES = Boolean(VALUES.fechaInicio || VALUES.fechaFin || VALUES.tipoTramite);

    if (!HAS_VALUES) {
      this.configNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'info',
        modo: '',
        titulo: 'Atención',
        mensaje: 'Es necesario agregar un criterio de búsqueda',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'modal-sm'
      };
    } else if (this.form.valid) {
      this.buscar.emit(this.form.value);
    }
  }

  /**
   * Maneja el evento de exportar
   */
  onExportar(): void {
    this.exportar.emit(this.form.value);
  }

  /**
   * Maneja el evento de confirmar modal
   * @param confirmar Indica si se confirmó la acción
   */
  onConfirmarModal(confirmar: boolean): void {
    if (confirmar) {
      this.configNotificacion = null;
    }
  }
}
