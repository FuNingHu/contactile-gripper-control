import { CUSTOM_ELEMENTS_SCHEMA, DoBootstrap, Injector, NgModule } from '@angular/core';
import { ContactileGripperAppComponent } from './components/contactile-gripper-app/contactile-gripper-app.component';
import { ContactileGripperBarComponent } from './components/contactile-gripper-bar/contactile-gripper-bar.component';
import { ContactileGripperActionsProgComponent } from './components/contactile-gripper-actions-prog/contactile-gripper-actions-prog.component';
import { ContactileGripperGetDataProgComponent } from './components/contactile-gripper-getdata-prog/contactile-gripper-getdata-prog.component';
import { ContactileGripperSetParametersProgComponent } from './components/contactile-gripper-setparameters-prog/contactile-gripper-setparameters-prog.component';
import { ContactileGripperProgramFlowProgComponent } from './components/contactile-gripper-programflow-prog/contactile-gripper-programflow-prog.component';
import { ContactileGripperStateErrorProgComponent } from './components/contactile-gripper-stateerror-prog/contactile-gripper-stateerror-prog.component';
import { ContactileGripperActivateProgComponent } from './components/contactile-gripper-activate-prog/contactile-gripper-activate-prog.component';

import { UIAngularComponentsModule } from '@universal-robots/ui-angular-components';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import { PATH } from '../generated/contribution-constants';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";

export const httpLoaderFactory = (http: HttpBackend) =>
    new MultiTranslateHttpLoader(http, [
      { prefix: PATH + '/assets/i18n/', suffix: '.json' },
      { prefix: './ui/assets/i18n/', suffix: '.json' },
    ]);

@NgModule({

  declarations: [
      ContactileGripperAppComponent,
      ContactileGripperBarComponent,
      ContactileGripperActionsProgComponent,
      ContactileGripperGetDataProgComponent,
      ContactileGripperSetParametersProgComponent,
      ContactileGripperProgramFlowProgComponent,
      ContactileGripperStateErrorProgComponent,
      ContactileGripperActivateProgComponent
],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      UIAngularComponentsModule,
      HttpClientModule,
      FormsModule,
      TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useFactory: httpLoaderFactory, deps: [HttpBackend] },
        useDefaultLang: false,
      })
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const contactilegripperappComponent = createCustomElement(ContactileGripperAppComponent, {injector: this.injector});
    customElements.define('contactile-contactile-gripper-contactile-gripper-app', contactilegripperappComponent);
    const contactilegripperbarComponent = createCustomElement(ContactileGripperBarComponent, {injector: this.injector});
    customElements.define('contactile-contactile-gripper-contactile-gripper-bar', contactilegripperbarComponent);
    const contactilegripperactionsprogComponent = createCustomElement(ContactileGripperActionsProgComponent, {injector: this.injector});
    customElements.define('contactile-contactile-gripper-contactile-gripper-actions-prog', contactilegripperactionsprogComponent);
    const contactilegrippergetdataprogComponent = createCustomElement(ContactileGripperGetDataProgComponent, {injector: this.injector});
    customElements.define('contactile-contactile-gripper-contactile-gripper-getdata-prog', contactilegrippergetdataprogComponent);
    const contactilegrippersetparametersprogComponent = createCustomElement(ContactileGripperSetParametersProgComponent, {injector: this.injector});
    customElements.define('contactile-contactile-gripper-contactile-gripper-setparameters-prog', contactilegrippersetparametersprogComponent);
    const contactilegripperprogramflowprogComponent = createCustomElement(ContactileGripperProgramFlowProgComponent, {injector: this.injector});
    customElements.define('contactile-contactile-gripper-contactile-gripper-programflow-prog', contactilegripperprogramflowprogComponent);
    const contactilegripperstateerrorprogComponent = createCustomElement(ContactileGripperStateErrorProgComponent, {injector: this.injector});
    customElements.define('contactile-contactile-gripper-contactile-gripper-stateerror-prog', contactilegripperstateerrorprogComponent);
    const contactilegripperactivateprogComponent = createCustomElement(ContactileGripperActivateProgComponent, {injector: this.injector});
    customElements.define('contactile-contactile-gripper-contactile-gripper-activate-prog', contactilegripperactivateprogComponent);
  }

  // This function is never called, because we don't want to actually use the workers, just tell webpack about them
  registerWorkersWithWebPack() {
    new Worker(new URL('./components/contactile-gripper-app/contactile-gripper-app.behavior.worker.ts'
        /* webpackChunkName: "contactile-gripper-app.worker" */, import.meta.url), {
      name: 'contactile-gripper-app',
      type: 'module'
    });new Worker(new URL('./components/contactile-gripper-bar/contactile-gripper-bar.behavior.worker.ts'
        /* webpackChunkName: "contactile-gripper-bar.worker" */, import.meta.url), {
      name: 'contactile-gripper-bar',
      type: 'module'
    });new Worker(new URL('./components/contactile-gripper-actions-prog/contactile-gripper-actions-prog.behavior.worker.ts'
        /* webpackChunkName: "contactile-gripper-actions-prog.worker" */, import.meta.url), {
      name: 'contactile-gripper-actions-prog',
      type: 'module'
    });new Worker(new URL('./components/contactile-gripper-getdata-prog/contactile-gripper-getdata-prog.behavior.worker.ts'
        /* webpackChunkName: "contactile-gripper-getdata-prog.worker" */, import.meta.url), {
      name: 'contactile-gripper-getdata-prog',
      type: 'module'
    });new Worker(new URL('./components/contactile-gripper-setparameters-prog/contactile-gripper-setparameters-prog.behavior.worker.ts'
        /* webpackChunkName: "contactile-gripper-setparameters-prog.worker" */, import.meta.url), {
      name: 'contactile-gripper-setparameters-prog',
      type: 'module'
    });new Worker(new URL('./components/contactile-gripper-programflow-prog/contactile-gripper-programflow-prog.behavior.worker.ts'
        /* webpackChunkName: "contactile-gripper-programflow-prog.worker" */, import.meta.url), {
      name: 'contactile-gripper-programflow-prog',
      type: 'module'
    });new Worker(new URL('./components/contactile-gripper-stateerror-prog/contactile-gripper-stateerror-prog.behavior.worker.ts'
        /* webpackChunkName: "contactile-gripper-stateerror-prog.worker" */, import.meta.url), {
      name: 'contactile-gripper-stateerror-prog',
      type: 'module'
    });new Worker(new URL('./components/contactile-gripper-activate-prog/contactile-gripper-activate-prog.behavior.worker.ts'
    /* webpackChunkName: "contactile-gripper-activate-prog.worker" */, import.meta.url), {
  name: 'contactile-gripper-activate-prog',
  type: 'module'
});
    
  }
}

