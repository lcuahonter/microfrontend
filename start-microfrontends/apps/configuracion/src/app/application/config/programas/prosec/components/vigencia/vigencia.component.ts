import { Component, Input, OnInit, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FraccionesService } from '../../service/fracciones.service';
import { InputFecha } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { InputFechaComponent } from '@libs/shared/data-access-user/src';
import { Mode } from '../../constants';

/**
 * Interfaz para los valores del formulario de vigencia
 */
export interface VigenciaValue {
  fechaInicio: string;
  fechaFin: string;
}

/**
 * Componente para gestionar la vigencia con fecha de inicio y fecha de fin
 */
@Component({
  selector: 'app-vigencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFechaComponent],
  templateUrl: './vigencia.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VigenciaComponent),
      multi: true
    }
  ]
})
export class VigenciaComponent implements ControlValueAccessor, OnInit {
  /**
   * Título del componente
   */
  @Input() titulo = 'Vigencia';

  /**
   * Indica si se debe mostrar la fecha de fin
   */
  @Input() showFechaFin = false;

  /**
   * Indica si los campos son requeridos
   */
  @Input() isRequired = true;

  /**
   * Label para fecha de inicio
   */
  @Input() labelFechaInicio = 'Fecha de Inicio';

  /**
   * Label para fecha de fin
   */
  @Input() labelFechaFin = 'Fecha de Fin';

  /**
   * Modo de operación
   */
  @Input() mode: Mode = 'registrar';

  /**
   * Configuración para el input de fecha de inicio
   */
  fechaInicioConfig!: InputFecha;

  fechaFinConfig!: InputFecha;

  /**
   * Valor de fecha de inicio
   */
  fechaInicioValue: string = '';

  /**
   * Valor de fecha de fin
   */
  fechaFinValue: string = '';

  /**
   * Formulario de vigencia
   */
  vigenciaForm!: FormGroup;

  /**
   * Función para notificar cambios
   */
  private onChange: (value: VigenciaValue | null) => void = () => {
    // Placeholder
  };

  /**
   * Función para notificar cuando el campo es tocado
   */
  private onTouched: () => void = () => {
    // Placeholder
  };

  constructor(
    private fb: FormBuilder,
    private fraccionService: FraccionesService
  ) {}

  ngOnInit(): void {
    this.initializeConfigs();
  }

  /**
   * Inicializa las configuraciones de los inputs de fecha
   */
  private initializeConfigs(): void {
    this.fraccionService.getPrograma().subscribe((programa) => {
      const INITIAL_ACTIVE = Boolean(programa?.activo);
      this.fraccionService.setProgramCheckActivation(INITIAL_ACTIVE);
      
      this.fechaInicioConfig = {
        labelNombre: this.labelFechaInicio,
        required: this.isRequired,
        habilitado: this.mode === 'modificar' ? INITIAL_ACTIVE : true
      };
      this.fechaFinConfig = {
        labelNombre: this.labelFechaFin,
        required: this.isRequired,
        habilitado: this.mode === 'modificar' ? INITIAL_ACTIVE : true
      };

      // Escuchar cambios de activación en tiempo real
      if (this.mode === 'modificar') {
        this.fraccionService.activacionCheck$.subscribe((active) => {
          if (this.fechaFinConfig) {
            this.fechaFinConfig = { ...this.fechaFinConfig, habilitado: active };
          }
        });
      }

      // Inicializar el formulario
      this.vigenciaForm = this.fb.group({
        fechaInicio: [programa?.fechaInicio],
        fechaFin: [programa?.fechaFin]
      });
      this.fechaInicioValue = programa?.fechaInicio ?? '';
      this.fechaFinValue = programa?.fechaFin ?? '';
    });
  }

  /**
   * Maneja el cambio de fecha de inicio
   */
  onFechaInicioChange(fecha: string): void {
    this.fechaInicioValue = fecha;
    this.vigenciaForm.patchValue({ fechaInicio: fecha });
    this.emitChange();
  }

  /**
   * Maneja el cambio de fecha de fin
   */
  onFechaFinChange(fecha: string): void {
    this.fechaFinValue = fecha;
    this.vigenciaForm.patchValue({ fechaFin: fecha });
    this.emitChange();
  }

  /**
   * Emite el cambio de valores
   */
  private emitChange(): void {
    const VALUE: VigenciaValue = {
      fechaInicio: this.fechaInicioValue,
      fechaFin: this.fechaFinValue
    };
    this.onChange(VALUE);
    this.onTouched();
  }

  /**
   * Escribe un valor en el componente (ControlValueAccessor)
   */
  writeValue(value: VigenciaValue | null): void {
    if (value) {
      this.fechaInicioValue = value.fechaInicio;
      this.fechaFinValue = value.fechaFin;
      this.vigenciaForm.patchValue(value, { emitEvent: false });
    } else {
      this.fechaInicioValue = '';
      this.fechaFinValue = '';
      this.vigenciaForm.reset({ emitEvent: false });
    }
  }

  /**
   * Registra la función de cambio (ControlValueAccessor)
   */
  registerOnChange(fn: (value: VigenciaValue | null) => void): void {
    this.onChange = fn;
  }

  /**
   * Registra la función de touched (ControlValueAccessor)
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Establece el estado deshabilitado (ControlValueAccessor)
   */
  setDisabledState(isDisabled: boolean): void {
    this.fechaInicioConfig = {
      ...this.fechaInicioConfig,
      habilitado: !isDisabled
    };
    this.fechaFinConfig = {
      ...this.fechaFinConfig,
      habilitado: !isDisabled
    };
  }
}
