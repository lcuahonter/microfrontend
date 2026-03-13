/**
 * @fileoverview Componente del segundo paso del trámite 300105
 * 
 * Este archivo contiene el componente que gestiona el segundo paso del proceso
 * de autorización de equipos de rayos X, enfocado en la anexión de documentos
 * requeridos y la presentación de información relevante al usuario.
 * 
 * Funcionalidades principales:
 * - Gestión de anexión de documentos
 * - Visualización de alertas informativas
 * - Integración con el sistema de textos
 * 
 * @author VUCEM Development Team
 * @since 1.0.0
 * @version 1.0.0
 */

import { AlertComponent, AnexarDocumentosComponent, TituloComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TEXTOS } from '@ng-mf/data-access-user';

/**
 * @class PasoDosComponent
 * @description Componente que gestiona el segundo paso del trámite 300105 para autorización
 * de equipos de rayos X. Este paso se enfoca en la anexión de documentos requeridos
 * y la presentación de información importante mediante alertas.
 * 
 * El componente es standalone e incluye funcionalidades para:
 * - Anexar documentos obligatorios y opcionales
 * - Mostrar alertas con instrucciones e información relevante
 * - Presentar títulos y estructura visual del paso
 * - Integrar textos predefinidos del sistema
 * 
 * Características técnicas:
 * - Componente standalone (no requiere módulo)
 * - Importación selectiva de dependencias
 * - Estilos específicos del componente
 * - Integración con sistema de textos centralizado
 * 
 * @example
 * ```typescript
 * // Uso del componente en template
 * // <app-paso-dos></app-paso-dos>
 * ```
 * 
 * @example
 * ```html
 * <!-- Integración en el wizard -->
 * <div *ngIf="pasoActual === 2">
 *   <app-paso-dos></app-paso-dos>
 * </div>
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 * @standalone true
 * @requires CommonModule
 * @requires AnexarDocumentosComponent
 * @requires AlertComponent
 * @requires TituloComponent
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [CommonModule, AnexarDocumentosComponent, AlertComponent, TituloComponent],
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent {
  /**
   * @property {any} TEXTOS
   * @description Referencia al objeto de textos predefinidos del sistema.
   * Contiene todos los textos, mensajes e instrucciones utilizados en la interfaz
   * de usuario para mantener consistencia y facilitar la internacionalización.
   * 
   * Esta propiedad permite acceder desde el template a textos como:
   * - Instrucciones para anexar documentos
   * - Mensajes de alerta
   * - Títulos y subtítulos
   * - Texto de ayuda y orientación
   * 
   * @example
   * ```typescript
   * // Acceso a textos específicos
   * const instruccion = this.TEXTOS.PASO_DOS.INSTRUCCION_DOCUMENTOS;
   * const alerta = this.TEXTOS.PASO_DOS.ALERTA_FORMATOS;
   * ```
   * 
   * @example
   * ```html
   * <!-- Uso en template -->
   * <app-alert [mensaje]="TEXTOS.PASO_DOS.ALERTA_IMPORTANTE">
   * </app-alert>
   * 
   * <app-titulo [texto]="TEXTOS.PASO_DOS.TITULO">
   * </app-titulo>
   * ```
   * 
   * @since 1.0.0
   * @readonly
   */
  TEXTOS = TEXTOS;

  /**
   * @constructor
   * @description Constructor del componente PasoDosComponent.
   * Inicializa el componente con la configuración necesaria para el segundo paso
   * del trámite 300105, preparando los recursos y referencias necesarias.
   * 
   * @example
   * ```typescript
   * // El constructor es llamado automáticamente por Angular
   * // cuando el componente es instanciado
   * ```
   * 
   * @since 1.0.0
   */
  constructor() {
    // Constructor básico - el componente utiliza principalmente
    // funcionalidades de los componentes importados
  }
}