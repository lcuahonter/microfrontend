import { ConfiguracionColumna, INVERSION_TABLA, InversionGrupo, ModeloDeFormaDinamica, TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { CONFIGURACION_IVAEIEPS_DOS } from '../../constantes/ivaeieps.enum';
import { ComercioExteriorService } from '../../services/comercio-exterior.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import {INVERSION_MONTO} from '../../constantes/ivaeieps.enum';
import { Input } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { PAGO_DE_DERECHOS } from '../../constantes/ivaeieps.enum';
import { PERMISO_A_DESISTIR_DOS } from '../../constantes/ivaeieps.enum';
import { PERMISO_A_DESISTIR_TRES } from '../../constantes/ivaeieps.enum';
import { ReactiveFormsModule } from '@angular/forms';
import { Solicitud31602State } from '../../estados/stores/tramite31602.store';
import { Subject } from 'rxjs';
import { Tramite31602Query } from '../../estados/queries/tramite31602.query';
import { Tramite31602Store } from '../../estados/stores/tramite31602.store';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * Componente que representa la sección del formulario de IVA e IEPS para un trámite específico (31602).
 * Este componente maneja grupos de formularios dinámicos e interactúa con un store y un servicio
 * para gestionar el estado y obtener datos.
 */
@Component({
  selector: 'app-ivaeieps-dos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormasDinamicasComponent,TablaDinamicaComponent],
  templateUrl: './ivaeieps-dos.component.html',
  styleUrl: './ivaeieps-dos.component.scss',
})
export class IvaeiepsDosComponent implements OnInit, OnDestroy {
  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * Cuando se establece en `true`, todos los campos del formulario son no editables.
   * Por defecto es `false`, permitiendo que los campos del formulario sean editables.
   */
  @Input() esFormularioSoloLectura: boolean = false;

/**
 * Una instancia de FormGroup que representa la estructura del formulario `inversionGrupo`.
 *
 * Este grupo de formularios contiene un FormGroup anidado llamado `inversionFormGroup`,
 * que puede ser utilizado para definir y gestionar controles de formulario adicionales
 * relacionados con la inversión dentro del componente.
 *
 * @type {FormGroup}
 */
  public inversionGrupo: FormGroup = new FormGroup({
    inversionFormGroup: new FormGroup({}),
  });
  /**
   * Una instancia de FormGroup que representa la estructura del formulario `delGrupo`.
   *
   * Este grupo de formularios contiene un `checkboxFormGroup` anidado, que es otro FormGroup
   * destinado a gestionar controles de formulario relacionados con checkboxes.
   */
  public delGrupo: FormGroup = new FormGroup({
    checkboxFormGroup: new FormGroup({}),
  });
  /**
   * Una instancia de FormGroup que representa la estructura del formulario `contadoGrupo`.
   * Este grupo de formularios contiene un `checkboxDosFormGroup` anidado, que es otro FormGroup
   * destinado a gestionar controles de formulario relacionados con checkboxes.
   *
   * @property {FormGroup} contadoGrupo - El grupo de formulario principal para gestionar controles de formulario y grupos anidados.
   * @property {FormGroup} checkboxDosFormGroup - Un grupo de formulario anidado dentro de `contadoGrupo`.
   */
  public contadoGrupo: FormGroup = new FormGroup({
    checkboxDosFormGroup: new FormGroup({}),
  });
  /**
   * Representa un grupo de formularios reactivos para gestionar la sección "deLasSiguientes".
   *
   * Este grupo de formularios contiene un grupo anidado `deLasSiguientesGrp` que puede ser utilizado
   * para definir y gestionar controles de formulario adicionales o grupos de forma dinámica.
   */
  public deLasSiguientesFormGroup: FormGroup = new FormGroup({
    deLasSiguientesGrp: new FormGroup({}),
  });
  /**
   * Una instancia de FormGroup que representa la estructura del formulario para "Pago de Derechos".
   * Este grupo de formularios contiene un FormGroup anidado llamado `pagoDeDerechos`, que puede
   * ser utilizado para definir y gestionar controles relacionados con el pago de derechos.
   */
  public pagoDeDerechosFormGroup: FormGroup = new FormGroup({
    pagoDeDerechos: new FormGroup({}),
  });
  /**
   * Un grupo de formularios reactivos utilizado para gestionar y validar los controles
   * del formulario relacionados con la funcionalidad "porcentajeMonto" en el componente.
   */
  public porcentajeMontoForm!: FormGroup;
/**
 * Contiene los datos de configuración para el formulario de inversión.
 *
 * Esta propiedad se inicializa con la constante `INVERSION_MONTO`, que define la estructura
 * y los campos dinámicos que se mostrarán en la sección correspondiente al monto de inversión.
 * Se utiliza para alimentar el componente de formularios dinámicos con los datos necesarios.
 */
  public inversionFormDatos = INVERSION_MONTO;

  /**
   * Representa los datos del formulario para el proceso "Permiso a Desistir" en el módulo de IVA e IEPS.
   * Esta propiedad se inicializa con la constante `PERMISO_A_DESISTIR_DOS`.
   */
  public permisoDesistirFormDatos = PERMISO_A_DESISTIR_DOS;
  /**
   * Representa los datos de selección predeterminados para una operación o proceso específico.
   * Esta propiedad se inicializa con un valor constante predefinido.
   */
  public predeterminadoSeleccionarDatos = PERMISO_A_DESISTIR_TRES;
  /**
   * Contiene los datos para la sección "de las siguientes", obtenidos de la constante `CONFIGURACION_IVAEIEPS_DOS`.
   * Esta propiedad se utiliza para gestionar y mostrar datos específicos relacionados con la funcionalidad del componente.
   */
  public deLasSiguientesDatos = CONFIGURACION_IVAEIEPS_DOS;
  /**
   * Representa los datos de pago de derechos utilizados en el componente.
   * Esta propiedad se inicializa con la constante `PAGO_DE_DERECHOS`.
   */
  public pagoDeDerechosDatos = PAGO_DE_DERECHOS;
  /**
   * Un Subject utilizado para notificar y completar las suscripciones cuando el componente es destruido.
   * Esto ayuda a prevenir fugas de memoria al garantizar que cualquier observable suscrito a este notifier
   * se desuscriba cuando el componente ya no esté en uso.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Representa el estado del proceso de Solicitud31602.
   * Esta propiedad se utiliza para gestionar y rastrear el estado de la
   * solicitud dentro del proceso de IVA/IEPS.
   */
  public solicitudState!: Solicitud31602State;
  /**
   * Un arreglo que contiene datos relacionados con las inversion grupo.
   * Cada elemento en el arreglo es de tipo `InversionGrupo`.
   */
  public inversionGrupoDatos: InversionGrupo[] = [];
  /**
   * Configuración para la tabla que muestra datos del tipo `InversionGrupo`.
   * Esta propiedad se inicializa con la configuración de columnas predefinida
   * de `INVERSION_TABLA`.
   */
  public configuracionTabla: ConfiguracionColumna<InversionGrupo>[] = INVERSION_TABLA;
   /**
     * Representa el modo de selección para una tabla, específicamente utilizando casillas de verificación.
     * Esta propiedad se asigna con un valor del enumerado `TablaSeleccion`,
     * donde el modo de selección está configurado como `CHECKBOX`.
     */
  public tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;
  /**
   * Constructor del componente IvaEiepsDosComponent.
   *
   * @param fb - Una instancia de FormBuilder utilizada para crear y gestionar formularios reactivos.
   * @param comercioExteriorSvc - Servicio para manejar operaciones relacionadas con comercio exterior.
   * @param tramite31602Store - Store de gestión de estado para el Trámite 31602.
   * @param tramite31602Query - Servicio de consulta para acceder a los datos del estado del Trámite 31602.
   */
  constructor(
    private fb: FormBuilder,
    private comercioExteriorSvc: ComercioExteriorService,
    private tramite31602Store: Tramite31602Store,
    private tramite31602Query: Tramite31602Query
  ) {
    //
  }

  /**
   * Gancho del ciclo de vida que se llama después de que el componente se inicializa.
   *
   * - Se suscribe al observable `selectSolicitud$` de `tramite31602Query` para actualizar la propiedad `solicitudState`
   *   cada vez que el observable emite un nuevo valor. La suscripción se cancela automáticamente cuando el componente
   *   se destruye utilizando el subject `destroyNotifier$`.
   * - Inicializa el formulario para porcentaje y monto utilizando el método `crearPorcentajeMontoForm`.
   * - Obtiene los datos del catálogo de bancos invocando el método `getBancoCatalogDatos`.
   */
  ngOnInit(): void {
    this.tramite31602Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.crearPorcentajeMontoForm();
    this.getBancoCatalogDatos();
    this.getInversionGrupoDatos();
    this.getTipoInversionCatalogDatos();
  }

  /**
   * Inicializa el FormGroup `porcentajeMontoForm` con controles predeterminados para `porcentaje` y `monto`.
   *
   * El formulario contiene los siguientes controles:
   * - `porcentaje`: Un control de formulario inicializado con una cadena vacía.
   * - `monto`: Un control de formulario inicializado con una cadena vacía.
   *
   * Este método utiliza el `FormBuilder` de Angular para crear el grupo de formularios.
   */
  public crearPorcentajeMontoForm(): void {
    this.porcentajeMontoForm = this.fb.group({
      porcentaje: [''],
      monto: [''],
    });
  }

  /**
 * Getter para obtener el FormGroup anidado `inversionFormGroup` dentro de `inversionGrupo`.
 *
 * Este método permite acceder directamente al grupo de controles relacionados con la inversión,
 * facilitando la manipulación y validación de los campos correspondientes en la plantilla o en la lógica del componente.
 *
 * @returns {FormGroup} La instancia de FormGroup asociada a `inversionFormGroup`.
 */
  get inversionFormGroup(): FormGroup {
    return this.inversionGrupo.get('inversionFormGroup') as FormGroup;
  }

  /**
   * Getter para la propiedad `checkboxFormGroup`.
   * Esto recupera la instancia de `FormGroup` asociada con el control `checkboxFormGroup`
   * desde el `FormGroup` padre (`delGrupo`).
   *
   * @returns {FormGroup} La instancia de `FormGroup` para el control `checkboxFormGroup`.
   */
  get checkboxFormGroup(): FormGroup {
    return this.delGrupo.get('checkboxFormGroup') as FormGroup;
  }

  /**
   * Getter para la propiedad `checkboxDosFormGroup`.
   * Esto recupera una instancia de `FormGroup` desde el FormGroup `contadoGrupo`
   * utilizando la clave `checkboxDosFormGroup`.
   *
   * @returns {FormGroup} El `FormGroup` asociado con la clave `checkboxDosFormGroup`.
   */
  get checkboxDosFormGroup(): FormGroup {
    return this.contadoGrupo.get('checkboxDosFormGroup') as FormGroup;
  }

  /**
   * Getter para el FormGroup 'deLasSiguientesGrp'.
   * Esto recupera el FormGroup anidado llamado 'deLasSiguientesGrp'
   * desde el FormGroup padre 'deLasSiguientesFormGroup'.
   *
   * @returns {FormGroup} La instancia del FormGroup 'deLasSiguientesGrp'.
   */
  get deLasSiguientesGrp(): FormGroup {
    return this.deLasSiguientesFormGroup.get('deLasSiguientesGrp') as FormGroup;
  }

  /**
   * Getter para el FormGroup 'pagoDeDerechos'.
   *
   * Esto recupera el FormGroup 'pagoDeDerechos' desde el
   * `pagoDeDerechosFormGroup` padre. Se utiliza para acceder o manipular
   * los controles del formulario dentro del grupo 'pagoDeDerechos'.
   *
   * @returns {FormGroup} El FormGroup 'pagoDeDerechos'.
   */
  get pagoDeDerechos(): FormGroup {
    return this.pagoDeDerechosFormGroup.get('pagoDeDerechos') as FormGroup;
  }

/**
 * Recupera los datos del grupo de inversión desde el servicio y actualiza la propiedad `inversionGrupoDatos`.
 *
 * Este método realiza una solicitud al servicio `comercioExteriorSvc.getInversionTablaDatos`, procesa la respuesta
 * y asigna los datos obtenidos a la propiedad `inversionGrupoDatos` del componente.
 * Utiliza el operador `takeUntil` para gestionar el ciclo de vida de la suscripción y evitar fugas de memoria.
 *
 * @remarks
 * - Se espera que la respuesta contenga los datos necesarios para poblar la tabla o sección correspondiente al grupo de inversión.
 * - La suscripción se cancela automáticamente cuando el componente es destruido.
 */
  public getInversionGrupoDatos():void {
    this.comercioExteriorSvc.getInversionTablaDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const DATOS = JSON.parse(JSON.stringify(response));
      this.inversionGrupoDatos = DATOS;
    })
  }

  /**
   * Recupera el catálogo de datos de bancos desde el servicio y actualiza el campo correspondiente en el modelo del formulario.
   *
   * Este método obtiene los datos de bancos utilizando el servicio `comercioExteriorSvc.getBancoDatos`, procesa la respuesta
   * y mapea los datos para poblar las opciones del campo del formulario con el ID 'banco'. Si el campo ya tiene opciones,
   * no las sobrescribe.
   *
   * @remarks
   * - El método utiliza el operador `takeUntil` para gestionar el ciclo de vida de la suscripción y prevenir fugas de memoria.
   * - Se espera que la respuesta tenga una propiedad `data` que contenga un arreglo de objetos con los campos `id` y `descripcion`.
   *
   * @throws {Error} Si el formato de la respuesta es inválido o si el campo requerido no se encuentra en el modelo del formulario.
   */
  public getBancoCatalogDatos(): void {
    this.comercioExteriorSvc
      .getBancoDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        const API_DATOS = JSON.parse(JSON.stringify(response));
        const DATOS = API_DATOS.data;
        const CLASIFICACION_FIELD = this.pagoDeDerechosDatos.find(
          (datos: ModeloDeFormaDinamica) => datos.id === 'banco'
        ) as ModeloDeFormaDinamica;
        if (CLASIFICACION_FIELD) {
          if (!CLASIFICACION_FIELD.opciones) {
            CLASIFICACION_FIELD.opciones = DATOS.map(
              (item: { id: number; descripcion: string }) => ({
                descripcion: item.descripcion,
                id: item.id,
              })
            );
          }
        }
      });
  }

