import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Component, OnInit, inject, input, output, signal } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { MENSAJE_DE_ALERTA_MERCANCIA } from '../../enum/autorizaciones.enum';
import { MercanciaConfiguracionItem } from '../../enum/mercancia-tabla.enum';

import { Catalogo, CategoriaMensaje, Notificacion, REGEX_SEPARADO_POR_COMAS, TipoNotificacionEnum } from '@ng-mf/data-access-user';

import { Tramite230901Store } from '../../estados/store/tramite230901.store';
import { DatosTramite230902Service } from '../../services/datos-tramite-230901.service';
import { UtilidadesService } from '../../services/utilidades.service';
import { SHARED_MODULES } from '../../shared-imports';

/**
 * Componente que gestiona los datos de la solicitud, incluyendo la configuración de formularios,
 * tablas dinámicas y la interacción con servicios relacionados con autorizaciones de vida silvestre.
 */
@Component({
    selector: 'mercancia',
    templateUrl: './mercancia.component.html',
    standalone: true,
    imports: [SHARED_MODULES]
})
export class MercanciaComponent implements OnInit {
    /** 
   * Inyección de dependencia para construir formularios reactivos. 
  */
    private formBuilder = inject(FormBuilder)
    /**
     * Inyección de dependencia de servicio para invocar el storage.
     */
    public store = inject(Tramite230901Store)
    /** 
     * Inyección de dependencia de servicio para invocar los servicios de catlogos a necesitar.
    */
    public datosService = inject(DatosTramite230902Service)
    /**
     * Utilidades a reutilizar dentro del tramite
     */
    public utils = inject(UtilidadesService);

    /** 
     * Inicializa el estado del formulario 
    */
    public solicitudState = this.utils.solicitud;

    /** 
     * Estado actual de la consulta gestionado por el store `ConsultaioQuery`. 
    */
    public consultaState = this.utils.consultaState;

    /** Bandera de Otro Nombre Cientifico */
    mostrarOtroNombreCientifico = signal<boolean>(false);
    /** Bandera de Otro Nombre Comun */
    mostrarOtroNombreComun = signal<boolean>(false);
    /** Notificación que se muestra al usuario. */
    nuevaNotificacionEliminar: Notificacion | null = null;
    /** Referencia al modal de Bootstrap. */
    modalRef?: BsModalRef;
    /** Formulario reactivo para los datos de la mercancía.*/
    formularioMercancia!: FormGroup;
    /** Evento de Cancelar */
    cancelEvent = output<void>();
    /**  Lista de filas seleccionadas en la tabla de mercancías. */
    listaFilaSeleccionadaMercancia = input<MercanciaConfiguracionItem[]>([]);;
    /**  Señal para guardado y actualizacion de Lista de mercancías. */
    datosTablaMercancia = signal<MercanciaConfiguracionItem[]>([]);
    /** Señal para  bandera de mensaje si es nuevo o es modificar registro. */
    esModificarMercancia = signal<boolean>(false);
    /** Indica si se seleccionó otra fracción en el formulario de mercancía. */
    otraFraccionSeleccionada = signal<boolean>(false);
    /**  Mensaje de alerta relacionado con la mercancía. */
    mensajeAlertaMercancia: string = MENSAJE_DE_ALERTA_MERCANCIA;
    /** Indica si la opcion de tipo de movimiento es exportacion */
    esExportacion: boolean = this.solicitudState().cve_clasificacion_regimen === '02';

    /** Indica si el formulario está en modo solo lectura. */
    esFormularioSoloLectura = signal<boolean>(this.consultaState().readonly);

    /** Lista de Nombre cientifico filtrado por taxonomia */
    nombreCientifico!: Catalogo[];

    /** Lista de Nombre cientifico filtrado por nombre Cientifico */
    nombreComun!: Catalogo[];

