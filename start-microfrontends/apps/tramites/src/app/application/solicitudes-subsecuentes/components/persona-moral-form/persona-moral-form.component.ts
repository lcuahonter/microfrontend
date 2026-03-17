import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConfiguracionColumna, REGEX_RFC_MORAL, TablaDinamicaComponent, TablePaginationComponent } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolicitanteMock, SolicitanteSearchService } from '../../service/solicitante-search.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SolicitanteAcuseData } from '../../service/model/response/acuse-resolucion.model';

@Component({
  selector: 'app-persona-moral-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaDinamicaComponent, TablePaginationComponent],
  templateUrl: './persona-moral-form.component.html'
})
export class PersonaMoralFormComponent implements OnInit {
  @Output() noResults = new EventEmitter<boolean>();
  
  form!: FormGroup;
  results: SolicitanteMock[] = [];
  searched = false;
  loading = false;

  columnas: ConfiguracionColumna<SolicitanteMock>[] = [
    { encabezado: 'RFC', clave: (item) => item.rfc, orden: 1 },
    { encabezado: 'Nombre', clave: (item) => item.nombre, orden: 2 },
    { encabezado: 'Correo electrónico', clave: (item) => item.correo, orden: 3 }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private searchService: SolicitanteSearchService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      rfc: [null, [Validators.required, Validators.pattern(REGEX_RFC_MORAL)]]
    });

    this.form.get('rfc')?.valueChanges.subscribe(() => {
      this.noResults.emit(false);
      this.searched = false;
    });
  }

  /**
   * Busca solicitudes para el tipo de persona persona moral
   */
  onBuscar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.searched = true;
    const RFC = this.form.get('rfc')?.value;

    this.searchService.buscarPorRfc(RFC).subscribe(RES => {
      this.results = RES;
      this.loading = false;
      if (this.results.length === 0) {
        this.noResults.emit(true);
      } else {
        this.noResults.emit(false);
      }
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
   * Valida si un control tiene un error
   * @param CONTROL_NAME nombre del control
   * @param ERROR_NAME nombre del error
   * @returns boolean
   */
  hasError(CONTROL_NAME: string, ERROR_NAME: string): boolean {
    return Boolean(this.form.get(CONTROL_NAME)?.hasError(ERROR_NAME));
  }

  /**
   * Navega a la pantalla de acuses y resoluciones al dar clic en una fila
   * @param item 
   */
  onFilaClic(item: SolicitanteMock): void {
    const DATA: SolicitanteAcuseData = {
      tipoPersona: 'persona_moral',
      nombre: item.nombre,
      rfc: item.rfc
    };
    this.router.navigate(['/solicitudes-subsecuentes','acuses-y-resoluciones'], { state: { data: DATA } });
  }
}
