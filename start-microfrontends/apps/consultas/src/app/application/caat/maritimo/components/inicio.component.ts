import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertComponent, ConfiguracionColumna, TablaDinamicaComponent, TablePaginationComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { BusquedaMaritimoResponse, DatosMaritimoResponse } from '../service/model/response/busqueda-response';
import { OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FiltrosMaritimoRequest } from '../service/model/resquest/filtros-request';
import { FormsModule } from '@angular/forms';
import { MaritimoService } from '../service/maritimo-service';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'caat-maritimo',
  standalone: true,
  imports: [TituloComponent, CommonModule, FormsModule, ReactiveFormsModule, TablaDinamicaComponent, TablePaginationComponent, AlertComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})

/**
 * Componente Angular para la gestión y consulta de registros CAAT Aéreo.
 * 
 * Este componente permite a los usuarios buscar registros de CAAT Aéreo mediante un formulario reactivo,
 * aplicar filtros, manejar la paginación de resultados y visualizar la información obtenida desde el servicio backend.
 */
export class InicioMaritimoComponent implements OnInit, OnDestroy {
  /**
  * Sirve para recopilar y validar los datos que capture el usuario. 
  */
  buscarFormulario!: FormGroup;

  /**
   * Contiene el resultado de las consulta de caat maritimo
   */

  listConsultaCAATMaritimo: DatosMaritimoResponse[] = [];

  /**
   * Objeto de la solicitud que contiene los filtros
   * Se utiliza para crear y enviar parámetros de filtrado a la API de backend.
   * @type {FiltrosAereoRequest} 
   */
  filtrosRequest: FiltrosMaritimoRequest = new FiltrosMaritimoRequest();

  /**
   * Total numero de elemento
   */
  public totalItems: number = 0;

  /**
   *Número de elementos a mostrar por página en la interfaz de consulta maritimo.
   * @type {number}
   * @default 5 - 
   */
  elementosPagina: number = 5;

  /**
    * Número de página actual para paginación.
    * @type {number}
    * @default 1
    */
  paginaActual: number = 1;

  /**
   * Gestiona el ciclo de vida y la limpieza de las suscripciones.
   * Se emite cuando se destruye el componente para activar las operaciones de cancelación de suscripción.
   */
  private destroy$ = new Subject<void>();

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

  /**
   * 
   */
  public configuracionTabla: ConfiguracionColumna<DatosMaritimoResponse>[] = [
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

  private static ALFANUM_ES = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;

  /**
 * Inicializa el componente con los servicios y controles del formulario
 * 
 * @param aereoService - Servicio para la consulta de caate maritimo
 * @param fb - Nombre de la instancia para crear el formulario reactivo
 */
  constructor(private maritimoService: MaritimoService,
    public fb: FormBuilder
  ) { }

  private inicializarForm(): void {
    this.buscarFormulario = this.fb.group(
      {
        denominacion: [
          '',
          [
            Validators.maxLength(40),
            Validators.pattern(InicioMaritimoComponent.ALFANUM_ES)
          ]
        ],
        rfc: [
          '',
          [
            Validators.pattern(InicioMaritimoComponent.ALFANUM_ES)
          ]
        ],
        denominacion_extra: [
          '',
          [
            Validators.maxLength(50),
            Validators.pattern(InicioMaritimoComponent.ALFANUM_ES)
          ]
        ],
        folio_busqueda_caat: [
          '',
          [
            Validators.maxLength(50),
            Validators.pattern(InicioMaritimoComponent.ALFANUM_ES)
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
  * 
  * Se llama despues de que se inicializa el componente
  */
  ngOnInit(): void {
    this.inicializarForm()
  }

  /**
  * Busca registros de CAAT maritimo según los filtros y parámetros de paginación actuales
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
    this.maritimoService
      .getRegistrosByFiltros<BusquedaMaritimoResponse>(this.paginaActual, this.elementosPagina, this.buscarFormulario.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.datos?.registros === undefined) {
            return;
          }
          const TOTAL_ITEMS = res.datos.paginacion?.total_elementos
          const DATOS_REGISTROS = res.datos?.registros
          if (TOTAL_ITEMS === undefined) {
            return
          }
          if (res.datos.paginacion?.total_elementos !== this.totalItems) {
            this.totalItems = TOTAL_ITEMS
          }
          this.listConsultaCAATMaritimo = DATOS_REGISTROS
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

  /**
  * Completa el tema de destrucción para cancelar la suscripción a todos los observables
  * limpia los recursos
  */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}