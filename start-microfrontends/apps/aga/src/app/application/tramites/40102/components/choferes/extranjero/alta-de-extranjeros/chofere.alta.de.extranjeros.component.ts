import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import {
  TablaDinamicaComponent,
  TablaSeleccion,
} from '@libs/shared/data-access-user/src';
import { CHOFERES_EXTRANJEROS_TABLA } from '../../../../enum/choferes.enum';
import { Chofer40102Query } from '../../../../estados/chofer40102.query';
import { Chofer40102Service } from '../../../../estados/chofer40102.service';
import { ChoferesExtranjeros } from '../../../../models/registro-muestras-mercancias.model';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src/core/models/shared/configuracion-columna.model';
import { DatosDeChoferesExtranjerosDialogComponent } from '../dialog/data.de.choferes.extranjeros.dialog.component';

@Component({
  selector: 'app-chofere-alta-de-extranjeros',
  templateUrl: './chofere.alta.de.extranjeros.component.html',
  styleUrls: ['./chofere.alta.de.extranjeros.component.scss'],
  standalone: true,
  imports: [
    TablaDinamicaComponent, 
    DatosDeChoferesExtranjerosDialogComponent,
  ],
  providers: [BsModalService],
})
export class ChofereAltaDeExtranjerosComponent implements OnInit, OnDestroy {
  // Add your component logic here
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas de la tabla.
   * Define el encabezado, la clave de acceso a los datos y el orden de las columnas.
   */
  ConfiguracionColumna: ConfiguracionColumna<ChoferesExtranjeros>[] =
    CHOFERES_EXTRANJEROS_TABLA;


  /**
   * Datos del chofer nacional.
   * @property {ChoferesExtranjeros[]} ChoferesExtranjeros
   */
  datosDelChoferExtranjeros: ChoferesExtranjeros[] = [];

  /**
   * Datos del chofer nacional seleccionados.
   * @property {ChoferesExtranjeros[]} datosDelChoferExtranjerosSelected
   */
  datosDelChoferExtranjerosSelected: ChoferesExtranjeros[] = [];

  /**
   * Texto de la sección.
   * @property {string} textoSeccion
   */
  datosConsulta!: ConsultaioState;

  /**
   * Datos del chofer nacional que se utilizarán para agregar o editar.
   * @property {ChoferesExtranjeros} datosChofere
   */
  datosChofere: ChoferesExtranjeros = {} as ChoferesExtranjeros;


  /**
   * Referencia al modal de Bootstrap para agregar mercancías.
   * @property {BsModalRef} modalRef
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
   * Se emite un valor cuando el componente es destruido, permitiendo que las suscripciones se cancelen adecuadamente.
   */
  destroy$: Subject<unknown> = new Subject();
  
  /**
   * Indica si el formulario o componente está en modo solo lectura.
   * Cuando es `true`, los campos no pueden ser editados por el usuario.
   */
  isReadonly: boolean = false;

