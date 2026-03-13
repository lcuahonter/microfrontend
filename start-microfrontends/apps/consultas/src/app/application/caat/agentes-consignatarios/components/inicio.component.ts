import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertComponent, ConfiguracionColumna, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { BusquedaAgentesResponse, PersonaSolicitudCaat } from '../service/model/response/busqueda-response';
import { OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AgentesService } from '../service/agentes-service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginacionResponse } from '../service/model/response/busqueda-response';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'caat-agentes-consignatarios',
  standalone: true,
  imports: [TituloComponent, CommonModule, FormsModule, ReactiveFormsModule, TablaDinamicaComponent, AlertComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})

/**
 * Componente Angular para la gestión y consulta de registros CAAT Aéreo.
 * 
 * Este componente permite a los usuarios buscar registros de CAAT Aéreo mediante un formulario reactivo,
 * aplicar filtros, manejar la paginación de resultados y visualizar la información obtenida desde el servicio backend.
 */

export class InicioAgentesComponent implements OnInit, OnDestroy {

  /**
   * Sirve para recopilar y validar los datos que capture el usuario. 
   */
  buscarFormulario!: FormGroup;

  /**
   * Contiene el resultado de las consulta de caat agentes consignatarios
   * 
   */
  listConsultaCAATAgentes: PersonaSolicitudCaat[] = [];

  /**
   * Total numero de elemento
   */
  totalElementos: number = 0;

  /**
   * Número de elementos a mostrar por página en la paginación.
   * @type {number}
   */
  elementosPagina: number = 5;

  /**
   * Número de página actual para paginación.
   * @type {number}
   * @default 1
   */

  paginaActual: number = 1;

  /**
  * utilizado para gestionar el ciclo de vida y la cancelación de la suscripción de observables
  */
  private destroy$ = new Subject<void>();

  /**
     * 
     */
  public configuracionTabla: ConfiguracionColumna<PersonaSolicitudCaat>[] = [
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

  private static ALFANUM_ES = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;


  constructor(private agentesService: AgentesService,
    public fb: FormBuilder
  ) { }


  private inicializarForm(): void {
    this.buscarFormulario = this.fb.group(
      {
        denominacion: [
          '',
          [
            Validators.maxLength(40),
            Validators.pattern(InicioAgentesComponent.ALFANUM_ES)
          ]
        ],
        rfc: [
          '',
          [
            Validators.pattern(InicioAgentesComponent.ALFANUM_ES)
          ]
        ],
        denominacion_extra: [
          '',
          [
            Validators.maxLength(50),
            Validators.pattern(InicioAgentesComponent.ALFANUM_ES)
          ]
        ],
        folio_solicitud_caat: [
          '',
          [
            Validators.maxLength(50),
            Validators.pattern(InicioAgentesComponent.ALFANUM_ES)
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
   * Busca registros de CAAT Aéreo según los filtros y parámetros de paginación actuales
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
    this.CONTENIDO = '';
    this.agentesService
      .getRegistrosByFiltros<BusquedaAgentesResponse>(this.paginaActual, this.elementosPagina, this.buscarFormulario.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          const RESPUESTA_DATOS = resp.datos?.registros || [];

          this.listConsultaCAATAgentes = RESPUESTA_DATOS
          this.updatePagination(resp.datos?.paginacion);
        },
        error: (error) => {
          console.error('Error al buscar:', error);
        }
      });

  }

  /**
   * Actualiza el estado de paginación con la respuesta de paginación proporcionada.
   * @param paginacion - Respuesta de paginación opcional que contiene el número de página, el tamaño de página y el total de elementos
   * Si no se proporciona, solo la página actual se restablece a 1.
   * @returns void
   */
  updatePagination(paginacion?: PaginacionResponse): void {
    this.paginaActual = paginacion?.num_pag || 1;
    this.elementosPagina = paginacion?.tam_pag || this.elementosPagina;
    this.totalElementos = paginacion?.total_elementos || 0;
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
    this.updatePagination();
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