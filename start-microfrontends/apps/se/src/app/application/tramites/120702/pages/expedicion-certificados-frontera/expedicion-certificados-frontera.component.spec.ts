import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpedicionCertificadosFronteraComponent } from './expedicion-certificados-frontera.component';
import {
  WizardComponent,
  BtnContinuarComponent,
  AlertComponent,
  SolicitanteComponent,
} from '@libs/shared/data-access-user/src';
import { EXPEDICION_CERTIFICADOS_FRONTERA } from '../../constantes/expedicion-certificados-frontera.enum';
import { AVISO } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wizard',
  template: ''
})
class MockWizardComponent {
  @Input() listaPasos: any;
  siguiente = jest.fn();
  atras = jest.fn();
}

describe('ExpedicionCertificadosFronteraComponent', () => {
  let component: ExpedicionCertificadosFronteraComponent;
  let fixture: ComponentFixture<ExpedicionCertificadosFronteraComponent>;
  const siguienteSpy = jest.fn();
  const atrasSpy = jest.fn();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ExpedicionCertificadosFronteraComponent,
        PasoUnoComponent,
        PasoTresComponent,
        MockWizardComponent
      ],
      imports: [
        BtnContinuarComponent,
        AlertComponent,
        CommonModule,
        SolicitanteComponent,
        HttpClientTestingModule
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    fixture = TestBed.createComponent(ExpedicionCertificadosFronteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const wizard = fixture.debugElement.nativeElement.querySelector('app-wizard');
    component.wizardComponent = new MockWizardComponent() as any;
    (component.wizardComponent as any).siguiente = siguienteSpy;
    (component.wizardComponent as any).atras = atrasSpy;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar con los valores predeterminados correctos', () => {
    expect(component.pantallasPasos).toEqual(EXPEDICION_CERTIFICADOS_FRONTERA);
    expect(component.avisoPrivacidadAlert).toBe(AVISO.Aviso);
    expect(component.indice).toBe(1);
    expect(component.datosPasos).toEqual({
      nroPasos: EXPEDICION_CERTIFICADOS_FRONTERA.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    });
  });

  it('debería llamar a wizardComponent.siguiente() cuando se llama a getValorIndice con accion "cont"', () => {
    const mockEvent = { accion: 'cont', valor: 2 };
    component.getValorIndice(mockEvent);

    expect(component.indice).toBe(2);
    expect(siguienteSpy).toHaveBeenCalled();
    expect(atrasSpy).not.toHaveBeenCalled();
  });

  it('debería llamar a wizardComponent.atras() cuando se llama a getValorIndice con accion "ant"', () => {
    const mockEvent = { accion: 'ant', valor: 1 };
    component.getValorIndice(mockEvent);

    expect(component.indice).toBe(1);
    expect(atrasSpy).toHaveBeenCalled();
    expect(siguienteSpy).not.toHaveBeenCalled();
  });

  it('No debería cambiar indice o llamar a los métodos de wizardComponent si valor está fuera de rango', () => {
    const mockEvent = { accion: 'cont', valor: 0 };
    component.getValorIndice(mockEvent);

    expect(component.indice).toBe(1);
    expect(siguienteSpy).not.toHaveBeenCalled();
    expect(atrasSpy).not.toHaveBeenCalled();
  });
});
