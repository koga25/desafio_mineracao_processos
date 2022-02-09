import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RestService } from './services-components/rest.service';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { MatIconModule } from '@angular/material/icon'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragToScrollComponent } from './drag-to-scroll/drag-to-scroll.component'

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    DragToScrollComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
  ],
  providers: [RestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
