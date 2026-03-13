import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChofereAltaDeExtranjerosComponent } from './chofere.alta.de.extranjeros.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { of, Subject, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Chofer40102Query } from '../../../../estados/chofer40102.query';
import { Chofer40102Service } from '../../../../estados/chofer40102.service';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { ChoferesExtranjeros } from '../../../../models/registro-muestras-mercancias.model';
import { Choferesnacionales40102State } from '../../../../estados/chofer40102.store';
import exp from 'constants';

describe('ChofereAltaDeExtranjerosComponent', () => {
  let component: ChofereAltaDeExtranjerosComponent;
  let fixture: ComponentFixture<ChofereAltaDeExtranjerosComponent>;
  let chofer40102QueryMock: jest.Mocked<Chofer40102Query>;
  let chofer40102ServiceMock: jest.Mocked<Chofer40102Service>;
  let consultaioQueryMock: jest.Mocked<ConsultaioQuery>;
  let bsModalServiceMock: jest.Mocked<BsModalService>;
  let mockModalRef: jest.Mocked<BsModalRef>;

  const mockChoferExtranjeroData: ChoferesExtranjeros[] = [
    {
      primerApellido: 'Doe',
      segundoApellido: 'Smith',
      calle: 'Main Street',
      numeroExterior: '123',
      numeroInterior: 'A',
      pais: 'USA',
      estado: 'California',
      paisDeResidencia: 'USA',
      ciudad: 'LA',
      codigoPostal: '90210',
      correoElectronico: 'john@test.com',
      telefono: '5551234567'
    },
    {
      primerApellido: 'Smith',
      segundoApellido: 'Johnson',
      calle: 'Second Street',
      numeroExterior: '456',
      numeroInterior: 'B',
      pais: 'Canada',
      estado: 'Ontario',
      paisDeResidencia: 'Canada',
      ciudad: 'Toronto',
      codigoPostal: 'M5V 3A8',
      correoElectronico: 'jane@test.com',
      telefono: '4161234567'
    }
  ];

  const mockConsultaioState: ConsultaioState = {
    readonly: true,
    update: true,
  } as unknown as ConsultaioState;

  beforeEach(async () => {
    mockModalRef = {
      hide: jest.fn(),
      show: jest.fn(),
      content: {},
      onHide: of(undefined),
      onHidden: of(undefined)
    } as unknown as jest.Mocked<BsModalRef>;

    bsModalServiceMock = {
      show: jest.fn().mockReturnValue(mockModalRef),
      hide: jest.fn(),
      config: {}
    } as unknown as jest.Mocked<BsModalService>;

    chofer40102QueryMock = {
      selectSolicitud$: of({
        datosDelChoferExtranjerosAlta: mockChoferExtranjeroData
      }),
      select: jest.fn()
    } as unknown as jest.Mocked<Chofer40102Query>;

    chofer40102ServiceMock = {
      updateChoferExtranjero: jest.fn(),
      deleteChoferExtranjero: jest.fn(),
      addChoferExtranjero: jest.fn(),
      getData: jest.fn().mockReturnValue(of(mockChoferExtranjeroData)),
      updateDatosDelChoferExtranjero: jest.fn(),
    } as unknown as jest.Mocked<Chofer40102Service>;

    consultaioQueryMock = {
      selectConsultaioState$: of(mockConsultaioState),
      select: jest.fn().mockReturnValue(of(mockConsultaioState))
    } as unknown as jest.Mocked<ConsultaioQuery>;

    await TestBed.configureTestingModule({
      imports: [ChofereAltaDeExtranjerosComponent],
      providers: [
        { provide: BsModalService, useValue: bsModalServiceMock },
        { provide: Chofer40102Query, useValue: chofer40102QueryMock },
        { provide: Chofer40102Service, useValue: chofer40102ServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ChofereAltaDeExtranjerosComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (component && component.ngOnDestroy) {
      component.ngOnDestroy();
    }
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to selectSolicitud$ and set datosDelChoferExtranjeros', () => {
      component.ngOnInit();
      
      expect(component.datosDelChoferExtranjeros).toEqual(mockChoferExtranjeroData);
    });

    it('should not set datosConsulta or isReadonly when readonly is false', () => {
      const nonReadonlyState = { ...mockConsultaioState, readonly: false };
      consultaioQueryMock.selectConsultaioState$ = of(nonReadonlyState);
      
      component.ngOnInit();
      
      expect(component.datosConsulta).toBeUndefined();
      expect(component.isReadonly).toBe(false);
    });

    it('should handle empty datosDelChoferExtranjerosAlta', () => {
      chofer40102QueryMock.selectSolicitud$ = of({
        datosDelChoferExtranjerosAlta: null
      } as unknown as Choferesnacionales40102State);
      
      component.ngOnInit();
      
      expect(component.datosDelChoferExtranjeros).toEqual([]);
    });

    it('should handle undefined datosDelChoferExtranjerosAlta', () => {
      chofer40102QueryMock.selectSolicitud$ = of({
        datosDelChoferExtranjerosAlta: undefined
      } as unknown as Choferesnacionales40102State);
      
      component.ngOnInit();
      
      expect(component.datosDelChoferExtranjeros).toEqual([]);
    });

    it('should handle set selected datosDelChoferExtranjerosSelected on call of onChofereNationalSelected', () => {

      component.onChofereNationalSelected(mockChoferExtranjeroData);
      expect(component.datosDelChoferExtranjerosSelected).toEqual(mockChoferExtranjeroData);
    });

    it('should handle observable errors gracefully', () => {
      chofer40102QueryMock.selectSolicitud$ = throwError(() => new Error('Test error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      expect(() => component.ngOnInit()).not.toThrow();
      
      consoleSpy.mockRestore();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe on destroy', () => {
      const nextSpy = jest.spyOn(component.destroy$, 'next');
      const completeSpy = jest.spyOn(component.destroy$, 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalledWith(true);
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should handle multiple destroy calls', () => {
      const nextSpy = jest.spyOn(component.destroy$, 'next');
      const completeSpy = jest.spyOn(component.destroy$, 'complete');
      
      component.ngOnDestroy();
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalledTimes(2);
      expect(completeSpy).toHaveBeenCalledTimes(2);
    });
  });

    describe('addChoferExtranjero', () => {
      beforeEach(() => {
        component.ngOnInit();
        component.datosDelChoferExtranjeros = [...mockChoferExtranjeroData];
      });

      it('should add new chofer extranjero to the list', () => {
        const newChofer: ChoferesExtranjeros = {
          primerApellido: 'Chofer',
          segundoApellido: 'Test',
          calle: 'New Street',
          numeroExterior: '789',
          numeroInterior: 'C',
          pais: 'Mexico',
          estado: 'CDMX',
          paisDeResidencia: 'Mexico',
          ciudad: 'Mexico City',
          codigoPostal: '01000',
          correoElectronico: 'new@test.com',
          telefono: '5559876543'
        };
        
        const initialLength = component.datosDelChoferExtranjeros.length;
        
        
        component.addModal(newChofer);
        
        expect(component.datosDelChoferExtranjeros.length).toBe(initialLength + 1);
        expect(component.datosDelChoferExtranjeros).toContain(newChofer);
        expect(chofer40102ServiceMock.updateDatosDelChoferExtranjero).toHaveBeenCalledWith(component.datosDelChoferExtranjeros);
      });
          
      it('should add new chofer row and open modal dialog', () => {
        const newChofer: ChoferesExtranjeros = {
          primerApellido: 'Chofer',
          segundoApellido: 'Test',
          calle: 'New Street',
          numeroExterior: '789',
          numeroInterior: 'C',
          pais: 'Mexico',
          estado: 'CDMX',
          paisDeResidencia: 'Mexico',
          ciudad: 'Mexico City',
          codigoPostal: '01000',
          correoElectronico: 'new@test.com',
          telefono: '5559876543'
        };
        
        const initialLength = component.datosDelChoferExtranjeros.length;
        const spy = jest.spyOn(component, 'openModal');
        
        component.addNewRow(newChofer as any);
        
        expect(component.datosChofere).toEqual({});
        expect(spy).toHaveBeenCalled();
      });

      it('should allow editing row by open modal dialog when row is selected', () => {
        const newChofer: ChoferesExtranjeros = {
          primerApellido: 'Chofer',
          segundoApellido: 'Test',
          calle: 'New Street',
          numeroExterior: '789',
          numeroInterior: 'C',
          pais: 'Mexico',
          estado: 'CDMX',
          paisDeResidencia: 'Mexico',
          ciudad: 'Mexico City',
          codigoPostal: '01000',
          correoElectronico: 'new@test.com',
          telefono: '5559876543'
        };
        
        const initialLength = component.datosDelChoferExtranjeros.length;
        const spy = jest.spyOn(component, 'openModal');
        component.datosDelChoferExtranjerosSelected = [newChofer];

        component.editSelectedRow(newChofer as any);
        
        expect(component.datosChofere).toEqual(newChofer);
        expect(spy).toHaveBeenCalled();
      });

      it('should not allow editing row by open modal dialog when row is NOT selected', () => {
        const newChofer: ChoferesExtranjeros = {
          primerApellido: 'Chofer',
          segundoApellido: 'Test',
          calle: 'New Street',
          numeroExterior: '789',
          numeroInterior: 'C',
          pais: 'Mexico',
          estado: 'CDMX',
          paisDeResidencia: 'Mexico',
          ciudad: 'Mexico City',
          codigoPostal: '01000',
          correoElectronico: 'new@test.com',
          telefono: '5559876543'
        };
        
        const initialLength = component.datosDelChoferExtranjeros.length;
        const spy = jest.spyOn(component, 'openModal');

        component.editSelectedRow(newChofer as any);

        expect(component.datosChofere).not.toEqual(newChofer);
        expect(spy).not.toHaveBeenCalled();
      });

      
      it('should delete row when row is selected', () => {
        const newChofer: ChoferesExtranjeros = component.datosDelChoferExtranjeros[0];
        
        const initialLength = component.datosDelChoferExtranjeros.length;
        component.datosDelChoferExtranjerosSelected = [newChofer];

        component.deleteSelectedRow();

        expect(component.datosDelChoferExtranjeros.length).toEqual(initialLength-1);
      });

      it('should not delete row when row is NOT selected', () => {
        const initialLength = component.datosDelChoferExtranjeros.length;
        component.datosDelChoferExtranjerosSelected = [];

        component.deleteSelectedRow();

        expect(component.datosDelChoferExtranjeros.length).toEqual(initialLength);
      });
    });


  describe('Readonly Mode', () => {
    it('should properly set readonly mode when consultaio state indicates readonly', () => {
      const readonlyState = { ...mockConsultaioState, readonly: true };
      consultaioQueryMock.selectConsultaioState$ = of(readonlyState);
      let comp = new ChofereAltaDeExtranjerosComponent(
                        bsModalServiceMock, 
                        chofer40102ServiceMock,
                        chofer40102QueryMock,
                        consultaioQueryMock
      );

      comp.ngOnInit();

      expect(comp.isReadonly).toBe(true);
      expect(comp.datosConsulta?.readonly).toBe(true);
    });

    it('should not set readonly mode when consultaio state indicates not readonly', () => {
      const editableState = { ...mockConsultaioState, readonly: false };
      consultaioQueryMock.selectConsultaioState$ = of(editableState);
      
      component.ngOnInit();
      
      expect(component.isReadonly).toBe(false);
      expect(component.datosConsulta).toBeUndefined();
    });
  });

  describe('Component Properties', () => {
    it('should initialize with default values', () => {
      expect(component.datosDelChoferExtranjeros).toEqual([]);
      expect(component.isReadonly).toBe(false);
      expect(component.destroy$).toBeInstanceOf(Subject);
    });

    it('should handle datosConsulta being undefined', () => {
      expect(component.datosConsulta).toBeUndefined();
    });

    it('should handle modalRef being undefined initially', () => {
      expect(component.modalRef).toBeUndefined();
    });
  });

  describe('Memory Management', () => {
    it('should properly clean up subscriptions', () => {
      const subscription = component.ngOnInit();
      const destroySpy = jest.spyOn(component.destroy$, 'next');
      
      component.ngOnDestroy();
      
      expect(destroySpy).toHaveBeenCalledWith(true);
    });

    it('should handle multiple subscription cleanup calls', () => {
      component.ngOnInit();
      
      const nextSpy = jest.spyOn(component.destroy$, 'next');
      const completeSpy = jest.spyOn(component.destroy$, 'complete');
      
      component.ngOnDestroy();
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalledTimes(2);
      expect(completeSpy).toHaveBeenCalledTimes(2);
    });
  });
});