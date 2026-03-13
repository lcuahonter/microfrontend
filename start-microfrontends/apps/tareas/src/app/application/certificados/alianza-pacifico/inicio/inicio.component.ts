import { 
  CategoriaMensaje, 
  ConfiguracionColumna, 
  ExpandirTablaComponent, 
  InputFecha,
  InputFechaComponent,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablePaginationComponent,
  TipoNotificacionEnum,
  TituloComponent
} from '@ng-mf/data-access-user';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AlianzaPacificoDetalleComponent } from '../detalle/detalle.component';
import { AlianzaPacificoResponse } from '../service/model/alianza-pacifico.model';
import { AlianzaPacificoService } from '../service/alianza-pacifico.service';

@Component({
  selector: 'app-alianza-pacifico',
  standalone: true,
  imports: [
    AlianzaPacificoDetalleComponent,
    CommonModule,
    ExpandirTablaComponent,
    InputFechaComponent,
    NotificacionesComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    TablePaginationComponent,
    TituloComponent
  ],
  templateUrl: './inicio.component.html'
})
export class AlianzaPacificoComponent implements OnInit {
  form!: FormGroup;
  results: AlianzaPacificoResponse[] = [];
  loading = false;
  searched = false;
  notificacionInput?: Notificacion;
  
  viewDetail = false;
  selectedRow?: AlianzaPacificoResponse;

  configFechaInicio: InputFecha = {
    labelNombre: 'Fecha de inicio transacción',
    required: false,
    habilitado: true
  };

  configFechaFin: InputFecha = {
    labelNombre: 'Fecha fin transacción',
    required: false,
    habilitado: true
  };

  configuracionTabla: ConfiguracionColumna<AlianzaPacificoResponse>[] = [
    { encabezado: 'No. Certificado', clave: (item) => item.noCertificado, orden: 1 },
    { encabezado: 'País de procedencia', clave: (item) => item.paisProcedencia, orden: 2 },
    { encabezado: 'Estado del COD', clave: (item) => item.estadoCod, orden: 3 },
    { encabezado: 'Estado por Reemplazo', clave: (item) => item.estadoReemplazo, orden: 4 },
    { encabezado: 'Fecha Expedición', clave: (item) => item.fechaExpedicion, orden: 5 },
    { encabezado: 'No. de Transacción', clave: (item) => item.noTransaccion, orden: 6 },
    { encabezado: 'Información Adicional', clave: (item) => item.informacionAdicional, orden: 7 },
    { encabezado: 'PDF', clave: (item) => item.pdfUrl, orden: 8, hiperenlace: true, showIcon: true },
    { encabezado: 'XML', clave: (item) => item.xmlUrl, orden: 9, hiperenlace: true, showIcon: true }
  ];

  paises = [
    { clave: 'CHILE', descripcion: 'CHILE (REPUBLICA DE)' },
    { clave: 'COLOMBIA', descripcion: 'COLOMBIA (REPUBLICA DE)' },
    { clave: 'PERU', descripcion: 'PERU (REPUBLICA DEL)' }
  ];

  estadosCod = [
    { clave: 'DECLARADO', descripcion: 'Declarado' },
    { clave: 'RECIBIDO', descripcion: 'Recibido' },
    { clave: 'RECIBIDO_INCORRECTO', descripcion: 'Recibido incorrecto por el país destino' },
    { clave: 'SOLICITUD_REEMPLAZO', descripcion: 'Solicitud de reemplazo' }
  ];

  estadosReemplazo = [
    { clave: 'REEMPLAZADO', descripcion: 'Reemplazado' }
  ];

  constructor(
    private fb: FormBuilder,
    private alianzaService: AlianzaPacificoService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      noCertificado: [null],
      paisProcedencia: [null],
      estadoCod: [null],
      estadoReemplazo: [null],
      noTransaccion: [null],
      fechaInicio: [null],
      fechaFin: [null]
    });
  }

  /**
   * Consultar los datos del certificado
   */
  onConsultar(): void {
    const VALUES = this.form.value;
    const HAS_CRITERIA = Object.values(VALUES).some(VALOR => VALOR !== null && VALOR !== '');

    if (!HAS_CRITERIA) {
      this.mostrarNotificacion(
        'Errores de búsqueda',
        'Debe de proporcionar al menos un criterio de búsqueda'
      );
      return;
    }

    this.loading = true;
    this.searched = true;
    this.alianzaService.search(VALUES).subscribe(RES => {
      this.results = RES;
      this.loading = false;
      if (this.results.length === 0) {
        this.mostrarNotificacion(
          'Sin datos de búsqueda',
          'No se encontraron resultados'
        );
      }
    });
  }

  mostrarNotificacion(titulo: string, mensaje: string): void {
    this.notificacionInput = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'action',
      titulo: titulo,
      mensaje: mensaje,
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: ''
    };
  }

  onFechaInicioChange(fecha: string): void {
    this.form.get('fechaInicio')?.setValue(fecha);
  }

  onFechaFinChange(fecha: string): void {
    this.form.get('fechaFin')?.setValue(fecha);
  }

  onLimpiar(): void {
    this.form.reset();
    this.results = [];
    this.searched = false;
  }

  /**
   * Click en una celda para abrir el archivo PDF o XML
   * @param event 
   */
  onAlternarValor(event: { row: AlianzaPacificoResponse; column: string | number | boolean | undefined }): void {
    this.selectedRow = event.row;
  }

  /**
   * 
   * @param event 
   */
  onFilaClick(event: AlianzaPacificoResponse): void {
    this.selectedRow = event;
    this.viewDetail = true;
  }

  onRegresarDetalle(): void {
    this.viewDetail = false;
    this.selectedRow = undefined;
  }
}