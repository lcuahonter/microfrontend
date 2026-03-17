import {
  CATALOGOS_ID,
  Catalogo,
  CatalogosService,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TEXTOS_REQUISITOS } from '../../constants/destinados-donacio.enum';


@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  
  /**
    * Texto que contiene los requisitos y mensajes informativos.
    * @type {string}
    */
  TEXTOS = TEXTOS_REQUISITOS;

  /**
   * Lista de tipos de documentos disponibles.
   * @type {Catalogo[]}
   */
  tiposDocumentos: Catalogo[] = [];

  /**
   * Clase CSS para estilizar alertas informativas.
   * @type {string}
   */
  infoAlert = 'alert-info';

  /**
   * Catálogo completo de documentos disponibles.
   * @type {Catalogo[]}
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Documentos seleccionados por el usuario.
   * @type {Catalogo[]}
   */
  documentosSeleccionados: Catalogo[] = [];

  /**
   * Subject utilizado para manejar la destrucción de observables.
   * @type {Subject<void>}
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor que inyecta el servicio de catálogos.
   * @constructor
   * @param {CatalogosService} catalogosServices - Servicio para obtener catálogos
   */
  constructor(private catalogosServices: CatalogosService) { 
        // No se necesita lógica de inicialización adicional.
  }

  /**
   * Método del ciclo de vida OnInit de Angular.
   * Inicializa los datos del componente:
   * @method ngOnInit
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * Obtiene el catálogo de tipos de documentos disponibles para el trámite.
   * Se suscribe al servicio de catálogos y maneja la respuesta.
   * @method getTiposDocumentos
   */
  getTiposDocumentos(): void {
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
   * Método del ciclo de vida OnDestroy de Angular.
   * Limpia las suscripciones activas:
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
