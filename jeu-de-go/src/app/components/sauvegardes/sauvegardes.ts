import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { JeuService } from '../../services/jeu';

@Component({
  selector: 'app-sauvegardes',
  standalone: true,
  imports: [],
  templateUrl: './sauvegardes.html',
  styleUrl: './sauvegardes.css'
})
export class Sauvegardes {
  private jeuService = inject(JeuService);
  private router = inject(Router);

  parties = this.jeuService.partiesSauvegardees;

  charger(id: string): void {
    const ok = this.jeuService.chargerPartie(id);
    if (ok) {
      this.router.navigate(['/']);
    }
  }

  supprimer(id: string): void {
    this.jeuService.supprimerSauvegarde(id);
  }
}