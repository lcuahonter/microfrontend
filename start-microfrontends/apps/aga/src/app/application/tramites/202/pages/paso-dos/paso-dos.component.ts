import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { CATALOGOS_ID, Catalogo, CatalogosService, TEXTOS } from '@ng-mf/data-access-user';
import { PrestadoresServicioService } from '../../services/prestadores-servicio/prestadores-servicio.service';

/**
 * Componente para gestionar el paso dos del trámite.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styles: ``,
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Escucha el evento para cargar los documentos que se emite desde <solicitud-page>.
   * @type {EventEmitter<void>}
   */
  @Input() cargaArchivosEvento!: EventEmitter<void>;

  /**
   * Textos utilizados en el componente.
   */
  TEXTOS = TEXTOS;

  /**
   * Clase CSS para la alerta de información.
   */
  infoAlert = 'alert-info';

  /**
   * Catálogo de documentos disponibles.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Documentos seleccionados por el usuario.
   */
  documentosSeleccionados: Catalogo[] = [];

  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * 
   * @param catalogosServices Servicio para gestionar los catálogos.
   * @param prestadoresServicioService Servicio para gestionar las operaciones relacionadas con prestadores de servicio.
   */
  constructor(
    private catalogosServices: CatalogosService,
    private prestadoresServicioService: PrestadoresServicioService
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
    this.obtenerDocumentosSeleccionados();
  }

  /**
   * Obtiene el catalgoso de los tipos de documentos disponibles para el trámite.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        }
      });
  }

  /**
   * Recupera la lista de documentos seleccionados.
   */
  obtenerDocumentosSeleccionados(): void {
    this.prestadoresServicioService.obtenerDocumentosSeleccionados()
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe({
        next: (result) => {
          this.documentosSeleccionados = result.data;
        }
      })
  }

  /**
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
}