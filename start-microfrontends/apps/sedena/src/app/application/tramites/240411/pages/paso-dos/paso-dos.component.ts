import { Component } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';

import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogosService } from '@ng-mf/data-access-user';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';

import { TEXTOS_REQUISITOS } from '../../constants/solicitud-de-prorroga-importacion-material-explosivo.enum';

/**
 * @component PasoDosComponent
 * @description Componente responsable de gestionar el paso dos del procedimiento.
 * Maneja los requisitos de documentos, recupera datos de catálogos y administra las selecciones del usuario.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * @property TEXTOS
   * @description Contiene textos estáticos utilizados en este paso del formulario.
   * @type {typeof TEXTOS_REQUISITOS}
   */
  public TEXTOS = TEXTOS_REQUISITOS;

  /**
   * @property tiposDocumentos
   * @description Espacio reservado localmente para los tipos de documentos utilizados en este paso.
   * @type {Catalogo[]}
   */
  public tiposDocumentos: Catalogo[] = [];

  /**
   * @property infoAlert
   * @description Tipo de alerta de Bootstrap utilizada para mensajes informativos.
   * @type {string}
   */
  public infoAlert = 'alert-info';

  /**
   * @property catalogoDocumentos
   * @description Contiene el catálogo de tipos de documentos recuperado de la API.
   * @type {Catalogo[]}
   */
  public catalogoDocumentos: Catalogo[] = [];

  /**
   * @property documentosSeleccionados
   * @description Lista de documentos seleccionados por el usuario.
   * @type {Catalogo[]}
   */
  public documentosSeleccionados: Catalogo[] = [];

  /**
   * @property destroyNotifier$
   * @description Notificador utilizado para cancelar suscripciones activas cuando el componente se destruye.
   * Previene fugas de memoria.
   * @type {Subject<void>}
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
   * @method ngOnInit
   * @description Hook del ciclo de vida de Angular que se activa al inicializar el componente.
   * Inicia la recuperación de los tipos de documentos.
   * @returns {void}
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * @method getTiposDocumentos
   * @description Recupera el catálogo de tipos de documentos para el procedimiento.
   * Actualiza la lista `catalogoDocumentos` si la recuperación es exitosa.
   * @returns {void}
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
   * @method ngOnDestroy
   * @description Hook del ciclo de vida de Angular que se activa justo antes de destruir el componente.
   * Limpia las suscripciones activas para evitar fugas de memoria.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}