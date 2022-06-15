import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  constructor(public messageService: MessageService) {}
  //Angular에서는 public 으로 선언된 컴포넌트 프로퍼티만 바인딩할 수 있다.

  ngOnInit(): void {}
}
