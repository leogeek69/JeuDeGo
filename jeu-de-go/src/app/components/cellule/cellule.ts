
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-cellule',
  standalone: true,
  imports: [],
  templateUrl: './cellule.html',
  styleUrl: './cellule.css'
})
export class Cellule {

  // Position de la cellule
  ligne = input.required<number>();
  colonne = input.required<number>();

  // Couleur de la pierre
  couleur = input<'noir' | 'blanc' | null>(null);

  // Événement pour poser une pierre
  jouer = output<{ ligne: number; colonne: number }>();

  // Événement pour retirer une pierre
  retirer = output<{ ligne: number; colonne: number }>();

}
