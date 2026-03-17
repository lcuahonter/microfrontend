import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { DatosDeLaSolicitudService } from '../../services/datos-de-la-solicitud.service';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA , NO_ERRORS_SCHEMA } from '@angular/core';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let datosDeLaSolicitudServiceMock: any;

  beforeEach(async () => {
    datosDeLaSolicitudServiceMock = {
      getImportacionDefinitivaData: jest.fn().mockReturnValue(of({ campo1: 'valor1', campo2: 'valor2' })),
      actualizarEstadoFormulario: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: DatosDeLaSolicitudService, useValue: datosDeLaSolicitudServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debe establecer esDatosRespuesta en true si consultaState.update es false', () => {
      component.consultaState = { update: false } as any;
      component.ngOnInit();
      expect(component.esDatosRespuesta).toBe(true);
    });
  });

  describe('guardarDatosFormulario', () => {
    it('debe establecer esDatosRespuesta en true y actualizar el store por cada clave', () => {
      component.guardarDatosFormulario();
      expect(component.esDatosRespuesta).toBe(true);
      expect(datosDeLaSolicitudServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith('campo1', 'valor1');
      expect(datosDeLaSolicitudServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith('campo2', 'valor2');
    });

    it('no debe lanzar error si la respuesta es undefined', () => {
      datosDeLaSolicitudServiceMock.getImportacionDefinitivaData.mockReturnValueOnce(of(undefined));
      expect(() => component.guardarDatosFormulario()).not.toThrow();
    });
  });

  describe('seleccionaTab', () => {
    it('debe establecer indice al valor proporcionado', () => {
      component.seleccionaTab(5);
      expect(component.indice).toBe(5);
    });
  });

  describe('ngOnDestroy', () => {
    it('debe llamar next y complete en destroyNotifier$', () => {
      const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
