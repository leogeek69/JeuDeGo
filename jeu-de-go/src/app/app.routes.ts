import { Routes } from '@angular/router';
import { Plateau } from './components/plateau/plateau';
import { Sauvegardes } from './components/sauvegardes/sauvegardes';

export const routes: Routes = [
  { path: '', component: Plateau },
  //{ path: 'sauvegardes', component: Sauvegardes },
  { path: '**', redirectTo: '' }
];