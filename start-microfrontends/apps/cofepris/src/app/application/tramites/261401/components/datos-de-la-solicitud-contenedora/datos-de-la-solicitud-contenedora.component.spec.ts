import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosDeLaSolicitudContenedoraComponent } from './datos-de-la-solicitud-contenedora.component';

describe('DatosDeLaSolicitudContenedoraComponent', () => {
  let component: DatosDeLaSolicitudContenedoraComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudContenedoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosDeLaSolicitudContenedoraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
