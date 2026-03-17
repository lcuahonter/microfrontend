import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Plantas90305Component } from './plantas-90305.component';
import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';
import { of } from 'rxjs';
import { PLANTAS } from '../../models/prosec-modificacion.model';
import { ReactiveFormsModule } from '@angular/forms';
import { TituloComponent, TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';

describe('Plantas90305Component', () => {
  let component: Plantas90305Component;
  let fixture: ComponentFixture<Plantas90305Component>;
  let mockService: jest.Mocked<ProsecModificacionServiceTsService>;

  const MOCK_PLANTAS: PLANTAS[] = [
    {
      calle: 'Av. Reforma',
      numeroExterior: '123',
      numeroInterior: '4A',
      codigoPostal: '01000',
      colonia: 'Centro',
      municipioOAlcaldia: 'Cuauhtémoc',
      entidadFederativa: 'CDMX',
      pais: 'México',
      telefono: '5551234567',
    },
  ];

  beforeEach(async () => {
    mockService = {
      getPlantaComplementaria: jest.fn().mockReturnValue(of(MOCK_PLANTAS)),
    } as unknown as jest.Mocked<ProsecModificacionServiceTsService>;

    await TestBed.configureTestingModule({
      imports: [
        Plantas90305Component,
        CommonModule,
        ReactiveFormsModule,
        TituloComponent,
        TablaDinamicaComponent,
      ],
      providers: [
        { provide: ProsecModificacionServiceTsService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Plantas90305Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar plantas desde el servicio', () => {
    component.loadPlantaComplementaria();
    expect(mockService.getPlantaComplementaria).toHaveBeenCalled();
    expect(component.personaparas).toEqual(MOCK_PLANTAS);
  });

  it('debe tener configuración de columnas correctamente definida', () => {
    const columnas = component.configuracionTabla;
    expect(columnas.length).toBe(9);
    expect(columnas[0].encabezado).toBe('Calle');
    expect(typeof columnas[0].clave).toBe('function');
    const prueba = columnas[0].clave(MOCK_PLANTAS[0]);
    expect(prueba).toBe('Av. Reforma');
  });
});
