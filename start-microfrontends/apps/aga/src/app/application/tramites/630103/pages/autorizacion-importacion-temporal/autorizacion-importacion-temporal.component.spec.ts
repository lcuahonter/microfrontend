import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutorizacionImportacionTemporalComponent } from './autorizacion-importacion-temporal.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
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

describe('AutorizacionImportacionTemporalComponent', () => {
  let component: AutorizacionImportacionTemporalComponent;
  let fixture: ComponentFixture<AutorizacionImportacionTemporalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AutorizacionImportacionTemporalComponent,
        MockWizardComponent,
        MockPasoUnoComponent,
        MockPasoDosComponent,
        MockPasoTresComponent,
        MockBtnContinuarComponent,
        MockNgAlertComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AutorizacionImportacionTemporalComponent);
    component = fixture.componentInstance;

    
    const wizardDebugEl = fixture.debugElement.query(By.directive(MockWizardComponent));
    component.wizardComponent = wizardDebugEl?.componentInstance;

    fixture.detectChanges();
  });

  

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default infoAlert value as "alert-info"', () => {
    expect(component.infoAlert).toBe('alert-info');
  });

  it('should have TEXTOS initialized from AVISO.Aviso', () => {
    expect(component.TEXTOS).toBeDefined();
  });


  it('should set indice and call siguiente() when accion is "cont" and valor is valid', () => {
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should set indice and call atras() when accion is not "cont" and valor is valid', () => {
    component.getValorIndice({ accion: 'back', valor: 3 });
    expect(component.indice).toBe(3);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should ignore invalid valor (<1 or >4)', () => {
    const initial = component.indice;
    component.getValorIndice({ accion: 'cont', valor: -1 });
    component.getValorIndice({ accion: 'cont', valor: 5 });
    expect(component.indice).toBe(initial);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });


  it('should pass pantallasPasos to app-wizard input', () => {
    const wizard = fixture.debugElement.query(By.css('app-wizard'));
    expect(wizard.componentInstance.listaPasos).toEqual(component.pantallasPasos);
  });

  it('should call getValorIndice when btn-continuar emits', () => {
    jest.spyOn(component, 'getValorIndice');
    const btn = fixture.debugElement.query(By.css('btn-continuar'));
    btn.componentInstance.continuarEvento.emit({ accion: 'cont', valor: 2 });
    fixture.detectChanges();
    expect(component.getValorIndice).toHaveBeenCalledWith({ accion: 'cont', valor: 2 });
  });


  it('should render app-paso-uno when indice is 1', () => {
    component.indice = 1;
    fixture.detectChanges();
    const paso = fixture.debugElement.query(By.css('app-paso-uno'));
    expect(paso).toBeTruthy();
  });

  it('should render app-paso-dos when indice is 2', () => {
    component.indice = 2;
    fixture.detectChanges();
    const paso = fixture.debugElement.query(By.css('app-paso-dos'));
    expect(paso).toBeTruthy();
  });

  it('should render app-paso-tres when indice is 3', () => {
    component.indice = 3;
    fixture.detectChanges();
    const paso = fixture.debugElement.query(By.css('app-paso-tres'));
    expect(paso).toBeTruthy();
  });

  it('should render ng-alert when indice is 1', () => {
    component.indice = 1;
    fixture.detectChanges();
    const alert = fixture.debugElement.query(By.css('ng-alert'));
    expect(alert).toBeTruthy();
    expect(alert.componentInstance.CONTENIDO).toBe(component.TEXTOS);
    expect(alert.componentInstance.CUSTOMECLASS).toBe(component.infoAlert);
  });

  it('should NOT render ng-alert when indice is not 1', () => {
    component.indice = 2;
    fixture.detectChanges();
    const alert = fixture.debugElement.query(By.css('ng-alert'));
    expect(alert).toBeFalsy();
  });
});
