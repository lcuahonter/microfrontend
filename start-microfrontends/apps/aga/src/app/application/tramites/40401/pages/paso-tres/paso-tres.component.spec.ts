import { CUSTOM_ELEMENTS_SCHEMA, Directive, Injectable, Input, NO_ERRORS_SCHEMA, Output, Pipe, PipeTransform } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let router: Router;

  beforeEach(() => {
    router = {
      navigate: jest.fn()
    } as unknown as Router;

    component = new PasoTresComponent(router);
  });

  describe('obtieneFirma', () => {
    it('should navigate to "servicios-extraordinarios/acuse" if FIRMA is valid', () => {
      const firma = 'validFirma';
      component.obtieneFirma(firma);

      expect(router.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
    });

    it('should not navigate if FIRMA is empty', () => {
      const firma = '';
      component.obtieneFirma(firma);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});