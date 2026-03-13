import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AlertComponent, ConfiguracionColumna, TablaDinamicaComponent } from "@libs/shared/data-access-user/src";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Proveedores } from "../../core/models/informacion/agace-acna/proveedores/response/proveedores-response";
import { ProveedoresService } from "../../core/service/informacion/agace-acna/proveedores.Service";
import { Subject } from "rxjs";

@Component({
    standalone: true,
    templateUrl: './proveedores.component.html',
    styleUrl: './proveedores.component.scss',
    imports: [AlertComponent, ReactiveFormsModule, TablaDinamicaComponent],
})
export class ProveedoresComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public configuracionTabla: ConfiguracionColumna<Proveedores>[] = [
        {
            encabezado: 'RFC Proveedor',
            clave: (proveedor) => proveedor.rfc,
            orden: 0
        },
        {
            encabezado: 'Nombre completo, Denominación o Razón Social del Proveedor',
            clave: (proveedor) => proveedor.razon_social,
            orden: 1
        },
        {
            encabezado: 'RFC Industria Automotriz',
            clave: (proveedor) => proveedor.rfc_industria,
            orden: 2
        },
        {
            encabezado: 'Denominación o Razón Social Industria Automotriz',
            clave: (proveedor) => proveedor.razon_social_industria,
            orden: 3
        },
        {
            encabezado: 'Domicilio Fizcal Automotriz',
            clave: (proveedor) => proveedor.domicilio_fiscal,
            orden: 4
        },
        {
            encabezado: 'Norma',
            clave: (proveedor) => proveedor.norma,
            orden: 5
        },
        {
            encabezado: 'Número de programa INMEX',
            clave: (proveedor) => proveedor.programa_inmex,
            orden: 5
        },
        {
            encabezado: 'Número de programa PROSEC',
            clave: (proveedor) => proveedor.programa_prosec,
            orden: 6
        },
        {
            encabezado: 'Aduanas en las que opera',
            clave: (proveedor) => proveedor.aduanas,
            orden: 7
        },
        {
            encabezado: 'Fecha Inicio Relación',
            clave: (proveedor) => proveedor.fecha_inicio,
            orden: 8
        },
        {
            encabezado: 'Fecha Fin Relación',
            clave: (proveedor) => proveedor.fecha_fin,
            orden: 9
        }
    ]

    public datosProveedores: Proveedores[] = []

    /**
     * Formulario reactivo utilizado para la búsqueda de trámites.
     *
     * Contiene los campos necesarios para filtrar la información.
     */
    public FormBusquedaProveedores!: FormGroup;
    /**
     * Indica si la alerta debe mostrarse en la vista.
     *
     * Controla la visibilidad del componente o mensaje de alerta.
     *
     * @default false
     */
    public alertaVisible: boolean = false;

    /**
     * Mensaje que se mostrará dentro de la alerta.
     *
     * Contiene el texto informativo, de error o de advertencia
     * que se desea presentar al usuario.
     *
     * @default ""
     */
    public mensajeAlerta: string = "";

    /**
     * Clase CSS asociada a la alerta.
     *
     * Se utiliza para definir el estilo visual de la alerta
     * (por ejemplo: alert-info, alert-danger).
     *
     * @default ""
     */
    public claseAlerta: string = "alert-danger";

    constructor(
        private fb: FormBuilder,
        private proveedoresService: ProveedoresService
    ) { }

    /**
     * Inicializa el formulario de búsqueda de trámites.
     *
     * Define la estructura del formulario y sus controles,
     * estableciendo valores iniciales vacíos.
     */
    private inicializarForm(): void {
        this.FormBusquedaProveedores = this.fb.group({ rfc: ['', [Validators.required]] })
    }

    public obtenerDatosDelProveedor(): void {
        this.alertaVisible = false;
        if (this.FormBusquedaProveedores.invalid) {
            this.FormBusquedaProveedores.markAllAsTouched();
            this.alertaVisible = true;
            this.mensajeAlerta = ProveedoresComponent.generarAlertaDeError(['Debe proporcionar RFC.']);
            return;
        }
        this.proveedoresService.obtenerDatosProveedores().subscribe((res) => { this.datosProveedores = res.datos })
    }

    public limpiarInput(): void {
        this.FormBusquedaProveedores.setValue({
            rfc: ''
        });

    }

    exportarExcel(): void {
        const TABLA = document.getElementById('tablaProveedores');
        if (!TABLA) {
            console.warn('No se encontró la tabla');
            return;
        }

        const BOM = '\ufeff';

        const HTML = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns="http://www.w3.org/TR/REC-html40">
          <head>
            <meta charset="UTF-8">
            <style>
              table { 
                border-collapse: collapse; 
                width: 100%;
              }
              th {
                background-color: #4CAF50;
                color: white;
                font-weight: bold;
                text-align: left;
                padding: 8px;
                border: 1px solid #ddd;
              }
              td { 
                border: 1px solid #ddd; 
                padding: 8px;
                text-align: left;
              }
              tr:nth-child(even) {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            ${TABLA.outerHTML}
          </body>
        </html>
    `;

        const BLOB = new Blob([BOM + HTML], {
            type: 'application/vnd.ms-excel;charset=utf-8;'
        });

        const URL_ARCHIVO = URL.createObjectURL(BLOB);
        const A = document.createElement('a');

        A.href = URL_ARCHIVO;
        A.download = `consultaFuncionariosInformacionProveedor.xls`;

        document.body.appendChild(A);
        A.click();
        document.body.removeChild(A);

        setTimeout(() => URL.revokeObjectURL(URL_ARCHIVO), 100);
    }

    static generarAlertaDeError(mensajes: string[]): string {
        const LISTA_MENSAJES = mensajes
            .map(mensaje => `<li>${mensaje}</li>`)
            .join('');

        const ALERTA = `
            <div class="row">
                <div class="col-md-12 justify-content-center text-center">
                    <div class="row">
                        <div class="col-md-12">
                            <p>Corrija los siguientes errores:</p>
                            <ol>
                                ${LISTA_MENSAJES}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return ALERTA;
    }

    get rfc(): AbstractControl | null {
        return this.FormBusquedaProveedores.get('rfc')
    }

    ngOnInit(): void {
        this.inicializarForm()
    }

    ngOnDestroy(): void {
        this.destroy$.unsubscribe()
    }
}