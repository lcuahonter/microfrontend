import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PasoUnoComponent } from './paso-uno.component';
import {
  PERSONA_MORAL_NACIONAL,
  DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL,
  TIPO_PERSONA,
  SolicitanteComponent
} from '@ng-mf/data-access-user';
import { HttpClientModule } from '@angular/common/http';
import { DuplicadoDeCertificadoComponent } from '../duplicado-de-certificado/duplicado-de-certificado.component';

@Component({
  selector: 'solicitante',
  template: ''
})
class MockSolicitanteComponent {
  OBTENER_TIPO_PERSONA = jest.fn();

}

describe('PasoUnoComponent', () => {
  let COMPONENT: PasoUnoComponent;
  let FIXTURE: ComponentFixture<PasoUnoComponent>;
  let MOCK_SOLICITANTE: MockSolicitanteComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent, MockSolicitanteComponent, DuplicadoDeCertificadoComponent],
      imports: [HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    FIXTURE = TestBed.createComponent(PasoUnoComponent);
    COMPONENT = FIXTURE.componentInstance;

    // Consultar y asignar manualmente el mock del hijo antes de la detección de cambios
    FIXTURE.detectChanges(); // Renderizar DOM

    const SOLICITANTE_DEBUG_EL = FIXTURE.debugElement.query(
      By.directive(MockSolicitanteComponent)
    );
    MOCK_SOLICITANTE = SOLICITANTE_DEBUG_EL.componentInstance;
    COMPONENT['solicitante'] = MOCK_SOLICITANTE as unknown as SolicitanteComponent;

    MOCK_SOLICITANTE.OBTENER_TIPO_PERSONA(TIPO_PERSONA.MORAL_NACIONAL);
    COMPONENT.ngAfterViewInit();
  });

  it('debe crear el componente', () => {
    expect(COMPONENT).toBeTruthy();
  });

  it('debe llamar obtenerTipoPersona y establecer persona y domicilioFiscal en ngAfterViewInit', () => {
    expect(COMPONENT.persona).toEqual(PERSONA_MORAL_NACIONAL);
    expect(COMPONENT.domicilioFiscal).toEqual(DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL);
    expect(MOCK_SOLICITANTE.OBTENER_TIPO_PERSONA).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
  });

  it('debe actualizar el índice cuando se llama seleccionaTab', () => {
    COMPONENT.seleccionaTab(2);
    expect(COMPONENT.indice).toBe(2);

    COMPONENT.seleccionaTab(0);
    expect(COMPONENT.indice).toBe(0);
  });
});
