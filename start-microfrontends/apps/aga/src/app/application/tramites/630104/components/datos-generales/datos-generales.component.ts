import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';

import { FORMULARIO_DATOS_GENERALES } from '../../enums/retorno-importacion-temporal.enum';

import { ModeloDeFormaDinamica, TituloComponent } from '@ng-mf/data-access-user';

/**
 * Componente `DatosGeneralesComponent`
 * 
 * Este componente es responsable de gestionar y mostrar el formulario de datos generales
 * en el contexto de un trámite específico. Utiliza un formulario dinámico para generar
 * los campos necesarios basados en una configuración predefinida.
 * 
 * @selector `app-datos-generales`
 * @standalone `true`
 * @imports `CommonModule`, `FormasDinamicasComponent`, `TituloComponent`
 * @templateUrl `./datos-generales.component.html`
 * @styleUrl `./datos-generales.component.scss`
 */
@Component({
  selector: 'app-datos-generales',
  standalone: true,
  imports: [CommonModule, FormasDinamicasComponent, TituloComponent],
  templateUrl: './datos-generales.component.html',
  styleUrl: './datos-generales.component.scss',
})
export class DatosGeneralesComponent implements OnInit {
  /**
   * Formulario reactivo que contiene los datos generales.
   */
  datosGeneralesFormulario!: FormGroup;

  /**
   * Configuración del formulario dinámico para los datos generales.
   * Esta configuración se obtiene de una enumeración predefinida.
   */
  formularioDatosGenerales: ModeloDeFormaDinamica[] = FORMULARIO_DATOS_GENERALES;

  /**
   * Constructor del componente.
   * 
   * @param fb `FormBuilder` - Servicio para construir formularios reactivos.
   */
  constructor(private fb: FormBuilder) { }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se inicializa el formulario de datos generales.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
  }

  /**
   * Inicializa el formulario de datos generales con los campos necesarios.
   * Actualmente, el formulario se inicializa vacío, pero puede ser extendido
   * para incluir validaciones y valores predeterminados.
   */
  inicializarFormulario(): void {
    this.datosGeneralesFormulario = this.fb.group({
      // Campos del formulario pueden ser añadidos aquí.
    });
  }
}