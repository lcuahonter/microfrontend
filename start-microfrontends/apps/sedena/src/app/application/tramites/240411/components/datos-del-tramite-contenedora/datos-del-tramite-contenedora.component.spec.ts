import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelTramiteContenedoraComponent } from './datos-del-tramite-contenedora.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('DatosDelTramiteContenedoraComponent', () => {
  let component: DatosDelTramiteContenedoraComponent;
  let fixture: ComponentFixture<DatosDelTramiteContenedoraComponent>;
  let tramiteQueryMock: any;
  let tramiteStoreMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    tramiteQueryMock = {
      getMercanciaTablaDatos$: of([{ id: 1, descripcion: 'Mercancía 1' }]),
      getDatosDelTramite$: of({ campo: 'valor' }),
      getJustificacionTramite$: of({ motivo: 'Justificación' })
    };

    tramiteStoreMock = {
      updateDatosDelTramiteFormState: jasmine.createSpy('updateDatosDelTramiteFormState'),
      updateJustificacionFormulario: jasmine.createSpy('updateJustificacionFormulario')
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: true })
    };

    await TestBed.configureTestingModule({
      imports: [DatosDelTramiteContenedoraComponent],
      providers: [
        { provide: 'Tramite240411Query', useValue: tramiteQueryMock },
        { provide: 'Tramite240411Store', useValue: tramiteStoreMock },
        { provide: 'ConsultaioQuery', useValue: consultaioQueryMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelTramiteContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los datos de la tabla de mercancías al inicializar', () => {
    expect(component.datosMercanciaTabla.length).toBeGreaterThan(0);
    expect(component.datosMercanciaTabla[0].descripcion).toBe('Mercancía 1');
  });

  it('debería cargar el estado del formulario de datos del trámite al inicializar', () => {
    expect(component.datosDelTramiteFormState).toBeDefined();
    expect(component.datosDelTramiteFormState).toEqual({ campo: 'valor' });
  });

  it('debería cargar el estado del formulario de justificación al inicializar', () => {
    expect(component.justificacionTramiteFormState).toBeDefined();
    expect((component.justificacionTramiteFormState as any).motivo).toBe('Justificación');
  });

  it('debería establecer el formulario en solo lectura si el estado lo indica', () => {
    expect(component.esFormularioSoloLectura).toBe(true);
  });

  it('debería actualizar el estado del formulario de datos del trámite en el store', () => {
    const nuevoEstado = { campo: 'nuevoValor' };
    component.updateDatosDelTramiteFormulario(nuevoEstado as any);
    expect(tramiteStoreMock.updateDatosDelTramiteFormState).toHaveBeenCalledWith(nuevoEstado);
  });

  it('debería actualizar el estado del formulario de justificación en el store', () => {
    const nuevoEstado = { motivo: 'Nuevo motivo' };
    component.updateJustificacionFormulario(nuevoEstado as any);
    expect(tramiteStoreMock.updateJustificacionFormulario).toHaveBeenCalledWith(nuevoEstado);
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const spy = spyOn(component['unsubscribe$'], 'next').and.callThrough();
    const spyComplete = spyOn(component['unsubscribe$'], 'complete').and.callThrough();
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});