import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockConsultaQuery: any;
  let mockSolocitud260104Service: any;

  beforeEach(async () => {
    mockConsultaQuery = {
      selectConsultaioState$: of({ update: false })
    };
    mockSolocitud260104Service = {
      getRegistroTomaMuestrasMercanciasDataDos: jest.fn().mockReturnValue(of({ data: 'test' })),
      actualizarEstadoFormularioDos: jest.fn(),
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ data: 'test' })),
      actualizarEstadoFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PasoUnoComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {} } } },
        { provide: 'ConsultaioQuery', useValue: mockConsultaQuery },
        { provide: 'Solocitud260104Service', useValue: mockSolocitud260104Service }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe cambiar el índice de la pestaña activa', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debe ejecutar guardarDatosFormularioDos y actualizar estado', () => {
    component.esDatosRespuesta = false;
    // Get the actual injected service instance from the component
    const injectedService = (component as any).solocitud260104Service;
    jest.spyOn(injectedService, 'getRegistroTomaMuestrasMercanciasDataDos').mockReturnValue(of({ data: 'test' }));
    jest.spyOn(injectedService, 'actualizarEstadoFormularioDos').mockImplementation(() => {});

    component.guardarDatosFormularioDos();

    expect(injectedService.getRegistroTomaMuestrasMercanciasDataDos).toHaveBeenCalled();
    expect(injectedService.actualizarEstadoFormularioDos).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe ejecutar guardarDatosFormulario y actualizar estado', () => {
    component.esDatosRespuesta = false;
    const injectedService = (component as any).solocitud260104Service;
    jest.spyOn(injectedService, 'getRegistroTomaMuestrasMercanciasData').mockReturnValue(of({ data: 'test' }));
    jest.spyOn(injectedService, 'actualizarEstadoFormulario').mockImplementation(() => {});

    component.guardarDatosFormulario();

    expect(injectedService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(injectedService.actualizarEstadoFormulario).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe limpiar las suscripciones en ngOnDestroy', () => {
    const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('debe ejecutar la rama else en ngOnInit', () => {
    // Simula el caso en que update es false
    mockConsultaQuery.selectConsultaioState$ = of({ update: false });
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });
});
