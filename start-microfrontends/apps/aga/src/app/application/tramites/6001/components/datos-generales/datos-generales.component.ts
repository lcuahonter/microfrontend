/* eslint-disable class-methods-use-this */
/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable sort-imports */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroCuentasBancariasService } from '../../services/registro-cuentas-bancarias.service';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src/core/models/shared/configuracion-columna.model';
import { Notificacion, NotificacionesComponent, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegistroDeSolicitudesTabla, Sociedad } from '../../models/registro-cuentas-bancarias.model';
import { Tramite6001TablaState, Tramite6001TablaStore } from '../../estados/tramite6001tabla.store';
import { Tramite6001TablaQuery } from '../../estados/tramite6001tabla.query';
import { map, Subject, takeUntil } from 'rxjs';


/**
 * Componente DatosGenerales que se utiliza para mostrar y gestionar los DatosGenerales.
 * 
 * Este componente utiliza varios subcomponentes como TituloComponent, CommonModule,
 * ReactiveFormsModule para mostrar información y permitir al usuario seleccionar y datos generales.
 * 
 * @component
 */
@Component({
    selector: 'app-datos-generales',
    standalone: true,
    imports: [CommonModule, TituloComponent, TablaDinamicaComponent, ReactiveFormsModule,NotificacionesComponent],
    templateUrl: './datos-generales.component.html',
    styleUrl: './datos-generales.component.scss',
})
export class DatosGeneralesComponent implements OnInit, OnDestroy {

    /**
     * Una instancia de FormGroup que representa el formulario para datos generales.
     * Este formulario se utiliza para capturar y validar la información general
     * requerida en el proceso de solicitud.
     */
    public formDatosGenerales!: FormGroup;

    /**
     * Un array de objetos `RegistroDeSolicitudesTabla` que representa los datos para la tabla de solicitudes.
     */
    public registroDeSolicitudesTablaDatos: RegistroDeSolicitudesTabla[] = [];

    /**
     * Almacena la lista de entidades Sociedad que contienen datos generales relacionados con la aplicación.
     */
    public sociedadDatos: Array<Sociedad> = [];

    /** Configuración de la tabla de sectores */
    public configuracionTabla: ConfiguracionColumna<RegistroDeSolicitudesTabla>[] = [
        { encabezado: 'Tipo movimiento', clave: (item: RegistroDeSolicitudesTabla) => item.movimiento, orden: 1 },
        { encabezado: 'Titular cuenta', clave: (item: RegistroDeSolicitudesTabla) => item.cuenta, orden: 2 },
        { encabezado: 'RFC', clave: (item: RegistroDeSolicitudesTabla) => item.rfc, orden: 3 },
        { encabezado: 'Tipo persona', clave: (item: RegistroDeSolicitudesTabla) => item.persona, orden: 4 },
        { encabezado: 'Número de cuenta', clave: (item: RegistroDeSolicitudesTabla) => item.numeroDeCuenta, orden: 5 },
        { encabezado: 'Sucursal', clave: (item: RegistroDeSolicitudesTabla) => item.sucursal, orden: 6 },
        { encabezado: 'Institución de crédito', clave: (item: RegistroDeSolicitudesTabla) => item.institucionDeCredito, orden: 7 },
        { encabezado: 'Número de plaza', clave: (item: RegistroDeSolicitudesTabla) => item.numero, orden: 8 },
        { encabezado: 'Pais donde radica cuenta', clave: (item: RegistroDeSolicitudesTabla) => item.radicaCuenta, orden: 9 },
        { encabezado: 'Estado', clave: (item: RegistroDeSolicitudesTabla) => item.estado, orden: 10 },
        { encabezado: 'Domicilio extranjero', clave: (item: RegistroDeSolicitudesTabla) => item.domicilio, orden: 11 }
    ];

 /**
   * Representa una confirmar instancia de notificación asociada con el componente.
   * Esta propiedad se utiliza para gestionar y almacenar datos de notificaciones.
   */
    public confirmarNotificacion!: Notificacion;
    /**
     * Representa la entidad de notificación asociada con la sociedad.
     * Esta propiedad almacena los detalles de la notificación relevantes para el contexto actual.
     */
    public sociedadNotificacion!: Notificacion;
    /**
     * Almacena el índice de la fila actualmente seleccionada en una lista o tabla.
     */
    public selectedRowIndex: number | null = null;

    /**
     * Subject utilizado para notificar y completar las suscripciones cuando el componente se destruye.
     * Normalmente se usa con el operador `takeUntil` de RxJS para evitar fugas de memoria.
     * Emite un valor `void` para señalar la finalización.
     * @private
     */
    private destroyNotifier$: Subject<void> = new Subject();

