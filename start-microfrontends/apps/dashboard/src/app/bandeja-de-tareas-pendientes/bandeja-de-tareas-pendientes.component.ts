import { BANDEJA_DE_TAREAS_PENDIENTES_FORMA , BandejaDeTareasPendientes, ConfiguracionColumna, ConsultaioStore, LibBandejaComponent, MenuFuncionarioComponent, ModeloDeFormaDinamica,esValidArray } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Departamento, TramiteItem } from '../models/confirmar-notificacion.model';
import { LoginQuery,TareaStore } from '@ng-mf/data-access-user';
import { Subject,map, takeUntil } from 'rxjs';
import { BandejaDeSolicitudeService } from '../services/bandeja-de-solicitude.service';
import { CommonModule } from '@angular/common';
import { SeleccionadoDepartamento } from '@libs/shared/data-access-user/src/core/models/shared/bandeja-de-tareas-pendientes.model';
import tramiteDetailsData from '@libs/shared/theme/assets/json/tramiteList.json';



/* 
  Componente bandeja-de-tareas-pendientes:
  - selector: etiqueta HTML del componente.
  - standalone: componente independiente.
  - imports: módulos requeridos.
  - templateUrl: HTML del componente.
  - styleUrl: estilos del componente.
*/
@Component({
  selector: 'bandeja-de-tareas-pendientes',
  standalone: true,
  imports: [CommonModule,LibBandejaComponent, MenuFuncionarioComponent],
  templateUrl: './bandeja-de-tareas-pendientes.component.html',
  styleUrl: './bandeja-de-tareas-pendientes.component.scss',
})
/*
 * Componente responsable de mostrar la bandeja de tareas pendientes.
 * Implementa OnInit para cargar los datos de la bandeja al iniciar,
 * e implementa OnDestroy para liberar recursos y cancelar suscripciones activas.
 */
export class BandejaDeTareasPendientesComponent implements OnInit,OnDestroy {
/*
 * Subject utilizado para emitir un valor y completar las suscripciones activas 
 * cuando el componente se destruye, evitando fugas de memoria.
 */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Almacena los datos relacionados con los departamentos.
   * Cada elemento del arreglo representa un departamento y su información asociada.
   * La estructura de cada elemento es de tipo `any`, por lo que puede contener cualquier forma de datos de departamento.
   */
  public departamentoDatos: Departamento[] = [];
  /**
   * Almacena una lista de números de procedimiento.
   *
   * @remarks
   * Este arreglo contiene los números de procedimiento relevantes para el componente.
   * El tipo está definido como `Array<any>`, lo que permite almacenar cualquier tipo de valor.
   * Considere especificar un tipo más preciso para una mejor seguridad de tipos.
   */
 public procedureNumero: TramiteItem[] = [];
  /**
   * Representa el objeto del departamento actualmente seleccionado.
   * 
   * @property {boolean} tieneDepartamento - Indica si un departamento está seleccionado.
   * @property {string} numeroDeProcedimiento - El número de procedimiento asociado al departamento.
   * @property {string} nombreDelDepartamento - El nombre del departamento seleccionado.
   */
  public selectedDepartamentoObj: SeleccionadoDepartamento = {
    tieneDepartamento: false,
    numeroDeProcedimiento: '',
    nombreDelDepartamento: '',
  };
  /*
   * Configuración de las columnas que se mostrarán en la tabla de tareas pendientes.
   */
  public dePendientesConfiguracionTabla: ConfiguracionColumna<BandejaDeTareasPendientes>[] = [];
  /**
   * Datos que se mostrarán en la tabla de tareas pendientes.
   */
  public dePendientesTablaDatos: BandejaDeTareasPendientes[] = [];
  /**
   * Almacena una copia de los datos de tareas pendientes para su uso dentro del componente.
   */
  public copiarDatos: BandejaDeTareasPendientes[] = [];
  /*
   * Estructura del formulario utilizado para la bandeja de tareas pendientes.
   */
    public bandejaDeTareasForma = BANDEJA_DE_TAREAS_PENDIENTES_FORMA;

  /**
   * Almacena el valor del RFC asociado al trámite.
   */
  public rfcValor: string = '';

