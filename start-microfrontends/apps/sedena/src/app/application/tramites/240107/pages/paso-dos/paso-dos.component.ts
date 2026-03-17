/**
 * @component PasoDosComponent
 * @description Este componente es responsable de manejar el segundo paso del trámite.
 * Incluye la lógica para obtener y gestionar los tipos de documentos y los documentos seleccionados.
 * 
 * @import { Component } from '@angular/core';
 * @import { TEXTOS } from 'libs/shared/data-access-user/src/tramites/constantes/servicios-extraordinarios.enum';
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Catalogo, TEXTOS, Usuario } from '@ng-mf/data-access-user';
import { Tramite240107Query } from '../../estados/tramite240107Query.query';
import { TEXTOS_REQUISITOS } from '../../constantes/sustancias-quimicas.enum';
import { map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrls: ['./paso-dos.component.scss'],
})
export class PasoDosComponent {

  /**
   * Indica si el formulario se encuentra en modo prellenado.
   * Se inicializa en `false` y se activa cuando existen datos previos
   * que deben cargarse automáticamente.
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
   * Se recibe desde el componente padre.
   */
  @Input() idSolicitud!: string;

  /**
   * Identificador del tipo de trámite asociado a la solicitud.
   * Se recibe desde el componente padre.
   */
  @Input() idTipoTRamite!: string;

  /**
   * Información del usuario asociada a la solicitud.
   * Se recibe desde el componente padre para su uso en el componente.
   */
  @Input() datosUsuario!: Usuario;

  /**
   * Emite el estado de la carga en progreso hacia el componente padre.
   */
  @Output() cargaEnProgresoChange = new EventEmitter<boolean>();

  /**
   * Evento que indica si existen documentos para cargar,
   * utilizado para habilitar o deshabilitar el botón
   * "Cargar Archivos" en <solicitud-page>.
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
   * Textos estáticos utilizados en el paso de carga de documentos.
   */
  public TEXTOS = TEXTOS_REQUISITOS;

  /**
   * Lista local de tipos de documentos utilizados en este paso.
   */
  public tiposDocumentos: Catalogo[] = [];

  /**
   * Tipo de alerta Bootstrap utilizada para mensajes informativos.
   */
  public infoAlert: string = 'alert-info';

  /**
   * Catálogo de tipos de documentos obtenido desde el API.
   */
  public catalogoDocumentos: Catalogo[] = [];

  /**
   * Lista de documentos seleccionados por el usuario.
   */
  public documentosSeleccionados: Catalogo[] = [];

  /**
   * Evento interno que reenvía la solicitud de carga de documentos.
   */
  reenviarEvento = new EventEmitter<void>();

  /**
   * Subject utilizado para cancelar suscripciones activas
   * al destruir el componente y prevenir memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param tramiteQuery Servicio para obtener el estado actual del trámite.
   */
  constructor(private tramiteQuery: Tramite240107Query) { }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Escucha el evento de carga de archivos y actualiza los textos
   * con el identificador de la solicitud.
   */
  ngOnInit(): void {
    this.cargaArchivosEvento
      .pipe(
        takeUntil(this.destroyNotifier$),
        map(() => {
          this.reenviarEvento.emit();
        })
      )
      .subscribe();

    const idSolicitud = this.tramiteQuery.getValue().idSolicitud;
    this.TEXTOS = TEXTOS_REQUISITOS.replace(
      '[ID_SOLICITUD]',
      idSolicitud ? idSolicitud.toString() : '------'
    );
  }

  /**
   * Hook del ciclo de vida que se ejecuta antes de destruir el componente.
   * Finaliza todas las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Maneja el evento que indica si existen documentos para cargar.
   * @param existenDocumentosParaCargar Indica si hay documentos pendientes.
   */
  manejarEventoCargaDocumento(existenDocumentosParaCargar: boolean): void {
    this.reenviarEventoCarga.emit(existenDocumentosParaCargar);
  }

  /**
   * Actualiza el estado de carga de documentos y notifica al componente padre.
   * @param cargaRealizada Indica si la carga se completó correctamente.
   */
  documentosCargados(cargaRealizada: boolean): void {
    this.cargaRealizada = cargaRealizada;
    this.reenviarCargaRealizada.emit(this.cargaRealizada);
  }

  /**
   * Maneja el evento de carga en progreso emitido por un componente hijo.
   * @param carga Indica si la carga sigue en progreso.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
    this.cargaEnProgresoChange.emit(this.cargaEnProgreso);
  }
}