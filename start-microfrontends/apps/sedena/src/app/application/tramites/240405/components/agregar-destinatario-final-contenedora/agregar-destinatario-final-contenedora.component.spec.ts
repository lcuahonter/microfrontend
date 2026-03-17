import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarDestinatarioFinalContenedoraComponent } from './agregar-destinatario-final-contenedora.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

describe('DatosMercanciaContenedoraComponent', () => {
  let component: AgregarDestinatarioFinalContenedoraComponent;
  let fixture: ComponentFixture<AgregarDestinatarioFinalContenedoraComponent>;

  beforeEach(async () => {
  await TestBed.configureTestingModule({
  imports: [AgregarDestinatarioFinalContenedoraComponent],
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
        obtenerListaCodigosPostales: jest.fn().mockReturnValue(of([])),
        obtenerListaPaises: jest.fn().mockReturnValue(of([])),
        obtenerListaEstados: jest.fn().mockReturnValue(of([])),
        obtenerListaMunicipios: jest.fn().mockReturnValue(of([])),
        obtenerListaLocalidades: jest.fn().mockReturnValue(of([])),
        obtenerListaColonias: jest.fn().mockReturnValue(of([])),
      },
    },
  ],
  schemas: [NO_ERRORS_SCHEMA],
}).compileComponents();


    fixture = TestBed.createComponent(AgregarDestinatarioFinalContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
