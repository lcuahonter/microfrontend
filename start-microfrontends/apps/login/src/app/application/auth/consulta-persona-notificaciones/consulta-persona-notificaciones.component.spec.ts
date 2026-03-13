import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaPersonaNotificacionesComponent } from './consulta-persona-notificaciones.component';

describe('ConsultaPersonaNotificacionesComponent', () => {
  let component: ConsultaPersonaNotificacionesComponent;
  let fixture: ComponentFixture<ConsultaPersonaNotificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaPersonaNotificacionesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaPersonaNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
