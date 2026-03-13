import {CATALOGOS_ID, Catalogo, CatalogosService, TEXTOS } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventEmitter, Output, forwardRef } from '@angular/core';
import { Subject, takeUntil, map } from 'rxjs';
import { Usuario, AlertComponent } from '@libs/shared/data-access-user/src';
import { CargaDocumentoComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { Tramite32502Query } from '../../../../estados/queries/tramite32502.query';
import { Tramite32502Store, Solicitud32502State } from '../../../../estados/tramites/tramite32502.store';

/**
 * Este componente se muestra en PasoDos
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    forwardRef(() => CargaDocumentoComponent),
  ]
})
export class PasoDosComponent implements OnInit, OnDestroy {
  TEXTOS = TEXTOS;

  tiposDocumentos: Catalogo[] = [];
  infoAlert = 'alert-info';
  catalogoDocumentos: Catalogo[] = [];
  // documentosSeleccionados = documentList.documentosSeleccionados;
  private destroy$: Subject<void> = new Subject<void>();

   /**
   * Evento que se emite para regresar a la sección de carga de documentos.
   * Este evento se utiliza para notificar a otros componentes que se debe regresar a la sección de carga de documentos.
   */
  @Output() reenviarRegresarSeccion = new EventEmitter<void>();

  /** Evento para disparar la carga de archivos */
  cargaArchivosEvento = new EventEmitter<void>();

  /** ID trámite */
  idTipoTramite: string = '32502';
  /**
   * ID de la solicitud actual.
   */
  idSolicitud!: string;

  /** Datos del usuario para la carga de documentos */
  datosUsuario!: Usuario;

  /** Carga del progreso del archivo */
  cargaEnProgreso: boolean = true;

  /**
   * Indica si la carga de documentos se realizó correctamente.
   * @type {boolean}
   */
  cargaRealizada = false;

    /**
   * Evento que se emite para indicar si la carga de documentos se ha realizado.
   * Este evento se utiliza para notificar a otros componentes que la carga de documentos ha finalizado.
   */
  @Output() reenviarCargaRealizada = new EventEmitter<boolean>();

  /**
   * Evento que se emite para reenviar la solicitud de carga de documentos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de carga de documentos.
   */
  @Output() reenviarEvento = new EventEmitter<void>();
  
  /**
   * Evento que se emite para indicar si existen documentos para cargar, y así activar el botón de "Cargar Archivos en <solicitud-page>".
   * Este evento se utiliza para habilitar o deshabilitar el botón de carga de archivos en <solicitud-page>.
   */
  @Output() reenviarEventoCarga = new EventEmitter<boolean>();

    /** Estatus para activar botón de carga */
  activarBotonCargaArchivos = false;

  /** Emite un boleano sobre la carga del archivo */
  @Output() cargaEnProgresoChange = new EventEmitter<boolean>();

  /**
   * Subject para destruir notificador.
   */
  public destroyed$: Subject<void> = new Subject();

  /**
   * Estado de la solicitud 32501.
   */
  solicitud32502State: Solicitud32502State = {} as Solicitud32502State;

  constructor(
    public tramite32502Store: Tramite32502Store,
    public tramite32502Query: Tramite32502Query,
  ) { 
    // Constructor
  }

  ngOnInit(): void {
    this.obtenerValoresDelStore();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Método público que dispara el evento de carga de archivos.
   * Permite que el componente padre active la carga de documentos.
   * @public
   */
  public confirmarCargaArchivos(): void {
        this.cargaArchivosEvento.emit();
  }

    /**
  * Método para manejar el evento de carga de documentos.
  * Actualiza el estado del botón de carga de archivos.
  *  carga - Indica si la carga de documentos está activa o no.
  * {void} No retorna ningún valor.
  */
  actualizarEstadoBotonCargarArchivos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }


  /**
   * Obtiene los valores del store `solicitud32501Query` y actualiza el estado
   * `solicitud32501State` con la respuesta obtenida.
   *
   * Utiliza el operador `takeUntil` para asegurarse de que la suscripción se cancele
   * cuando el componente sea destruido, evitando fugas de memoria.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  obtenerValoresDelStore(): void {
    this.tramite32502Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((respuesta: Solicitud32502State) => {
          this.solicitud32502State = respuesta;
          this.idSolicitud = respuesta.idSolicitud.toString();
          this.datosUsuario = this.datosUsuarioStore(respuesta);
        })
      )
      .subscribe();
  }


  private datosUsuarioStore(solicitud32502State: Solicitud32502State): Usuario {

    return {
      persona: {
        claveUsuario: solicitud32502State.solicitante.rfc,
        rfc: solicitud32502State.solicitante.rfc,
        nombre: solicitud32502State.solicitante.denominacion,
        apellidoPaterno: '',
        apellidoMaterno: '',
      },
      firmaElectronica: {
        cadenaOriginal: '',
        certificado: '',
        firma: '',
      },
      rolActual: 'PersonaMoral',
      rfcSolicitante: solicitud32502State.solicitante.rfc,
      idSolicitud: solicitud32502State.idSolicitud,
      referenciaSolicitud: '',
    }
  }


  /**
   * Actualiza el estado de carga de documentos y emite un evento con el nuevo valor.
   * @param cargaRealizada Indica si la carga de documentos se realizó correctamente.
   * @returns void
   */
  documentosCargados(cargaRealizada: boolean): void {
    this.cargaRealizada = cargaRealizada;
    this.reenviarCargaRealizada.emit(this.cargaRealizada);
  }

  /**
   * Maneja el evento de carga en progreso emitido por un componente hijo.
   * Actualiza el estado de cargaEnProgreso según el valor recibido.
   * @param carga Valor booleano que indica si la carga está en progreso.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
    this.cargaEnProgresoChange.emit(this.cargaEnProgreso);
  }
}