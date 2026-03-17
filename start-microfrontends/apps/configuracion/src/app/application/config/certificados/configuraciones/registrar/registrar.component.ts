import { Component, signal } from "@angular/core";
import { InputFecha, InputFechaComponent, PickListComponent } from "@libs/shared/data-access-user/src";
import { AsyncPipe } from "@angular/common";
import { ListaSelect } from "../../../../core/models/certificados/configuracion/registrar/response/listaSelect";
import { Observable } from "rxjs";
import { RegistrarCertificadosService } from "../../../../core/services/certificados/configuraciones/registrarCertificado.service";

/**
 * Configuración para el campo de fecha inicial.
 */
export const FECHA_INICIO = {
    labelNombre: 'Fecha inicial',
    habilitado: true,
    required: false,
};

@Component({
    standalone: true,
    templateUrl: './registrar.component.html',
    styleUrl: './registrar.component.scss',
    imports: [AsyncPipe, InputFechaComponent, PickListComponent]
})
export class RegistrarConfiguracionesComponent {
    /**
     * Observable que contiene la lista de tratados disponibles.
     *
     * Se utiliza generalmente para poblar un componente de selección
     * (por ejemplo, un `select`) mediante el uso de `async pipe`.
     */
    public listaTratados$: Observable<ListaSelect[]>;
    /**
     * Identificador del tratado seleccionado por el usuario.
     *
     * Se emplea como criterio para filtrar o consultar información
     * relacionada con certificados o países.
     *
     * @default ''
     */
    public tratadoSeleccionado: ListaSelect | null = null;
    /**
     * Fecha de inicio seleccionada por el usuario.
     *
     * Se utiliza como parámetro para la búsqueda o registro
     * de certificados asociados a un tratado.
     *
     * @default ''
     */
    public fechaInicio: string = '';
    /**
     * Configuración del input de fecha de inicio.
     *
     * Define las propiedades y comportamiento del componente
     * de fecha utilizado para capturar la fecha inicial.
     */

    public fechaInicioInput: InputFecha = FECHA_INICIO;

    /**
     * Constructor del componente.
     *
     * Inicializa el observable de tratados consumiendo el servicio
     * `RegistrarCertificadosService`.
     *
     * @param registrarCertificadosService Servicio encargado de
     * obtener la información relacionada con certificados, tratados
     * y países.
     */
    constructor(
        private registrarCertificadosService: RegistrarCertificadosService
    ) {
        this.listaTratados$ = this.registrarCertificadosService.obtenerListaTramites();
    }
    /**
     * Obtiene la lista de países o bloques de países.
     *
     * Consume el servicio correspondiente y asigna la información
     * recibida a la variable `listaBloquePais`, la cual se utiliza
     * para renderizar los datos en la vista.
     */
    public obtenerListaPais(): void {
        this.registrarCertificadosService.obtenerListaPais().subscribe((res) => { this.disponibles.set(res); })
    }
    /**
     * Asigna el tratado seleccionado por el usuario.
     *
     * Al seleccionar un tratado, se actualiza el estado interno
     * y se obtiene la lista de países asociada a dicho tratado.
     *
     * @param tratado Tratado seleccionado.
     */
    public seleccionarTratado(tratado: ListaSelect): void {
        this.tratadoSeleccionado = tratado;
        this.obtenerListaPais()
    }
    /**
     * Maneja el cambio de la fecha de inicio.
     *
     * Actualiza la variable de fecha de inicio con el nuevo
     * valor seleccionado por el usuario.
     *
     * @param nuevoValor Nueva fecha seleccionada.
     */
    public cambioFechaInicio(nuevoValor: string): void {
        this.fechaInicio = nuevoValor
    }


    /**
     * Signal que contiene la lista de elementos disponibles.
     *
     * Representa los países que pueden ser seleccionados y se utiliza
     * como fuente de datos para el componente PickList.
     */
    public disponibles = signal<ListaSelect[]>([]);
    /**
     * Signal que contiene la lista de elementos seleccionados.
     *
     * Almacena los países que han sido elegidos por el usuario y se
     * utiliza para renderizar la lista de seleccionados.
     */
    public seleccionados = signal<ListaSelect[]>([]);
    /**
     * Función utilizada para identificar de forma única cada país.
     *
     * Se emplea como función `trackBy` para optimizar el renderizado
     * de las listas y evitar recreaciones innecesarias del DOM.
     *
     * @param pais País a identificar.
     * @returns Identificador único del país.
     */
    trackByPais = (pais: ListaSelect):string => pais.value;
    /**
     * Función utilizada para obtener el texto visible de un país.
     *
     * Se emplea como función `displayWith` para mostrar el nombre
     * legible del país dentro del componente PickList.
     *
     * @param pais País a mostrar.
     * @returns Etiqueta visible del país.
     */
    displayPais = (pais: ListaSelect):string => pais.label;


    /**
     * Agrega un elemento a seleccionados y lo quita de disponibles
     */
    public agregar(item: ListaSelect): void {
        this.seleccionados.update(items => {
            if (items.some(i => i.value === item.value)) {
                return items;
            }
            return [...items, item];
        });

        this.disponibles.update(list =>
            list.filter(i => i.value !== item.value)
        );
    }

    /**
     * Agrega todos los disponibles a seleccionados
     */
    public agregarTodos(): void {
        this.seleccionados.update(list => {
            const EXISTENTES = new Set(list.map(i => i.value));

            const NUEVOS = this.disponibles().filter(
                item => !EXISTENTES.has(item.value)
            );

            return [...list, ...NUEVOS];
        });

        this.disponibles.set([]);
    }

    /**
     * Elimina un elemento de seleccionados y lo regresa a disponibles
     */
    public eliminar(item: ListaSelect): void {
        this.seleccionados.update(list =>
            list.filter(i => i.value !== item.value)
        );

        this.disponibles.update(list => {
            if (list.some(i => i.value === item.value)) {
                return list;
            }
            return [...list, item];
        });
    }

    /**
     * Elimina todos los seleccionados y los regresa a disponibles
     */
    public eliminarTodos(): void {
        this.disponibles.update(list => {
            const EXISTENTES = new Set(list.map(i => i.value));

            const NUEVOS = this.seleccionados().filter(
                item => !EXISTENTES.has(item.value)
            );

            return [...list, ...NUEVOS];
        });

        this.seleccionados.set([]);
    }

}