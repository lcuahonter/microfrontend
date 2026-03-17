import { Component, EventEmitter,Output } from '@angular/core';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogosService } from '@ng-mf/data-access-user';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TEXTOS_REQUISITOS } from '../../constants/exportacion-sustancias-quimicas.enum';
import { takeUntil } from 'rxjs';

/**
 * @component PasoDosComponent
 * @description Componente responsable de gestionar el segundo paso del trámite.
 * Maneja los requisitos de documentos, obtiene los datos del catálogo y gestiona las selecciones del usuario.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
/**
 * Evento que se emite para solicitar el reenvío de información o acción relacionada en el paso dos del trámite.
 *
 * @event reenviarEvento
 * @type {EventEmitter<void>}
 * @memberof PasoDosComponent
 * @description
 * Este evento notifica al componente padre que se debe realizar una acción de reenvío, como reenviar documentos o información.
 */
@Output() reenviarEvento = new EventEmitter<void>();

/**
 * Evento que se emite para regresar a la sección de carga de documentos.
 *
 * @event regresarSeccionCargarDocumentoEvento
 * @type {EventEmitter<void>}
 * @memberof PasoDosComponent
 * @description
 * Este evento notifica al componente padre que el usuario desea regresar a la sección de carga de documentos.
 */
@Output() regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();

/**
   * @property TEXTOS
   * @description Contiene los textos literales estáticos utilizados en este paso del formulario.
   * @type {typeof TEXTOS_REQUISITOS}
   */
  public TEXTOS = TEXTOS_REQUISITOS;

  /**
   * @property tiposDocumentos
   * @description Marcador local para los tipos de documentos utilizados en este paso.
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
   * @description Contiene el catálogo de tipos de documentos obtenido de la API.
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
   * @description Notificador utilizado para desuscribirse de los observables cuando el componente es destruido.
   * Previene fugas de memoria.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @param catalogosServices Servicio para obtener los datos del catálogo necesarios en el formulario.
   */
  constructor(private catalogosServices: CatalogosService) {
    // Las dependencias se inyectan aquí. No se necesita lógica de inicialización.
  }

  /**
   * @method ngOnInit
   * @description Hook del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Inicia la obtención de los tipos de documentos.
   * @returns {void}
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * @method getTiposDocumentos
   * @description Obtiene el catálogo de tipos de documentos para el trámite.
   * Actualiza la lista `catalogoDocumentos` si la respuesta es exitosa.
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
   * @description Hook del ciclo de vida de Angular que se ejecuta justo antes de que el componente sea destruido.
   * Limpia las suscripciones activas para prevenir fugas de memoria.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
