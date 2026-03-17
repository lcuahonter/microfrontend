import {
  CatalogoSelectComponent,
  InputRadioComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CommonModule } from '@angular/common';
import { ProductoOpción } from '../../constantes/vehiculos-adaptados.enum';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
/**
 * @description Componente para manejar los detalles de la mercancía.
 * Proporciona entradas para configurar un formulario y opciones para productos, fracciones y unidades.
 */
@Component({
  selector: 'app-datos-de-la-mercancia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    InputRadioComponent,
    CatalogoSelectComponent,
    TooltipModule
  ],
  templateUrl: './datos-de-la-mercancia.component.html',
  styleUrl: './datos-de-la-mercancia.component.scss',
})
export class DatosDeLaMercanciaComponent implements OnChanges {
  /**
   * Show tooltip for Valor factura USD (only for 130111)
   */
  @Input() mostrarTooltipValorFacturaUSD: boolean = false;
  /**
  * @description Indica si el formulario debe mostrarse en modo solo lectura.
  */
  @Input() esFormularioSoloLectura!: boolean;
  /**
   * @description El grupo de formulario reactivo para capturar los detalles.
   */
  @Input() form!: FormGroup;
  /**
   * @description Opciones disponibles para los productos.
   */
  @Input() productoOpciones: ProductoOpción[] = [];
  /**
   * @description Catálogo que contiene opciones de fracción.
   */
  @Input() fraccionCatalogo: Catalogo[] = [];
  /**
   * @description Catálogo que contiene opciones de unidad de medida.
   */
  @Input() unidadMedidaCatalogo: Catalogo[] = [];
  /**
   * @description Catálogo que contiene opciones de unidad.
   */
  @Input() unidadCatalogo: Catalogo[] = [];

  /*
   * @description Emisor de eventos para pasar datos del formulario al componente padre.
   * @event datosMercanciaChange
   */
  @Output() datosMercanciaChange = new EventEmitter();

  /**
   * @Input() mostrarErrores
   * Bandera que indica si se deben mostrar los mensajes de error en el formulario.
   */
  @Input() mostrarErrores: boolean = false;

  /**
  * @description
  * Indica si la fracción arancelaria corresponde a TIGIE.  
  * 
  * Este valor es recibido desde el componente padre y permite
  * habilitar o deshabilitar lógica específica relacionada con
  * la selección o validación de la fracción TIGIE.
  *
  * @type {boolean}
  */
  @Input() isFraccionTIGIE: boolean = false;

  /**
   * @description Emisor de eventos para pasar datos del formulario al componente padre.
   * @event setValoresStoreEvent
   */
  @Output() setValoresStoreEvent = new EventEmitter<{
    form: FormGroup;
    campo: string;

  }>();

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
      } else {
        this.form.enable();
      }
    }

  }


  /**
   * @description Verifica si un control del formulario es inválido.
   * @param nombreControl El nombre del control a verificar.
   * @returns Verdadero si el control es inválido y está tocado o modificado, de lo contrario, falso.
   */
  esInvalido(nombreControl: string): boolean {
    const CONTROL = this.form.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * @description Emite un evento para actualizar los valores en el almacén.
   * @param form El grupo de formulario que contiene los datos.
   * @param campo El nombre del campo que se está actualizando.
   * @param metodoNombre El nombre del método asociado con la acción.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    this.setValoresStoreEvent.emit({ form, campo });
  }
}
