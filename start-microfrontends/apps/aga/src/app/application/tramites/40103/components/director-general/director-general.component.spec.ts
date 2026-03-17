import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DirectorGeneralComponent } from './director-general.component';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chofer40103Store } from '../../estados/chofer40103.store';
import { Chofer40103Query } from '../../estados/chofer40103.query';
import { Chofer40103Service } from '../../estados/chofer40103.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

@Injectable()
class MockHttpClient {
  post() {}
}

@Injectable()
class MockChofer40103Store {
  getValue() {
    return {
      nombre: 'Test Name',
      primerApellido: 'Test First',
      segundoApellido: 'Test Second'
    };
  }

  setNombre = jest.fn();
  setPrimerApellido = jest.fn();
  setSegundoApellido = jest.fn();
  setCurp = jest.fn();
  setRfc = jest.fn();
}

@Injectable()
class MockChofer40103Query {
  selectSolicitud$ = of({});
}

@Injectable()
class MockChofer40103Service {}

@Injectable()
class MockConsultaioQuery {
  selectConsultaioState$ = of({ readonly: false });
}


describe('DirectorGeneralComponent', () => {
  let component: DirectorGeneralComponent;
  let fixture: ComponentFixture<DirectorGeneralComponent>;
  let fb: FormBuilder;
  let mockStore: MockChofer40103Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [DirectorGeneralComponent],
      providers: [
        { provide: HttpClient, useClass: MockHttpClient },
        { provide: Chofer40103Store, useClass: MockChofer40103Store },
        { provide: Chofer40103Query, useClass: MockChofer40103Query },
        { provide: Chofer40103Service, useClass: MockChofer40103Service },
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorGeneralComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    mockStore = TestBed.inject(Chofer40103Store) as unknown as MockChofer40103Store;
  });

  it('should create the component', () => {
    component.directorGeneralForm = fb.group({
      name: [''],
      email: [''],
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create the component and call ngOnInit', () => {
    component.directorGeneralForm = fb.group({
      name: [''],
      email: [''],
    });
    
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  describe('setValoresStore', () => {
    let testForm: FormGroup;

    beforeEach(() => {
      testForm = fb.group({
        nombre: ['Juan'],
        primerApellido: ['Pérez'],
        segundoApellido: ['García'],
        curp: ['PEGJ800101HDFRRN01'],
        rfc: ['PEGJ800101']
      });
    });

    it('should call the correct store method with the form field value', () => {
      // Act
      component.setValoresStore(testForm, 'nombre', 'setNombre');

      // Assert
      expect(mockStore.setNombre).toHaveBeenCalledWith('Juan');
    });

    it('should call setPrimerApellido with correct value', () => {
      // Act
      component.setValoresStore(testForm, 'primerApellido', 'setPrimerApellido');

      // Assert
      expect(mockStore.setPrimerApellido).toHaveBeenCalledWith('Pérez');
    });

    it('should call setSegundoApellido with correct value', () => {
      // Act
      component.setValoresStore(testForm, 'segundoApellido', 'setSegundoApellido');

      // Assert
      expect(mockStore.setSegundoApellido).toHaveBeenCalledWith('García');
    });

    it('should handle undefined form field value gracefully', () => {
      // Arrange
      const formWithUndefined = fb.group({
        emptyField: [undefined]
      });

      // Act
      component.setValoresStore(formWithUndefined, 'emptyField', 'setNombre');

      // Assert
      expect(mockStore.setNombre).toHaveBeenCalledWith(null);
    });

    it('should handle null form field value gracefully', () => {
      // Arrange
      const formWithNull = fb.group({
        nullField: [null]
      });

      // Act
      component.setValoresStore(formWithNull, 'nullField', 'setNombre');

      // Assert
      expect(mockStore.setNombre).toHaveBeenCalledWith(null);
    });

    it('should handle empty string values', () => {
      // Arrange
      const formWithEmpty = fb.group({
        emptyString: ['']
      });

      // Act
      component.setValoresStore(formWithEmpty, 'emptyString', 'setNombre');

      // Assert
      expect(mockStore.setNombre).toHaveBeenCalledWith('');
    });

    it('should handle missing form control gracefully', () => {
      // Arrange
      const formWithoutField = fb.group({
        existingField: ['value']
      });

      // Act
      component.setValoresStore(formWithoutField, 'nonExistentField', 'setNombre');

      // Assert
      expect(mockStore.setNombre).toHaveBeenCalledWith(undefined);
    });

    it('should work with different store methods', () => {
      // Test setCurp
      component.setValoresStore(testForm, 'curp', 'setCurp');
      expect(mockStore.setCurp).toHaveBeenCalledWith('PEGJ800101HDFRRN01');

      // Test setRfc
      component.setValoresStore(testForm, 'rfc', 'setRfc');
      expect(mockStore.setRfc).toHaveBeenCalledWith('PEGJ800101');
    });

    it('should preserve form field value types', () => {
      // Arrange - test with different data types
      const mixedForm = fb.group({
        stringField: ['test string'],
        numberField: [123],
        booleanField: [true],
        arrayField: [['item1', 'item2']]
      });

      // Act & Assert - string
      component.setValoresStore(mixedForm, 'stringField', 'setNombre');
      expect(mockStore.setNombre).toHaveBeenCalledWith('test string');

      // Act & Assert - number (though store expects string, the method should still be called)
      component.setValoresStore(mixedForm, 'numberField', 'setNombre');
      expect(mockStore.setNombre).toHaveBeenCalledWith(123);
    });

    it('should reset mock calls between tests', () => {
      // Ensure clean state
      expect(mockStore.setNombre).not.toHaveBeenCalled();
      expect(mockStore.setPrimerApellido).not.toHaveBeenCalled();
      expect(mockStore.setSegundoApellido).not.toHaveBeenCalled();
    });
  });

});
