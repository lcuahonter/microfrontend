import { AlertComponent } from "@libs/shared/data-access-user/src";
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogosService } from '@ng-mf/data-access-user';
import { CommonModule } from "@angular/common";
import { Component } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TEXTOS } from '@ng-mf/data-access-user';
import { TituloComponent } from "@libs/shared/data-access-user/src";
import { takeUntil } from 'rxjs';

/**
 * Componente que representa el paso dos del formulario o proceso.
 * Se encarga de mostrar y gestionar los tipos de documentos requeridos.
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
  /** Constante de textos reutilizables */
  TEXTOS = TEXTOS;

  /** Lista de tipos de documentos disponibles (catálogo) */
  tiposDocumentos: Catalogo[] = [];

  /** Clase CSS para mostrar información en un alert */
  infoAlert = 'alert-info';

  /** Catálogo de documentos cargado desde el servicio */
  catalogoDocumentos: Catalogo[] = [];

  /** Observable para manejar la destrucción de suscripciones */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Constructor del componente.
   * @param catalogosServices Servicio para obtener los catálogos
   */
  constructor(
   public catalogosServices: CatalogosService,
  ) { 
    // Constructor vacío
  }

  /**
   * Método de inicialización del componente.
   * Se llama automáticamente cuando el componente es cargado.
   * @returns void
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * Método que se llama cuando el componente es destruido.
   * Libera las suscripciones activas para evitar fugas de memoria.
   * @returns void
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Obtiene el catálogo de tipos de documentos disponibles para el trámite.
   * El resultado se guarda en la propiedad `catalogoDocumentos`.
   * @returns void
   */
  getTiposDocumentos(): void {
      this.catalogosServices
        .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (resp: Catalogo[]) => {
            this.catalogoDocumentos = resp;
          }
        );
    }
}
