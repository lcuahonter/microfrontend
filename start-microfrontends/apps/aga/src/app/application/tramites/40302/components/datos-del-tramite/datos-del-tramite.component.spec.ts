import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DatosDelTramiteComponent } from './datos-del-tramite.component';
import { DatosDelTramiteService } from '../../services/datos-del-tramite.service';
import { of, Subject } from 'rxjs';
import { Solicitud40302Store } from '../../estados/tramite40302.store';
import { Solicitud40302Query } from '../../estados/tramite40302.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

describe('DatosDelTramiteComponent', () => {
  let component: DatosDelTramiteComponent;
  let fixture: ComponentFixture<DatosDelTramiteComponent>;
  let mockDatosDelTramiteService: any;

  beforeEach(async () => {
    mockDatosDelTramiteService = {
      setInitialValues: jest.fn(),
      getSolicitudState: jest.fn().mockReturnValue(
        of({
          cveFolioCaat: '12345',
          descTipoCaat: 'Naviero',
          descTipoAgente: 'Agente Naviero',
          directorGeneralNombre: 'John',
          primerApellido: 'Doe',
          segundoApellido: 'Smith',
        })
      ),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DatosDelTramiteComponent,
        require('@angular/common/http/testing').HttpClientTestingModule
      ],
      declarations: [],
      providers: [
        {
          provide: DatosDelTramiteService,
          useValue: mockDatosDelTramiteService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario en establecerSolicitudForm', () => {
    component.establecerSolicitudForm();
    expect(component.solicitudForm).toBeDefined();
    expect(component.solicitudForm.get('cveFolioCaat')?.disabled).toBe(true);
    expect(
      component.solicitudForm.get('directorGeneralNombre')?.validator
    ).toBeTruthy();
  });

  it('debería llamar setInitialValues en ngOnInit', () => {
    const setInitialValuesSpy = jest.spyOn(
      mockDatosDelTramiteService,
      'setInitialValues'
    );
    component.ngOnInit();
    expect(setInitialValuesSpy).toHaveBeenCalled();
  });

  it('debería suscribirse al estado y actualizar el formulario en suscribirseAlEstado', () => {
    const patchValueSpy = jest.spyOn(component.solicitudForm, 'patchValue');
    component.suscribirseAlEstado();
    expect(patchValueSpy).toHaveBeenCalledWith({
      cveFolioCaat: '12345',
      descTipoCaat: 'Naviero',
      descTipoAgente: 'Agente Naviero',
      directorGeneralNombre: 'John',
      primerApellido: 'Doe',
      segundoApellido: 'Smith',
    });
  });

  it('debería llamar destroy$.next() y destroy$.complete() en ngOnDestroy', () => {
    const destroyNextSpy = jest.spyOn(component['destroy$'], 'next');
    const destroyCompleteSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroyNextSpy).toHaveBeenCalled();
    expect(destroyCompleteSpy).toHaveBeenCalled();
  });

  it('debería manejar un estado parcial en suscribirseAlEstado', () => {
    mockDatosDelTramiteService.getSolicitudState = jest
      .fn()
      .mockReturnValue(of({ directorGeneralNombre: 'Parcial' }));
    const patchValueSpy = jest.spyOn(component.solicitudForm, 'patchValue');
    component.suscribirseAlEstado();
    expect(patchValueSpy).toHaveBeenCalledWith({
      directorGeneralNombre: 'Parcial',
    });
  });

  it('debería validar los controles del formulario correctamente', () => {
    const directorGeneralNombreControl =
      component.solicitudForm.get('directorGeneralNombre');
    directorGeneralNombreControl?.setValue('');
    expect(directorGeneralNombreControl?.valid).toBeFalsy();

    directorGeneralNombreControl?.setValue('Nombre válido');
    expect(directorGeneralNombreControl?.valid).toBeTruthy();
  });

  it('debería manejar un estado vacío en suscribirseAlEstado', () => {
    mockDatosDelTramiteService.getSolicitudState = jest
      .fn()
      .mockReturnValue(of({}));
    const patchValueSpy = jest.spyOn(component.solicitudForm, 'patchValue');
    component.suscribirseAlEstado();
    expect(patchValueSpy).toHaveBeenCalledWith({});
  });
});
// Plan en pseudocódigo:
// 1. Simular dependencias: Solicitud40302Store, Solicitud40302Query, ConsultaioQuery.
// 2. Probar inicializarEstadoFormulario: cuando esFormularioSoloLectura es true y false.
// 3. Probar guardarDatosFormulario: verifica enable/disable del formulario según esFormularioSoloLectura.
// 4. Probar actualizarDirectorGeneralNombre, actualizarPrimerApellido, actualizarSegundoApellido: que llamen a los métodos del store con el valor correcto.
// 5. Probar que establecerSolicitudForm suscribe y asigna solicitudState.
// 6. Probar que ngOnInit llama a los métodos esperados y suscribe a selectConsultaioState$.
// 7. Probar que ngOnDestroy limpia las suscripciones.
// 8. Probar que los campos del formulario tienen los valores y validaciones correctas.
// 9. Probar que patchValue se llama correctamente en suscribirseAlEstado.
// 10. Probar que el formulario se inicializa correctamente en todos los caminos de inicializarEstadoFormulario y guardarDatosFormulario.

describe('DatosDelTramiteComponent (cobertura completa)', () => {
  let component: DatosDelTramiteComponent;
  let fixture: ComponentFixture<DatosDelTramiteComponent>;
  let mockDatosDelTramiteService: any;
  let mockSolicitud40302Store: any;
  let mockSolicitud40302Query: any;
  let mockConsultaioQuery: any;
  let consultaioStateSubject: Subject<any>;
  let solicitudStateSubject: Subject<any>;

  beforeEach(async () => {
    mockDatosDelTramiteService = {
      setInitialValues: jest.fn(),
      getSolicitudState: jest.fn().mockReturnValue(of({
        cveFolioCaat: '12345',
        descTipoCaat: 'Naviero',
        descTipoAgente: 'Agente Naviero',
        directorGeneralNombre: 'John',
        primerApellido: 'Doe',
        segundoApellido: 'Smith',
      })),
    };

    mockSolicitud40302Store = {
      setDirectorGeneralNombre: jest.fn(),
      setPrimerApellido: jest.fn(),
      setSegundoApellido: jest.fn(),
    };

    solicitudStateSubject = new Subject();
    mockSolicitud40302Query = {
      selectSolicitud$: solicitudStateSubject.asObservable(),
    };

    consultaioStateSubject = new Subject();
    mockConsultaioQuery = {
      selectConsultaioState$: consultaioStateSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DatosDelTramiteComponent,
        require('@angular/common/http/testing').HttpClientTestingModule
      ],
      providers: [
        { provide: DatosDelTramiteService, useValue: mockDatosDelTramiteService },
        { provide: Solicitud40302Store, useValue: mockSolicitud40302Store },
        { provide: Solicitud40302Query, useValue: mockSolicitud40302Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario en establecerSolicitudForm', () => {
    component.establecerSolicitudForm();
    expect(component.solicitudForm).toBeDefined();
    expect(component.solicitudForm.get('cveFolioCaat')?.disabled).toBe(true);
    expect(component.solicitudForm.get('directorGeneralNombre')?.validator).toBeTruthy();
  });

  it('debería llamar setInitialValues en ngOnInit', () => {
    const spy = jest.spyOn(mockDatosDelTramiteService, 'setInitialValues');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('debería suscribirse al estado y actualizar el formulario en suscribirseAlEstado', () => {
    const patchValueSpy = jest.spyOn(component.solicitudForm, 'patchValue');
    component.suscribirseAlEstado();
    expect(patchValueSpy).toHaveBeenCalledWith({
      cveFolioCaat: '12345',
      descTipoCaat: 'Naviero',
      descTipoAgente: 'Agente Naviero',
      directorGeneralNombre: 'John',
      primerApellido: 'Doe',
      segundoApellido: 'Smith',
    });
  });

  it('debería llamar destroy$.next() y destroy$.complete() en ngOnDestroy', () => {
    const destroyNextSpy = jest.spyOn(component['destroy$'], 'next');
    const destroyCompleteSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroyNextSpy).toHaveBeenCalled();
    expect(destroyCompleteSpy).toHaveBeenCalled();
  });

  it('debería manejar un estado parcial en suscribirseAlEstado', () => {
    mockDatosDelTramiteService.getSolicitudState = jest.fn().mockReturnValue(of({ directorGeneralNombre: 'Parcial' }));
    const patchValueSpy = jest.spyOn(component.solicitudForm, 'patchValue');
    component.suscribirseAlEstado();
    expect(patchValueSpy).toHaveBeenCalledWith({ directorGeneralNombre: 'Parcial' });
  });

  it('debería validar los controles del formulario correctamente', () => {
    const directorGeneralNombreControl = component.solicitudForm.get('directorGeneralNombre');
    directorGeneralNombreControl?.setValue('');
    expect(directorGeneralNombreControl?.valid).toBeFalsy();

    directorGeneralNombreControl?.setValue('Nombre válido');
    expect(directorGeneralNombreControl?.valid).toBeTruthy();
  });

  it('debería manejar un estado vacío en suscribirseAlEstado', () => {
    mockDatosDelTramiteService.getSolicitudState = jest.fn().mockReturnValue(of({}));
    const patchValueSpy = jest.spyOn(component.solicitudForm, 'patchValue');
    component.suscribirseAlEstado();
    expect(patchValueSpy).toHaveBeenCalledWith({});
  });

  it('debería actualizar el nombre del director general en el store', () => {
    const valor = 'Nuevo Nombre';
    component.solicitudForm.get('directorGeneralNombre')?.setValue(valor);
    component.actualizarDirectorGeneralNombre();
    expect(mockSolicitud40302Store.setDirectorGeneralNombre).toHaveBeenCalledWith(valor);
  });

  it('debería actualizar el primer apellido en el store', () => {
    const valor = 'Apellido1';
    component.solicitudForm.get('primerApellido')?.setValue(valor);
    component.actualizarPrimerApellido();
    expect(mockSolicitud40302Store.setPrimerApellido).toHaveBeenCalledWith(valor);
  });

  it('debería actualizar el segundo apellido en el store', () => {
    const valor = 'Apellido2';
    component.solicitudForm.get('segundoApellido')?.setValue(valor);
    component.actualizarSegundoApellido();
    expect(mockSolicitud40302Store.setSegundoApellido).toHaveBeenCalledWith(valor);
  });

  it('debería asignar solicitudState en establecerSolicitudForm', () => {
    const estado = { directorGeneralNombre: 'Test' };
    solicitudStateSubject.next(estado);
    component.establecerSolicitudForm();
    expect(component.solicitudState).toEqual(estado);
  });

  it('debería ejecutar inicializarEstadoFormulario correctamente cuando esFormularioSoloLectura es true', () => {
    component.solicitudForm = component['fb'].group({
      cveFolioCaat: [{ value: '3L6V', disabled: true }],
      descTipoCaat: [{ value: 'Naviero', disabled: true }],
      descTipoAgente: [{ value: 'Agente Naviero', disabled: true }],
      directorGeneralNombre: ['HAZEL'],
      primerApellido: ['NAVA'],
      segundoApellido: ['AVILA'],
    });
    component.esFormularioSoloLectura = true;
    const spy = jest.spyOn(component as any, 'guardarDatosFormulario');
    (component as any).inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('debería ejecutar inicializarEstadoFormulario correctamente cuando esFormularioSoloLectura es false', () => {
    component.solicitudForm = component['fb'].group({
      cveFolioCaat: [{ value: '3L6V', disabled: true }],
      descTipoCaat: [{ value: 'Naviero', disabled: true }],
      descTipoAgente: [{ value: 'Agente Naviero', disabled: true }],
      directorGeneralNombre: ['HAZEL'],
      primerApellido: ['NAVA'],
      segundoApellido: ['AVILA'],
    });
    component.esFormularioSoloLectura = false;
    const spy = jest.spyOn(component, 'establecerSolicitudForm');
    (component as any).inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('debería deshabilitar el formulario en guardarDatosFormulario si esFormularioSoloLectura es true', () => {
    component.establecerSolicitudForm();
    component.esFormularioSoloLectura = true;
    (component as any).guardarDatosFormulario();
    expect(component.solicitudForm.disabled).toBe(true);
  });

  it('debería habilitar el formulario en guardarDatosFormulario si esFormularioSoloLectura es false', () => {
    component.establecerSolicitudForm();
    component.esFormularioSoloLectura = false;
    (component as any).guardarDatosFormulario();
    expect(component.solicitudForm.enabled).toBe(true);
  });

  it('debería suscribirse a selectConsultaioState$ en ngOnInit y actualizar esFormularioSoloLectura', () => {
    const spy = jest.spyOn(component as any, 'inicializarEstadoFormulario');
    component.ngOnInit();
    consultaioStateSubject.next({ readonly: true });
    expect(component.esFormularioSoloLectura).toBe(false);
    expect(spy).toHaveBeenCalled();
  });

  it('debería llamar a establecerSolicitudForm, suscribirseAlEstado e inicializarEstadoFormulario en ngOnInit', () => {
    const spyEstablecer = jest.spyOn(component, 'establecerSolicitudForm');
    const spySuscribir = jest.spyOn(component, 'suscribirseAlEstado');
    const spyInicializar = jest.spyOn(component as any, 'inicializarEstadoFormulario');
    component.ngOnInit();
    expect(spyEstablecer).toHaveBeenCalled();
    expect(spySuscribir).toHaveBeenCalled();
    expect(spyInicializar).toHaveBeenCalled();
  });

  it('debería tener los valores iniciales correctos en el formulario', () => {
    component.establecerSolicitudForm();
    expect(component.solicitudForm.get('cveFolioCaat')?.value).toBe('3L6V');
    expect(component.solicitudForm.get('descTipoCaat')?.value).toBe('Naviero');
    expect(component.solicitudForm.get('descTipoAgente')?.value).toBe('Agente Naviero');
    expect(component.solicitudForm.get('directorGeneralNombre')?.value).toBe('HAZEL');
    expect(component.solicitudForm.get('primerApellido')?.value).toBe('NAVA');
    expect(component.solicitudForm.get('segundoApellido')?.value).toBe('AVILA');
  });

  it('debería limpiar todas las suscripciones al destruir el componente', () => {
    const destroyNextSpy = jest.spyOn(component['destroy$'], 'next');
    const destroyCompleteSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroyNextSpy).toHaveBeenCalled();
    expect(destroyCompleteSpy).toHaveBeenCalled();
  });
});