import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of, VirtualTimeScheduler } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private log(message: string) {
    console.log('message', message);
    this.messageService.add(`HeroService : ${message}`);
  }

  private heroesUrl = 'api/heroes';

  private handleError<T>(opertion = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // 리모트 서버로 에러 메시지 보내기
      console.error(error);
      // 사용자가 이해할 수 있는 형태로 변환하기
      this.log(`${opertion} failed : ${error.message}`);
      // 애플리케이션 로직이 끊기지 않도록 기본값으로 받은 객체를 반환합니다.
      return of(result as T);
    };
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  // http://localhost:4200/heroes
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => this.log('fetched heroese')), //옵저버블 데이터를 확인하려면 tap()함수
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  // of()함수 사용시
  // getHeroes(): Observable<Hero[]> {
  //   const heroes = of(HEROES); //목데이터 넘기기
  //   this.messageService.add('HeroService : ok heroes?');
  //   return heroes;
  // }

  // http://localhost:4200/heroes/11
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  // getHero(id: number): Observable<Hero> {
  //   const hero = HEROES.find((h) => h.id === id)!;
  //   this.messageService.add(`HeroService: fetched hero id=${id}`);
  //   // console.log(of(hero), '???');
  //   return of(hero);
  // }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w / id = ${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/ ${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero id =${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    // 빈 내용일 때만 빈 배열 반환
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      // return this.http.get<Hero[]>(`${this.heroesUrl}/ ?name = ${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found heroes matching "${term}"`)
          : this.log(`no heroes matching "${term}"`)
      ),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  /** GET: id에 해당하는 히어로 데이터를 가져옵니다. 존재하지 않으면 `undefined`를 반환합니다. */
  // getHeroNo404<Data>(id: number): Observable<Hero> {
  //   const url = `${this.heroesUrl}/?id=${id}`;
  //   return this.http.get<Hero[]>(url).pipe(
  //     map((heroes) => heroes[0]), // 배열에 있는 항목 중 하나만 반환합니다.
  //     tap((h) => {
  //       const outcome = h ? `fetched` : `did not find`;
  //       this.log(`${outcome} hero id=${id}`);
  //     }),
  //     catchError(this.handleError<Hero>(`getHero id=${id}`))
  //   );
  // }
}
