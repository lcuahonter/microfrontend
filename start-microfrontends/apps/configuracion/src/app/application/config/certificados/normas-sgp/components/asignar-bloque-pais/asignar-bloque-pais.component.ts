import { Component, EventEmitter, Output } from '@angular/core';
import { ConfiguracionColumna, TablaDinamicaComponent, TablaSeleccion, TablePaginationComponent } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BloquePais } from '../../service/model/response/bloque-pais.model';
import { BloquePaisService } from '../../service/bloque-pais.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asignar-bloque-pais',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaDinamicaComponent, TablePaginationComponent],
  templateUrl: './asignar-bloque-pais.component.html'
})
export class AsignarBloquePaisComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() aceptar = new EventEmitter<BloquePais>();
  TablaSeleccion = TablaSeleccion;

  form: FormGroup;
  datos: BloquePais[] = [];
  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;

  configuracionTabla: ConfiguracionColumna<BloquePais>[] = [
    { encabezado: 'NOMBRE BLOQUE/PAIS', clave: (item: BloquePais) => item.nombre, orden: 1 }
  ];

  seleccionado: BloquePais | null = null;

  constructor(
    private fb: FormBuilder,
    private bloquePaisService: BloquePaisService
  ) {
    this.form = this.fb.group({
      filtro: ['', Validators.required]
    });
  }

  /**
   * Consulta los bloques/paises.
   */
  onConsultar(): void {
    if (this.form.invalid) {
      return;
    }
    this.currentPage = 1;
    this.cargarDatos();
  }

  /**
   * Carga los datos de los bloques/paises.
   */
  cargarDatos(): void {
    const FILTRO = this.form.get('filtro')?.value;
    this.bloquePaisService.getBloquesPaises(FILTRO, this.currentPage, this.itemsPerPage).subscribe(res => {
      this.datos = res.data;
      this.totalItems = res.total;
    });
  }

  /**
   * Cambia la página actual.
   * @param page - Número de la página.
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.cargarDatos();
  }

  /**
   * Selecciona una fila.
   * @param event - Evento de la fila seleccionada.
   */
  onFilaSeleccionada(event: BloquePais): void {
    this.seleccionado = event;
  }

  /**
   * Acepta la selección de un bloque/país.
   */
  onAceptar(): void {
    if (this.seleccionado) {
      this.aceptar.emit(this.seleccionado);
    }
  }

  /**
   * Cierra el modal.
   */
  onCancelar(): void {
    this.cerrar.emit();
  }
}
