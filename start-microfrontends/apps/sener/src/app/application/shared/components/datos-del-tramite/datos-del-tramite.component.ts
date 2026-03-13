import {
  CatalogoSelectComponent,
  InputRadioComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CommonModule } from '@angular/common';
import { ProductoOpción } from '../../constantes/vehiculos-adaptados.enum';
/**
 * @description Componente para manejar los detalles del trámite.
 * Este componente proporciona entradas dinámicas para configurar un formulario
 * y opciones relacionadas con los catálogos y solicitudes.
 */
@Component({
  selector: 'app-datos-del-tramite',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    InputRadioComponent,
    CatalogoSelectComponent,
  ],
  templateUrl: './datos-del-tramite.component.html',
  styleUrl: './datos-del-tramite.component.scss',
})
export class DatosDelTramiteComponent implements OnInit{
  /**
   * @description El grupo de formulario reactivo que contiene los datos del trámite.
   * Este formulario se utiliza para capturar y validar la información del usuario.
   */
  @Input() form!: FormGroup;

  /**
   * @description Indica si el formulario debe mostrarse en modo solo lectura.
   * Cuando es `true`, todos los campos del formulario estarán deshabilitados y no podrán ser editados por el usuario.
   * Este valor se recibe como entrada desde el componente padre.
   * @type {boolean}
   * @default false
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * @description Campos dinámicos configurados para el formulario.
   * Cada campo incluye una etiqueta, un marcador de posición, una propiedad requerida
   * y el nombre del control asociado.
   */
  @Input() inputFields: {
    label: string;
    placeholder: string;
    required: boolean;
    controlName: string;
  }[] = [];

  /**
   * @description Matriz de catálogos que contienen opciones adicionales para el formulario.
   * Los catálogos permiten seleccionar valores predefinidos en los campos del formulario.
   */
  @Input() catalogosArray: Catalogo[][] = [];

  /**
   * @description Opciones de solicitud configuradas para el formulario.
   * Estas opciones representan las diferentes configuraciones disponibles para el trámite.
   */
  @Input() solicitudOpciones: ProductoOpción[] = [];

  /**
   * @description Emisor de eventos para comunicar cambios de valores al componente padre.
   * Este evento se dispara cuando se actualizan los valores del formulario.
   * @event setValoresStoreEvent
   */
  @Output() setValoresStoreEvent = new EventEmitter<{
    form: FormGroup;
    campo: string;
  }>();

  /**
 * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
 * 
 * Este método verifica si existen al menos dos campos en el arreglo `inputFields` y si ambos controles
 * están presentes en el formulario reactivo. Si se cumplen estas condiciones, se suscribe a los cambios
 * de valor del primer control. Cuando el valor del primer control cambia, el segundo control se reinicia
 * (se limpia su valor), se marca como "prístino" y "no tocado" para evitar mostrar mensajes de error
 * prematuramente. Finalmente, se emite un evento para actualizar el almacén (store) con el nuevo estado
 * del formulario y el nombre del campo que fue reiniciado.
 *
 * @returns {void}
 */
  ngOnInit(): void {
  if (
    this.inputFields.length > 1 && !this.esFormularioSoloLectura && 
    this.form.get(this.inputFields[0].controlName) &&
    this.form.get(this.inputFields[1].controlName)
  ) {
    
    const PRIMER_CONTROL = this.form.get(this.inputFields[0].controlName);
    if (PRIMER_CONTROL) {
      PRIMER_CONTROL.valueChanges.subscribe(() => {
        const SEGUNDO_CONTROL = this.form.get(this.inputFields[1].controlName);
        if (SEGUNDO_CONTROL) {
          SEGUNDO_CONTROL.reset();
          SEGUNDO_CONTROL.markAsPristine();
          SEGUNDO_CONTROL.markAsUntouched();
          this.setValoresStore(this.form, this.inputFields[1].controlName);
        }
      });
    }
  }
}

  /**
   * @description Verifica si un control del formulario es inválido.
   * @param nombreControl El nombre del control que se desea verificar.
   * @returns Devuelve `true` si el control es inválido y está marcado como tocado o modificado; de lo contrario, devuelve `false`.
   */
  esInvalido(nombreControl: string): boolean {
    const CONTROL = this.form.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * @method formularioSolicitudValidacion
   * Valida el formulario de solicitud verificando si todos los campos cumplen con las reglas de validación.
   * Si el formulario es inválido, marca todos los controles como tocados para mostrar los mensajes de error.
   *
   * @returns {boolean} - Retorna `true` si el formulario es válido, de lo contrario `false`.
   */
  formularioSolicitudValidacion(): boolean {
    if (this.form.valid) {
      return true;
    }
    this.form.markAllAsTouched();
    return false;
  }


  /**
   * @description Emite un evento para actualizar valores en el almacén.
   * Este método se utiliza para notificar al componente padre sobre los cambios realizados
   * en un campo específico del formulario.
   * @param form El grupo de formulario que contiene los datos.
   * @param campo El campo específico que se está modificando.
   * @param metodoNombre Nombre del método relacionado con el cambio.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    this.setValoresStoreEvent.emit({ form, campo });
  }
}