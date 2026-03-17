import { AlertComponent, TEXTOS, TituloComponent ,CargaDocumentoComponent } from "@ng-mf/data-access-user";
import { Component, OnDestroy, OnInit ,EventEmitter ,Output,Input  } from '@angular/core';
import { Subject, takeUntil ,map } from 'rxjs';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogosService ,Usuario } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import documentList from '@libs/shared/theme/assets/json/32301/document-list.json';
import { Tramite32301Store } from '../../estados/tramite32301.store';

@Component({
  selector: 'app-paso-dos', // Selector del componente
  standalone: true, // El componente es independiente, sin necesidad de un módulo externo
  imports: [CommonModule, ReactiveFormsModule, AnexarDocumentosComponent, TituloComponent, AlertComponent ,CargaDocumentoComponent], // Importación de otros componentes y módulos
  templateUrl: './paso-dos.component.html', // Ruta al archivo HTML
  styleUrl: './paso-dos.component.css', // Ruta al archivo de estilos CSS
})
export class PasoDosComponent implements OnInit, OnDestroy {
  TEXTOS = TEXTOS; // Constantes de textos definidas en otro lugar
  
  tiposDocumentos: Catalogo[] = []; // Lista de tipos de documentos
  infoAlert = 'alert-info'; // Clase CSS para mostrar alertas de información
  catalogoDocumentos: Catalogo[] = []; // Catálogo de documentos
  documentosSeleccionados = documentList?.documentosSeleccionados; // Lista de documentos seleccionados desde un archivo JSON
  public destroy$: Subject<void> = new Subject<void>(); // Sujeto para manejar el ciclo de vida y evitar fugas de memoria

  mensajeCamposObligatorios: string = '* Campos obligatorios';

  @Input() idTipoTRamite!: string;
  @Input() datosUsuario!: Usuario;
  @Output() reenviarEventoCarga = new EventEmitter<boolean>();
  @Output() reenviarCargaRealizada = new EventEmitter<boolean>();
  @Output() continuarEvento = new EventEmitter<void>();
  @Input() cargaArchivosEvento!: EventEmitter<void>;
  public destroyed$: Subject<void> = new Subject();


  reenviarEvento = new EventEmitter<void>();
  cargaRealizada = false;
  idSolicitud: string = ''



  constructor(
    private catalogosServices: CatalogosService, // Servicio para obtener los catálogos
    private Tramite32301Store: Tramite32301Store
  ) { 
    // Constructor
  }

  /** Método para inicializar el componente */
  ngOnInit(): void {
    this.getTiposDocumentos(); // Llamada al servicio para obtener los tipos de documentos
     this.cargaArchivosEvento
      .pipe(
        takeUntil(this.destroyed$),
        map(() => {
          this.reenviarEvento.emit();
        })
      )
      .subscribe();

     this.idSolicitud = this.Tramite32301Store.getIdSolicitud()
  }

  /** Método para obtener los tipos de documentos desde el catálogo */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO) // Llamada al servicio para obtener el catálogo de tipos de documentos
      .pipe(takeUntil(this.destroy$)) // Suscripción con control de destrucción para evitar fugas de memoria
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp; // Asignar los tipos de documentos obtenidos
          }
        },
        error: (_error): void => {
          // Manejo de error
          console.error('Error al obtener los tipos de documentos', _error);
        },
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
  continuar(): void {
    this.continuarEvento.emit();
  }

  /** Método para limpiar los recursos al destruir el componente */
  ngOnDestroy(): void {
    this.destroy$.next(); // Emitir señal para completar la destrucción
    this.destroy$.complete(); // Completar el sujeto
  }
}
