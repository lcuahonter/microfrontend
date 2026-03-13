/**
 * @component
 * @name RevisionDocumentalComponent
 * @description
 * Componente para gestionar la revisión documental del trámite 220701.
 * Permite navegar entre diferentes secciones del formulario, como datos generales, terceros relacionados y pago de derechos.
 * Utiliza componentes internos para cada sección y controla la navegación mediante pestañas.
 *
 * - Gestiona la navegación entre secciones del formulario.
 * - Emite eventos al cambiar de pestaña.
 * - Utiliza componentes hijos para mostrar cada sección.
 *
 * @example
 * <revision-documental (tabChanged)="onTabChanged($event)"></revision-documental>
 */

import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

import { InternaDatosGeneralesComponent } from '../interna-datos-generales/interna-datos-generales.component';
import { InternaPagoDeDerechosComponent } from '../interna-pago-de-derechos/interna-pago-de-derechos.component';
import { InternaTercerosRelacionadosComponent } from '../interna-terceros-relacionados/interna-terceros-relacionados.component';


@Component({
  selector: 'revision-documental',
  templateUrl: './revision-documental.component.html',
  styleUrl: './revision-documental.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, InternaDatosGeneralesComponent, InternaTercerosRelacionadosComponent, InternaPagoDeDerechosComponent],
})
/**
 * Componente para gestionar la revisión documental.
 * Este componente permite navegar entre diferentes secciones del formulario, como datos generales, terceros relacionados y pago de derechos.
 */
export class RevisionDocumentalComponent {

  /**
   * Índice de la pestaña seleccionada.
   * Controla qué pestaña está activa en la interfaz.
   * @type {number}
   * @default 1
   */
  indice: number = 1;
 
  /**
   * Lista de secciones del formulario.
   * Define las pestañas disponibles dentro del formulario, cada una asociada a un componente específico.
   * @type {Array<{ index: number; title: string; component: string }>}
   */
  seccionesDeLaSolicitud = [
    { index: 1, title: 'Datos Generales', component: 'interna-datos-generales' },
    { index: 2, title: 'Terceros Relacionados', component: 'interna-terceros-relacionados' },
    { index: 3, title: 'Pago de derechos', component: 'interna-pago-de-derechos' },
  ];

  /**
   * Evento emitido cuando el usuario cambia de pestaña.
   * Notifica el cambio de pestaña a otros componentes.
   * @event tabChanged
   * @type {EventEmitter<number>}
   */
  @Output() tabChanged = new EventEmitter<number>();

  /**
   * Constructor del componente.
   * Inicializa el servicio de detección de cambios.
   * @constructor
   * @param {ChangeDetectorRef} cdr - Servicio para la detección de cambios en el componente.
   */
  constructor(private cdr: ChangeDetectorRef){
    // Se puede agregar aquí la lógica del constructor si es necesario
  }
 
  /**
   * Cambia el índice de la pestaña seleccionada y emite el evento correspondiente.
   * Actualiza la pestaña activa y notifica el cambio a otros componentes.
   * @method seleccionaTab
   * @param {number} i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.tabChanged.emit(i);
  }
}
