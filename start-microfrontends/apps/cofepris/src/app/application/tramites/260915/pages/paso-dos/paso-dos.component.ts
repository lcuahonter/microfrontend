import { Component, OnDestroy, OnInit } from '@angular/core';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogosService } from '@ng-mf/data-access-user';
import { ReplaySubject } from 'rxjs';
import { TEXTOS } from '@ng-mf/data-access-user';

import { takeUntil } from 'rxjs/operators';

/**
 * PasoDosComponent.
 * Este componente se encarga de gestionar la lógica del segundo paso en el flujo de servicios extraordinarios.
 * Muestra los tipos de documentos disponibles y permite seleccionar los documentos requeridos para el trámite.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Textos de la aplicación que serán utilizados para mostrar contenido en la interfaz.
   */
  TEXTOS = TEXTOS;

  /**
   * Lista de tipos de documentos obtenidos del catálogo.
   */
  tiposDocumentos: Catalogo[] = [];

  /**
   * Clase CSS para definir el tipo de alerta.
   * Valor predeterminado: 'alert-info'.
   */
  infoAlert = 'alert-info';

  /**
   * Catálogo completo de documentos disponibles.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * ReplaySubject para manejar la finalización de las suscripciones.
   */
  private destroyed$ = new ReplaySubject<void>(1);

  /**
   * Constructor de PasoDosComponent.
   * @param catalogosServices Servicio para interactuar con los catálogos.
   */
  constructor(private catalogosServices: CatalogosService) {}

  /**
   * Ciclo de vida de Angular: ngOnInit.
   * Se ejecuta al inicializar el componente.
   * Obtiene los tipos de documentos y establece documentos preseleccionados.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * Obtiene los tipos de documentos disponibles para el trámite desde el catálogo.
   * Actualiza la propiedad `catalogoDocumentos` con los datos obtenidos.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroyed$)) // Finaliza la suscripción al destruir el componente
      .subscribe({
        next: (respuesta): void => {
          if (respuesta.length > 0) {
            this.catalogoDocumentos = respuesta;
          }
        },
      });
  }

  /**
   * Ciclo de vida de Angular: ngOnDestroy.
   * Se ejecuta al destruir el componente.
   * Emite un valor para completar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(); // Emite un valor para finalizar las suscripciones
    this.destroyed$.complete(); // Completa el ReplaySubject
  }
}