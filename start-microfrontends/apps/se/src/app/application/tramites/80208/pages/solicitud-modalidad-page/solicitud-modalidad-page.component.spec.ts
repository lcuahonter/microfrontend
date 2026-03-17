// @ts-nocheck
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SolicitudModalidadPageComponent } from './solicitud-modalidad-page.component';
import { TestBed } from '@angular/core/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('SolicitudModalidadPageComponent', () => {
  let fixture;
  let component: SolicitudModalidadPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule, 
        ReactiveFormsModule, 
        HttpClientTestingModule, 
        BrowserAnimationsModule,
        ToastrModule.forRoot({
          timeOut: 3000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        })
      ],
      declarations: [
        SolicitudModalidadPageComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        ToastrService,
        {
          provide: 'CambioModalidadQuery',
          useValue: {
            selectCambioModalidad$: of({
              idSolicitud: null,
              cambioError: false,
              serviciosImmxError: false
            })
          }
        },
        {
          provide: 'GuardarService',
          useValue: {
            postSolicitud: jest.fn().mockReturnValue(of({ codigo: '00', mensaje: 'Success' }))
          }
        },
        {
          provide: 'CambioModalidadStore',
          useValue: {
            setIdSolicitud: jest.fn()
          }
        },
        {
          provide: 'CambioModalidadService',
          useValue: {
            getAllState: jest.fn().mockReturnValue(of({}))
          }
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SolicitudModalidadPageComponent);
    component = fixture.debugElement.componentInstance;
  });

  // eslint-disable-next-line require-await
  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

});

