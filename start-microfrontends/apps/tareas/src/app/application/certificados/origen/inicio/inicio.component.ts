import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { 
  CategoriaMensaje, 
  ConfiguracionColumna, 
  ErrorMessagesComponent,
  ExpandirTablaComponent, 
  InputFecha, 
  InputFechaComponent, 
  Notificacion, 
  NotificacionesComponent, 
  ResolucionDocumento,
  ResolucionesTableComponent,
  TablaDinamicaComponent,
  TablePaginationComponent, 
  TipoNotificacionEnum, 
  TituloComponent 
} from '@ng-mf/data-access-user';
import { OrigenResponse } from '../service/model/response/origen.model';
import { OrigenService } from '../service/origen.service';
import moment from 'moment';

@Component({
  selector: 'app-origen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ExpandirTablaComponent,
    InputFechaComponent,
    NotificacionesComponent,
    TablaDinamicaComponent,
    TablePaginationComponent,
    TituloComponent,
    ErrorMessagesComponent,
    ResolucionesTableComponent
  ],
  templateUrl: './inicio.component.html'
})
export class OrigenComponent implements OnInit {
  form!: FormGroup;
  notificacionInput?: Notificacion;
  loading = false;
  
  // Tablas
  disponibles: OrigenResponse[] = [];
  seleccionados: OrigenResponse[] = [];
  selectedRowSeleccionados: OrigenResponse | null = null;
  errors: string[] = [];
  resoluciones: ResolucionDocumento[] = [];

  configFechaExpedicion: InputFecha = {
    labelNombre: 'Fecha de expedición',
    required: false,
    habilitado: false
  };

  configFechaVencimiento: InputFecha = {
    labelNombre: 'Fecha de vencimiento',
    required: false,
    habilitado: false
  };

  // Configuración de fechas para búsqueda específica
  configFechaInicial: InputFecha = {
    labelNombre: 'Fecha inicial',
    required: false,
    habilitado: true
  };

  configFechaFinal: InputFecha = {
    labelNombre: 'Fecha final',
    required: false,
    habilitado: true
  };

  // Catálogos
  estadosCertificado = [
    { clave: 'POR_IMPRIMIR', descripcion: 'Por imprimir' },
    { clave: 'IMPRESOS', descripcion: 'Impresos' },
    { clave: 'AMBOS', descripcion: 'Ambos' }
  ];

  tratadosAcuerdos = [
    { clave: 'TLC_MEX_UE', descripcion: 'Tratado de Libre Comercio México-Unión Europea' },
    { clave: 'TLC_MEX_AELEC', descripcion: 'Tratado de Libre Comercio México-Asociación Europea de Libre Comercio' },
    { clave: 'ACE_6', descripcion: 'Acuerdo de Complementación Económica No. 6 México-Argentina' },
    { clave: 'ACE_51', descripcion: 'Acuerdo de Complementación Económica No. 51 México-Cuba' },
    { clave: 'ACE_53', descripcion: 'Acuerdo de Complementación Económica No. 53 México-Brasil' },
    { clave: 'ACE_55', descripcion: 'Acuerdo de Complementación Económica No. 55 México-Argentina, Brasil, Paraguay (listas vacías), y Uruguay (MERCOSUR)' },
    { clave: 'APAR_4', descripcion: 'Acuerdo de Preferencia Arancelaria Regional No. 4 México-ALADI' },
    { clave: 'SGP', descripcion: 'Sistema Generalizado de Preferencias' },
    { clave: 'MEX_JAP', descripcion: 'Acuerdo México-Japón' },
    { clave: 'MEX_PER', descripcion: 'Acuerdo México-Perú' },
    { clave: 'TLC_MEX_URU', descripcion: 'Tratado de Libre Comercio México-Uruguay' },
    { clave: 'ART_MEX', descripcion: 'Artículos Mexicanos' },
    { clave: 'TLC_MEX_PAN', descripcion: 'TRATADO DE LIBRE COMERCIO MÉXICO-PANAMÁ' },
    { clave: 'ALIANZA_PACIFICO', descripcion: 'Acuerdo Alianza del Pacífico' }
  ];

  paisesBloques = [
    { clave: 'BIELORRUSIA', descripcion: 'BIELORRUSIA (REPUBLICA DE)' },
    { clave: 'JAPON', descripcion: 'JAPON' },
    { clave: 'NUEVA_ZELANDIA', descripcion: 'NUEVA ZELANDIA' },
    { clave: 'RUSIA', descripcion: 'RUSIA (FEDERACION RUSA)' }
  ];

  configuracionTabla: ConfiguracionColumna<OrigenResponse>[] = [
    { encabezado: 'Folio Trámite', clave: (item) => item.folioTramite, orden: 1 },
    { encabezado: 'Número certificado', clave: (item) => item.noCertificado, orden: 2 },
    { encabezado: 'Fecha expedición', clave: (item) => item.fechaExpedicion, orden: 3 },
    { encabezado: 'Fecha vencimiento', clave: (item) => item.fechaVencimiento, orden: 4 },
    { encabezado: 'País / bloque', clave: (item) => item.paisBloque, orden: 5 },
    { encabezado: 'Tratado / acuerdo', clave: (item) => item.tratadoAcuerdo, orden: 6 },
    { encabezado: 'Estado certificado', clave: (item) => item.estadoCertificado, orden: 7 },
    { encabezado: 'Idioma', clave: (item) => item.idiomaCertificado, orden: 8 }
  ];

