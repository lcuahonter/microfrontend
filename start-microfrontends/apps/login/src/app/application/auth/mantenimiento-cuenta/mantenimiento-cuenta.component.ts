import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, distinctUntilChanged, takeUntil} from 'rxjs';
import { TipoIdentificacion, TipoPersona } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Notificacion} from '@libs/shared/data-access-user/src';
import { NotificacionesComponent } from "@libs/shared/data-access-user/src/tramites/components/notificaciones/notificaciones.component";
import { RecuperacionCuentaService } from '../../../estados/RecuperacionCuentaResponse';
import { RecuperacionStore } from '../../../estados/RecuperacionState.store';
import { Router } from '@angular/router';

/**
 * Componente para manejar la recuperación de contraseña
 * Maneja diferentes flujos según nacionalidad y tipo de persona
 */
@Component({
  selector: 'app-mantenimiento-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificacionesComponent],
  providers: [RecuperacionStore],
  templateUrl: './mantenimiento-cuenta.component.html',
  styleUrls: ['./mantenimiento-cuenta.component.scss']
})
export class MantenimientoCuentaComponent implements OnInit, OnDestroy {
  /** 
   * Expresiones regulares para las diferentes validaciones del formulario
   * @private
   */
  private readonly REGEX = {
      /** Regex para validar RFC de persona física mexicana */
      RFC_MEXICANOFISICA: /^([A-ZÑ&]{4}\d{6}[A-Z0-9]{3})$/,
      /** Regex para validar RFC de persona moral mexicana */
      RFC_MEXICANOMORAL: /^([A-ZÑ&]{3}\d{6}[A-Z0-9]{3})$/,
      /** Regex para validar RFC de extranjero */
      RFC_EXTRANJERO: /^([A-Z&]{4})(\d{6})([A-Z0-9]{3})$/,
      /** Regex para validar CURP */
      CURP: /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
      /** Regex para validar código postal mexicano */
      CP_MEXICANO: /^(0[1-9]|[1-4][0-9]|5[0-2])[0-9]{3}$/,
      /** Regex para validar código postal extranjero */
      CP_EXTRANJERO: /^[A-Za-z0-9- ]{3,10}$/
  };
  /** Formulario reactivo para la recuperación de cuenta */
  public formularioRecuperar!: FormGroup;
  /** Enum de TipoPersona para usar en el template */
  public readonly TIPO_PERSONA = TipoPersona;
  /** Enum de TipoIdentificacion para usar en el template */
  public readonly TIPO_IDENTIFICACION = TipoIdentificacion;
  
/** Notificación para mostrar alertas */
public nuevaAlertaNotificacion: Notificacion | null = null;
  
  /** Tab activa actual (nacional/extranjero) */
  public activeTab: 'nacional' | 'extranjero' = 'nacional';
  
  /** Subject para manejar la limpieza de suscripciones */
  private readonly destruir$ = new Subject<void>();

  /** Constructor del componente */
  constructor(
    /** FormBuilder para crear el formulario reactivo */
  private readonly fb: FormBuilder,
    /** Router para la navegación */
    private readonly router: Router,
    /** Store para el estado de recuperación */
    private readonly recuperacionStore: RecuperacionStore,
    /** Servicio para recuperación de cuenta */
    private readonly recuperacionService: RecuperacionCuentaService,
    /** Change detector para forzar detección de cambios */
    private readonly cdr: ChangeDetectorRef
  ) {}

  /** Inicialización del componente */
  public ngOnInit(): void {
    this.inicializarFormulario();
    this.suscribirCambiosFormulario();
  }

