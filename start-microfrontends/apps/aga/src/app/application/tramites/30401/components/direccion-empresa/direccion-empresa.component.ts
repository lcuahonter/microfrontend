import { Catalogo, CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Tramite30401Store } from '../../estados/tramites30401.store';

/**
 * Componente para gestionar la dirección de la empresa en el formulario.
 */
@Component({
  selector: 'app-direccion-empresa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
  ],
  templateUrl: './direccion-empresa.component.html',
  styleUrl: './direccion-empresa.component.scss',
})
export class DireccionEmpresaComponent implements OnInit, OnChanges {
  /**
   * Formulario inicializado para la dirección de la empresa.
   */
  inicializarFormulario!: FormGroup;

  /**
   * Lista observable de entidades federativas.
   */
  @Input() entidadFederativaList$!: Observable<Catalogo[]>;

  /**
   * Lista observable de delegaciones o municipios.
   */
  @Input() delegacionMunicipioList$!: Observable<Catalogo[]>;

  /**
   * Lista observable de colonias.
   */
  @Input() coloniaList$!: Observable<Catalogo[]>;

  /**
   * Nombre del grupo de formulario.
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
   * @param tramite30401Store - Tienda para gestionar el estado del trámite 30401.
   */
  constructor(
    public grupoDeFormaRaiz: FormGroupDirective,
    private tramite30401Store: Tramite30401Store
  ) {
    // No se necesita lógica de inicialización adicional.
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
    if (changes['esFormularioSoloLectura'] && this.inicializarFormulario) {
      if (this.esFormularioSoloLectura) {
        this.inicializarFormulario.disable();
      } else {
        this.inicializarFormulario.enable();
      }
    }
  }
  
  /**
   * Método de inicialización del componente.
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
