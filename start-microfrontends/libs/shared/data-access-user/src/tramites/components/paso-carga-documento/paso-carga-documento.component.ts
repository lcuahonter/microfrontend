// Update the import path to the correct location of catalogos.service.ts
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { REQUISITOS_OBLIGATORIOS_HTML, TEXTOS } from '../../../core/enums/constantes-alertas.enum';
import { Subject, map, takeUntil } from 'rxjs';
import { USUARIO_INFO, createUsuarioInfoWithSolicitud } from '../../../core/enums/usuario-info.enum';
import { AlertComponent } from '../../components/alert/alert.component';
import { CATALOGOS_ID } from '../../constantes/constantes';
import { CargaDocumentoComponent } from '../carga-documento/carga-documento.component';
import { Catalogo } from '../../../core/models/shared/catalogos.model';
import { CatalogosService } from '../../../core/services/shared/catalogos/catalogos.service';
import { CommonModule } from '@angular/common';
import { TituloComponent } from '../../components/titulo/titulo.component';
import { Usuario } from '../../../core/models/shared/cargar-documentos.model';

import { DocumentoRequerimiento } from '../../../core/models/iniciar-atender-requerimiento.model';
/**
 * Este componente se muestra en Paso Carga Documento
 */
@Component({
  selector: 'app-paso-carga-documento',
  templateUrl: './paso-carga-documento.component.html',
  styleUrl: './paso-carga-documento.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    CargaDocumentoComponent,
    AlertComponent,
    TituloComponent,
  ]
})
export class PasoCargaDocumentoComponent implements OnInit, OnDestroy, OnChanges {
  @Input() idSolicitud: number | null = null;

  /**
  * Constantes de textos utilizados en el componente.
  */
  TEXTOSINTRUCCIONES = TEXTOS;
  
  @Input() saltarTarjetaDeTituloParaConsulta: boolean = true;

  /**
   * Obtener el valor de la instrucción e inicializar la variable
   */
  get TEXTOS(): string {
    return `La solicitud ha quedado registrada con el número temporal [${this.idSolicitud}]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.`;
  }
  
  @Input() regresarSeccionCargarDocumentoEvento!: EventEmitter<void>;

  /**
 * Escucha el evento para cargar los documentos que se emite desde <solicitud-page>.
 * @type {EventEmitter<void>}
 */
  @Input() cargaArchivosEvento!: EventEmitter<void>;

  @Input() idTipoTRamite!: string;

  @Input() showInstrucciones!: boolean;

  /**
   * Indica si se debe mostrar el título opcional.
   * @type {boolean}
   */
  @Input() showTituloOpcional: boolean = true;

    /**
   * Indica si se debe mostrar el título opcional.
   * @type {boolean}
   */
  @Input() showTituloRequisitosObligatorios: boolean = false;
  /**
   * Contiene el HTML que representa los requisitos obligatorios para el trámite actual.
   * 
   * @remarks
   * Esta propiedad almacena una cadena HTML que se utiliza para mostrar los requisitos
   * obligatorios en la interfaz de usuario del componente.
   * 
   * @see REQUISITOS_OBLIGATORIOS_HTML
   */
  requisitosObligatoriosHtml = REQUISITOS_OBLIGATORIOS_HTML;
  /**
   * Evento que se emite para reenviar la solicitud de carga de documentos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de carga de documentos.
   */
  reenviarEvento = new EventEmitter<void>();

  /**
   * Evento que se emite para regresar a la sección de carga de documentos.
   * Este evento se utiliza para notificar a otros componentes que se debe regresar a la sección de carga de documentos.
   */
  reenviarRegresarSeccion = new EventEmitter<void>();

  /**
   * Clase CSS para la alerta de información.
   */
  infoAlert = 'alert-info';

  /**
   * Catálogo de documentos disponibles.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Documentos seleccionados por el usuario.
   */
  documentosSeleccionados: Catalogo[] = [];

  /**
   * Subject para destruir notificador.
   */
  public destroyed$: Subject<void> = new Subject();

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
 * Evento que se emite para indicar si existen documentos para cargar, y así activar el botón de "Cargar Archivos en <solicitud-page>".
 * Este evento se utiliza para habilitar o deshabilitar el botón de carga de archivos en <solicitud-page>.
 */
  @Output() reenviarEventoCarga = new EventEmitter<boolean>();

  /**
   * Servicio para gestionar los catálogos.
   */
  datosUsuario: Usuario = USUARIO_INFO;

  /** Carga progreso del archivo */
  @Output() cargaEnProgreso = new EventEmitter<boolean>();

  /** Documentos adicionales que pueden ser cargados */
  @Input() documentosAdicionales: DocumentoRequerimiento[] = [];

  /**
   * Evento que se emite cuando el catálogo de documentos obligatorios está en blanco.
   */
  @Output() enBlancoObligatoria = new EventEmitter<boolean>();

  /**
   * Constructor del componente.
   * 
   * @param catalogosServices Servicio para gestionar los catálogos.
   */
  constructor(
    private catalogosServices: CatalogosService,
  ) {
    // datosUsuario will be updated in ngOnChanges when idSolicitud is available
  }

  /**
   * Hook del ciclo de vida que se ejecuta cuando las propiedades de entrada cambian.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idSolicitud']) {
      this.actualizarDatosUsuario();
    }
  }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   */
  ngOnInit(): void {
    this.setInstrucciones();
    this.cargaArchivosEvento
      .pipe(
        takeUntil(this.destroyed$),
        map(() => {
          this.reenviarEvento.emit();
        })
      )
      .subscribe();
  }

setInstrucciones(): void {
  if (this.idTipoTRamite === '260216' || this.idTipoTRamite === '260217' || this.idTipoTRamite === '260214') {
    this.TEXTOSINTRUCCIONES = {
      ...TEXTOS,
      INSTRUCCIONES: TEXTOS.INSTRUCCIONES_AGREGAR_NUEVO
    };
  } else if (this.idTipoTRamite === '260514') {
    this.TEXTOSINTRUCCIONES = {
      ...TEXTOS,
      INSTRUCCIONES: TEXTOS.INSTRUCCIONES
    };
  } else {
    this.TEXTOSINTRUCCIONES = {
      ...TEXTOS,
      INSTRUCCIONES: TEXTOS.INSTRUCCIONES
    };
  }
}

  /**
   * Actualiza los datos del usuario con el idSolicitud actual.
   */
  private actualizarDatosUsuario(): void {
    this.datosUsuario = createUsuarioInfoWithSolicitud(this.idSolicitud);
  }

  /**
   * Obtiene el catalgoso de los tipos de documentos disponibles para el trámite.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        }
      });
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
  }

  /**
   * Maneja el evento de documentos obligatorios en blanco y emite un evento con el estado.
   * @param enBlanco - Indica si hay documentos obligatorios en blanco.
   * @returns void
   */
  blancoObligatoria(enBlanco: boolean): void {
    this.enBlancoObligatoria.emit(enBlanco);
  }

  /**
    * Se ejecuta al destruir el componente.
    * Emite un valor y completa el subject `destroyed$` para cancelar las suscripciones.
    */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso.emit(carga);
  }
}