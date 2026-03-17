import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnexoTresComponent } from './anexo-tres.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Tramite80104Store } from '../../../estados/tramites/tramite80104.store';
import { Tramite80104Query } from '../../../estados/queries/tramite80104.query';

describe('AnexoTresComponent', () => {
  let component: AnexoTresComponent;
  let fixture: ComponentFixture<AnexoTresComponent>;

  const mockSolicitudState = {
    rfc: 'RFC123',
    estado: 1
  };

  const mockStore = {
    setAnexoDos: jest.fn(),
    setAnexoTres: jest.fn(),
    setFraccionArancelaria: jest.fn(),
    setDescripcion: jest.fn()
  };

  const mockQuery = {
    selectSolicitud$: of(mockSolicitudState),
    getValue: () => ({
      anexoDos: [],
      anexoTres: []
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnexoTresComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite80104Store, useValue: mockStore },
        { provide: Tramite80104Query, useValue: mockQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnexoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize both forms and states correctly', () => {
    expect(component.anexoDosForm).toBeDefined();
    expect(component.anexoTresForm).toBeDefined();
    expect(component.anexoDos).toEqual([]);
    expect(component.anexoTres).toEqual([]);
  });

  it('should call setValoresStore with correct value and method', () => {
    const form = component.anexoDosForm;
    form.get('descripcion')?.setValue('Test Description');
    component.setValoresStore(form, 'descripcion', 'setDescripcion');
    expect(mockStore.setDescripcion).toHaveBeenCalledWith('Test Description');
  });

  it('should add new item to anexoDos and update store', () => {
    component.anexoDosForm.setValue({
      fraccionArancelaria: 12345678,
      descripcion: 'Test Desc'
    });

    component.anexoDosAgregar();

    expect(component.anexoDos.length).toBe(1);
    expect(component.anexoDos[0].fraccionArancelaria).toBe(12345678);
    expect(mockStore.setAnexoDos).toHaveBeenCalledWith(expect.any(Array));
    expect(component.anexoDosForm.value.fraccionArancelaria).toBe(null);
  });

  it('should add new item to anexoTres and update store', () => {
    component.anexoTresForm.setValue({
      fraccionTres: 87654321,
      descripcionTres: 'Desc Tres'
    });

    component.anexoTresAgregar();

    expect(component.anexoTres.length).toBe(1);
    expect(component.anexoTres[0].fraccionArancelaria).toBe(87654321);
    expect(mockStore.setAnexoTres).toHaveBeenCalledWith(expect.any(Array));
    expect(component.anexoTresForm.value.fraccionTres).toBe(null);
  });

  it('should reset anexoDos form on delete', () => {
    component.anexoDosForm.setValue({
      fraccionArancelaria: 123,
      descripcion: 'Temp'
    });

    component.anexoDosElimiar();

    expect(component.anexoDosForm.value.fraccionArancelaria).toBe(null);
  });

  it('should reset anexoTres form on delete', () => {
    component.anexoTresForm.setValue({
      fraccionTres: 456,
      descripcionTres: 'Temp'
    });

    component.anexoTresElimiar();

    expect(component.anexoTresForm.value.fraccionTres).toBe(null);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
