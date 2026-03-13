import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { 
  ConfiguracionColumna, 
  ErrorMessagesComponent, 
  InputFecha, 
  InputFechaComponent, 
  TituloComponent, 
  exportTableToExcel 
} from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConsultaEspecificaService } from '../../service/consulta-especifica.service';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';
import { TigieRow } from '../../service/model/consulta-especifica.model';

@Component({
  selector: 'app-consulta-especifica',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    ErrorMessagesComponent,
    InputFechaComponent
  ],
  templateUrl: './consulta-especifica.component.html'
})
export class ConsultaEspecificaComponent implements OnInit {
  @ViewChild('modalDescarga') modalDescargaElement!: ElementRef;

  form!: FormGroup;
  errors: string[] = [];
  modalInstance: Modal | null = null;

  configFechaDesde: InputFecha = {
    labelNombre: 'Desde',
    required: false,
    habilitado: false
  };

  configFechaHasta: InputFecha = {
    labelNombre: 'Hasta',
    required: false,
    habilitado: false
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: ConsultaEspecificaService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.listenProhibidaChanges();
  }

  private initForm(): void {
    this.form = this.fb.group({
      fraccionArancelaria: [null, [Validators.required]],
      tipoOperacion: ['ambas'],
      tipoUnidadMedida: [null],
      exenta: [false, Validators.required],
      prohibida: [false, Validators.required],
      vigencia: ['ninguna'],
      fechaDesde: [{ value: null, disabled: true }],
      fechaHasta: [{ value: null, disabled: true }]
    });

    this.form.get('vigencia')?.valueChanges.subscribe(value => {
      const HABILITADO = value !== 'ninguna';
      this.configFechaDesde = { ...this.configFechaDesde, habilitado: HABILITADO };
      this.configFechaHasta = { ...this.configFechaHasta, habilitado: HABILITADO };
      
      if (HABILITADO) {
        this.form.get('fechaDesde')?.enable();
        this.form.get('fechaHasta')?.enable();
      } else {
        this.form.get('fechaDesde')?.disable();
        this.form.get('fechaHasta')?.disable();
        this.form.get('fechaDesde')?.setValue(null);
        this.form.get('fechaHasta')?.setValue(null);
      }
    });
  }

  /**
   * Escucha los cambios en el campo prohibida
   */
  private listenProhibidaChanges(): void {
    this.form.get('prohibida')?.valueChanges.subscribe(prohibidaValue => {
      const EXENTA_CONTROL = this.form.get('exenta');
      if (prohibidaValue === true) {
        EXENTA_CONTROL?.setValue(true);
        EXENTA_CONTROL?.disable();
      } else {
        EXENTA_CONTROL?.enable();
      }
    });
  }

  /**
   * Maneja el evento de aceptar
   */
  onAceptar(): void {
    if (this.form.valid) {
      this.errors = [];
      this.service.postConsultaEspecifica(this.form.getRawValue()).subscribe({
        next: (res) => {
          if (res.codigo === 'error') {
            this.errors = [res.mensaje];
          }
        },
        error: () => {
          this.errors = ['Ocurrió un error al procesar la solicitud.'];
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  /**
   * Abre el modal de descarga
   */
  onDescargarTigie(): void {
    if (this.modalDescargaElement) {
      this.modalInstance = new Modal(this.modalDescargaElement.nativeElement);
      this.modalInstance.show();
    }
  }

  /**
   * Confirma la descarga del reporte y exporta el archivo a Excel
   */
  confirmarDescarga(): void {
    this.service.getTigieReport().subscribe(datos => {
      this.closeModal();
      
      const CONFIG_COLUMNAS: ConfiguracionColumna<TigieRow>[] = [
        { encabezado: 'Fracción Arancelaria', orden: 1, clave: (row) => row.fraccionArancelaria },
        { encabezado: 'Tipo de Operación', orden: 2, clave: (row) => row.tipoOperacion },
        { encabezado: 'Tipo de UMT', orden: 3, clave: (row) => row.tipoUMT },
        { encabezado: 'Fracción Exenta', orden: 4, clave: (row) => row.fraccionExenta },
        { encabezado: 'Fracción Prohibida', orden: 5, clave: (row) => row.fraccionProhibida },
        { encabezado: 'Fracción Derogada', orden: 6, clave: (row) => row.fraccionDerogada },
        { encabezado: 'Descripción', orden: 7, clave: (row) => row.descripcion },
        { encabezado: 'Impuesto Ad. Valore', orden: 8, clave: (row) => row.impuestoAdValorem }
      ];

      exportTableToExcel(CONFIG_COLUMNAS, datos, 'TIGIE_Reporte');
    });
  }

  closeModal(): void {
    this.modalInstance?.hide();
  }

  onCancelar(): void {
    this.router.navigate(['/configuracion', 'fracciones']);
  }
}
