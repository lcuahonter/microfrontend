// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { AlertComponent, AnexarDocumentosComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnexarDocumentosComponent, PasoDosComponent, HttpClientModule,ToastrModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
