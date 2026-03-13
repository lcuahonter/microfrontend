import { Catalogo,ConsultaioQuery,TituloComponent } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { Observable,Subject,map} from 'rxjs';
import { Tramite120401State, Tramite120401Store } from '../../estados/tramites/tramite120401.store';
import { doDeepCopy, esValidArray, esValidObject } from '@ng-mf/data-access-user';
import { AlertComponent } from '@ng-mf/data-access-user';
import { AsignacionDirectaCupoPersonasFisicasPrimeraVezService } from '../../services/asignacion-directa-cupo-personas-fisicas-primera-vez.service';
import { CONFIGURACION_CUPOS_DISPONIBLES_TABLA } from '../../constants/asignacion-directa-cupo.enums';
import { CantidadSolicitadaComponent } from '../cantidad-solicitada/cantidad-solicitada.component';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '../../models/configuracio-columna.model';
import { DescripcionDelCupoComponent } from '../descripcion-del-cupo/descripcion-del-cupo.component';
import { NgIf } from '@angular/common';
import { SeleccionDelCupoTabla, SolicitudResponse } from '../../models/asignacion-directa-cupo.model';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { Tramite120401Query } from '../../estados/queries/tramite120401.query';
import { takeUntil } from 'rxjs';

/**
 * Componente para la selección del cupo en el sistema.
 * Permite seleccionar régimen aduanero, tratado comercial, nombreProducto y nombreSubproducto.
 */
@Component({
  selector: 'app-seleccion-del-cupo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
    NgIf,
    TablaDinamicaComponent,
    AlertComponent,
    DescripcionDelCupoComponent,
    CantidadSolicitadaComponent
  ],
  templateUrl: './seleccion-del-cupo.component.html',
  styleUrls: ['./seleccion-del-cupo.component.scss'],
})

/**
 * Componente para la selección del cupo en el sistema.
 * Permite seleccionar régimen aduanero, tratado comercial, nombreProducto y nombreSubproducto.
 */
export class SeleccionDelCupoComponent implements OnInit, OnDestroy {
  /**
   * Indica si se debe mostrar la descripción del cupo.
   * Esta propiedad controla la visibilidad de la sección
   * que muestra información adicional sobre el cupo seleccionado.
   */
  mostrarDescripcionDelCupo = false;
  /**
   * Representa la fila seleccionada en la tabla de selección del cupo.
   * Puede ser un objeto de tipo `SeleccionDelCupoTabla` o `null` si no hay ninguna fila seleccionada.
   */
  filaSeleccionada: SeleccionDelCupoTabla | null = null;
  /**
   * Indica si la descripción del elemento es visible o no.
   *
   * @type {boolean}
   * @default false
   */
  DescipcionDelVisible = false;

  /**
   * Configuración para la tabla que muestra los cupos disponibles.
   * Esta propiedad es un arreglo de configuraciones de columnas, donde cada columna
   * está definida por la interfaz `ConfiguracionColumna` y adaptada al modelo de datos
   * `SeleccionDelCupoTabla`.
   *
   * La configuración se inicializa con los ajustes predefinidos de
   * `CONFIGURACION_CUPOS_DISPONIBLES_TABLA`.
   */
  configuracionTabla: ConfiguracionColumna<SeleccionDelCupoTabla>[] =
    CONFIGURACION_CUPOS_DISPONIBLES_TABLA;

  /**
   * Arreglo que contiene los datos de la tabla de selección del cupo.
   * Cada elemento del arreglo es de tipo `SeleccionDelCupoTabla`.
   */
  datos: SeleccionDelCupoTabla[] = [];
  /**
   * Formulario reactivo para la selección del cupo.
   */
  seleccionForm!: FormGroup;

  /**
   * Lista de opciones para el campo de régimen aduanero.
   */
  regimen: Catalogo[] = [];

  /**
   * Lista de opciones para el campo de tratado o bloque comercial.
   */
  tratado: Catalogo[] = [];

  /**
   * Lista de opciones para el campo de nombre de nombreProducto.
   */
  nombreProducto: Catalogo[] = [];

