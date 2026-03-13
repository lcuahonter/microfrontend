import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TipoDeAvisoComponent } from './tipo-de-aviso.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { AvisoModifyService } from '../../services/aviso-modify.service';
import { Tramite32301Store } from '../../estados/tramite32301.store';
import { Tramite32301Query } from '../../estados/tramite32301.query';
import { AlertComponent, InputCheckComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TipoDeAvisoComponent', () => {
  let component: TipoDeAvisoComponent;
  let fixture: ComponentFixture<TipoDeAvisoComponent>;
  let avisoModifyServiceMock: any;
  let storeMock: any;
  let queryMock: any;

  beforeEach(async () => {
    avisoModifyServiceMock = {
      getAvisoModify: jest.fn().mockReturnValue(of({ descripcion: 'desc' })),
    };
    storeMock = {
      setModalidadCertificacion: jest.fn(),
      setClientesProveedoresExtranjeros: jest.fn(),
      setProveedoresNacionales: jest.fn(),
      setModificacionesMiembros: jest.fn(),
      setCambiosDocumentosLegales: jest.fn(),
      setNotifiFusionOescision: jest.fn(),
      setAdicionalesFractions: jest.fn(),
      setAceptacion253: jest.fn(),
    };
    queryMock = {
      select: jest.fn().mockReturnValue(of({
        modalidadCertificacion: 'cert',
        foreignClientsSuppliers: true,
        nationalSuppliers: false,
        modificationsMembers: true,
        changesToLegalDocuments: false,
        mergerOrSplitNotice: true,
        additionFractions: false,
        acepto253: true,
      })),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TipoDeAvisoComponent,  CommonModule,
          ReactiveFormsModule,
          TituloComponent,
          AlertComponent,
          InputCheckComponent,
          HttpClientTestingModule],
      declarations: [
        ],
      providers: [
        FormBuilder,
        { provide: AvisoModifyService, useValue: avisoModifyServiceMock },
        { provide: Tramite32301Store, useValue: storeMock },
        { provide: Tramite32301Query, useValue: queryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoDeAvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on creation', () => {
  });

  it('should call setModalidadCertificacion on inicializamiFormulario', () => {
    component.inicializamiFormulario();
  });

  it('should emit form value on aiEnviar', () => {
    const spy = jest.spyOn(component.tabEnabledData, 'emit');
    component.miFormulario.setValue({
      modalidadCertificacion: 'cert',
      foreignClientsSuppliers: true,
      nationalSuppliers: false,
      modificationsMembers: true,
      changesToLegalDocuments: false,
      mergerOrSplitNotice: true,
      additionFractions: false,
      acepto253: true,
    });
    component.aiEnviar();
    expect(spy).toHaveBeenCalledWith(component.miFormulario.value);
  });

  it('should update store on setClientesProveedoresExtranjeros', () => {
    component.miFormulario.get('foreignClientsSuppliers')?.setValue('test');
    component.setClientesProveedoresExtranjeros();
    expect(storeMock.setClientesProveedoresExtranjeros).toHaveBeenCalledWith('test');
  });

  it('should update store on setProveedoresNacionales', () => {
    component.miFormulario.get('nationalSuppliers')?.setValue('test2');
    component.setProveedoresNacionales();
    expect(storeMock.setProveedoresNacionales).toHaveBeenCalledWith('test2');
  });

  it('should update store on setModificacionesMiembros', () => {
    component.miFormulario.get('modificationsMembers')?.setValue('test3');
    component.setModificacionesMiembros();
    expect(storeMock.setModificacionesMiembros).toHaveBeenCalledWith('test3');
  });

  it('should update store on setCambiosDocumentosLegales', () => {
    component.miFormulario.get('changesToLegalDocuments')?.setValue('test4');
    component.setCambiosDocumentosLegales();
    expect(storeMock.setCambiosDocumentosLegales).toHaveBeenCalledWith('test4');
  });

  it('should update store on setNotifiFusionOescision', () => {
    component.miFormulario.get('mergerOrSplitNotice')?.setValue('test5');
    component.setNotifiFusionOescision();
    expect(storeMock.setNotifiFusionOescision).toHaveBeenCalledWith('test5');
  });

  it('should update store on setAdicionalesFractions', () => {
    component.miFormulario.get('additionFractions')?.setValue('test6');
    component.setAdicionalesFractions();
    expect(storeMock.setAdicionalesFractions).toHaveBeenCalledWith('test6');
  });

  it('should update store on setAceptacion253', () => {
    component.miFormulario.get('acepto253')?.setValue('test7');
    component.setAceptacion253();
    expect(storeMock.setAceptacion253).toHaveBeenCalledWith('test7');
  });

  it('should emit on handleValores', () => {
    const spy = jest.spyOn(component.tabEnabledData, 'emit');
    component.handleValores();
    expect(spy).toHaveBeenCalled();
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroy$, 'next');
    const completeSpy = jest.spyOn((component as any).destroy$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should recreate form when Tramite32301Query emits new state', () => {
    const crearFormSpy = jest.spyOn(component, 'crearFormMiFormulario');
    component.ngOnInit();
    expect(crearFormSpy).toHaveBeenCalled();
  });
});