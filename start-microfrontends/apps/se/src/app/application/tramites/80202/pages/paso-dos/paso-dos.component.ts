import { Component, EventEmitter, Input } from '@angular/core';
import { Catalogo } from '@ng-mf/data-access-user';
import { TEXTOS_REQUISITOS } from '../../constants/immex-ampliacion-sensibles.enums';
/**
 * @component PasoDosComponent
 * @description Componente para el paso dos del trámite IMMEX Ampliación Sensibles. Permite cargar documentos y mostrar requisitos.
 * @author Ultrasist
 * @date 2025-09-30
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})

export class PasoDosComponent {
  /** Evento para regresar a la sección de carga de documentos. */
  @Input() regresarSeccionCargarDocumentoEvento!: EventEmitter<void>;

  /** Evento para cargar archivos desde la página de solicitud. */
  @Input() cargaArchivosEvento!: EventEmitter<void>;

  /** Identificador del tipo de trámite. */
  @Input() idTipoTRamite!: string;

  /** Lista de documentos del catálogo utilizados en el componente. */
  catalogoDocumentos: Catalogo[] = [];

  /** Clase CSS para mostrar mensajes de alerta informativos. */
  infoAlert = 'alert-info';

  /** Textos relacionados con los requisitos del trámite. */
  TEXTOS = TEXTOS_REQUISITOS;
}
