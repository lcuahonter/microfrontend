import {
  AlertComponent,
  AnexarDocumentosComponent,
  CATALOGOS_ID,
  Catalogo,
  CatalogosService,
  TituloComponent
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TEXTOS_REQUISITOS } from '../../constants/importacion-armas-municiones.enum';

/**
 * @component PasoDosComponent
 * @description
 * Componente responsable de gestionar el segundo paso del trámite, el cual corresponde al apartado de anexar documentos requeridos.
 * Consulta catálogos desde el backend, administra la selección de documentos y emite eventos al componente contenedor.
 *
 * @example
 * <app-paso-dos (reenviarEvento)="onReenviar()" (regresarSeccionCargarDocumentoEvento)="onRegresar()"></app-paso-dos>
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
  standalone: true,
  imports: [
    AlertComponent,
    TituloComponent,
    AnexarDocumentosComponent
  ],
})
export class PasoDosComponent implements OnInit, OnDestroy {

  /**
   * @property {typeof TEXTOS_REQUISITOS} TEXTOS
   * @description
   * Contiene los textos estáticos que se utilizan para mostrar los encabezados, subtítulos e instrucciones del paso dos.
   *
   * @memberof PasoDosComponent
   */
  public TEXTOS = TEXTOS_REQUISITOS;

  /**
   * @property {Catalogo[]} tiposDocumentos
   * @description
   * Almacén local de los tipos de documentos a mostrar o procesar.
   * 
   * @memberof PasoDosComponent
   */
  public tiposDocumentos: Catalogo[] = [];

  /**
   * @property {string} infoAlert
   * @description
   * Tipo de alerta visual utilizada en el componente (ej. alert-info, alert-warning).
   * 
   * @memberof PasoDosComponent
   */
  public infoAlert = 'alert-info';

  /**
   * @property {Catalogo[]} catalogoDocumentos
   * @description
   * Catálogo completo de tipos de documentos requeridos para el trámite.
   * 
   * @memberof PasoDosComponent
   */
  public catalogoDocumentos: Catalogo[] = [];

  /**
   * @property {Catalogo[]} documentosSeleccionados
   * @description
   * Lista de documentos que el usuario ha seleccionado y anexado.
   * 
   * @memberof PasoDosComponent
   */
  public documentosSeleccionados: Catalogo[] = [];

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Notificador utilizado para destruir las suscripciones activas al momento de destruir el componente,
   * evitando fugas de memoria.
   *
   * @memberof PasoDosComponent
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @output reenviarEvento
   * @description
   * Evento emitido al contenedor cuando se desea reenviar los documentos o continuar con el flujo.
   *
   * @memberof PasoDosComponent
   */
  @Output() reenviarEvento = new EventEmitter<void>();

  /**
   * @output regresarSeccionCargarDocumentoEvento
   * @description
   * Evento emitido para indicar al contenedor que se desea regresar a la sección de carga de documentos.
   *
   * @memberof PasoDosComponent
   */
  @Output() regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();

  /**
   * @constructor
   * @param {CatalogosService} catalogosServices
   * Servicio inyectado para consultar los catálogos de tipos de documentos.
   *
   * @memberof PasoDosComponent
   */
  constructor(private catalogosServices: CatalogosService) {}

  /**
   * @method ngOnInit
   * @description
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Se encarga de consultar los tipos de documentos necesarios para el trámite.
   *
   * @returns {void}
   * @memberof PasoDosComponent
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * @method getTiposDocumentos
   * @description
   * Consulta el catálogo de tipos de documentos desde el backend usando el servicio correspondiente.
   * Si la respuesta es válida, actualiza la propiedad `catalogoDocumentos` con los valores obtenidos.
   *
   * @returns {void}
   * @memberof PasoDosComponent
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
   * @description
   * Hook del ciclo de vida que se ejecuta justo antes de que el componente sea destruido.
   * Se encarga de cancelar las suscripciones activas para evitar fugas de memoria.
   *
   * @returns {void}
   * @memberof PasoDosComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
