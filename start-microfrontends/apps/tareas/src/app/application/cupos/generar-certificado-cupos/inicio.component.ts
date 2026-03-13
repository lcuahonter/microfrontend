import { Component, OnInit } from '@angular/core';
import { ConfiguracionColumna, ErrorMessagesComponent, ExpandirTablaComponent, TablaDinamicaComponent, TablePaginationComponent } from '@ng-mf/data-access-user';
import { ConsultaEspecificaRequest, ConsultaPorFolioRequest } from './service/model/request/consulta-certificado.model';
import { CertificadoCupo } from './service/model/response/certificado-cupo.model';
import { CommonModule } from '@angular/common';
import { ConsultaEspecificaComponent } from './components/consulta-especifica/consulta-especifica.component';
import { ConsultaPorFolioComponent } from './components/consulta-por-folio/consulta-por-folio.component';
import { ConsultaService } from './service/consulta.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-generar-certificado-cupos',
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    ConsultaEspecificaComponent,
    ConsultaPorFolioComponent,
    TablaDinamicaComponent,
    ExpandirTablaComponent,
    TablePaginationComponent,
    ErrorMessagesComponent
],
    templateUrl: './inicio.component.html',
})
export class GenerarCertificadoCuposComponent implements OnInit {
    /**
     * Tipo de consulta
     */
    tipoConsulta: 'especifica' | 'folio' = 'especifica';
    /**
     * Resultados de la consulta
     */
    resultados: CertificadoCupo[] = [];
    /**
     * Configuracion de la tabla
     */
    configuracionTabla: ConfiguracionColumna<CertificadoCupo>[] = [];
    /**
     * Indica si se esta cargando
     */
    cargando: boolean = false;

    // Paginación (Simulado)
    totalItems: number = 0;
    itemsPerPage: number = 5;
    currentPage: number = 1;

    /**
     * Errores
     */
    errors: string[] = [];
    /**
     * Mensaje de exito
     */
    successMessage: string = '';

    constructor(private consultaService: ConsultaService) { }

    ngOnInit(): void {
        this.initConfiguracionTabla();
    }

    private initConfiguracionTabla(): void {
        this.configuracionTabla = [
            { encabezado: 'Número de folio de la solicitud', clave: (item: CertificadoCupo): string => item.folioSolicitud, orden: 1 },
            { encabezado: 'Registro Federal de Contribuyentes', clave: (item: CertificadoCupo): string => item.rfc, orden: 2 },
            { encabezado: 'Nombre, Denominación o razón social', clave: (item: CertificadoCupo): string => item.nombreRazonSocial, orden: 3 },
            { encabezado: 'Documento', clave: (item: CertificadoCupo): string => item.documento, orden: 4, hiperenlace: true },
            { encabezado: 'Estatus', clave: (item: CertificadoCupo): string => item.estatus, orden: 5 }
        ];
    }

    /**
     * Maneja el evento de búsqueda especifica
     * @param request ConsultaEspecificaRequest
     */
    onBuscarEspecifica(request: ConsultaEspecificaRequest): void {
        this.cargando = true;
        this.consultaService.consultarEspecifica(request).subscribe(data => {
            this.resultados = data;
            this.totalItems = data.length;
            this.cargando = false;
        });
    }

    /**
     * Maneja el evento de búsqueda por folio
     * @param request ConsultaPorFolioRequest
     */
    onBuscarPorFolio(request: ConsultaPorFolioRequest): void {
        this.cargando = true;
        this.consultaService.consultarPorFolio(request).subscribe(data => {
            this.resultados = data;
            this.totalItems = data.length;
            this.cargando = false;
        });
    }

    /**
     * Maneja el evento de cambio de página
     * @param page Número de página
     */
    onPageChange(page: number): void {
        this.currentPage = page;
    }
}