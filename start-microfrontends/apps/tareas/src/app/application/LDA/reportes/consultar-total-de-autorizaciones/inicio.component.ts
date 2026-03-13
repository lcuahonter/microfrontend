import { Component, OnInit } from "@angular/core";
import { ConfiguracionColumna, ExpandirTablaComponent, TablaDinamicaComponent, TablePaginationComponent } from "@ng-mf/data-access-user";
import { Autorizaciones } from "./service/model/response/autorizaciones.model";
import { CommonModule } from "@angular/common";
import { ConsultarTotalAutorizacionesService } from "./service/consultar-total-autorizaciones.service";
import { CriteriosBusquedaComponent } from "./components/criterios-busqueda/criterios-busqueda.component";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, ExpandirTablaComponent, CriteriosBusquedaComponent, TablaDinamicaComponent, TablePaginationComponent],
  templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit {
  /**
   * Lista de resultados obtenidos de la búsqueda
   */
  resultados: Autorizaciones[] = [];
  
  /**
   * Indica si se está cargando los resultados
   */
  cargando: boolean = false;
  
  /**
   * Configuración de la tabla dinámica
   */
  configuracionTabla: ConfiguracionColumna<Autorizaciones>[] = [];
  
  // Paginación
  totalItems: number = 0;
  itemsPerPage: number = 5;
  currentPage: number = 1;

  constructor(private service: ConsultarTotalAutorizacionesService) {}

  ngOnInit(): void {
    this.initConfiguracionTabla();
  }

  private initConfiguracionTabla(): void {
    this.configuracionTabla = [
      { encabezado: 'Aduana', clave: (item: Autorizaciones): string => item.aduana, orden: 1 },
      { encabezado: 'Razon Social', clave: (item: Autorizaciones): string => item.razonSocial, orden: 2 },
      { encabezado: 'Oficio de autorización', clave: (item: Autorizaciones): string => item.oficioAutorizacion, orden: 3 },
      { encabezado: 'Fecha de autorización', clave: (item: Autorizaciones): string => item.fechaAutorizacion, orden: 4 },
      { encabezado: 'Vigencia', clave: (item: Autorizaciones): string => item.vigencia, orden: 5 },
      { encabezado: 'Tipo Trámite', clave: (item: Autorizaciones): string => item.tipoTramite, orden: 6 }
    ];
  }

  /**
   * Maneja el evento de búsqueda emitido por el componente de criterios.
   * @param filtros Criterios de búsqueda
   */
  onBuscar(filtros: Record<string, unknown>): void {
    this.cargando = true;
    this.service.buscarAutorizaciones(filtros).subscribe({
      next: (data) => {
        this.resultados = data;
        this.totalItems = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  /**
   * Maneja el evento de exportación emitido por el componente de criterios.
   * @param filtros Criterios para filtrar la exportación
   */
  onExportar(filtros: Record<string, unknown>): void {
    this.service.exportarExcel(filtros);
  }

  /**
   * Maneja el evento de exportación emitido por el componente de criterios.
   * @param filtros Criterios para filtrar la exportación
   */
  onExportarAutorizaciones(): void {
    this.service.exportarExcelAutorizaciones(this.configuracionTabla, this.resultados);
  }

  /**
   * Maneja el evento de cambio de página emitido por el componente de paginación.
   * @param page Número de la página actual
   */
  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
