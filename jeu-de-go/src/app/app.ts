import { Component } from '@angular/core';
import { Plateau } from './components/plateau/plateau';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Plateau],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}