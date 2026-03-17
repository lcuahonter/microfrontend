import { CATALOGOS_ID, Catalogo, CatalogosService, TEXTOS } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
/**
 * Componente que representa el paso dos del flujo de trabajo.
 * En este paso, se gestionan los formularios relacionados con los datos
 * de solicitud y validación antes de continuar al siguiente paso.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Asigna el valor de la constante TEXTOS al mismo nombre para su uso en el componente.
   */
  TEXTOS = TEXTOS;

  /**
   * Lista de tipos de documentos disponibles para el trámite.
   */
  tiposDocumentos: Catalogo[] = [];

  /**
   * Clase CSS para mostrar información en una alerta.
   */
  infoAlert = 'alert-info';

  /**
   * Catálogo de documentos obtenidos del servicio.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Subject utilizado para destruir las suscripciones y evitar fugas de memoria.
   */
  private destruir$: Subject<void> = new Subject<void>();
  /**
   * Constructor del componente.
   * @param catalogosServices Servicio para obtener los catálogos necesarios.
   */
  constructor(private catalogosServices: CatalogosService) {

  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Obtiene los tipos de documentos disponibles y asigna documentos seleccionados por defecto.
   */
  ngOnInit(): void {
    // Obtiene los tipos de documentos disponibles para el trámite.
    this.getTiposDocumentos();
  }


  /**
   * Obtiene los tipos de documentos disponibles desde el servicio de catálogos.
   * Asigna la respuesta al catálogo de documentos si existen resultados.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .subscribe({
        next: (resp): void => {
          // Si la respuesta contiene elementos, se asignan al catálogo de documentos
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
        error: (_error: unknown): unknown => {
          // Manejo de errores en la obtención del catálogo
          return _error;
        }
      });
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Se utiliza para limpiar las suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
  }

}
