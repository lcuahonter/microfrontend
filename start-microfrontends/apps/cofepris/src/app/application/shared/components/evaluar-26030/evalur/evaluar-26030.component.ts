import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  CategoriaMensaje,
  ConsultaCatalogoService,
  ConsultaioState,
  EncabezadoRequerimientoComponent,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
} from "@libs/shared/data-access-user/src";

import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from "@angular/core";

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { CodigoRespuesta } from "../../../../core/enum/cofepris-core-enum";
import { CommonModule } from "@angular/common";
import { EvaluarSolicitudService } from "../../../../core/services/evaluar-tramite/evaluar-solicitud.service";
import { OpinionData } from "../../../../core/models/evaluar/request/opciones-evaluacion.model";
import { RegistrarComponent } from "../registrar/registrar.component";
import { Router } from "@angular/router";

const MENSAJE_ERROR = {
  DEBE_SELECCIONAR_OPCION: "Debe seleccionar una opción para continuar.",
  DEBE_SOLICITAR_OPINION: "Debe solicitar al menos una opinión.",
  CLAVE_DUPLICADA: `<div class="alert alert-danger" role="alert">
  <div class="fw-semibold mb-2">
    <span class="me-2">⚠</span>
    Corrige los siguientes errores:
  </div>
  <div class="ms-4">
    Ya existe una solicitud de opinión para el área seleccionada.
  </div>
</div>
`,
  ERROR_INESPERADO: "Error inesperado al procesar la solicitud."
} as const;

@Component({
  selector: "app-evaluar-26030",
  standalone: true,
  imports: [
    CommonModule,
    EncabezadoRequerimientoComponent,
    FormsModule,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    AlertComponent,
    RegistrarComponent,
    NotificacionesComponent
  ],
  templateUrl: "./evaluar-26030.component.html",
  styleUrl: "./evaluar-26030.component.css",
})
export class Evaluar26030Component implements OnInit, AfterViewInit, OnDestroy {
  tableEmptyError = false;
  tableSelectionError = false;
  duplicateClaveError = false;
  private readonly destroy$ = new Subject<void>();
    @Output() refreshTabs = new EventEmitter<void>();

  private router = inject(Router);

  /* ================= INPUTS ================= */

  @Input() guardarDatos!: ConsultaioState;
  @Input() tramite!: number;

  /* ================= STATE ================= */

  sanitaryForm!: FormGroup;
  tabMover = false;
  showError = false;
  alerCheck = false;

  opcionSeleccionada: string | null = null;
  MENSAJE_DE_ERROR: string = MENSAJE_ERROR.DEBE_SELECCIONAR_OPCION;
  infoError = "alert-error";

  selectedOption: OpinionData[] = [];

  areaCatalog: Catalogo[] = [];
  
  private evaluarSolicitudService = inject(EvaluarSolicitudService);
  private fb = inject(FormBuilder);
  
  /** Nueva notificación a gestionar */
  nuevaNotificacion!: Notificacion;

  /** Pending action for confirmation */
  private pendingAction: 'delete' | null = null;

  claveConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: [
      {
        encabezado: "Área",
        clave: (e: OpinionData): string => e.areaObj|| e.cve_area_solicitante,
        orden: 1,
      },
      {
        encabezado: "Justificación",
        clave: (e: OpinionData): string => e.justificacion,
        orden: 2,
      },
      {
        encabezado: "Estado del requerimiento",
        clave: (e: OpinionData): string => e?.descripcion || e?.estado_opinion || "",
        orden: 3,
      },
    ],
    datos: [] as OpinionData[],
  };

  constructor(private catalogoService: ConsultaCatalogoService) {}

  /* ================= LIFECYCLE ================= */

  ngOnInit(): void {
    this.intalieCatalogos();
    this.createForm();
  }
  
  ngAfterViewInit(): void {
    this.sanitaryForm.patchValue({
      cve_area_solicitante: this.areaCatalog[0].clave
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ================= FORM ================= */

  private createForm(): void {
    this.sanitaryForm = this.fb.group({
      id_opinion: [null],
      num_folio_tramite: [""],
      ide_est_opinion: [""],
      estado_opinion: [""],
      tipo_opinion: [""],
      cve_area_solicitante: ["", Validators.required],
      id_dependencia: [""],
      fecha_creacion: [""],
      fecha_atencion: [""],
      fecha_solicitud: [""],
      fecha_generacion: [""],
      fecha_visita: [""],
      justificacion: ["", Validators.required],
      ide_sent_opinion: [""],
      sentido_opinion: [""],
      pais_opinante: [""],
      respuesta: [""],
      descripcion_opinion: [""],
      cve_usuario: [""]
    });
  }

  /* ================= VALIDATION ================= */

  /**
   * Checks if the selected clave already exists in the table
   * @returns true if duplicate exists, false otherwise
   */
  private isDuplicateClave(): boolean {
    const selectedClave = this.sanitaryForm.get('cve_area_solicitante')?.value;
    const currentEditingId = this.sanitaryForm.get('id_opinion')?.value;

    return this.claveConfig.datos.some(
      item => item.cve_area_solicitante === selectedClave && 
              item.id_opinion !== currentEditingId
    );
  }

  /**
   * Clears all error states
   */
  private clearAllErrors(): void {
    this.duplicateClaveError = false;
    this.tableEmptyError = false;
    this.tableSelectionError = false;
    this.alerCheck = false;
  }

  /* ================= ACTIONS ================= */

  continuar(): void {
    if (!this.opcionSeleccionada) {
      this.showError = true;
      return;
    }
    this.getEvaluacionTramite();
    this.showError = false;
    this.tabMover = true;
  }

  cancelar(): void {
    this.tabMover = false;
    this.limpiar();
    this.showError = false;
    this.clearAllErrors();
    this.selectedOption = [] as OpinionData[];
    this.claveConfig.datos = [] as OpinionData[];
    this.sanitaryForm.patchValue({
      cve_area_solicitante: this.areaCatalog[0].clave
    });
  }

  terminar(): void {
    this.clearAllErrors();
    
    if (!this.claveConfig.datos || this.claveConfig.datos.length === 0) {
      this.tableEmptyError = true;
      this.MENSAJE_DE_ERROR = MENSAJE_ERROR.DEBE_SOLICITAR_OPINION;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const REQUESTBODY = {
      id_accion: this.guardarDatos.action_id,
      clave_usuario: this.guardarDatos.current_user,
      opiniones: this.claveConfig.datos.map(opinion => ({
        id_opinion: opinion.id_opinion
      }))
    };

    this.evaluarSolicitudService
      .postSolicitarTramiteGuardar(
        this.tramite,
        this.guardarDatos.folioTramite,
        REQUESTBODY
      )
      .subscribe({
        next: (response: any) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.router.navigate(['bandeja-de-tareas-pendientes']);
          } else {
            this.showApiError(response);
          }
        },
        error: (error: any) => {
          this.showApiError(error?.error);
        }
      });
  }

  private showApiError(error: any): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.nuevaNotificacion = {
      tipoNotificacion: 'toastr',
      categoria: CategoriaMensaje.ERROR,
      modo: 'action',
      titulo: error?.error || 'Error',
      mensaje: error?.mensaje || MENSAJE_ERROR.ERROR_INESPERADO,
      cerrar: false,
      txtBtnAceptar: '',
      txtBtnCancelar: '',
    };
  }

  guardar(): void {
    this.clearAllErrors();

    if (this.sanitaryForm.invalid) {
      this.sanitaryForm.markAllAsTouched();
      return;
    }

    if (this.isDuplicateClave()) {
      this.duplicateClaveError = true;
      this.MENSAJE_DE_ERROR = MENSAJE_ERROR.CLAVE_DUPLICADA;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const DATA = {
      cve_area_solicitante: this.sanitaryForm.getRawValue().cve_area_solicitante,
      id_opinion: this.selectedOption[0]?.id_opinion || null,
      justificacion: this.sanitaryForm.getRawValue().justificacion,
      existe_visita_aga: false,
      existe_dictamen_central: false,
      id_solicitud: Number(this.guardarDatos.id_solicitud),
    };

    this.evaluarSolicitudService
      .postOpcionesEvaluacionAgregar(
        this.tramite,
        this.guardarDatos.folioTramite,
        DATA
      )
      .subscribe({
        next: (response: any) => {
        if (response.codigo === CodigoRespuesta.EXITO) {

  const DATA = this.areaCatalog.find(
    area => area.clave === response?.datos?.cve_area_solicitante
  );

  response.datos = {
    ...response.datos,
    areaObj: DATA ? DATA.descripcion : null
  };

  const INDEX = this.claveConfig.datos.findIndex(
    item => item.id_opinion === response?.datos?.id_opinion
  );

  if (INDEX !== -1) {
    // EDIT
    this.claveConfig.datos = this.claveConfig.datos.map((item, i) =>
      i === INDEX ? response.datos : item
    );
  } else {
    this.claveConfig.datos = [...this.claveConfig.datos, response.datos];
    this.refreshTabs.emit();
  }

  this.limpiar();
  this.clearAllErrors();

} else {
  this.showApiError(response);
}

        },
        error: (error: any) => {
          this.showApiError(error?.error);
        }
      });
  }

  /**
   * Step 1: Show confirmation popup FIRST (no API call yet)
   */
  eliminar(): void {
    if (!this.selectedOption || this.selectedOption.length === 0) {
      this.tableSelectionError = true;
       this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: CategoriaMensaje.ALERTA,
      modo: '',
      titulo: '',
      mensaje: 'Selecciona un registro',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
      tamanioModal: 'modal-md',
      alineacionBtonoCerrar: 'center',
      alineacionTexto: 'text-center'
    };
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Set pending action to track what we're confirming
    this.pendingAction = 'delete';

    // Show confirmation popup ONLY - no API call here
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: CategoriaMensaje.ALERTA,
      modo: '',
      titulo: 'Confirmar eliminación',
      mensaje: '¿Está seguro que desea eliminar la opinión seleccionada?',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
      tamanioModal: 'modal-md',
      alineacionBtonoCerrar: 'center',
      alineacionTexto: 'text-center'
    };
  }

  /**
   * Step 2: Handle user's response from popup
   * - If true (Aceptar clicked) -> call API to delete
   * - If false (Cancelar clicked) -> do nothing
   */
  onConfirmacionModal(confirmed: boolean): void {
    if (confirmed && this.pendingAction === 'delete') {
      // User clicked "Aceptar" - NOW call the API
      this.executeDelete();
    }
    // If confirmed is false, user clicked "Cancelar" - do nothing
    
    // Reset pending action
    this.pendingAction = null;
  }

  /**
   * Step 3: Execute API call only after user confirms
   */
  private executeDelete(): void {
    this.evaluarSolicitudService
      .deleteOpcionesEvaluacion(
        this.tramite, 
        this.selectedOption[0].id_opinion.toString()
      )
      .subscribe({
        next: (response: any) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            // Remove from table
            this.claveConfig.datos = this.claveConfig.datos.filter(
              item => item.id_opinion !== this.selectedOption[0].id_opinion
            );
            this.selectedOption = [] as OpinionData[];
            this.clearAllErrors();
            
            // Show success toast
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.EXITO,
              modo: 'action',
              titulo: 'Éxito',
              mensaje: 'La opinión ha sido eliminada correctamente.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          } else {
            this.showApiError(response);
          }
        },
        error: (error: any) => {
          this.showApiError(error?.error);
        }
      });
  }

  limpiar(): void {
    this.sanitaryForm.reset();
    this.sanitaryForm.markAsUntouched();
    this.sanitaryForm.patchValue({
      cve_area_solicitante: this.areaCatalog[0].clave
    });
    this.clearAllErrors();
  }

  editar(): void {
    if (!this.claveConfig.datos.length || this.selectedOption.length === 0) {
       this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: CategoriaMensaje.ALERTA,
      modo: '',
      titulo: '',
      mensaje: 'Selecciona un registro',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
      tamanioModal: 'modal-md',
      alineacionBtonoCerrar: 'center',
      alineacionTexto: 'text-center'
    };
      return;
    }
    this.sanitaryForm.patchValue(this.selectedOption[0]);
    this.clearAllErrors();
  }

  claveListaFn(event: any): void {
    this.selectedOption = event;
    this.tableSelectionError = false;
  }

  getEvaluacionTramite(): void {
    this.evaluarSolicitudService
      .getSolicitarTramite(this.tramite, this.guardarDatos.folioTramite)
      .subscribe({
        next: (response: any) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            const DATA= this.areaCatalog.find(
              area => area.clave === response?.datos?.opiniones?.cve_area_solicitante
            );
            response.datos.areaObj = DATA ? DATA.descripcion : null;
            this.claveConfig.datos = response?.datos?.opiniones || [];
            const opiniones = response?.datos?.opiniones || [];

this.claveConfig.datos = opiniones.map((opinion:any) => {
  const DATA = this.areaCatalog.find(
    area => area.clave === opinion?.cve_area_solicitante
  );

  return {
    ...opinion,
    areaObj: DATA ? DATA.descripcion : null
  };
});

          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error en iniciar evaluar tramite.',
              mensaje:
                response.causa ||
                response.mensaje ||
                response.error ||
                'Error en opciones de iniciar evaluar tramite.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error: any) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: error?.error?.error || 'Error inesperado en iniciar evaluar tramite.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  intalieCatalogos(): void {  
    this.catalogoService.getArea(this.tramite)
      .pipe(takeUntil(this.destroy$)).subscribe(
      (response) => {
        const DATOS = response.datos as Catalogo[];
        if (response) { this.areaCatalog = DATOS; }
      })
  }
  opinionChange(): void {
 this.refreshTabs.emit();
  }
}