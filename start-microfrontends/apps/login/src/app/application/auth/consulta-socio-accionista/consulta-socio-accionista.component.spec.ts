import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaSocioAccionistaComponent } from './consulta-socio-accionista.component';
import { provideHttpClient } from '@angular/common/http';

describe('ConsultaSocioAccionistaComponent', () => {
  let component: ConsultaSocioAccionistaComponent;
  let fixture: ComponentFixture<ConsultaSocioAccionistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaSocioAccionistaComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaSocioAccionistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
