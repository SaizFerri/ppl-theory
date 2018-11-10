import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatRadioModule, MatListModule, MatInputModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatRadioModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatIconModule
  ],
  exports: [
    BrowserAnimationsModule,
    MatButtonModule,
    MatRadioModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatIconModule
  ]
})
export class SharedModule { }
