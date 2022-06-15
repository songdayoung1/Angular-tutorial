import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HEROES } from '../mock-heroes';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  // her = 'HHHH';
  //heroes = HEROES;
  heroes: Hero[] = [];

  selectedHero?: Hero;

  constructor(
    private heroService: HeroService,
    private messageService: MessageService
  ) {}
  //디렉티브에 바인딩되는 입력 프로퍼티 값은 생성자가 실행된 후에 할당된다는 것

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
    //비동기 방식으로 동작 (직접할당이 아닌 subscribe로 )
  }

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
    this.heroService.addHero({ name } as Hero).subscribe((hero) => {
      this.heroes.push(hero);
    });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter((h) => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe(); //컴포넌트에서 바로 제거
  }
  onSelect(hero: Hero): void {
    this.selectedHero = hero;
    this.messageService.add(`HeroesComponent : Selected hero id = ${hero.id}`);
  }

  ngOnInit(): void {
    this.getHeroes();
    //Angular가 입력 프로퍼티 값을 할당한 후에 컴포넌트 초기화 작업을 할 수 있다.
  }
}
