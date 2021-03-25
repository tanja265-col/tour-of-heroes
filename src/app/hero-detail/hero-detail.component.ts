import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router'; // tarvitaan hakemaan urlista eli osoiteriviltä id
import { Location } from '@angular/common'; // tarvitaan siirtymään yksi näkymä eteen tai taakse.
import { HeroService } from '../hero.service'; // tarvitaan hakemaan sankari kun tiedetään id

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
  //tämä oli käytössä kun tuli vielä äitikomponenstista: @Input() hero: Hero;
  hero: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  // kun komponentti syntyy muistiin, sankarin tiedot tulevat komponenttiin id:n perusteella
  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    //+this edessä oleva plussa muuttaa id:n merkkijonon numeroksi, voisi tehdä myös Numberilla
    const id = +this.route.snapshot.paramMap.get('id');
    //const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id).subscribe((hero) => (this.hero = hero));
  }
  goBack(): void {
    this.location.back();
  }
  //päivittä sankarin ja menee suoraan listanäkymään jossa
  //päivitetty sankari näkyy
  save(): void {
    this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
  }
}
