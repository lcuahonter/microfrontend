import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  ConfiguracionColumna,
  ExpandirTablaComponent,
  InputRadioComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TablePaginationComponent,
  TituloComponent
} from '@libs/shared/data-access-user/src';
import {
  ConsultType,
  ConsultaResultado
} from '../../service/model/consultar-form.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConsultarFormService } from '../../service/consultar-form.service';
import { FraccionesService } from '../../service/fracciones.service';
import { SectorCatalog } from '../../service/model/common.model';
import { SectorCatalogoService } from '../../service/sector-catalogo.service';

/**
 * Componente para consultar la configuración del programa PROSEC
 */
@Component({
  selector: 'app-consultar-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    TablaDinamicaComponent,
    TablePaginationComponent,
    InputRadioComponent,
    ExpandirTablaComponent
],
  templateUrl: './consultar-form.component.html'
})
export class ConsultarFormComponent implements OnInit {
  /**
   * Formulario de consulta
   */
  form!: FormGroup;

  /**
   * Resultados de la búsqueda
   */
  searchResults: ConsultaResultado[] = [];

  /**
   * Catálogo de sectores
   */
  sectorCatalogo: SectorCatalog[] = [];

  /**
   * Indica si se está realizando una búsqueda
   */
  isSearching = false;

  /**
   * Indica si se han realizado búsquedas
   */
  hasSearched = false;

  /**
   * Configuración de columnas para la tabla
   */
  columns: ConfiguracionColumna<ConsultaResultado>[] = [
    {
      encabezado: 'Sector',
      clave: (item) => item.sector,
      orden: 1
    },
    {
      encabezado: 'Fecha de Inicio',
      clave: (item) => item.fechaInicio,
      orden: 2
    },
    {
      encabezado: 'Activo',
      clave: (item) => (item.activo ? 'Sí' : 'No'),
      orden: 3
    }
  ];

  /**
   * Tipo de selección de tabla
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Opciones para el componente de radio buttons
   */
  radioOptions: { label: string; value: string }[] = [
    { label: 'Sector', value: 'sector' },
    { label: 'Fracción', value: 'fraccion' },
    { label: 'Todos', value: 'todos' }
  ];

  /**
   * Valor por defecto seleccionado en el radio button
   */
  defaultSelect: ConsultType = 'sector';
  route: ActivatedRoute | null | undefined;

  constructor(
    private consultarService: ConsultarFormService,
    private sectorCatalogoService: SectorCatalogoService,
    private router: Router,
    private fraccionesService: FraccionesService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadSectorCatalogo();
  }

  /**
   * Inicializa el formulario usando el servicio
   */
  private initializeForm(): void {
    this.form = this.consultarService.initializeForm();

    // Suscribirse a cambios en el tipo de consulta
    this.form
      .get('consultType')
      ?.valueChanges.subscribe((consultType: ConsultType) => {
        this.consultarService.onConsultTypeChange(this.form, consultType);
      });
  }

  /**
   * Carga el catálogo de sectores
   */
  private loadSectorCatalogo(): void {
    this.sectorCatalogoService.getCatalogo().subscribe({
      next: (response) => {
        this.sectorCatalogo = response.datos ?? [];
      },
      error: (error) => {
        console.error('Error al cargar catálogo de sectores:', error);
      }
    });
  }

  /**
   * Realiza la búsqueda
   */
  onSearch(): void {
    if (!this.consultarService.isFormValid(this.form)) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSearching = true;
    const FORM_DATA = this.form.getRawValue();

    this.consultarService.searchResults(FORM_DATA).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.hasSearched = true;
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Error en la búsqueda:', error);
        this.isSearching = false;
      }
    });
  }

  onDobleClick(item: ConsultaResultado): void {
    this.fraccionesService.savePrograma(item);
    this.router.navigate(['/configuracion', 'programas', 'prosec', 'modificar']);
  }

  /**
   * Verifica si el campo sector debe mostrarse
   */
  get shouldShowSectorField(): boolean {
    return this.form.get('consultType')?.value === 'sector';
  }

  /**
   * Verifica si el campo fraccion debe mostrarse
   */
  get shouldShowFraccionField(): boolean {
    return this.form.get('consultType')?.value === 'fraccion';
  }

  /**
   * Verifica si el campo todos debe mostrarse
   */
  get shouldShowTodosField(): boolean {
    return this.form.get('consultType')?.value === 'todos';
  }

  /**
   * Obtiene el total de páginas (mock)
   */
  get totalPages(): number {
    return Math.ceil(this.searchResults.length / 10);
  }

  /**
   * Actualiza valores en el formulario cuando cambia el radio button
   * @param form Formulario reactivo
   * @param campo Nombre del campo
   * @param metodo Nombre del método (no utilizado en esta implementación)
   */
  setValores(form: FormGroup, campo: string, metodo: string): void {
    const VALOR = form.get(campo)?.value as ConsultType;
    if (VALOR) {
      this.consultarService.onConsultTypeChange(this.form, VALOR);
    }
  }
}
