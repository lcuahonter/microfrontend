import { ActivatedRoute, Router } from '@angular/router';
import { 
  CatalogoPaises,
  ConfiguracionColumna, 
  TablaDinamicaComponent, 
  TablePaginationComponent 
  } from '@ng-mf/data-access-user';
  import { Component, EventEmitter, OnInit, Output } from '@angular/core';
  import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { CommonModule } from '@angular/common';
  import { ExtranjeroResponse } from '../../service/model/response/extranjero.model';
  import { ExtranjeroSearchService } from '../../service/extranjero-search.service';
  import { SolicitanteAcuseData } from '../../service/model/response/acuse-resolucion.model';
  
@Component({
  selector: 'app-extranjero-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    TablaDinamicaComponent, 
    TablePaginationComponent
  ],
  templateUrl: './extranjero-form.component.html'
})
export class ExtranjeroFormComponent implements OnInit {
  @Output() searchError = new EventEmitter<string>();
  
  form!: FormGroup;
  results: ExtranjeroResponse[] = [];
  searched = false;
  loading = false;

  paises: CatalogoPaises[] = [
    { clave: 1, descripcion: 'México' },
    { clave: 2, descripcion: 'Estados Unidos' },
    { clave: 3, descripcion: 'Canadá' },
    { clave: 4, descripcion: 'España' }
  ];

  configuracionTabla: ConfiguracionColumna<ExtranjeroResponse>[] = [
    { encabezado: 'Nombre', clave: (item) => item.nombre, orden: 1 },
    { encabezado: 'Domicilio', clave: (item) => item.domicilio, orden: 2 },
    { encabezado: 'Correo', clave: (item) => item.correo, orden: 3 }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private searchService: ExtranjeroSearchService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: [null],
      primerApellido: [null],
      codigoPostal: [null, [Validators.pattern(/^\d{9}$/)]],
      idPais: [null]
    });

    // Reset error message when form changes
    this.form.valueChanges.subscribe(() => {
      this.searchError.emit('');
    });
  }

  /**
   * Busca solicitudes para el tipo de persona extranjero
   */
  onBuscar(): void {
    const VALUES = this.form.value;
    const HAS_CRITERIA = Object.values(VALUES).some(val => val !== '' && val !== null);

    if (!HAS_CRITERIA) {
      this.searchError.emit('Debe proporcionar información para al menos un criterio de búsqueda.');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.searched = true;
    this.searchService.search(VALUES).subscribe(RES => {
      this.results = RES;
      this.loading = false;
    });
  }

  /**
   * Valida si un control es invalido
   * @param CONTROL_NAME nombre del control
   * @returns boolean
   */
  isInvalid(CONTROL_NAME: string): boolean {
    const CONTROL = this.form.get(CONTROL_NAME);
    return Boolean(CONTROL && CONTROL.invalid && CONTROL.touched);
  }

  /**
   * Navega a la pantalla de acuses y resoluciones al dar clic en una fila
   * @param item 
   */
  onFilaClic(item: ExtranjeroResponse): void {
    const DATA: SolicitanteAcuseData = {
      tipoPersona: 'extranjero',
      nombre: item.nombre,
      calle: item.domicilio.split(' ')[0], // Dummy logic to extract calle
      numeroExterior: 'S/N',
      codigoPostal: '00000',
      pais: 'MEXICO',
      estado: 'CDMX'
    };
    this.router.navigate(['acuses-y-resoluciones'], { relativeTo: this.route, state: { data: DATA } });
  }
}
