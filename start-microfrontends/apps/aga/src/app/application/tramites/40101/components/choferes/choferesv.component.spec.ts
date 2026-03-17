// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Pipe,
  PipeTransform,
  Injectable,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  Directive,
  Input,
  Output,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component, ChangeDetectorRef } from '@angular/core';
import { ChoferesComponent } from './choferes.component';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Chofer40101Store } from '../../estado/chofer40101.store';
import { Chofer40101Service } from '../../estado/chofer40101.service';
import { Chofer40101Query } from '../../estado/chofer40101.query';

@Injectable()
class MockHttpClient {
  post() {}
}

@Injectable()
class MockChofer40101Store {}

@Injectable()
class MockChofer40101Service {}

@Injectable()
class MockChofer40101Query {}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

describe('ChoferesComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ChoferesComponent,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        TranslatePipe,
        PhoneNumberPipe,
        SafeHtmlPipe,
        MyCustomDirective,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        ToastrService,
        { provide: HttpClient, useClass: MockHttpClient },
        { provide: Chofer40101Store, useClass: MockChofer40101Store },
        { provide: Chofer40101Service, useClass: MockChofer40101Service },
        { provide: Chofer40101Query, useClass: MockChofer40101Query },
        ChangeDetectorRef,
      ],
    })
      .overrideComponent(ChoferesComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(ChoferesComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function () {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #setActiveTab()', async () => {
    component.setActiveTab({});
  });
});