    /** Puede definir explícitamente el tipo de acceso de control dinámico */
    get formControls(): { [key: string]: AbstractControl } { return this.formularioMercancia.controls; }
    /** Obtiene el grupo de formulario de Otra Fracción. */
    get otraFraccion() { return this.formControls['otraFraccion'] }
    /** Obtiene el grupo de formulario de Clave Fracción arancelaria del Combo. */
    get cve_fraccion_arancelaria() { return this.formControls['cve_fraccion_arancelaria'] }
    /** Obtiene el grupo de formulario de Clave Fracción arancelaria del Input */
    get claveFraccionArancelaria() { return this.formControls['clave_fraccion_arancelaria'] }
    /** Obtiene el grupo de formulario de Nombre Cientifico. */
    get otroNombreCientifico() { return this.formControls['nombre_cientifico'] }
    /** Obtiene el grupo de formulario de Nombre Cientifico. */
    get otroNombreComun() { return this.formControls['nombre_comun'] }
    /** Obtiene el grupo de formulario de Nombre Cientifico. */
    get cveNombreCientifico() { return this.formControls['cve_nombre_cientifico'] }
    /** Obtiene el grupo de formulario de Nombre Cientifico. */
    get cveNombreComun() { return this.formControls['cve_nombre_comun'] }
    /** Obtiene el grupo de formulario de Pais */
    get pais() { return this.formControls['cve_pais_origen'] }
    /** Obtiene el grupo de formulario de Pais procedencia. */
    get paisProcedencia() { return this.formControls['cve_pais_procedencia'] }
    /** Obtiene el grupo de formulario de Clasificacion Taxonomica. */
    get clasificacionTaxonomica() { return this.formControls['clasificacionTaxonomica'] }

    /**
     * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
     */
    ngOnInit(): void {
        this.crearNuevoFormularioMercancia();
    }

    /**
     * Crea un nuevo formulario de mercancía con valores predeterminados o datos proporcionados.
     * Si se proporcionan datos, estos sobrescriben los valores predeterminados.
     */
    crearNuevoFormularioMercancia(): void {
        this.formularioMercancia = this.formBuilder.group({
            id: [Math.floor(Math.random() * 1000)],
            cve_fraccion_arancelaria: ['', Validators.required],
            descripcion: [{ value: '', disabled: true }],
            otraFraccion: [false],
            descripcion_mercancia: ['', Validators.required],
            rendimiento_producto: [''],
            clasificacionTaxonomica: ['', Validators.required],
            cve_nombre_cientifico: ['', Validators.required],
            cve_nombre_comun: ['', Validators.required],
            marca_marcaje: ['', [Validators.required, Validators.maxLength(200), this.utils.noSpecialCharactersValidator]],
            cantidad: ['', [Validators.required, Validators.pattern(REGEX_SEPARADO_POR_COMAS), Validators.maxLength(10), Validators.pattern(/^\d{1,12}(\.\d{1,3})?$/)]],
            cve_unidad_medida_comercial: ['', Validators.required],
            cve_pais_origen: ['', Validators.required],
            cve_pais_procedencia: ['', Validators.required],
            nombre_cientifico: [''],
            nombre_comun: [''],
            id_fraccion_gubernamental: [''],
            clave_fraccion_arancelaria: ['']
        })

        const OBJECT_LENGTH: number = this.listaFilaSeleccionadaMercancia().length;

        if (OBJECT_LENGTH > 0) {
            this.esModificarMercancia.set(true);
            const [FILA_SELECCIONADA] = this.listaFilaSeleccionadaMercancia();
            const { clasificacionTaxonomica, cve_nombre_cientifico } = FILA_SELECCIONADA;
            this.otraFraccionSeleccionada.set(this.otraFraccion.value)
            this.getNombreCientifico(clasificacionTaxonomica || '')
            this.getNombreComun(clasificacionTaxonomica || '', cve_nombre_cientifico)
            this.formularioMercancia.patchValue(FILA_SELECCIONADA)
        }

        if (this.esExportacion) {
            this.pais.patchValue('MEX');
            this.paisProcedencia.patchValue('MEX');
        }

    }

    /**
         * Busca los datos adicionales para la fraccion arancelaria
         */
    buscarfraccionVigente(event: Event): void {
        const CLAVE_FRACCION_ARANCELARIA = (event.target as HTMLInputElement).value;
        this.obtieneDescripcionArancelaria(CLAVE_FRACCION_ARANCELARIA || '')
    }

