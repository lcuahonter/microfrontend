import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TEXTOS } from '../../constantes/input-fila.enum';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/** Componente para la carga y selección de archivos con validaciones y ayuda contextual. */
@Component({
  selector: 'lib-input-fila',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  templateUrl: './input-fila.component.html',
  styleUrl: './input-fila.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFilaComponent),
      multi: true
    }
  ]
})

export class InputFilaComponent implements ControlValueAccessor, OnInit{

  /** Control de formulario asociado al input para la gestión de validaciones y valor. */
  @Input() formControl!: AbstractControl;

  /** Identificador único para el input de archivo. */
  @Input() id: string = 'fileInput';

  /** Tipo de archivo aceptado para la carga. */
  @Input() accept: string = '';

  /** Etiqueta que se muestra como nombre del campo para el input de archivo. */
  @Input() labelNombre: string = '';

  /** Indica si el campo de archivo es obligatorio en el formulario. */
  @Input() required: boolean = false;

  /** Indica si se debe mostrar el icono de ayuda (signo de interrogación) junto al campo. */
  @Input() tooltipQuestionCircle: boolean = false;

  /** Texto que se muestra en el tooltip de ayuda junto al campo de archivo. */
  @Input() tooltipText: string = '';

   /** Almacena el nombre del archivo seleccionado por el usuario para la carga por archivo. */
  @Input() public filaSeleccionadaNombre: string | null = null;

  /** Emite el valor seleccionado cuando cambia. */
  @Output() filaSeleccionadaEvento: EventEmitter<Event> = new EventEmitter();

  /** Evento que se emite cuando el usuario cancela el diálogo de selección de archivo. */
  @Output() archivoDialogCancelar = new EventEmitter<void>();

  /** Contiene los textos y mensajes utilizados en el componente para mostrar información y ayudas al usuario. */
  public TEXTOS = TEXTOS;

  /** Indica si el diálogo de selección de archivo está abierto. */
  private dialogoAbierto = false;

  /** Almacena el valor actual del input para el manejo con ControlValueAccessor. */
  private value: unknown;

  /**
   * Función que se ejecuta cuando el valor del input de archivo cambia.
   * Actualiza el valor interno del componente.
   */
  onChange = (value: File | null): void => {
    this.value = value;
  };
  
  /**
   * Marca el control de formulario como tocado cuando el input pierde el foco.
   */
  onTouched(): void {
    if (this.formControl && typeof this.formControl.markAsTouched === 'function') {
      this.formControl.markAsTouched();
    }
  }

  /**
   * Asigna el valor recibido al input de archivo y actualiza el nombre del archivo seleccionado.
   * @param val Archivo seleccionado o null.
   */
  writeValue(val: File | null): void {
    this.value = val;
    if (val) {
      this.filaSeleccionadaNombre = val.name;
    } else {
      this.filaSeleccionadaNombre = null;
    }
  }

  /**
   * Registra la función que se llamará cuando el valor del input de archivo cambie.
   * @param fn Función que recibe el archivo seleccionado o null.
   */
  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }

  /**
   * Registra la función que se llamará cuando el input pierda el foco.
   * @param fn Función que se ejecuta al marcar el control como tocado.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Inicializa el componente y agrega la validación de requerido al control de formulario si es necesario.
   */
  ngOnInit(): void {
    if (this.required && this.formControl) {
      this.formControl.addValidators(Validators.required);
      this.formControl.updateValueAndValidity();
    }
  }

  /**
   * Marca que el diálogo de selección de archivo ha sido abierto.
   */
  onDialogoAbierto(): void {
    this.dialogoAbierto = true;
  }

  /**
   * Detecta cuando la ventana recupera el foco y, si el diálogo de selección de archivo estaba abierto pero no se seleccionó archivo,
   * marca el diálogo como cerrado y emite el evento de cancelación.
   */
  @HostListener('window:focus')
  enVentanaEnfocar(): void {
    if (this.dialogoAbierto && !this.filaSeleccionadaNombre) {
      this.dialogoAbierto = false;
      this.archivoDialogCancelar.emit();
    }
  }

  /**
   * Maneja el evento de selección de archivo y asigna el nombre del archivo seleccionado a la variable correspondiente.
   * @param event - Evento de cambio del input de archivo.
   */
  onFilaSeleccionada(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    this.filaSeleccionadaNombre = null;
    if (INPUT.files && INPUT.files.length > 0) {
      const FILE = INPUT.files[0];
      this.filaSeleccionadaNombre = FILE.name;
      this.filaSeleccionadaEvento.emit(event);
    }
  }

  /**
   * Devuelve el nombre del archivo seleccionado o el texto por defecto si no hay archivo seleccionado.
   * @returns {string} Nombre del archivo o texto por defecto.
   */
  get fila(): string {
    return this.filaSeleccionadaNombre ? this.filaSeleccionadaNombre : this.TEXTOS.CARGA_DE_ARCHIVO_DE_TEXTO;
  }
}
