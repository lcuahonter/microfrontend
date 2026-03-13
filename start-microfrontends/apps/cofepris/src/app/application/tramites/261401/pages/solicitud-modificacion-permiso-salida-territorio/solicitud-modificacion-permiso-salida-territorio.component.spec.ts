import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudModificacionPermisoSalidaTerritorioComponent } from './solicitud-modificacion-permiso-salida-territorio.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SolicitudModificacionPermisoSalidaTerritorioComponent', () => {
  let component: SolicitudModificacionPermisoSalidaTerritorioComponent;
  let fixture: ComponentFixture<SolicitudModificacionPermisoSalidaTerritorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudModificacionPermisoSalidaTerritorioComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(
      SolicitudModificacionPermisoSalidaTerritorioComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
