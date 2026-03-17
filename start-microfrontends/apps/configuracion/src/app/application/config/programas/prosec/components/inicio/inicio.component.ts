import { CargarArchivoMenusComponent, ConfiguracionColumna, ExpandirTablaComponent, InputCheckComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActionButtonsComponent } from '../action-buttons/action-buttons.component';
import { ActionMessageComponent } from '../action-message/action-message.component';
import { AgregarFraccionesComponent } from '../agregar-fracciones/agregar-fracciones.component';
import { CommonModule } from '@angular/common';
import { ConsultaDeFraccionesComponent } from '../consulta-de-fracciones/consulta-de-fracciones.component';
import { ConsultaResultado } from '../../service/model/consultar-form.model';
import { ConsultarFormComponent } from '../consultar-form/consultar-form.component';
import { ConsultarFraccionesComponent } from '../consultar-fracciones/consultar-fracciones.component';
import { FraccionesService } from '../../service/fracciones.service';
import { Modal } from 'bootstrap';
import { Mode } from '../../constants';
import { Router } from '@angular/router';
import { SectorCatalog } from '../../service/model/common.model';
import { SectorCatalogoService } from '../../service/sector-catalogo.service';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { VigenciaComponent } from '../vigencia/vigencia.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConsultarFormComponent,
    AgregarFraccionesComponent,
    ConsultarFraccionesComponent,
    ConsultaDeFraccionesComponent,
    ConsultaDeFraccionesComponent,
    CargarArchivoMenusComponent,
    ActionButtonsComponent,
    VigenciaComponent,
    InputCheckComponent,
    ExpandirTablaComponent,
    TablaDinamicaComponent,
    ActionMessageComponent
]
})
export class InicioComponent implements OnInit {
  /**
   * Titulo del componente
   */
  @Input() title: string = '';
  @Input() programTitle: string = '';
  @Input() tipoSeleccionTabla!: TablaSeleccion;
  @Input() mode: Mode = 'registrar';
  @Output() activationCheckChanged = new EventEmitter<boolean>();
  @ViewChild('modal') modalElement!: ElementRef;
  @ViewChild(VigenciaComponent) vigenciaComponent!: VigenciaComponent;

  showModalAddFraccion = false;
  showModalDeleteFraccion = false;
  showModalConsultFraccion = false;
  showModalUploadFraccion = false;
  showActivacionModal = false;
  showCancelModal = false;
  modalTitle = '';

  programData: ConsultaResultado | null = null;
  programDataList: ConsultaResultado[] = [];
  
  errors: string[] = [];
  successMessage: string = '';

  TablaSeleccion = TablaSeleccion;

  /**
   * Formulario para el sector
   */
  form!: FormGroup;

  columns: ConfiguracionColumna<ConsultaResultado>[] = [
    {
      encabezado: 'Fracción',
      clave: (item) => item.fraccion,
      orden: 2
    },
    {
      encabezado: 'Fecha última Modificación',
      clave: (item) => item.fechaFin,
      orden: 3
    },
    {
      encabezado: 'Activo',
      clave: (item) => (item.activo ? 'Sí' : 'No'),
      orden: 4
    }
  ];

  /**
   * Catalogo de sectores
   */
  sectorCatalogo: SectorCatalog[] = [];
  showBitacoraTable = false;

  constructor(
    private fb: FormBuilder,
    private sectorCatalogoService: SectorCatalogoService,
    private fraccionesService: FraccionesService,
    private router: Router
  ) {}

  goToAgregarFraccion(): void {
    this.showModalAddFraccion = true;
    this.modalTitle = 'Agregar Fraccion(es)';
    if (this.modalElement) {
      const MODAL_INSTANCIA = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCIA?.show();
    }
  }

  goToEliminarFraccion(): void {
    this.showModalDeleteFraccion = true;
    this.modalTitle = 'Eliminar Fraccion(es)';
    if (this.modalElement) {
      const MODAL_INSTANCIA = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCIA?.show();
    }
  }

  goToConsultarFraccion(): void {
    this.showModalConsultFraccion = true;
    this.modalTitle = 'Consultar Fracciones';
    if (this.modalElement) {
      const MODAL_INSTANCIA = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCIA?.show();
    }
  }