  /**
   * Lista de opciones para el campo de nombre de nombreSubproducto.
   */
  nombreSubproducto: Catalogo[] = [];

  /**
   * Datos de la selección del cupo obtenidos desde el servicio.
   */
  seleccionDelCupo: Catalogo[] = [];

  /**
   * Observable para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

     /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @property {Observable<Catalogo | null>} regimen$
   * Observable que emite el valor actual del régimen seleccionado en el estado.
   */
  regimen$: Observable<Catalogo | null> = this.tramite120401Query.regimen$;

  /**
   * @property {Observable<Catalogo | null>} tratado$
   * Observable que emite el valor actual del tratado seleccionado en el estado.
   */
  tratado$: Observable<Catalogo | null> = this.tramite120401Query.tratado$;

  /**  * @property {CantidadSolicitadaComponent} cantidadSolicitadaComponent
   * Referencia al componente hijo que maneja la cantidad solicitada.
   */
  @ViewChild(CantidadSolicitadaComponent) cantidadSolicitadaComponent!: CantidadSolicitadaComponent;

  /**
   * @property {Observable<Catalogo | null>} nombreProducto$
   * Observable que emite el valor actual del nombreProducto seleccionado en el estado.
   */
  nombreProducto$: Observable<Catalogo | null> = this.tramite120401Query.nombreProducto$;

  /**
   * @property {Observable<Catalogo | null>} nombreSubproducto$
   * Observable que emite el valor actual del nombreSubproducto seleccionado en el estado.
   */
  nombreSubproducto$: Observable<Catalogo | null> =
    this.tramite120401Query.nombreSubproducto$;

  /**
   * Almacena la última fila seleccionada en la tabla de selección de cupo. 
   * Si no se ha seleccionado ninguna fila, su valor es null.
   */
  lastClickedRow: SeleccionDelCupoTabla | null = null;

/**
 * Constructor del componente SeleccionDelCupoComponent.
 * Inicializa los servicios y suscripciones necesarias para el funcionamiento del componente.
 *
 * @param fb - Servicio FormBuilder para la creación de formularios reactivos.
 * @param service - Servicio para obtener datos relacionados con la asignación directa de cupos.
 * @param tramite120401Store - Store para manejar el estado del trámite 120401.
 * @param tramite120401Query - Query para consultar el estado del trámite 120401.
 * @param consultaQuery - Query para consultar el estado de la consulta IO.
 */
  constructor(
    private fb: FormBuilder,
    private service: AsignacionDirectaCupoPersonasFisicasPrimeraVezService,
    private tramite120401Store: Tramite120401Store,
    private tramite120401Query: Tramite120401Query,
    private consultaQuery: ConsultaioQuery,
  ) {
    //constructor
  }

  /**
   * Método de ciclo de vida de Angular: Se ejecuta cuando el componente es inicializado.
   * Inicializa el formulario y carga los datos de la selección del cupo.
   */
  ngOnInit(): void {
    this.initializeForm();
    this.loadSeleccionDelCupo();
    this.loadRegimen();
    this.loadTratado();
    this.loadProducto();
    this.loadSubProducto();

    this.tramite120401Query.tramiteState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((state) => {
        if (state) {
          this.seleccionForm.patchValue({
            regimen: state.regimen,
            tratado: state.tratado,
            nombreProducto: state.nombreProducto,
            nombreSubproducto: state.nombreSubproducto,
          });
          this.datos = state.datos;
        }
      });

      
            this.consultaQuery.selectConsultaioState$
            .pipe(
              takeUntil(this.destroyed$),
              map((seccionState) => {
                this.esFormularioSoloLectura = seccionState.readonly;
                this.inicializarEstadoFormulario();
              })
            )
            .subscribe();
  }

   
        /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
     inicializarEstadoFormulario(): void {
      if(!this.seleccionForm){
        this.initializeForm();
      }
      if (this.esFormularioSoloLectura) {
          this.seleccionForm.disable();
      }
    }

  /**
   * Método de ciclo de vida de Angular: Se ejecuta cuando el componente es destruido.
   * Libera recursos y evita fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Inicializa el formulario de selección del cupo con validaciones requeridas.
   */
  private initializeForm(): void {
    this.seleccionForm = this.fb.group({
      regimen: [''],
      tratado: [''],
      nombreProducto: [''],
      nombreSubproducto: [''],
    });
  }

