/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import documentosTable from 'libs/shared/theme/assets/json/31601/anexar.json';

/**
 * @Component - AnexarRequisitosComponent
 *
 * Este componente proporciona funcionalidad para adjuntar (anexar) los documentos requeridos.
 * Incluye un formulario con un desplegable para seleccionar un documento y un campo de entrada de archivo
 * para cargar un archivo relacionado con el documento seleccionado.
 */
@Component({
  selector: 'app-anexar-requisitos',
  standalone: true,
  imports: [CommonModule, CatalogoSelectComponent, ReactiveFormsModule],
  templateUrl: './anexar-requisitos.component.html',
  styleUrl: './anexar-requisitos.component.scss',
})
export class AnexarRequisitosComponent implements OnInit {
  /**
   *Formar grupo para el componente anexar-requisitos.
   * Este grupo de formulario se utiliza para administrar los controles del formulario y sus valores,
   *validación y estatus del componente anexar-requisitos.
   */
  anexarForm!: FormGroup;
  /**
   * Relación de documentos del componente anexar-requisitos.
   * Esta lista se completa a partir de un archivo JSON externo.
   */
  documentos = documentosTable.documentos;

  /**
   * Constructor para AnexarEquisitosComponent.
   * @param fb: instancia de FormBuilder utilizada para crear controles de formulario.
   */
  // eslint-disable-next-line no-empty-function
  constructor(private fb: FormBuilder) {}
  /**
   * Enlace de ciclo de vida que se llama después de que se inicializan las propiedades vinculadas a datos de una directiva.
   * Inicializa el componente llamando al método `anexarEquisitosForm`.
   *
   */
  ngOnInit(): void {
    this.anexarEquisitosForm();
  }

  /**
   * Inicializa el grupo de formularios `anexarForm` con un único control de formulario `valorSeleccionado`.
   * El control de formulario se inicializa con una cadena vacía como valor predeterminado.
   *
   * @returns {nulo}
   */

  anexarEquisitosForm(): void {
    this.anexarForm = this.fb.group({
      valorSeleccionado: [''],
    });
  }
  /**
   * Maneja el evento de cambio de un elemento de entrada de archivo.
   * Actualiza el control del formulario 'valorSeleccionado' con el valor del archivo seleccionado.
   *
   * Evento @param: el objeto de evento del evento de cambio de entrada del archivo.
   */
  cambioDeArchivo(event: any): void {
    this.anexarForm.patchValue({ valorSeleccionado: event.target.value });
  }
}
