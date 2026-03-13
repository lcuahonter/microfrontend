import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Subject, map, takeUntil } from 'rxjs';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  TablaDinamicaComponent,
  TablaSeleccion
} from '@libs/shared/data-access-user/src';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src/core/models/shared/configuracion-columna.model';

import { CHOFERES_NACIONALES_ALTA } from '../../../enum/choferes.enum';
import { Chofer40101Query } from '../../../estado/chofer40101.query';
import { Chofer40101Store } from '../../../estado/chofer40101.store';
import { DatosDelChoferNacional } from '../../../models/registro-muestras-mercancias.model';

import { DatosDeChoferesNacionalDialogComponent } from './data.de.choferes.dialog/data.de.choferes.nacional.dialog.component';


@Component({
  selector: 'app-chofere-nacional',
  templateUrl: './chofere.nacional.component.html',
  styleUrls: ['./chofere.nacional.component.scss'],
  standalone: true,
  imports: [
    TablaDinamicaComponent, 
    DatosDeChoferesNacionalDialogComponent,
  ],
  providers: [BsModalService],
})
export class ChofereNacionalComponent implements OnInit, OnDestroy {
  // Add your component logic here
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas de la tabla.
   * Define el encabezado, la clave de acceso a los datos y el orden de las columnas.
   */
  ConfiguracionColumna: ConfiguracionColumna<DatosDelChoferNacional>[] = 
    CHOFERES_NACIONALES_ALTA;


  /**
   * Datos del chofer nacional.
   * @property {DatosDelChoferNacional[]} datosDelChoferNacional
   */
  datosDelChoferNacional: DatosDelChoferNacional[] = [];

  /**
   * Datos del chofer nacional seleccionados.
   * @property {DatosDelChoferNacional[]} datosDelChoferNacionalSelected
   */
  datosDelChoferNacionalSelected: DatosDelChoferNacional[] = [];

  /**
   * Texto de la sección.
   * @property {string} textoSeccion
   */
  datosConsulta!: ConsultaioState;

  /**
   * Datos del chofer nacional que se utilizarán para agregar o editar.
   * @property {DatosDelChoferNacional} datosChofere
   */
  datosChofere: DatosDelChoferNacional = {} as DatosDelChoferNacional;


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
   * Referencia al componente de diálogo de datos de choferes nacionales.
   * Permite acceder a los métodos públicos del componente de diálogo, como editar registros desde el componente padre.
   * @type {DatosDeChoferesNacionalDialogComponent}
   */
  @ViewChild(DatosDeChoferesNacionalDialogComponent)
  datosDeChoferesDialogComponent!: DatosDeChoferesNacionalDialogComponent;


  /**
   * Sujeto utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   * Se emite un valor cuando el componente es destruido, permitiendo que las suscripciones se cancelen adecuadamente.
   */
  destroy$: Subject<unknown> = new Subject();
  
  /**
   * Indica si el formulario o componente está en modo solo lectura.
   * Cuando es `true`, los campos no pueden ser editados por el usuario.
   */
  esSoloLectura: boolean = false;

