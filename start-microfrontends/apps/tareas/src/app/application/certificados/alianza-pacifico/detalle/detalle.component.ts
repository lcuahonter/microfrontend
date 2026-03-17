import { CategoriaMensaje, ConfiguracionColumna, InputFecha, InputFechaComponent, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TipoNotificacionEnum } from '@ng-mf/data-access-user';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { 
  AlianzaPacificoResponse, 
  ErrorAlianzaPacifico, 
  SeguimientoEnvioAlianzaPacifico 
} from '../service/model/alianza-pacifico.model';

@Component({
  selector: 'app-alianza-pacifico-detalle',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    NotificacionesComponent,
    InputFechaComponent
],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class AlianzaPacificoDetalleComponent implements OnInit {
  @Input() data!: AlianzaPacificoResponse;
  @Output() regresar = new EventEmitter<void>();

  form!: FormGroup;
  activeTab = 0;
  notificacionInput?: Notificacion;

  configFechaExpedicion: InputFecha = {
    habilitado: Boolean(!this.data?.fechaExpedicion),
    labelNombre: 'Fecha de expedición',
    required: true
  };

  tabs = [
    { titulo: 'Errores', show: true },
    { titulo: 'Seguimiento Envío', show: true }
  ];

  configuracionErrores: ConfiguracionColumna<ErrorAlianzaPacifico>[] = [
    { encabezado: 'Sección', clave: (item) => item.seccion, orden: 1 },
    { encabezado: 'Valor', clave: (item) => item.valor, orden: 2 },
    { encabezado: 'Descripción', clave: (item) => item.descripcion, orden: 3 }
  ];

  configuracionSeguimiento: ConfiguracionColumna<SeguimientoEnvioAlianzaPacifico>[] = [
    { encabezado: 'Fecha', clave: (item) => item.fecha, orden: 1 },
    { encabezado: 'Operación', clave: (item) => item.operacion, orden: 2 },
    { encabezado: 'Transacción', clave: (item) => item.transaccion, orden: 3 },
    { encabezado: 'Estatus', clave: (item) => item.estatus, orden: 4 },
    { encabezado: 'Observación', clave: (item) => item.observacion, orden: 5 }
  ];

  erroresData: ErrorAlianzaPacifico[] = [
    {
      seccion: '<CertificateDate>',
      valor: 'CertificateDate: 2018/06/14',
      descripcion: 'El certificado no es vigente, la fecha de expedición excede de un año'
    }
  ];

  seguimientoData: SeguimientoEnvioAlianzaPacifico[] = [
    {
      fecha: '2018-06-12 11:32:29',
      operacion: 'Recepcion',
      transaccion: 'Recibido',
      estatus: 'Certificado Enviado a VUCE',
      observacion: ''
    },
    {
      fecha: '2018-06-12 11:32:29',
      operacion: 'Envio',
      transaccion: 'Recibido',
      estatus: 'Certificado Recibido por VUCE',
      observacion: ''
    }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      noCertificado: [{ value: this.data?.noCertificado, disabled: true }],
      paisProcedencia: [{ value: this.data?.paisProcedencia, disabled: true }],
      fechaExpedicion: [{ value: this.data?.fechaExpedicion, disabled: true }],
      informar: [null],
      informacionAdicional: ['']
    });
  }

  onFechaExpedicionChange(fecha: string): void {
    this.form.get('fechaExpedicion')?.setValue(fecha);
  }

  seleccionaTab(index: number): void {
    this.activeTab = index;
  }

  onRegresar(): void {
    this.regresar.emit();
  }

  onGuardar(): void {
    this.validarCampos();
  }

  onEnviarRespuesta(): void {
    this.validarCampos();
  }

  private validarCampos(): void {
    const INFO_ADICIONAL = this.form.get('informacionAdicional')?.value;
    const INFORMAR = this.form.get('informar')?.value;

    if (!INFO_ADICIONAL || !INFORMAR) {
      this.mostrarAlerta(
        'Dictamen a informar',
        'Por favor seleccione una respuesta para el certificado'
      );
    }
  }

  mostrarAlerta(titulo: string, mensaje: string): void {
    this.notificacionInput = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'action',
      titulo: titulo,
      mensaje: mensaje,
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: ''
    };
  }
}
