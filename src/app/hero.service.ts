import { Injectable } from '@angular/core';
import { Hero } from './hero'; // tyyppi
import { HEROES } from './mock-heroes'; // dataa serviceen
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//txjs:n operaattoreita joilla siepataan virhe ja välitetään viestejä
// reaktivisen tapahtuman välissä.
import { catchError, tap } from 'rxjs/operators';

//dekoraattori eli annotaatio kertoo että service voidaan
//injektoida eli liittää komponenttiin dependency injektiolla.
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  //vaihda tähän oikean palvelimen osoite, sitten kun siiryt käyttämään sitä
  private heroesUrl = 'api/heroes'; // URL to web api. in-memory-web-api osoite
  // määrittelee verkon yli kulkevan datan JSON-muotoiseksi
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  //messageService - olio syntyy tähän komponenttiin
  // http-olion avulla tehdään pyyntöjä serverille
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}
  //loggausmetodi, joka säästää koodin kirjottamisessa
  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  // sankarit saadaan alla olevalla metodilla serviceen
  // asynkrooniseksi muutoksen jälkeen: getHeroes palautta Observablen
  // jossa on taulukko, joka sisältää Hero -tyyppisiä olioita
  // tässä tehdään observable itse of-operaattorilla

  /*getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messageService.add('HeroService: fetched heroes');
    return heroes;
  }
  */
  // http-pyynnöt sisältävät metodin jolla pyyntö tehdään
  // yleisimmät metodit ovat: get, post, put, delete
  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    //this.log('fetched heroes'); // ei kannata logata ennen kuin ne oikeasti hauettu
    // palauttaa sankaritaulukon observablessa

    //pipe liittää metodeja getHeroes -metodin suorituksen perään

    // tap-operaattorilla voi tehdä toimenpiteitä observablesta
    // tässä ei tehdä mitää toimenpiteitä vaan ainaoastaa loggaus
    // tekee virheenkäsittelyn heti kun paluuarvo ei ole tullut tai siinä on jokin virhe

    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  //yksittäisen sankarin haku
  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }
  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
  /** DELETE: delete the hero from the server */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found heroes matching "${term}"`) //if else ?:
          : this.log(`no heroes matching "${term}"`)
      ),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