  /** Limpieza al destruir el componente */
  public ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
  }

  /**
   * Verifica si la nacionalidad es mexicana
   * @returns boolean - true si es mexicana, false si no
   */
  public esNacionalidadMexicana(): boolean {
    return this.formularioRecuperar.get('nacionalidad')?.value === true;
  }

  /**
   * Maneja el envío del formulario
   */
  public alEnviar(): void {    
    if (this.formularioRecuperar.valid && this.flujoValido()) {
      const FORM_DATA = this.formularioRecuperar.value;
      this.updateStore();
      
      this.recuperacionService.recuperarCuenta(FORM_DATA)
        .pipe(takeUntil(this.destruir$))
        .subscribe({
          next: (response) => {
            if(response.correo !== '' || response.usuario !== '') {
              this.nuevaAlertaNotificacion = {
                  tipoNotificacion: 'alert',
                  categoria: 'success',
                  modo: 'action',
                  titulo: 'Éxito',
                  mensaje: `Recuperación exitosa - Correo: ${response.correo}, Usuario: ${response.usuario}`,
                  cerrar: false,
                  tiempoDeEspera: 2000,
                  txtBtnAceptar: 'Aceptar',
                  txtBtnCancelar: ''
              };
              this.cdr.detectChanges();
            }else {
              this.nuevaAlertaNotificacion = {
                  tipoNotificacion: 'alert',
                  categoria: 'danger',
                  modo: 'action',
                  titulo: 'Éxito',
                  mensaje: `No se encontró información de recuperación para el usuario: ${response.usuario}. Por favor, verifique los datos ingresados.`,
                  cerrar: false,
                  tiempoDeEspera: 2000,
                  txtBtnAceptar: 'Aceptar',
                  txtBtnCancelar: ''
              };
              this.cdr.detectChanges();
            }            
          },
          error: (error) => {            
            this.nuevaAlertaNotificacion = {
                tipoNotificacion: 'alert',
                categoria: 'danger',
                modo: 'action',
                titulo: 'Error',
                mensaje: 'Error al recuperar la cuenta. Por favor intente nuevamente.' + error.message,
                cerrar: false,
                tiempoDeEspera: 2000,
                txtBtnAceptar: 'Aceptar',
                txtBtnCancelar: ''
            };
            this.cdr.detectChanges();
          }
        });
    } else {      
      this.nuevaAlertaNotificacion = {
                tipoNotificacion: 'alert',
                categoria: 'danger',
                modo: 'action',
                titulo: 'Error',
                mensaje: 'Por favor complete todos los campos requeridos.' ,
                cerrar: false,
                tiempoDeEspera: 2000,
                txtBtnAceptar: 'Aceptar',
                txtBtnCancelar: ''
            };
            this.cdr.detectChanges();
        this.formularioRecuperar.markAllAsTouched();
    }
  }

  /**
   * Navega a la página de login
   */
  public alSalir(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Inicializa el formulario con valores por defecto
   * @private
   */
  private inicializarFormulario(): void {
    this.formularioRecuperar = this.fb.group({
      nacionalidad: [null, Validators.required],
      tipoDocumento: [null],
      personaTipo: [''],
      usuario: [''],
      nombre: [''],
      primerApellido: [''],
      segundoApellido: [''],
      razonSocial: [''],
      codigoPostal: [''],
      estado: [''],
      pais: ['']
    });
  }

  /**
   * Suscribe a los cambios en los campos del formulario
   * @private
   */
  private suscribirCambiosFormulario(): void {
    // Suscripción a cambios en nacionalidad
    this.formularioRecuperar.get('nacionalidad')?.valueChanges
      .pipe(
        takeUntil(this.destruir$),
        distinctUntilChanged()
      )
      .subscribe(esNacional => {
        this.limpiarMensajeAlerta();
        this.activeTab = esNacional ? 'nacional' : 'extranjero';
        this.reiniciarCamposFormulario();
        
        if (!esNacional) {
          this.manejarValidacionesExtranjero();
        }
        this.updateStore();
      });

    // Suscripción a cambios en tipo de documento
    this.formularioRecuperar.get('tipoDocumento')?.valueChanges
      .pipe(
        takeUntil(this.destruir$),
        distinctUntilChanged()
      )
      .subscribe(tipoDoc => {
        this.limpiarMensajeAlerta();
        this.reiniciarCamposDependientes();
        
        if (this.esNacionalidadMexicana()) {
          this.actualizarValidacionesPorTipoDoc(tipoDoc);
          this.updateStore();
        }
      });

    // Suscripción a cambios en tipo de persona
    this.formularioRecuperar.get('personaTipo')?.valueChanges
      .pipe(
        takeUntil(this.destruir$),
        distinctUntilChanged()
      )
      .subscribe(tipo => {
        this.limpiarMensajeAlerta();
        this.reiniciarCamposTipoPersona(tipo);

        if (this.esNacionalidadMexicana() && this.formularioRecuperar.get('tipoDocumento')?.value === TipoIdentificacion.RFC) {
          this.actualizarValidacionesPorTipoDoc(TipoIdentificacion.RFC);
        } else if (!this.esNacionalidadMexicana()) {
          this.actualizarValidacionesExtranjero(tipo);
        }
        
        this.updateStore();
      });

     // Suscripción a campos de RFC Persona Moral
    const RFC_MORAL_FIELDS = ['usuario', 'razonSocial'];
    RFC_MORAL_FIELDS.forEach(field => {
        this.formularioRecuperar.get(field)?.valueChanges
            .pipe(
                takeUntil(this.destruir$),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if (this.esNacionalidadMexicana() && 
                    this.formularioRecuperar.get('tipoDocumento')?.value === this.TIPO_IDENTIFICACION.RFC && 
                    this.formularioRecuperar.get('personaTipo')?.value === TipoPersona.MORAL) {
                    this.esValidoRfcPersonaMoralNacional();
                    this.formularioRecuperar.updateValueAndValidity();
                    this.cdr.detectChanges();
                }
            });
    });
    
    //Suscripción a campos de RFC Persona Física
    const RFC_FISICA_FIELDS = ['usuario', 'nombre', 'primerApellido', 'segundoApellido'];
    RFC_FISICA_FIELDS.forEach(field => {
        this.formularioRecuperar.get(field)?.valueChanges
            .pipe(
                takeUntil(this.destruir$),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if (this.esNacionalidadMexicana() && 
                    this.formularioRecuperar.get('tipoDocumento')?.value === this.TIPO_IDENTIFICACION.RFC && 
                    this.formularioRecuperar.get('personaTipo')?.value === TipoPersona.FISICA) {                    
                    this.formularioRecuperar.updateValueAndValidity();
                    this.cdr.detectChanges();
                }
            });
    });
  }

  /**
   * Limpia el mensaje de alerta actual
   * @private
   */
  private limpiarMensajeAlerta(): void {
    this.nuevaAlertaNotificacion = null;    
  }

  /**
   * Resetea los campos del formulario a su estado inicial
   * @private
   */
  private reiniciarCamposFormulario(): void {
    const FIELDS_TO_RESET = [
      'tipoDocumento',
      'personaTipo',
      'usuario',
      'nombre',
      'primerApellido',
      'segundoApellido',
      'razonSocial',
      'codigoPostal',
      'estado',
      'pais'
    ];

    FIELDS_TO_RESET.forEach(field => {
      this.formularioRecuperar.get(field)?.reset();
      this.formularioRecuperar.get(field)?.clearValidators();
      this.formularioRecuperar.get(field)?.updateValueAndValidity({ emitEvent: false });
    });
  }

  /**
   * Resetea campos dependientes del tipo de persona
   * @param tipo - Tipo de persona (FISICA/MORAL/null)
   * @private
   */
  private reiniciarCamposTipoPersona(TIPO: TipoPersona.FISICA | TipoPersona.MORAL | null): void {    
    const VALIDADOR_REQUERIDO = [Validators.required];

    // 1. Deshabilitar y limpiar todos los campos primero
    ['nombre', 'primerApellido', 'segundoApellido', 'razonSocial'].forEach(CAMPO => {
        const CONTROL = this.formularioRecuperar.get(CAMPO);
        CONTROL?.disable();
        CONTROL?.setValue(null);
        CONTROL?.clearValidators();
        CONTROL?.updateValueAndValidity();
    });

    // 2. Habilitar y validar campos según tipo de persona
    if (TIPO === TipoPersona.FISICA) {
        ['nombre', 'primerApellido', 'segundoApellido'].forEach(CAMPO => {
            const CONTROL = this.formularioRecuperar.get(CAMPO);
            CONTROL?.enable();
            CONTROL?.setValidators(VALIDADOR_REQUERIDO);
            CONTROL?.updateValueAndValidity();
        });

        // Validar RFC según nacionalidad
        if (this.esNacionalidadMexicana()) {
            this.formularioRecuperar.get('usuario')?.setValidators([
                ...VALIDADOR_REQUERIDO,
                Validators.pattern(this.REGEX.RFC_MEXICANOFISICA)
            ]);
        } else {
            this.formularioRecuperar.get('usuario')?.setValidators([
                ...VALIDADOR_REQUERIDO,
                Validators.pattern(this.REGEX.RFC_EXTRANJERO)
            ]);
        }
    } else if (TIPO === TipoPersona.MORAL) {
        const CONTROL = this.formularioRecuperar.get('razonSocial');
        CONTROL?.enable();
        CONTROL?.setValidators(VALIDADOR_REQUERIDO);
        CONTROL?.updateValueAndValidity();

        // Validar RFC según nacionalidad
        if (this.esNacionalidadMexicana()) {
            this.formularioRecuperar.get('usuario')?.setValidators([
                ...VALIDADOR_REQUERIDO,
                Validators.pattern(this.REGEX.RFC_MEXICANOMORAL)
            ]);
        } else {
            this.formularioRecuperar.get('usuario')?.setValidators([
                ...VALIDADOR_REQUERIDO,
                Validators.pattern(this.REGEX.RFC_EXTRANJERO)
            ]);
        }
    }

    // 3. Actualizar usuario y formulario
    this.formularioRecuperar.get('usuario')?.updateValueAndValidity();
    this.formularioRecuperar.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  /**
   * Resetea los campos dependientes cuando cambia el tipo de documento
   * @private
   */
  private reiniciarCamposDependientes(): void {
    const FIELDS_TO_RESET = [
      'usuario',
      'nombre',
      'primerApellido',
      'segundoApellido',
      'razonSocial',
      'personaTipo'
    ];

    FIELDS_TO_RESET.forEach(field => {
      this.formularioRecuperar.get(field)?.reset();
      this.formularioRecuperar.get(field)?.clearValidators();
      this.formularioRecuperar.get(field)?.updateValueAndValidity({ emitEvent: false });
    });
  }

  /**
   * Maneja las validaciones específicas para usuarios extranjeros
   * @private
   */
  private manejarValidacionesExtranjero(): void {
    // Habilitar el campo de tipo de persona
    this.formularioRecuperar.get('personaTipo')?.enable();
    
    // Limpiar validaciones previas
    this.reiniciarCamposFormulario();
    
    const TIPO = this.formularioRecuperar.get('personaTipo')?.value;
    if (TIPO) {
      this.actualizarValidacionesExtranjero(TIPO);
    }
  }

  /**
   * Actualiza el estado del formulario y validaciones según tipo de documento
   * @param tipoDoc - Tipo de documento (RFC/CURP)
   * @private
   */
    private actualizarValidacionesPorTipoDoc(tipoDoc: TipoIdentificacion.RFC | TipoIdentificacion.CURP | null): void {
        if (!tipoDoc) {return;}

        const REQUIRED_VALIDATOR = [Validators.required, Validators.minLength(1)];
        const USUARIOCONTROL = this.formularioRecuperar.get('usuario');

        // 1. Primera validación: Nacionalidad
        if (this.esNacionalidadMexicana()) {
            // ES MEXICANO
            // 2. Validar tipo de identificación
            if (tipoDoc === this.TIPO_IDENTIFICACION.RFC) {
                // Es RFC - Habilitar selección de tipo de persona
                this.formularioRecuperar.get('personaTipo')?.enable();
                
                // 3. Validar tipo de persona
                const PERSONA = this.formularioRecuperar.get('personaTipo')?.value;
                if (PERSONA === TipoPersona.FISICA) {
                    // Validar RFC formato persona física
                    USUARIOCONTROL?.setValidators([
                        ...REQUIRED_VALIDATOR,
                        Validators.pattern(this.REGEX.RFC_MEXICANOFISICA)
                    ]);
                    
                    // Campos adicionales persona física
                    ['nombre', 'primerApellido', 'segundoApellido'].forEach(field => {
                        this.formularioRecuperar.get(field)?.setValidators(REQUIRED_VALIDATOR);
                        this.formularioRecuperar.get(field)?.updateValueAndValidity({ emitEvent: false });
                    });
                } else if (PERSONA === TipoPersona.MORAL) {
                    // Validar RFC formato persona moral
                    USUARIOCONTROL?.setValidators([
                        ...REQUIRED_VALIDATOR,
                        Validators.pattern(this.REGEX.RFC_MEXICANOMORAL)
                    ]);
                    
                    // Campos adicionales persona moral
                    this.formularioRecuperar.get('razonSocial')?.setValidators(REQUIRED_VALIDATOR);
                    this.formularioRecuperar.get('razonSocial')?.updateValueAndValidity({ emitEvent: false });
                }
            } else if (tipoDoc === this.TIPO_IDENTIFICACION.CURP) {
                // Es CURP - Deshabilitar tipo de persona
                this.formularioRecuperar.get('personaTipo')?.disable();
                this.formularioRecuperar.get('personaTipo')?.setValue(null, { emitEvent: false });
                
                // Validar formato CURP
                USUARIOCONTROL?.setValidators([
                    ...REQUIRED_VALIDATOR,
                    Validators.pattern(this.REGEX.CURP)
                ]);
                // Habilitar campos para CURP
                ['usuario', 'nombre', 'primerApellido', 'segundoApellido'].forEach(CAMPO => {
                    const CONTROL = this.formularioRecuperar.get(CAMPO);
                    CONTROL?.enable();
                    if (CAMPO === 'usuario') {
                        CONTROL?.setValidators([
                            ...REQUIRED_VALIDATOR,
                            Validators.pattern(this.REGEX.CURP)
                        ]);
                    } else {
                        CONTROL?.setValidators(REQUIRED_VALIDATOR);
                    }
                    CONTROL?.updateValueAndValidity();
                });
            }
        } else {
            // ES EXTRANJERO
            // 2. Validar tipo de persona
            const TIPO_PERSONA = this.formularioRecuperar.get('personaTipo')?.value;
            
            // Validar RFC formato extranjero
            USUARIOCONTROL?.setValidators([
                ...REQUIRED_VALIDATOR,
                Validators.pattern(this.REGEX.RFC_EXTRANJERO)
            ]);

            if (TIPO_PERSONA === TipoPersona.FISICA) {
                // Campos adicionales persona física extranjera
                ['nombre', 'primerApellido', 'codigoPostal', 'estado', 'pais'].forEach(field => {
                    this.formularioRecuperar.get(field)?.setValidators(REQUIRED_VALIDATOR);
                    this.formularioRecuperar.get(field)?.updateValueAndValidity({ emitEvent: false });
                });
            } else if (TIPO_PERSONA === TipoPersona.MORAL) {
                // Campos adicionales persona moral extranjera
                ['razonSocial', 'codigoPostal', 'estado', 'pais'].forEach(field => {
                    this.formularioRecuperar.get(field)?.setValidators(REQUIRED_VALIDATOR);
                    this.formularioRecuperar.get(field)?.updateValueAndValidity({ emitEvent: false });
                });
            }
        }

        // Actualizar validez del campo usuario
        USUARIOCONTROL?.updateValueAndValidity({ emitEvent: false });

        // Forzar actualización del formulario
        this.formularioRecuperar.updateValueAndValidity();
    }

  /**
   * Actualiza las validaciones según el tipo de persona para extranjeros
   * @param TIPO - Tipo de persona (FISICA/MORAL)
   * @private
   */
  private actualizarValidacionesExtranjero(TIPO: TipoPersona.FISICA | TipoPersona.MORAL): void {
    const REQUIRED_VALIDATOR = [Validators.required, Validators.minLength(1)];
    const CAMPOS_COMUNES = ['codigoPostal', 'estado', 'pais'];
    
    // Limpiar validaciones previas
    Object.keys(this.formularioRecuperar.controls).forEach(key => {
      this.formularioRecuperar.get(key)?.clearValidators();
      this.formularioRecuperar.get(key)?.updateValueAndValidity({ emitEvent: false });
    });

    // Establecer validaciones según tipo de persona
    if (TIPO === TipoPersona.FISICA) {
      ['nombre', 'primerApellido', ...CAMPOS_COMUNES].forEach(field => {
        this.formularioRecuperar.get(field)?.setValidators(REQUIRED_VALIDATOR);
        this.formularioRecuperar.get(field)?.updateValueAndValidity({ emitEvent: false });
      });
    } else {
      ['razonSocial', ...CAMPOS_COMUNES].forEach(field => {
        this.formularioRecuperar.get(field)?.setValidators(REQUIRED_VALIDATOR);
        this.formularioRecuperar.get(field)?.updateValueAndValidity({ emitEvent: false });
      });
    }

    // Forzar actualización del formulario
    this.formularioRecuperar.updateValueAndValidity();
  }

  /**
   * Actualiza el store con los datos del formulario
   * @private
   */
  private updateStore(): void {
    const FORM_DATA = this.formularioRecuperar.value;
    
    this.recuperacionStore.update(state => ({
      ...state,
      activeTab: this.activeTab,
      formData: FORM_DATA
    }));
  }

  /**
   * Valida si el flujo es válido según el tipo de persona y nacionalidad
   * @returns boolean - true si el flujo es válido, false si no
   * @public
   */
  public flujoValido(): boolean {
    const FORM_VALUE = this.formularioRecuperar.value;
    
    if (this.esNacionalidadMexicana()) {
      // Flujo RFC Física
      if (FORM_VALUE.tipoDocumento === 'RFC' && FORM_VALUE.personaTipo === TipoPersona.FISICA) {
        return this.esValidoRfcPersonaFisicaNacional();
      }
      
      // Flujo CURP
      if (FORM_VALUE.tipoDocumento === this.TIPO_IDENTIFICACION.CURP) {
        return this.esValidoCurpNacional();
      }

      // Flujo RFC Moral
      if (FORM_VALUE.tipoDocumento === this.TIPO_IDENTIFICACION.RFC && FORM_VALUE.personaTipo === TipoPersona.MORAL) {
        return this.esValidoRfcPersonaMoralNacional();
      }
    }

    // Flujo Extranjero
    return this.esValidoFlujoExtranjero();
  }

  /**
   * Valida el flujo específico para RFC persona física nacional
   * @returns boolean
   * @private
   */
  private esValidoRfcPersonaFisicaNacional(): boolean {
    const RFC = this.formularioRecuperar.get('usuario')?.value;
    const NOMBRE = this.formularioRecuperar.get('nombre')?.value;
    const PRIMER_APELLIDO = this.formularioRecuperar.get('primerApellido')?.value;
    const SEGUNDO_APELLIDO = this.formularioRecuperar.get('segundoApellido')?.value;

    // Verificar que los campos requeridos tengan valor
    const HAS_REQUIRED_FIELDS = Boolean(
        RFC?.trim() &&
        NOMBRE?.trim() &&
        PRIMER_APELLIDO?.trim() &&
        SEGUNDO_APELLIDO?.trim()
    );

    // Validar el formato del RFC según el tipo específico para física
    const IS_VALID_RFC = this.REGEX.RFC_MEXICANOFISICA.test(RFC?.toUpperCase());
    return HAS_REQUIRED_FIELDS && IS_VALID_RFC;
  }

  /**
   * Valida el flujo específico para RFC persona moral nacional
   * @returns boolean
   * @private
   */
  private esValidoRfcPersonaMoralNacional(): boolean {  
    const RFC = this.formularioRecuperar.get('usuario')?.value;
    const RAZONSOCIAL = this.formularioRecuperar.get('razonSocial')?.value;

    const HAS_REQUIRED_FIELDS = Boolean(
        RFC?.trim() && RAZONSOCIAL?.trim()
    );
    // Validar el formato del RFC
    const IS_VALID_RFC = this.REGEX.RFC_MEXICANOMORAL.test(RFC?.toUpperCase())
    return HAS_REQUIRED_FIELDS && IS_VALID_RFC;
  }

  /**
   * Valida el flujo CURP nacional
   * @returns boolean
   * @private
   */
  public esValidoCurpNacional(): boolean {
    const FORM_VALUE = this.formularioRecuperar.value;
    const HAS_REQUIRED_FIELDS = Boolean(
      FORM_VALUE.usuario?.trim() &&
      FORM_VALUE.nombre?.trim() &&
      FORM_VALUE.primerApellido?.trim() &&
      FORM_VALUE.segundoApellido?.trim()
    );
    // Validar el formato de la CURP
    const IS_VALID_CURP = this.REGEX.CURP.test(FORM_VALUE.usuario?.toUpperCase());

    return HAS_REQUIRED_FIELDS && IS_VALID_CURP;
  }

  /**
  * Valida el flujo extranjero según el tipo de persona
  * @returns boolean - true si el flujo es válido
  * @private
  */
  private esValidoFlujoExtranjero(): boolean {
    if (!this.formularioRecuperar.get('personaTipo')?.value) {
      return false;
    }
    
    return this.formularioRecuperar.get('personaTipo')?.value === TipoPersona.FISICA
      ? this.esValidaPersonaFisicaExtranjera()
      : this.esValidaPersonaMoralExtranjera();
  }

  /**
   * Valida el flujo para persona física extranjera
   * @returns boolean
   * @private
   */
  private esValidaPersonaFisicaExtranjera(): boolean {
    const FORM_VALUE = this.formularioRecuperar.value;
    return Boolean(
      FORM_VALUE.nombre?.trim() &&
      FORM_VALUE.primerApellido?.trim() &&
      FORM_VALUE.codigoPostal?.trim() &&
      FORM_VALUE.estado?.trim() &&
      FORM_VALUE.pais?.trim()
    );
  }

  /**
   * Valida el flujo para persona moral extranjera
   * @returns boolean
   * @private
   */
  public esValidaPersonaMoralExtranjera(): boolean {
    const VALORES = {
        RAZON_SOCIAL: this.formularioRecuperar.get('razonSocial')?.value,
        CODIGO_POSTAL: this.formularioRecuperar.get('codigoPostal')?.value,
        ESTADO: this.formularioRecuperar.get('estado')?.value,
        PAIS: this.formularioRecuperar.get('pais')?.value
    };

    // Validar que todos los campos requeridos tengan valor
    const TIENE_CAMPOS_REQUERIDOS = Object.values(VALORES).every(VALOR => 
        VALOR !== null && VALOR !== undefined && VALOR.toString().trim() !== ''
    );

    return TIENE_CAMPOS_REQUERIDOS;
  }
}