import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { defineLocale, esLocale } from 'ngx-bootstrap/chronos';

defineLocale('es', esLocale); // 👈 register Spanish locale

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));

