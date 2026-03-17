import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { TercerosRelacionadosVistaComponent } from './terceros-relacionados-vista.component';
import { Tramite260603Query } from '../../estados/tramite260603Query.query';
import { Tramite260603Store } from '../../estados/tramite260603Store.store';
import { Facturador } from '../../../../shared/models/terceros-relacionados.model';
import { TercerosRelacionadosComponent } from '../../../../shared/components/shared2606/terceros-relacionados/terceros-relacionados.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('TercerosRelacionadosVistaComponent', () => {
  let component: TercerosRelacionadosVistaComponent;
  let fixture: ComponentFixture<TercerosRelacionadosVistaComponent>;

  let queryMock: jest.Mocked<Tramite260603Query>;
  let storeMock: jest.Mocked<Tramite260603Store>;

  const facturadoresMock: Facturador[] = [
    {
        rfc: 'AAA010101AAA',
        nombres: 'Facturador 1',
        nombreRazonSocial: 'Empresa 1',
        curp: 'CURP010101AAA',
        telefono: '5555555555',
        correoElectronico: 'facturador1@empresa.com',
        pais: 'México',
        codigoPostal: '03100',
        tipoPersona: 'Física',
        id: 1,
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        colonia: '',
        municipioAlcaldia: '',
        localidad: '',
        entidadFederativa: '',
        estadoLocalidad: '',
        coloniaEquivalente: ''
    }
  ];

  beforeEach(async () => {
    queryMock = {
      getFacturadorTablaDatos$: of(facturadoresMock)
    } as unknown as jest.Mocked<Tramite260603Query>;

    storeMock = {
      updateFacturadorTablaDatos: jest.fn()
    } as unknown as jest.Mocked<Tramite260603Store>;

    await TestBed.configureTestingModule({
      imports: [
        TercerosRelacionadosVistaComponent,
        HttpClientModule
      ],
      providers: [
        { provide: Tramite260603Query, useValue: queryMock },
        { provide: Tramite260603Store, useValue: storeMock },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosVistaComponent);
    component = fixture.componentInstance;
  });

  it('should load facturador data from query on init', () => {
    component.ngOnInit();

    expect(component.facturadorDatos).toEqual(facturadoresMock);
  });

  it('should update facturadorDatos when facturadorEventoModificar is called', () => {
    const evento: Facturador[] = [
      {
        rfc: 'BBB020202BBB',
        nombres: 'Facturador 2',
        nombreRazonSocial: 'Empresa 2',
        curp: 'CURP020202BBB',
        telefono: '5555555556',
        correoElectronico: 'facturador2@empresa.com',
        pais: 'México',
        codigoPostal: '03200',
        tipoPersona: 'Física',
        id: 2,
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        colonia: '',
        municipioAlcaldia: '',
        localidad: '',
        entidadFederativa: '',
        estadoLocalidad: '',
        coloniaEquivalente: ''
      }
    ];

    component.facturadorEventoModificar(evento);

    expect(component.facturadorDatos).toEqual(evento);
  });

  it('should call store to update facturadores', () => {
    const nuevosFacturadores: Facturador[] = [
      {
        rfc: 'CCC030303CCC',
        nombres: 'Facturador 3',
        nombreRazonSocial: 'Empresa 3',
        curp: 'CURP030303CCC',
        telefono: '5555555557',
        correoElectronico: 'facturador3@empresa.com',
        pais: 'México',
        codigoPostal: '03300',
        tipoPersona: 'Física',
        id: 3,
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        colonia: '',
        municipioAlcaldia: '',
        localidad: '',
        entidadFederativa: '',
        estadoLocalidad: '',
        coloniaEquivalente: ''
      }
    ];

    component.addFacturadores(nuevosFacturadores);

    expect(storeMock.updateFacturadorTablaDatos)
      .toHaveBeenCalledWith(nuevosFacturadores);
  });

  it('should return true when child component validation returns true', () => {
    component.TercerosRelacionadosComponent = {
      formularioSolicitudValidacion: jest.fn().mockReturnValue(true)
    } as unknown as TercerosRelacionadosComponent;

    const result = component.validarContenedor();

    expect(result).toBe(true);
  });

  it('should return false when child component is undefined', () => {
    component.TercerosRelacionadosComponent = undefined as any;

    const result = component.validarContenedor();

    expect(result).toBe(false);
  });
  
  it('should complete destroy$ on destroy', () => {
    const nextSpy = jest.spyOn(
      (component as any).destroy$,
      'next'
    );
    const completeSpy = jest.spyOn(
      (component as any).destroy$,
      'complete'
    );

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});