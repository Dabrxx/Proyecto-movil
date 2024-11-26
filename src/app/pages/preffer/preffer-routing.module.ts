import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrefferPage } from './preffer.page';

const routes: Routes = [
  {
    path: '',
    component: PrefferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrefferPageRoutingModule {}
