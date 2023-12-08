import { Component, Inject, Renderer2 } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  public xtoggle:boolean = true;
  public BASE_URL: string = this.appService.BASE_URL;

  constructor(private appService: AppService, @Inject(DOCUMENT) private document: Document, private renderer: Renderer2,){}

  ngOnInit(): void {}

  toggle(){
    this.xtoggle = this.xtoggle ? false : true;
    if(this.xtoggle){
      this.renderer.removeClass(this.document.body, 'sb-sidenav-toggled');
    }
  
    if(!this.xtoggle){
      this.renderer.addClass(this.document.body, 'sb-sidenav-toggled');
    }
    
  }
}
