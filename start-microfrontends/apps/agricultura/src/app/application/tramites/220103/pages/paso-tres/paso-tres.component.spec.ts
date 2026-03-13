import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';

// Mock del componente firma-electronica
@Component({
  selector: 'firma-electronica',
  template: '<button (click)="simulateFirma()">Simular Firma</button>',
  standalone: true
})
class MockFirmaElectronicaComponent {
  @Input() tipo: string = '';
  @Output() firma = new EventEmitter<string>();

  simulateFirma() {
    this.firma.emit('mock-signature'); // Simula la emisión de una firma válida
  }
}

describe('PasoTresComponent', () => {
  let COMPONENTE: PasoTresComponent;
  let FIXTURE: ComponentFixture<PasoTresComponent>;
  let MOCK_ROUTER: any;

  beforeEach(async () => {
    MOCK_ROUTER = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [MockFirmaElectronicaComponent],
      declarations: [PasoTresComponent],
      providers: [
        { provide: Router, useValue: MOCK_ROUTER }
      ]
    }).compileComponents();

    FIXTURE = TestBed.createComponent(PasoTresComponent);
    COMPONENTE = FIXTURE.componentInstance;
    FIXTURE.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(COMPONENTE).toBeTruthy();
  });

  it('debería llamar a obtieneFirma cuando se emita firma desde firma-electronica', () => {
    // Simula manualmente el evento firma
    const FIRMA_COMPONENT = FIXTURE.debugElement.query(By.directive(MockFirmaElectronicaComponent)).componentInstance;

    // Emite una firma válida
    FIRMA_COMPONENT.simulateFirma();

    // Verifica que el router navegue después del evento
    expect(MOCK_ROUTER.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('NO debería llamar a navigate si firma es una cadena vacía', () => {
    // Llama manualmente a obtieneFirma con una cadena vacía para probar el caso donde firma no es válida
    COMPONENTE.obtieneFirma('');
    expect(MOCK_ROUTER.navigate).not.toHaveBeenCalled();
  });

  it('debería renderizar el componente firma-electronica', () => {
    const FIRMA_ELEMENT = FIXTURE.debugElement.query(By.directive(MockFirmaElectronicaComponent));
    expect(FIRMA_ELEMENT).toBeTruthy();
  });
});