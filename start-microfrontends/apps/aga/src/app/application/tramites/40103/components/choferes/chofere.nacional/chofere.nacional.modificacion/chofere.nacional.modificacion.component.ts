import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import {
    TablaDinamicaComponent,
  TablaSeleccion,
} from '@libs/shared/data-access-user/src';
import { CHOFERES_NACIONALES_ALTA } from '../../../../enum/choferes.enum';
import { Chofer40103Query } from '../../../../estados/chofer40103.query';
import { Chofer40103Service } from '../../../../estados/chofer40103.service';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src/core/models/shared/configuracion-columna.model';
import { DatosDeChoferesNacionalDialogComponent } from '../data.de.choferes.dialog/data.de.choferes.nacional.dialog.component';
import { DatosDelChoferNacional } from '../../../../models/registro-muestras-mercancias.model';

@Component({
  selector: 'app-chofere-nacional-modificacion',
  templateUrl: './chofere.nacional.modificacion.component.html',
  styleUrls: ['./chofere.nacional.modificacion.component.scss'],
  standalone: true,
  imports: [
    TablaDinamicaComponent,  
    DatosDeChoferesNacionalDialogComponent
  ],
  providers: [BsModalService],
})
export class ChofereNacionalModificacionComponent implements OnInit, OnDestroy {
  // Add your component logic here
  /**
   * Tipo de selección utilizada en la tabla dinámica (por ejemplo, selección por checkbox).
   * @type {TablaSeleccion}
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas de la tabla.
   * Define el encabezado, la clave de acceso a los datos y el orden de las columnas.
   * @type {ConfiguracionColumna<DatosDelChoferNacional>[]}
   */
  ConfiguracionColumna: ConfiguracionColumna<DatosDelChoferNacional>[] =
    CHOFERES_NACIONALES_ALTA;

  /**
   * Lista de choferes nacionales.
   * @type {DatosDelChoferNacional[]}
   */
  datosDelChoferNacional: DatosDelChoferNacional[] = [];

  /**
   * Lista de choferes nacionales seleccionados en la tabla.
   * @type {DatosDelChoferNacional[]}
   */
  datosDelChoferNacionalSelected: DatosDelChoferNacional[] = [];

  /**
   * Estado de consulta relacionado con los choferes nacionales.
   * @type {ConsultaioState}
   */
  datosConsulta: ConsultaioState = {} as ConsultaioState;

  /**
   * Referencia al modal de Bootstrap utilizado en el componente.
   * @type {BsModalRef | null}
   */
  modalRef!: BsModalRef | null;

  /**
   * Referencia al elemento del modal de Bootstrap para agregar mercancías.
   * @property {TemplateRef} agregarModal
   */
  @ViewChild('datosDeChoferesModal', { static: false })
  agregarModalDialog!: TemplateRef<Element>;

  /**
   * Observable utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   * @type {Subject<void>}
   */
  destroy$: Subject<void> = new Subject<void>();

  /**
   * Referencia al componente del diálogo de choferes nacionales.
   * @type {DatosDeChoferesNacionalDialogComponent}
   */
  @ViewChild(DatosDeChoferesNacionalDialogComponent)
  modalComponent!: DatosDeChoferesNacionalDialogComponent;

  /**
   * Objeto que representa los datos del chofer nacional a agregar o editar.
   * @type {DatosDelChoferNacional}
   */
  datosChofere: DatosDelChoferNacional = {} as DatosDelChoferNacional;
  
  /**
   * Indica si el campo es de solo lectura.
   * Cuando es `true`, el usuario no puede modificar el valor del campo.
   */
  isReadonly: boolean = false;

