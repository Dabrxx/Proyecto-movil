import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrefferPageRoutingModule } from './preffer-routing.module';

import { PrefferPage } from './preffer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrefferPageRoutingModule
  ],
  declarations: [PrefferPage]
})
export class PrefferPageModule {}
