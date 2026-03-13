import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmarNotificacionComponent } from './confirmar-notificacion.component';

describe('ConfirmarNotificacionComponent', () => {
  let component: ConfirmarNotificacionComponent;
  let fixture: ComponentFixture<ConfirmarNotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarNotificacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmarNotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
