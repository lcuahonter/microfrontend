import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirmarSolicitudComponent } from './firmar-solicitud.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FirmarSolicitudComponent', () => {
  let component: FirmarSolicitudComponent;
  let fixture: ComponentFixture<FirmarSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FirmarSolicitudComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(FirmarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });
});