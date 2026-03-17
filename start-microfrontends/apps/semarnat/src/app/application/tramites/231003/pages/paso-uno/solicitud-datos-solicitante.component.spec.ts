import { PasoUnoT231003Component } from './paso-uno-t231003.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('SolicitudDatosSolicitanteComponent', () => {
  let component: PasoUnoT231003Component;
  let fixture: ComponentFixture<PasoUnoT231003Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoUnoT231003Component],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoT231003Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
