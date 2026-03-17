import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { Component, Input } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Solocitud110201Service } from '../../services/service110201.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-solicitante',
  template: '',
})
class MockSolicitanteComponent {
  @Input() tipoPersona: typeof TIPO_PERSONA | undefined;
  obtenerTipoPersona(tipo: typeof TIPO_PERSONA[keyof typeof TIPO_PERSONA]): void {}
}

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let solicitanteComponentMock: MockSolicitanteComponent;
  let registroServiceMock: any;

  beforeEach(async () => {
    registroServiceMock = {
      actualizarEstadoFormulario: jest.fn(),
      getMostrarSolicitud: jest.fn(() => of({})),
      reverseBuildSolicitud110201: jest.fn(() => of({})),
      getRegistroTomaMuestrasMercanciasData: jest.fn(() => of({})),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent, MockSolicitanteComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Solocitud110201Service, useValue: registroServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA], 
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    solicitanteComponentMock = TestBed.createComponent(MockSolicitanteComponent).componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar con el índice de pestaña por defecto en 1', () => {
    expect(component.indice).toBe(1);
  });
  

  it('debe llamar a obtenerTipoPersona con MORAL_NACIONAL después de ngAfterViewInit', () => {
    jest.useFakeTimers();
    const obtenerTipoPersonaSpy = jest.spyOn(solicitanteComponentMock, 'obtenerTipoPersona');
    component.solicitante = solicitanteComponentMock as any;
    component.ngAfterViewInit();
    jest.runAllTimers();
    expect(obtenerTipoPersonaSpy).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
  });


  it('debe actualizar el índice cuando se llama seleccionaTab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should call actualizarEstadoFormulario and set esDatosRespuesta in guardarDatosFormularios', () => {
    component.esDatosRespuesta = false;
    const idSolicitud = '202917465'; 
    component.guardarDatosFormulario(idSolicitud);
    expect(registroServiceMock.getMostrarSolicitud).toHaveBeenCalledWith(idSolicitud);
  });

  it('debe limpiar destroyNotifier$ al destruir el componente', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
  
    it('should run #validateAll()', async () => {
    component.certificadoOrigen = component.certificadoOrigen || {};
    component.certificadoOrigen.validateAll = jest.fn();
    component.datosCertificadoComponent = component.datosCertificadoComponent || {};
    component.datosCertificadoComponent.validateAll = jest.fn();
    component.destinatarioDe = component.destinatarioDe || {};
    component.destinatarioDe.validateAll = jest.fn();
    component.validateAll();
  });

  describe('guardarDatosFormulario', () => {
    it('should call actualizarEstadoFormulario with mapped data and set esDatosRespuesta to true when resp.datos is array', () => {
      const idSolicitud = '202917465';
      const datosArray = [{ foo: 'bar' }];
      const mappedData = { mapped: true };
      registroServiceMock.getMostrarSolicitud = jest.fn(() => of({ datos: datosArray }));
      registroServiceMock.reverseBuildSolicitud110201 = jest.fn(() => mappedData);
      registroServiceMock.actualizarEstadoFormulario = jest.fn();

      component.esDatosRespuesta = true;
      component.guardarDatosFormulario(idSolicitud);

      expect(registroServiceMock.reverseBuildSolicitud110201).toHaveBeenCalledWith(datosArray[0]);
      expect(registroServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith(mappedData);
      expect(component.esDatosRespuesta).toBe(true);
    });

    it('should call actualizarEstadoFormulario with mapped data and set esDatosRespuesta to true when resp.datos is object', () => {
      const idSolicitud = '456';
      const datosObj = { foo: 'baz' };
      const mappedData = { mapped: 'yes' };
      registroServiceMock.getMostrarSolicitud = jest.fn(() => of({ datos: datosObj }));
      registroServiceMock.reverseBuildSolicitud110201 = jest.fn(() => mappedData);
      registroServiceMock.actualizarEstadoFormulario = jest.fn();

      component.esDatosRespuesta = false;
      component.guardarDatosFormulario(idSolicitud);

      expect(registroServiceMock.reverseBuildSolicitud110201).toHaveBeenCalledWith(datosObj);
      expect(registroServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith(mappedData);
      expect(component.esDatosRespuesta).toBe(true);
    });

    it('should not call actualizarEstadoFormulario if resp.datos is falsy', () => {
      const idSolicitud = '789';
      registroServiceMock.getMostrarSolicitud = jest.fn(() => of({ datos: null }));
      registroServiceMock.reverseBuildSolicitud110201 = jest.fn();
      registroServiceMock.actualizarEstadoFormulario = jest.fn();

      component.esDatosRespuesta = false;
      component.guardarDatosFormulario(idSolicitud);

      expect(registroServiceMock.reverseBuildSolicitud110201).not.toHaveBeenCalled();
      expect(registroServiceMock.actualizarEstadoFormulario).not.toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(false);
    });
  });
});
