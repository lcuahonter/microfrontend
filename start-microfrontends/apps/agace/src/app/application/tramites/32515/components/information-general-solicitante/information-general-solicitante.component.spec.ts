// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA,Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { Component } from '@angular/core';
import { InformationGeneralSolicitanteComponent } from './information-general-solicitante.component';
import { FormBuilder } from '@angular/forms';
import { Tramite32515Store } from '../../estados/tramite32515.store';
import { Tramite32515Query } from '../../estados/tramite32515.query';
import { ToastrService } from 'ngx-toastr';
import { SeccionLibQuery, SeccionLibStore } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InformationGeneralSolicitanteService } from '../../services/information-general-solicitante.service';

@Injectable()
class MockTramite32515Store {}

@Injectable()
class MockTramite32515Query {

}

describe('InformationGeneralSolicitanteComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        ToastrService,
                provideToastr({
                  positionClass: 'toast-top-right',
                }),
        FormBuilder,
        InformationGeneralSolicitanteService,
        { provide: Tramite32515Store, useClass: MockTramite32515Store },
        { provide: Tramite32515Query, useClass: MockTramite32515Query },
        SeccionLibQuery,
        SeccionLibStore
      ]
    }).overrideComponent(InformationGeneralSolicitanteComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(InformationGeneralSolicitanteComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

 

});