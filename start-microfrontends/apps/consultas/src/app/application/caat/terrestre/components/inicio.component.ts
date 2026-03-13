import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertComponent, ConfiguracionColumna, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { BusquedaTerrestreResponse, DatosTerrestreResponse } from '../service/model/response/busqueda-response';
import { OnDestroy, OnInit, } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TerrestreService } from '../service/terrestre-service';

@Component({
  selector: 'caat-terrestre',
  standalone: true,
  imports: [TituloComponent, CommonModule, FormsModule, ReactiveFormsModule, TablaDinamicaComponent, AlertComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})

export class InicioTerrestreComponent implements OnInit, OnDestroy {
  /**
   * @tipo {FormGroup}
   * @descripcion Representa el formulario reactivo utilizado en el componente de busqueda CAAT Terrestre.
   * Este formulario se utiliza para gestionar y validar los datos de busqueda.
   */
  buscarFormulario!: FormGroup;

  /**
  * Lista de respuestas a los datos de consulta de CAAT terrestre.
  * Contiene los resultados obtenidos de las consultas de CAAT terrestre.
  */
  listConsultaCAAT: DatosTerrestreResponse[] = [];
  /**
   * Total numero de elementos
   */
  totalItems: number = 0;

  /**
   * Número de elementos a mostrar por página en el componente de paginación.
   * @type {number}
   */
  elementosPagina: number = 5;

  /**
   * Representa el número de página actual en una vista paginada.
   * Se utiliza para rastrear y controlar la página activa que se muestra al usuario.
   */
  paginaActual: number = 1;

  /**
   * Inicializa el componente `InicioComponent` inyectando `TerrestreService` y `FormBuilder`.
   * Configura el grupo de formularios `buscarFormulario` con controles para `denominacion`, `rfc` y `caat`,
   * cada uno marcado como obligatorio.
   *
   * @param terrestreService - Servicio para el manejo de operaciones relacionado con caat terrestre
   * @param fb - Nombre de la instancia para crear el formulario reactivo */

  /**
  Utilizado para emitir una señal para cancelar la suscripción a observables y limpiar recursos.
  **/
  private destroy$ = new Subject<void>();

  /**
     * 
     */
  public configuracionTabla: ConfiguracionColumna<DatosTerrestreResponse>[] = [
    {
      encabezado: 'RFC/CURP/NSS/',
      clave: (dato) => dato.rfc,
      orden: 1
    },
    {
      encabezado: 'Nombre, denominación o razón social',
      clave: (dato) => dato.nombre,
      orden: 2
    },
    {
      encabezado: '# CAAT',
      clave: (dato) => dato.cve_folio_caat,
      orden: 3
    },
    {
      encabezado: 'Perfil del CAAT',
      clave: (dato) => dato.ide_tipo_caat,
      orden: 4
    },
    {
      encabezado: 'Inicio de vigencia',
      clave: (dato) => (dato.fec_ini_vigencia),
      orden: 5
    },
    {
      encabezado: 'Fin de vigencia',
      clave: (dato) => dato.fec_fin_vigencia,
      orden: 6
    },
    {
      encabezado: 'Director General',
      clave: (dato) => dato.nombre_director,
      orden: 7
    }
  ]
  /**
   * contenido de la alerta 
   */
  public CONTENIDO: string = ''
  /**
   * clase para la alerta
   */
  public CUSTOMECLASS: string = 'alert-danger'
  /**
   * indica si la alerta debe ser mostrada
   */
  public mostrarAlerta: boolean = false

  constructor(private terrestreService: TerrestreService,
    public fb: FormBuilder
  ) { }

  private static ALFANUM_ES = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;


  /**
  * se llama después de inicializar las propiedades vinculadas a datos del componente.
  * Invoca el método `buscar` para realizar la obtención inicial de datos o la configuración lógica al inicializar el componente.
  */
  ngOnInit(): void {
    this.inicializarForm()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private inicializarForm(): void {
    this.buscarFormulario = this.fb.group(
      {
        denominacion: [
          '',
          [
            Validators.maxLength(40),
            Validators.pattern(InicioTerrestreComponent.ALFANUM_ES)
          ]
        ],
        rfc: [
          '',
          [
            Validators.pattern(InicioTerrestreComponent.ALFANUM_ES)
          ]
        ],
        denominacion_extra: [
          '',
          [
            Validators.maxLength(50),
            Validators.pattern(InicioTerrestreComponent.ALFANUM_ES)
          ]
        ],
        folio_solicitud_caat: [
          '',
          [
            Validators.maxLength(50),
            Validators.pattern(InicioTerrestreComponent.ALFANUM_ES)
          ]
        ]
      },
      {
        validators: [this.alMenosUnCampoRequerido]
      }
    );
  }

  alMenosUnCampoRequerido: ValidatorFn =
    (control: AbstractControl): ValidationErrors | null => {

      const VALORES = Object.values(control.value || {})
        .map(v => (typeof v === 'string' ? v.trim() : v))
        .filter(v => v);

      return VALORES.length > 0 ? null : { alMenosUno: true };
    };

  /**
  * Busca registros de CAAT terrestre según los filtros y parámetros de paginación actuales
  * Actualiza la lista de consultas y la información de paginación con los datos de respuesta
  * Se cancela automáticamente la suscripción cuando se destruye el componente.
  * 
  * @returns {void}
  */
  buscar(): void {
    if (this.buscarFormulario.invalid) {
      this.buscarFormulario.markAllAsTouched();
      this.mostrarAlerta = true;
      if (this.buscarFormulario.errors?.['alMenosUno']) {
        this.CONTENIDO = 'El número de registros es mayor a 30, especifique su busqueda'
        return
      }
      this.CONTENIDO = 'Formato Invalido'
      return;
    }
    this.mostrarAlerta = false;
    this.terrestreService
      .getRegistrosByFiltros<BusquedaTerrestreResponse>(
        this.paginaActual,
        this.elementosPagina,
        this.buscarFormulario.value
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const DATOS = res.datos;

          if (!DATOS) { return }

          this.listConsultaCAAT = DATOS.registros ?? [];
          this.totalItems = DATOS.paginacion?.total_elementos ?? 0;
        },
        error: (error) => {
          console.error('Error al buscar:', error);
        }
      });
  }


  /**
      * Maneja los cambios de paginación actualizando la página actual y refrescando los resultados de la búsqueda.
      * @param page - El número de página a la que navegar
      */
  cambioPagina(page: number): void {
    this.paginaActual = page;
    this.buscar();
  }

  /**
    * Maneja los cambios en la cantidad de elementos mostrados por página.
    * Restablece la página actual a 1 y actualiza el estado de paginación.
    * @param elementosPagina - El nuevo número de elementos a mostrar por página
    */
  elementosPaginaCambio(elementosPagina: number): void {
    this.elementosPagina = elementosPagina;
    this.paginaActual = 1;
    this.buscar();
  }

}