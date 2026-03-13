import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvisoComponent } from './aviso.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, Subject } from 'rxjs';

const mockSolicitudState = {
  descripcionMercancia: 'desc',
  porcentajeDesperdicio: 10,
};
const mockStore = {
  setDescripcionMercancia: jest.fn(),
  setPorcentajeDesperdicio: jest.fn(),
};
const mockQuery = {
  selectSolicitud$: of(mockSolicitudState),
};

describe('AvisoComponent', () => {
  let component: AvisoComponent;
  let fixture: ComponentFixture<AvisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisoComponent],
      providers: [
        { provide: FormBuilder, useValue: new FormBuilder() },
        { provide: 'Solicitud32513Store', useValue: mockStore },
        { provide: 'Solicitud32513Query', useValue: mockQuery },
      ],
    })
      .overrideComponent(AvisoComponent, {
        set: {
          providers: [
            { provide: FormBuilder, useValue: new FormBuilder() },
            { provide: 'Solicitud32513Store', useValue: mockStore },
            { provide: 'Solicitud32513Query', useValue: mockQuery },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AvisoComponent);
    component = fixture.componentInstance;
    component.solicitud32513Store = mockStore as any;
    component.solicitud32513Query = mockQuery as any;
    component.solicitudState = mockSolicitudState as any;
    component.inicializarFormulario();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with state values', () => {
    expect(component.avisoForm).toBeDefined();
    expect(component.avisoForm.get('descripcionMercancia')?.value).toBe('desc');
    expect(component.avisoForm.get('porcentajeDesperdicio')?.value).toBe(10);
  });

  it('should set mostrarMensajeArchivoValido true for valid .xlsx file in cargarProveedores', () => {
    const file = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file] });
    jest.spyOn(document, 'getElementById').mockReturnValue(input);
    component.cargarProveedores();
    expect(component.mostrarMensajeArchivoValido).toBe(true);
  });

  it('should set mostrarMensajeArchivoValido false for invalid file in cargarProveedores', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file] });
    jest.spyOn(document, 'getElementById').mockReturnValue(input);
    component.cargarProveedores();
    expect(component.mostrarMensajeArchivoValido).toBe(false);
  });

  it('should handle file change in onCambioDeArchivo', () => {
    const file = new File([''], 'archivo.xlsx');
    const event = {
      target: {
        files: [file],
        value: 'archivo.xlsx',
      },
    } as any;
    component.onCambioDeArchivo(event);
    expect(component.archivoMedicamentos).toBe(file);
    expect(component.elgirDeArchivo).toBe('archivo.xlsx');
  });

  it('should set elgirDeArchivo from elgirArchivo.value if no file selected in onCambioDeArchivo', () => {
    component.elgirArchivo = { value: 'default.xlsx' } as any;
    const event = {
      target: {
        files: [],
      },
    } as any;
    component.onCambioDeArchivo(event);
    expect(component.elgirDeArchivo).toBe('default.xlsx');
  });

  it('should activate file selection in activarSeleccionArchivo', () => {
    const clickMock = jest.fn();
    const input = { click: clickMock } as any;
    jest.spyOn(document, 'getElementById').mockReturnValue(input);
    component.activarSeleccionArchivo();
    expect(component.elgirArchivo).toBe(input);
    expect(clickMock).toHaveBeenCalled();
  });

  it('should return true if form control is invalid and touched in isInvalid', () => {
    const control = component.avisoForm.get('descripcionMercancia');
    control?.setValue('');
    control?.markAsTouched();
    expect(component.isInvalid('descripcionMercancia')).toBe(true);
  });

  it('should return false if form control is valid in isInvalid', () => {
    const control = component.avisoForm.get('descripcionMercancia');
    control?.setValue('valid');
    control?.markAsTouched();
    expect(component.isInvalid('descripcionMercancia')).toBe(false);
  });

  it('should call store method in setValoresStore', () => {
    const form = new FormBuilder().group({ test: ['value'] });
    const store = { setTest: jest.fn() };
    component.solicitud32513Store = store as any;
    component.setValoresStore(form, 'test', 'setTest' as any);
    expect(store.setTest).toHaveBeenCalledWith('value');
  });

  it('should clean up destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
