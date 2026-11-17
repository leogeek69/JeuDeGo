import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-cellule',
  standalone: true,
  imports: [],
  templateUrl: './cellule.html',
  styleUrl: './cellule.css'
})
export class Cellule {

  // Position de la cellule sur le plateau
  ligne = input.required<number>();
  colonne = input.required<number>();

  // Couleur de la pierre nois, blanc ou rien
  couleur = input<'noir' | 'blanc' | null>(null);

  // envoyé au plateau quand on cliqiue
  jouer = output<{ ligne: number; colonne: number }>();

}
