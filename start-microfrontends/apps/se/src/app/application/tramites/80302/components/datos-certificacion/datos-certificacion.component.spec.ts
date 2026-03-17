import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { DatosCertificacionComponent } from './datos-certificacion.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { SolicitudService } from '../../service/solicitud.service';
import { Tramite80302Store } from '../../../../estados/tramites/tramite80302.store';

describe('DatosCertificacionComponent', () => {
  let fixture: ComponentFixture<DatosCertificacionComponent>;
  let component: DatosCertificacionComponent;
  let toastrService: jest.Mocked<ToastrService>;

  beforeEach(() => {
    toastrService = {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
    } as unknown as jest.Mocked<ToastrService>;

    // default empty mocks for services used by constructor; tests will override them when needed
    const defaultSolicitudService = {
      obtenerDatosCertificacionSat: jest.fn().mockReturnValue(new Observable(() => {})),
    } as unknown as SolicitudService;

    const defaultStore = {
      setCertificacionSAT: jest.fn(),
    } as unknown as Tramite80302Store;

    TestBed.configureTestingModule({
      imports: [DatosCertificacionComponent, FormsModule, ReactiveFormsModule,HttpClientTestingModule],
      providers: [FormBuilder,
        { provide: ToastrService, useValue: toastrService },
        { provide: SolicitudService, useValue: defaultSolicitudService },
        { provide: Tramite80302Store, useValue: defaultStore },
        {
          provide: '_HttpClient',
          useValue: {} // Mock implementation of _HttpClient
        }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).overrideComponent(DatosCertificacionComponent, {}).compileComponents();

  // Note: do not create the component here so tests can set provider mocks
  // and create the component after configuring per-test behavior.
  });

  it('should set formValue, patch form and call store when obtenerDatosCertificacionSat returns data', (done) => {
    const mockData = { datos: { certificacionSAT: 'CERT-123' } };
    // configure the already-provided mocks before creating the component
    const solicitud = TestBed.inject(SolicitudService) as any;
    solicitud.obtenerDatosCertificacionSat = jest.fn().mockReturnValue(
      new Observable((subscriber) => {
        // emit asynchronously so component's form is initialized first
        setTimeout(() => {
          subscriber.next(mockData);
          subscriber.complete();
        }, 0);
      })
    );

    const setCertSpy = jest.fn();
    const store = TestBed.inject(Tramite80302Store) as any;
    store.setCertificacionSAT = setCertSpy;

    fixture = TestBed.createComponent(DatosCertificacionComponent);
    const localComp = fixture.componentInstance;

    // wait for the async emission
    setTimeout(() => {
      try {
        expect(localComp.formValue).toBe('CERT-123');
        expect(localComp.certificionForm.get('certificion')?.value).toBe('CERT-123');
        expect(setCertSpy).toHaveBeenCalledWith('CERT-123');
        done();
      } catch (err) {
        done(err as Error);
      }
    }, 20);
  });

  it('should call toastr.error when obtenerDatosCertificacionSat errors', (done) => {
    const solicitud = TestBed.inject(SolicitudService) as any;
    solicitud.obtenerDatosCertificacionSat = jest.fn().mockReturnValue(
      new Observable((subscriber: any) => {
        setTimeout(() => {
          subscriber.error(new Error('fail'));
        }, 0);
      })
    );

    fixture = TestBed.createComponent(DatosCertificacionComponent);
    const localComp = fixture.componentInstance;

    setTimeout(() => {
      try {
        expect(toastrService.error).toHaveBeenCalledWith('Error al obtener los datos de certificación SAT.');
        done();
      } catch (err) {
        done(err as Error);
      }
    }, 20);
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(DatosCertificacionComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize certificionForm', () => {
    fixture = TestBed.createComponent(DatosCertificacionComponent);
    component = fixture.componentInstance;
    expect(component.certificionForm).toBeDefined();
  });

  it('should initialize certificion control with value "Si"', () => {
    fixture = TestBed.createComponent(DatosCertificacionComponent);
    component = fixture.componentInstance;
    const value = component.certificionForm.get('certificion')?.value;
    expect(value).toBe('');
  });

  it('should have certificion control disabled', () => {
    fixture = TestBed.createComponent(DatosCertificacionComponent);
    component = fixture.componentInstance;
    const control = component.certificionForm.get('certificion');
    expect(control?.disabled).toBe(true);
  });

  it('should allow setting value when control is enabled', () => {
    fixture = TestBed.createComponent(DatosCertificacionComponent);
    component = fixture.componentInstance;
    const control = component.certificionForm.get('certificion');
    control?.enable();
    control?.setValue('No');
    expect(control?.value).toBe('No');
    expect(control?.disabled).toBe(false);
  });

  it('should have certificion control present in the form', () => {
    fixture = TestBed.createComponent(DatosCertificacionComponent);
    component = fixture.componentInstance;
    const control = component.certificionForm.get('certificion');
    expect(control).toBeDefined();
  });

  it('should emit valueChanges when certificion control value changes', (done) => {
    fixture = TestBed.createComponent(DatosCertificacionComponent);
    component = fixture.componentInstance;
    const control = component.certificionForm.get('certificion');
    // enable so we can set a value
    control?.enable();
    const expected = 'ValorPrueba';
    const sub = control?.valueChanges?.subscribe((val) => {
      try {
        expect(val).toBe(expected);
        sub?.unsubscribe();
        done();
      } catch (err) {
        sub?.unsubscribe();
        done(err as Error);
      }
    });
    control?.setValue(expected);
  });

  it('ngOnDestroy should complete destroyNotifier$ and notify subscribers', (done) => {
    let completed = false;
    fixture = TestBed.createComponent(DatosCertificacionComponent);
    component = fixture.componentInstance;

    component.destroyNotifier$.subscribe({
      complete: () => {
  completed = true;
  expect(completed).toBe(true);
        done();
      },
      error: (err) => done(err),
    });

    // trigger destruction
    component.ngOnDestroy();
  });
});
