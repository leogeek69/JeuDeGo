import { Injectable, signal } from '@angular/core';

// différentes couleurs possibles
export type Couleur = 'noir' | 'blanc' | null;

export interface PartieSauvegardee {
  id: string;
  nom: string;
  date: string;
  plateau: Couleur[][];
  joueurActuel: 'noir' | 'blanc';
  scoreNoir: number;
  scoreBlanc: number;
  passesConsecutives: number;
  partieTerminee: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class JeuService {

  private readonly CLE_STORAGE = 'go_parties_sauvegardees';

  // Création du plateau 9x9
  plateau = signal<Couleur[][]>(this.creerPlateauVide());

  // Joueur qui doit jouer
  joueurActuel = signal<'noir' | 'blanc'>('noir');

  // Scores
  scoreNoir = signal(0);
  scoreBlanc = signal(0);

  // passes
  passesConsecutives = signal(0);

  // Partie fini ?
  partieTerminee = signal(false);

  // Liste des parties sauvegardées dans le localstorage
  partiesSauvegardees = signal<PartieSauvegardee[]>(this.lireSauvegardes());

  private creerPlateauVide(): Couleur[][] {
    return Array.from({ length: 9 }, () => Array(9).fill(null));
  }

  //nouvelle partie
  nouvellePartie(): void {
    this.plateau.set(this.creerPlateauVide());
    this.joueurActuel.set('noir');
    this.scoreNoir.set(0);
    this.scoreBlanc.set(0);
    this.passesConsecutives.set(0);
    this.partieTerminee.set(false);
  }

  // placer  pierre
  placerPierre(ligne: number, colonne: number): void {
    if (this.partieTerminee()) return;

    const plateauActuel = this.plateau();

    // vois si la position est libre
    if (plateauActuel[ligne][colonne] !== null) return;

    // copie du plateau
    const nouveauPlateau = plateauActuel.map(l => [...l]);

    // Placement de la pierre a la bonne position
    nouveauPlateau[ligne][colonne] = this.joueurActuel();

    this.plateau.set(nouveauPlateau);

    // Passe remis a 0 quand coup joué
    this.passesConsecutives.set(0);

    // Changement de joueur automatique
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
    const nouveauPlateau = plateauActuel.map(l => [...l]);

    // Retrait de la pierre
    nouveauPlateau[ligne][colonne] = null;

    this.plateau.set(nouveauPlateau);

    // score du joueur actuel
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

    // fini la partie si 2 passes a la suite
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

  // gestion sauvegardes

  private lireSauvegardes(): PartieSauvegardee[] {
    try {
      const brut = localStorage.getItem(this.CLE_STORAGE);
      return brut ? (JSON.parse(brut) as PartieSauvegardee[]) : [];
    } catch {
      return [];
    }
  }

  private ecrireSauvegardes(liste: PartieSauvegardee[]): void {
    localStorage.setItem(this.CLE_STORAGE, JSON.stringify(liste));
    this.partiesSauvegardees.set(liste);
  }

  sauvegarderPartie(nom?: string): PartieSauvegardee {
    const maintenant = new Date();
    const nouvelleSauvegarde: PartieSauvegardee = {
      id: maintenant.getTime().toString(),
      nom: nom?.trim() || `Partie du ${maintenant.toLocaleDateString('fr-FR')} à ${maintenant.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      date: maintenant.toLocaleString('fr-FR'),
      plateau: this.plateau().map(l => [...l]),
      joueurActuel: this.joueurActuel(),
      scoreNoir: this.scoreNoir(),
      scoreBlanc: this.scoreBlanc(),
      passesConsecutives: this.passesConsecutives(),
      partieTerminee: this.partieTerminee()
    };

    const miseAJour = [nouvelleSauvegarde, ...this.partiesSauvegardees()];
    this.ecrireSauvegardes(miseAJour);
    return nouvelleSauvegarde;
  }

  chargerPartie(id: string): boolean {
    const partie = this.partiesSauvegardees().find(p => p.id === id);
    if (!partie) return false;

    this.plateau.set(partie.plateau.map(l => [...l]));
    this.joueurActuel.set(partie.joueurActuel);
    this.scoreNoir.set(partie.scoreNoir);
    this.scoreBlanc.set(partie.scoreBlanc);
    this.passesConsecutives.set(partie.passesConsecutives);
    this.partieTerminee.set(partie.partieTerminee);
    return true;
  }

  supprimerSauvegarde(id: string): void {
    const miseAJour = this.partiesSauvegardees().filter(p => p.id !== id);
    this.ecrireSauvegardes(miseAJour);
  }
}