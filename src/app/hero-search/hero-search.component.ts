import { Component, OnInit } from '@angular/core';
// subject on observablen erikoistyyppi, joka voi sekä vastaanottaa että
// lähettää datavirtaa
import { Observable, Subject } from 'rxjs';
// rxjs:n operaattoreita, joilla voidaan säätää datavirtaa
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  //luodaan subjekti jota tarvitaan reaktiivisessa haussa
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    // subjekti vastaanottaa hakutermin
    this.searchTerms.next(term);
  }
  /*Tässä on kaksi reaktiivista streamia 1. näppäimistösyöte ja 
  2. sankarit jotka tulevat palvelimelta.
   */
  ngOnInit(): void {
    //$-merkki kertoo että muuttujassa on observable (mutta ei tilata eli oteta ulos luokassa vaan tieto)
    //otetaan vastaan vasta templaatissa.
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term, eli ei tee http-pyyntöjä heti
      // http-pyyntöjä tehdään korkeintaan 300 ms välein
      debounceTime(300),

      // ignore new term if same as previous term
      // ei tehdä hakua jos termi ei ole muuttunut eli on sama (kuin edellinen)
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      //vastaanottaa hakutermin,
      // vaihda liitos eli switchMap vaihtaa palvelimesta tulevaan streamiin
      // haetaan sankarit.
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }
}
