import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, Subject, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CapturarComponent } from './capturar.component';
import { CapturarService } from '../../services/capturar.service';
import { Tramite40301Store, Tramite40301State } from '../../estados/tramite40301.store';
import { Tramite40301Query } from '../../estados/tramite40301.query';
import { ConsultaioQuery, ConsultaioState, Catalogo } from '@ng-mf/data-access-user';
import { AGENT_CATALOG, META_INFO_40301 } from '../../enum/caat-naviero.enum';

describe('CapturarComponent', () => {
  let component: CapturarComponent;
  let fixture: ComponentFixture<CapturarComponent>;
  let mockCapturarService: jest.Mocked<CapturarService>;
  let mockTramite40301Store: jest.Mocked<Tramite40301Store>;
  let mockTramite40301Query: jest.Mocked<Tramite40301Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let formBuilder: FormBuilder;

  const mockTramiteState: Tramite40301State = {
    cveFolioCaat: 'TEST-FOLIO-001',
    rol: 'Admin',
    tipoAgente: 'Agente naviero',
    directorGeneralNombre: 'Juan Carlos',
    primerApellido: 'Pérez',
    segundoApellido: 'García'
  };

  const mockConsultaState: ConsultaioState = {
    readonly: false,
    update: true
  } as unknown as ConsultaioState;

  const mockCatalogData: Catalogo[] = [
    { id: 1, clave: 'TIAGN.AN', descripcion: 'Agente naviero' },
    { id: 2, clave: 'TIAGN.AIC', descripcion: 'Agente internacional de carga' }
  ];

  beforeEach(async () => {
    mockCapturarService = {
      getCatalogo: jest.fn().mockReturnValue(of(mockCatalogData)),
      getTramiteState: jest.fn().mockReturnValue(of(mockTramiteState))
    } as any;

    mockTramite40301Store = {
      setTipoAgente: jest.fn(),
      setDirectorGeneralNombre: jest.fn(),
      setPrimerApellido: jest.fn(),
      setSegundoApellido: jest.fn(),
      reset: jest.fn()
    } as any;

    mockTramite40301Query = {
      selectSolicitud$: of(mockTramiteState)
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of(mockConsultaState)
    } as any;

    await TestBed.configureTestingModule({
      declarations: [CapturarComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: CapturarService, useValue: mockCapturarService },
        { provide: Tramite40301Store, useValue: mockTramite40301Store },
        { provide: Tramite40301Query, useValue: mockTramite40301Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CapturarComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy();
    }
    fixture.destroy();
  });

  /**
   * Test component creation
   */
  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize component properties correctly', () => {
      expect(component.titulo).toBe(META_INFO_40301.titulo);
      expect(component.tipoAgenteLabel).toBe(META_INFO_40301.tipoAgenteLabel);
      expect(component.rolesUsuario).toEqual(META_INFO_40301.roles);
      expect(component.agentCatalog).toEqual(AGENT_CATALOG);
      expect(component.soloLectura).toBe(false);
    });

    it('should initialize destruirNotificador$ subject', () => {
      expect(component['destruirNotificador$']).toBeInstanceOf(Subject);
    });
  });

  /**
   * Test ngOnInit
   */
  describe('#ngOnInit', () => {
    it('should initialize component on ngOnInit', () => {
      const establecerSolicitudFormSpy = jest.spyOn(component, 'establecerSolicitudForm');
      const suscribirseAlEstadoSpy = jest.spyOn(component, 'suscribirseAlEstado');

      component.ngOnInit();

      expect(component.solicitudState).toEqual(mockTramiteState);
      expect(component.consultaDatos).toEqual(mockConsultaState);
      expect(component.soloLectura).toBe(mockConsultaState.readonly);
      expect(establecerSolicitudFormSpy).toHaveBeenCalled();
      expect(suscribirseAlEstadoSpy).toHaveBeenCalled();
    });

    it('should disable form when soloLectura is true', () => {
      const readonlyConsultaState = { ...mockConsultaState, readonly: true };
      mockConsultaioQuery.selectConsultaioState$ = of(readonlyConsultaState);

      component.ngOnInit();

      expect(component.soloLectura).toBe(true);
      expect(component.solicitudForm.disabled).toBe(true);
    });

    it('should not disable form when soloLectura is false', () => {
      component.ngOnInit();

      expect(component.soloLectura).toBe(false);
      expect(component.solicitudForm.enabled).toBe(true);
    });
  });

  /**
   * Test establecerSolicitudForm
   */
  describe('#establecerSolicitudForm', () => {
    beforeEach(() => {
      component.solicitudState = mockTramiteState;
      component.soloLectura = false;
    });

    it('should create form with correct structure and validations', () => {
      component.establecerSolicitudForm();

      expect(component.solicitudForm).toBeDefined();
      expect(component.solicitudForm.get('cveFolioCaat')).toBeTruthy();
      expect(component.solicitudForm.get('rol')).toBeTruthy();
      expect(component.solicitudForm.get('tipoAgente')).toBeTruthy();
      expect(component.solicitudForm.get('directorGeneralNombre')).toBeTruthy();
      expect(component.solicitudForm.get('primerApellido')).toBeTruthy();
      expect(component.solicitudForm.get('segundoApellido')).toBeTruthy();
    });

    it('should set initial values from solicitudState', () => {
      component.establecerSolicitudForm();

      expect(component.solicitudForm.get('cveFolioCaat')?.value).toBe(mockTramiteState.cveFolioCaat);
      expect(component.solicitudForm.get('rol')?.value).toBe(mockTramiteState.rol);
      expect(component.solicitudForm.get('tipoAgente')?.value).toBe(mockTramiteState.tipoAgente);
      expect(component.solicitudForm.get('directorGeneralNombre')?.value).toBe(mockTramiteState.directorGeneralNombre);
      expect(component.solicitudForm.get('primerApellido')?.value).toBe(mockTramiteState.primerApellido);
      expect(component.solicitudForm.get('segundoApellido')?.value).toBe(mockTramiteState.segundoApellido);
    });

    it('should apply correct validators', () => {
      component.establecerSolicitudForm();

      const tipoAgenteControl = component.solicitudForm.get('tipoAgente');
      const directorGeneralNombreControl = component.solicitudForm.get('directorGeneralNombre');
      const primerApellidoControl = component.solicitudForm.get('primerApellido');
      const segundoApellidoControl = component.solicitudForm.get('segundoApellido');

      tipoAgenteControl?.setValue('');
      expect(tipoAgenteControl?.invalid).toBe(true);
      expect(tipoAgenteControl?.hasError('required')).toBe(true);

      directorGeneralNombreControl?.setValue('');
      expect(directorGeneralNombreControl?.invalid).toBe(true);
      expect(directorGeneralNombreControl?.hasError('required')).toBe(true);

      primerApellidoControl?.setValue('');
      expect(primerApellidoControl?.invalid).toBe(true);
      expect(primerApellidoControl?.hasError('required')).toBe(true);

      const longString = 'a'.repeat(201);
      directorGeneralNombreControl?.setValue(longString);
      expect(directorGeneralNombreControl?.hasError('maxlength')).toBe(true);

      primerApellidoControl?.setValue(longString);
      expect(primerApellidoControl?.hasError('maxlength')).toBe(true);

      segundoApellidoControl?.setValue(longString);
      expect(segundoApellidoControl?.hasError('maxlength')).toBe(true);
    });

    it('should disable appropriate fields when soloLectura is true', () => {
      component.soloLectura = true;

      component.establecerSolicitudForm();

      expect(component.solicitudForm.get('cveFolioCaat')?.disabled).toBe(true);
      expect(component.solicitudForm.get('rol')?.disabled).toBe(true);
      expect(component.solicitudForm.get('tipoAgente')?.disabled).toBe(true);
      expect(component.solicitudForm.get('directorGeneralNombre')?.disabled).toBe(true);
      expect(component.solicitudForm.get('primerApellido')?.disabled).toBe(true);
      expect(component.solicitudForm.get('segundoApellido')?.disabled).toBe(true);
    });
  });

  /**
   * Test readMetaInfo
   */
  describe('#readMetaInfo', () => {
    it('should load catalog data successfully', () => {
      component.readMetaInfo();

      expect(mockCapturarService.getCatalogo).toHaveBeenCalled();
      expect(component.agentCatalog).toEqual(mockCatalogData);
    });

    it('should handle service errors gracefully', () => {
      mockCapturarService.getCatalogo.mockReturnValue(throwError('Service error'));

      expect(() => component.readMetaInfo()).not.toThrow();
    });
  });

  /**
   * Test suscribirseAlEstado
   */
  describe('#suscribirseAlEstado', () => {
    beforeEach(() => {
      component.establecerSolicitudForm();
    });

    it('should subscribe to tramite state and patch form values', () => {
      const patchValueSpy = jest.spyOn(component.solicitudForm, 'patchValue');

      component.suscribirseAlEstado();

      expect(mockCapturarService.getTramiteState).toHaveBeenCalled();
      expect(patchValueSpy).toHaveBeenCalledWith(mockTramiteState);
    });

    it('should handle service errors without throwing', () => {
      mockCapturarService.getTramiteState.mockReturnValue(throwError('Service error'));
      expect(() => component.suscribirseAlEstado()).not.toThrow();
    });
  });

  /**
   * Test isFormValid
   */
  describe('#isFormValid', () => {
    beforeEach(() => {
      component.establecerSolicitudForm();
    });

    it('should return true when form is valid', () => {
      component.solicitudForm.patchValue({
        tipoAgente: 'Agente naviero',
        directorGeneralNombre: 'Juan Carlos',
        primerApellido: 'Pérez',
        segundoApellido: 'García'
      });

      expect(component.isFormValid()).toBe(true);
    });

    it('should return false when form is invalid', () => {
      component.solicitudForm.patchValue({
        tipoAgente: '',
        directorGeneralNombre: '',
        primerApellido: '',
        segundoApellido: ''
      });

      expect(component.isFormValid()).toBe(false);
    });

    it('should handle undefined form gracefully', () => {
      component.solicitudForm = undefined as any;

      expect(component.isFormValid()).toBeFalsy();
    });
  });

  /**
   * Test limpiarAgente
   */
  describe('#limpiarAgente', () => {
    beforeEach(() => {
      component.establecerSolicitudForm();
    });

    it('should reset form and store', () => {
      const resetSpy = jest.spyOn(component.solicitudForm, 'reset');

      component.limpiarAgente();

      expect(resetSpy).toHaveBeenCalled();
      expect(mockTramite40301Store.reset).toHaveBeenCalled();
    });
  });

  /**
   * Test conTipoAgenteData
   */
  describe('#conTipoAgenteData', () => {
    beforeEach(() => {
      component.establecerSolicitudForm();
    });

    it('should update tipoAgente in store', () => {
      const agentValue = 'Agente naviero';
      component.solicitudForm.get('tipoAgente')?.setValue(agentValue);

      component.conTipoAgenteData('tipoAgente');

      expect(mockTramite40301Store.setTipoAgente).toHaveBeenCalledWith(agentValue);
    });

    it('should handle non-existent control gracefully', () => {
      expect(() => component.conTipoAgenteData('nonExistentControl')).not.toThrow();
    });
  });

  /**
   * Test actualizarDirectorGeneralNombre
   */
  describe('#actualizarDirectorGeneralNombre', () => {
    beforeEach(() => {
      component.establecerSolicitudForm();
    });

    it('should update directorGeneralNombre in store', () => {
      const nombreValue = 'Juan Carlos';
      component.solicitudForm.get('directorGeneralNombre')?.setValue(nombreValue);
      component.actualizarDirectorGeneralNombre('directorGeneralNombre');

      expect(mockTramite40301Store.setDirectorGeneralNombre).toHaveBeenCalledWith(nombreValue);
    });

    it('should handle non-existent control gracefully', () => {
      expect(() => component.actualizarDirectorGeneralNombre('nonExistentControl')).not.toThrow();
    });
  });

  /**
   * Test actualizarPrimerApellido
   */
  describe('#actualizarPrimerApellido', () => {
    beforeEach(() => {
      component.establecerSolicitudForm();
    });

    it('should update primerApellido in store', () => {
      const apellidoValue = 'Pérez';
      component.solicitudForm.get('primerApellido')?.setValue(apellidoValue);

      component.actualizarPrimerApellido('primerApellido');

      expect(mockTramite40301Store.setPrimerApellido).toHaveBeenCalledWith(apellidoValue);
    });

    it('should handle non-existent control gracefully', () => {
      expect(() => component.actualizarPrimerApellido('nonExistentControl')).not.toThrow();
    });
  });

  /**
   * Test actualizarApellidoMaterno
   */
  describe('#actualizarApellidoMaterno', () => {
    beforeEach(() => {
      component.establecerSolicitudForm();
    });

    it('should update segundoApellido in store', () => {
      const apellidoValue = 'García';
      component.solicitudForm.get('segundoApellido')?.setValue(apellidoValue);

      component.actualizarApellidoMaterno('segundoApellido');

      expect(mockTramite40301Store.setSegundoApellido).toHaveBeenCalledWith(apellidoValue);
    });

    it('should handle non-existent control gracefully', () => {
      expect(() => component.actualizarApellidoMaterno('nonExistentControl')).not.toThrow();
    });
  });

  /**
   * Test onSubmit
   */
  describe('#onSubmit', () => {
    beforeEach(() => {
      component.establecerSolicitudForm();
    });

    it('should process valid form submission', () => {
      component.solicitudForm.patchValue({
        tipoAgente: 'Agente naviero',
        directorGeneralNombre: 'Juan Carlos',
        primerApellido: 'Pérez',
        segundoApellido: 'García'
      });
      expect(() => component.onSubmit()).not.toThrow();
    });

    it('should not process invalid form submission', () => {
      component.solicitudForm.patchValue({
        tipoAgente: '',
        directorGeneralNombre: '',
        primerApellido: '',
        segundoApellido: ''
      });

      expect(() => component.onSubmit()).not.toThrow();
    });
  });

  /**
   * Test ngOnDestroy
   */
  describe('#ngOnDestroy', () => {
    it('should complete destruirNotificador$ subject', () => {
      const nextSpy = jest.spyOn(component['destruirNotificador$'], 'next');
      const completeSpy = jest.spyOn(component['destruirNotificador$'], 'complete');
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  /**
   * Integration tests
   */
  describe('Integration Tests', () => {
    it('should handle complete workflow from initialization to form submission', () => {
      component.ngOnInit();
      
      component.conTipoAgenteData('tipoAgente');
      component.actualizarDirectorGeneralNombre('directorGeneralNombre');
      component.actualizarPrimerApellido('primerApellido');
      component.actualizarApellidoMaterno('segundoApellido');
      
      component.onSubmit();

      expect(component.solicitudState).toEqual(mockTramiteState);
      expect(component.solicitudForm.valid).toBe(true);
      expect(mockTramite40301Store.setTipoAgente).toHaveBeenCalled();
      expect(mockTramite40301Store.setDirectorGeneralNombre).toHaveBeenCalled();
      expect(mockTramite40301Store.setPrimerApellido).toHaveBeenCalled();
      expect(mockTramite40301Store.setSegundoApellido).toHaveBeenCalled();
    });

    it('should handle readonly mode correctly', () => {
      const readonlyConsultaState = { ...mockConsultaState, readonly: true };
      mockConsultaioQuery.selectConsultaioState$ = of(readonlyConsultaState);

      component.ngOnInit();

      expect(component.soloLectura).toBe(true);
      expect(component.solicitudForm.disabled).toBe(true);
    });

    it('should handle service errors during initialization', () => {
      mockTramite40301Query.selectSolicitud$ = throwError('Query error');
      mockConsultaioQuery.selectConsultaioState$ = throwError('Consulta error');
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });
});
