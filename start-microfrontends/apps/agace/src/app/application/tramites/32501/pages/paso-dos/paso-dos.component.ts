import {
  AlertComponent,
  CargaDocumentoComponent,
  Notificacion,
  TituloComponent,
  Usuario,
} from '@libs/shared/data-access-user/src';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { Component,   EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  forwardRef, } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { map } from 'rxjs';
import { TEXTOS } from '@ng-mf/data-access-user';
import { takeUntil } from 'rxjs';

import { Solicitud32501State, Solicitud32501Store } from '../../estados/solicitud32501.store';
import { Solicitud32501Query } from '../../estados/solicitud32501.query';

/**
 * Componente PasoDosComponent que representa el segundo paso del trámite 32501.
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    forwardRef(() => CargaDocumentoComponent),
  ],
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
/**
 * Clase PasoDosComponent encargada de manejar la lógica y vista del segundo paso del trámite 32501.
 */
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * @description Constante que contiene los textos utilizados en el componente.
   */
  TEXTOS = TEXTOS;

  /**
   * Subject para destruir notificador.
   */
  public destroyed$: Subject<void> = new Subject();
  
  /** Sujeto para manejar la destrucción del componente y cancelar suscripciones */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Evento para disparar la carga de archivos */
  cargaArchivosEvento = new EventEmitter<void>();

   /**
   * Evento que se emite para regresar a la sección de carga de documentos.
   * Este evento se utiliza para notificar a otros componentes que se debe regresar a la sección de carga de documentos.
   */
  @Output() reenviarRegresarSeccion = new EventEmitter<void>();
  
  /**
   * Indica si la carga de documentos se realizó correctamente.
   * @type {boolean}
   */
  cargaRealizada = false;

  /** ID trámite */
  idTipoTramite: string = '32501';

  /**
   * ID de la solicitud actual.
   */
  idSolicitud!: string;

  /** Carga del progreso del archivo */
  cargaEnProgreso: boolean = true;

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

  /** Datos del usuario para la carga de documentos */
  datosUsuario!: Usuario;
 

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
   * Estado de la solicitud 32501.
   */
  solicitud32501State: Solicitud32501State = {} as Solicitud32501State;
  /**
   * @description Constructor del componente.
   * Se inyecta el servicio `CatalogosService` para obtener información desde el backend.
   * @param catalogosServices Servicio encargado de obtener los catálogos del sistema.
   * @param solicitud32501Store - Almacén para gestionar el estado de la solicitud 32501.
   * @param solicitud32501Query - Servicio para realizar consultas relacionadas con la solicitud 32501.
   */
  constructor(
    //private catalogosServices: CatalogosService,
    public solicitud32501Store: Solicitud32501Store,
    public solicitud32501Query: Solicitud32501Query,
  ) {
    // Si es necesario, se puede agregar aquí la lógica de inicialización
  }

  /**
   * @description Método del ciclo de vida de Angular que se ejecuta una vez que el componente ha sido inicializado.
   * Ideal para cargar datos necesarios al inicio del componente.
   * @returns {void}
   */
  ngOnInit(): void {

    this.obtenerValoresDelStore();
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
   * Maneja el evento de carga de documentos y emite un evento con el estado.
   * @param existenDocumentosParaCargar - Indica si hay documentos para cargar.
   * @returns void
   */
  manejarEventoCargaDocumento(existenDocumentosParaCargar: boolean): void {
    this.reenviarEventoCarga.emit(existenDocumentosParaCargar);
    this.activarBotonCargaArchivos = existenDocumentosParaCargar;
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
    this.solicitud32501Query.seleccionarSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((respuesta: Solicitud32501State) => {
          this.solicitud32501State = respuesta;
          this.idSolicitud = respuesta.idSolicitud.toString();
          this.datosUsuario = this.datosUsuarioStore(respuesta);
        })
      )
      .subscribe();
  }


  private datosUsuarioStore(solicitud32501State: Solicitud32501State): Usuario {

    return {
      persona: {
        claveUsuario: solicitud32501State.solicitante.rfc,
        rfc: solicitud32501State.solicitante.rfc,
        nombre: solicitud32501State.solicitante.denominacion,
        apellidoPaterno: '',
        apellidoMaterno: '',
      },
      firmaElectronica: {
        cadenaOriginal: '',
        certificado: '',
        firma: '',
      },
      rolActual: 'PersonaMoral',
      rfcSolicitante: solicitud32501State.solicitante.rfc,
      idSolicitud: solicitud32501State.idSolicitud,
      referenciaSolicitud: '',
    }
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
   * Método de ciclo de vida que se ejecuta al destruir el componente
   * Se encarga de completar el subject y cancelar las suscripciones activas
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
