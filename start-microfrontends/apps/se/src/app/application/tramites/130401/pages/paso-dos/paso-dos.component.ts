import { AlertComponent, TituloComponent } from "@libs/shared/data-access-user/src";
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogosService } from '@ng-mf/data-access-user';
import { CommonModule } from "@angular/common";
import { TEXTOS } from '@ng-mf/data-access-user';

/**
 * Componente para gestionar el paso dos del trámite 130401.
 * 
 * Este componente permite al usuario anexar documentos requeridos para el trámite.
 * También se encarga de obtener los tipos de documentos disponibles desde un catálogo.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent
  ],
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Textos utilizados en el componente.
   * 
   * Contiene mensajes y etiquetas predefinidas para mostrar en la interfaz.
   */
  TEXTOS = TEXTOS;

  /**
   * Lista de tipos de documentos disponibles.
   * 
   * Esta lista se obtiene desde un catálogo y se utiliza para mostrar las opciones
   * de documentos que el usuario puede anexar.
   */
  tiposDocumentos: Catalogo[] = [];

  /**
   * Mensaje de alerta informativa.
   * 
   * Este mensaje se muestra al usuario para proporcionar información adicional.
   */
  infoAlert = 'alert-info';

  /**
   * Catálogo de documentos disponibles.
   * 
   * Contiene los documentos obtenidos desde el servicio de catálogos.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * 
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  private destroy$: Subject<void> = new Subject<void>();
  /**
   * Propaga al componente <anexar-documentos> el evento para disparar el metodo confirmUpload en <anexar-documentos>.
   */
  @Output() reenviarEvento = new EventEmitter<void>();
  /**
 * Evento para regresar a la sección de carga de documentos.
 * 
 * Este evento se emite cuando se requiere regresar a la sección de carga de documentos.
 * Es utilizado para notificar a componentes padres sobre esta acción.
 */
  @Output() regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();

  /**
   * Constructor del componente.
   * 
   * @param {CatalogosService} catalogosServices - Servicio para obtener los catálogos de documentos.
   */
  constructor(public catalogosServices: CatalogosService) {
    // Constructor vacío
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * Este método llama a `getTiposDocumentos` para obtener los tipos de documentos disponibles.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * Obtiene los tipos de documentos desde el servicio de catálogos.
   * 
   * Este método realiza una solicitud al servicio de catálogos para obtener
   * los documentos disponibles y los almacena en `catalogoDocumentos`.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: Catalogo[]) => {
        this.catalogoDocumentos = resp;
      });
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * 
   * Este método completa el `Subject` `destroy$` para cancelar todas las suscripciones activas
   * y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}