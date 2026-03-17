import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermisoDeRetiroComponent } from './permiso-de-retiro.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';

// Mock WizardComponent
@Component({
  selector: 'app-wizard',
  template: '',
  standalone: true
})
class MockWizardComponent {
  @Input() listaPasos: any;
  siguiente = jest.fn();
  atras = jest.fn();
}

// Mock BtnContinuarComponent
@Component({
  selector: 'btn-continuar',
  template: '',
  standalone: true
})
class MockBtnContinuarComponent {
  @Input() datos: any;
  @Output() continuarEvento = new EventEmitter<any>();
}

// Mock Paso Components
@Component({ selector: 'app-paso-uno', template: '', standalone: true })
class MockPasoUnoComponent {}
@Component({ selector: 'app-paso-dos', template: '', standalone: true })
class MockPasoDosComponent {}
@Component({ selector: 'app-paso-tres', template: '', standalone: true })
class MockPasoTresComponent {}
@Component({ selector: 'app-paso-cuatro', template: '', standalone: true })
class MockPasoCuatroComponent {}

describe('PermisoDeRetiroComponent', () => {
  let component: PermisoDeRetiroComponent;
  let fixture: ComponentFixture<PermisoDeRetiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PermisoDeRetiroComponent,
        MockWizardComponent,
        MockBtnContinuarComponent,
        MockPasoUnoComponent,
        MockPasoDosComponent,
        MockPasoTresComponent,
        MockPasoCuatroComponent
      ]
    }).overrideComponent(PermisoDeRetiroComponent, {
      set: {
        imports: [
          MockWizardComponent,
          MockBtnContinuarComponent,
          MockPasoUnoComponent,
          MockPasoDosComponent,
          MockPasoTresComponent,
          MockPasoCuatroComponent
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(PermisoDeRetiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have indice initialized to 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should render wizard and btn-continuar', () => {
    const wizard = fixture.debugElement.query(By.css('app-wizard'));
    const btn = fixture.debugElement.query(By.css('btn-continuar'));
    expect(wizard).toBeTruthy();
    expect(btn).toBeTruthy();
  });

  it('should render app-paso-uno when indice is 1', () => {
    component.indice = 1;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-paso-uno'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('app-paso-dos'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('app-paso-tres'))).toBeFalsy();
  });

  it('should render app-paso-dos when indice is 2', () => {
    component.indice = 2;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-paso-uno'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('app-paso-dos'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('app-paso-tres'))).toBeFalsy();
  });

  it('should render app-paso-tres when indice is 3', () => {
    component.indice = 3;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-paso-uno'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('app-paso-dos'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('app-paso-tres'))).toBeTruthy();
  });

  it('should call wizardComponent.siguiente when getValorIndice is called with accion "cont"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as any;
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should call wizardComponent.atras when getValorIndice is called with accion not "cont"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as any;
    component.getValorIndice({ accion: 'atras', valor: 2 });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not change indice or call wizard methods if valor is out of range', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as any;
    component.indice = 1;
    component.getValorIndice({ accion: 'cont', valor: 0 });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    component.getValorIndice({ accion: 'cont', valor: 5 });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });
});