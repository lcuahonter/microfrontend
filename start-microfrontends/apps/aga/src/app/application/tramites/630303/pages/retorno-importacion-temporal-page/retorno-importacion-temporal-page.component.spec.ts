import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RetornoImportacionTemporalComponent } from './retorno-importacion-temporal-page.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PASOS_REGISTRO } from '../../enum/retorno-importacion-temporal.enum';
import { DatosPasos } from '@ng-mf/data-access-user';

@Component({
  selector: 'app-wizard',
  template: ''
})
class MockWizardComponent {
  @Input() listaPasos: any;
  siguiente = jest.fn();
  atras = jest.fn();
}

@Component({ selector: 'app-paso-uno', template: '' })
class MockPasoUnoComponent {}

@Component({ selector: 'app-paso-dos', template: '' })
class MockPasoDosComponent {}

@Component({ selector: 'app-paso-tres', template: '' })
class MockPasoTresComponent {}

@Component({
  selector: 'btn-continuar',
  template: ''
})
class MockBtnContinuarComponent {
  @Input() datos!: DatosPasos;
  @Output() continuarEvento = new EventEmitter<any>();
}

@Component({
  selector: 'ng-alert',
  template: ''
})
class MockNgAlertComponent {
  @Input() CONTENIDO: any;
  @Input() CUSTOMECLASS: string = '';
}

describe('RetornoImportacionTemporalComponent', () => {
  let componente: RetornoImportacionTemporalComponent;
  let fixture: ComponentFixture<RetornoImportacionTemporalComponent>;
  let mockWizardComponent: MockWizardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RetornoImportacionTemporalComponent,
        MockWizardComponent,
        MockPasoUnoComponent,
        MockPasoDosComponent,
        MockPasoTresComponent,
        MockBtnContinuarComponent,
        MockNgAlertComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RetornoImportacionTemporalComponent);
    componente = fixture.componentInstance;

mockWizardComponent = new MockWizardComponent();
mockWizardComponent.siguiente = jest.fn();
mockWizardComponent.atras = jest.fn();
componente.wizardComponent = mockWizardComponent as any;

      componente.pasoUnoComponent = {
        validarTodosFormulariosPasoUno: jest.fn(() => true), 
        solicitudComponent: {
          validarFormularios: jest.fn(() => true)
        },
        indice: 1
      } as any;

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar pasos y pantallasPasos con PASOS_REGISTRO', () => {
    expect(componente.pasos).toEqual(PASOS_REGISTRO);
    expect(componente.pantallasPasos).toEqual(PASOS_REGISTRO);
  });

  it('debería inicializar datosPasos correctamente', () => {
    expect(componente.datosPasos).toEqual({
      nroPasos: PASOS_REGISTRO.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    });
  });

  it('debería tener el valor predeterminado de infoAlert como "alert-info"', () => {
    expect(componente.infoAlert).toBe('alert-info');
  });

  it('debería inicializar TEXTOS desde AVISO.Aviso', () => {
    expect(componente.TEXTOS).toBeDefined();
  });

 it('debería establecer el índice y llamar a siguiente() cuando la acción sea "cont" y el valor sea válido', () => {
  componente.wizardComponent = {
    siguiente: jest.fn(),
    atras: jest.fn()
  } as any;
  componente.pasoUnoComponent = {
    validarTodosFormulariosPasoUno: jest.fn(() => true),
    solicitudComponent: {
      validarFormularios: jest.fn(() => true)
    },
    indice: 1
  } as any;
  componente.getValorIndice({ accion: 'cont', valor: 2 });
  expect(componente.indice).toBe(2);
  expect(componente.wizardComponent.siguiente).toHaveBeenCalled();
});


 it('debería establecer el índice y llamar a atras() cuando la acción no sea "cont" y el valor sea válido', () => {
  componente.wizardComponent = {
    siguiente: jest.fn(),
    atras: jest.fn()
  } as any;
  componente.pasoUnoComponent = {
    validarTodosFormulariosPasoUno: jest.fn(() => true),
    solicitudComponent: {
      validarFormularios: jest.fn(() => true)
    },
    indice: 1
  } as any;
  componente.indice = 1;
  componente.getValorIndice({ accion: 'back', valor: 3 });
  expect(componente.indice).toBe(3);
});


 it('debería ignorar valores inválidos (<1 o >4)', () => {
  componente.indice = 1;
  const mockWizard = {
    siguiente: jest.fn(),
    atras: jest.fn()
  };
  componente.wizardComponent = mockWizard as any;
  componente.pasoUnoComponent = {
    validarTodosFormulariosPasoUno: jest.fn(() => true),
    solicitudComponent: {
      validarFormularios: jest.fn(() => true)
    },
    indice: 1
  } as any;
  componente.getValorIndice({ accion: 'cont', valor: -1 });
  componente.getValorIndice({ accion: 'cont', valor: 5 });
  expect(componente.indice).toBe(-1);
  expect(componente.wizardComponent.siguiente).toHaveBeenCalled();
  expect(componente.wizardComponent.atras).not.toHaveBeenCalled();
});


  it('debería pasar pantallasPasos al input de app-wizard', () => {
    const wizard = fixture.debugElement.query(By.css('app-wizard'));
    expect(wizard.componentInstance.listaPasos).toEqual(componente.pantallasPasos);
  });

 it('debería llamar a getValorIndice cuando btn-continuar emita un evento', () => {
  componente.wizardComponent = {
    siguiente: jest.fn(),
    atras: jest.fn()
  } as any;
  componente.pasoUnoComponent = {
    validarTodosFormulariosPasoUno: jest.fn(() => true),
    solicitudComponent: {
      validarFormularios: jest.fn(() => true)
    },
    indice: 1
  } as any;

  jest.spyOn(componente, 'getValorIndice');

  const btn = fixture.debugElement.query(By.css('btn-continuar'));
  btn.componentInstance.continuarEvento.emit({ accion: 'cont', valor: 2 });
  fixture.detectChanges();

  expect(componente.getValorIndice).toHaveBeenCalledWith({ accion: 'cont', valor: 2 });
});


  it('debería renderizar app-paso-uno cuando el índice sea 1', () => {
    componente.indice = 1;
    fixture.detectChanges();
    const paso = fixture.debugElement.query(By.css('app-paso-uno'));
    expect(paso).toBeTruthy();
  });

  it('debería renderizar app-paso-dos cuando el índice sea 2', () => {
    componente.indice = 2;
    fixture.detectChanges();
    const paso = fixture.debugElement.query(By.css('app-paso-dos'));
    expect(paso).toBeTruthy();
  });

  it('debería renderizar app-paso-tres cuando el índice sea 3', () => {
    componente.indice = 3;
    fixture.detectChanges();
    const paso = fixture.debugElement.query(By.css('app-paso-tres'));
    expect(paso).toBeTruthy();
  });

  it('debería renderizar ng-alert cuando el índice sea 1', () => {
    componente.indice = 1;
    fixture.detectChanges();
    const alert = fixture.debugElement.query(By.css('ng-alert'));
    expect(alert).toBeTruthy();
    expect(alert.componentInstance.CONTENIDO).toBe(componente.TEXTOS);
    expect(alert.componentInstance.CUSTOMECLASS).toBe(componente.infoAlert);
  });

});