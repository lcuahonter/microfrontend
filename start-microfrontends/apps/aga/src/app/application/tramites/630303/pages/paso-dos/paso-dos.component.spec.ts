import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PasoDosComponent', () => {
  let COMPONENTE: PasoDosComponent;
  let FIXTURE: ComponentFixture<PasoDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    FIXTURE = TestBed.createComponent(PasoDosComponent);
    COMPONENTE = FIXTURE.componentInstance;
    FIXTURE.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(COMPONENTE).toBeTruthy();
  });
});
