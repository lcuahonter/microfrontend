import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitanteComponent } from './solicitante.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Tramite32505Query } from '../../../../estados/queries/tramite32505.query';
import { Tramite32505Store } from '../../../../estados/tramites/trimite32505.store';
import { AvisoService } from '../../services/aviso.service';

describe('SolicitanteComponent', () => {
  let component: SolicitanteComponent;
  let fixture: ComponentFixture<SolicitanteComponent>;
  let tramiteQueryMock: any;
  let tramiteStoreMock: any;
  let avisoServiceMock: any;

  beforeEach(async () => {
    tramiteQueryMock = {
      selectSolicitud$: of({
        datosSolicitante: {
          rfc: 'ABC123456789',
          denominacion: 'Empresa S.A.',
          actividadEconomica: 'Comercio',
          correoElectronico: 'empresa@example.com',
          pais: 'México',
          codigoPostal: '12345',
          entidadFederativa: 'Ciudad de México',
          municipio: 'Benito Juárez',
          localidad: 'Del Valle',
          colonia: 'Colonia 1',
          calle: 'Calle 1',
          nExt: '123',
          nInt: '456',
          lada: '55',
          telefono: '12345678',
          adace: 'ADACE 1',
        },
      }),
    };

    tramiteStoreMock = {
      setDatosSolicitante: jest.fn(),
    };

    avisoServiceMock = {
      obtenerDatosSolicitante: jest.fn().mockReturnValue(
        of({
          rfc: 'ABC123456789',
          denominacion: 'Empresa S.A.',
          actividadEconomica: 'Comercio',
          correoElectronico: 'empresa@example.com',
          pais: 'México',
          codigoPostal: '12345',
          entidadFederativa: 'Ciudad de México',
          municipio: 'Benito Juárez',
          localidad: 'Del Valle',
          colonia: 'Colonia 1',
          calle: 'Calle 1',
          nExt: '123',
          nInt: '456',
          lada: '55',
          telefono: '12345678',
          adace: 'ADACE 1',
        })
      ),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, SolicitanteComponent],
      declarations: [],
      providers: [
        { provide: Tramite32505Query, useValue: tramiteQueryMock },
        { provide: Tramite32505Store, useValue: tramiteStoreMock },
        { provide: AvisoService, useValue: avisoServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tramiteState on ngOnInit', () => {
    component.ngOnInit();
    expect(component.tramiteState).toEqual({
      datosSolicitante: {
        rfc: 'ABC123456789',
        denominacion: 'Empresa S.A.',
        actividadEconomica: 'Comercio',
        correoElectronico: 'empresa@example.com',
        pais: 'México',
        codigoPostal: '12345',
        entidadFederativa: 'Ciudad de México',
        municipio: 'Benito Juárez',
        localidad: 'Del Valle',
        colonia: 'Colonia 1',
        calle: 'Calle 1',
        nExt: '123',
        nInt: '456',
        lada: '55',
        telefono: '12345678',
        adace: 'ADACE 1',
      },
    });
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.solicitudForm).toBeDefined();
    expect(component.solicitudForm.get('rfc')?.value).toBe('ABC123456789');
    expect(component.solicitudForm.get('denominacion')?.value).toBe('Empresa S.A.');
    expect(component.solicitudForm.get('actividadEconomica')?.value).toBe('Comercio');
    expect(component.solicitudForm.get('correoElectronico')?.value).toBe('empresa@example.com');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});