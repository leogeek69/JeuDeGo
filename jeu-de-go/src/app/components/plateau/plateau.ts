
import { Component, inject } from '@angular/core';
import { Cellule } from '../cellule/cellule';
import { JeuService } from '../../services/jeu';

@Component({
  selector: 'app-plateau',
  standalone: true,
  imports: [Cellule],
  templateUrl: './plateau.html',
  styleUrl: './plateau.css'
})
export class Plateau {

  // Récupération du service
  private jeuService = inject(JeuService);

  // Informations du jeu
  plateau = this.jeuService.plateau;
  joueurActuel = this.jeuService.joueurActuel;

  scoreNoir = this.jeuService.scoreNoir;
  scoreBlanc = this.jeuService.scoreBlanc;

  partieTerminee = this.jeuService.partieTerminee;

  // Poser une pierre
  poserPierre(position: { ligne: number; colonne: number }): void {

    this.jeuService.placerPierre(
      position.ligne,
      position.colonne
    );

  }

  // Retirer une pierre
  retirerPierre(position: { ligne: number; colonne: number }): void {

    this.jeuService.retirerPierre(
      position.ligne,
      position.colonne
    );

  }

  // Passer son tour
  passerTour(): void {

    this.jeuService.passer();

  }

}
