/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import 'moment/locale/en-gb';
import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/es';
import 'moment/locale/it';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
