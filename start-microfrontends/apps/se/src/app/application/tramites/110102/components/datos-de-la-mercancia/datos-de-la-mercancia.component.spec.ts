import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDeLaMercanciaComponent } from './datos-de-la-mercancia.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

class MockTramite110102Store {
  establecerDatos = jest.fn();
}
class MockConsultaioQuery {
  selectConsultaioState$ = of({ readonly: false });
}
class MockTramite110102Query {
  selectTramite110102$ = of({
    cveRegistroProductor: '1234567890',
    solicitud: { idSolicitud: null, idSolicitudProductor: '' }
  });
}

describe('DatosDeLaMercanciaComponent', () => {
  let component: DatosDeLaMercanciaComponent;
  let fixture: ComponentFixture<DatosDeLaMercanciaComponent>;
  let mockStore: MockTramite110102Store;
  let mockConsultaQuery: MockConsultaioQuery;
  let mockTramiteQuery: MockTramite110102Query;

  beforeEach(async () => {
    mockStore = new MockTramite110102Store();
    mockConsultaQuery = new MockConsultaioQuery();
    mockTramiteQuery = new MockTramite110102Query();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosDeLaMercanciaComponent],
      providers: [
        FormBuilder,
        { provide: 'Tramite110102Store', useValue: mockStore },
        { provide: 'ConsultaioQuery', useValue: mockConsultaQuery },
        { provide: 'Tramite110102Query', useValue: mockTramiteQuery }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .overrideComponent(DatosDeLaMercanciaComponent, {
        set: {
          providers: [
            { provide: FormBuilder, useClass: FormBuilder },
            { provide: 'Tramite110102Store', useValue: mockStore },
            { provide: 'ConsultaioQuery', useValue: mockConsultaQuery },
            { provide: 'Tramite110102Query', useValue: mockTramiteQuery }
          ]
        }
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosDeLaMercanciaComponent);
    component = fixture.componentInstance;

    // Patch the injected services
    (component as any).tramiteStore = mockStore;
    (component as any).consultaQuery = mockConsultaQuery;
    (component as any).tramiteQuery = mockTramiteQuery;

    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con valores del estado', () => {
    expect(component.formularioDatosMercancia).toBeDefined();
    expect(component.formularioDatosMercancia.get('cveRegistroProductor')?.value).toBe('1234567890');
  });

  it('debe marcar el control como inválido si está vacío y tocado', () => {
    const control = component.formularioDatosMercancia.get('cveRegistroProductor');
    control?.setValue('');
    control?.markAsTouched();
    fixture.detectChanges();
    expect(component.esControlInvalido('cveRegistroProductor')).toBe(true);
  });

  it('debe llamar a establecerDatos en el store al cambiar el valor', () => {
    const control = component.formularioDatosMercancia.get('cveRegistroProductor');
    control?.setValue('9876543210');
    component.establecerValoresEnEstado(component.formularioDatosMercancia, 'cveRegistroProductor');
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({ cveRegistroProductor: '9876543210' });
  });

  it('debe deshabilitar el formulario si esSoloLectura es true', () => {
    component.esSoloLectura = true;
    component.habilitarDeshabilitarFormulario();
    expect(component.formularioDatosMercancia.disabled).toBe(true);
  });

  it('debe habilitar el formulario si esSoloLectura es false', () => {
    component.esSoloLectura = false;
    component.habilitarDeshabilitarFormulario();
    expect(component.formularioDatosMercancia.enabled).toBe(true);
  });

  it('debe mostrar notificación si el patrón es inválido al buscar', () => {
    const control = component.formularioDatosMercancia.get('cveRegistroProductor');
    control?.setValue('abc'); 
    control?.markAsDirty();
    control?.setErrors({ pattern: true });
    component.actualizarGridComercializadores();
    expect(component.alertaNotificacion).toBeDefined();
    expect(component.alertaNotificacion.mensaje).toContain('Debe introducir la clave de registro');
  });

  it('debe mostrar notificación si el número de registro no es 254023028961', () => {
    const control = component.formularioDatosMercancia.get('cveRegistroProductor');
    control?.setValue('1234567890');
    control?.setErrors(null);
    component.actualizarGridComercializadores();
    expect(component.alertaNotificacion).toBeDefined();
    expect(component.alertaNotificacion.mensaje).toContain('El número de registro proporcionado no existe');
  });

  it('no debe mostrar notificación si el campo está vacío', () => {
    const control = component.formularioDatosMercancia.get('cveRegistroProductor');
    control?.setValue('');
    component.actualizarGridComercializadores();
    expect(component.alertaNotificacion).toBeUndefined();
  });

  it('debe limpiar las suscripciones al destruir el componente', () => {
    const spyNext = jest.spyOn((component as any).destruido$, 'next');
    const spyComplete = jest.spyOn((component as any).destruido$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});