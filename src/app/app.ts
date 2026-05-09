import { Component, signal } from '@angular/core';
import { JsonFormatter } from './json-formatter/json-formatter';

@Component({
  selector: 'app-root',
  imports: [ JsonFormatter ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('JsonFormatter');
}
