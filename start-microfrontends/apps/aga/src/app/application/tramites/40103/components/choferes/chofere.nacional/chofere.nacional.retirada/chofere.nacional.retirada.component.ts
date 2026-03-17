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
  selector: 'app-chofere-nacional-retirada',
  templateUrl: './chofere.nacional.retirada.component.html',
  styleUrls: ['./chofere.nacional.retirada.component.scss'],
  standalone: true,
  imports: [
    TablaDinamicaComponent,
    DatosDeChoferesNacionalDialogComponent
],
  providers: [BsModalService],
})
export class ChofereNacionalRetiradaComponent implements OnInit, OnDestroy {

  // ======================= PROPIEDADES =======================

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
   * Indica si el formulario o componente está en modo solo lectura.
   * Cuando es `true`, los campos no pueden ser editados por el usuario.
   * @type {boolean}
   */
  esSoloLectura: boolean = false;

  /**
   * Estado de consulta relacionado con los choferes nacionales.
   * @type {ConsultaioState}
   */
  datosConsulta!: ConsultaioState;


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
   * Sujeto utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   * @type {Subject<void>}
   */
  destroyed$: Subject<void> = new Subject();

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

  // ======================= MÉTODOS =======================

  /**
   * Constructor del componente. Inyecta los servicios necesarios para la gestión de choferes y el estado de consulta.
   */
  constructor(
    private bsModalService: BsModalService,
    public chofer40103Service: Chofer40103Service,
    private chofer40103Query: Chofer40103Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    // Lógica constructora
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe a los observables para obtener y actualizar los datos de choferes nacionales y el estado de consulta.
   * Establece el modo de solo lectura según el estado recibido.
   */
  ngOnInit(): void {
    this.chofer40103Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((data) => {
          this.datosDelChoferNacional = [...data.datosDelChoferNacionalRetirada ?? []];
        })
      )
      .subscribe();

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          if (seccionState.readonly) {
            this.datosConsulta = seccionState;
            this.esSoloLectura = this.datosConsulta.readonly;
          }
        })
      ).subscribe();

  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones y evita fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
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
  agregarNuevaFila(template: TemplateRef<unknown>): void {
    this.datosChofere = {} as DatosDelChoferNacional;
    this.abrirModal(template);
  }

  /**
   * Abre el modal para editar el registro seleccionado en la tabla.
   * Si no hay ningún registro seleccionado, no realiza ninguna acción.
   * @param template - Referencia al template del modal a mostrar.
   */
  editSelectedRow(template: TemplateRef<unknown>): void {
    if (this.datosDelChoferNacionalSelected.length === 0) {
      return;
    }
    this.datosChofere = this.datosDelChoferNacionalSelected[0];
    this.abrirModal(template);
  }

  /**
   * Elimina los registros seleccionados de la lista de choferes nacionales.
   * Si no hay ningún registro seleccionado, no realiza ninguna acción.
   */
  eliminarFilaSeleccionada(): void {
    if (this.datosDelChoferNacionalSelected.length > 0) {
      this.datosDelChoferNacional = this.datosDelChoferNacional.filter(
        (item) => !this.datosDelChoferNacionalSelected.includes(item)
      );
      this.datosDelChoferNacionalSelected = [];
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
   * Agrega una nueva entrada de `DatosDelChoferNacional` al arreglo `datosDelChoferNacional` si el componente modal está inicializado.
   * También reinicia el arreglo `datosDelChoferNacionalSelected` y cierra el modal.
   *
   * @param data - El objeto de datos que representa al chofer nacional que se va a agregar.
   */
  agregarModal(data: DatosDelChoferNacional): void {
    if (this.modalComponent) {
      this.datosDelChoferNacional.push(data);
      this.datosDelChoferNacionalSelected = [];
      this.chofer40103Service.updateDatosDelChoferNacionalRetirada(this.datosDelChoferNacional);
    }
    this.cancelarModal();
  }
}