  /**
   * Constructor del componente ChofereNacional.
   * 
   * @param bsModalService Servicio para manejar modales de Bootstrap.
   * @param chofer40101Store Store para gestionar el estado de los choferes del trámite 40101.
   * @param chofer40101Query Consulta para obtener el estado de los choferes del trámite 40101.
   * @param consultaioQuery Consulta para obtener información adicional relacionada.
   */
  constructor(
    private bsModalService: BsModalService,
    private chofer40101Store: Chofer40101Store,
    private chofer40101Query: Chofer40101Query,
    private consultaioQuery: ConsultaioQuery
  ) {
     // Lógica para el constructor si es necesario.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Suscribe a los observables `selectSolicitud$` y `selectConsultaioState$` para obtener y actualizar los datos del chofer nacional y el estado de consulta.
   * - Actualiza las propiedades `datosDelChoferNacional`, `datosConsulta` e `isReadonly` según los datos recibidos.
   * - Utiliza `takeUntil(this.destroy$)` para gestionar la desuscripción automática y evitar fugas de memoria.
   */
  ngOnInit(): void {
    this.chofer40101Query.select(state => state.driversNacional)
      .pipe(
        takeUntil(this.destroy$),
        map(drivers => drivers.filter(d => d.status !== 'deleted').map(d => d.data as DatosDelChoferNacional))
      )
      .subscribe(data => {
        this.datosDelChoferNacional = data;
      });

      this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          if (seccionState.readonly) {
            this.datosConsulta = seccionState;
          this.esSoloLectura = this.datosConsulta.readonly;
          }
        })
      ).subscribe();
  }

  /**
   * Maneja el evento cuando se seleccionan uno o más choferes nacionales.
   * 
   * @param $event - Arreglo de objetos de tipo DatosDelChoferNacional que representa los choferes seleccionados.
   */
  alSeleccionarChoferNacional($event: DatosDelChoferNacional[]): void {
    this.datosDelChoferNacionalSelected = $event;
  }

  /**
   * Agrega una nueva fila reiniciando el objeto `datosChofere` y abre un diálogo modal con la plantilla proporcionada.
   *
   * @param template - Referencia de la plantilla utilizada para mostrar el diálogo modal.
   * @returns void
   */
  agregarNuevaFila(template: TemplateRef<unknown>): void {
    this.datosChofere = {} as DatosDelChoferNacional;
    this.abrirModal(template);
  }

  /**
   * Abre un diálogo modal para editar la fila seleccionada de chofer nacional.
   *
   * @param template Referencia a la plantilla del modal que se debe abrir.
   *
   * - Si no hay filas seleccionadas en `datosDelChoferNacionalSelected`, no realiza ninguna acción.
   * - Si hay al menos una fila seleccionada, asigna la primera fila seleccionada a `datosChofere` y abre el modal correspondiente.
   */
  editarFilaSeleccionada(template: TemplateRef<unknown>): void {
    if (this.datosDelChoferNacionalSelected.length === 0) {
      return;
    }
    const SELECCIONADO = this.datosDelChoferNacionalSelected[0];
    const FULLDRIVERLIST = this.chofer40101Query.getValue().driversNacional;
    const INDICE = FULLDRIVERLIST.findIndex(item => item.data === SELECCIONADO);
    this.datosChofere = SELECCIONADO;
    setTimeout(() => {
      if (this.datosDeChoferesDialogComponent && INDICE !== -1) {
        this.datosDeChoferesDialogComponent.editarRegistro(SELECCIONADO, INDICE);
      }
    });
    this.abrirModal(template);
  }

  @ViewChild(TablaDinamicaComponent)
  tablaDinamicaComponent!: TablaDinamicaComponent<DatosDelChoferNacional>;

  /**
   * Elimina las filas seleccionadas de la lista de choferes nacionales.
   *
   * - Si hay elementos seleccionados en `datosDelChoferNacionalSelected`, estos se marcan como eliminados en el store.
   * - Limpia la selección y emite una selección vacía a la tabla para la visibilidad de los botones.
   * - Si no hay elementos seleccionados, no realiza ninguna acción.
   */
  eliminarFilaSeleccionada(): void {
    if (this.datosDelChoferNacionalSelected.length > 0) {
      const FULLDRIVERLIST = this.chofer40101Query.getValue().driversNacional;
      const INDICESTODELETE = this.datosDelChoferNacionalSelected.map(selectedDriver => {
          return FULLDRIVERLIST.findIndex(item => item.data === selectedDriver);
      }).filter(index => index !== -1).sort((a, b) => b - a); // sort descending

      INDICESTODELETE.forEach(index => {
          this.chofer40101Store.deleteDriver('nacional', index);
      });

      this.datosDelChoferNacionalSelected = [];
      if (this.tablaDinamicaComponent) {
        this.tablaDinamicaComponent.listaDeFilaSeleccionada.emit([]);
      }
    }
  }

  /**
   * Abre un modal utilizando el servicio `bsModalService` y muestra el contenido proporcionado por la plantilla.
   *
   * @param template Referencia a la plantilla que se mostrará dentro del modal.
   */
  abrirModal(template: TemplateRef<unknown>): void {
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
  cancelarModal(): void {
    this.modalRef?.hide();
    this.modalRef = null;
  }

  /**
   * Maneja el evento de agregar o editar desde el diálogo.
   * Si el índice está presente, actualiza la fila; de lo contrario, agrega una nueva.
   */
  agregarModal(evento: { datos: DatosDelChoferNacional, indice?: number }): void {
    if (evento.indice !== undefined) {
      // Editar: actualiza el registro en el índice dado
      this.chofer40101Store.updateDriver('nacional', evento.indice, evento.datos);
    } else {
      // Agregar: inserta un nuevo registro
      this.chofer40101Store.addDriver('nacional', evento.datos);
    }
    this.datosDelChoferNacionalSelected = [];
    if (this.tablaDinamicaComponent) {
      this.tablaDinamicaComponent.listaDeFilaSeleccionada.emit([]);
    }
    this.cancelarModal();
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