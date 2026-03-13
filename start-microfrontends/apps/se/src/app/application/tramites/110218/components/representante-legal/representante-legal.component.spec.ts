import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepresentanteLegalComponent } from './representante-legal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Tramite110218Store } from '../../estados/tramites/tramite110218.store';
import { Tramite110218Query } from '../../estados/queries/tramite110218.query';
import { CertificadoTecnicoJaponService } from '../../service/certificadoTecnicoJapon.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RepresentanteLegalComponent', () => {
  let component: RepresentanteLegalComponent;
  let fixture: ComponentFixture<RepresentanteLegalComponent>;
  let mockStore: any;
  let mockQuery: any;
  let mockService: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockStore = {
      setTramite110218State: jest.fn()
    };
    mockQuery = {
      selectTramite110218State$: of({
        nombredelRepresentante: 'Ana',
        cargo: 'Directora',
        telefonos: '1234567',
        faxs: '7654321',
        correoElectronicos: 'ana@mail.com'
      })
    };
    mockService = {
      getrepresentante: jest.fn().mockReturnValue(of({ empresa: 'MiEmpresa' }))
    };
    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [RepresentanteLegalComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite110218Store, useValue: mockStore },
        { provide: Tramite110218Query, useValue: mockQuery },
        { provide: CertificadoTecnicoJaponService, useValue: mockService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RepresentanteLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con valores de estadoSeleccionado', () => {
    component.estadoSeleccionado = {
      nombredelRepresentante: 'Luis',
      cargo: 'Gerente',
      telefonos: '1112222',
      faxs: '3334444',
      correoElectronicos: 'luis@mail.com'
    } as any;
    component.inicializarFormulario();
    expect(component.datosdelexportador.get('nombredelRepresentante')?.value).toBe('Luis');
    expect(component.datosdelexportador.get('cargo')?.value).toBe('Gerente');
    expect(component.datosdelexportador.get('telefonos')?.value).toBe('1112222');
    expect(component.datosdelexportador.get('faxs')?.value).toBe('3334444');
    expect(component.datosdelexportador.get('correoElectronicos')?.value).toBe('luis@mail.com');
  });

  it('debería habilitar el formulario si esSoloLectura es falso', () => {
    component.inicializarFormulario();
    component.esSoloLectura = false;
    component.habilitarDeshabilitarFormulario();
    expect(component.datosdelexportador.enabled).toBe(true);
  });

  it('debería deshabilitar el formulario si esSoloLectura es verdadero', () => {
    component.inicializarFormulario();
    component.esSoloLectura = true;
    component.habilitarDeshabilitarFormulario();
    expect(component.datosdelexportador.disabled).toBe(true);
  });

  it('debería actualizar el valor de empresa desde el servicio en obtenerDatosDeTabla', () => {
    component.inicializarFormulario();
    component.obtenerDatosDeTabla();
    expect(mockService.getrepresentante).toHaveBeenCalled();
    expect(component.datosdelexportador.get('empresa')?.value).toBe('MiEmpresa');
  });

  it('debería actualizar el store con setValorStore', () => {
    component.inicializarFormulario();
    component.datosdelexportador.get('cargo')?.setValue('Director');
    component.setValorStore(component.datosdelexportador, 'cargo');
    expect(mockStore.setTramite110218State).toHaveBeenCalledWith({ cargo: 'Director' });
  });

  it('debería actualizar estadoSeleccionado en getValorStore', () => {
    component.getValorStore();
    expect(component.estadoSeleccionado).toEqual(expect.objectContaining({
      nombredelRepresentante: 'Ana',
      cargo: 'Directora'
    }));
  });

  it('debería limpiar destroyed$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});