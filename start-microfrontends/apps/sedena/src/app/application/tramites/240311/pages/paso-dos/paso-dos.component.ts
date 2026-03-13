import { CATALOGOS_ID, Usuario } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogosService } from '@ng-mf/data-access-user';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { map, Subject } from 'rxjs';
import { TEXTOS_REQUISITOS } from '../../constants/solicitude-de-artificios-pirotecnicos.enum';
import { takeUntil } from 'rxjs';
import { Tramite240311Query } from '../../estados/tramite240311Query.query';

/**
 * Componente responsable de gestionar el paso dos del trámite.
 * Se encarga de los requisitos de documentos, obtiene catálogos y administra la selección de documentos por el usuario.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {

  /**
   * Indica si el formulario se encuentra en modo prellenado.
   */
  esPrellenado: boolean = false;

  /**
* Evento interno que reenvía la solicitud de carga de documentos.
*/
  reenviarEvento = new EventEmitter<void>();

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

  /**
   * Indica si la carga de documentos se realizó correctamente.
   */
  cargaRealizada: boolean = false;

  /**
   * Indica si la carga del archivo se encuentra en progreso.
   */
  cargaEnProgreso: boolean = true;

  /**
   * Contiene los textos estáticos utilizados en este paso del formulario.
   */
  public TEXTOS = TEXTOS_REQUISITOS;

  /**
   * Arreglo local para los tipos de documentos utilizados en este paso.
   */
  public tiposDocumentos: Catalogo[] = [];

  /**
   * Tipo de alerta Bootstrap utilizada para mostrar mensajes informativos.
   */
  public infoAlert = 'alert-info';

  /**
   * Catálogo de tipos de documentos obtenido desde la API.
   */
  public catalogoDocumentos: Catalogo[] = [];

  /**
   * Lista de documentos seleccionados por el usuario.
   */
  public documentosSeleccionados: Catalogo[] = [];

  /**
   * Notificador utilizado para cancelar las suscripciones a observables cuando el componente se destruye.
   * Previene fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Servicio inyectado para obtener datos de catálogos desde el backend.
   * @param catalogosServices Servicio para obtener catálogos.
   */
  constructor(private catalogosServices: CatalogosService, private tramiteQuery: Tramite240311Query) {
    // Las dependencias se inyectan aquí. No se requiere lógica de inicialización.
  }

  /**
   * Hook de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Inicia la obtención de los tipos de documentos.
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
   * Obtiene el catálogo de tipos de documentos para el trámite.
   * Si la respuesta contiene elementos, actualiza la lista local de documentos.
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
   * Hook de ciclo de vida de Angular que se ejecuta justo antes de destruir el componente.
   * Limpia las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}