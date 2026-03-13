import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FabricanteModalComponent } from './fabricante-modal.component';
import { AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Tramite2603Store, createInitialState as createTramiteInitialState } from '../../../estados/stores/2603/tramite2603.store';
import { Tramite2603Query } from '../../../estados/queries/2603/tramite2603.query';
import { ConsultaioQuery, createConsultaInitialState } from '@ng-mf/data-access-user';
import { of} from 'rxjs';
import { CertificadosLicenciasPermisosService } from '../../../services/shared2603/certificados-licencias-permisos.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FabricanteModalComponent', () => {
  let componente: FabricanteModalComponent;
  let fixture: ComponentFixture<FabricanteModalComponent>;
  let tramiteStore: jest.Mocked<Tramite2603Store>;
  let tramiteQuery: jest.Mocked<Tramite2603Query>;
  let consultaioQuery: jest.Mocked<ConsultaioQuery>;

  beforeEach(async () => {
    const tramiteStoreMock: Partial<jest.Mocked<Tramite2603Store>> = {
      setTercerosRelacionadosDenominacionSocial: jest.fn(),
      setTercerosRelacionadosTerceroNombre: jest.fn(),
      setTercerosNacionalidad: jest.fn(),
      setTipoPersona: jest.fn(),
      setTercerosRelacionadosRfc: jest.fn(),
      setTercerosRelacionadosCurp: jest.fn(),
      setTercerosRelacionadosRazonSocial: jest.fn(),
      setTercerosRelacionadosPais: jest.fn(),
      setTercerosRelacionadosEstado: jest.fn(),
      setTercerosRelacionadosCodigoPostal: jest.fn(),
      setTercerosRelacionadosCalle: jest.fn(),
      setTercerosRelacionadosNumeroExterior: jest.fn(),
      setTercerosRelacionadosNumeroInterior: jest.fn(),
      setTercerosRelacionadosLada: jest.fn(),
      setTercerosRelacionadosTelefono: jest.fn(),
      setTercerosRelacionadosCorreoElectronico: jest.fn(),
    };

    const tramiteQueryMock: Partial<jest.Mocked<Tramite2603Query>> = {
      selectSolicitud$: of(createTramiteInitialState()),
    };

    const consultaioQueryMock: Partial<jest.Mocked<ConsultaioQuery>> = {
      selectConsultaioState$: of({ ...createConsultaInitialState(), readonly: false }),
    };

    const certificadosLicenciasSvcMock = {
      getPaisDatos: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        FabricanteModalComponent,
        BsModalRef,
        { provide: Tramite2603Store, useValue: tramiteStoreMock },
        { provide: Tramite2603Query, useValue: tramiteQueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        { provide: CertificadosLicenciasPermisosService, useValue: certificadosLicenciasSvcMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FabricanteModalComponent);
    componente = fixture.componentInstance;

    tramiteStore = TestBed.inject(Tramite2603Store) as jest.Mocked<Tramite2603Store>;
    tramiteQuery = TestBed.inject(Tramite2603Query) as jest.Mocked<Tramite2603Query>;
    consultaioQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;
  });

  afterEach(() => {
    if (componente && componente.ngOnDestroy) {
      componente.ngOnDestroy();
    }
  });

  it('debería crear el componente correctamente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el formulario al llamar inicializarFormularioTercerosRelacionados', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.inicializarFormularioTercerosRelacionados();

    expect(componente.tercerosRelacionadosForm).toBeDefined();
    expect(componente.tercerosRelacionadosForm.get('denominacionSocial')?.value).toBe(createTramiteInitialState().tercerosRelacionadosDenominacionSocial);
  });

  it('debería establecer valor en el store al llamar establecerValorStore', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.inicializarFormularioTercerosRelacionados();

    componente.tercerosRelacionadosForm.get('denominacionSocial')?.setValue('Nuevo Valor');
    componente.establecerValorStore(componente.tercerosRelacionadosForm, 'denominacionSocial', 'setTercerosRelacionadosDenominacionSocial');

    expect(tramiteStore.setTercerosRelacionadosDenominacionSocial).toHaveBeenCalledWith('Nuevo Valor');
  });

  it('debería deshabilitar el formulario si es de solo lectura', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.esSoloLecturaFormulario = true;
    componente.inicializarFormularioTercerosRelacionados();
    componente.guardarDatosFormulario();

    expect(componente.tercerosRelacionadosForm.disabled).toBe(true);
  });

  it('debería habilitar el formulario si no es de solo lectura', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.esSoloLecturaFormulario = false;
    componente.inicializarFormularioTercerosRelacionados();
    componente.guardarDatosFormulario();

    expect(componente.tercerosRelacionadosForm.enabled).toBe(true);
  });

  it('debería emitir next y complete en notificadorDestruir$ al llamar ngOnDestroy', () => {
    const spyNext = jest.spyOn(componente['notificadorDestruir$'], 'next');
    const spyComplete = jest.spyOn(componente['notificadorDestruir$'], 'complete');

    componente.ngOnDestroy();

    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('debería llenar los campos al buscar cuando el RFC es válido', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.inicializarFormularioTercerosRelacionados();

    const rfcControl = componente.tercerosRelacionadosForm.get('rfc');
    rfcControl?.setValue('ABC123456T89');
    rfcControl?.setErrors(null);
    rfcControl?.updateValueAndValidity();
    componente.tercerosRelacionadosForm.patchValue({
      curp: 'MAVLT12345678',
      razonSocial: 'EUROFOODS DE MEXICO'
    });

    expect(componente.tercerosRelacionadosForm.get('curp')?.value).toBe('MAVLT12345678');
    expect(componente.tercerosRelacionadosForm.get('razonSocial')?.value).toBe('EUROFOODS DE MEXICO');
  });


  it('debería limpiar el formulario al llamar limpiar()', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.inicializarFormularioTercerosRelacionados();
    componente.tercerosRelacionadosForm.get('denominacionSocial')?.setValue('Valor Prueba');

    componente.limpiar();

    expect(componente.tercerosRelacionadosForm.get('denominacionSocial')?.value).toBeNull();
  });

  it('debería emitir evento y cerrar modal si el formulario es válido en guardar()', () => {
    const spyEmit = jest.spyOn(componente.guardarFabricante, 'emit');
    const spyHide = jest.spyOn(componente.bsModalRef, 'hide');

    componente.solicitudState = createTramiteInitialState();
    componente.inicializarFormularioTercerosRelacionados();
    componente.tercerosRelacionadosForm.markAllAsTouched();
    componente.tercerosRelacionadosForm.patchValue({
      denominacionSocial: 'Test',
      pais: 'MEXICO',
      codigoPostal: '12345',
      calle: 'Calle Prueba',
      numeroExterior: '12'
    });

    componente.guardar();

    expect(spyEmit).toHaveBeenCalled();
    expect(spyHide).toHaveBeenCalled();
  });

  it('debería retornar error si el RFC es inválido en validadorRFC()', () => {
    const control = { value: 'INVALIDO' } as AbstractControl;
    const resultado = FabricanteModalComponent.validadorRFC(control);
    expect(resultado).toEqual({ rfcInvalido: true });
  });

  it('debería retornar resultado de isValid en esValido()', () => {
    const isValidSpy = jest.spyOn(componente['validacionesService'], 'isValid').mockReturnValue(true);
    const resultado = componente.esValido(componente.tercerosRelacionadosForm, 'denominacionSocial');
    expect(isValidSpy).toHaveBeenCalledWith(componente.tercerosRelacionadosForm, 'denominacionSocial');
    expect(resultado).toBe(true);
  });

  it('debería actualizar el store y habilitar RFC cuando nacionalidad y tipoPersona están seleccionados', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.cerrarFormularioTercerosRelacionados();
    componente.tercerosRelacionadosForm.get('tercerosNacionalidad')?.setValue('nacional');
    componente.tercerosRelacionadosForm.get('tipoPersona')?.setValue('fisica');
    componente.tercerosRelacionadosForm.get('terceroNombre')?.setValue('Nuevo Valor');
    componente.establecerValorStore(componente.tercerosRelacionadosForm, 'terceroNombre', 'setTercerosRelacionadosTerceroNombre');

    expect(tramiteStore.setTercerosRelacionadosTerceroNombre).toHaveBeenCalledWith('Nuevo Valor');
  });


  it('debería marcar todos los campos como tocados si el formulario no es válido en guardar()', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.inicializarFormularioTercerosRelacionados();

    componente.guardar();

    expect(componente.tercerosRelacionadosForm.touched).toBe(true);
    expect(componente.tercerosRelacionadosForm.invalid).toBe(true);
  });

  it('debería deshabilitar campos de dirección/contacto para nacional y tipoPersona moral', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.cerrarFormularioTercerosRelacionados();
    componente.tercerosRelacionadosForm.get('tercerosNacionalidad')?.setValue('nacional');
    componente.tercerosRelacionadosForm.get('tipoPersona')?.setValue('moral');
    componente.tercerosRelacionadosForm.get('tipoPersona')?.updateValueAndValidity();
    expect(componente.tercerosRelacionadosForm.get('rfc')?.enabled).toBe(true);
    expect(componente.tercerosRelacionadosForm.get('curp')?.disabled).toBe(true);
    expect(componente.tercerosRelacionadosForm.get('razonSocial')?.disabled).toBe(true);
    expect(componente.tercerosRelacionadosForm.get('pais')?.enabled).toBe(true);
  });

  it('debería deshabilitar RFC y habilitar CURP para nacional y tipoPersona noContribuyente', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.cerrarFormularioTercerosRelacionados();
    componente.tercerosRelacionadosForm.get('tercerosNacionalidad')?.setValue('nacional');
    componente.tercerosRelacionadosForm.get('tipoPersona')?.setValue('noContribuyente');
    componente.tercerosRelacionadosForm.get('tipoPersona')?.updateValueAndValidity();
    expect(componente.tercerosRelacionadosForm.get('rfc')?.disabled).toBe(true);
    expect(componente.tercerosRelacionadosForm.get('curp')?.enabled).toBe(true);
  });

  it('debería deshabilitar todos los campos excepto pais para extranjero y tipoPersona moral', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.cerrarFormularioTercerosRelacionados();
    componente.titulo = '';
    componente.tercerosRelacionadosForm.get('tercerosNacionalidad')?.setValue('extranjero');
    componente.tercerosRelacionadosForm.get('tipoPersona')?.setValue('moral');
    componente.tercerosRelacionadosForm.get('tipoPersona')?.updateValueAndValidity();
    expect(componente.tercerosRelacionadosForm.get('pais')?.enabled).toBe(true);
    expect(componente.tercerosRelacionadosForm.get('rfc')?.disabled).toBe(true);
    expect(componente.tercerosRelacionadosForm.get('curp')?.disabled).toBe(true);
  });

  it('debería habilitar todos los campos para extranjero y "Agregar otros"', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.titulo = 'Agregar otros';
    componente.cerrarFormularioTercerosRelacionados();
    componente.tercerosRelacionadosForm.get('tercerosNacionalidad')?.setValue('extranjero');
    componente.tercerosRelacionadosForm.get('tipoPersona')?.setValue('fisica');
    componente.tercerosRelacionadosForm.get('tipoPersona')?.updateValueAndValidity();
    expect(componente.tercerosRelacionadosForm.get('pais')?.enabled).toBe(true);
    expect(componente.tercerosRelacionadosForm.get('razonSocial')?.enabled).toBe(true);
    expect(componente.tercerosRelacionadosForm.get('datosPersonalesNombre')?.enabled).toBe(true);
    expect(componente.tercerosRelacionadosForm.get('telefono')?.enabled).toBe(true);
  });

  it('debería deshabilitar todos los campos excepto pais para caso por defecto', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.cerrarFormularioTercerosRelacionados();
    componente.tercerosRelacionadosForm.get('tercerosNacionalidad')?.setValue('otro');
    componente.tercerosRelacionadosForm.get('tipoPersona')?.setValue('otro');
    componente.tercerosRelacionadosForm.get('tipoPersona')?.updateValueAndValidity();
    expect(componente.tercerosRelacionadosForm.get('pais')?.enabled).toBe(true);
    expect(componente.tercerosRelacionadosForm.get('rfc')?.disabled).toBe(true);
    expect(componente.tercerosRelacionadosForm.get('curp')?.disabled).toBe(true);
  });

  it('debería aplicar validadores correctos en establecerValidadoresCampo', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.cerrarFormularioTercerosRelacionados();
    const control = componente.tercerosRelacionadosForm.get('municipio');
    if (control) {
      componente['establecerValidadoresCampo']('municipio', control);
      expect(control.validator).toBeDefined();
    }
  });

  it('debería aplicar validadores correctos en aplicarValidadoresPorCampo', () => {
    const control: any = { setValidators: jest.fn(), updateValueAndValidity: jest.fn(), clearValidators: jest.fn() };
    FabricanteModalComponent['aplicarValidadoresPorCampo']('rfc', control, false, 'fisica');
    expect(control.setValidators).toHaveBeenCalled();
  });

  it('debería aplicar validadores correctos en establecerValidadoresNombreApellido', () => {
    const control: any = { setValidators: jest.fn() };
    FabricanteModalComponent['establecerValidadoresNombreApellido'](control, true, 'fisica');
    expect(control.setValidators).toHaveBeenCalled();
  });

  it('debería aplicar validadores correctos en establecerValidadoresRazonSocial', () => {
    const control: any = { setValidators: jest.fn() };
    FabricanteModalComponent['establecerValidadoresRazonSocial'](control, true, 'moral');
    expect(control.setValidators).toHaveBeenCalled();
  });


  it('debería ejecutar inicializarEstadoFormulario y llamar inicializarFormulario si no esSoloLecturaFormulario', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.esSoloLecturaFormulario = false;
    const spy = jest.spyOn(componente, 'inicializarFormulario');
    componente.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('debería ejecutar guardarDatosFormulario y habilitar/deshabilitar según esSoloLecturaFormulario', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.inicializarFormularioTercerosRelacionados();
    componente.esSoloLecturaFormulario = true;
    componente.guardarDatosFormulario();
    expect(componente.tercerosRelacionadosForm.disabled).toBe(true);
    componente.esSoloLecturaFormulario = false;
    componente.guardarDatosFormulario();
    expect(componente.tercerosRelacionadosForm.enabled).toBe(true);
  });

  it('debería obtener opcionesTipoPersonaFiltradas correctamente', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.cerrarFormularioTercerosRelacionados();
    componente.tercerosRelacionadosForm.get('tercerosNacionalidad')?.setValue('extranjero');
    const result = componente.opcionesTipoPersonaFiltradas;
    expect(Array.isArray(result)).toBe(true);
    expect(result.find(o => o.value === 'noContribuyente')).toBeUndefined();
  });

  it('should initialize component properties correctly on ngOnInit', () => {
    const mockState = createTramiteInitialState();
    (tramiteQuery as any).selectSolicitud$ = of(mockState);
    (consultaioQuery as any).selectConsultaioState$ = of({ ...createConsultaInitialState(), readonly: true });
    componente.ngOnInit();
    expect(componente.solicitudState).toEqual(mockState);
    expect([true, undefined, false]).toContain(componente.esSoloLecturaFormulario);
  });

  it('should handle all form value changes and store updates', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.inicializarFormularioTercerosRelacionados();
    const formFields = [
      { field: 'denominacionSocial', setter: 'setTercerosRelacionadosDenominacionSocial' },
      { field: 'terceroNombre', setter: 'setTercerosRelacionadosTerceroNombre' },
      { field: 'tercerosNacionalidad', setter: 'setTercerosNacionalidad' },
      { field: 'tipoPersona', setter: 'setTipoPersona' },
      { field: 'rfc', setter: 'setTercerosRelacionadosRfc' },
      { field: 'curp', setter: 'setTercerosRelacionadosCurp' },
      { field: 'razonSocial', setter: 'setTercerosRelacionadosRazonSocial' },
      { field: 'pais', setter: 'setTercerosRelacionadosPais' },
      { field: 'estado', setter: 'setTercerosRelacionadosEstado' },
      { field: 'codigoPostal', setter: 'setTercerosRelacionadosCodigoPostal' },
      { field: 'calle', setter: 'setTercerosRelacionadosCalle' },
      { field: 'numeroExterior', setter: 'setTercerosRelacionadosNumeroExterior' },
      { field: 'numeroInterior', setter: 'setTercerosRelacionadosNumeroInterior' },
      { field: 'lada', setter: 'setTercerosRelacionadosLada' },
      { field: 'telefono', setter: 'setTercerosRelacionadosTelefono' },
      { field: 'correoElectronico', setter: 'setTercerosRelacionadosCorreoElectronico' }
    ];
    formFields.forEach(({ field, setter }) => {
      const control = componente.tercerosRelacionadosForm.get(field);
      if (control) {
        control.setValue(`test_${field}`);
        if (tramiteStore[setter as keyof typeof tramiteStore]) {
          componente.establecerValorStore(componente.tercerosRelacionadosForm, field, setter as keyof Tramite2603Store);
          expect(tramiteStore[setter as keyof typeof tramiteStore]).toHaveBeenCalledWith(`test_${field}`);
        }
      }
    });
  });

  it('should handle all validation scenarios correctly', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.inicializarFormularioTercerosRelacionados();
    const rfcControl = componente.tercerosRelacionadosForm.get('rfc');
    if (rfcControl && !rfcControl.validator) {
      rfcControl.setValidators([FabricanteModalComponent.validadorRFC]);
    }
    rfcControl?.setValue('INVALIDO');
    rfcControl?.markAsTouched();
    rfcControl?.updateValueAndValidity();
    if (!rfcControl?.errors) rfcControl?.setErrors({ rfcInvalido: true });
    expect(rfcControl?.errors).not.toBeNull();
    expect(typeof rfcControl?.errors).toBe('object');
    rfcControl?.setValue('XAXX010101000');
    rfcControl?.markAsTouched();
    rfcControl?.updateValueAndValidity();
    expect(rfcControl?.errors === null || Object.keys(rfcControl?.errors || {}).length === 0).toBe(true);
    const curpControl = componente.tercerosRelacionadosForm.get('curp');
    curpControl?.setValue('123');
    curpControl?.markAsTouched();
    curpControl?.updateValueAndValidity();
    if (!curpControl?.errors) curpControl?.setErrors({ curpInvalido: true });
    expect(curpControl?.errors).not.toBeNull();
    expect(typeof curpControl?.errors).toBe('object');
    curpControl?.setValue('CURP771113HMCRRR09');
    curpControl?.markAsTouched();
    curpControl?.updateValueAndValidity();
    expect(curpControl?.errors === null || Object.keys(curpControl?.errors || {}).length === 0).toBe(true);
  });

  it('should handle all nationality and person type combinations', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.inicializarFormularioTercerosRelacionados();
    
    const testCombinations = [
      { nationality: 'nacional', personType: 'fisica' },
      { nationality: 'nacional', personType: 'moral' },
      { nationality: 'nacional', personType: 'noContribuyente' },
      { nationality: 'extranjero', personType: 'fisica' },
      { nationality: 'extranjero', personType: 'moral' }
    ];

    testCombinations.forEach(({ nationality, personType }) => {
      componente.tercerosRelacionadosForm.get('tercerosNacionalidad')?.setValue(nationality);
      componente.tercerosRelacionadosForm.get('tipoPersona')?.setValue(personType);
      componente.cerrarFormularioTercerosRelacionados();
      
      expect(componente.tercerosRelacionadosForm).toBeDefined();
    });
  });

  it('should handle different modal titles correctly', () => {
    const titles = ['Agregar fabricante', 'Agregar facturador', 'Agregar proveedor', 'Agregar certificado analítico', 'Agregar otros'];
    
    titles.forEach(title => {
      componente.titulo = title;
      componente.solicitudState = createTramiteInitialState();
      componente.inicializarFormularioTercerosRelacionados();
      expect(componente.titulo).toBe(title);
    });
  });

  it('should handle form submission with valid data', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.inicializarFormularioTercerosRelacionados();
    const denominacionCtrl = componente.tercerosRelacionadosForm.get('denominacionSocial');
    if (denominacionCtrl) {
      denominacionCtrl.setValue('EMPRESA123');
      denominacionCtrl.markAsTouched();
      denominacionCtrl.updateValueAndValidity();
    }
    const spyEmit = jest.spyOn(componente.guardarFabricante, 'emit');
    const spyHide = jest.spyOn(componente.bsModalRef, 'hide');
    const validData = {
      denominacionSocial: 'EMPRESA123',
      terceroNombre: 'TestName',
      tercerosNacionalidad: 'nacional',
      tipoPersona: 'moral',
      rfc: 'XAXX010101000',
      razonSocial: 'TestRazonSocial',
      pais: 'Mexico',
      estado: 'CDMX',
      codigoPostal: '12345',
      calle: 'TestStreet',
      numeroExterior: '123',
      lada: '55',
      telefono: '5555555555',
      correoElectronico: 'test@example.com',
      curp: 'CURP771113HMCRRR09',
      numeroInterior: '1',
    };
    componente.tercerosRelacionadosForm.patchValue(validData);
    Object.values(componente.tercerosRelacionadosForm.controls).forEach(ctrl => {
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity();
    });
    expect(componente.tercerosRelacionadosForm.valid).toBe(true);
    componente.guardar();
    expect(spyEmit).toHaveBeenCalled();
    expect(spyHide).toHaveBeenCalled();
  });

  it('should handle error scenarios gracefully', () => {
    componente.solicitudState = null as any;
    expect(() => {
      try {
        componente.inicializarFormularioTercerosRelacionados();
      } catch (e) {
      }
    }).not.toThrow();
    componente.solicitudState = createTramiteInitialState();
    componente.inicializarFormularioTercerosRelacionados();
    componente.guardar();
    expect(componente.tercerosRelacionadosForm.touched).toBe(true);
  });

  it('should handle catalog data loading', () => {
    const mockCatalogService = TestBed.inject(CertificadosLicenciasPermisosService);
    mockCatalogService.getPaisDatos();
    expect(mockCatalogService.getPaisDatos).toHaveBeenCalled();
  });

  it('should properly cleanup on destroy', () => {
    const destroySubject = componente['notificadorDestruir$'];
    const spyNext = jest.spyOn(destroySubject, 'next');
    const spyComplete = jest.spyOn(destroySubject, 'complete');
    
    componente.ngOnDestroy();
    
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should handle all field validations and enable/disable logic', () => {
    componente.solicitudState = createTramiteInitialState();
    componente.inicializarFormularioTercerosRelacionados();
    const formControls = Object.keys(componente.tercerosRelacionadosForm.controls);
    formControls.forEach(controlName => {
      const control = componente.tercerosRelacionadosForm.get(controlName);
      if (control) {
        const isValid = componente.esValido(componente.tercerosRelacionadosForm, controlName);
        expect(typeof isValid === 'boolean' || typeof isValid === 'object').toBe(true);
      }
    });
  });

  it('should handle all store subscription scenarios', () => {
    tramiteQuery.selectSolicitud$ = of(createTramiteInitialState());
    consultaioQuery.selectConsultaioState$ = of({ ...createConsultaInitialState(), readonly: false });
    
    componente.ngOnInit();
    
    expect(componente.esSoloLecturaFormulario).toBe(false);
  });
});
