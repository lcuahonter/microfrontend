import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { 
  ConfiguracionColumna, 
  REGEX_CURP, 
  TablaDinamicaComponent, 
  TablePaginationComponent 
} from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoContribuyenteResponse } from '../../service/model/response/no-contribuyente.model';
import { NoContribuyenteSearchService } from '../../service/no-contribuyente-search.service';
import { Router } from '@angular/router';
import { SolicitanteAcuseData } from '../../service/model/response/acuse-resolucion.model';

@Component({
  selector: 'app-no-contribuyente-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    TablaDinamicaComponent, 
    TablePaginationComponent
  ],
  templateUrl: './no-contribuyente-form.component.html'
})
export class NoContribuyenteFormComponent implements OnInit {
  @Output() searchError = new EventEmitter<string>();
  
  form!: FormGroup;
  results: NoContribuyenteResponse[] = [];
  searched = false;
  loading = false;

  configuracionTabla: ConfiguracionColumna<NoContribuyenteResponse>[] = [
    { encabezado: 'CURP', clave: (item) => item.curp, orden: 1 },
    { encabezado: 'Nombre', clave: (item) => item.nombre, orden: 2 },
    { encabezado: 'Correo electrónico', clave: (item) => item.correoElectronico, orden: 3 }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private searchService: NoContribuyenteSearchService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      curp: [null, [Validators.required, Validators.pattern(REGEX_CURP)]]
    });

    // Reset parent error message when form changes
    this.form.valueChanges.subscribe(() => {
      this.searchError.emit('');
    });
  }

  /**
   * Busca solicitudes para el tipo de persona no contribuyente
   */
  onBuscar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.searched = true;
    this.searchService.search(this.form.value).subscribe(RES => {
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
  onFilaClic(item: NoContribuyenteResponse): void {
    const DATA: SolicitanteAcuseData = {
      tipoPersona: 'no_contribuyentes',
      nombre: item.nombre,
      curp: item.curp
    };
    this.router.navigate(['/solicitudes-subsecuentes','acuses-y-resoluciones'], { state: { data: DATA } });
  }

  hasError(CONTROL_NAME: string, ERROR_NAME: string): boolean {
    return Boolean(this.form.get(CONTROL_NAME)?.hasError(ERROR_NAME));
  }
}
