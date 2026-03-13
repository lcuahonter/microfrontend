import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ValidacionesFormularioService } from "../../../core/services/shared/validaciones-formulario/validaciones-formulario.service";

/**
 * @component
 * @name GenerarObservacionComponent
 * @description Componente para la generación de observaciones en el flujo de autorización de dictámenes.
 * 
 * Permite al usuario capturar la justificación de la observación, validando el formulario antes de emitir el evento de guardado.
 * Incluye botones personalizables para generar observación y regresar, y emite eventos hacia el componente padre según la acción realizada.
 * 
 * @selector app-generar-observacion
 * @standalone true
 * @imports
 *  - CommonModule
 *  - FormsModule
 *  - ReactiveFormsModule
 * @templateUrl ./generar-observacion.component.html
 * @styleUrl ./generar-observacion.component.scss
 */
@Component({
  selector: 'app-generar-observacion',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './generar-observacion.component.html',
  styleUrl: './generar-observacion.component.scss',
})
export class GenerarObservacionComponent implements OnInit {
  /**
   * @property {FormGroup} observacionForm
   * @description Formulario reactivo para la captura de la justificación de la observación.
   */
  public observacionForm!: FormGroup;

  /**
   * @property {EventEmitter<{ events: string, datos: unknown }>} enviarEvento
   * @description Evento emitido al generar observación o regresar, enviando el tipo de evento y los datos asociados.
   */
  @Output() public enviarEvento = new EventEmitter<{ events: string, datos: unknown }>();
  
  /**
   * @property {string} botonRegresar
   * @description Texto personalizado para el botón de regresar.
   */
  @Input() public botonRegresar = 'Regresar';
  
  /**
   * @property {string} botonGenerar
   * @description Texto personalizado para el botón de generar observación.
   */
  @Input() public botonGenerar = 'Generar Observacion';
  
  /**
   * @property {boolean} mostrarTitulo
   * @description Bandera que controla la visibilidad del título "Autorizar dictamen".
   * Si es true, el título se muestra; si es false, el título se oculta.
   */
  @Input() public mostrarTitulo = true;

  /**
   * @constructor
   * @description Constructor del componente. Inicializa los servicios necesarios para la creación y validación del formulario de observación.
   * 
   * @param {FormBuilder} fb - Servicio para la creación de formularios reactivos.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validaciones personalizadas de formularios.
   */
  constructor(
    private fb: FormBuilder, 
    private validacionesService: ValidacionesFormularioService
  ) {}

  /**
   * @method ngOnInit
   * @description Método del ciclo de vida que se ejecuta al inicializar el componente.
   * 
   * Inicializa el formulario reactivo `observacionForm` con el campo requerido:
   * - justificacionObservacion: campo obligatorio con límite de 2000 caracteres.
   * 
   * @returns {void}
   */
  ngOnInit(): void {
    this.observacionForm = this.fb.group({
      justificacionObservacion: ['', [Validators.required, Validators.maxLength(2000)]],
    });
  }

  /**
   * @method isValid
   * @description Verifica si un campo específico del formulario es válido utilizando el servicio de validaciones personalizadas.
   * 
   * @param {string} field - Nombre del campo a validar.
   * @returns {boolean} Retorna `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(field: string): boolean {
    const VALIDATIONRESULT = this.validacionesService.isValid(
      this.observacionForm,
      field
    );
    return VALIDATIONRESULT === null ? false : VALIDATIONRESULT;
  }

  /**
   * @method generarObservacion
   * @description Marca todos los campos del formulario como tocados y, si el formulario es válido, emite el evento de generación de observación con los datos.
   * 
   * @returns {void}
   */
  generarObservacion(): void {
    this.observacionForm.markAllAsTouched();
    if (this.observacionForm.valid) {
      this.enviarEvento.emit({
        datos: this.observacionForm.value,
        events: "generar"
      });
    }
  }

  /**
   * @method regresar
   * @description Emite el evento de regreso hacia el componente padre, enviando el tipo de evento "regresar" y datos nulos.
   * 
   * @returns {void}
   */
  regresar(): void {
    this.enviarEvento.emit({ events: "regresar", datos: null });
  }
}