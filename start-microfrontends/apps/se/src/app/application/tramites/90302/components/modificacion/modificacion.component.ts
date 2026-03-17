

import { FormBuilder, FormGroup } from '@angular/forms';

import {
  CONFIGURACION_MODIFICACION,
} from '../../constantes/modificacion.constants';

import {
  ApiResponse,
  DatosDelModificacion,
} from '../../models/datos-info.model';
import { OnDestroy, OnInit } from '@angular/core';
import {
  TEXTO_FILA_REGISTRO,
  TablaSeleccion,
} from '@libs/shared/data-access-user/src';
import { AmpliacionServiciosQuery } from '../../estados/tramite90302.query';
import { AmpliacionServiciosService } from '../../services/ampliacion-servicios.service';
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '../../models/configuracion-columna.model';
import { Input } from '@angular/core';
import { Subject } from 'rxjs';
import { Tramite90302Store } from '../../estados/tramite90302.store';
import { takeUntil } from 'rxjs/operators';

/**
 * @component
 * @name ModificacionComponent
 * @description
 * Este componente es responsable de gestionar la lógica y la interfaz de usuario para la modificación de trámites específicos.
 * Proporciona funcionalidades para inicializar formularios reactivos, cargar datos desde servicios, y gestionar la tabla dinámica
 * que muestra los datos relacionados con los trámites.
 *
 * @selector app-modificacion
 * @templateUrl ./modificacion.component.html
 * @styleUrl ./modificacion.component.scss
 *
 * @implements OnInit, OnDestroy
 */
@Component({
  selector: 'app-modificacion',
  templateUrl: './modificacion.component.html',
  styleUrl: './modificacion.component.scss',
})
export class ModificacionComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para la información de registro.
   * @property {FormGroup} formularioInfoRegistro
   */
  formularioInfoRegistro!: FormGroup;

  /**
   * Notificador para gestionar la destrucción o desuscripción de observables.
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Representa la tabla de selección utilizada en el componente de modificación.
   * Esta tabla se utiliza para gestionar y mostrar los datos seleccionados
   * en el contexto de los trámites específicos.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Configuración de las columnas de la tabla dinámica.
   * Define las propiedades de cada columna, como encabezado, clave y orden.
   */
  public encabezadoDeTabla: ConfiguracionColumna<DatosDelModificacion>[] =
    CONFIGURACION_MODIFICACION;

  /**
   * Define los datos que se mostrarán en la tabla dinámica.
   */
  datosTabla: DatosDelModificacion[] = [];

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   * @property {boolean} esFormularioSoloLectura
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * @constructor
   * @param {FormBuilder} fb - Servicio para la creación de formularios.
   * @param {AmpliacionServiciosService} ampliacionServiciosService - Servicio para obtener datos de ampliación de servicios.
   * @param {HttpClient} httpServicios - Servicio HTTP para realizar peticiones.
   */

  constructor(
    private fb: FormBuilder,
    private ampliacionServiciosService: AmpliacionServiciosService,
    private ampliacionServiciosQuery: AmpliacionServiciosQuery,
    private tramite90302Store: Tramite90302Store
  ) {}

  /**
   * Método de inicialización del componente.
   * @method ngOnInit
   */
  ngOnInit(): void {
    this.getDatos();
    this.inicializarFormularioInfoRegistro();
    if(this.esFormularioSoloLectura) {
      this.formularioInfoRegistro.disable();
    }
    this.inicializarFormularioDesdeAlmacen();
    this.loadDatosTablaData();
  }

  /**
   * Obtiene los datos del servicio y actualiza el estado del formulario.
   * @method getDatos
   */
  getDatos(): void {
    this.ampliacionServiciosService
      .getDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        const RESPONSE = respuesta as unknown as ApiResponse;
        if (RESPONSE) {
          this.tramite90302Store.setInfoRegistro(RESPONSE.data.infoServicios);
        }
      });
  }

  /**
   * Inicializa el formulario de información de registro.
   * @method inicializarFormularioInfoRegistro
   */

  inicializarFormularioInfoRegistro(): void {
    this.formularioInfoRegistro = this.fb.group({
      rfc: [{ value: '', disabled: true }],
      representacionFederal: [{ value: '', disabled: true }],
      tipoModificacion: [{ value: '', disabled: true }],
      modificacionPrograma: [{ value: '', disabled: true }],
    });
  }


  /**
   * @method inicializarFormularioDesdeAlmacen
   * @description Inicializa el formulario con los datos almacenados en el estado de la aplicación.
   * Suscribe al observable `selectInfoRegistro$` para obtener la información del registro y 
   * actualiza los valores del formulario `formularioInfoRegistro` con los datos recibidos.
   * 
   * @returns {void} Este método no retorna ningún valor.
   * 
   * @example
   * // Ejemplo de uso:
   * this.inicializarFormularioDesdeAlmacen();
   * 
   * @memberof ModificacionComponent
   */
  inicializarFormularioDesdeAlmacen(): void {
    this.ampliacionServiciosQuery.selectInfoRegistro$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((infoRegistro) => {
        this.formularioInfoRegistro.patchValue({
          rfc: infoRegistro.rfc,
          representacionFederal: infoRegistro.representacionFederal,
          tipoModificacion: infoRegistro.tipoModificacion,
          modificacionPrograma: infoRegistro.modificacionPrograma,
        });
      });
  }

  /**
   * Cargar datos de la tabla.
   *
   * Este método obtiene los datos de la tabla desde el servicio `datosTramiteService`
   * y los almacena en la propiedad `datosTabla`. Utiliza `takeUntil` para cancelar la suscripción
   * cuando el componente se destruye, evitando fugas de memoria.
   *
   * @example
   * // Llamar al método para cargar los datos de la tabla
   * this.loadDatosTablaData();
   */
  loadDatosTablaData(): void {
    this.ampliacionServiciosService
      .getModificacionTableData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.datosTabla = data;
      });
  }

  /**
   * Alterna el estado de un registro en la tabla entre 'Baja' y 'Activada'.
   *
   * @param row - El registro de la tabla que se desea modificar. Debe contener un identificador único (`id`).
   *
   * @remarks
   * Este método busca el índice del registro en la tabla `datosTabla` utilizando el identificador (`id`) del registro proporcionado.
   * Luego, cambia el valor de la propiedad `desEstatus` del registro encontrado:
   * - Si el estado actual es 'Baja', se cambia a 'Activada'.
   * - Si el estado actual es diferente de 'Baja', se cambia a 'Baja'.
   */
  // Justificación: La estructura del objeto 'row' varía dinámicamente según los datos de la tabla,
  // y no es viable aplicar tipado estricto en este momento. Se refactorizará con una interfaz adecuada más adelante.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valorDeAlternancia(data: any): void {
    const INDEX = this.datosTabla.findIndex((x) => x.id === data?.row?.id);
    this.datosTabla[INDEX].desEstatus =
      this.datosTabla[INDEX].desEstatus === TEXTO_FILA_REGISTRO.BAJA
        ? TEXTO_FILA_REGISTRO.ACTIVADA
        : TEXTO_FILA_REGISTRO.BAJA;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
