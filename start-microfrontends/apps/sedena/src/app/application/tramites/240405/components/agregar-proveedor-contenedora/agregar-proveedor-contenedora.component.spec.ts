import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarProveedorContenedoraComponent } from './agregar-proveedor-contenedora.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('AgregarProveedorContenedoraComponent', () => {
  let component: AgregarProveedorContenedoraComponent;
  let fixture: ComponentFixture<AgregarProveedorContenedoraComponent>;

  beforeEach(async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    await TestBed.configureTestingModule({
      imports: [AgregarProveedorContenedoraComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            data: of({}),
          },
        },
        {
          provide: DatosSolicitudService,
          useValue: {
            obtenerFraccionesCatalogo: jest.fn().mockReturnValue(of([])),
            obtenerUMCCatalogo: jest.fn().mockReturnValue(of([])),
            obtenerMonedaCatalogo: jest.fn().mockReturnValue(of([])),
            obtenerListaPaises: jest.fn().mockReturnValue(of([])), // ✅ Add this missing method
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarProveedorContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