  /**
   * Constructor del componente.
   * Inicializa los servicios necesarios para la funcionalidad del componente.
   * @param {BsModalService} bsModalService - Servicio para manejar modales de Bootstrap.
   * @param {Chofer40103Service} chofer40103Service - Servicio para manejar la lógica de negocio relacionada con los choferes.
   * @param {Chofer40103Query} chofer40103Query - Consulta para obtener el estado de los choferes.
   * @param {ConsultaioQuery} consultaioQuery - Consulta para obtener el estado de la aplicación.
   * @returns {void}
   */
  constructor(
    private bsModalService: BsModalService,
    private chofer40103Service: Chofer40103Service,
    private chofer40103Query: Chofer40103Query,
    private consultaioQuery: ConsultaioQuery
  ) {}
  
  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   * 
   * - Utiliza `next` y `complete` en el observable `destroy$` para notificar a las suscripciones que deben limpiarse.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Suscribe a los observables `selectSolicitud$` y `selectConsultaioState$` para obtener y actualizar los datos del chofer nacional y el estado de consulta.
   * - Actualiza la propiedad `datosDelChoferNacional` concatenando los datos obtenidos.
   * - Establece el modo de solo lectura (`isReadonly`) según el estado de la consulta.
   * - Utiliza `takeUntil` para limpiar las suscripciones cuando el componente se destruye.
   */
  ngOnInit(): void {

    this.chofer40103Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((data) => {
          this.datosDelChoferNacional = [...data?.datosDelChoferNacionalModification ?? []];
          
        })
      )
      .subscribe();

      this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          if (seccionState.readonly) {
            this.datosConsulta = seccionState;
            this.isReadonly = this.datosConsulta.readonly;
          }
        })
      ).subscribe();
  }

  /**
   * Maneja el evento de selección de filas en la tabla de choferes nacionales.
   * Actualiza la lista de choferes nacionales seleccionados.
   * @param $event - Arreglo de choferes nacionales seleccionados.
   */
  onChofereNationalSelected($event: DatosDelChoferNacional[]): void {
    this.datosDelChoferNacionalSelected = $event;
  }

  /**
   * Inicializa un nuevo objeto de chofer nacional y abre el modal para agregar un nuevo registro.
   * @param template - Referencia al template del modal a mostrar.
   */
  addNewRow(template: TemplateRef<unknown>): void {
    this.datosChofere = {} as DatosDelChoferNacional;
    this.abrirModal(template);
  }

  /**
   * Abre el modal para editar el registro seleccionado en la tabla.
   * Si no hay ningún registro seleccionado, muestra una advertencia en consola.
   * @param template - Referencia al template del modal a mostrar.
   */
  editSelectedRow(template: TemplateRef<unknown>): void {
    if (this.datosDelChoferNacionalSelected.length === 0) {
      console.warn('No rows selected for editing.');
      return;
    }
    this.datosChofere = this.datosDelChoferNacionalSelected[0];
    this.abrirModal(template);
  }

  /**
   * Elimina los registros seleccionados de la lista de choferes nacionales.
   * Si no hay ningún registro seleccionado, muestra una advertencia en consola.
   */
  deleteSelectedRow(): void {
    if (this.datosDelChoferNacionalSelected.length > 0) {
      this.datosDelChoferNacional = this.datosDelChoferNacional.filter(
        (item) => !this.datosDelChoferNacionalSelected.includes(item)
      );
      this.datosDelChoferNacionalSelected = [];
    } else {
      console.warn('No rows selected for deletion.');
    }
  }

  /**
   * Abre el modal de Bootstrap utilizando el template proporcionado.
   * @param template - Referencia al template del modal a mostrar.
   */
  abrirModal(template: TemplateRef<unknown>): void {
    this.modalRef = this.bsModalService.show(template, {
      class: 'modal-fullscreen',
    });
  }

  /**
   * Cierra el modal de Bootstrap y limpia la referencia.
   */
  cancelarModal(): void {
    this.modalRef?.hide();
    this.modalRef = null;
  }

  /**
   * Agrega un nuevo chofer nacional a la lista y cierra el modal.
   * @param data - Datos del chofer nacional a agregar.
   */
  agregarModal(data: DatosDelChoferNacional): void {
    if (this.modalComponent) {
      this.datosDelChoferNacional.push(data);
      this.datosDelChoferNacionalSelected = [];
      this.chofer40103Service.updateDatosDelChoferNacionalModification(this.datosDelChoferNacional);
    }
    this.cancelarModal();
  }
}
