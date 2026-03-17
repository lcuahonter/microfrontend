import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { AcusePageComponent } from './acuse-page.component';
import { AcuseComponent } from '@libs/shared/data-access-user/src';
import {
  TITULO_ACUSE,
  ACUSE_SERVICIOS_EXTRAORDINARIOS,
  TXT_ALERTA_ACUSE,
} from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AcusePageComponent', () => {
  let component: AcusePageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        AcuseComponent,
        AcusePageComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: {
              paramMap: new Map(),
              queryParamMap: new Map(),
              data: {},
            },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AcusePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct initial folio', () => {
    expect(component.folio).toBe('01010101010101010101010101010101');
  });

  it('should set txtAlerta correctly on init', () => {
    const expectedAlertText = TXT_ALERTA_ACUSE(
      '01010101010101010101010101010101'
    );
    expect(component.txtAlerta).toBe(expectedAlertText);
  });

  it('should have the correct subtitulo', () => {
    expect(component.subtitulo).toBe(TITULO_ACUSE);
  });

  it('should have the correct encabezadoTablaAcuse', () => {
    expect(component.encabezadoTablaAcuse).toBe(
      ACUSE_SERVICIOS_EXTRAORDINARIOS.encabezadoTablaAcuse
    );
  });

  it('should have the correct accionesTablaAcuse', () => {
    expect(component.accionesTablaAcuse).toEqual(
      ACUSE_SERVICIOS_EXTRAORDINARIOS.accionesTablaAcuse
    );
  });

  it('should have the correct datosTablaAcuse', () => {
    expect(component.datosTablaAcuse).toEqual(
      ACUSE_SERVICIOS_EXTRAORDINARIOS.datosTablaAcuse
    );
  });
});
