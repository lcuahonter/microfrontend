import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroPersonaNotificacionesComponent } from './registro-persona-notificaciones.component';
import { provideHttpClient } from '@angular/common/http';

describe('RegistroPersonaNotificacionesComponent', () => {
  let component: RegistroPersonaNotificacionesComponent;
  let fixture: ComponentFixture<RegistroPersonaNotificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroPersonaNotificacionesComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPersonaNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
