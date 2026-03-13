import { Catalogo, CatalogosService, TEXTOS } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';

/**
 * Componente que representa el segundo paso del trámite.
 * Permite al usuario anexar documentos necesarios para el trámite.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
  standalone: false,
})
export class PasoDosComponent implements OnInit,OnDestroy {
 
  /**
   * Textos utilizados en el componente.
   */
  TEXTOS = TEXTOS;

  /**
   * Lista de tipos de documentos disponibles para el trámite.
   */
  tiposDocumentos: Catalogo[] = [];

  /**
   * Clase CSS para mostrar una alerta informativa.
   */
  claseAlertaInformativa = 'alert-info';

  /**
   * Catálogo de documentos disponibles.
   */
  catalogoDocumentos: Catalogo[] = [];
  
     /**
    * Notificador para destruir observables al destruir el componente.
    * Se utiliza para gestionar la cancelación de suscripciones activas y evitar fugas de memoria.
    */
     public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /**
   * Constructor del componente.
   * @param catalogosServices Servicio para obtener los catálogos necesarios para el trámite.
   */
  constructor(private catalogosServices: CatalogosService) {
    // El constructor se utiliza para la inyección de dependencias.
  }
  
  /**
   * Método que se ejecuta al inicializar el componente.
   * Obtiene los tipos de documentos disponibles y establece los documentos seleccionados por defecto.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * Obtiene el catálogo de los tipos de documentos disponibles para el trámite.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        }
      });
  }
 /**
   * Método de limpieza que se ejecuta cuando el componente se destruye.
   */
  ngOnDestroy(): void {
   this.destroyed$.next(true);
   this.destroyed$.complete();
  }

}
