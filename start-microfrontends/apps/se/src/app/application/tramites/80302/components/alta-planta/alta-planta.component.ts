import { Catalogo, TablaSeleccion } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CONFIGURACION_DOMICILIOS } from '../../../80308/constantes/modificacion.enum';
import { CommonModule } from '@angular/common';
import { ComplementariaImmexComponent } from '../complementaria-immex/complementaria-immex.component';
import { ConfiguracionColumna } from '../../../80308/models/configuracio-columna.model';
import { DomicilioInfo } from '../../../80308/models/plantas-consulta.model';
import { ModificacionSolicitudeService } from '../../../80308/services/modificacion-solicitude.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80308Query } from '../../../80308/estados/tramite80308.query';
import { Tramite80308Store } from '../../../80308/estados/tramite80308.store';

/**
 * Componente para el alta de plantas en el trámite 80302.
 * 
 * @export
 * @class AltaPlantaComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-alta-planta',
  templateUrl: './alta-planta.component.html',
  styleUrls: ['./alta-planta.component.scss'],
  standalone: true,
  imports: [
    ComplementariaImmexComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [ModificacionSolicitudeService, ToastrService],
})
export class AltaPlantaComponent implements OnInit, OnDestroy {
  /**
   * Formulario que contiene el grupo de controles para la entidad federativa.
   * 
   * @type {FormGroup}
   * @memberof AltaPlantaComponent
   */
  formulario: FormGroup;

  /**
   * Lista de catálogos que representan los estados.
   * 
   * @type {Observable<Catalogo[]>}
   * @memberof AltaPlantaComponent
   */
  estados$!: Observable<Catalogo[]>

  /**
   * Estado seleccionado.
   * 
   * @type {Catalogo}
   * @memberof AltaPlantaComponent
   */
  estado!: Catalogo;

  /**
   * Lista de domicilios disponibles.
   * 
   * @type {Observable<DomicilioInfo[]>}
   * @memberof AltaPlantaComponent
   */
  domicilios$!: Observable<DomicilioInfo[]>;

  /**
   * Lista de domicilios seleccionados.
   * 
   * @type {DomicilioInfo[]}
   * @memberof AltaPlantaComponent
   */
  domiciliosSeleccionados: DomicilioInfo[] = [];

  /**
   * Variable para definir el tipo de selección en la tabla (por defecto es RADIO).
   * 
   * @type {TablaSeleccion}
   * @memberof AltaPlantaComponent
   */
  tablaSeleccion: TablaSeleccion = TablaSeleccion.RADIO;

  /**
   * Configuración de las columnas de la tabla, utilizando el tipo DomicilioInfo.
   * 
   * @type {ConfiguracionColumna<DomicilioInfo>[]}
   * @memberof AltaPlantaComponent
   */
  configuracionTabla: ConfiguracionColumna<DomicilioInfo>[] =
    CONFIGURACION_DOMICILIOS;

  /**
   * Datos de ejemplo basados en la interfaz DomicilioInfo.
   * 
   * @type {Observable<DomicilioInfo[]>}
   * @memberof AltaPlantaComponent
   */
  datos$: Observable<DomicilioInfo[]>;

  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * 
   * @private
   * @type {Subject<void>}
   * @memberof AltaPlantaComponent
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor de la clase AltaPlantaComponent.
   * Inicializa el formulario y configura las suscripciones a los observables.
   * 
   * @param {FormBuilder} fb - El servicio para construir formularios reactivos
   * @param {ModificacionSolicitudeService} modificionService - Servicio para la modificación de solicitudes
   * @param {ToastrService} toastr - Servicio para mostrar notificaciones
   * @param {Tramite80308Store} store - Store para gestionar el estado del trámite
   * @param {Tramite80308Query} tramiteQuery - Query para consultar el estado del trámite
   * @memberof AltaPlantaComponent
   */
  constructor(
    private fb: FormBuilder,
    public modificionService: ModificacionSolicitudeService,
    private toastr: ToastrService,
    private store: Tramite80308Store,
    private tramiteQuery: Tramite80308Query
  ) {

    // Inicialización del formulario para la entidad federativa.
    this.formulario = this.fb.group({
      entidadFederativa: ['', [Validators.required, Validators.min(0)]],
    });
   
    this.tramiteQuery.selectEstado$.pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe(estado => {
      if(estado) {
        this.formulario.patchValue({
          entidadFederativa: estado.id
        });
      }
      this.store.setFormValida({entidadFederativa: this.formulario.valid})
    });
    this.datos$ = this.tramiteQuery.selectBuscarDomicilios$;
    this.estados$ = this.tramiteQuery.selectAltaPlanta$;
    this.domicilios$ = this.tramiteQuery.selectDomicilios$;
  }

  /**
   * Getter para obtener el control del formulario de la entidad federativa.
   * 
   * @returns {FormControl} El control para la entidad federativa
   * @memberof AltaPlantaComponent
   */
  get formularioControl(): FormControl {
    return this.formulario.get('entidadFederativa') as FormControl;
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Carga la lista de estados.
   * 
   * @returns {void}
   * @memberof AltaPlantaComponent
   */
  ngOnInit(): void {
    this.cargarEstados();
  }

  /**
   * Método para cargar los estados mediante el servicio.
   * Realiza una llamada al servicio para obtener la lista de estados.
   * 
   * @returns {void}
   * @memberof AltaPlantaComponent
   */
  cargarEstados(): void {
    this.modificionService
      .obtenerListaEstado()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (response) => {
          this.store.setaltaPlanta(response.datos);
        },
        (error) => {
          console.error('Error al cargar los estados:', error);
        }
      );
  }

  /**
   * Método para buscar domicilios según la entidad seleccionada en el formulario.
   * Realiza una llamada al servicio para obtener los domicilios de la entidad seleccionada.
   * 
   * @returns {void}
   * @memberof AltaPlantaComponent
   */
  buscarDomicilios(): void {
    const ENTIDAD = this.formularioControl?.value;

    if (ENTIDAD && ENTIDAD !== '-1') {
      this.modificionService
        .obtenerDomicilios()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe(
          (data: DomicilioInfo[]) => {
            this.store.setbuscarDomicilios(data);
          },
          () => {
            this.toastr.error('Error al buscar domicilios')
          }
        );
    } else {
      // Maneja el caso donde la selección de la entidad no es válida.
      this.toastr.error('Seleccione una entidad federativa válida.')
    }
  }

  /**
   * Método para seleccionar un domicilio de la lista.
   * 
   * @param {DomicilioInfo} domicilios - El domicilio que se selecciona
   * @returns {void}
   * @memberof AltaPlantaComponent
   */
  seleccionarDomicilios(domicilios: DomicilioInfo): void {
    this.domiciliosSeleccionados = [{ ...domicilios }];
  }

  /**
   * Método para aplicar la acción seleccionada, asignando los domicilios seleccionados.
   * 
   * @returns {void}
   * @memberof AltaPlantaComponent
   */
  aplicarAccion(): void {
    if(this.domiciliosSeleccionados.length) {
      this.store.aggregarDomicilios(this.domiciliosSeleccionados[0]);
    }
  }

  /**
   * Método para eliminar una planta de los domicilios seleccionados.
   * 
   * @param {DomicilioInfo} plantas - El domicilio que se quiere eliminar
   * @returns {void}
   * @memberof AltaPlantaComponent
   */
  eliminarPlantas(): void {
    if(this.domiciliosSeleccionados.length) {
      this.store.eliminarDomicilios(this.domiciliosSeleccionados[0]);
    }
  }

  /**
   * Establece el estado en el almacén (store) con el valor proporcionado.
   * 
   * @param {Catalogo} estado - El estado que se desea establecer en el almacén. Este parámetro debe ser de tipo `Catalogo`
   * @returns {void} - No devuelve ningún valor
   * @memberof AltaPlantaComponent
   */
  tipoEstadoSeleccion(estado: Catalogo): void {
    this.store.setEstado(estado);
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Utiliza un Subject para notificar a todos los observables suscritos que deben completarse.
   * Esto ayuda a evitar posibles fugas de memoria al completar el Subject y finalizar las suscripciones.
   * 
   * @returns {void}
   * @memberof AltaPlantaComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
