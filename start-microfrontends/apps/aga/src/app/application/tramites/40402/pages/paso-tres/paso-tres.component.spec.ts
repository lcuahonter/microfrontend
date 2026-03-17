import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';

// Mock of firma-electronica component
@Component({
  selector: 'firma-electronica',
  template: '<button (click)="simulateFirma()">Simular Firma</button>',
  standalone: true
})
class MockFirmaElectronicaComponent {
  @Input() tipo: string = '';
  @Output() firma = new EventEmitter<string>();

  simulateFirma() {
    this.firma.emit('mock-signature');  // Simulate emitting a valid signature
  }
}

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let mockRouter: any;

  beforeEach(async () => {
    mockRouter = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ MockFirmaElectronicaComponent],
      declarations: [ PasoTresComponent ],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call obtieneFirma when firma is emitted from firma-electronica', () => {
    // Trigger the firma event manually by simulating it
    const firmaComponent = fixture.debugElement.query(By.directive(MockFirmaElectronicaComponent)).componentInstance;
    
    // Emit a valid signature
    firmaComponent.simulateFirma();
    
    // Expect the router to navigate after the event
    expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('should NOT call navigate if firma is an empty string', () => {
    // Manually call obtieneFirma with an empty string to test the case where firma is not valid
    component.obtieneFirma('');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should render firma-electronica component', () => {
    const firmaElement = fixture.debugElement.query(By.directive(MockFirmaElectronicaComponent));
    expect(firmaElement).toBeTruthy();
  });
});
