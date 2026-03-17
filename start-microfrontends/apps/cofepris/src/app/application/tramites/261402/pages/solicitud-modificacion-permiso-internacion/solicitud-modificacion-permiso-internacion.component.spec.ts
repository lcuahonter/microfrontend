import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudModificacionPermisoInternacionComponent } from './solicitud-modificacion-permiso-internacion.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SolicitudModificacionPermisoInternacionComponent', () => {
  let component: SolicitudModificacionPermisoInternacionComponent;
  let fixture: ComponentFixture<SolicitudModificacionPermisoInternacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudModificacionPermisoInternacionComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(
      SolicitudModificacionPermisoInternacionComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
