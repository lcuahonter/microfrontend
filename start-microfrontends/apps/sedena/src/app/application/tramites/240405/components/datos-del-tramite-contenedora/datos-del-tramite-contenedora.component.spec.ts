import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelTramiteContenedoraComponent } from './datos-del-tramite-contenedora.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

describe('DatosDelTramiteContenedoraComponent', () => {
  let component: DatosDelTramiteContenedoraComponent;
  let fixture: ComponentFixture<DatosDelTramiteContenedoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosDelTramiteContenedoraComponent],
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
    obtenerBancos: jest.fn().mockReturnValue(of([])),
  },
}

            ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelTramiteContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
