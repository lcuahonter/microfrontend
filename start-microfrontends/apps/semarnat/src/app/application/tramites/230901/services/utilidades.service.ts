// src/app/servicios/utilidades.service.ts
import { Injectable, computed, inject } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Catalogo, CategoriaMensaje, ConsultaioQuery, Notificacion, TipoNotificacionEnum } from '@libs/shared/data-access-user/src';
import { DEFAULT_CONSULT_STATE, DEFAULT_VALUE_SOLICITUD_STATE, Tramite230901Store } from '../estados/store/tramite230901.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Tramite230901Query } from '../estados/query/tramite230901.query';
import { MercanciaConfiguracionItem } from '../enum/mercancia-tabla.enum';

@Injectable({
    providedIn: 'root'
})
export class UtilidadesService {
    /**
    * Inyección de dependecia para la Query del tramite.
    */
    private tramite230901Query = inject(Tramite230901Query);
    /**
     * Query para observar el estado de consulta del trámite.
     */
    private consultaioQuery = inject(ConsultaioQuery)
    /**
     * Inyección de dependencia de servicio para invocar el storage.
     */
    public store = inject(Tramite230901Store)

    /** Notificación que se muestra al usuario. */
    public nuevaNotificacion: Notificacion | null = null;
    /**
   * Notificación que se muestra al usuario.
   */
    public nuevaNotificacionEliminar: Notificacion | null = null;
    /**
   * Notificación que se muestra al usuario.
   */
    public nuevaNotificacionRowselect!: Notificacion;

    // Convierte el observable de la solictud en una señal y despues la computa para el tramite.
    public estadoSolicitud230901 = toSignal(this.tramite230901Query.selectSolicitud$, { initialValue: DEFAULT_VALUE_SOLICITUD_STATE });
    public solicitud = computed(() => this.estadoSolicitud230901());

    // Convierte el observable de la estado de la consulta en una señal y despues la computa para el tramite.
    public consultaioQueryState = toSignal(this.consultaioQuery.selectConsultaioState$, { initialValue: DEFAULT_CONSULT_STATE });
    public consultaState = computed(() => this.consultaioQueryState());

    /**
     * Regresa un Array con la descripción  de la lista de items solicitados
     * 
     * @param catalogo Es el catalogo para retornar las descripciones del catalogo.
     * @listaArray Es el listado de datos a filtrar
     */
    getDescripcionArray(catalogo: Catalogo[], listaArray: string[]) {
        return listaArray.map((item) => catalogo.find(list => list.clave === item)?.descripcion) as string[];
    }

    /**
     * Regresa un Array con las claves de la lista de items solicitados
     * 
     * @param catalogo Es el catalogo para retornar las descripciones del catalogo.
     * @listaArray Es el listado de datos a filtrar
     */
    getClaveArray(catalogo: Catalogo[], listaArray: string[]) {
        return listaArray.map((item) => catalogo.find(list => list.descripcion === item)?.clave) as string[];
    }

    /**
    * Establece los valores en el store del tramite.
    *
    * @param {FormGroup} form - El formulario del cual se obtiene el valor.
    * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
    * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
    * @returns {void}
    */
    setValoresStore(form: FormGroup | null, campo: string): void {
        if (!form) {
            return;
        }
        const CONTROL = form.get(campo);
        if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
            this.store.establecerDatos({ [campo]: CONTROL.value });
        }
    }



    /** Función para obtener el valor de un formulario */
    getFormValor<T>(form: FormGroup): T {
        return form.getRawValue() as T;
    }

    /** Función generica para setear valores del formulario */
    setFormValores<T>(form: FormGroup, data: Partial<T>): void {
        // patchValue updates only provided fields; setValue requires all fields
        form.patchValue(data);
    }

    /** Función para limpiar el valor de un formulario */
    limpiarForm(form: FormGroup): void {
        form.reset();
    }


    /**
  * @method abrirElimninarConfirmationopup
  * Abre un popup de confirmación para eliminar los registros seleccionados.
  * Si no hay registros seleccionados, no realiza ninguna acción.
  */
    abrirElimninarConfirmationopup(): void {
        this.nuevaNotificacionEliminar = {
            tipoNotificacion: TipoNotificacionEnum.ALERTA,
            categoria: CategoriaMensaje.ERROR,
            modo: 'modal',
            titulo: '',
            mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
            cerrar: false,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: 'Cancelar',
        };
    }

    abrirRowselectPopup(): void {
        this.nuevaNotificacionRowselect = {
            tipoNotificacion: TipoNotificacionEnum.ALERTA,
            categoria: CategoriaMensaje.ERROR,
            modo: 'modal',
            titulo: 'Alerta',
            mensaje: 'Por favor seleccione un elemento para eliminar.',
            cerrar: false,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: '',
        };
    }

    /**
    * @method noSpecialCharactersValidator
    * @description
    * Validador personalizado estático que verifica si un campo contiene caracteres especiales no permitidos.
    * Utiliza una expresión regular para detectar caracteres como: !"#$%/()=?=)(/&%$#""#$%$#"#$&
    * Si se detectan caracteres especiales, retorna un error de validación que puede ser usado para mostrar
    * el mensaje "Ingresa datos validos." en la interfaz de usuario.
    * 
    * @param {AbstractControl} control - El control de formulario que se está validando.
    * @returns {ValidationErrors | null} Objeto con el error 'hasSpecialCharacters' si hay caracteres especiales, null si la validación pasa.
    * @static
    */
    noSpecialCharactersValidator(control: AbstractControl): ValidationErrors | null {
        if (!control.value) {
            return null;
        }
        const SPECIALCHARACTERREGEX = /[!"#$%/()=?=)(/&%$#""#$%$#"#$&]/;
        const HASSPECIALCHAR = SPECIALCHARACTERREGEX.test(control.value);

        return HASSPECIALCHAR ? { hasSpecialCharacters: true } : null;
    }

    /** Elimina la mercancia seleccionada */

    eliminaMercancia = (datosTablaMercancia: MercanciaConfiguracionItem[], listaFilaSeleccionada: MercanciaConfiguracionItem[]) => {
        const IDS_TO_DELETE = listaFilaSeleccionada.map((item) => item.id);
        return datosTablaMercancia.filter((item) => !IDS_TO_DELETE.includes(item.id));
    }

    /**
* Valida si un control del formulario es inválido.
* formControlName Nombre del control del formulario.
* `true` si el control es inválido y ha sido tocado o modificado, de lo contrario `false`.
*/
    // eslint-disable-next-line class-methods-use-this
    esControlInvalido(form: FormGroup, formControlName: string): boolean {
        const CONTROL = form.get(formControlName);
        return CONTROL
            ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
            : false;
    }

    /** Formato de Fecha de la siguiente manera YYYY-MM-DD */
    formateoFechaPago(nuevo_valor: string) {
        const [DD, MM, YYYY] = nuevo_valor.split('/');
        return `${YYYY}-${MM}-${DD}`;
    }


}