import { AlertComponent, InputFecha, InputFechaComponent, ModalComponent } from "@libs/shared/data-access-user/src";
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import { AgregarFraccionComponent } from "./agregar-fraccion/agregar-fraccion.component";
import { CargarArchivoComponent } from "./cargar-archivo/cargar-archivo.component";
import { ConsultarFraccionComponent } from "./consultar-fraccion/consultar-fraccion.component";
import { DocumentosFraccionesComponent } from "./documentos-fraccion/documentos-fraccion.component";
import { DocumentosResponse } from "../../../../core/models/agregar-fraccion/response/documentos-response";
import { EliminarFraccionComponent } from "./eliminar-fraccion/eliminar-fraccion.component";
import { FraccionesResponse } from "../../../../core/models/agregar-fraccion/response/agregar-fraccion";

/**
 * Configuración para el campo de fecha inicial.
 */
export const FECHA_INICIO_VIGENCIA = {
    labelNombre: 'Fecha inicio de vigencia',
    habilitado: true,
    required: true,
};

@Component({
    standalone: true,
    templateUrl: "./registrar.component.html",
    styleUrl: "./registrar.component.scss",
    imports: [InputFechaComponent, AgregarFraccionComponent, ModalComponent, EliminarFraccionComponent, ConsultarFraccionComponent, CargarArchivoComponent, DocumentosFraccionesComponent, AlertComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegistrarComponent {
    /**
     * @property {string} classAlert
     * Clase CSS usada para mostrar alertas de Error.
     */
    public classAlert = 'alert-danger';

    /**
     * @property {string} alertMessage
     * Mensaje de alerta para la notificación
     */

    public alertMessage: string = ''

    public showAlert: boolean = false;
    /**
     * lista de opciones para el select de tratamiento especial
     */
    public listaTratamientoEspecial = [
        { id: "-1", name: "Seleccione" },
        { id: "1", name: "Sensible Azúcar" },
        { id: "2", name: "Sensible Acero" },
        { id: "3", name: "Sensible Llantas" },
        { id: "4", name: "3R's" },
        { id: "5", name: "Prohibidos" },
        { id: "6", name: "Textiles" },
        { id: "100", name: "Anexo 1" },
        { id: "104", name: "Servicios" },
        { id: "101", name: "Ampliación" },
        { id: "103", name: "Sensible Subsecuente" },
        { id: "102", name: "Cambio Modalidad" },
        { id: "0", name: "Generales" },
        { id: "7", name: "Sensibles nuevo" },
        { id: "8", name: "Prohibidas nuevo" },
        { id: "9", name: "Prohibidas exportación programa nuevo" },
        { id: "203", name: "Prueba fracciones" },
        { id: "202", name: "QAS" },
        { id: "10", name: "Prohibidas exportación sensibles" },
        { id: "11", name: "QWERT" }
    ]
    private tratamientoEspecialId: string = ""
    /**
    * Configuración del campo de fecha inicial.
    */
    public fechaInicioInput: InputFecha = FECHA_INICIO_VIGENCIA;

    public fechaInicioVigencia: string = ''
    /**
     * Controla la visibilidad del modal "Agregar Fracción".
     *
     * @property {boolean} mostrarModalAgregarFraccion - Indica si el modal debe mostrarse (true)
     * o mantenerse oculto (false).
     */
    public mostrarModalAgregarFraccion: boolean = false;
    /**
     * Controla la visibilidad del modal "Eliminar Fracción".
     *
     * @property {boolean} mostrarModalEliminarFraccion - Indica si el modal debe mostrarse (true).
     */
    public mostrarModalEliminarFraccion: boolean = false;
    /**
     * Controla la visibilidad del modal "Consultar Fracción".
     *
     * @property {boolean} mostrarModalConsultarFraccion - Indica si el modal debe mostrarse (true).
     */
    public mostrarModalConsultarFraccion: boolean = false;
    /**
     * Controla la visibilidad del modal para cargar un archivo relacionado.
     *
     * @property {boolean} mostrarCargarArchivo - Determina si el modal de carga debe presentarse.
     */
    public mostrarCargarArchivo: boolean = false;
    /**
     * Controla la visibilidad del modal documentos
     * @property {boolean} mostrarDocumentos - Determina si el modal de Documentos debe presentarse.
     */
    public mostrarDocumentos: boolean = false;
    /**
     * Actualiza el valor de la fecha inicial de vigencia cuando el usuario selecciona un nuevo valor.
     *
     * @method cambioFechaInicio
     * @param {string} nuevo_valor - Fecha seleccionada por el usuario.
     */
    public cambioFechaInicio(nuevo_valor: string): void {
        this.fechaInicioVigencia = nuevo_valor
    }
    public fraccionesAgregadas: FraccionesResponse[] = [];
    public documentosAgregados: DocumentosResponse[] = [];
    private erroresDeValidacion: string[] = []
    /**
     * Muestra el modal correspondiente según el identificador recibido.
     *
     * @method abrirModal
     * @param {number} id - Identificador del modal que debe abrirse:
     *  - `1` → Modal Agregar Fracción
     *  - `2` → Modal Eliminar Fracción
     *  - `3` → Modal Consultar Fracción
     *  - `4` → Modal Cargar Archivo
     */
    abrirModal(id: number): void {
        switch (id) {
            case 1:
                this.mostrarModalAgregarFraccion = true;
                break;
            case 2:
                this.mostrarModalEliminarFraccion = true;
                break;
            case 3:
                this.mostrarModalConsultarFraccion = true;
                break;
            case 4:
                this.mostrarCargarArchivo = true
                break;
            case 5:
                this.mostrarDocumentos = true;
                break
            default: break;
        }
    }
    public recibirFraccionesSeleccionadas(fracciones: FraccionesResponse[]): void {
        this.fraccionesAgregadas = fracciones;
        this.mostrarModalAgregarFraccion = false;
    }

    public actualizarFracciones(nuevasFracciones: FraccionesResponse[]): void {
        this.fraccionesAgregadas = nuevasFracciones;
    }

    public recibirDocumentosAgregados(documentos: DocumentosResponse[]): void {
        this.documentosAgregados = documentos
    }

    public seleccionarTratamientoEspecial(event: Event): void {
        const SELECT = event.target as HTMLSelectElement;
        this.tratamientoEspecialId = SELECT.id
    }

    private construirListaErrores(errores: string[]): string {
        if (!errores.length) {
            return '';
        }

        const ITEMS = errores
            .map(error => `<li>${error}</li>`)
            .join('');

        return `<p>Corrija los siguiente errores:</p>
        <ol>${ITEMS}</ol>`;
    }



    private validarRegistro(): boolean {
        this.erroresDeValidacion = [];
        this.alertMessage = ""
        this.showAlert = false


        if (!this.fechaInicioVigencia?.trim()) {
            this.erroresDeValidacion.push(
                '(Fecha inicio de vigencia) es un campo requerido'
            );
        }

        if (!this.tratamientoEspecialId) {
            this.erroresDeValidacion.push(
                'Debe agregar un tratamiento especial'
            );
        }

        if (this.documentosAgregados.length === 0) {
            this.erroresDeValidacion.push(
                'Es requerido seleccionar al menos un Tipo de Documento y su Tipo de Tratamiento'
            );
        }

        if (this.fraccionesAgregadas.length === 0) {
            this.erroresDeValidacion.push(
                'Debe agregar una Fracción Arancelaria'
            );
        }

        if (this.erroresDeValidacion.length > 0) {
            this.showAlert = false;
            setTimeout(() => {
                this.alertMessage = this.construirListaErrores(this.erroresDeValidacion);
                this.showAlert = true;
            });
            return false;
        }


        this.alertMessage = '';
        return true;
    }


    public guardarRegistro(): void {
        this.validarRegistro()
        // if(this.validarRegistro()){
        //     return;
        // }
        // return;
    }
}