    /**
         * Busca los datos adicionales para la fraccion arancelaria en caso de hacerlo manual
         */
    manejarCambioOtraFraccion(event: Event): void {
        const CHECKED = (event.target as HTMLInputElement).checked;
        this.otraFraccionSeleccionada.set(CHECKED);

        this.claveFraccionArancelaria.reset();
        this.cve_fraccion_arancelaria.reset();
        this.formularioMercancia.get('descripcion')?.reset();

        if (CHECKED) {
            this.cve_fraccion_arancelaria.clearValidators();
            this.cve_fraccion_arancelaria.updateValueAndValidity({ emitEvent: false });
        }
    }

    /**
     * Maneja el cambio en la fracción arancelaria seleccionada.
     * $event Evento que contiene la información de la fracción arancelaria seleccionada.
     */
    manejarCambioFraccionArancelaria(event: Catalogo): void {
        const { clave: CLAVE_FRACCION_ARANCELARIA } = event;
        this.obtieneDescripcionArancelaria(CLAVE_FRACCION_ARANCELARIA || '')
    }

    /*Se hace la consulta de la clave arancelaria */
    async obtieneDescripcionArancelaria(clave: string): Promise<void> {
        this.formularioMercancia.get('descripcion')?.reset();
        const data = await this.datosService.getDecripcionFraccionArancelaria(clave);
        if (data === undefined) { this.abrirConfirmationopup(); }
        this.formularioMercancia.patchValue(data)
    }
    /**
    * Maneja el cambio en la Clasificacion Taxonomica seleccionada.
    * $event Evento que contiene la información de la fracción arancelaria seleccionada.
    */
    manejarClasificacionTaxonomica(event: Catalogo) {
        this.resetearDefault()
        this.nombreCientifico = [];
        this.cveNombreCientifico.reset();
        this.nombreComun = [];
        this.cveNombreComun.reset();
        const { clave: CLAVE_CLASIFICACION_TAXONOMICA } = event;
        this.getNombreCientifico(CLAVE_CLASIFICACION_TAXONOMICA || '');
    }


    /**
    * Maneja el cambio de Nombre Cientifico seleccionada.
    * $event Evento que contiene la información de la fracción arancelaria seleccionada.
    */
    async manejarNombreCientifico(event: Catalogo) {
        this.resetearDefault()
        const { clave: CLAVE_NOMBRE_CIENTIFICO } = event;
        if (CLAVE_NOMBRE_CIENTIFICO?.toLowerCase() === 'otro') {
            this.mostrarOtroNombreCientifico.set(true);

            this.otroNombreCientifico.setValidators([Validators.required]);
            this.otroNombreCientifico.updateValueAndValidity({ emitEvent: false });
        } else {
            this.mostrarOtroNombreCientifico.set(false);
            this.otroNombreCientifico.setValue('');
        }
        const CLAVE_CLASIFICACION_TAXONOMICA = this.clasificacionTaxonomica.value || '';
        this.getNombreComun(CLAVE_CLASIFICACION_TAXONOMICA, CLAVE_NOMBRE_CIENTIFICO || '')
    }

    /**
     * Metodo para obtener el catalogo de nombre cientifico
     * 
     * @param clave_clasificacion_taxonomica 
     */
    async getNombreCientifico(clave_clasificacion_taxonomica: string): Promise<void> {
        this.nombreCientifico = await this.datosService.getNombreCientifico(clave_clasificacion_taxonomica);
    }
    /**
     * Metodo para obtener el catalogo de nombre comun
     * 
     * @param clave_clasificacion_taxonomica 
     * @param clave_nombre_cientifico 
     */
    async getNombreComun(clave_clasificacion_taxonomica: string, clave_nombre_cientifico: string): Promise<void> {
        this.nombreComun = await this.datosService.getNombreComun(clave_clasificacion_taxonomica, clave_nombre_cientifico);
    }
    /**
    * Maneja el cambio de Nombre Comun seleccionada.
    * $event Evento que contiene la información de la fracción arancelaria seleccionada.
    */
    manejarNombreComun(event: Catalogo): void {
        const { descripcion: DESCRIPCION_NOMBRE_COMUN } = event;
        if (DESCRIPCION_NOMBRE_COMUN?.toLowerCase() === 'otro') {
            this.mostrarOtroNombreComun.set(true);

            this.otroNombreComun.setValidators([Validators.required]);
            this.otroNombreComun.updateValueAndValidity({ emitEvent: false });
        } else {
            this.mostrarOtroNombreComun.set(false);
            this.otroNombreComun.setValue('');
            this.otroNombreComun.clearValidators();
            this.otroNombreComun.updateValueAndValidity({ emitEvent: false });
        }
    }