  /**
   * Bandera que indica si el usuario es funcionario.
   * Se utiliza para mostrar u ocultar funcionalidades específicas para funcionarios.
   */
  banderafuncionariorecive: boolean = false;
  /*
   * Constructor del componente.
   * Inyecta el servicio BandejaDeSolicitudeService para obtener los datos necesarios.
   */
    constructor(
        private bandejaSvc: BandejaDeSolicitudeService, 
        private consultaStore: ConsultaioStore,
        private loginQuery: LoginQuery, 
        private _tareaStore: TareaStore
      ) {
  
    }
  /*
   * Hook de inicialización del componente.
   * Llama al método para obtener los datos de la tabla al cargar el componente.
   */
    ngOnInit(): void {
    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.rfcValor = seccionState.rfc;
        })
      )
      .subscribe();
      this.getNombreDelDepartamento();
      this.obtieneTipoSolicitudes();
      this.obtieneTareas();
      
    }

    recibirCambioFuncionario(nuevoValor: boolean): void {
    this.banderafuncionariorecive = nuevoValor;
  }

    /*
   * Método para obtener los datos de la tabla de tareas pendientes desde el servicio.
   * Se suscribe al observable y asigna los datos obtenidos a la propiedad correspondiente.
   */
    public getBandejaDeTablaDatos(): void {
      this.bandejaSvc.getTareasPendientesTablaDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
        this.dePendientesTablaDatos = JSON.parse(JSON.stringify(response));
        this.copiarDatos = this.dePendientesTablaDatos;
      });
    }

    /**
     * Obtiene los datos de los departamentos desde el servicio y actualiza las opciones del campo del formulario.
     *
     * Este método se suscribe al observable `getDepartamento` de `bandejaSvc`, procesa la respuesta de la API
     * y asigna los datos de los departamentos a `departamentoDatos`. Luego localiza el campo del formulario con el ID 'departamento'
     * en `bandejaDeTareasForma` y, si el campo existe y aún no tiene opciones, llena su propiedad `opciones`
     * con los acrónimos e IDs de los departamentos.
     */
    public getNombreDelDepartamento(): void {
      this.bandejaSvc.getDepartamento().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
        const API_RESPONSE = JSON.parse(JSON.stringify(response));
        let DATOS = API_RESPONSE.data;

        // Ordena por ACRONIMO
        DATOS = DATOS.sort((a: { ACRONIMO: string }, b: { ACRONIMO: string }) =>
          a.ACRONIMO.localeCompare(b.ACRONIMO)
        );

        // Agrupa por ACRONIMO
        const AGRUPADOS: { [KEY: string]: Departamento[] } = {};
        DATOS.forEach((item: Departamento) => {
          const KEY = item.ACRONIMO || 'Sin acrónimo';
          if (!AGRUPADOS[KEY]) {
            AGRUPADOS[KEY] = [];
          }
          AGRUPADOS[KEY].push(item);
        });

        // Convierte agrupados a array si lo necesitas, aquí solo asigna los datos ordenados
        this.departamentoDatos = DATOS;

        const CLASIFICACION_FIELD = this.bandejaDeTareasForma.find(
          (datos: ModeloDeFormaDinamica) => datos.id === 'departamento'
        ) as ModeloDeFormaDinamica;
        if (CLASIFICACION_FIELD) {
          if (!CLASIFICACION_FIELD.opciones) {
        CLASIFICACION_FIELD.opciones = DATOS.map(
          (item: { ID_DEPENDENCIA: number; ACRONIMO: string }) => ({
            descripcion: item.ACRONIMO,
            id: item.ID_DEPENDENCIA,
          })
        );
          }
        }
      });
    }

    /**
     * Maneja los cambios en el departamento o procedimiento seleccionado según el evento proporcionado.
     *
     * @param event - Un objeto que contiene el campo (`campo`) que está cambiando y su nuevo valor (`valor`).
     *   - Si `campo` es `'departamento'`, actualiza el objeto de departamento seleccionado, asigna su acrónimo y obtiene los procedimientos relacionados.
     *   - Si `campo` es `'procedimiento'`, actualiza el objeto de departamento seleccionado con el número de procedimiento seleccionado.
     *   - Para cualquier otro valor, reinicia el estado de selección del departamento.
     */
    public departamento(event: { campo: string; valor: string }): void {
      if (event.campo === 'departamento') {
        this.selectedDepartamentoObj.tieneDepartamento = true;
        // Filtra el departamento seleccionado
        const SELECTED_DEPARTAMENTO = this.departamentoDatos.filter(
          (item) => item.ID_DEPENDENCIA === Number(event.valor)
        );
        if (
          SELECTED_DEPARTAMENTO[0]?.ACRONIMO !== null &&
          SELECTED_DEPARTAMENTO[0]?.ACRONIMO !== undefined &&
          SELECTED_DEPARTAMENTO[0]?.ACRONIMO !== ''
        ) {
          // Asigna el acrónimo al objeto seleccionado
          this.selectedDepartamentoObj.nombreDelDepartamento = SELECTED_DEPARTAMENTO[0].ACRONIMO;

          // Agrupa los departamentos por acrónimo
          const AGRUPADOS: { [key: string]: Departamento[] } = {};
          this.departamentoDatos.forEach((item: Departamento) => {
        const KEY = item.ACRONIMO || 'Sin acrónimo';
        if (!AGRUPADOS[KEY]) {
          AGRUPADOS[KEY] = [];
        }
        AGRUPADOS[KEY].push(item);
          });

          // Ordena los departamentos dentro de cada grupo por nombre
          Object.keys(AGRUPADOS).forEach((key) => {
        AGRUPADOS[key] = AGRUPADOS[key].sort((a, b) =>
          (a.NOMBRE || '').localeCompare(b.NOMBRE || '')
        );
          });

          // Si necesitas usar los agrupados, puedes asignarlos a una propiedad
          // this.departamentoAgrupados = AGRUPADOS;

          // Obtiene los procedimientos relacionados con el acrónimo seleccionado
          this.getProcedimiento(SELECTED_DEPARTAMENTO[0].ACRONIMO);
        }
      } else if (event.campo === 'procedimiento') {
        this.selectedDepartamentoObj.tieneDepartamento = false;
        // Filtra el procedimiento seleccionado
        const SELECTED_PROCEDURE = this.procedureNumero.filter(
          (item) => item.id === Number(event.valor)
        );
        this.selectedDepartamentoObj.numeroDeProcedimiento = String(SELECTED_PROCEDURE[0]?.tramite || '');
      } else {
        this.selectedDepartamentoObj.tieneDepartamento = false;
      }

    }

    /**
     * Filtra la lista de procedimientos (`tramiteDetailsData`) por el departamento especificado,
     * actualiza la propiedad `procedureNumero` con los resultados filtrados y establece las
     * opciones disponibles para el campo 'procedimiento' en el formulario dinámico (`bandejaDeTareasForma`).
     *
     * @param departamento - El nombre del departamento por el cual filtrar los procedimientos.
     */
    public getProcedimiento(departamento: string): void {
        this.procedureNumero = [];
        // Filtra y elimina registros repetidos por 'tramite'
        const PROCEDIMIENTOS_FILTRADOS = tramiteDetailsData
          .filter((v) => v.department === departamento.toLocaleLowerCase())
          .filter(
            (item, index, self) =>
              self.findIndex((t) => t.tramite === item.tramite) === index
          );
        this.procedureNumero = PROCEDIMIENTOS_FILTRADOS;
        const FILTERED_FIELD = this.bandejaDeTareasForma.find(
          (datos: ModeloDeFormaDinamica) => datos.id === 'procedimiento'
        ) as ModeloDeFormaDinamica;
        if (FILTERED_FIELD) {
          FILTERED_FIELD.opciones = this.procedureNumero.map(
            (item: { id: number; tramite: number }) => ({
              descripcion: item.tramite,
              id: item.id,
            })
          );
        }
    }

    /**
     * Obtiene los tipos de solicitudes desde el servicio y actualiza las opciones del campo
     * 'tipoSolicitud' en el formulario dinámico de la bandeja de tareas.
     *
     * Este método realiza una petición al servicio `bandejaSvc.getSolicitudesTablaDatos()`, 
     * procesa la respuesta y asigna las opciones correspondientes al campo identificado 
     * como 'tipoSolicitud' dentro del arreglo `bandejaDeTareasForma`, siempre y cuando 
     * dicho campo exista y aún no tenga opciones definidas.
     */
    public obtieneTipoSolicitudes(): void {
      this.bandejaSvc.getSolicitudesTablaDatos()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const API_RESPONSE = JSON.parse(JSON.stringify(response));
          const DATOS = API_RESPONSE.data;
          const CLASIFICACION_FIELD = this.bandejaDeTareasForma.find(
            (datos: ModeloDeFormaDinamica) => datos.id === 'tipoSolicitud'
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
     * Recupera las tareas pendientes para el usuario actual construyendo un cuerpo de solicitud
     * con el RFC del usuario, roles e información del certificado, y luego lo envía al
     * servicio backend. La respuesta se procesa como un arreglo de `BandejaDeTareasPendientes`.
     *
     * El observable se da de baja automáticamente cuando el componente se destruye.
     *
     * @remarks
     * - Utiliza el método de servicio `bandejaSvc.postBandejaTareas` para obtener los datos.
     * - El cuerpo de la solicitud incluye detalles de certificado y el rol "PersonaMoral" codificados.
     * - El método no retorna un valor; desencadena efectos secundarios mediante la suscripción.
     */
    public obtieneTareas(): void {
      const RFC = this.rfcValor;
      const REQUEST_BODY = {
        rfc_usuario: "",
        roles: [""],
        certificado: {
          cert_serial_number: "",
          tipo_certificado: ""
        }
      };

      REQUEST_BODY.rfc_usuario = RFC;
      REQUEST_BODY.roles = ["PersonaMoral"];
      REQUEST_BODY.certificado = {
        cert_serial_number: "20001000000100001815",
        tipo_certificado: "TIPCE.02"
      };

      this.bandejaSvc.postBandejaTareas(REQUEST_BODY).pipe(
        takeUntil(this.destroyNotifier$),
        map((datos) => {
          if(esValidArray(datos)){
            const API_RESPONSE = JSON.parse(JSON.stringify(datos));
            // Establece la información de la tarea en el store
            this._tareaStore.establecerTarea(
              API_RESPONSE[0].rfc,
              API_RESPONSE[0].currentUser,
              API_RESPONSE[0].folioTramite,
              API_RESPONSE[0].idSolicitud,
              API_RESPONSE[0].idTarea,
              API_RESPONSE[0].roleTarea,
              API_RESPONSE[0].tareasUsuario
            );
          }
          
        })
      ).subscribe();
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