  constructor(
    private fb: FormBuilder,
    private origenService: OrigenService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const FECHA_ACTUAL = moment().format('DD/MM/YYYY');

    this.form = this.fb.group({
      rfc: [null, [Validators.required, Validators.maxLength(20)]],
      noCertificado: [null, [Validators.maxLength(20)]],
      noAcuse: [null, [Validators.maxLength(30)]],
      criteriosEspecificos: [false],
      // Criterios específicos
      rfcEspecificos: [null],
      estadoCert: [null],
      tratado: [null],
      pais: [null],
      fechaIni: [FECHA_ACTUAL],
      fechaFin: [null],
      // Campos de resultado (deshabilitados)
      resNoCertificado: [{ value: null, disabled: true }],
      resFechaExpedicion: [{ value: null, disabled: true }],
      resFechaVencimiento: [{ value: null, disabled: true }],
      resPaisBloque: [{ value: null, disabled: true }],
      resTratadoAcuerdo: [{ value: null, disabled: true }],
      resIdiomaCertificado: [{ value: null, disabled: true }]
    });
  }

  onBuscarCertificado(): void {
    const VALUES = this.form.getRawValue(); // Usar getRawValue para incluir rfc si llegara a estar deshabilitado, aunque aquí rfc es requerido.
    const RFC = VALUES.rfc;
    const RFC_ESPECIFICOS = VALUES.rfcEspecificos;
    const CRITERIOS = VALUES.criteriosEspecificos;

    if (!CRITERIOS) {
        // Validación normal
        if (!RFC && !VALUES.noCertificado && !VALUES.noAcuse) {
          this.mostrarAlerta(
            'Los datos marcados con asterisco son obligatorios. Favor de capturarlos.',
            CategoriaMensaje.ALERTA
          );
          return;
        }
        if (RFC && !VALUES.noCertificado && !VALUES.noAcuse) {
          this.mostrarAlerta(
            'Debe capturar número de certificado o número de acuse.',
            CategoriaMensaje.ALERTA
          );
          return;
        }
    } else {
        // Validación para criterios específicos
        // Si no hay ningún dato lleno
        const HAS_ADVANCED = VALUES.rfcEspecificos || VALUES.noCertificado || VALUES.noAcuse || VALUES.estadoCert || VALUES.tratado || VALUES.pais || VALUES.fechaIni || VALUES.fechaFin;
        if (!HAS_ADVANCED) {
            this.mostrarAlerta(
                'Los datos marcados con asterisco son obligatorios. Favor de capturarlos.',
                CategoriaMensaje.ALERTA
            );
            return;
        }

        // Validar rango de fechas
        if (VALUES.fechaIni && VALUES.fechaFin) {
            const FECHA_INI_ARRAY = VALUES.fechaIni.split('/');
            const FECHA_FIN_ARRAY = VALUES.fechaFin.split('/');
            const DATE_INI = new Date(Number(FECHA_INI_ARRAY[2]), Number(FECHA_INI_ARRAY[1]) - 1, Number(FECHA_INI_ARRAY[0]));
            const DATE_FIN = new Date(Number(FECHA_FIN_ARRAY[2]), Number(FECHA_FIN_ARRAY[1]) - 1, Number(FECHA_FIN_ARRAY[0]));

            if (DATE_INI > DATE_FIN) {
                this.mostrarAlerta(
                    'La fecha inicial no puede ser mayor que la fecha final',
                    CategoriaMensaje.ALERTA
                );
                return;
            }
        }
    }

    this.loading = true;
    this.origenService.search({
        rfc: RFC_ESPECIFICOS ? RFC_ESPECIFICOS : RFC,
        noCertificado: VALUES.noCertificado,
        noAcuse: VALUES.noAcuse,
        estadoCertificado: VALUES.estadoCert,
        tratadoAcuerdo: VALUES.tratado,
        paisBloque: VALUES.pais,
        fechaInicial: VALUES.fechaIni,
        fechaFinal: VALUES.fechaFin
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res && res.length > 0) {
          this.disponibles = res;
          // Si solo hay uno, podríamos llenar el detalle de arriba pero según requerimiento se muestran tablas
          if (res.length === 1 && !CRITERIOS) {
              this.llenarDatosCertificado(res[0]);
          }
        } else {
          this.limpiarResultadosLocales();
          this.mostrarAlerta(
              'No se encontraron certificados de origen con los parametros solicitados',
              CategoriaMensaje.ALERTA
          );
        }
      },
      error: () => {
        this.loading = false;
        this.mostrarAlerta('Ocurrió un error al realizar la búsqueda.', CategoriaMensaje.ERROR);
      }
    });
  }

  llenarDatosCertificado(data: OrigenResponse): void {
    this.form.patchValue({
      resNoCertificado: data.noCertificado,
      resFechaExpedicion: data.fechaExpedicion,
      resFechaVencimiento: data.fechaVencimiento,
      resPaisBloque: data.paisBloque,
      resTratadoAcuerdo: data.tratadoAcuerdo,
      resIdiomaCertificado: data.idiomaCertificado
    });
  }

  limpiarResultadosLocales(): void {
    this.disponibles = [];
    this.form.patchValue({
      resNoCertificado: null,
      resFechaExpedicion: null,
      resFechaVencimiento: null,
      resPaisBloque: null,
      resTratadoAcuerdo: null,
      resIdiomaCertificado: null
    });
  }

  onLimpiar(): void {
    const FECHA_ACTUAL = moment().format('DD/MM/YYYY');
    
    this.form.reset({
        criteriosEspecificos: false,
        fechaIni: FECHA_ACTUAL
    });
    this.limpiarResultadosLocales();
  }

  onLimpiarEspecificos(): void {
    const FECHA_ACTUAL = moment().format('DD/MM/YYYY');

    this.form.reset({
        rfcEspecificos: null,
        estadoCert: null,
        tratado: null,
        pais: null,
        fechaIni: FECHA_ACTUAL,
        fechaFin: null
    });
  }

  /**
   * Generar resolucion
   */
  onGenerar(): void {
    this.errors = [];
    
    // Si no hay certificado en el detalle (porque no se ha buscado/seleccionado)
    if (!this.form.get('resNoCertificado')?.value) {
      this.errors.push('Debe seleccionar (Al menos un certificado para generarse)');
      return;
    }

    this.loading = true;
    // Buscamos el objeto original o creamos uno con los datos del form para simular
    const ITEM_SIMULADO: OrigenResponse = {
        noCertificado: this.form.get('resNoCertificado')?.value,
        fechaExpedicion: this.form.get('resFechaExpedicion')?.value,
        fechaVencimiento: this.form.get('resFechaVencimiento')?.value,
        paisBloque: this.form.get('resPaisBloque')?.value,
        tratadoAcuerdo: this.form.get('resTratadoAcuerdo')?.value,
        estadoCertificado: '',
        idiomaCertificado: this.form.get('resIdiomaCertificado')?.value,
        folioTramite: ''
    };

    this.origenService.generar([ITEM_SIMULADO]).subscribe({
        next: (res) => {
            this.loading = false;
            this.resoluciones = res;
            this.mostrarAlerta('El certificado se envio a impresión', CategoriaMensaje.ALERTA);
        },
        error: () => {
            this.loading = false;
            this.mostrarAlerta('Ocurrió un error al generar el documento.', CategoriaMensaje.ERROR);
        }
    });
  }

  /**
   * Generar resolucion para seleccionados
   */
  onGenerarSeleccionados(): void {
    this.errors = [];
    
    if (this.seleccionados.length === 0) {
      this.errors.push('Debe seleccionar (Al menos un certificado para generarse)');
      return;
    }
    
    this.loading = true;
    this.origenService.generar(this.seleccionados).subscribe({
        next: (res) => {
            this.loading = false;
            this.resoluciones = res;
            this.mostrarAlerta('El certificado se envio a impresión', CategoriaMensaje.ALERTA);
        },
        error: () => {
            this.loading = false;
            this.mostrarAlerta('Ocurrió un error al generar los documentos.', CategoriaMensaje.ERROR);
        }
    });
  }

  /**
   * Descargar resolucion
   */
  onDescargarResolucion(_item: ResolucionDocumento): void {
    // Lógica para descargar (simulada)
  }

  onFilaDisponiblesClic(item: OrigenResponse): void {
    this.disponibles = this.disponibles.filter(x => x.noCertificado !== item.noCertificado);
    this.seleccionados = [...this.seleccionados, item];
  }

  onFilaSeleccionadosClic(item: OrigenResponse): void {
    this.selectedRowSeleccionados = item;
  }

  onEliminarSeleccionado(): void {
    if (!this.selectedRowSeleccionados) {
      return;
    }
    const ITEM = this.selectedRowSeleccionados;
    this.seleccionados = this.seleccionados.filter(x => x.noCertificado !== ITEM.noCertificado);
    this.disponibles = [...this.disponibles, ITEM];
    this.selectedRowSeleccionados = null;
  }

  mostrarAlerta(mensaje: string, categoria: CategoriaMensaje): void {
    this.notificacionInput = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: categoria,
      modo: 'action',
      titulo: categoria === CategoriaMensaje.ERROR ? 'Error' : 'Aviso',
      mensaje: mensaje,
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: ''
    };
  }

  onFechaIniChange(fecha: string): void {
    this.form.get('fechaIni')?.setValue(fecha);
  }

  onFechaFinChange(fecha: string): void {
    this.form.get('fechaFin')?.setValue(fecha);
  }

  onFechaExpedicionChange(fecha: string): void {
    this.form.get('resFechaExpedicion')?.setValue(fecha);
  }

  onFechaVencimientoChange(fecha: string): void {
    this.form.get('resFechaVencimiento')?.setValue(fecha);
  }
}