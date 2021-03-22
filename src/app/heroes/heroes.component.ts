import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero'; // Hero-tietotyyppi
//import { HEROES } from '../mock-heroes';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  // hero on nyt oli jolla on Hero-tyyppi. Tämä on Typescriptiä.
  hero: Hero = {
    id: 1,
    name: 'Windstorm',
  };
  //heroes = HEROES; // kaikki sankarit taulukosta

  heroes: Hero[] = [];

  selectedHero: Hero; //saadaan kun painetaan linkistä

  /*
  heroService on olio, joka syntyy HeroService-luokasta
  konsturuktori-injektiossa. Tämä on dependency injection eli
  riippuvuuden injektio. Ideana on liittää service ja komponentit
  toisiinsa löyhästi, niin että service on tarvittaessa helppo vaihtaa
  toiseen.
  */
  constructor(
    private heroService: HeroService,
    private messageService: MessageService
  ) {}

  // elinkaari-metodi, joka suoritetaan automaattisesti aina
  // kun komponentti syntyy muistiin
  ngOnInit(): void {
    // sankarit haetaan aina kun komponentti syntyy muistiin
    this.getHeroes();
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
    /*
    Kun valitsemme sankarin,lähtee viesti messageservicen kautta
    tähän messagekomponentiin, jossa viesti esitetään
    */

    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
    // penteinteinen tapa yhdistää merkkijono ja muuttuja:
    // 'HeroesComponent: Selected hero id=' + hero.id
  }
  /*Huom. getHeroes kaksi eri metodia seuraavassa: toinen getHeroes jota 
  kutsutaan seuraavan metodin sisällä on eri metodi, sillä se on heroServicen
  metodi (vaikka niillä on sama nimi)
  getHeroes hakee sankarit servicestä tähän
  komponenttiin.

  servicen getHeroes tilaa (subscribe) observablen josta
  saadaan tieto (heroes-taulukko) ulos callbackilla.

  Tieto tulee reaktiivisesti.
  */

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }
}
