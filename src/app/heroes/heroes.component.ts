import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero'; // Hero-tietotyyppi

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

  constructor() {}

  ngOnInit(): void {}
}