    resetearDefault(): void {
        this.mostrarOtroNombreCientifico.set(false);
        this.mostrarOtroNombreComun.set(false);

        this.otroNombreCientifico.clearValidators();
        this.otroNombreComun.clearValidators();

        this.otroNombreCientifico.updateValueAndValidity({ emitEvent: false });
        this.otroNombreComun.updateValueAndValidity({ emitEvent: false });
    }

    /**
     * Envía los datos del formulario de mercancía.
     * Valida el formulario, actualiza o agrega una nueva fila en la tabla de mercancías,
     * y actualiza el estado del almacén correspondiente.
     */
    enviarFormularioMercancia(): void {
        if (this.formularioMercancia.invalid) {
            this.formularioMercancia.markAllAsTouched();
            return;
        }
        const { id: ID } = this.formularioMercancia.getRawValue();

        this.datosTablaMercancia.set(this.solicitudState().mercancias)
        this.datosTablaMercancia.update(currentItems => {
            const ITEM_INDEX = currentItems.findIndex(item => item.id === ID);
            if (ITEM_INDEX > -1) {
                const UPDATE_ITEMS = [...currentItems];
                UPDATE_ITEMS[ITEM_INDEX] = { ...this.formularioMercancia.getRawValue() };
                return [...UPDATE_ITEMS];
            } else {
                const DATOS_MERCANCIA = [this.formularioMercancia.getRawValue()].map(item => ({
                    ...item,
                    cve_clasificacion_taxonomica: item.clasificacionTaxonomica,
                    nombre_cientifico: this.mostrarOtroNombreCientifico() ? this.otroNombreCientifico.value : item.cve_nombre_cientifico === '' ? this.nombreCientifico.find((list) => list.clave === item.cve_nombre_cientifico)?.descripcion : item.cve_nombre_cientifico,
                    nombre_comun: this.mostrarOtroNombreComun() ? this.otroNombreComun.value : this.nombreComun.find((list) => list.clave === item.cve_nombre_comun)?.descripcion,
                    nombre_comun_especifique: this.mostrarOtroNombreComun() ? this.otroNombreComun.value : '',
                    unidad_medida_comercial: this.datosService.listaUnidadMedida().find((list) => list.clave === item.cve_unidad_medida_comercial)?.descripcion || '',
                    pais_origen: this.datosService.listaPaises().find((list) => list.clave === item.cve_pais_origen)?.descripcion || '',
                    pais_procedencia: this.esExportacion ? this.datosService.listaPaises().find((list) => list.clave === item.cve_pais_procedencia)?.descripcion || '' : this.datosService.listaPaisesSinMexico().find((list) => list.clave === item.cve_pais_procedencia)?.descripcion || '',
                }))
                return [...currentItems, DATOS_MERCANCIA[0]]
            }
        });
        this.store.setMercancias(this.datosTablaMercancia())
        this.formularioMercancia.reset();
        this.cerrarModal()
    }

    /** Cierra modal */
    cerrarModal(): void {
        this.modalRef?.hide();
        this.cancelEvent.emit();
    }

    /**
      * @method abrirElimninarConfirmationopup
      * Abre un popup de confirmación para eliminar los registros seleccionados.
      * Si no hay registros seleccionados, no realiza ninguna acción.
      */
    abrirConfirmationopup(): void {
        this.nuevaNotificacionEliminar = {
            tipoNotificacion: TipoNotificacionEnum.ALERTA,
            categoria: CategoriaMensaje.ERROR,
            modo: 'modal',
            titulo: '',
            mensaje: 'Debe agregar una fracción válida',
            cerrar: false,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: '',
        };
    }

    /**
     * Limpia la clave cuando se le notifica que no existe.
     */
    onConfirmacion(confirmado: boolean): void {
        if (confirmado) { this.claveFraccionArancelaria.setValue(''); }
    }

    /**
     * Limpia todo el formulario y reseta valores de banderas en las señales
     */
    limpiar(): void {
        this.utils.limpiarForm(this.formularioMercancia);
        this.otraFraccionSeleccionada.set(false);
        this.mostrarOtroNombreComun.set(false);
        this.mostrarOtroNombreCientifico.set(false);
    }
}
