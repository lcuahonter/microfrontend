// @ts-nocheck
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DatosMercanciaContenedoraComponent } from './datos-mercancia-contenedora.component';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { of, BehaviorSubject } from 'rxjs';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

describe('DatosMercanciaContenedoraComponent', () => {
  let component: DatosMercanciaContenedoraComponent;
  let fixture: ComponentFixture<DatosMercanciaContenedoraComponent>;

  const mockReadonly$ = new BehaviorSubject({ readonly: false });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosMercanciaContenedoraComponent],
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
          },
        },
        {
          provide: ConsultaioQuery,
          useValue: {
            selectConsultaioState$: mockReadonly$.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosMercanciaContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update esFormularioSoloLectura from observable', fakeAsync(() => {
    mockReadonly$.next({ readonly: true });

    tick();
    fixture.detectChanges();
  }));
});
