import { Catalogo, ConfiguracionColumna, TablaDinamicaComponent, TituloComponent } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatosDeSolicitud, SolicitudDatos } from '../../models/solicitud-datos.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { Permiso260906Query } from '../../../../estados/queries/permiso260906.query';
import { ReactiveFormsModule } from '@angular/forms';
import { Sanitario260906Store } from '../../../../estados/tramites/sanitario260906.store';
import { SanitarioService } from '../../services/sanitario.service';
import { Solicitud260906State } from '../../../../estados/tramites/sanitario260906.store';
import { Subject } from 'rxjs';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * @component
 * @name AsociadosComponent
 * @description
 * Este componente es responsable de gestionar la funcionalidad relacionada con los asociados en el sistema.
 * Proporciona un formulario para capturar los datos de los asociados y carga una lista de datos relacionados.
 * 
 * @selector app-asociados
 * @standalone true
 * @imports
 * - CommonModule
 * - TituloComponent
 * - ReactiveFormsModule
 * - CatalogoSelectComponent
 * 
 * @templateUrl ./asociados.component.html
 * @styleUrl ./asociados.component.css
 */
@Component({
  selector: 'app-asociados',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, CatalogoSelectComponent, TablaDinamicaComponent],
  templateUrl: './asociados.component.html',
  styleUrls: ['./asociados.component.css'],
})
export class AsociadosComponent implements OnInit, OnDestroy {
  /**
   * Indica si un campo es requerido o no.
   * @type {boolean}
   * @default false
   */
  noRequerido: boolean = false;

  /**
   * Formulario reactivo para capturar los datos de los asociados.
   * @type {FormGroup}
   */
  derechosForm!: FormGroup;

  /**
   * Sujeto utilizado para notificar la destrucción del componente.
   * @private
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Lista de datos relacionados con los derechos.
   * @type {Catalogo[]}
   */
  public derechosList!: Catalogo[];

  /**
   * Estado actual de la solicitud.
   * @type {Solicitud260906State}
   */
  public solicitudState!: Solicitud260906State;

  /**
   * Configuración para la selección de filas en la tabla de solicitudes.
   * Actualmente está desactivada (sin selección definida).
   * @type {TablaSeleccion}
   */
  solicitudSeleccionTabla = TablaSeleccion.UNDEFINED;

  /**
   * Datos de las solicitudes.
   * Inicialmente, es un arreglo vacío que se llenará con datos dinámicos.
   * @type {SolicitudDatos[]}
   */
  solicitudDatos: SolicitudDatos[] = [];

  /**
   * Configuración de las columnas de la tabla de solicitudes.
   * Define los encabezados, claves y orden para mostrar los datos de solicitudes.
   * @type {ConfiguracionColumna<SolicitudDatos>[]}
   */
  solicitudConfiguracionTabla: ConfiguracionColumna<SolicitudDatos>[] = [
    {
      encabezado: 'Folio trámite',
      clave: (item: SolicitudDatos) => item.fechaCreacion,
      orden: 1,
    },
    {
      encabezado: 'Tipo trámite',
      clave: (item: SolicitudDatos) => item.mercancia,
      orden: 2,
    },
    {
      encabezado: 'Estatus',
      clave: (item: SolicitudDatos) => item.cantidad,
      orden: 3,
    },
    {
      encabezado: 'Fecha alta de registro',
      clave: (item: SolicitudDatos) => item.proovedor,
      orden: 4,
    },
  ];

  /**
   * Constructor del componente.
   * @param {FormBuilder} fb - Constructor para formularios reactivos.
   * @param {SanitarioService} service - Servicio para manejar datos sanitarios.
   * @param {Sanitario260906Store} sanitario260906Store - Almacén de estado para la solicitud.
   * @param {Permiso260906Query} permiso260906Query - Consulta para obtener datos relacionados con permisos.
   */
  constructor(
    private fb: FormBuilder,
    private service: SanitarioService,
    private sanitario260906Store: Sanitario260906Store,
    private permiso260906Query: Permiso260906Query
  ) {
    // Inicialización adicional si es necesario
  }

  /**
   * Método de inicialización del componente.
   * Se suscribe al estado de la solicitud, configura el formulario reactivo y carga los datos iniciales.
   * @returns {void}
   */
  ngOnInit(): void {
    this.permiso260906Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.derechosForm = this.fb.group({
      referencia: [this.solicitudState?.referencia],
      cadenaDependencia: [this.solicitudState?.cadenaDependencia],
      llave: [this.solicitudState?.llave],
      banco: [this.solicitudState?.banco],
      tipoFetch: [this.solicitudState?.tipoFetch],
      importe: [this.solicitudState?.importe],
    });

    this.loadComboUnidadMedida();
    this.obtenerDatosDeAplicacion();
  }

  /**
   * Actualiza el valor de un campo en el almacén de estado.
   * Este método se utiliza para sincronizar los valores del formulario con el estado global de la aplicación.
   * @param {FormGroup} form - El formulario reactivo que contiene los datos.
   * @param {string} campo - El nombre del campo que se desea actualizar.
   * @param {keyof Sanitario260906Store} metodoNombre - El método del almacén que se invocará para actualizar el valor.
   * @returns {void}
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Sanitario260906Store): void {
    const VALOR = form.get(campo)?.value;
    (this.sanitario260906Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Carga la lista de datos relacionados con los derechos desde el servicio.
   * Realiza una solicitud al servicio para obtener los datos y los asigna a la lista de derechos.
   * @returns {void}
   */
  loadComboUnidadMedida(): void {
    this.service.getDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.derechosList = data as Catalogo[];
      });
  }

  /**
   * Obtiene los datos de la aplicación relacionados con la solicitud,
   * incluyendo encabezados, filas de la tabla y opciones de selección.
   * Actualiza las propiedades correspondientes con los valores obtenidos.
   * @returns {void}
   */
  obtenerDatosDeAplicacion(): void {
    this.service
      .obtenerDatosDeSolicitud()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (respuesta: DatosDeSolicitud) => {
          this.solicitudDatos = respuesta.tablaFilaDatos;
        },
      });
  }

  /**
   * Método de limpieza al destruir el componente.
   * Libera los observables y notifica la destrucción del componente para evitar fugas de memoria.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}