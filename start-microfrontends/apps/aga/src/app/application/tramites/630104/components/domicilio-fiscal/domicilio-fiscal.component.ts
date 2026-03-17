import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';

import { FORMULARIO_DOMICILIO_FISCAL } from '../../enums/retorno-importacion-temporal.enum';

import { ModeloDeFormaDinamica, TituloComponent } from '@ng-mf/data-access-user';

/**
 * Componente que representa el formulario de Domicilio Fiscal.
 * Este componente utiliza un formulario dinámico para capturar información relacionada con el domicilio fiscal.
 */
@Component({
  selector: 'app-domicilio-fiscal',
  standalone: true,
  imports: [CommonModule, FormasDinamicasComponent, TituloComponent],
  templateUrl: './domicilio-fiscal.component.html',
  styleUrl: './domicilio-fiscal.component.scss',
})
export class DomicilioFiscalComponent implements OnInit {
  /**
   * FormGroup que representa el formulario reactivo para el domicilio fiscal.
   */
  domicilioFiscalFormulario!: FormGroup;

  /**
   * Modelo de datos que define la estructura del formulario dinámico.
   * Se inicializa con los valores definidos en la constante FORMULARIO_DOMICILIO_FISCAL.
   */
  formularioDomicilioFiscal: ModeloDeFormaDinamica[] = FORMULARIO_DOMICILIO_FISCAL;

  /**
   * Constructor del componente.
   * @param fb - FormBuilder para la creación y gestión de formularios reactivos.
   */
  constructor(private fb: FormBuilder) {
    // Inicialización del componente.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se llama al método para inicializar el formulario.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
  }

  /**
   * Método para inicializar el formulario reactivo.
   * Define los controles y sus valores iniciales.
   */
  inicializarFormulario(): void {
    this.domicilioFiscalFormulario = this.fb.group({
      // Definir los controles del formulario aquí.
    });
  }
}