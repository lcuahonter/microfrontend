import {
  Catalogo,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from "@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component";
import { ProductoOpción } from '../../constantes/vehiculos-adaptados.enum';
/**
 * @description Componente para manejar los detalles del trámite.
 * Proporciona entradas dinámicas para configurar un formulario y opciones relacionadas con los catálogos y solicitudes.
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
export class DatosDelTramiteComponent implements OnChanges{
  /**
  * @description Indica si el formulario debe mostrarse en modo solo lectura.
  */
  @Input() esFormularioSoloLectura!: boolean;

  /**
   * @description Identificador del procedimiento asociado al trámite.
   */
  @Input() idProcedimiento!: number;
  
  /**
   * @description El grupo de formulario reactivo que contiene los datos del trámite.
   */

  @Input() form!: FormGroup;

  /**
   * @description Campos dinámicos configurados para el formulario.
   * Cada campo tiene una etiqueta, un marcador de posición y una propiedad requerida.
   */

  @Input() inputFields: {
    label: string;
    placeholder: string;
    required: boolean;
    controlName:string
  }[] = [];

  /**
   * @description Matriz de catálogos que contienen opciones adicionales para el formulario.
   */

  @Input() catalogosArray: Catalogo[][] = [];

  /**
   * @description Indica si se debe mostrar el error de clasificación.
   */
  @Input() mostrarErrorClasificacion: boolean = false;

  /**
   * @description Opciones de solicitud configuradas para el formulario.
   */

  @Input() solicitudOpciones: ProductoOpción[] = [];

  /**
   * Indica si se debe ocultar la primera opción en los select.
   * @type {boolean}
   */
  @Input() hiddenPrimerOption: boolean = true;

  /**
   * Indica si se debe deshabilitar la primera opción en los select.
   * @type {boolean}
   */
  @Input() disabledPrimerOption: boolean = true;

  /**
   * @description Emisor de eventos para comunicar cambios de valores al componente padre.
   * @event setValoresStoreEvent
   */

  @Output() setValoresStoreEvent = new EventEmitter<{
    form: FormGroup;
    campo: string
   
  }>();

  /**
   * @description Verifica si un control del formulario es inválido.
   * @param nombreControl El nombre del control que se desea verificar.
   * @returns Devuelve true si el control es inválido y está marcado como tocado o modificado; de lo contrario, devuelve false.
   */

  esInvalido(nombreControl: string): boolean {
    const CONTROL = this.form.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
     * Método del ciclo de vida que se ejecuta cuando cambian las propiedades de entrada del componente.
     *
     * Si la propiedad `esFormularioSoloLectura` cambia, habilita o deshabilita el formulario según su valor.
     * Esto permite que el formulario se muestre en modo solo lectura o editable dinámicamente.
     *
     * @param changes - Objeto que contiene los cambios detectados en las propiedades de entrada.
     */
    ngOnChanges(changes: SimpleChanges): void {
      // Verifica si el formulario ha cambiado y actualiza su estado
      if (changes['esFormularioSoloLectura']) {
        if (this.esFormularioSoloLectura) {
        this.form.disable();
    }else if (!this.esFormularioSoloLectura) {
       this.form.enable();
    }
      }
    }
  
  /**
   * @description Emite un evento para actualizar valores en el almacén.
   * @param form El grupo de formulario que contiene los datos.
   * @param campo El campo específico que se está modificando.
   * @param metodoNombre Nombre del método relacionado con el cambio.
   */
  
  setValoresStore(form: FormGroup, campo: string): void {
    this.setValoresStoreEvent.emit({ form, campo });
  }
}
