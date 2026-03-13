import { By } from '@angular/platform-browser';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { DatosDelTramiteARealizarComponent } from './datos-del-tramite-a-realizar.component';
import { ControlContainer, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';
import { Solicitud220502Store } from '../../estados/tramites220502.store';
import { Solicitud220502Query } from '../../estados/tramites220502.query';
import { of } from 'rxjs';
@Component({
  selector: 'app-test-host',
  template: `<form [formGroup]="form">
               <app-datos-del-tramite-a-realizar [claveDeControl]="'testControl'" [grupoFormularioPadre]="form"></app-datos-del-tramite-a-realizar>
             </form>`
})
class TestHostComponent {
  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      testControl: new FormGroup({
        certificadosAutorizados: new FormControl(null, Validators.required),
        horaDeInspeccion: new FormControl(null, Validators.required),
        aduanaDeIngreso: new FormControl(null),
        sanidadAgropecuaria: new FormControl(null),
        puntoDeInspeccion: new FormControl(null),
        fechaDeInspeccion: new FormControl(null)
      })
    });
  }
}

describe('DatosDelTramiteARealizarComponent', () => {
  let component: DatosDelTramiteARealizarComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let mockSolicitud220502Store: any;

  beforeEach(async () => {
    
    const mockSolicitudService = {
      getDataDatosDelTramite: jest.fn(()=> of())
    } as Partial<SolicitudPantallasService>;

    mockSolicitud220502Store = {
      setFechaDeInspeccion: jest.fn(()=> of()),
      setCertificadosAutorizados: jest.fn(()=> of()),
      setHoraDeInspeccion: jest.fn(()=> of()),
      setAduanaDeIngreso: jest.fn(()=> of()),
      setSanidadAgropecuaria: jest.fn(()=> of()),
      setPuntoDeInspeccion: jest.fn(()=> of())
    } as any;

    const mockSolicitud220502Query = {
      selectSolicitud$: of({})
    };

    const mockCdRef = {
      detectChanges: jest.fn(()=> of())
    } as any;

    const parentFormGroup = new FormGroup({});
    const mockControlContainer = {
      control: parentFormGroup
    } as unknown as ControlContainer;

    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [ReactiveFormsModule, DatosDelTramiteARealizarComponent, TituloComponent, HttpClientTestingModule,CatalogoSelectComponent, InputFechaComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: SolicitudPantallasService, useValue: mockSolicitudService },
        { provide: Solicitud220502Store, useValue: mockSolicitud220502Store },
        { provide: Solicitud220502Query, useValue: mockSolicitud220502Query },
        { provide: ChangeDetectorRef, useValue: mockCdRef },
        { provide: ControlContainer, useValue: mockControlContainer }
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    component = fixture.debugElement.children[0].componentInstance;
    component = fixture.debugElement.query(By.directive(DatosDelTramiteARealizarComponent))?.componentInstance;
  
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls on ngOnInit', () => {
    component.ngOnInit();
    const FORMGROUP = component.grupoFormularioPadre.get(component.claveDeControl) as FormGroup;
    expect(FORMGROUP).toBeTruthy();
    expect(FORMGROUP.get('certificadosAutorizados')).toBeTruthy();
    expect(FORMGROUP.get('horaDeInspeccion')).toBeTruthy();
    expect(FORMGROUP.get('aduanaDeIngreso')).toBeTruthy();
    expect(FORMGROUP.get('sanidadAgropecuaria')).toBeTruthy();
    expect(FORMGROUP.get('puntoDeInspeccion')).toBeTruthy();
    expect(FORMGROUP.get('fechaDeInspeccion')).toBeTruthy();
  });

  it('should remove control on ngOnDestroy', () => {
    component.ngOnInit();
    expect(component.grupoFormularioPadre.contains(component.claveDeControl)).toBe(true);
    component.ngOnDestroy();
    expect(component.grupoFormularioPadre.contains(component.claveDeControl)).toBe(false);
  });

  it('should handle certificadosSeleccion correctly', () => {
    component.ngOnInit();
    const CATALOGO: Catalogo = { id: 1, descripcion: 'Certificado de Exportación' };
    component.certificadosSeleccion(CATALOGO);
    const FORMGROUP = component.grupoFormularioPadre.get(component.claveDeControl) as FormGroup;
    expect(FORMGROUP.get('certificadosAutorizados')?.value).toBe('Certificado de Exportación');
  });

  it('should handle horaDeSeleccion correctly', () => {
    component.ngOnInit();
    const CATALOGO: Catalogo = { id: 1, descripcion: '08:00 AM - 10:00 AM' };
    component.horaDeSeleccion(CATALOGO);
    const FORMGROUP = component.grupoFormularioPadre.get(component.claveDeControl) as FormGroup;
    expect(FORMGROUP.get('horaDeInspeccion')?.value).toBe('08:00 AM - 10:00 AM');
  });

  it('should handle aduanaDeSeleccion correctly', () => {
    component.ngOnInit();
    const CATALOGO: Catalogo = { id: 1, descripcion: 'Aduana La Aurora' };
    component.aduanaDeSeleccion(CATALOGO);
    const FORMGROUP = component.grupoFormularioPadre.get(component.claveDeControl) as FormGroup;
    expect(FORMGROUP.get('aduanaDeIngreso')?.value).toBe('Aduana La Aurora');
  });

  it('should handle sanidadSeleccion correctly', () => {
    component.ngOnInit();
    const CATALOGO: Catalogo = { id: 1, descripcion: 'Oficina Central de Sanidad' };
    component.sanidadSeleccion(CATALOGO);
    const FORMGROUP = component.grupoFormularioPadre.get(component.claveDeControl) as FormGroup;
    expect(FORMGROUP.get('sanidadAgropecuaria')?.value).toBe('Oficina Central de Sanidad');
  });

  it('should handle puntoDeSeleccion correctly', () => {
    component.ngOnInit();
    const CATALOGO: Catalogo = { id: 1, descripcion: 'Punto de Inspección Aérea' };
    component.puntoDeSeleccion(CATALOGO);
    const FORMGROUP = component.grupoFormularioPadre.get(component.claveDeControl) as FormGroup;
    expect(FORMGROUP.get('puntoDeInspeccion')?.value).toBe('Punto de Inspección Aérea');
  });

  it('should set catalogos selects and call detectChanges', () => {
      const data = {
        pendientesCertificados: [{ id: 1, descripcion: 'Cert1' }],
        horaInspeccion: [{ id: 2, descripcion: 'Hora1' }],
        aduanaIngreso: [{ id: 3, descripcion: 'Aduana1' }],
        sanidadAgropecuaria: [{ id: 4, descripcion: 'Sanidad1' }],
        puntoInspeccion: [{ id: 5, descripcion: 'Punto1' }]
      } as any;
      component.actualizarDatosIniciales(data);
      expect(component.certificadosAutorizados.catalogos).toEqual(data.pendientesCertificados);
      expect(component.horaDeInspeccion.catalogos).toEqual(data.horaInspeccion);
      expect(component.aduanaDeIngreso.catalogos).toEqual(data.aduanaIngreso);
      expect(component.sanidadAgropecuaria.catalogos).toEqual(data.sanidadAgropecuaria);
      expect(component.puntoDeInspeccion.catalogos).toEqual(data.puntoInspeccion);
      // expect(mockCdRef.detectChanges).toHaveBeenCalled();
    });

    it('setCertificadosAutorizados should call store', () => {
      component.setCertificadosAutorizados({ id: 123 } as any);
      expect(mockSolicitud220502Store.setCertificadosAutorizados).toHaveBeenCalledWith(123);
    });
    it('setHoraDeInspeccion should call store', () => {
      component.setHoraDeInspeccion({ id: 456 } as any);
      expect(mockSolicitud220502Store.setHoraDeInspeccion).toHaveBeenCalledWith(456);
    });
    it('setAduanaDeIngreso should call store', () => {
      component.setAduanaDeIngreso({ id: 789 } as any);
      expect(mockSolicitud220502Store.setAduanaDeIngreso).toHaveBeenCalledWith(789);
    });
    it('setSanidadAgropecuaria should call store', () => {
      component.setSanidadAgropecuaria({ id: 321 } as any);
      expect(mockSolicitud220502Store.setSanidadAgropecuaria).toHaveBeenCalledWith(321);
    });
    it('setPuntoDeInspeccion should call store', () => {
      component.setPuntoDeInspeccion({ id: 654 } as any);
      expect(mockSolicitud220502Store.setPuntoDeInspeccion).toHaveBeenCalledWith(654);
    });
});