  /**
   * Constructor del componente ChofereNacional.
   * 
   * @param bsModalService Servicio para manejar modales de Bootstrap.
   * @param chofer40102Service Servicio para operaciones relacionadas con choferes del trámite 40102.
   * @param chofer40102Query Consulta para obtener el estado de los choferes del trámite 40102.
   * @param consultaioQuery Consulta para obtener información adicional relacionada.
   */
  constructor(
    private bsModalService: BsModalService,
    private chofer40102Service: Chofer40102Service,
    private chofer40102Query: Chofer40102Query,
    private consultaioQuery: ConsultaioQuery
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Suscribe a los observables `selectSolicitud$` y `selectConsultaioState$` para obtener y actualizar los datos del chofer nacional y el estado de consulta.
   * - Actualiza las propiedades `datosDelChoferExtranjeros`, `datosConsulta` e `isReadonly` según los datos recibidos.
   * - Utiliza `takeUntil(this.destroy$)` para gestionar la desuscripción automática y evitar fugas de memoria.
   */
  ngOnInit(): void {

    this.chofer40102Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((data) => {
          this.datosDelChoferExtranjeros = [...data?.datosDelChoferExtranjerosAlta ?? []];
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
   * Maneja el evento cuando se seleccionan uno o más choferes nacionales.
   * 
   * @param $event - Arreglo de objetos de tipo ChoferesExtranjeros que representa los choferes seleccionados.
   */
  onChofereNationalSelected($event: ChoferesExtranjeros[]): void {
    this.datosDelChoferExtranjerosSelected = $event;
  }

  /**
   * Adds a new row by resetting the `datosChofere` object and opening a modal dialog with the provided template.
   * 
   * @param template - The template reference used to display the modal dialog.
   * @returns void
   */
  addNewRow(template: TemplateRef<unknown>): void {
    this.datosChofere = {} as ChoferesExtranjeros;
    this.openModal(template);
  }

  /**
   * Abre un modal para editar la fila seleccionada de chofer nacional.
   * 
   * @param template - Referencia a la plantilla del modal que se debe abrir.
   * 
   * Si no hay filas seleccionadas en `choferesExtranjerosSelected`, muestra una advertencia en la consola y no realiza ninguna acción.
   * Si hay al menos una fila seleccionada, asigna la primera fila seleccionada a `datosChofere` y abre el modal correspondiente.
   */
  editSelectedRow(template: TemplateRef<unknown>): void {
    if (this.datosDelChoferExtranjerosSelected.length === 0) {
      console.warn('No rows selected for editing.');
      return;
    }
    this.datosChofere = this.datosDelChoferExtranjerosSelected[0];
    this.openModal(template);
  }

  /**
   * Elimina las filas seleccionadas de la lista de datos de choferes nacionales.
   * 
   * Si hay elementos seleccionados en `choferesExtranjerosSelected`, estos se eliminan de la lista principal `choferesExtranjeros`
   * y se limpia la selección. Si no hay elementos seleccionados, muestra una advertencia en la consola.
   */
  deleteSelectedRow(): void {
    if (this.datosDelChoferExtranjerosSelected.length > 0) {
      this.datosDelChoferExtranjeros = this.datosDelChoferExtranjeros.filter(
        (item) => !this.datosDelChoferExtranjerosSelected.includes(item)
      );
      this.datosDelChoferExtranjerosSelected = [];
    } else {
      console.warn('No rows selected for deletion.');
    }
  }

  /**
   * Abre un modal utilizando el servicio `bsModalService` y muestra el contenido proporcionado por el template.
   * 
   * @param template Referencia al template que se mostrará dentro del modal.
   */
  openModal(template: TemplateRef<unknown>): void {
    this.modalRef = this.bsModalService.show(template, {
      class: 'modal-fullscreen',
    });
  }

  /**
   * Cierra el modal actual si está abierto y limpia la referencia al modal.
   * 
   * @remarks
   * Esta función verifica si existe una referencia al modal (`modalRef`), 
   * y en caso afirmativo, lo oculta y establece la referencia a `null`.
   */
  cancelModal(): void {
    this.modalRef?.hide();
    this.modalRef = null;
  }

  /**
   * Agrega un nuevo objeto de tipo `ChoferesExtranjeros` al arreglo `datosDelChoferExtranjeros`.
   * Limpia la selección actual de choferes y cierra el modal.
   *
   * @param data - Los datos del chofer extranjero a agregar.
   */
  addModal(data: ChoferesExtranjeros): void {
    this.datosDelChoferExtranjeros.push(data);
    this.datosDelChoferExtranjerosSelected = [];

    this.chofer40102Service
      .updateDatosDelChoferExtranjero(this.datosDelChoferExtranjeros);
    this.cancelModal();
  }

  
  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite un valor y completa el observable `destroy$` para limpiar suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
