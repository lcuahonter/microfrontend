import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DatosDeLaComponent } from './datos-solicitud.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

// Import the real class for mocking
import { DatosDomicilioLegalStore } from '../../estados/stores/datos-domicilio-legal.store';
import { DatosDomicilioLegalQuery } from '../../estados/queries/datos-domicilio-legal.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('DatosDeLaComponent', () => {
  let component: DatosDeLaComponent;
  let fixture: ComponentFixture<DatosDeLaComponent>;
  let mockStore: any;
  let mockQuery: any;
  let mockConsultaioQuery: any;

  // Add a mock state object
  const mockSolicitudState = {
    rfcDel: 'RFC123456',
    denominacion: 'Test Denominacion',
    correo: 'test@example.com'
  };

  beforeEach(async () => {
    mockStore = {
      setRfcDel: jest.fn(),
      setDenominacion: jest.fn(),
      setCorreo: jest.fn(),
    };
    // Make selectSolicitud$ emit a value
    mockQuery = {
      selectSolicitud$: of(mockSolicitudState)
    };
    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [DatosDeLaComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: DatosDomicilioLegalStore, useValue: mockStore },
        { provide: DatosDomicilioLegalQuery, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize solicitudState and form values on ngOnInit', () => {
    component.ngOnInit();
    expect(component.solicitudState).toEqual(expect.any(Object));
    expect(component.solicitudState).toEqual(mockSolicitudState);
    expect(component.forma.value).toEqual({
      rfcDel: 'RFC123456',
      denominacion: 'Test Denominacion',
      correo: 'test@example.com'
    });
  });

  it('should enable controls after alternarControlesDeFormulario is called', () => {
    component.ngOnInit();
    component.forma.controls['rfcDel'].disable();
    component.forma.controls['denominacion'].disable();
    component.forma.controls['correo'].disable();

    component.alternarControlesDeFormulario();

    expect(component.forma.controls['rfcDel'].enabled).toBe(true);
    expect(component.forma.controls['denominacion'].enabled).toBe(true);
    expect(component.forma.controls['correo'].enabled).toBe(true);
  });

  it('should call store setters when setValoresStore is called', () => {
    component.ngOnInit();
    component.forma.controls['rfcDel'].setValue('RFC123456');
    component.forma.controls['denominacion'].setValue('Test Denominacion');
    component.forma.controls['correo'].setValue('test@example.com');

    component.setValoresStore(component.forma, 'rfcDel', 'setRfcDel');
    component.setValoresStore(component.forma, 'denominacion', 'setDenominacion');
    component.setValoresStore(component.forma, 'correo', 'setCorreo');

    expect(mockStore.setRfcDel).toHaveBeenCalledWith('RFC123456');
    expect(mockStore.setDenominacion).toHaveBeenCalledWith('Test Denominacion');
    expect(mockStore.setCorreo).toHaveBeenCalledWith('test@example.com');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });
});