import { CATALOGOS_ID, Catalogo, CatalogosService, TEXTOS } from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AvisoService } from '../../services/aviso.service';


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
   * Evento emitido para reenviar el evento de solicitud de documentos.
   * Este evento se utiliza para notificar al componente padre que se debe reenviar la solicitud
   * de documentos requeridos.
   * @type {EventEmitter<void>}
   */
  @Output() reenviarEvento = new EventEmitter<void>();

  /**
   * Evento emitido para regresar a la sección de cargar documento.
   * Este evento se utiliza para notificar al componente padre que se debe regresar a la sección
   * de cargar documento.
   * @type {EventEmitter<void>}
   */
  @Output() regresarSeccionCargarDocumentoEvento = new EventEmitter<void>()
  
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
   * @param avisoService Servicio para absolver los documentos seleccionados.
   */
  constructor(
    private catalogosServices: CatalogosService,
    private avisoService: AvisoService
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
    this.avisoService.obtenerDocumentosSeleccionados()
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