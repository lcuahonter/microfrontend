import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionPageComponent } from './notificacion-page.component';

describe('NotificacionPageComponent', () => {
  let component: NotificacionPageComponent;
  let fixture: ComponentFixture<NotificacionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificacionPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificacionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});