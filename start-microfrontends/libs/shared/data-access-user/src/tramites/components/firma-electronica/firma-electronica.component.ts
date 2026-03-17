import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FileType, OperationType } from '../../../core/enums/firma-electronica.enum';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FirmaElectronicaService } from '../../../core/services/shared/firma-electronica/firma-electronica.service';
import { InputFilaComponent } from '../input-fila/input-fila.component';
import { LOGIN } from '../../constantes/constantes';
import { LoginDetalle } from '../../../core/models/usuario/perfilUsuario.model';
import { ToastrService } from 'ngx-toastr';
import { ValidacionesFormularioService } from '../../../core/services/shared/validaciones-formulario/validaciones-formulario.service';
import { esValidObject } from '../../../core/utils/utilerias';

@Component({
  selector: 'firma-electronica',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputFilaComponent],
  providers: [ToastrService],
  templateUrl: './firma-electronica.component.html',
  styleUrl: './firma-electronica.component.scss',
})
export class FirmaElectronicaComponent implements OnDestroy {

  /**
   * Un subject utilizado para notificar y completar todas las suscripciones cuando el componente es destruido.
   * Esto ayuda a prevenir fugas de memoria al garantizar que cualquier suscripción activa vinculada a este notifier
   * se desuscriba cuando finalice el ciclo de vida del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
  * Tipo de firma que se va a utilizar en el componente.
  * Este valor es obligatorio y se utiliza para definir el comportamiento o formato
  */
  @Input({ required: true }) tipo: string = '';

  /**
   * Cadena original que será firmada por el componente.
   * Esta cadena puede contener datos en texto plano o en formato específico que se firmarán electrónicamente.
   */
  @Input() cadenaOriginal?: string;

  /**
   * Evento que emite un valor booleano indicando si el formulario o el proceso de firma es válido.
   * 
   * true  -> La firma es válida y completa.  
   * false -> Hay errores o el proceso de firma no es válido.
   */
  @Output() valido = new EventEmitter<LoginDetalle>();

  /**
   * Evento que emite el valor de la firma electrónica generada (en formato base64).
   * Este valor puede ser enviado al backend o utilizado en otros componentes.
   */
  @Output() firma = new EventEmitter<string>();

  /**
   * Evento que emite un objeto con los datos completos de la firma electrónica:
   * - firma: Cadena de la firma generada (en base64).
   * - certSerialNumber: Número de serie del certificado digital.
   * - rfc: RFC extraído del certificado.
   * - fechaFin: Fecha de vencimiento del certificado.
   */
  @Output() datosFirma = new EventEmitter<{
    firma: string;
    certSerialNumber: string;
    rfc: string;
    fechaFin: string;
  }>();

  /**
   * Archivo de certificado (.cer) cargado por el usuario.
   * Este archivo contiene el certificado digital público que se usará para la firma.
   */
  certFileObj?: File;

  /**
   * Archivo de llave privada (.key) cargado por el usuario.
   * Este archivo contiene la clave privada asociada al certificado, necesaria para generar la firma.
   */
  keyFileObj?: File;

  /**
   * Bandera que indica si el componente se encuentra en un estado de carga o procesamiento.
   * Se puede usar para mostrar un spinner o deshabilitar botones mientras se realiza la firma.
   */
  isLoading = false;

  /**
   * Referencia al elemento del DOM del input de tipo archivo para el certificado (.cer).
   * Se puede usar para acceder directamente al control desde el código (por ejemplo, para limpiar o validar).
   */
  cerInputElement?: HTMLInputElement;

  /**
   * Referencia al elemento del DOM del input de tipo archivo para la llave privada (.key).
   * Permite manipular el input directamente, como reiniciarlo o validar su estado.
   */
  keyInputElement?: HTMLInputElement;

  /**
   * Array de cadenas originales de documentos que requieren firma.
   */
  @Input() cadenasOriginalesDocumentos?: string[];

