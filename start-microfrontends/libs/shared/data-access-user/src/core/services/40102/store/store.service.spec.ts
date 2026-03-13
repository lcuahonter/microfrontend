// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { DynamicComponentService } from './dynamic-component.service';
import { ComponentFactoryResolver } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from '@rogers/oneview-components';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockEncryptionService {
  decrypt = function() {};
}

describe('DynamicComponentService', () => {
  let service;

  beforeEach(() => {
    service = new DynamicComponentService({}, {}, {
        snapshot: {
          params: {
            'cipherText': {}
          }
        }
      }, {
        decrypt: function() {}
      });
  });

  it('should run #createComponent()', async () => {
    service.factoryResolver = service.factoryResolver || {};
    service.factoryResolver.resolveComponentFactory = jest.fn().mockReturnValue({
      create: function() {}
    });
    service.createComponent({}, {}, {
      parentInjector: {}
    });
  });

  it('should run #insertComponent()', async () => {
    service.rootViewContainer = service.rootViewContainer || {};
    service.rootViewContainer.insert = jest.fn();
    service.insertComponent({
      location: {
        nativeElement: {
          setAttribute: function() {}
        }
      },
      instance: {
        id: {}
      },
      hostView: {}
    });
  });

  it('should run #emptyFunction()', async () => {

    service.emptyFunction();

  });

});