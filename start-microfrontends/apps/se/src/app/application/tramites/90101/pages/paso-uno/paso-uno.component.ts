import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DomiciliosDePlantasComponent } from '../../components/domicilios-de-plantas/domicilios-de-plantas.component';
import { ProductorIndirectoComponent } from '../../components/productor-indirecto/productor-indirecto.component';
import { ProsecService } from '../../services/prosec.service';
import { SectoresYMercanciasComponent } from '../../components/sectores-y-mercancias/sectores-y-mercancias.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';

/**
 * @component
 * @description
 * Componente PasoUnoComponent para el primer paso del trámite 90101.
 * Gestiona la selección de pestañas, el estado de solo lectura y la sincronización con el estado global.
 * Se encarga de obtener y actualizar los datos de acuicultura a través de los servicios correspondientes.
 * 
 * @example
 * <app-paso-uno></app-paso-uno>
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [
    SolicitanteComponent,
    DomiciliosDePlantasComponent,
    ProductorIndirectoComponent,
    SectoresYMercanciasComponent,
    CommonModule
  ]
})
export class PasoUnoComponent implements OnInit, OnDestroy {

  @Input() loginRfc!: string;
  
  /**
   * @property {number} indice
   * @description Índice actual de la pestaña seleccionada en el paso uno.
   */
  indice: number = 1;

  /**
   * @property {boolean} formularioDeshabilitado
   * @description Indica si el formulario debe mostrarse en modo solo lectura.
   */
  formularioDeshabilitado: boolean = false;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para cancelar suscripciones activas y evitar fugas de memoria al destruir el componente.
   * @private
   */
  private destroyNotifier$ = new Subject<void>();

  @Input() tramiteId!: string;

  /**
   * @property {Array<{index: number, title: string, component: string}>} seccionesDeLaSolicitud
   * @description
   * Arreglo que define las secciones del formulario en el paso uno, incluyendo el índice, título y nombre del componente asociado.
   */
  seccionesDeLaSolicitud = [
    { index: 1, title: 'Solicitante', component: 'solicitante' },
    { index: 2, title: 'Domicilios de plantas', component: 'domicilios-de-plantas' },
    { index: 3, title: 'Sectores y mercancías', component: 'sectores-y-mercancias' },
    { index: 4, title: 'Productor indirecto', component: 'productor-indirecto' },
  ];

  /**
   * @property {SolicitanteComponent} solicitante
   * @description Referencia al componente de la sección "Solicitante" del formulario.
   */
  @ViewChild('solicitanteRef') solicitante!: SolicitanteComponent;

  /**
   * @property {DomiciliosDePlantasComponent} domiciliosDePlantas
   * @description Referencia al componente de la sección "Domicilios de plantas" del formulario.
   */
  @ViewChild('domiciliosRef') domiciliosDePlantas!: DomiciliosDePlantasComponent;

  /**
   * @property {SectoresYMercanciasComponent} sectoresYMercancias
   * @description Referencia al componente de la sección "Sectores y mercancías" del formulario.
   */
  @ViewChild('sectoresRef') sectoresYMercancias!: SectoresYMercanciasComponent;

  /**
   * @property {ProductorIndirectoComponent} productorIndirecto
   * @description Referencia al componente de la sección "Productor indirecto" del formulario.
   */
  @ViewChild('productorIndirectoRef') productorIndirecto!: ProductorIndirectoComponent;
  /**
   * @constructor
   * @description Constructor del componente PasoUnoComponent.
   * @param {ProsecService} prosecService Servicio de PROSEC que gestiona la lógica de datos de acuicultura.
   * @param {ConsultaioQuery} consultaQuery Query para obtener el estado global de la sección.
   */
  constructor(
    private prosecService: ProsecService,
    private consultaQuery: ConsultaioQuery
  ) {}

  /**
   * @method seleccionaTab
   * @description Cambia el índice de la pestaña activa.
   * @param {number} i Índice de la pestaña a seleccionar.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method ngOnInit
   * @description Hook de ciclo de vida que se ejecuta al inicializar el componente.
   * Se suscribe al estado de la sección para detectar cambios y gestionar la habilitación del formulario.
   * Llama a guardarDatosFormulario() si el estado indica actualización.
   * @returns {void}
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        if (seccionState.update) {
          this.formularioDeshabilitado = false;
          this.guardarDatosFormulario();
        }
        if (seccionState.readonly) {
          this.formularioDeshabilitado = true;
        }
      });
  }

  /**
   * @method guardarDatosFormulario
   * @description Obtiene los datos de acuicultura desde el servicio y actualiza el estado del formulario.
   * Se asegura de evitar fugas de memoria utilizando takeUntil.
   * @returns {void}
   */
  guardarDatosFormulario(): void {
    this.prosecService
      .getAcuiculturaData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.prosecService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * @method validarFormularios
   * @description
   * Valida todos los formularios de las secciones del paso uno.
   * Marca los controles como tocados si son inválidos para mostrar los errores.
   * Retorna `true` si todos los formularios son válidos, `false` en caso contrario.
   *
   * @returns {boolean} `true` si todos los formularios son válidos, `false` si alguno es inválido.
   */
  public validarFormularios(): boolean {
    let isValid = true;

    if (this.solicitante?.form) {
      if (this.solicitante.form.invalid) {
        this.solicitante.form.markAllAsTouched();
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.domiciliosDePlantas) {
      if (!this.domiciliosDePlantas.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.sectoresYMercancias) {
      if (!this.sectoresYMercancias.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.productorIndirecto) {
      if (!this.productorIndirecto.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    return isValid;
  }

  /**
   * @method ngOnDestroy
   * @description Hook de ciclo de vida que se ejecuta al destruir el componente.
   * Libera recursos cancelando todas las suscripciones activas.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
