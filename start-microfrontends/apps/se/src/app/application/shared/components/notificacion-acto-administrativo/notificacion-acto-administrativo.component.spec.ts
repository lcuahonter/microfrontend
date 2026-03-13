import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacionActoAdministrativoComponent } from './notificacion-acto-administrativo.component';

describe('NotificacionActoAdministrativoComponent', () => {
  let component: NotificacionActoAdministrativoComponent;
  let fixture: ComponentFixture<NotificacionActoAdministrativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionActoAdministrativoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacionActoAdministrativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
