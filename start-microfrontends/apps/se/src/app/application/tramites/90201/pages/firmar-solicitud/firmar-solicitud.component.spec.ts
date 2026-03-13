import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirmarSolicitudComponent } from './firmar-solicitud.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FirmarSolicitudComponent', () => {
  let component: FirmarSolicitudComponent;
  let fixture: ComponentFixture<FirmarSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirmarSolicitudComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // No schemas needed for this component
    }).compileComponents();

    fixture = TestBed.createComponent(FirmarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
