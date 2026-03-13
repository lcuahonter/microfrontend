import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Subject } from 'rxjs';

import { AlertComponent } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { ContribuyenteRespuesta } from '../../models/donaciones-extranjeras.model';
import { DatosDelFabricanteComponent } from './datos-del-fabricante.component';
import { DonacionesExtranjerasService } from '../../services/donaciones-extranjeras/donaciones-extranjeras.service';
import { ToastrService, TOAST_CONFIG } from 'ngx-toastr';

const MOCK_PAISES: Catalogo[] = [
  { id: 1, descripcion: 'País 1' },
  { id: 2, descripcion: 'País 2' }
];

const MOCK_CONTRIBUYENTE_RESPUESTA: ContribuyenteRespuesta = {
  data: [{
    rfc: 'XAXX010101000',
    razonSocial: 'Empresa Ejemplo',
    nombre: 'Nombre Ejemplo',
    apellidoPaterno: 'Apellido Paterno',
    apellidoMaterno: 'Apellido Materno',
    calle: 'Calle Ejemplo',
    numeroExterior: '123',
    numeroInterior: '456',
    estado: 'Estado Ejemplo',
    colonia: 'Colonia Ejemplo',
    codigoPostal: '12345',
    pais: 'País Ejemplo',
    correoElectronico: 'ejemplo@correo.com',
    telefono: '1234567890'
  }]
};

describe('DatosDelFabricanteComponent', () => {
  let component: DatosDelFabricanteComponent;
  let fixture: ComponentFixture<DatosDelFabricanteComponent>;
  let service: DonacionesExtranjerasService;
  let mockToastr: any;

  beforeEach(waitForAsync(() => {
    mockToastr = {
      error: jest.fn(),
      success: jest.fn(),
      info: jest.fn(),
      warning: jest.fn()
    };

    TestBed.configureTestingModule({
      declarations: [DatosDelFabricanteComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        CatalogoSelectComponent,
        AlertComponent
      ],
      providers: [
        DonacionesExtranjerasService,
        { provide: ToastrService, useValue: mockToastr },
        {
          provide: TOAST_CONFIG,
          useValue: {
            iconClasses: {
              error: 'toast-error',
              info: 'toast-info',
              success: 'toast-success',
              warning: 'toast-warning'
            },
            positionClass: 'toast-top-right',
            preventDuplicates: true
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosDelFabricanteComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(DonacionesExtranjerasService);
    
    (component as any).destruirNotificador$ = new Subject();

    component.datosDelFabricanteForm = new FormBuilder().group({
      rfcFabricante: [''],
      nombreFabricante: [''],
      calleFabricante: [''],
      numExteriorFabricante: [''],
      numInteriorFabricante: [''],
      cvePaisFabricante: [''],
      codigoPostalFabricante: [''],
      estadoFabricante: [''],
      coloniaFabricante: [''],
      correoElectronicoFabricante: [''],
      telefonoFabricante: ['']
    });
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize the catalogos on ngOnInit', () => {
    const spy = jest.spyOn(service, 'getPaises').mockReturnValue(of({ code: 200, data: MOCK_PAISES, message: 'Success' }));
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should initialize catalogos', () => {
    jest.spyOn(service, 'getPaises').mockReturnValue(of({ code: 200, data: MOCK_PAISES, message: 'Success' }));
    component.inicializaCatalogos();
    expect(component.pais).toEqual(MOCK_PAISES);
  });

  it('should search contribuyente by RFC', () => {
    jest.spyOn(service, 'buscarContribuyente').mockReturnValue(of(MOCK_CONTRIBUYENTE_RESPUESTA));
    component.buscarContribuyenteRfc(6, 'XAXX010101000');
    expect(component.datosDelFabricanteForm.get('nombreFabricante')?.value).toEqual('Nombre Ejemplo Apellido Paterno Apellido Materno');
  });

  it('should process the fabricante data', () => {
    const contribuyente = MOCK_CONTRIBUYENTE_RESPUESTA.data[0];
    component.fabricante(contribuyente, true);
    expect(component.datosDelFabricanteForm.get('nombreFabricante')?.value).toEqual('Nombre Ejemplo Apellido Paterno Apellido Materno');
    expect(component.datosDelFabricanteForm.get('calleFabricante')?.value).toEqual('Calle Ejemplo');
  });

  it('should reset the form', () => {
    component.restablecerFormulario();
    expect(component.datosDelFabricanteForm.get('rfcFabricante')?.value).toBeNull();
    expect(component.datosDelFabricanteForm.get('nombreFabricante')?.value).toBeNull();
  });

  it('should set valores in store', () => {
    const spy = jest.spyOn(component['tramite10303Store'], 'setCvePaisFabricante');
    component.setValoresStore(component.datosDelFabricanteForm, 'cvePaisFabricante', 'setCvePaisFabricante');
    expect(spy).toHaveBeenCalled();
  });

  it('should destroy subscriptions on ngOnDestroy', () => {
    const spyNext = jest.spyOn((component as any).destruirNotificador$, 'next');
    const spyComplete = jest.spyOn((component as any).destruirNotificador$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});