  /**
   * Maneja el cambio en el campo de régimen aduanero.
   * @param event - Evento de cambio.
   */
  loadRegimen(): void {
    this.service
      .getRegimen()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if(esValidObject(data)) {
          const RESPONSE = doDeepCopy(data);
          if(esValidArray(RESPONSE.datos)) {
            this.regimen = RESPONSE.datos;
          }
        }
      });
  }

  /**
   * Maneja el cambio en el campo de tratado o bloque comercial.
   * @param event - Evento de cambio.
   */
  loadTratado(): void {
    this.service
    .getTratado()
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      if(esValidObject(data)) {
        const RESPONSE = doDeepCopy(data);
        if(esValidArray(RESPONSE.datos)) {
          this.tratado = RESPONSE.datos;
        }
      }
    });
  }

  /**
   * Maneja el cambio en el campo de nombre del nombreProducto.
   * @param event - Evento de cambio.
   */
  loadProducto(): void {
    this.service
    .getProducto()
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      if(esValidObject(data)) {
        const RESPONSE = doDeepCopy(data);
        if(esValidArray(RESPONSE.datos)) {
          this.nombreProducto = RESPONSE.datos;
        }
      }
    });
  }

  /**
   * Maneja el cambio en el campo de nombre del nombreSubproducto.
   * @param event - Evento de cambio.
   */ 
  loadSubProducto(): void {
    this.service
    .getSubProducto()
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      if(esValidObject(data)) {
        const RESPONSE = doDeepCopy(data);
        if(esValidArray(RESPONSE.datos)) {
          this.nombreSubproducto = RESPONSE.datos;
        }
      }
    });
  }

  /**
   * Maneja el cambio en el campo de nombre del nombreSubproducto.
   * @param event - Evento de cambio.
   */

  /**
   * Carga los datos de la selección del cupo desde el servicio.
   * Los datos obtenidos se asignan a la variable `seleccionDelCupo`.
   */
  loadSeleccionDelCupo(): void {
    this.service
      .getSeleccionDelCupo()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.seleccionDelCupo = data;
      });
  }

  /**
   * Obtiene el valor seleccionado del campo de régimen aduanero y lo establece en el store.
   */
  getRegimen(): void {
    const SELECTED_REGIMEN = this.seleccionForm.get('regimen')?.value;
    this.tramite120401Store.setRegimen(SELECTED_REGIMEN);
  }

  /**
   * Obtiene el valor seleccionado del campo de tratado comercial y lo establece en el store.
   */
  getTratado(): void {
    const SELECTED_TRATADO = this.seleccionForm.get('tratado')?.value;
    this.tramite120401Store.setTratado(SELECTED_TRATADO);
  }

  /**
   * Obtiene el valor seleccionado del campo de nombreProducto y lo establece en el store.
   */
  obtenerValorProducto(): void {
   const SELECTED_PRODUCTO = this.seleccionForm.get('nombreProducto')?.value;
    this.tramite120401Store.setProducto(SELECTED_PRODUCTO);
  }

  /**
   * Obtiene el valor seleccionado del campo de nombreSubproducto y lo establece en el store.
   */
  getSubproducto(): void {
    const SELECTED_SUBPRODUCTO = this.seleccionForm.get('nombreSubproducto')?.value;
    this.tramite120401Store.setSubproducto(SELECTED_SUBPRODUCTO);
  }

  /**
   * Maneja la selección de una fila en la tabla de selección del cupo.
   *
   * @param fila - Objeto de tipo `SeleccionDelCupoTabla` que representa la fila seleccionada.
   *
   * Este método actualiza la propiedad `filaSeleccionada` con la fila proporcionada
   * y alterna el estado de visibilidad de la descripción del cupo mediante la propiedad
   * `mostrarDescripcionDelCupo`.
   */
  listaDeFilaSeleccionada(fila: SeleccionDelCupoTabla): void {
    let DATOS: Tramite120401State | null = null;
    this.tramite120401Query.tramiteState$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((state: Tramite120401State | null) => {
      if (state) {
        DATOS = state;
      }
    });
    if (this.filaSeleccionada !== fila || !this.mostrarDescripcionDelCupo) {
      const PAYLOAD = {
        idTratadoAcuerdo: fila?.idTratadoAcuerdo && fila?.idTratadoAcuerdo !== null ? fila?.idTratadoAcuerdo : 0,
        rfc: "AAL0409235E6",
        idMecanismoAsignacion: typeof fila?.idMecanismoAsignacion !== 'undefined' ? fila?.idMecanismoAsignacion : null,
        claveRegimen: typeof fila?.claveRegimen !== 'undefined' ? fila?.claveRegimen : null,
        producto: typeof fila?.nombreProducto !== 'undefined' ? fila?.nombreProducto : null,
        subproducto: typeof fila?.nombreSubproducto !== 'undefined' ? fila?.nombreSubproducto : null,
        rfcBeneficiario: null,
        claveUnidadAdministrativa: (DATOS as unknown as Tramite120401State).representacion
      }
    this.service.obtenerTablaRowDatos(PAYLOAD)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((response) => {
      if(esValidObject(response)) {
        const RESPONSE = doDeepCopy(response);    
        this.tramite120401Store.setDescriptionCupoDisponible(RESPONSE.datos as SolicitudResponse); 
        this.filaSeleccionada = fila;
        this.mostrarDescripcionDelCupo = true;
      }

    })
  }
  }

