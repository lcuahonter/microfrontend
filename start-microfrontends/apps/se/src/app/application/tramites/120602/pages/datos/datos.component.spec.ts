import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PASOS_REGISTRO } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatosEmpresaService } from '../../services/datos-empresa.service';
import { Tramite120602Store } from '../../estados/tramite-120602.store';
import { Tramite120602Query } from '../../estados/tramite-120602.query';
import { of } from 'rxjs';
import { BtnContinuarComponent, PasoCargaDocumentoComponent } from '@ng-mf/data-access-user';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule } from 'ngx-toastr'; 

@Component({
  selector: 'app-wizard',
  template: ''
})
class WizardStubComponent {
  @Input() listaPasos: any;
  siguiente = jest.fn();
  atras = jest.fn();
}

/**
 * Stub for PasoUno, PasoDos, PasoTres
 */
@Component({ selector: 'app-paso-uno', template: '' })
class PasoUnoStub {}
@Component({ selector: 'app-paso-dos', template: '' })
class PasoDosStub {}
@Component({ selector: 'app-paso-tres', template: '' })
class PasoTresStub {}

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let mockService: any;
  let mockStore: any;
  let mockQuery: any;

  beforeEach(async () => {
    mockService = {
      getAllState: jest.fn(() => of({})),
      guardarDatosPost: jest.fn(() => of({ datos: { id_solicitud: 123 } })),
      buildDatosEmpresa: jest.fn(() => ({})),
    };

    mockStore = {
      setIdSolicitud: jest.fn(),
    };

    mockQuery = {
      selectSolicitud$: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BtnContinuarComponent, PasoFirmaComponent, PasoCargaDocumentoComponent, ToastrModule.forRoot()],
      declarations: [
        DatosComponent,
        WizardStubComponent,
        PasoUnoStub,
        PasoDosStub,
        PasoTresStub
      ],
      providers: [
        { provide: DatosEmpresaService, useValue: mockService },
        { provide: Tramite120602Store, useValue: mockStore },
        { provide: Tramite120602Query, useValue: mockQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

it('should render the title', () => {
  const h1 = fixture.nativeElement.querySelector('h1');
  expect(h1).toBeTruthy(); // Ensure the <h1> element exists
  expect(h1.textContent).toContain('Solicitud empresa de la frontera persona física.'); // Verify the content
});

  it('should render the wizard with the correct steps', () => {
    const wizard = fixture.debugElement.query(By.directive(WizardStubComponent));
    expect(wizard).toBeTruthy();
    expect(wizard.componentInstance.listaPasos).toEqual(PASOS_REGISTRO);
  });

  it('should render app-paso-uno when indice is 1', () => {
    component.indice = 1;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(PasoUnoStub))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(PasoDosStub))).toBeFalsy();
    expect(fixture.debugElement.query(By.directive(PasoTresStub))).toBeFalsy();
  });

it('should render app-paso-carga-documento when indice is 2', () => {
  component.indice = 2;
  fixture.detectChanges();
  const pasoCargaDocumento = fixture.debugElement.query(By.css('app-paso-carga-documento'));
  expect(pasoCargaDocumento).toBeTruthy(); // Ensure the component is rendered
});

it('should render paso-firma when indice is 3', () => {
  component.indice = 3;
  fixture.detectChanges();
  const pasoFirma = fixture.debugElement.query(By.css('paso-firma'));
  expect(pasoFirma).toBeTruthy(); // Ensure the component is rendered
});

  it('should call wizardComponent.atras() when getValorIndice is called with accion "ant"', () => {
    const wizard = TestBed.createComponent(WizardStubComponent).componentInstance as any;
    component.wizardComponent = wizard;
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({ accion: 'ant', valor: 2 });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not change indice or call wizard methods if valor is out of range', () => {
    const wizard = TestBed.createComponent(WizardStubComponent).componentInstance as any;
    component.wizardComponent = wizard;
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.indice = 1;
    component.getValorIndice({ accion: 'cont', valor: 0 });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    component.getValorIndice({ accion: 'ant', valor: 5 });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});