import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { 
  ConfiguracionColumna, 
  ExpandirTablaComponent, 
  TablaDinamicaComponent, 
  TablePaginationComponent, 
  TituloComponent 
} from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AcuseResolucionResponse, SolicitanteAcuseData } from '../../service/model/response/acuse-resolucion.model';
import { AcusesResolucionesService } from '../../service/acuses-resoluciones.service';

@Component({
  selector: 'app-acuses-resoluciones',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    TablePaginationComponent,
    TituloComponent,
    ExpandirTablaComponent
  ],
  templateUrl: './acuses-resoluciones.component.html'
})
export class AcusesResolucionesComponent implements OnInit {
  solicitanteData: SolicitanteAcuseData | null = null;
  form!: FormGroup;
  results: AcuseResolucionResponse[] = [];
  loading = false;
  searched = false;

  configuracionTabla: ConfiguracionColumna<AcuseResolucionResponse>[] = [
    { encabezado: 'Folio', clave: (item) => item.folio, orden: 1 },
    { encabezado: 'Tipo de Tramite', clave: (item) => item.tipoTramite, orden: 2 },
    { encabezado: 'Dependencia', clave: (item) => item.dependencia, orden: 3 },
    { encabezado: 'Fecha Inicio Trámite', clave: (item) => item.fechaInicioTramite, orden: 4 },
    { encabezado: 'Sentido resolución', clave: (item) => item.sentidoResolucion, orden: 5 },
    { encabezado: 'Estatus resolución', clave: (item) => item.estatusResolucion, orden: 6 }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private acusesService: AcusesResolucionesService,
    private route: ActivatedRoute
  ) {
    const NAVIGATION = this.router.getCurrentNavigation();
    this.solicitanteData = NAVIGATION?.extras.state?.['data'] as SolicitanteAcuseData;
  }

  ngOnInit(): void {
    if (!this.solicitanteData) {
      // Fallback for demo
      this.solicitanteData = {
        tipoPersona: 'extranjero',
        nombre: 'JAIME',
        apellidoPaterno: 'ZAVALA',
        calle: 'GRAN VÍA',
        numeroExterior: '567',
        numeroInterior: '6',
        codigoPostal: '67896',
        pais: 'URUGUAY (REPUBLICA ORIENTAL DEL)',
        estado: 'JAPON'
      };
    }

    this.form = this.fb.group({
      folio: [null],
      fechaInicial: [null],
      fechaFinal: [null]
    });
  }

  /**
   * Busca acuses y resoluciones
   */
  onBuscar(): void {
    const { FOLIO, FECHA_INICIAL, FECHA_FINAL } = this.form.value;
    
    const HAS_FOLIO = Boolean(FOLIO);
    const HAS_BOTH_DATES = Boolean(FECHA_INICIAL) && Boolean(FECHA_FINAL);

    if (!HAS_FOLIO && !HAS_BOTH_DATES) {
      return;
    }

    this.loading = true;
    this.searched = true;
    this.acusesService.search(this.form.value).subscribe(RES => {
      this.results = RES;
      this.loading = false;
    });
  }

  /**
   * Regresa a la pantalla de inicio
   */
  onRegresar(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