    /**
     * Objeto de estado que representa el estado actual y los datos de la operación "agregar cuenta"
     * dentro del flujo de trabajo Tramite 6001. Esta propiedad contiene información como la lista de cuentas,
     * paginación, filtros y cualquier otro estado relevante de la UI para el componente de tabla correspondiente.
     *
     * @type {Tramite6001TablaState}
     */
    public agregarCuentaState!: Tramite6001TablaState;


    /**
     * Constructor para el componente DatosGenerales.
     * 
     * @param _registroCuentasBancariasSvc - Servicio para gestionar registros de cuentas bancarias.
     * @param fb - Instancia de FormBuilder para crear formularios reactivos.
     */
    constructor(
        private _registroCuentasBancariasSvc: RegistroCuentasBancariasService,
        private fb: FormBuilder,
        private tramite6001TablaStore: Tramite6001TablaStore,
        private tramite6001TablaQuery: Tramite6001TablaQuery
    ) {
        this.tramite6001TablaQuery.tramiteTabla$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
                this.agregarCuentaState = seccionState;
                this.getSolicitudesTabla();
              })
            ).subscribe();
    }


    /**
     * Gancho de ciclo de vida que se llama después de que se inicializan las propiedades enlazadas a datos de una directiva.
     * Inicializa el componente creando el formulario de datos generales, obteniendo la tabla de solicitudes
     * y obteniendo los detalles del formulario de datos generales.
     *
     * @memberof DatosGeneralesComponent
     */
    ngOnInit(): void {
        this.crearFormDatosGenerales();
        this.getSolicitudesTabla();
        this.getSociedadTabla();
        this.obtenerFormDatosGeneralesDatos();
    }


    /**
   * Crea una copia profunda del objeto proporcionado.
   * 
   * Este método serializa el objeto a una cadena JSON y luego lo analiza de nuevo a un nuevo objeto,
   * creando efectivamente una copia profunda. Tenga en cuenta que este enfoque puede no manejar funciones,
   * valores indefinidos o referencias circulares correctamente.
   * 
   * @param obj - El objeto que se va a copiar profundamente. Por defecto es un objeto vacío.
   * @returns Una copia profunda del objeto proporcionado.
   */
    public deepCopy(obj = {}) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Verifica si el valor proporcionado es un objeto.
     *
     * @param value - El valor a verificar.
     * @returns `true` si el valor es un objeto y no es nulo, de lo contrario `false`.
     */
    public isObject(value: unknown): boolean {
        return value !== null && typeof value === 'object';
    }

    /**
     * Verifica si el valor proporcionado es un array no vacío.
     *
     * @param value - El valor a verificar.
     * @returns `true` si el valor es un array y tiene al menos un elemento, de lo contrario `false`.
     */
    public isValidArray(value: unknown): boolean {
        return Array.isArray(value) && value.length > 0;
    }

    /**
     * Inicializa el grupo de formularios `formDatosGenerales` con valores predeterminados y deshabilita todos los controles del formulario.
     * El grupo de formularios contiene los siguientes controles:
     * - `aduanaAdicional`: Un control de formulario deshabilitado con una cadena vacía como valor predeterminado.
     * - `nombre`: Un control de formulario deshabilitado con una cadena vacía como valor predeterminado.
     * - `federalDeContribuyentes`: Un control de formulario deshabilitado con una cadena vacía como valor predeterminado.
     * - `tipoDePersona`: Un control de formulario deshabilitado con una cadena vacía como valor predeterminado.
     *
     * @returns {void} Este método no devuelve ningún valor.
     */
    public crearFormDatosGenerales(): void {
        this.formDatosGenerales = this.fb.group({
            aduanaAdicional: [{ value: '', disabled: true }],
            nombre: [{ value: '', disabled: true }],
            federalDeContribuyentes: [{ value: '', disabled: true }],
            tipoDePersona: [{ value: '', disabled: true }],
        });
    }

    /**
     * Obtiene los datos de solicitudes del servicio y los asigna a la propiedad del componente.
     * 
     * Este método llama al método `getSolicitudesTabla` del servicio `_registroCuentasBancariasSvc`,
     * se suscribe al observable que devuelve y asigna los datos recibidos a la propiedad `registroDeSolicitudesTablaDatos`.
     * 
     * @returns {void}
     */
    public getSolicitudesTabla(): void {
        const DATOS = this.registroDeSolicitudesTablaDatos.length > 0 ? this.registroDeSolicitudesTablaDatos : [];
        DATOS.push(this.agregarCuentaState);
        this.registroDeSolicitudesTablaDatos = [...new Set(DATOS)];
    }

    /**
     * Obtiene la información del formulario de datos generales desde la API y actualiza los campos del formulario con los datos de la respuesta.
     * 
     * Este método llama al servicio `obtenerDatosDeFormularioDeAPI` para obtener los datos de la API.
     * Si la respuesta es un objeto y contiene un array válido en la propiedad `data`, actualiza los campos del formulario
     * `aduanaAdicional`, `nombre`, `federalDeContribuyentes` y `tipoDePersona` con los valores correspondientes
     * del primer elemento del array `data`.
     * 
     * @returns {void}
     */
    public obtenerFormDatosGeneralesDatos(): void {
        this._registroCuentasBancariasSvc.obtenerDatosDeFormularioDeAPI().subscribe((response) => {
            if (this.isObject(response) && this.isValidArray(response.data)) {
                const API_RESPONSE_DATOS = response.data[0];
                this.formDatosGenerales.get('aduanaAdicional')?.setValue(API_RESPONSE_DATOS.aduanaAdicional);
                this.formDatosGenerales.get('nombre')?.setValue(API_RESPONSE_DATOS.nombre);
                this.formDatosGenerales.get('federalDeContribuyentes')?.setValue(API_RESPONSE_DATOS.federalDeContribuyentes);
                this.formDatosGenerales.get('tipoDePersona')?.setValue(API_RESPONSE_DATOS.tipoDePersona);
            }
        });
    }

    /**
     * Inicia el proceso para agregar una nueva cuenta bancaria.
     * Este método cambia el componente actual a 'AgregarCuenta' utilizando el 
     * servicio _registroCuentasBancariasSvc.
     *
     * @public
     * @returns {void}
     */
    public altaDeCuenta(): void {
        if(!this.selectedRowIndex) {
            this.sociedadNotificacion = {
                tipoNotificacion: 'alert',
                categoria: 'danger',
                modo: 'action',
                titulo: 'Error',
                mensaje: 'Selecciona una sociedad.',
                cerrar: false,
                tiempoDeEspera: 2000,
                txtBtnAceptar: 'Aceptar',
                txtBtnCancelar: '',
            };
        } else {
            this._registroCuentasBancariasSvc.cambiarComponente('AgregarCuenta');
        }
    }


    /**
     * Obtiene los datos para la tabla "Sociedad" desde el servicio backend.
     * Los datos se recuperan a través de una solicitud HTTP y luego se copian
     * profundamente para evitar mutaciones directas. Los datos copiados se asignan
     * a la propiedad `sociedadDatos`.
     *
     * @returns {void} Este método no devuelve ningún valor.
     */
    public getSociedadTabla(): void {
        this._registroCuentasBancariasSvc.getSociedadTablaDatos().subscribe((response) => {
            const API_RESPONSE = this.deepCopy(response);
            this.sociedadDatos = API_RESPONSE.data;
        });
    }

    /**
     * Muestra una notificación de alerta al intentar eliminar un registro de solicitud sin haber seleccionado uno.
     * 
     * Asigna a la propiedad `confirmarNotificacion` una notificación de tipo alerta con categoría 'danger',
     * informando al usuario que debe seleccionar una solicitud. La notificación incluye un título, mensaje,
     * y un botón 'Aceptar', y se cerrará automáticamente después de 2000 milisegundos.
     */
    public eliminarRegistroSolicitud(): void {
        this.confirmarNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'danger',
            modo: 'action',
            titulo: 'Aviso',
            mensaje: 'Seleccione una solicitud.',
            cerrar: false,
            tiempoDeEspera: 2000,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: '',
        };
    }

    /**
     * Muestra una notificación de alerta al intentar editar un registro de solicitud sin haber seleccionado uno.
     * 
     * Asigna a la propiedad `confirmarNotificacion` una notificación de tipo alerta con categoría 'danger',
     * informando al usuario que debe seleccionar una solicitud. La notificación requiere acción del usuario y se cerrará automáticamente después de 2000 milisegundos.
     */
    public editarRegistroSolicitud(): void {
        this.confirmarNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'danger',
            modo: 'action',
            titulo: 'Mensaje',
            mensaje: 'Seleccione una solicitud.',
            cerrar: false,
            tiempoDeEspera: 2000,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: '',
        };
    }

    /**
     * Muestra una notificación de alerta indicando que se debe seleccionar un renglón.
     * 
     * Este método asigna a la propiedad `sociedadNotificacion` una configuración de notificación
     * de error, solicitando al usuario que seleccione un renglón. La notificación se muestra como
     * una alerta de tipo peligro, incluye un botón "Aceptar" y se cierra automáticamente después de 2 segundos.
     */
    public bajaDeCuentas(): void {
        this.sociedadNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'danger',
            modo: 'action',
            titulo: 'Error',
            mensaje: 'Selecciona un renglón.',
            cerrar: false,
            tiempoDeEspera: 2000,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: '',
        };
    }

 /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    }
}