  goToCargarFraccion(): void {
    this.showModalUploadFraccion = true;
    this.modalTitle = 'Carga de fracciones por archivo';
    if (this.modalElement) {
      const MODAL_INSTANCIA = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCIA?.show();
    }
  }

  onActivacionChange(): void {
    const ACTIVACION_VALUE = this.form.get('activacion')?.value;

    if (!ACTIVACION_VALUE) {
      this.showActivacionModal = true;
      this.modalTitle = 'Mensaje';
      if (this.modalElement) {
        const MODAL_INSTANCIA = new Modal(this.modalElement.nativeElement);
        MODAL_INSTANCIA?.show();
      }
    } else {
      this.confirmActivationAction();
    }
  }

  confirmActivationAction(): void {
    const NEW_VALUE = this.form.get('activacion')?.value;
    this.fraccionesService.setProgramCheckActivation(NEW_VALUE);
    this.activationCheckChanged.emit(NEW_VALUE);
    this.closeModal();
  }

  showBitacora(): void {
    this.showBitacoraTable = !this.showBitacoraTable;
  }

  closeModal(): void {
    if (this.modalElement) {
      const MODAL_INSTANCIA = Modal.getInstance(
        this.modalElement.nativeElement
      );
      MODAL_INSTANCIA?.hide();
    }
    this.showModalAddFraccion = false;
    this.showModalDeleteFraccion = false;
    this.showModalConsultFraccion = false;
    this.showModalUploadFraccion = false;
    this.showActivacionModal = false;
    this.showCancelModal = false;
  }

  ngOnInit(): void {
    this.getProgramData();
    this.initializeForm();
    this.sectorCatalogoService.getCatalogo().subscribe({
      next: (response) => {
        this.sectorCatalogo = response.datos ?? [];
      },
      error: (error) => {
        console.error('Error al cargar catálogo de sectores:', error);
      }
    });
  }

  /**
   * Inicializa el formulario con el control de sector
   */
  private initializeForm(): void {
    this.form = this.fb.group({
      sector: [],
      activacion: [this.programData?.activo]
    });
  }

  onSave(): void {
    this.errors = [];
    this.successMessage = '';

    // Validar Fracciones (Mock: Check if service has data)
    // En un escenario real, deberíamos saber si se agregaron fracciones.
    // Usaremos un subscribe simple para verificar cantidad.
    this.fraccionesService.getFracciones().subscribe(response => {
        const HAS_FRACATS = response && response.length > 0;
        
        // 1. Validate Fracciones
        if (!HAS_FRACATS) {
           this.errors.push('Debe ingresar al menos una Fracción Arancelaria'); 
        }

        // 2. Validate Vigencia (Fecha Inicio)
        if (!this.vigenciaComponent || !this.vigenciaComponent.fechaInicioValue) {
           this.errors.push('(Fecha de Inicio) es un campo requerido');
        }

        // 3. Validate Sector
        if (this.form.get('sector')?.invalid || !this.form.get('sector')?.value) {
           this.errors.push('(Sector) es un campo requerido');
        }

        if (this.errors.length === 0) {
           this.successMessage = 'El programa PROSEC se ha configurado exitosamente';
        }
    });
  }

  onCancelConfirmation(): void {
    this.errors = [];
    this.successMessage = '';
    this.form.reset();
    this.closeModal();
    if (this.mode === 'modificar') {
      this.router.navigate(['/configuracion', 'programas', 'prosec', 'consultar']);
    }
    if (this.mode === 'registrar') {
      // Navegar a la pantalla de inicio (Aún no definida)
      // this.router.navigate(['/configuracion', 'programas', 'prosec', 'inicio']);
    }
  }

  onCancel(): void {
    this.showCancelModal = true;
    this.modalTitle = 'Mensaje';
    if (this.modalElement) {
      const MODAL_INSTANCIA = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCIA?.show();
    }
  }

  getProgramData(): void {
    this.fraccionesService.getPrograma().subscribe({
      next: (response) => {
        this.programData = response;
        this.programDataList = response ? [response] : [];
      },
      error: (error) => {
        console.error('Error al cargar catálogo de sectores:', error);
      }
    });
  }
}
