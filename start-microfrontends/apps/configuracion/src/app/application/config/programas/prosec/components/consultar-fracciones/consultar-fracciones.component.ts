/* eslint-disable no-alert */
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  ConfiguracionColumna,
  TablaDinamicaComponent,
  TablaSeleccion,
  TablePaginationComponent
} from '@libs/shared/data-access-user/src';
import { Capitulo } from '../../service/model/request/tree-request';
import { CommonModule } from '@angular/common';
import { ExpandirTablaComponent } from '@libs/shared/data-access-user/src/tramites/components/expandir-tabla/expandir-tabla.component';
import { FraccionesService } from '../../service/fracciones.service';

/**
 * Componente para eliminar fracciones arancelarias
 */
@Component({
  selector: 'app-consultar-fracciones',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    TablePaginationComponent,
    ExpandirTablaComponent
  ],
  templateUrl: './consultar-fracciones.component.html'
})
export class ConsultarFraccionesComponent implements OnInit {
  /**
   * Evento emitido cuando se cancela la operación
   */
  @Output() cancelEmitter = new EventEmitter<void>();
  @Output() totalFraccionesChange = new EventEmitter<number>();

  /**
   * Modo de operación (consultar, eliminar)
   */
  @Input() mode!: string;

  /**
   * Formulario de búsqueda
   */
  searchForm!: FormGroup;

  /**
   * Fracciones arancelarias obtenidas
   */
  fracciones: Capitulo[] = [];

  /**
   * Indica si se está consultando
   */
  isLoading = false;

  /**
   * Indica si se han realizado búsquedas
   */
  hasSearched = false;

  /**
   * Tipo de selección de tabla
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Configuración de columnas para la tabla
   */
  columns: ConfiguracionColumna<Capitulo>[] = [
    {
      encabezado: 'CLAVE',
      clave: (item) => item.clave,
      orden: 1
    },
    {
      encabezado: 'DESCRIPCIÓN',
      clave: (item) => item.descripcion,
      orden: 2
    }
  ];

  /**
   * Fracciones seleccionadas para eliminar
   */
  fraccionesSeleccionadas: Capitulo[] = [];

  constructor(
    private fb: FormBuilder,
    private fraccionesService: FraccionesService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    if (this.mode === 'eliminar') {
       this.hasSearched = true;
       this.loadFraccionesFromStore();
    }
  }

  private loadFraccionesFromStore(): void {
    this.isLoading = true;
    this.fraccionesService.getFracciones().subscribe({
      next: (data) => {
        this.fracciones = data;
        this.totalFraccionesChange.emit(this.fracciones.length);
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Inicializa el formulario de búsqueda
   */
  private initializeForm(): void {
    this.searchForm = this.fb.group({
      numeroClasificacion: ['', [Validators.required, this.alfanumericoMax8Caracteres]]
    });
  }

  private alfanumericoMax8Caracteres(control: AbstractControl): ValidationErrors | null {
    const VALUE = control.value;
    if (VALUE && !/^[a-zA-Z0-9]*$/.test(VALUE) && VALUE.length > 8) {
      return { caracteresAlfanumericos: true };
    }
    return null;
  }

  /**
   * Consulta las fracciones arancelarias (Capítulos inicialmente)
   */
  onConsultar(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.fraccionesService
      .getCapitulos()
      .subscribe({
        next: (response) => {
          this.fracciones = response.datos || [];
          this.totalFraccionesChange.emit(this.fracciones.length);
          this.hasSearched = true;
          this.isLoading = false;
        },
        error: (error: unknown) => {
          console.error('Error al consultar capítulos:', error);
          this.isLoading = false;
        }
      });
  }

  /**
   * Elimina las fracciones seleccionadas
   */
  onEliminar(): void {
    if (this.fraccionesSeleccionadas.length === 0) {
      alert('Debe seleccionar al menos una fracción para eliminar');
      return;
    }

    if (
      confirm(
        `¿Está seguro de eliminar ${this.fraccionesSeleccionadas.length} fracción(es)?`
      )
    ) {
      this.fraccionesService
        .eliminarFracciones(this.fraccionesSeleccionadas)
        .subscribe({
          next: () => {
            // Recargar fracciones después de eliminar
            if (this.mode === 'eliminar') {
                this.loadFraccionesFromStore();
            } else {
                this.onConsultar();
            }
            this.fraccionesSeleccionadas = [];
          },
          error: (error: unknown) => {
            console.error('Error al eliminar fracciones:', error);
            alert('Error al eliminar fracciones');
          }
        });
    }
  }

  /**
   * Elimina todas las fracciones
   */
  onEliminarTodos(): void {
    if (this.fracciones.length === 0) {
      alert('No hay fracciones para eliminar');
      return;
    }

    if (confirm('¿Está seguro de eliminar TODAS las fracciones?')) {
      this.fraccionesService.eliminarTodasLasFracciones().subscribe({
        next: () => {
          if (this.mode === 'eliminar') {
             this.loadFraccionesFromStore();
          } else {
             this.fracciones = [];
             this.hasSearched = false;
             this.searchForm.reset();
          }
        },
        error: (error: unknown) => {
          console.error('Error al eliminar todas las fracciones:', error);
          alert('Error al eliminar fracciones');
        }
      });
    }
  }

  /**
   * Cancela la operación
   */
  onCancelar(): void {
    this.cancelEmitter.emit();
  }

  /**
   * Maneja la selección de filas en la tabla
   */
  onSelectionChange(selectedItems: Capitulo[]): void {
    this.fraccionesSeleccionadas = selectedItems;
  }

  /**
   * Verifica si un campo tiene errores
   */
  hasError(fieldName: string): boolean {
    const FIELD = this.searchForm.get(fieldName);
    return Boolean(FIELD && FIELD.invalid && FIELD.touched);
  }

  /**
   * Maneja el doble clic en una fila para mostrar los elementos hijos (Partidas)
   * @param item Capítulo seleccionado
   * @returns void
   */
  onRowDoubleClick(item: Capitulo): void {
    this.isLoading = true;
    this.fraccionesService.getPartidas(item.clave).subscribe({
      next: (response) => {
        const CHILDREN = response.datos || [];
        if (CHILDREN.length > 0) {
          this.fracciones = CHILDREN;
          this.totalFraccionesChange.emit(this.fracciones.length);
        } else {
          alert('No hay mas detalles para esta fracción');
        }
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}