/**
 * Recupera el catálogo de tipos de inversión desde el servicio y actualiza el campo correspondiente en el modelo del formulario.
 *
 * Este método obtiene los datos de tipos de inversión utilizando el servicio `comercioExteriorSvc.getTipoInversionDatos`, procesa la respuesta
 * y mapea los datos para poblar las opciones del campo del formulario con el ID 'tipoInversion'. Si el campo ya tiene opciones,
 * no las sobrescribe.
 *
 * @remarks
 * - El método utiliza el operador `takeUntil` para gestionar el ciclo de vida de la suscripción y prevenir fugas de memoria.
 * - Se espera que la respuesta tenga una propiedad `data` que contenga un arreglo de objetos con los campos `id` y `descripcion`.
 *
 * @throws {Error} Si el formato de la respuesta es inválido o si el campo requerido no se encuentra en el modelo del formulario.
 */
public getTipoInversionCatalogDatos(): void {
  this.comercioExteriorSvc
    .getTipoInversionDatos()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((response) => {
      const API_DATOS = JSON.parse(JSON.stringify(response));
      const DATOS = API_DATOS.data;
      const TIPO_INVERSION_FIELD = this.inversionFormDatos.find(
        (datos: ModeloDeFormaDinamica) => datos.id === 'tipoInversion'
      ) as ModeloDeFormaDinamica;
      if (TIPO_INVERSION_FIELD) {
        if (!TIPO_INVERSION_FIELD.opciones) {
          TIPO_INVERSION_FIELD.opciones = DATOS.map(
            (item: { id: number; descripcion: string }) => ({
              descripcion: item.descripcion,
              id: item.id,
            })
          );
        }
      }
    });
}

  /**
   * Maneja el cambio de valor para un campo específico y actualiza el store en consecuencia.
   * Si el `valor` es un objeto con una propiedad `id`, se extrae el `id` y se utiliza para actualizar el campo.
   * De lo contrario, se utiliza el `valor` directamente para actualizar el campo.
   */
  public establecerCambioDeValor(event: { campo: string; valor: unknown }): void {
    if (
      event &&
      typeof event.valor === 'object' &&
      event.valor !== null &&
      'id' in event.valor
    ) {
      const VALOR = event.valor.id;
      this.tramite31602Store.setDynamicFieldValue(event.campo, VALOR as string | number | boolean);
    } else if (event) {
      this.tramite31602Store.setDynamicFieldValue(event.campo, event.valor as string | number | boolean);
    }
  }

  /**
   * Gancho del ciclo de vida que se llama cuando el componente es destruido.
   * Libera recursos emitiendo un valor al subject `destroyNotifier$`
   * y completándolo para notificar a las suscripciones que deben desuscribirse.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
