import { Catalogo, CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Tramite30401Store } from '../../estados/tramites30401.store';

/**
 * Componente para la gestión de los datos generales en el sistema.
 * 
 * Este componente es independiente (`standalone`) y utiliza formularios reactivos
 * para la captura y validación de información. También se apoya en componentes reutilizables
 * como `TituloComponent` y `CatalogoSelectComponent`.
 * 
 * @component
 * @selector app-datos-generales
 * @standalone true
 * @imports CommonModule, ReactiveFormsModule, TituloComponent, CatalogoSelectComponent
 * @templateUrl ./datos-generales.component.html
 * @styleUrl ./datos-generales.component.scss
 */
@Component({
  selector: 'app-datos-generales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
  ],
  templateUrl: './datos-generales.component.html',
  styleUrl: './datos-generales.component.scss',
})
export class DatosGeneralesComponent implements OnInit {
  /**
   * Formulario inicializado para gestionar los datos generales.
   */
  inicializarFormulario!: FormGroup;

  /**
   * Lista observable de tipos de tránsito.
   */
  @Input() tipoTransitoList$!: Observable<Catalogo[]>;

  /**
   * Observable que contiene la clave del folio CAAT.
   */
  @Input() cveFolioCaat$!: Observable<string>;

  /**
   * Nombre del grupo de formulario que se utilizará.
   */
  @Input() grupoDeFormulario!: string;

  /**
   * Título del componente.
   */
  @Input() titulo!: string;
  /**
   * Nota sobre el capital social que se mostrará en el formulario.
   */
@Input() esFormularioSoloLectura: boolean = false;
  /**
   * Constructor del componente.
   * @param grupoDeFormaRaiz - Directiva del grupo de formulario raíz.
   * @param tramite30401Store - Servicio para gestionar el estado del trámite.
   */
  constructor(
    public grupoDeFormaRaiz: FormGroupDirective,
    private tramite30401Store: Tramite30401Store
  ) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario inicializado con el grupo de formulario proporcionado.
   */
  ngOnInit(): void {
    this.inicializarFormulario = this.grupoDeFormaRaiz.control.get(
      this.grupoDeFormulario
    ) as FormGroup;
  }

  /**
   * Pasa el valor de un campo del formulario a la tienda para la gestión del estado.
   * @param form - El formulario reactivo.
   * @param campo - El nombre del campo en el formulario.
   */
  setValoresStore(form: FormGroup | null, campo: string): void {
    if (!form) {
      return;
    }
    const CONTROL = form.get(campo);
    if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
      this.tramite30401Store.establecerDatos({ [campo]: CONTROL.value });
    }
  }

  /**
   * Verifica si un control del formulario es inválido, tocado o modificado.
   * @param nombreControl - Nombre del control a verificar.
   * @returns True si el control es inválido, de lo contrario false.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.inicializarFormulario.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }
}
