import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RenunciaDeDerechosComponent } from './renuncia-de-derechos.component';
import { Tramite140218Store } from '../../estados/store/tramite140218.store';
import { Tramite140218Query } from '../../estados/query/tramite140218.query';
import { of } from 'rxjs';
import { DatosSolicitudState } from '../../estados/store/tramite140218.store';

// Mock the renuncia JSON import
jest.mock('@libs/shared/theme/assets/json/140218/renuncia.json', () => ({
  default: {
    formData: {
      folioTramite: "1701300200120251701000001",
      tipoSolicitud: "Inicial",
      regimen: "Definitivos",
      clasificacionRegimen: "De exportación",
      periodoVigencia: "Largo Plazo",
      unidadMedida: "Metro Cúbico",
      fraccionArancelaria: "27090099",
      cantidadAutorizada: "100.00",
      valorAutorizado: "100",
      nico: "00",
      descripcionNico: "Los demás",
      acotacion: "Únicamente: Aceites crudos de petróleo",
      permisoDesde: "08/03/2025",
      permisoHasty: "08/03/2030"
    }
  }
}));

describe('RenunciaDeDerechosComponent', () => {
  let component: RenunciaDeDerechosComponent;
  let fixture: ComponentFixture<RenunciaDeDerechosComponent>;
  let tramite140218Store: Tramite140218Store;
  let tramite140218Query: Tramite140218Query;

  beforeEach(async () => {
    tramite140218Store = new Tramite140218Store();
    tramite140218Query = new Tramite140218Query(tramite140218Store);

    // Create spy for the store update method
    jest.spyOn(tramite140218Store, 'update').mockImplementation(() => {});

    const mockDatosSolicitudState: DatosSolicitudState = {
      folioTramite: '12345',
      tipoSolicitud: 'Type A',
      regimen: 'Regimen X',
      clasificacionRegimen: 'Class Y',
      periodoVigencia: '2025',
      unidadMedida: 'Units',
      fraccionArancelaria: 'Fraction Z',
      cantidadAutorizada: "100",
      valorAutorizado: "2000",
      nico: 'NICO',
      descripcionNico: 'Desc',
      acotacion: 'Acotacion data',
      permisoDesde: '2025-01-01',
      permisoHasty: '2025-12-31',
      motivoRenuncia: ''
    };

    tramite140218Query.selectSolicitud$ = of(mockDatosSolicitudState);

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, FormsModule,RenunciaDeDerechosComponent],
      declarations: [],
      providers: [
        { provide: Tramite140218Store, useValue: tramite140218Store },
        { provide: Tramite140218Query, useValue: tramite140218Query }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RenunciaDeDerechosComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with correct default values', () => {
    component.ngOnInit();

    expect(component.renunciaDerechosForm.get('folioTramite')?.value).toEqual('1701300200120251701000001');
    expect(component.renunciaDerechosForm.get('tipoSolicitud')?.value).toEqual('Inicial');
    expect(component.renunciaDerechosForm.get('permisoHasty')?.value).toEqual('08/03/2030');
    expect(component.renunciaDerechosForm.get('cantidadAutorizada')?.value).toEqual('100.00');
  });

  it('should disable certain form fields', () => {
    component.ngOnInit();

    expect(component.renunciaDerechosForm.get('folioTramite')?.disabled).toBe(true);
    expect(component.renunciaDerechosForm.get('tipoSolicitud')?.disabled).toBe(true);
    expect(component.renunciaDerechosForm.get('permisoHasty')?.disabled).toBe(true);
  });

  it('should update store with form data', () => {
    component.ngOnInit();
    component.updateStoreWithFormData();

    expect(tramite140218Store.update).toHaveBeenCalledWith(expect.objectContaining({
      folioTramite: '1701300200120251701000001',
      tipoSolicitud: 'Inicial',
      permisoHasty: '08/03/2030',
      cantidadAutorizada: '100.00'
    }));
  });
});
