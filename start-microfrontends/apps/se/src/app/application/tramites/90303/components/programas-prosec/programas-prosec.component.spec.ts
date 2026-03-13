import { TestBed } from '@angular/core/testing';
import { ProgramasProsecComponent } from './programas-prosec.component';
import { CatalogosService } from '../../service/catalogos.service';
import { Tramite90303Store } from '../../state/Tramite90303.store';
import { LoginQuery } from '@libs/shared/data-access-user/src';
import { ActivatedRoute, Router } from '@angular/router';
import { IniciarTramiteService } from '@libs/shared/data-access-user/src/core/services/shared/resolver/iniciar-tramite.service';
import { of, Subject } from 'rxjs';
import { ProgramaLista } from '../../../../shared/models/lista-programa.model';
import { TICPSE, DISCRIMINATOR_VALUE } from '../../constantes/constantes90303.enum';

describe('ProgramasProsecComponent', () => {
  let component: ProgramasProsecComponent;

  let catalogosService: jest.Mocked<CatalogosService>;
  let tramiteStore: jest.Mocked<Tramite90303Store>;
  let loginQuery: Partial<LoginQuery>;
  let router: jest.Mocked<Router>;
  let iniciarTramiteService: jest.Mocked<IniciarTramiteService>;

  const loginState$ = new Subject<any>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramasProsecComponent],
      providers: [
        {
          provide: CatalogosService,
          useValue: {
            obtenerListaProgramas: jest.fn()
          }
        },
        {
          provide: Tramite90303Store,
          useValue: {
            setLoginRfc: jest.fn(),
            setSelectedTipoPrograma: jest.fn(),
            setProgramaListaDatos: jest.fn(),
            setSelectedFolioPrograma: jest.fn(),
            setSelectedIdPrograma: jest.fn(),
            setTipoPrograma: jest.fn()
          }
        },
        {
          provide: LoginQuery,
          useValue: {
            selectLoginState$: loginState$.asObservable()
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {}
        },
        {
          provide: IniciarTramiteService,
          useValue: {
            setTramiteDatos: jest.fn()
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ProgramasProsecComponent);
    component = fixture.componentInstance;

    catalogosService = TestBed.inject(
      CatalogosService
    ) as jest.Mocked<CatalogosService>;

    tramiteStore = TestBed.inject(
      Tramite90303Store
    ) as jest.Mocked<Tramite90303Store>;

    router = TestBed.inject(Router) as jest.Mocked<Router>;
    iniciarTramiteService = TestBed.inject(
      IniciarTramiteService
    ) as jest.Mocked<IniciarTramiteService>;
  });

  afterEach(() => {
    loginState$.complete();
  });

  it('should set login RFC from LoginQuery and store it', () => {
    loginState$.next({ rfc: 'AAA010101AAA' });

    expect(tramiteStore.setLoginRfc).toHaveBeenCalledWith('AAL0409235E6');
  });

  it('should call obtenerListaProgramas on init', () => {
    const spy = jest.spyOn(component, 'obtenerListaProgramas').mockImplementation(() => {});

    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });

  it('should determine tipoPrograma and fetch program list', () => {
    const responseMock = {
      datos: [
        {
          tipoPrograma: 'PROSEC',
          idProgramaCompuesto: '1',
          idProgramaAutorizado: '100',
          rfc: 'AAA010101AAA',
          folioPrograma: 'FOLIO-1'
        }
      ],
      mensaje: ''
    };

    catalogosService.obtenerListaProgramas.mockReturnValue(of(responseMock));

    component['loginRfc'] = 'AAA010101AAA';
    component.obtenerListaProgramas();

    expect(tramiteStore.setSelectedTipoPrograma).toHaveBeenCalled();
    expect(catalogosService.obtenerListaProgramas).toHaveBeenCalled();
    expect(tramiteStore.setProgramaListaDatos).toHaveBeenCalledWith([
      {
        tipoPrograma: 'PROSEC',
        idProgramaCompuesto: '1',
        idProgramaAutorizado: '100',
        rfc: 'AAA010101AAA',
        folioPrograma: 'FOLIO-1'
      }
    ]);
  });

  it('should update selected program, set tramite data and navigate', () => {
    const event: ProgramaLista = {
      tipoPrograma: 'PROSEC',
      idProgramaCompuesto: '1',
      idProgramaAutorizado: '200',
      rfc: 'AAA010101AAA',
      folioPrograma: 'FOLIO-200'
    };

    component.programaListaSeleccionado(event);

    expect(iniciarTramiteService.setTramiteDatos).toHaveBeenCalledWith({
      folio_programa: 'FOLIO-200',
      id_programa_autorizado: '200'
    });

    expect(router.navigate).toHaveBeenCalledWith(
      ['../solicitud'],
      expect.any(Object)
    );
  });

  it('should update store with selected program info', () => {
    const event: ProgramaLista = {
      tipoPrograma: 'IMMEX',
      idProgramaCompuesto: '2',
      idProgramaAutorizado: '300',
      rfc: 'AAA010101AAA',
      folioPrograma: 'FOLIO-300'
    };

    component.actualizarSeleccionadaPrograma(event);

    expect(tramiteStore.setSelectedFolioPrograma).toHaveBeenCalledWith(
      'FOLIO-300'
    );
    expect(tramiteStore.setSelectedIdPrograma).toHaveBeenCalledWith('300');
    expect(tramiteStore.setTipoPrograma).toHaveBeenCalledWith('IMMEX');
  });

  it('should complete destroyNotifier$ on destroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});