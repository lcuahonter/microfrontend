import { ALERTA } from '../../enum/enum-701';

import { CategoriaMensaje, Notificacion, NotificacionesComponent, TituloComponent } from '@ng-mf/data-access-user';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Documentos701, Solicitud701State, Tramite701Store } from '../../estados/tramite/tramite701.store';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Catalogo } from '@ng-mf/data-access-user';
import { CodigoRespuesta } from '../../../../core/enums/aga-core-enum';
import { CommonModule } from '@angular/common';
import { DocumentoTabla } from '../../models/response/tipos-documentos-response.model';
import { PersonaUsuarioIdcService } from '../../service/persona-usuario-idc.service';
import { TiposDocumentosService } from '../../service/tipos-documentos.service';
import { Tramite701Query } from '../../estados/query/tramite701.query';

/**
 * Componente que representa el paso dos del trámite.
 */
@Component({
  selector: 'paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
  standalone: true,
  imports: [
    TituloComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NotificacionesComponent
  ],
})
export class PasoDosComponent implements OnInit, OnDestroy {
  
  /**
   * Emite eventos para mostrar/ocultar el título de carga.
   * true = mostrar, false = ocultar.
  */
  @Output() mostrarTituloCarga = new EventEmitter<boolean>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Catálogo de documentos disponibles.
   */
  public catalogoDocumentos: Catalogo[] = [];

  /**
   * **Subject para manejar la destrucción de suscripciones**
   *
   * - Se utiliza para cancelar las suscripciones activas cuando el componente o servicio es destruido.
   * - Evita fugas de memoria al asegurarse de que las suscripciones se cancelen correctamente.
   * - Se emite un valor en `ngOnDestroy` y luego se completa.
   *
   */
  private destroy$ = new Subject<void>();

  /**
   * Notificación actual que se muestra en el componente.
   *
   * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
   * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Formulario reactivo del componente.
   */
  public form!: FormGroup;

  /**
   * RFC del documento.
   */
  @Input() rfcDocumento!: string;

  /**
   * RFC del solicitante.
   */
  @Input() rfcSolicitante!: string;

  /**
   * Evento que emite los tipos de documentos seleccionados.
   */
  @Output() tiposDocumentoChange = new EventEmitter<number[]>();

  tiposDocumentoSeleccionados: number[] = [];

  /**
   * Documentos mostrados en la tabla del componente.
   */
  public documentosTabla: DocumentoTabla[] = [];

  /**
   * Contador para asignar IDs únicos a los documentos agregados a la tabla.
   */
  private contadorId = 1;

  /**
   * Estado de la solicitud del trámite 701.
   */
  public solicitudState!: Solicitud701State;

  /**
   * Indica si se deben seleccionar todos los documentos en la tabla.
   */
  seleccionarTodos = false;

  /**
   * Evento que emite una alerta cuando hay un error.
   */
  @Output() mostrarError = new EventEmitter<string>();

  /**
   * Evento que emite la alerta cuando no hay error.
   */
  @Output() limpiarError = new EventEmitter<void>();

  /**
   * Constructor del componente.
   * @param catalogosServices Servicio para obtener los catálogos.
   */
  constructor(
    private fb: FormBuilder,
    private tiposDocumentosService: TiposDocumentosService,
    private personaUsuarioIdcService: PersonaUsuarioIdcService,
    private tramite701Store: Tramite701Store,
    private tramite701Query: Tramite701Query,
  ) { }

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.form = this.fb.group({
      tipoDocumento: [null]
    });
    this.getTiposDocumentos();

