import { APPCONFIG } from './app/app.config';
import { RemoteEntryComponent } from './app/remote-entry/entry.component';
import { bootstrapApplication } from '@angular/platform-browser';


bootstrapApplication(RemoteEntryComponent, APPCONFIG).catch((err) =>
  console.error(err)
);
