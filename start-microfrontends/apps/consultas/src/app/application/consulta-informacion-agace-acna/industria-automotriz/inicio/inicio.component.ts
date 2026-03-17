import { 
    CategoriaMensaje,
    ConfiguracionColumna, 
    Notificacion,
    NotificacionesComponent,
    REGEX_RFC,
    TablaDinamicaComponent, 
    TablePaginationComponent,
    TipoNotificacionEnum,
    TituloComponent,
    exportTableToExcel 
} from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IndustriaAutomotrizService } from '../service/industria-automotriz.service';
import { ProveedorIndustriaAutomotriz } from '../service/model/response/industria-automotriz.model';

@Component({
  selector: 'app-consultas-industria-automotriz',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    NotificacionesComponent,
    TablaDinamicaComponent, 
    TablePaginationComponent,
    TituloComponent
  ],
  templateUrl: './inicio.component.html'
})
export class ConsultasIndustriaAutomotrizComponent {
  form: FormGroup;
  datos: ProveedorIndustriaAutomotriz[] = [];
  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;
  notificacionInput!: Notificacion;
  showNotificacion = false;

  configuracionTabla: ConfiguracionColumna<ProveedorIndustriaAutomotriz>[] = [
    { encabezado: 'RFC Industria Automotriz', clave: (item: ProveedorIndustriaAutomotriz) => item.rfcIndustriaAutomotriz, orden: 1 },
    { encabezado: 'RFC Proveedor', clave: (item: ProveedorIndustriaAutomotriz) => item.rfcProveedor, orden: 2 },
    { encabezado: 'Nombre completo, Denominación o Razón Social del Proveedor', clave: (item: ProveedorIndustriaAutomotriz) => item.nombreProveedor, orden: 3 },
    { encabezado: 'Domicilio Fiscal del Proveedor', clave: (item: ProveedorIndustriaAutomotriz) => item.domicilioFiscalProveedor, orden: 4 },
    { encabezado: 'Norma', clave: (item: ProveedorIndustriaAutomotriz) => item.norma, orden: 5 },
    { encabezado: 'Número de Programa IMMEX', clave: (item: ProveedorIndustriaAutomotriz) => item.numeroProgramaIMMEX, orden: 6 },
    { encabezado: 'Número de Programa PROSEC', clave: (item: ProveedorIndustriaAutomotriz) => item.numeroProgramaPROSEC, orden: 7 },
    { encabezado: 'Aduanas en las que opera', clave: (item: ProveedorIndustriaAutomotriz) => item.aduanasOpera, orden: 8 },
    { encabezado: 'Fecha Inicio Relación', clave: (item: ProveedorIndustriaAutomotriz) => item.fechaInicioRelacion, orden: 9 },
    { encabezado: 'Fecha Fin Relación', clave: (item: ProveedorIndustriaAutomotriz) => item.fechaFinRelacion, orden: 10 }
  ];

  constructor(
    private fb: FormBuilder,
    private industriaService: IndustriaAutomotrizService
  ) {
    this.form = this.fb.group({
      rfcIndustriaAutomotriz: [null, [Validators.maxLength(15)]]
    });
  }

  /**
   * Realiza la búsqueda de proveedores.
   */
  onBuscar(): void {
    const RFC = this.form.get('rfcIndustriaAutomotriz')?.value;

    if (!RFC || RFC.trim() === '') {
      this.mostrarAlerta('Debe proporcionar el RFC');
      return;
    }

    // Validar formato RFC (usando el regex del sistema)
    if (!REGEX_RFC.test(RFC)) {
      this.mostrarAlerta('Por favor, corrija el RFC');
      return;
    }

    this.currentPage = 1;
    this.cargarDatos();
  }

  /**
   * Carga los datos de la consulta.
   */
  cargarDatos(): void {
    const RFC = this.form.get('rfcIndustriaAutomotriz')?.value;
    this.industriaService.consultarProveedores(RFC, this.currentPage, this.itemsPerPage).subscribe(res => {
      this.datos = res.data;
      this.totalItems = res.total;
    });
  }

  /**
   * Limpia el campo de búsqueda.
   */
  onLimpiar(): void {
    this.form.reset();
  }

  /**
   * Exporta la información a Excel.
   */
  onExportarInformacion(): void {
    if (this.datos.length === 0) {
      this.mostrarAlerta('No hay datos para exportar');
      return;
    }
    exportTableToExcel(this.configuracionTabla, this.datos, 'Proveedores_Industria_Automotriz');
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.cargarDatos();
  }

  /**
   * Muestra una alerta con el mensaje proporcionado.
   */
  mostrarAlerta(mensaje: string): void {
    this.notificacionInput = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'action',
      titulo: 'Alerta',
      mensaje: mensaje,
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.showNotificacion = true;
  }

  cerrarNotificacion(): void {
    this.showNotificacion = false;
  }
}