    this.tramite701Query.selectSeccionState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      ).subscribe();

       this.mostrarTituloCarga.emit(true);
        this.documentosTabla = [...this.solicitudState.documentosGuardados];
  }

  /**
   * @method getTiposDocumentos
   * @description 
   * Obtiene el catálogo de los tipos de documentos disponibles para el trámite.
   */
  getTiposDocumentos(): void {
    this.tiposDocumentosService.getTiposDocumentos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO && response?.datos) {
            const DATOS = response.datos || [];
            this.catalogoDocumentos = DATOS.map((item) => ({
              id: Number(item.clave),
              descripcion: item.descripcion,
              clave: item.clave
            }));
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response?.error || 'Error tipos de documentos.',
              mensaje: response?.causa || response?.mensaje || 'Error tipos de documentos.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (err) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const MENSAJE = err?.error?.error || 'Error tipos de documentos.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
  }

  /**
   * Método para obtener los datos de la persona desde IDC.
   * @param doc 
   * @returns 
   */
  getPersonaUsuarioIDC(doc: DocumentoTabla): void {    
    if(doc.rfc.trim() === '') {
       doc.rfc = '';
      doc.razonSocial = '';
      return;
    }
    if (doc.rfc === this.rfcSolicitante) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'error',
        modo: 'action',
        titulo: '',
        mensaje: `El RFC de consulta [${doc.rfc}] no puede ser el mismo que el RFC del solicitante [${this.rfcSolicitante}].`,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      }
      doc.rfc = '';
      doc.razonSocial = '';
      return;
    }
    this.personaUsuarioIdcService.getPersonaUsuarioIDC(this.rfcSolicitante, doc.rfc)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO && response.datos?.nombre_completo) {
            doc.razonSocial = response.datos.nombre_completo;
            const INFODOC: Documentos701 = {
              cve_persona: response.datos.cve_persona,
              cve_doc: Number(doc.clave)
            };
            const DOCUMENTOS_ACTUALES = [...this.solicitudState.documentos];
            const INDEX = DOCUMENTOS_ACTUALES.findIndex(
              d => d.cve_doc === INFODOC.cve_doc
            );
            if (INDEX >= 0) {
              DOCUMENTOS_ACTUALES[INDEX] = INFODOC;
              this.tramite701Store.setDocumentos(DOCUMENTOS_ACTUALES);
            }
            this.tramite701Store.setDocumentos(DOCUMENTOS_ACTUALES);
          } else {
            doc.rfc = '';
            doc.razonSocial = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });

            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'error',
              modo: 'action',
              titulo: '',
              mensaje: response?.error || response?.mensaje || 'Error al consultar RFC.',
              cerrar: false,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
          }
        },
        error: (err) => {
          doc.rfc = ''; 
          doc.razonSocial = '';
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const MENSAJE = err?.error?.error || 'Error consulta de rfc.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
  }

  /**
   * Método para agregar un nuevo documento a la tabla.
   * @returns 
   */
  agregarNuevo(): void {
    const CLAVE = this.form.get('tipoDocumento')?.value;

    if (!CLAVE) {
      this.mostrarError.emit(ALERTA);
      return;
    }
 
    const DOCUMENTO = this.catalogoDocumentos.find(
      doc => doc.clave === CLAVE
    );

    if (!DOCUMENTO) {
      return;
    }
    if (this.tiposDocumentoSeleccionados.includes(CLAVE)) {
      return;
    }
       this.limpiarError.emit();
    this.tiposDocumentoSeleccionados.push(Number(CLAVE));

    this.documentosTabla.push({
      id: this.contadorId++,
      clave: CLAVE,
      tipoDocumento: DOCUMENTO.descripcion,
      rfc: '',
      razonSocial: '',
      seleccionado: false
    });

    const DOCUMENTOS_ACTUALES = [...this.solicitudState.documentos];

    
      DOCUMENTOS_ACTUALES.push({
        cve_doc: Number(CLAVE),
        cve_persona: null
      });

      this.tramite701Store.setDocumentos(DOCUMENTOS_ACTUALES);
    

    this.tiposDocumentoChange.emit(this.tiposDocumentoSeleccionados);
    this.form.get('tipoDocumento')?.reset();
  }

  /**
   * Elimina los documentos seleccionados de la tabla.
   */
  eliminarDocumento(): void {
    const DOCUMENTOS_ELIMINADOS = this.documentosTabla.filter(
      doc => doc.seleccionado
    );

    if (!DOCUMENTOS_ELIMINADOS.length) {
      return;
    }

    this.documentosTabla = this.documentosTabla.filter(
      doc => !doc.seleccionado
    );

    const CLAVES_ELIMINADAS = DOCUMENTOS_ELIMINADOS.map(doc => Number(doc.clave));

    // Actualizar el store de documentos
    const DOCUMENTOS_STORE = this.solicitudState.documentos.filter(
      d => !CLAVES_ELIMINADAS.includes(d.cve_doc)
    );

    this.tramite701Store.setDocumentos(DOCUMENTOS_STORE);
    this.tiposDocumentoSeleccionados = this.tiposDocumentoSeleccionados.filter(
      clave => !CLAVES_ELIMINADAS.includes(clave)
    );

    this.tiposDocumentoChange.emit(this.tiposDocumentoSeleccionados);
  }

  toggleSeleccionarTodos(): void {
    this.documentosTabla.forEach(doc => {
      doc.seleccionado = this.seleccionarTodos;
    });
  }

  /**
   * Método ngOnDestroy.
   * Se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.tramite701Store.setDocumentosGuardados(this.documentosTabla);
    this.destroy$.next();
    this.destroy$.complete();
  }
}