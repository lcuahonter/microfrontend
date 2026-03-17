import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificacionVigenciasComponent } from './modificacion-vigencias.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Solicitud33304Store } from '../../estados/solicitud33304Store';
import { Solicitud33304Query } from '../../estados/solicitud33304Query';
import { InputFechaComponent } from '@libs/shared/data-access-user/src';


describe('ModificacionVigenciasComponent', () => {
  let component: ModificacionVigenciasComponent;
  let fixture: ComponentFixture<ModificacionVigenciasComponent>;
  let solicitudStoreMock: any;
  let solicitudQueryMock: any;

  beforeEach(async () => {
    solicitudStoreMock = {
      actualizarEstado: jest.fn()
    };

    solicitudQueryMock = {
      selectSolicitud$: of({}),
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, ModificacionVigenciasComponent, InputFechaComponent],
      providers: [
        { provide: Solicitud33304Store, useValue: solicitudStoreMock },
        { provide: Solicitud33304Query, useValue: solicitudQueryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificacionVigenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con valores vacíos', () => {
    expect(component.formularioModificacionVigencias).toBeDefined();
    expect(component.formularioModificacionVigencias.get('modificacionVigencias')?.value).toBeNull();
  });

  it('debe actualizar el store al cambiar un campo', () => {
    const control = component.formularioModificacionVigencias.get('fechaInicioVigenciaActual');
    control?.setValue('2025-01-01');
    component.setValoresStore(component.formularioModificacionVigencias, 'fechaInicioVigenciaActual');
    expect(solicitudStoreMock.actualizarEstado).toHaveBeenCalledWith({ fechaInicioVigenciaActual: '2025-01-01' });
  });

  it('debe aplicar validadores a las fechas si modificacionVigencias es 1', () => {
    component.formularioModificacionVigencias.get('modificacionVigencias')?.setValue('1');
    component.setValoresStore(component.formularioModificacionVigencias, 'modificacionVigencias');
    expect(component.formularioModificacionVigencias.get('fechaInicioVigenciaAnterior')?.validator).toBeTruthy();
    expect(component.formularioModificacionVigencias.get('fechaFinVigenciaActual')?.validator).toBeTruthy();
  });

  it('debe limpiar las fechas si modificacionVigencias no es 1', () => {
  component.formularioModificacionVigencias.patchValue({
    fechaInicioVigenciaAnterior: '2025-01-01',
    fechaFinVigenciaAnterior: '2025-12-31',
    fechaInicioVigenciaActual: '2026-01-01',
    fechaFinVigenciaActual: '2026-12-31',
  });

  component.formularioModificacionVigencias.get('modificacionVigencias')?.setValue('2'); // <-- Important
  component.setValoresStore(component.formularioModificacionVigencias, 'modificacionVigencias');

  expect(component.formularioModificacionVigencias.get('fechaInicioVigenciaAnterior')?.value).toBe('');
  expect(component.formularioModificacionVigencias.get('fechaFinVigenciaAnterior')?.value).toBe('');
  expect(component.formularioModificacionVigencias.get('fechaInicioVigenciaActual')?.value).toBe('');
  expect(component.formularioModificacionVigencias.get('fechaFinVigenciaActual')?.value).toBe('');
});


  it('debe actualizar la fecha con actualizarFecha()', () => {
    component.actualizarFecha('2025-06-15', 'fechaFinVigenciaActual');
    expect(component.formularioModificacionVigencias.get('fechaFinVigenciaActual')?.value).toBe('2025-06-15');
  });
});