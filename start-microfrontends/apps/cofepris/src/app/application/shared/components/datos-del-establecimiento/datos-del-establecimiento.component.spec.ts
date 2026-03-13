import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DatosDelEstablecimientoComponent } from './datos-del-establecimiento.component';
import { DomicilioStore } from '../../estados/stores/domicilio.store'; 
import { DomicilioQuery } from '../../../shared/estados/queries/domicilio.query';

describe('DatosDelEstablecimientoComponent', () => {
  let component: DatosDelEstablecimientoComponent;
  let fixture: ComponentFixture<DatosDelEstablecimientoComponent>;
  let mockTramiteStore: jest.Mocked<DomicilioStore>;
  let mockTramiteQuery: jest.Mocked<DomicilioQuery>;

  beforeEach(async () => {
    mockTramiteStore = {
      setDenominacion: jest.fn(),
      setCorreoElectronico: jest.fn(),
    } as unknown as jest.Mocked<DomicilioStore>;

    mockTramiteQuery = {
      selectSolicitud$: of({
        denominacion: 'Test Denominacion',
        correoElectronico: 'test@example.com',
      }),
    } as unknown as jest.Mocked<DomicilioQuery>;

    await TestBed.configureTestingModule({
      imports: [DatosDelEstablecimientoComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: DomicilioStore, useValue: mockTramiteStore },
        { provide: DomicilioQuery, useValue: mockTramiteQuery },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosDelEstablecimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario en ngOnInit', () => {
    component.ngOnInit();
    expect(component.datosDelForm).toBeDefined();
    expect(component.datosDelForm.get('denominacion')?.value).toBe('Test Denominacion');
    expect(component.datosDelForm.get('correoElectronico')?.value).toBe('test@example.com');
  });

  it('debe abrir el modal cuando se llama abrirModal', () => {
    component.abrirModal();
    expect(component.modal).toBe('show');
  });

  it('debe establecer valores en el store usando setValoresStore', () => {
    const form = component.datosDelForm;
    form.get('denominacion')?.setValue('New Denominacion');
    component.setValoresStore(form, 'denominacion', 'setDenominacion');
    expect(mockTramiteStore.setDenominacion).toHaveBeenCalledWith('New Denominacion');

    form.get('correoElectronico')?.setValue('new@example.com');
    component.setValoresStore(form, 'correoElectronico', 'setCorreoElectronico');
    expect(mockTramiteStore.setCorreoElectronico).toHaveBeenCalledWith('new@example.com');
  });

  it('debe limpiar los observables en ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });
});