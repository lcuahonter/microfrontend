import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { TOAST_CONFIG, DefaultGlobalConfig } from 'ngx-toastr';
import { DebugElement } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

class MockToastrService {
  success(message?: string, title?: string, override?: any) {}
  error(message?: string, title?: string, override?: any) {}
  info(message?: string, title?: string, override?: any) {}
  warning(message?: string, title?: string, override?: any) {}
}

let fixture: ComponentFixture<PasoTresComponent>;
let component: PasoTresComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot(),PasoTresComponent],
      providers: [ToastrService,
                provideHttpClient(),
                { provide: ToastrService, useClass: MockToastrService },
                { provide: TOAST_CONFIG, useValue: DefaultGlobalConfig }

      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
