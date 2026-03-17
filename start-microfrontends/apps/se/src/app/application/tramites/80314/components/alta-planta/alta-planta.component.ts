import { Catalogo, ConfiguracionColumna, TablaSeleccion } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CONFIGURACION_DOMICILIOS } from '../../constantes/modificacion.enum';
import { CommonModule } from '@angular/common';
import { ComplementariaImmexComponent } from '../complementaria-immex/complementaria-immex.component';
import { DomicilioInfo } from '../../estados/models/plantas-consulta.model';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80314Query } from '../../estados/tramite80314.query';
import { Tramite80314Store } from '../../estados/tramite80314.store';

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
  providers: [ImmerModificacionService, ToastrService],
})
export class AltaPlantaComponent implements OnInit, OnDestroy {
  /**
   * Formulario que contiene el grupo de controles para la entidad federativa.
   */
  formulario: FormGroup;

  /**
   * Lista de catálogos que representan los estados.
   * @type {Observable<Catalogo[]>}
   */
  estados$!: Observable<Catalogo[]>

  /**
   * Estado seleccionado.
   * @type {Catalogo}
   */
  estado!: Catalogo;

  /**
   * Lista de domicilios disponibles.
   * @type {Observable<DomicilioInfo[]>}
   */
  domicilios$!: Observable<DomicilioInfo[]>;

  /**
   * Lista de domicilios seleccionados.
   * @type {DomicilioInfo[]}
   */
  domiciliosSeleccionados: DomicilioInfo[] = [];

  /**
   * Variable para definir el tipo de selección en la tabla (por defecto es RADIO).
   * @type {TablaSeleccion}
   */
  tablaSeleccion: TablaSeleccion = TablaSeleccion.RADIO;

  /**
   * Configuración de las columnas de la tabla, utilizando el tipo DomicilioInfo.
   * @type {ConfiguracionColumna<DomicilioInfo>[]}
   */
  configuracionTabla: ConfiguracionColumna<DomicilioInfo>[] =
    CONFIGURACION_DOMICILIOS;

  /**
   * Datos de ejemplo basados en la interfaz DomicilioInfo.
   * @type {Observable<DomicilioInfo[]>}
   */
  datos$: Observable<DomicilioInfo[]>;

  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor de la clase.
   * @param {FormBuilder} fb - El servicio para construir formularios reactivos.
   * @param {ModificacionSolicitudeService} modificionService - Servicio para la modificación de solicitudes.
   */
  constructor(
    private fb: FormBuilder,
    public modificionService: ImmerModificacionService,
    private toastr: ToastrService,
    private store: Tramite80314Store,
    private tramiteQuery: Tramite80314Query
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
   * @returns {FormControl} El control para la entidad federativa.
   */
  get formularioControl(): FormControl {
    return this.formulario.get('entidadFederativa') as FormControl;
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Carga la lista de estados.
   */
  ngOnInit(): void {
    this.cargarEstados();
  }

  /**
   * Método para cargar los estados mediante el servicio.
   * Realiza una llamada al servicio para obtener la lista de estados.
   */
  cargarEstados(): void {
    this.modificionService.obtenerListaEstado().pipe(takeUntil(this.destroyNotifier$)).subscribe(
        (data: Catalogo[]) => {
          this.store.setaltaPlanta(data);
        }
      );
  }

  /**
   * Método para buscar domicilios según la entidad seleccionada en el formulario.
   * Realiza una llamada al servicio para obtener los domicilios de la entidad seleccionada.
   */
  buscarDomicilios(): void {
    const ENTIDAD = this.formularioControl?.value;

    if (ENTIDAD && ENTIDAD !== '-1') {
      this.modificionService.obtenerDomicilios().pipe(takeUntil(this.destroyNotifier$)).subscribe(
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
   * @param {DomicilioInfo} domicilios - El domicilio que se selecciona.
   */
  seleccionarDomicilios(domicilios: DomicilioInfo): void {
    this.domiciliosSeleccionados = [{ ...domicilios }];
  }

  /**
   * Método para aplicar la acción seleccionada, asignando los domicilios seleccionados.
   */
  aplicarAccion(): void {
    if(this.domiciliosSeleccionados.length) {
      this.store.aggregarDomicilios(this.domiciliosSeleccionados[0]);
    }
  }

  /**
   * Método para eliminar una planta de los domicilios seleccionados.
   * @param {DomicilioInfo} plantas - El domicilio que se quiere eliminar.
   */
  eliminarPlantas(): void {
    if(this.domiciliosSeleccionados.length) {
      this.store.eliminarDomicilios(this.domiciliosSeleccionados[0]);
    }
  }

  /**
   * Establece el estado en el almacén (store) con el valor proporcionado.
   * 
   * @param {Catalogo} estado - El estado que se desea establecer en el almacén. Este parámetro debe ser de tipo `Catalogo`.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  tipoEstadoSeleccion(estado: Catalogo): void {
    this.store.setEstado(estado);
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Utiliza un Subject para notificar a todos los observables suscritos que deben completarse.
   * Esto ayuda a evitar posibles fugas de memoria al completar el Subject y finalizar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
