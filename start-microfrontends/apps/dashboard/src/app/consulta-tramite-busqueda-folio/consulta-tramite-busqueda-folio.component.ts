import { AlertComponent, REG_X, TramiteStore } from "@libs/shared/data-access-user/src";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Subject, map, takeUntil } from "rxjs";
import { ConsultaTramiteService } from "../services/consulta-tramite.service";
import { LoginQuery } from '@ng-mf/data-access-user';
import { NgIf } from "@angular/common";
import { Router } from "@angular/router";

@Component({
    selector: 'consulta-tramite-busqueda',
    standalone: true,
    styleUrl: "./consulta-tramite-busqueda-folio.component.scss",
    templateUrl: "./consulta-tramite-busqueda-folio.component.html",
    imports: [ReactiveFormsModule, AlertComponent, NgIf]
})
export class ConsultaTramiteBusquedaFolioComponent implements OnInit, OnDestroy {
    /*
     * Subject utilizado para emitir un valor y completar las suscripciones activas 
     * cuando el componente se destruye, evitando fugas de memoria.
     */
    private destroyNotifier$: Subject<void> = new Subject();
    /** 
     * Formulario de búsqueda 
    */
    public FormBuscaTramite!: FormGroup;
    /* URL a la que se navega al seleccionar un trámite */
    public procedureUrl!: string;
    /* Indica si el formulario es válido */
    public hasValidForm: boolean = false;
    /**
  * @property {boolean} alertVisible
  * Maneja la visivilidad de la alerta
  */
    public alertVisible: boolean = false;
    /**
   * @property {string} classAlert
   * Clase CSS usada para mostrar alertas de Error.
   */
    public classAlert = 'alert-info';

    /**
     * @property {string} alertMessage
     * Mensaje de alerta para la notificación
     */

    public alertMessage: string = ''
    /*
    * Valor del RFC obtenido del estado de login.
    */
    public rfcValor = ''

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private tramiteStates: TramiteStore,
        public consultaTramiteService: ConsultaTramiteService,
        public loginQuery: LoginQuery
    ) {
        /**
         * Constructor de la clase ConsultaTramiteComponent.
         * @param router - Router para la navegación.
         * @param fb - FormBuilder para crear formularios reactivos.
         * @param tramiteStates - Store para manejar el estado del trámite.
         * @param solicitudtramiteQuery - Query para obtener el estado de la solicitud del trámite.
         */
    }
    /** 
     * Método para inicializar el formulario de búsqueda 
     */
    inicializaFormConsulta(): void {
        this.FormBuscaTramite = this.fb.group({
            folioDelTramite: ['', [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS), Validators.minLength(25)]],
        });
    }

    ngOnInit(): void {
        this.loginQuery.selectLoginState$
            .pipe(
                takeUntil(this.destroyNotifier$),
                map((state) => {
                    this.rfcValor = state.rfc
                })
            )
            .subscribe();
        this.inicializaFormConsulta()
    }

    buscarTramite(): void {
        this.alertVisible = false;
        this.alertMessage = '';
        this.classAlert = 'alert-danger';

        if (this.FormBuscaTramite.invalid) {
            this.alertVisible = true;
            this.alertMessage = 'Falta un campo por capturar';
            this.classAlert = 'alert-danger';
            return;
        }
        const FOLIO = this.FormBuscaTramite.get('folioDelTramite')?.value.toString();
        this.consultaTramiteService.getDetallesDelTramite({
            roles_usuario: ["AdministradorDependencia", "Dictaminador"],
            user_name: this.rfcValor,
            folio: FOLIO
        }).subscribe({
            next: (res) => {
                if (res.codigo === "BANDEJA-TRA01") {
                    this.alertVisible = true;
                    this.alertMessage = '<div style="text-align: center;"><p>Corrija los siguientes errores:</p><ol style="color: red;"><li>    No existe informacion con el folio proporcionado.</li></ol></div>';
                    this.classAlert = 'alert-danger';
                    return;
                }
                if (res.codigo.length > 0 && res.codigo !== "00") {
                    this.alertVisible = true;
                    this.alertMessage = `<div style="text-align: center;"><p>Corrija los siguientes errores:</p><ol style="color: red;"><li>    ${res.causa}</li></ol></div>`;
                    this.classAlert = 'alert-danger';
                    return;
                }

                const { datos: DATA } = res;

                const FOLIO = DATA.num_folio_tramite;
                const TIPO_TRAMITE = String(DATA.id_tipo_tramite);
                const ID_SOLICITUD = String(DATA.id_solicitud);
                const ACRONIMO = DATA.acronimo;
                const DIAS_HABILES = String(DATA.dias_habiles_transcurridos);

                const DEPARTAMENTO = ACRONIMO.toLowerCase();

                const TIPO_SOLICITUD = DATA.tipo_solicitud || '';
                const TAREAS_ACTIVAS = DATA.tareas_activas || [];

                localStorage.setItem('folioTramite', FOLIO);
                localStorage.setItem('tipoTramite', TIPO_TRAMITE);
                localStorage.setItem('idSolicitud', ID_SOLICITUD);
                localStorage.setItem('acronimo', ACRONIMO);
                localStorage.setItem('tipoSolicitud', TIPO_SOLICITUD);
                localStorage.setItem('diaHabilesTranscurridos', DIAS_HABILES);
                localStorage.setItem('tareasActivas', JSON.stringify(TAREAS_ACTIVAS));

                this.router.navigate([`${DEPARTAMENTO}/datos-generales-tramite`]);
            }
        })
    }

    /**
   * Maneja la selección de un trámite actualizando el store con los valores del formulario proporcionado.
   *
   * @param {FormGroup} form - El FormGroup que contiene los datos del formulario relacionados con el trámite.
   * @param {string} campo - El nombre del campo asociado con la selección del trámite.
   * @param {string} metodoNombre - El nombre del método que se utilizará para procesar la selección del trámite.
   * @returns {void}
   */

    tramiteSeleccionado(form: FormGroup, campo: string, metodoNombre: string): void {
        this.setValoresStore(form, campo, metodoNombre);
    }
    setValoresStore(form: FormGroup, campo: string, metodoNombre: string): void {
        const VALOR = form.get(campo)?.value;
        /**
         *  Suponiendo que TramiteStore tiene un método 'update' o similar para actualizar el estado
         *  Reemplaza 'update' por el método correcto si es diferente
         */
        this.tramiteStates.update({ [metodoNombre]: VALOR });
    }

    /**
   * Verifica si un control del formulario es inválido, tocado o modificado.
   * @param nombreControl - Nombre del control a verificar.
   * @returns True si el control es inválido, de lo contrario false.
   */
    public esInvalido(nombreControl: string): boolean {
        const CONTROL = this.FormBuscaTramite.get(nombreControl);
        return CONTROL
            ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
            : false;
    }

    /*
  * Hook de destrucción del componente.
  * Finaliza las suscripciones activas al destruir el componente para evitar fugas de memoria.
  */
    ngOnDestroy(): void {
        this.destroyNotifier$.next();
        this.destroyNotifier$.complete();
    }

}