/**
 * Busca cupos disponibles basado en los valores seleccionados en el formulario.
 * Los resultados se almacenan en la propiedad `datos` para ser mostrados en la tabla dinámica.
 */

buscarCupos(): void {
  const VALORES_FORMULARIO = this.seleccionForm.value;
  let DATOS: Tramite120401State | null = null;
  this.tramite120401Query.tramiteState$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((state: Tramite120401State | null) => {
      if (state) {
        DATOS = state;
      }
    });
  if(DATOS && (DATOS as Tramite120401State).representacion && (DATOS as Tramite120401State).entidad){
    const PAYLOAD = {
      idTratadoAcuerdo: VALORES_FORMULARIO.tratado && VALORES_FORMULARIO.tratado !== '' ? VALORES_FORMULARIO.tratado : 0,
      claveRegimen:VALORES_FORMULARIO.regimen,
      producto:VALORES_FORMULARIO.nombreProducto,
      subproducto:VALORES_FORMULARIO.nombreSubproducto,
      rfcBeneficiario:null,
      claveUnidadAdministrativa:(DATOS as Tramite120401State).representacion
    }
    this.service.obtenerBuscarCupos(PAYLOAD)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((response) => {
      if(esValidObject(response)) {
        const RESPONSE = doDeepCopy(response);
        if(esValidArray(RESPONSE.datos)) {
          this.datos = RESPONSE.datos as SeleccionDelCupoTabla[];
          this.tramite120401Store.setDatos(this.datos);
        }
      }

    })
  }


}

/**
 * Maneja el evento de doble clic en una celda de la tabla. 
 * Determina la fila seleccionada a partir del evento y llama al método `listaDeFilaSeleccionada` 
 * pasando el elemento correspondiente de `datos`.
 */
onTablaDblClick(evt: MouseEvent): void {
  const TD = (evt.target as HTMLElement).closest('td');
  if (!TD) { return; }

  const TR = TD.parentElement;
  if (!TR) { return; }

  const TABLE = TR.closest('table');
  if (!TABLE) { return; }

  const TBODY = TABLE.querySelector('tbody');
  if (!TBODY) { return; }

  const ROWS = Array.from(TBODY.querySelectorAll('tr'));
  const ROW_INDEX = ROWS.indexOf(TR as HTMLTableRowElement);

  if (ROW_INDEX >= 0 && ROW_INDEX < this.datos.length) {
    const MATCH = this.datos[ROW_INDEX];
    if (MATCH) {
      this.tramite120401Store.setDescriptionCupo(MATCH);
      this.listaDeFilaSeleccionada(MATCH);
    }
  }
}

}
