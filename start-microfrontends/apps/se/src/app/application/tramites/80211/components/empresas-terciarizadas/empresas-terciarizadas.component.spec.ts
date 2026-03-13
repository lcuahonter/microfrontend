import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpresasTerciarizadasComponent } from './empresas-terciarizadas.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Tramite80211Store } from '../../estados/tramites80211.store';
import { Tramite80211Query } from '../../estados/tramites80211.query';
import { registroSolicitudImmexService } from '../../services/registro-solicitud-immex.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { Plantas } from '../../modelos/registro-solicitud-immex.model';

describe('EmpresasTerciarizadasComponent', () => {
  let componente: EmpresasTerciarizadasComponent;
  let fixture: ComponentFixture<EmpresasTerciarizadasComponent>;
  let tramite80211StoreMock: Partial<Tramite80211Store>;
  let tramite80211QueryMock: Partial<Tramite80211Query>;
  let registroSolicitudServiceMock: Partial<registroSolicitudImmexService>;
  let DATOS_MOCK: Plantas[];
  beforeEach(async () => {
    tramite80211StoreMock = {
      establecerDatos: jest.fn(),
    };

    tramite80211QueryMock = {
      selectTramite80211$: of({
        plantasDisponibles: [],
        plantasSeleccionadas: [],
        showPlantas: false,
      }),
    };
    DATOS_MOCK = [
      {
        id: 1,
        calle: '',
        numeroExterio: '',
        numeroInterio: '',
        codiogoPostal: '',
        colonia: '',
        municipio: '',
        entidadFederativa: '',
        pais: '',
        registroFederal: '',
        domicilio: '',
        razon: '',
      },
      {
        id: 2,
        calle: '',
        numeroExterio: '',
        numeroInterio: '',
        codiogoPostal: '',
        colonia: '',
        municipio: '',
        entidadFederativa: '',
        pais: '',
        registroFederal: '',
        domicilio: '',
        razon: '',
      },
    ];

    registroSolicitudServiceMock = {
      obtenerEstados: jest.fn(),
      obtenerFormularioDatos: jest
        .fn()
        .mockReturnValue(of({ modalidad: 'A', folio: '123', ano: '2025' })),
      obtenerPlantasDatos: jest
        .fn()
        .mockReturnValue(of({ datos: [{ id: 1, nombre: 'Planta 1' }] })),
    };

    await TestBed.configureTestingModule({
      declarations: [EmpresasTerciarizadasComponent],
      imports: [ReactiveFormsModule, CatalogoSelectComponent],
      providers: [
        FormBuilder,
        { provide: Tramite80211Store, useValue: tramite80211StoreMock },
        { provide: Tramite80211Query, useValue: tramite80211QueryMock },
        {
          provide: registroSolicitudImmexService,
          useValue: registroSolicitudServiceMock,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresasTerciarizadasComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el formulario reactivo', () => {
    expect(componente.empresasForm).toBeDefined();
    expect(componente.empresasForm.get('rfc')).toBeDefined();
    expect(componente.empresasForm.get('estado')).toBeDefined();
  });

  it('debería actualizar el formulario con los datos proporcionados', () => {
    const DATOS = { modalidad: 'A', folio: '123', ano: '2025' };
    componente.actualizarFormulario(DATOS);
    expect(componente.empresasForm.get('modalidad')?.value).toBe('A');
    expect(componente.empresasForm.get('folio')?.value).toBe('123');
    expect(componente.empresasForm.get('ano')?.value).toBe('2025');
  });

  describe('buscarControladoras', () => {
    it('no debería hacer cambios cuando el formulario es inválido', () => {
      // Setup con formulario inválido (sin RFC y estado)
      componente.empresasForm.patchValue({
        modalidad: 'A',
        folio: '123',
        ano: '2025',
      });

      const initialShowPlantas = componente.showPlantas;
      componente.buscarControladoras();

      // Verificar que no hubo cambios
      expect(componente.showPlantas).toBe(initialShowPlantas);
      expect(tramite80211StoreMock.establecerDatos).not.toHaveBeenCalled();
    });

    it('debería mantener el orden correcto de las operaciones', () => {
      // Setup
      componente.empresasForm.patchValue({
        modalidad: 'A',
        folio: '123',
        ano: '2025',
        rfc: 'XAXX010101000',
        estado: '1',
      });

      const calls: string[] = [];

      // Mock establecerDatos para registrar el orden de las llamadas
      (tramite80211StoreMock.establecerDatos as jest.Mock).mockImplementation(
        (data) => {
          if (data.plantasDisponibles !== undefined) {
            calls.push('plantasDisponibles');
          }
          if (data.showPlantas !== undefined) {
            calls.push('showPlantas');
          }
        }
      );

      // Espiar segregatePlantasDatos
      jest.spyOn(componente, 'segregatePlantasDatos').mockImplementation(() => {
        calls.push('segregatePlantasDatos');
      });

      componente.buscarControladoras();

      // Verificar el orden correcto
      expect(calls).toEqual([
        'plantasDisponibles',
        'segregatePlantasDatos',
        'showPlantas',
      ]);
    });
  });

  it('debería segregar plantas disponibles y seleccionadas', () => {
    componente.tramites80211State = {
      plantasDisponibles: [DATOS_MOCK[0]],
      plantasSeleccionadas: [DATOS_MOCK[1]],
      showPlantas: true,
    };
    componente.segregatePlantasDatos();
    expect(componente.plantasDisponibles).toEqual([DATOS_MOCK[0]]);
    expect(componente.plantasSeleccionadas).toEqual([DATOS_MOCK[1]]);
  });

  it('debería agregar plantas NO seleccionadas a plantasSeleccionadas', () => {
    componente.plantasDisponibles = [DATOS_MOCK[0], DATOS_MOCK[1]];
    componente.listaFilaDisponibles = [DATOS_MOCK[0]];
    componente.plantasSeleccionadas = [];

    componente.agregarPlantas();

    expect(componente.plantasSeleccionadas).toEqual([DATOS_MOCK[1]]);
    expect(componente.plantasDisponibles).toEqual([DATOS_MOCK[0]]);

    expect(tramite80211StoreMock.establecerDatos).toHaveBeenCalledWith({
      plantasDisponibles: [DATOS_MOCK[0]],
      plantasSeleccionadas: [DATOS_MOCK[1]],
    });
  });

  it('debería eliminar plantas seleccionadas y moverlas a disponibles', () => {
    componente.listaFilaSeleccionada = [DATOS_MOCK[1]];
    componente.plantasSeleccionadas = [...DATOS_MOCK];
    componente.plantasDisponibles = [];
    componente.eliminarPlantas();

    expect(componente.plantasSeleccionadas).toEqual([DATOS_MOCK[0]]);
    expect(componente.plantasDisponibles).toEqual([DATOS_MOCK[1]]);

    expect(tramite80211StoreMock.establecerDatos).toHaveBeenCalledWith({
      plantasDisponibles: [DATOS_MOCK[1]],
      plantasSeleccionadas: [DATOS_MOCK[0]],
    });
  });

  it('debería limpiar los observables al destruir el componente', () => {
    const DESTROY_SPY = jest.spyOn(componente.destoryNotification$, 'next');
    componente.ngOnDestroy();
    expect(DESTROY_SPY).toHaveBeenCalled();
  });
});
