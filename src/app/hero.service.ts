import { Injectable } from '@angular/core';
import { Hero } from './hero'; // tyyppi
import { HEROES } from './mock-heroes'; // dataa serviceen
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

//dekoraattori eli annotaatio kertoo että service voidaan
//injektoida eli liittää komponenttiin dependency injektiolla.
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  //messageService - olio syntyy tähän komponenttiin
  constructor(private messageService: MessageService) {}

  // sankarit saadaan alla olevalla metodilla serviceen
  // asynkrooniseksi muutoksen jälkeen: getHeroes palautta Observablen
  // jossa on taulukko, joka sisältää Hero -tyyppisiä olioita
  // tässä tehdään observable itse of-operaattorilla

  getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messageService.add('HeroService: fetched heroes');
    return heroes;
  }
  //yksittäisen sankarin haku
  getHero(id: number): Observable<Hero> {
    const hero = HEROES.find((h) => h.id === id) as Hero; //haetaan sankarin id
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }
}
