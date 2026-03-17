import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { CATALOGOS_ID, Usuario } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogosService } from '@ng-mf/data-access-user';

import { map, Subject } from 'rxjs';
import { takeUntil } from 'rxjs';

import { TEXTOS_REQUISITOS } from '../../constants/permiso-ordinario-importacion-substancias-quimicas.enum';
import { Tramite240305Query } from '../../estados/tramite240305Query.query';

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
  /* =======================
  * Inputs / Outputs
  * ======================= */

  /**
   * Indica si el formulario se encuentra en modo prellenado.
   */
  esPrellenado: boolean = false;

  /**
   * Evento que notifica al componente padre que se debe
   * regresar a la sección anterior.
   */
  @Output() reenviarRegresarSeccion = new EventEmitter<void>();

  /**
   * Evento recibido desde <solicitud-page> para iniciar
   * la carga de documentos.
   */
  @Input() cargaArchivosEvento!: EventEmitter<void>;

  /**
   * Identificador único de la solicitud.
   */
  @Input() idSolicitud!: string;

  /**
   * Identificador del tipo de trámite asociado a la solicitud.
   */
  @Input() idTipoTRamite!: string;

  /**
   * Información del usuario asociada a la solicitud.
   */
  @Input() datosUsuario!: Usuario;

  /**
   * Emite el estado de la carga en progreso.
   */
  @Output() cargaEnProgresoChange = new EventEmitter<boolean>();

  /**
   * Evento que indica si existen documentos para cargar.
   */
  @Output() reenviarEventoCarga = new EventEmitter<boolean>();

  /**
   * Evento que notifica que la carga de documentos ha finalizado.
   */
  @Output() reenviarCargaRealizada = new EventEmitter<boolean>();


  /* =======================
   * Propiedades públicas
   * ======================= */

  /**
   * Indica si la carga de documentos se realizó correctamente.
   */
  cargaRealizada: boolean = false;

  /**
   * Indica si la carga del archivo se encuentra en progreso.
   */
  cargaEnProgreso: boolean = true;

  /**
 * Evento que se emite cuando el usuario desea reenviar la solicitud actual.
 * Usado comúnmente para repetir el proceso de carga o verificación.
 */
  @Output() reenviarEvento = new EventEmitter<void>();

  /**
 * Evento que se emite cuando el usuario desea regresar a la sección de carga de documentos.
 * Ideal para permitir correcciones o ajustes en documentos previamente cargados.
 */
  @Output() regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();

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
  constructor(private catalogosServices: CatalogosService, private tramiteQuery: Tramite240305Query) {
    // Dependencies are injected here. No initialization logic needed.
  }

  /**
   * @method ngOnInit
   * @description Hook del ciclo de vida de Angular que se activa al inicializar el componente.
   * Inicia la recuperación de los tipos de documentos.
   * @returns {void}
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
    this.cargaArchivosEvento
      .pipe(
        takeUntil(this.destroyNotifier$),
        map(() => this.reenviarEvento.emit())
      )
      .subscribe();

    const idSolicitud = this.tramiteQuery.getValue().idSolicitud;
    this.TEXTOS = TEXTOS_REQUISITOS.replace(
      '[ID_SOLICITUD]',
      idSolicitud ? idSolicitud.toString() : '------'
    );
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
  * Maneja el evento que indica si existen documentos para cargar.
  */
  manejarEventoCargaDocumento(existenDocumentosParaCargar: boolean): void {
    this.reenviarEventoCarga.emit(existenDocumentosParaCargar);
  }

  /**
   * Actualiza el estado de carga de documentos.
   */
  documentosCargados(cargaRealizada: boolean): void {
    this.cargaRealizada = cargaRealizada;
    this.reenviarCargaRealizada.emit(this.cargaRealizada);
  }

  /**
   * Maneja el evento de carga en progreso emitido por un componente hijo.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
    this.cargaEnProgresoChange.emit(this.cargaEnProgreso);
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
