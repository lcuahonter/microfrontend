import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TipoDePersonaComponent } from './tipo-de-persona.component';
import { SolicitudService } from '../../services/solicitud.service';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Tramite80316Store } from '../../estados/tramite80316.store';
import { Tramite80316Query } from '../../estados/tramite80316.query';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { of } from 'rxjs';

describe('TipoDePersonaComponent', () => {
  let component: TipoDePersonaComponent;
  let fixture: ComponentFixture<TipoDePersonaComponent>;
  let mockRouter: Partial<Router>;
  let mockSolicitudService: Partial<SolicitudService>;

  beforeEach(async () => {
    mockRouter = { navigate: jest.fn() };
    mockSolicitudService = { getTipoDePersona: jest.fn(() => of({} as RespuestaCatalogos)) };

    await TestBed.configureTestingModule({
      imports: [TipoDePersonaComponent],
      providers: [
        { provide: SolicitudService, useValue: mockSolicitudService },
        { provide: Router, useValue: mockRouter },
        FormBuilder,
        Tramite80316Store,
        Tramite80316Query,
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoDePersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.tipoDePersonaForm).toBeDefined();
    expect(component.tipoDePersonaForm.get('tipoDePersona')).toBeTruthy();
    expect(component.tipoDePersonaForm.get('RFCImpExp')).toBeTruthy();
  });

  it('should mark all fields as touched if form is invalid on registroModificacion', () => {
    component.tipoDePersonaForm.setValue({
      tipoDePersona: '',
      RFCImpExp: '',
    });
    component.registroModificacion();
    expect(component.tipoDePersonaForm.get('tipoDePersona')?.touched).toBe(true);
    expect(component.tipoDePersonaForm.get('RFCImpExp')?.touched).toBe(true);
  });
});
