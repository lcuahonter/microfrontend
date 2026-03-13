import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { DatosCertificacionComponent } from './datos-certificacion.component';
import { SolicitudService } from '../../services/solicitud.service';
import { Tramite80316Store } from '../../estados/tramite80316.store';
import { Tramite80316Query } from '../../estados/tramite80316.query';
import { of, Subject } from 'rxjs';

describe('DatosCertificacionComponent', () => {
  let component: DatosCertificacionComponent;
  let fixture: any;
  let solicitudService: jest.Mocked<SolicitudService>;
  let tramite80316Store: jest.Mocked<Tramite80316Store>;
  let tramite80316Query: any;

  beforeEach(() => {
    solicitudService = {
      obtenerDatosCertificacionSAT: jest.fn().mockReturnValue(of({ datos: { certificacionSAT: 'SI' } }))
    } as any;

    tramite80316Store = {
      setDatosCertificacion: jest.fn(),
      setCertificacionSAT: jest.fn()
    } as any;

    tramite80316Query = {
      selectSolicitud$: of({ buscarIdSolicitud: ['123'], loginRfc: 'RFC123' })
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: SolicitudService, useValue: solicitudService },
        { provide: Tramite80316Store, useValue: tramite80316Store },
        { provide: Tramite80316Query, useValue: tramite80316Query }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(DatosCertificacionComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.solicitudState = { certificion: 'SI', fechaInicio: '', fechaVigencia: '' } as any;
    component.ngOnInit();
    expect(component.certificionForm).toBeDefined();
    expect(component.certificionForm.get('certificion')?.disabled).toBe(true);
  });

  it('should call loadDatosCertificacion and patch form value', () => {
    component.solicitudState = { certificion: '', fechaInicio: '', fechaVigencia: '' } as any;
    component.ngOnInit();
    component.certificionForm.patchValue = jest.fn();
    component.loadDatosCertificacion('RFC123');
    expect(solicitudService.obtenerDatosCertificacionSAT).toHaveBeenCalledWith('RFC123');
  });

  it('should set store values when loadDatosCertificacion is called', () => {
    component.solicitudState = { certificion: '', fechaInicio: '', fechaVigencia: '' } as any;
    component.ngOnInit();
    component.loadDatosCertificacion('RFC123');
    expect(tramite80316Store.setDatosCertificacion).toHaveBeenCalled();
    expect(tramite80316Store.setCertificacionSAT).toHaveBeenCalledWith('SI');
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const spy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});