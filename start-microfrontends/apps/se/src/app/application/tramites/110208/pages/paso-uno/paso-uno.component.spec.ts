import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { Component, Input } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Solocitud110208Service } from '../../services/service110208.service';
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
      getRegistroTomaMuestrasMercanciasData: jest.fn(() => of({})),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent, MockSolicitanteComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Solocitud110208Service, useValue: registroServiceMock },
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
    const idSolicitud = 'test-id';
    component.guardarDatosFormulario(idSolicitud);
    expect(component.esDatosRespuesta).toBe(true);
    expect(registroServiceMock.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('debe limpiar destroyNotifier$ al destruir el componente', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
