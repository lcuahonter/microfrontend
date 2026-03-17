import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TercerosRelacionadoesComponent } from './terceros-Relacionados.component';
import { Sanitario260906Store } from '../../../../estados/tramites/sanitario260906.store';
import { SanitarioService } from '../../services/sanitario.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Permiso260906Query } from '../../../../estados/queries/permiso260906.query';
import { of } from 'rxjs';

describe('TercerosRelacionadoesComponent', () => {
  let component: TercerosRelacionadoesComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TercerosRelacionadoesComponent],
      declarations: [],
      providers: [
        { provide: Sanitario260906Store, useValue: { setFabricante: jest.fn(), setDestinatario: jest.fn(), setProveedor: jest.fn(), setFacturador: jest.fn() } },
        { provide: SanitarioService, useValue: { getData: jest.fn(() => of([])) } },
        { provide: ConsultaioQuery, useValue: { selectConsultaioState$: of({ readonly: false }) } },
        { provide: Permiso260906Query, useValue: { selectSolicitud$: of({}) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TercerosRelacionadoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form groups on ngOnInit', () => {
    component.ngOnInit();
    expect(component.agregarFabricanteFormGroup).toBeDefined();
    expect(component.agregarDestinatarioFormGroup).toBeDefined();
    expect(component.agregarProveedorFormGroup).toBeDefined();
    expect(component.agregarFacturadorFormGroup).toBeDefined();
  });

  it('should toggle showTableDiv and showFabricante when toggleDivFabricante is called', () => {
    const initialShowTableDiv = component.showTableDiv;
    const initialShowFabricante = component.showFabricante;

    component.toggleDivFabricante();

    expect(component.showTableDiv).toBe(!initialShowTableDiv);
    expect(component.showFabricante).toBe(!initialShowFabricante);
  });

  it('should toggle showTableDiv and showDestinatario when toggleDivDestinatario is called', () => {
    const initialShowTableDiv = component.showTableDiv;
    const initialShowDestinatario = component.showDestinatario;

    component.toggleDivDestinatario();

    expect(component.showTableDiv).toBe(!initialShowTableDiv);
    expect(component.showDestinatario).toBe(!initialShowDestinatario);
  });

  it('should toggle showTableDiv and showProveedor when toggleDivProveedor is called', () => {
    const initialShowTableDiv = component.showTableDiv;
    const initialShowProveedor = component.showProveedor;

    component.toggleDivProveedor();

    expect(component.showTableDiv).toBe(!initialShowTableDiv);
    expect(component.showProveedor).toBe(!initialShowProveedor);
  });

  it('should toggle showTableDiv and showFacturador when toggleDivFacturador is called', () => {
    const initialShowTableDiv = component.showTableDiv;
    const initialShowFacturador = component.showFacturador;

    component.toggleDivFacturador();

    expect(component.showTableDiv).toBe(!initialShowTableDiv);
    expect(component.showFacturador).toBe(!initialShowFacturador);
  });

  it('should add a new fabricante row and update the store on submitFabricanteForm', () => {
    const store = TestBed.inject(Sanitario260906Store);
    const initialRowCount = component.fabricanteRowData.length;

    component.agregarFabricanteFormGroup.setValue({
      tercerosNacionalidad: 'Nacional',
      tipoPersona: 'Física',
      rfc: 'RFC123456',
      curp: 'CURP123456',
      nombre: 'John',
      primerApellido: 'Doe',
      segundoApellido: 'Smith',
      denominacionRazonSocial: '',
      pais: 'México',
      estadoLocalidad: 'Estado',
      municipioAlcaldia: 'Municipio',
      localidad: '',
      entidadFederativa: 'Entidad',
      codigoPostaloEquivalente: '12345',
      colonia: '',
      coloniaoEquivalente: '',
      calle: 'Calle 123',
      numeroExterior: '456',
      numeroInterior: '',
      lada: '55',
      telefono: '12345678',
      correoElectronico: 'test@example.com',
      extranjeroCodigo: '',
      extranjeroEstado: '',
      extranjeroColonia: '',
    });

    component.submitFabricanteForm();

    expect(component.fabricanteRowData.length).toBe(initialRowCount + 1);
    expect(store.setFabricante).toHaveBeenCalledWith(component.fabricanteRowData);
  });
});