/**
 * @fileoverview Componente para gestión de modificaciones del trámite 80302
 * @author Sistema VUCEM
 * @version 1.0.0
 * @since 2024
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, ConsultaioQuery, ConsultaioState, SolicitanteQuery, SolicitanteState, TablaDinamicaComponent, TablaSeleccion, TituloComponent, doDeepCopy, esValidArray, esValidObject } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Solicitud80302State, Tramite80302Store } from '../../../../estados/tramites/tramite80302.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CONFIGURACION_MODIFICACION } from '../../constantes/modificacion.enum';
import { CommonModule } from '@angular/common';
import { Planta } from '../../estados/models/plantas-consulta.model';
import { SolicitudService } from '../../service/solicitud.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80302Query } from '../../../../estados/queries/tramite80302.query';

/**
 * Componente para gestión de modificaciones del programa IMMEX
 * 
 * @export
 * @class ModificacionComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-modificacion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TituloComponent,
    TablaDinamicaComponent,
  ],
  templateUrl: './modificacion.component.html',
  styleUrl: './modificacion.component.scss',
})
export class ModificacionComponent implements OnInit, OnDestroy {
  /**
   * Constructor del componente de modificación
   * 
   * @param {FormBuilder} fb Constructor de formularios reactivos de Angular
   * @param {SolicitudService} solicitudService Servicio para consultas y actualizaciones de solicitudes
   * @param {Tramite80302Store} tramite80302Store Store de Akita para gestión del estado del trámite
   * @param {Tramite80302Query} tramite80302Query Query para consultas reactivas del estado del trámite
   * @param {ConsultaioQuery} consultaioQuery Query para consultas de datos generales
   * @param {ToastrService} toastr Servicio para notificaciones al usuario
   * @param {SolicitanteQuery} solicitanteQuery Query para datos del solicitante
   * @memberof ModificacionComponent
   */
  constructor(
    private fb: FormBuilder,
    private solicitudService: SolicitudService,
    private tramite80302Store: Tramite80302Store,
    private tramite80302Query: Tramite80302Query,
    private consultaioQuery: ConsultaioQuery,
    private toastr: ToastrService,
    private solicitanteQuery: SolicitanteQuery
  ) {}

  /**
   * Formulario reactivo para gestión de datos de modificación
   * 
   * @type {FormGroup}
   * @memberof ModificacionComponent
   */
  modificacionForm!: FormGroup;

  /**
   * Subject para gestión de destrucción del componente
   * 
   * @type {Subject<void>}
   * @memberof ModificacionComponent
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual del trámite 80302
   * 
   * @type {Solicitud80302State}
   * @memberof ModificacionComponent
   */
  public derechoState: Solicitud80302State = {} as Solicitud80302State;

  /**
   * Referencia a la clase TablaSeleccion para uso en template
   * 
   * @type {typeof TablaSeleccion}
   * @readonly
   * @memberof ModificacionComponent
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Configuración de columnas para la tabla dinámica de plantas
   * 
   * @type {ConfiguracionColumna<Planta>[]}
   * @readonly
   * @memberof ModificacionComponent
   */
  public encabezadoDeTabla: ConfiguracionColumna<Planta>[] = CONFIGURACION_MODIFICACION as ConfiguracionColumna<Planta>[];

  /**
   * Datos de plantas para mostrar en la tabla dinámica
   * 
   * @type {Planta[]}
   * @memberof ModificacionComponent
   */
  datosTabla: Planta[] = [];

  /**
   * Estado de datos de consulta general
   * 
   * @type {ConsultaioState}
   * @memberof ModificacionComponent
   */
  consultaDatos!: ConsultaioState;

  /**
   * Estado de datos del solicitante
   * 
   * @type {SolicitanteState}
   * @memberof ModificacionComponent
   */
  solicitanteState!: SolicitanteState;

  /**
   * Indicador de modo de solo lectura
   * 
   * @type {boolean}
   * @memberof ModificacionComponent
   */
  soloLectura: boolean = false;

  /**
   * Indicador de si es una actualización
   * @type {boolean}
   * @memberof ModificacionComponent
   */
  isUpdate: boolean = false;
  /**
   * Método del ciclo de vida de Angular para inicialización del componente
   * 
   * @returns {void}
   * @memberof ModificacionComponent
   */
  ngOnInit(): void {
    this.tramite80302Query.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.derechoState = {
            ...this.derechoState,
            ...seccionState,
          };
        })).subscribe();

    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.consultaDatos = seccionState;
        this.soloLectura = this.consultaDatos.readonly;
        this.isUpdate = this.consultaDatos.update ?? false;
      })
    )
    .subscribe();

    this.solicitanteQuery.selectSeccionState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.solicitanteState = seccionState;
      })
    )
    .subscribe();
    
    this.inicializarFormulario();
    this.loadDatosModificacion();
    if(this.isUpdate){
      this.datosTabla = this.derechoState.modificacionDatos;
    }else{
      this.loadDatosTablaData();
    }
  }

  /**
   * Método del ciclo de vida de Angular para limpieza al destruir el componente
   * 
   * @returns {void}
   * @memberof ModificacionComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.unsubscribe();
  }

  /**
   * Inicializa el formulario reactivo de modificación
   * 
   * @returns {void}
   * @memberof ModificacionComponent
   */
  inicializarFormulario(): void {
    this.modificacionForm = this.fb.group({
      rfc: [this.solicitanteState?.rfc_original ?? '', []],
      federal: ['', []],
      tipo: [this.solicitanteState?.tipo_sociedad ?? '', []],
      programa: [this.solicitanteState?.email ?? '', []],
    });
  }

  /**
   * Carga los datos de modificación desde el servicio
   * 
   * @returns {void}
   * @memberof ModificacionComponent
   */
  loadDatosModificacion(): void {
    this.solicitudService.getDatosModificacion().pipe(takeUntil(this.destroyNotifier$)).subscribe((datos) => {
        (this.tramite80302Store.setDatosModificacion as (valor: unknown) => void)(datos);
        this.setFormValues();
      });
  }

  /**
   * Carga los datos de plantas para la tabla dinámica
   * 
   * @returns {void}
   * @memberof ModificacionComponent
   */
  loadDatosTablaData(): void {
    const PAYLOAD ={
      "rfc": this.derechoState.loginRfc,
      "idPrograma": this.derechoState.selectedIdPrograma,
      "tipoPrograma": this.derechoState.selectedTipoPrograma,
      "folioPrograma": this.derechoState.selectedFolioPrograma,
      "discriminator": "80302"
    }
    this.solicitudService
      .obtenerListaDomicilios(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos?.plantas)) {
              this.datosTabla = RESPONSE.datos?.plantas.filter(
                (obj: Planta) => Object.values(obj).some(value => value !== null)
              );
              this.tramite80302Store.setModificacionDatos(this.datosTabla);
            }
          }
        },
        () => {
          this.toastr.error('Error al cargar las operaciones');
        }
      );
  }

  /**
   * Establece los valores del formulario con datos del solicitante
   * 
   * @returns {void}
   * @memberof ModificacionComponent
   */
  setFormValues(): void {
    this.modificacionForm.get('rfc')?.setValue(this.solicitanteState?.rfc_original ?? '');
    this.modificacionForm.get('federal')?.setValue('');
    this.modificacionForm.get('tipo')?.setValue(this.solicitanteState?.tipo_sociedad ?? '');
    this.modificacionForm.get('programa')?.setValue(this.solicitanteState?.email ?? '');
  }

  /**
   * Establece valores en el store del trámite mediante invocación dinámica de métodos
   * 
   * @param {FormGroup} form Formulario reactivo del cual extraer el valor
   * @param {string} campo Nombre del control del formulario
   * @param {keyof Tramite80302Store} metodoNombre Nombre del método del store a invocar
   * @returns {void}
   * @memberof ModificacionComponent
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite80302Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite80302Store[metodoNombre] as (valor: unknown) => void)(VALOR);
  }

  /**
   * Maneja el evento de alternancia de estado en la tabla de plantas
   * 
   * @param {unknown} event Evento de la tabla que contiene los datos de la fila
   * @returns {void}
   * @memberof ModificacionComponent
   */
  valorDeAlternancia(event: unknown): void {
    if (event && typeof event === 'object' && 'row' in event) {
      const ROW = (event as { row: Planta }).row;
      const INDEX = this.datosTabla.findIndex((x) => x.idPlanta === ROW.idPlanta);
      this.updateTablaData(this.datosTabla[INDEX], INDEX);
    }
  }

  /**
   * Actualiza los datos de una planta mediante el servicio correspondiente
   * 
   * @param {Planta} datos Datos de la planta que se va a actualizar
   * @returns {void}
   * @memberof ModificacionComponent
   */
  updateTablaData(datos: Planta, index: number): void {
    const PAYLOAD ={
      plantas: [datos],
      idFraccion: "1",
      status: datos.estatus ? "false" : "true",
      tipoFraccion: "Plantas",
      idSolicitud: datos.idSolicitud ? datos.idSolicitud : "",
    }
    this.solicitudService
      .actualizarDomicilios(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos?.plantas)) {
              this.datosTabla = RESPONSE.datos?.plantas.filter(
                (obj: Planta) => Object.values(obj).some(value => value !== null)
              );
              this.datosTabla[index].estatus = datos.estatus ? false : true;
              this.datosTabla[index].desEstatus = datos.desEstatus === "Activada" ? "Baja" : "Activada";
              this.tramite80302Store.setModificacionDatos(this.datosTabla);
            }
          }
        },
        () => {
          this.toastr.error('Error al cargar las operaciones');
        }
      );
  }
}