  /**
   * Evento que emite un array de firmas generadas para los documentos proporcionados.
   */
  @Output() documentosFirmados = new EventEmitter<string[]>();

  /**
   * Referencia al elemento del DOM del input para la contraseña de la llave privada.
   * La contraseña es requerida para desbloquear la llave y poder firmar.
   */
  passwordInputElement?: HTMLInputElement;

  certFileError: string = '';

  keyFileError: string = '';

  /** Formulario reactivo */
  FormCertificado = this.fb.group({
    cerFileName: ['', [Validators.required]],
    keyFileName: ['', [Validators.required]],
    cer: new FormControl<File | null>(null),
    key: new FormControl<File | null>(null),
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private formValidator: ValidacionesFormularioService,
    private firmaService: FirmaElectronicaService
  ) { }

  /**
   * Getter para saber si el componente esta siendo usado para hacer 'login'
   * @returns {boolean} Regresa un true si el componente se esta usando para autenticarse e iniciar sesión, de lo contrario retorna un false.
   */
  get login(): boolean {
    return this.tipo === LOGIN ? true : false;
  }

  /**
   * Metodo para saber si el campo del formulario es valido.
   * @param field El nombre del campo del formulario que se va a validar.
   * @returns {boolean | null} : Regresa un booleano si el campo es valido o no o puede regresar null si no se ha tocado el campo.
   */
  isValid(field: string): boolean | null {
    return this.formValidator.isValid(this.FormCertificado, field);
  }

  /**
   * Metodo para saber si el campo del formulario es invalido.
   * @param field El nombre del campo del formulario que se va a validar.
   * @returns {boolean | null} : Regresa un booleano si el campo es invalido o no o puede regresar null si no se ha tocado el campo.
   */
  handleFile(type: string, event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    if (INPUT.files?.length) {
      const FILE = INPUT.files[0];

      // Resetear errores previos
      this.certFileError = '';
      this.keyFileError = '';

      // Validar extensión y tipo MIME
      if (type === FileType.CERTIFICATE) {
        if (!FILE.name.endsWith('.cer') && !FILE.type.includes('application/x-x509-ca-cert')) {
          this.certFileError = 'Por favor, escriba un valor con una extensión aceptada (.cer)';
          INPUT.value = ''; // limpiar input
          return;
        }
        this.certFileObj = FILE;
        this.cerInputElement = INPUT;
        this.FormCertificado.get('cer')?.setValue(FILE);
        this.FormCertificado.get('cerFileName')?.setValue(FILE.name);
        this.FormCertificado.get('cerFileName')?.markAsUntouched();
      } else if (type === FileType.PRIVATE_KEY) {
        if (!FILE.name.endsWith('.key') && !FILE.type.includes('application/x-pem-file')) {
          this.keyFileError = 'Por favor, escriba un valor con una extensión aceptada (.key)';
          INPUT.value = ''; // limpiar input
          return;
        }
        this.keyFileObj = FILE;
        this.keyInputElement = INPUT;
        this.FormCertificado.get('key')?.setValue(FILE);
        this.FormCertificado.get('keyFileName')?.setValue(FILE.name);
        this.FormCertificado.get('keyFileName')?.markAsUntouched();
      }
    }
  }

  /**
   * Método para manejar el evento de cambio en el campo de contraseña.
   * @param event El evento del input de contraseña.
   */
  async onSubmit(): Promise<void> {
    this.passwordInputElement = document.getElementById('password') as HTMLInputElement;

    if (this.FormCertificado.invalid) {
      this.FormCertificado.markAllAsTouched();
      this.toastrService.error('Se produjo un error al firmar la cadena: Escriba la contraseña');
      return;
    }

    if (!this.cerInputElement || !this.keyInputElement || !this.passwordInputElement) {
      this.toastrService.error('Por favor complete todos los campos');
      return;
    }

    const PASSWORD_VALUE = this.passwordInputElement.value;

    this.isLoading = true;

    try {
      const ESLOGIN = this.tipo === OperationType.LOGIN;
      const ESCENARIO_DUMMY = !ESLOGIN && !this.cadenaOriginal;

      if (ESCENARIO_DUMMY) {
        this.firma.emit('firma-dummy-30901');
        this.isLoading = false;
        return;
      }

      if (this.cadenasOriginalesDocumentos && this.cadenasOriginalesDocumentos.length > 0) {
        const SELLOS: string[] = [];

        for (const CADENA of this.cadenasOriginalesDocumentos) {
          const RESULTADO_DOC = await this.firmaService.firmarCadena(
            this.cerInputElement,
            this.keyInputElement,
            PASSWORD_VALUE,
            CADENA,
            false
          );

          if (RESULTADO_DOC.firma) {
            SELLOS.push(RESULTADO_DOC.firma);
          } else {
            this.toastrService.error('No se generó firma para una cadena de documento.');
          }
        }
        this.documentosFirmados.emit(SELLOS);
      }

      // Luego procesar la firma principal
      const RESULTADO = await this.firmaService.firmarCadena(
        this.cerInputElement,
        this.keyInputElement,
        PASSWORD_VALUE, // Pasar el string directamente
        ESLOGIN ? undefined : this.cadenaOriginal,
        ESLOGIN
      );

      if (ESLOGIN) {
        // Crear el payload para la autenticación
        const PAYLOAD = {
          "rfc": RESULTADO.rfc,
          "certificate": RESULTADO.certificado,
          "privateKey": this.keyFileObj?.name.endsWith('.key') ? this.keyFileObj?.name : '',
          "password": this.FormCertificado.get('password')?.value || ''
        }

        // Caso login: solo validación
        this.valido.emit({ rfc: RESULTADO.rfc, tieneLogin: true });
        this.firmaService.loginFielAuthentication(PAYLOAD).pipe(takeUntil(this.destroyNotifier$)).subscribe({
          next: (response) => {
            if (esValidObject(response)) {
              this.toastrService.success('Autenticación exitosa');
            }
          },
          error: (error) => {
            this.toastrService.error('Error en la autenticación');
          }
        });
      } else {
        // Caso firma: emitir datos completos
        if (!RESULTADO.firma) {
          throw new Error('No se generó la firma electrónica');
        }
        
        this.valido.emit({ rfc: '', tieneLogin: true });
        this.datosFirma.emit({
          firma: RESULTADO.firma,
          certSerialNumber: RESULTADO.certificado,
          rfc: RESULTADO.rfc,
          fechaFin: RESULTADO.fechaFin,
        });
      }

    } catch (error) {
      console.error('Error al firmar:', error);
      this.valido.emit({ rfc: '', tieneLogin: false });

      let mensaje = 'Error al validar la firma';
      
      if (error instanceof Error) {
        if (error.message.includes('La contrasena no es valida')) {
          mensaje = 'Se produjo un error al firmar la cadena: La contraseña no es válida';
        } else {
          mensaje = `Se produjo un error al firmar la cadena: ${error.message}`;
        }
      }
      this.toastrService.error(mensaje);
    }
    finally {
      this.isLoading = false;
    }
  }


  /**
   * Gancho del ciclo de vida que se llama cuando el componente es destruido.
   * Este método emite un valor al subject `destroyNotifier$` y lo completa,
   * asegurando que cualquier suscripción vinculada a este notifier se limpie
   * adecuadamente para prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Cancela la selección de archivo para el campo especificado, limpiando su valor y marcándolo como tocado.
   * @param campo Nombre del campo del formulario a limpiar.
   */
  dialogoCancelar(campo: string): void {
    this.FormCertificado.get(campo)?.setValue(null);
    this.FormCertificado.get(campo)?.markAsTouched();
  }
}
