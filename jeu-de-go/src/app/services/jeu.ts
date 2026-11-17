
import { Injectable, signal } from '@angular/core';

// Les différentes couleurs possibles
export type Couleur = 'noir' | 'blanc' | null;

@Injectable({
  providedIn: 'root'
})
export class JeuService {

  // Création du plateau vide 9x9
  plateau = signal<Couleur[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(null))
  );

  // Joueur qui doit jouer
  joueurActuel = signal<'noir' | 'blanc'>('noir');

  // Scores des joueurs
  scoreNoir = signal(0);
  scoreBlanc = signal(0);

  // Gestion des passes
  passesConsecutives = signal(0);

  // État de la partie
  partieTerminee = signal(false);

  // Permet de placer une pierre
  placerPierre(ligne: number, colonne: number): void {

    if (this.partieTerminee()) return;

    const plateauActuel = this.plateau();

    // Vérifier que la position est libre
    if (plateauActuel[ligne][colonne] !== null) return;

    // Copie du plateau
    const nouveauPlateau = plateauActuel.map(
      ligne => [...ligne]
    );

    // Placement de la pierre
    nouveauPlateau[ligne][colonne] = this.joueurActuel();

    this.plateau.set(nouveauPlateau);

    // Une pierre posée interrompt les passes consécutives
    this.passesConsecutives.set(0);

    // Changement de joueur
    this.changerJoueur();
  }

  // Retirer une pierre adverse
  retirerPierre(ligne: number, colonne: number): void {

    if (this.partieTerminee()) return;

    const plateauActuel = this.plateau();
    const couleurPierre = plateauActuel[ligne][colonne];

    // Impossible de retirer une case vide
    if (couleurPierre === null) return;

    // Impossible de retirer sa propre pierre
    if (couleurPierre === this.joueurActuel()) return;

    // Copie du plateau
    const nouveauPlateau = plateauActuel.map(
      ligne => [...ligne]
    );

    // Retrait de la pierre
    nouveauPlateau[ligne][colonne] = null;

    this.plateau.set(nouveauPlateau);

    // Augmentation du score du joueur actuel
    if (this.joueurActuel() === 'noir') {
      this.scoreNoir.update(score => score + 1);
    } else {
      this.scoreBlanc.update(score => score + 1);
    }
  }

  // Passer son tour
  passer(): void {

    if (this.partieTerminee()) return;

    this.passesConsecutives.update(nombre => nombre + 1);

    // Deux passes consécutives terminent la partie
    if (this.passesConsecutives() === 2) {
      this.partieTerminee.set(true);
      return;
    }

    this.changerJoueur();
  }

  // Changement de joueur
  changerJoueur(): void {

    this.joueurActuel.set(
      this.joueurActuel() === 'noir' ? 'blanc' : 'noir'
    );
  }

}
