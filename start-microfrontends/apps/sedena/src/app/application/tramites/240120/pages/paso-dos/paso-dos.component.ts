import {
  AlertComponent,
  AnexarDocumentosComponent,
  CATALOGOS_ID,
  Catalogo,
  CatalogosService,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TEXTOS_REQUISITOS } from '../../constants/importacion-armas-municiones.enum';

/**
 * @componente PasoDosComponent
 * @descripción Componente responsable de gestionar el segundo paso del procedimiento.
 * Maneja los requisitos de documentos, recupera datos de catálogos y administra las selecciones del usuario.
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [
    CommonModule,
    AlertComponent,
    TituloComponent,
    AnexarDocumentosComponent,
  ],
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * @propiedad TEXTOS
   * @descripción Contiene textos estáticos utilizados en este paso del formulario.
   * @tipo {typeof TEXTOS_REQUISITOS}
   */
  public TEXTOS = TEXTOS_REQUISITOS;

  /**
   * @propiedad tiposDocumentos
   * @descripción Espacio reservado local para los tipos de documentos utilizados en este paso.
   * @tipo {Catalogo[]}
   */
  public tiposDocumentos: Catalogo[] = [];

  /**
   * @propiedad infoAlert
   * @descripción Tipo de alerta de Bootstrap utilizada para mensajes informativos.
   * @tipo {string}
   */
  public infoAlert = 'alert-info';

  /**
   * @propiedad catalogoDocumentos
   * @descripción Contiene el catálogo de tipos de documentos recuperado de la API.
   * @tipo {Catalogo[]}
   */
  public catalogoDocumentos: Catalogo[] = [];

  /**
   * @propiedad documentosSeleccionados
   * @descripción Lista de documentos seleccionados por el usuario.
   * @tipo {Catalogo[]}
   */
  public documentosSeleccionados: Catalogo[] = [];

  /**
   * @propiedad destroyNotifier$
   * @descripción Notificador utilizado para cancelar suscripciones a observables cuando el componente es destruido.
   * Previene fugas de memoria.
   * @tipo {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @param catalogosServices Servicio para recuperar datos de catálogos necesarios en el formulario.
   */
  constructor(private catalogosServices: CatalogosService) {
   // Las dependencias se inyectan aquí. No se necesita lógica de inicialización.
  }

  /**
   * @método ngOnInit
   * @descripción Hook del ciclo de vida de Angular que se activa al inicializar el componente.
   * Inicia la recuperación de los tipos de documentos.
   * @retorna {void}
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * @método getTiposDocumentos
   * @descripción Recupera el catálogo de tipos de documentos para el procedimiento.
   * Actualiza la lista `catalogoDocumentos` si la operación es exitosa.
   * @retorna {void}
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
   * @método ngOnDestroy
   * @descripción Hook del ciclo de vida de Angular que se activa justo antes de que el componente sea destruido.
   * Limpia las suscripciones activas para prevenir fugas de memoria.
   * @retorna {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
