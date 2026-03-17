import {Catalogo,Solicitud32101State,Tramite32101Store} from '../../../../estados/tramites/tramite32101.store';
import { CatalogoSelectComponent,REGEX_NUMEROS,TituloComponent} from '@libs/shared/data-access-user/src';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatosDeLaTabla, TramiteList } from '../../models/datos-tramite.model';
import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaAvisoAcreditacionService } from '../../services/consulta-aviso-acreditacion.service';
import { Router } from '@angular/router';
import { Tramite32101Query } from '../../../../estados/queries/tramite32101.query';

@Component({
  selector: 'app-componente-de-actualizacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
  ],
  templateUrl: './componente-de-actualizacion.component.html',
  styleUrl: './componente-de-actualizacion.component.scss',
})
export class ComponenteDeActualizacionComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo utilizado para modificar los datos en el componente.
   * Este formulario se inicializa con los controles necesarios para la actualización
   * de la información en el flujo correspondiente.
   */
  modificarFormulario!: FormGroup;

  /**
   * Representa una lista de trámites con información adicional.
   * 
   * @property {TramiteList[]} catalogos - Una lista de catálogos relacionados con los trámites.
   * @property {string} labelNombre - Etiqueta que representa el nombre asociado a los trámites.
   * @property {string} primerOpcion - La primera opción seleccionable en la lista de trámites.
   */
  tramiteList: {
    catalogos: TramiteList[];
    labelNombre: string;
    primerOpcion: string;
  };

  /**
   * Representa la información relacionada con la aduana.
   * 
   * @property {Catalogo[]} catalogos - Lista de catálogos asociados a la aduana.
   * @property {string} labelNombre - Etiqueta que representa el nombre de la aduana.
   * @property {string} primerOpcion - Primera opción seleccionable en el contexto de la aduana.
   */
  aduana: {
    catalogos: Catalogo[];
    labelNombre: string;
    primerOpcion: string;
  };

  /**
   * Representa la información relacionada con la comprobante.
   * 
   * @property {Catalogo[]} catalogos - Lista de catálogos asociados a la comprobante.
   * @property {string} labelNombre - Etiqueta que representa el nombre de la comprobante.
   * @property {string} primerOpcion - Primera opción seleccionable en el contexto de la comprobante.
   */
  comprobante: {
    catalogos: Catalogo[];
    labelNombre: string;
    primerOpcion: string;
  };

  /**
   * Sujeto utilizado como notificador para la destrucción del componente.
   * Se emite un valor cuando el componente se destruye, permitiendo cancelar
   * suscripciones o liberar recursos asociados.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud32101State;

  configuracionTablaDatos: DatosDeLaTabla[] = [];

  /**
   * Referencia al modal para agregar mercancías.
   */
  @ViewChild('modalModificar', { static: false }) modalRef!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private consultaAvisoAcreditacionService: ConsultaAvisoAcreditacionService,
    public tramite32101Store: Tramite32101Store,
    private tramite32101Query: Tramite32101Query
  ) {
    this.tramiteList = {
      catalogos: [],
      labelNombre: 'Tipo de inversión',
      primerOpcion: 'Seleccione una opción',
    };

    this.aduana = {
      catalogos: [],
      labelNombre: 'Forma de adquisición',
      primerOpcion: 'Seleccione una opción',
    };

    this.comprobante = {
      catalogos: [],
      labelNombre: 'Comprobante',
      primerOpcion: 'Seleccione una opción',
    };
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Suscribe al observable `selectSolicitud$` del servicio `tramite32101Query` para obtener el estado de la solicitud
   *   y lo asigna a la propiedad `solicitudState`. La suscripción se gestiona con `takeUntil` para evitar fugas de memoria.
   * - Inicializa el formulario llamando al método `initForm`.
   * - Obtiene la lista de documentos necesarios llamando a `fetchListaDeDocumentos`.
   * - Obtiene la lista de inversiones llamando a `fetchListaDeInversion`.
   */
  ngOnInit(): void {
    this.tramite32101Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.initForm();
    this.fetchListaDeDocumentos();
    this.fetchListaDeInversion();
    this.fetchListaDeComprobante();
  }

    /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Cancela todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Inicializa el formulario `modificarFormulario` con un conjunto de controles de formulario.
   * 
   * Los controles incluyen:
   * - `tipoDeInversion`: Campo vacío inicialmente.
   * - `descripcionGeneral`: Campo inicializado con el valor de `descripcionGeneral` del estado de la solicitud (`solicitudState.abc`).
   * - `valorEnPesos`: Campo inicializado con el valor de `valorEnPesos` del estado de la solicitud (`solicitudState.abc`).
   * - `formaAdquisicion`: Campo vacío inicialmente.
   * 
   * Utiliza el servicio `FormBuilder` para crear el grupo de controles.
   */
  initForm(): void {
    const SELECTED_ROW = this.solicitudState.abc;
    this.modificarFormulario = this.fb.group({
      tipoDeInversion: [SELECTED_ROW?.tipoDeInversion],
      descripcionGeneral: [SELECTED_ROW?.descripcionGeneral],
      valorEnPesos: [SELECTED_ROW?.valorEnPesos],
      formaAdquisicion: [SELECTED_ROW?.formaAdquisicion],
      comprobante: [SELECTED_ROW?.comprobante],
    });
  }

  /**
   * Maneja el evento de input para campos numéricos
   * @param event Evento de input
   */
  onNumericInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(REGEX_NUMEROS, '');
  }

  /**
   * Obtiene la lista de documentos relacionados con el trámite y actualiza el formulario
   * con el valor correspondiente al tipo de inversión seleccionado.
   *
   * @remarks
   * Este método utiliza el servicio `consultaAvisoAcreditacionService` para obtener
   * la lista de documentos asociados al identificador 'listaDeInversion'. Los datos
   * obtenidos se asignan al catálogo del trámite y se busca el valor correspondiente
   * al tipo de inversión especificado en el estado de la solicitud. Finalmente, se
   * actualiza el formulario con el identificador del tipo de inversión encontrado.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  fetchListaDeDocumentos(): void {
    this.consultaAvisoAcreditacionService
      .getListaDeDocumentos('listaDeInversion')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.tramiteList.catalogos = respuesta.data;
        const VALOR1 = this.tramiteList.catalogos.find(
          (res) => res.descripcion === this.solicitudState.abc?.tipoDeInversion
        );
        this.modificarFormulario.patchValue({
          tipoDeInversion: VALOR1?.id,
        });
      });
  }

  /**
   * Obtiene la lista de documentos relacionados con la inversión y actualiza el formulario
   * con los valores correspondientes basados en la selección del usuario.
   *
   * Este método realiza una consulta al servicio `consultaAvisoAcreditacionService` para
   * obtener los documentos disponibles. Luego, filtra los resultados para encontrar el documento
   * que coincide con la descripción de la forma de adquisición seleccionada en el estado de la solicitud.
   * Finalmente, actualiza el formulario con el identificador del documento encontrado.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  fetchListaDeInversion(): void {
    this.consultaAvisoAcreditacionService
      .getListaDeDocumentos('listaDeDocumentos')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.aduana.catalogos = data.data;
        const VALOR2 = this.aduana.catalogos.find(
          (res) => res.descripcion === this.solicitudState.abc?.formaAdquisicion
        );
        this.modificarFormulario.patchValue({
          formaAdquisicion: VALOR2?.id,
        });
      });
  }

  /**
   * Obtiene la lista de documentos relacionados con la comprobante y actualiza el formulario
   * con los valores correspondientes basados en la selección del usuario.
   *
   * Este método realiza una consulta al servicio `consultaAvisoAcreditacionService` para
   * obtener los documentos disponibles. Luego, filtra los resultados para encontrar el documento
   * que coincide con la descripción de la comprobante seleccionada en el estado de la solicitud.
   * Finalmente, actualiza el formulario con el identificador del documento encontrado.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  fetchListaDeComprobante(): void {
    this.consultaAvisoAcreditacionService
      .getListaDeDocumentos('listaDeComprobante')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.comprobante.catalogos = respuesta.data;
        const VALOR3 = this.comprobante.catalogos.find(
          (res) => res.descripcion === this.solicitudState.abc?.comprobante
        );
        this.modificarFormulario.patchValue({
          comprobante: VALOR3?.id,
        });
      });
  }

  /**
   * Obtiene la etiqueta de un elemento seleccionado en un catálogo.
   *
   * @param selectedId - El identificador del elemento seleccionado.
   * @param catalog - Una lista de objetos del catálogo que contiene los elementos disponibles.
   * @returns La descripción del elemento seleccionado si se encuentra en el catálogo, 
   *          de lo contrario, devuelve una cadena vacía.
   */
  static getDropdownLabel(selectedId: number, catalog: Catalogo[]): string {
    const SELECTED_ITEMS = catalog.find((item) => item.id === selectedId);
    return SELECTED_ITEMS ? SELECTED_ITEMS.descripcion : '';
  }

  /**
   * Maneja el evento para guardar los cambios realizados en el formulario de modificación.
   * 
   * Este método crea un objeto `datosDeLaTabla` con los valores actualizados del formulario
   * y lo envía al servicio `consultaAvisoAcreditacionService` para actualizar la fila correspondiente.
   * 
   */  
  onGuardarCambios(): void {
    const UPDATED_ROW: DatosDeLaTabla = {
      id: this.solicitudState.abc?.id ?? 0,
      tipoDeInversion: ComponenteDeActualizacionComponent.getDropdownLabel(
        this.modificarFormulario.value.tipoDeInversion,
        this.tramiteList.catalogos
      ),
      descripcionGeneral: this.modificarFormulario.value.descripcionGeneral,
      formaAdquisicion: ComponenteDeActualizacionComponent.getDropdownLabel(
        this.modificarFormulario.value.formaAdquisicion,
        this.aduana.catalogos
      ),
      valorEnPesos: this.modificarFormulario.value.valorEnPesos,
      comprobante: 'N/A',
    };
    
    this.consultaAvisoAcreditacionService.setUpdatedRow([UPDATED_ROW]);
    this.cerrarModal();
  }  
  
  /**
   * Abre el modal y carga los datos de la fila seleccionada
   */
  abrirModal(selectedRow: DatosDeLaTabla): void {
    this.modificarFormulario.patchValue({
      tipoDeInversion: this.getIdFromDescription(selectedRow.tipoDeInversion, this.tramiteList.catalogos),
      valorEnPesos: selectedRow.valorEnPesos,
      descripcionGeneral: selectedRow.descripcionGeneral,
      formaAdquisicion: this.getIdFromDescription(selectedRow.formaAdquisicion, this.aduana.catalogos)
    });

    if (this.modalRef?.nativeElement) {
      const MODAL = new (window).bootstrap.Modal(this.modalRef.nativeElement);
      MODAL.show();
    }
  }

  /**
   * Cierra el modal si está abierto.
   */
  cerrarModal(): void {
    if (this.modalRef?.nativeElement) {
      const CERRAR_MODAL = (window).bootstrap.Modal.getInstance(this.modalRef.nativeElement);
      if (CERRAR_MODAL) {
        CERRAR_MODAL.hide();
      }
    }
  }

  /**
   * Maneja el evento de cancelar la modificación.
   * Cierra el modal sin guardar cambios.
   */
  onCancelar(): void {
    this.cerrarModal();
  }

  /**
   * Obtiene el ID de un elemento basado en su descripción
   */
  private getIdFromDescription(description: string, catalog: Catalogo[]): number | null {
    const ITEM = catalog.find(cat => cat.descripcion === description);
    return ITEM ? ITEM.id : null;
  }
}
