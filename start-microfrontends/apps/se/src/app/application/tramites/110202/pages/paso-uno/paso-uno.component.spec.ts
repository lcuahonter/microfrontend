import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoUnoComponent } from './paso-uno.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { SeccionLibQuery, SeccionLibStore } from '@libs/shared/data-access-user/src';
import { ToastrService, provideToastr } from 'ngx-toastr';
import { CertificadoValidacionService } from '../../services/certificado-validacion.service';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
 imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        FormBuilder,
        CertificadoValidacionService,
        // { provide: Tramite110202Store, useClass: MockTramite110202Store },
        // { provide: Tramite110202Query, useClass: MockTramite110202Query },
        SeccionLibQuery,
        SeccionLibStore
      ]    })
    .compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
