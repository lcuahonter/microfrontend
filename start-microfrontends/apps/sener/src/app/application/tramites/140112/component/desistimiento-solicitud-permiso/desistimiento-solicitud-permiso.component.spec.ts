import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesistimientoSolicitudPermisoComponent } from './desistimiento-solicitud-permiso.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

describe('DesistimientoSolicitudPermisoComponent', () => {
  let component: DesistimientoSolicitudPermisoComponent;
  let fixture: ComponentFixture<DesistimientoSolicitudPermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [DesistimientoSolicitudPermisoComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesistimientoSolicitudPermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});