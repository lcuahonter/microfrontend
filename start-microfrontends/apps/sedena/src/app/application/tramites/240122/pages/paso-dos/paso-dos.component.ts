import { AlertComponent, AnexarDocumentosComponent, CATALOGOS_ID, Catalogo, CatalogosService ,TituloComponent} from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject,takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TEXTOS_REQUISITOS } from '../../constantes/exportacion-explosivo-enum';

/**
 * @component
 * @name PasoDosComponent
 * @description
 * Este componente representa el segundo paso del formulario en el flujo del trámite.
 * Permite anexar documentos requeridos, consultando un catálogo de tipos de documentos
 * y emitiendo eventos relacionados con la carga o navegación del paso.
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [CommonModule, AlertComponent, TituloComponent, AnexarDocumentosComponent],
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Contiene el texto de requisitos legales o aclaratorios para mostrar al usuario.
   */
  public TEXTOS = TEXTOS_REQUISITOS;

  /**
   * Lista de tipos de documentos que podrían utilizarse en este paso.
   */
  public tiposDocumentos: Catalogo[] = [];

  /**
   * Tipo de alerta a mostrar (Bootstrap class).
   */
  public infoAlert = 'alert-info';

  /**
   * Catálogo completo de documentos disponibles.
   */
  public catalogoDocumentos: Catalogo[] = [];

  /**
   * Documentos seleccionados por el usuario en el componente.
   */
  public documentosSeleccionados: Catalogo[] = [];

  /**
   * Subject usado para cancelar suscripciones activas al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Evento emitido para indicar que se debe reenviar un evento padre.
   */
  @Output() reenviarEvento = new EventEmitter<void>();

  /**
   * Evento emitido para indicar que se debe regresar a la sección de carga de documentos.
   */
  @Output() regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();

  /**
   * Constructor que inyecta el servicio de catálogos.
   *
   * @param catalogosServices Servicio para obtener catálogos desde el backend.
   */
  constructor(private catalogosServices: CatalogosService) {}

  /**
   * Ciclo de vida: se ejecuta al iniciar el componente.
   * Llama a la función para cargar tipos de documentos desde el catálogo.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * Obtiene del servicio los tipos de documentos requeridos.
   * Actualiza la variable `catalogoDocumentos` con la respuesta.
   */
  public getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
      });
  }

  /**
   * Ciclo de vida: se ejecuta al destruir el componente.
   * Cancela todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
