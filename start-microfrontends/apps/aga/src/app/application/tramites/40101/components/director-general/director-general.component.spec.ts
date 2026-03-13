import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DirectorGeneralComponent } from './director-general.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chofer40101Service } from '../../estado/chofer40101.service';
import { Chofer40101Query } from '../../estado/chofer40101.query';
import { Chofer40101Store } from '../../estado/chofer40101.store';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';

describe('DirectorGeneralComponent', () => {
  let component: DirectorGeneralComponent;
  let fixture: ComponentFixture<DirectorGeneralComponent>;
  let fb: FormBuilder;
  let mockChofer40101Service: jest.Mocked<Chofer40101Service>;
  let mockChofer40101Query: jest.Mocked<Chofer40101Query>;
  let mockChofer40101Store: jest.Mocked<Chofer40101Store>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;

  beforeEach(async () => {
    // Create mock services
    mockChofer40101Service = {
      getDatosConsulta: jest.fn(),
      getDatosConsultaById: jest.fn(),
      updateStateDirectorGeneralData: jest.fn()
    } as unknown as jest.Mocked<Chofer40101Service>;
    
    mockChofer40101Query = {
      select: jest.fn(),
      selectLoading: jest.fn(),
      selectSolicitud$: of({
        nombre: 'Juan',
        primerApellido: 'Pérez',
        segundoApellido: 'García'
      })
    } as unknown as jest.Mocked<Chofer40101Query>;

    mockChofer40101Store = {
      update: jest.fn(),
      setLoading: jest.fn(),
      getValue: jest.fn().mockReturnValue({
        nombre: 'Juan',
        primerApellido: 'Pérez',
        segundoApellido: 'García'
      })
    } as unknown as jest.Mocked<Chofer40101Store>;

    mockConsultaioQuery = {
      select: jest.fn(),
      selectLoading: jest.fn(),
      selectConsultaioState$: of({ readonly: false, update: true })
    } as unknown as jest.Mocked<ConsultaioQuery>;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule, 
        ReactiveFormsModule,
      ],
      declarations: [DirectorGeneralComponent],
      providers: [
        FormBuilder,
        { provide: HttpClient, useValue: provideHttpClientTesting() },
        { provide: Chofer40101Service, useValue: mockChofer40101Service },
        { provide: Chofer40101Query, useValue: mockChofer40101Query },
        { provide: Chofer40101Store, useValue: mockChofer40101Store },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorGeneralComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
  });

  afterEach(() => {
    jest.clearAllMocks();
    fixture.destroy();
  });

  it('should create the component', () => {
    component.directorGeneralForm = fb.group({
      name: [''],
      email: [''],
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create the component with manual instantiation', () => {
    const readonlyState = { readonly: true, update: true } as unknown as ConsultaioState;
    mockConsultaioQuery.select = jest.fn().mockReturnValue(of(readonlyState));

    const testComponent = new DirectorGeneralComponent(
      fb,
      mockChofer40101Store,
      mockChofer40101Service,
      mockChofer40101Query,
      mockConsultaioQuery
    );

    testComponent.ngOnInit();

    expect(testComponent).toBeTruthy();
  });

  describe('Consultaio State Subscription - Selected Logic', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    afterEach(() => {
      if (component.destroyNotifier$ && !component.destroyNotifier$.closed) {
        component.destroyNotifier$.next();
        component.destroyNotifier$.complete();
      }
    });

    it('should disable form when consultaio state changes to readonly and handle form not being initialized yet', () => {
      const consultaioStateSubject = new Subject<any>();
      mockConsultaioQuery.selectConsultaioState$ = consultaioStateSubject.asObservable();

      component.ngOnDestroy();
      component.ngOnInit();

      expect(component.directorGeneralForm).toBeDefined();
      expect(component.directorGeneralForm.enabled).toBeTruthy();

      const readonlyState = { readonly: true, update: false, solicitudId: '12345' };
      consultaioStateSubject.next(readonlyState);

      expect(component.directorGeneralForm.disabled).toBeTruthy();

      const nonReadonlyState = { readonly: false, update: true, solicitudId: '12345' };
      consultaioStateSubject.next(nonReadonlyState);

      expect(component.directorGeneralForm.disabled).toBeTruthy();

      const undefinedReadonlyState = { update: true, solicitudId: '12345' };
      consultaioStateSubject.next(undefinedReadonlyState);

      expect(component.directorGeneralForm.disabled).toBeTruthy();

      consultaioStateSubject.next(null);

      expect(component.directorGeneralForm.disabled).toBeTruthy();

      consultaioStateSubject.complete();
    });

    it('should handle consultaio state emission before form is created', () => {
      const consultaioStateSubject = new Subject<any>();
      mockConsultaioQuery.selectConsultaioState$ = consultaioStateSubject.asObservable();

      const originalCrearFormulario = component.crearFormularioDirectorGeneral;
      let formCreated = false;
      component.crearFormularioDirectorGeneral = jest.fn().mockImplementation(() => {
        formCreated = false;
      });

      component.ngOnDestroy();
      component.ngOnInit();

      consultaioStateSubject.next({ readonly: true });

      expect(() => consultaioStateSubject.next({ readonly: true })).not.toThrow();

      originalCrearFormulario.call(component);
      formCreated = true;

      consultaioStateSubject.next({ readonly: true });

      expect(component.directorGeneralForm.disabled).toBeTruthy();

      consultaioStateSubject.complete();
    });

    it('should use takeUntil to properly unsubscribe when component is destroyed', () => {
      const consultaioStateSubject = new Subject<any>();
      mockConsultaioQuery.selectConsultaioState$ = consultaioStateSubject.asObservable();

      component.ngOnDestroy();
      component.ngOnInit();

      consultaioStateSubject.next({ readonly: true });
      expect(component.directorGeneralForm.disabled).toBeTruthy();

      component.destroyNotifier$.next();

      component.directorGeneralForm.enable();
      expect(component.directorGeneralForm.enabled).toBeTruthy();

      consultaioStateSubject.next({ readonly: true });

      expect(component.directorGeneralForm.enabled).toBeTruthy();

      consultaioStateSubject.complete();
    });

    it('should handle errors in consultaio state observable gracefully', () => {
      const consultaioStateSubject = new Subject<any>();
      mockConsultaioQuery.selectConsultaioState$ = consultaioStateSubject.asObservable();

      component.ngOnDestroy();
      component.ngOnInit();

      consultaioStateSubject.next({ readonly: false });
      expect(component.directorGeneralForm.enabled).toBeTruthy();

      expect(() => {
        consultaioStateSubject.error(new Error('Observable error'));
      }).not.toThrow();

      expect(component.directorGeneralForm).toBeDefined();
    });

    it('should handle rapid state changes correctly', () => {
      const consultaioStateSubject = new Subject<any>();
      mockConsultaioQuery.selectConsultaioState$ = consultaioStateSubject.asObservable();

      component.ngOnDestroy();
      component.ngOnInit();

      consultaioStateSubject.next({ readonly: false });
      consultaioStateSubject.next({ readonly: true });
      consultaioStateSubject.next({ readonly: false });
      consultaioStateSubject.next({ readonly: true });

      expect(component.directorGeneralForm.disabled).toBeTruthy();

      consultaioStateSubject.complete();
    });
  });
});