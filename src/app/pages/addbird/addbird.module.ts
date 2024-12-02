import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddbirdPageRoutingModule } from './addbird-routing.module';

import { AddbirdPage } from './addbird.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddbirdPageRoutingModule
  ],
  declarations: [AddbirdPage]
})
export class AddbirdPageModule {}
