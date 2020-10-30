import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']

})

export class HeaderComponent implements OnInit {
    ngOnInit(): void {
    }
    
    activeOptMenu(menu, opcion) {
        for (let i = 0; i < menu.children.length; i++) {
            menu.children[i].children[0].classList.remove("bg-light");
        }
        opcion.classList.add('bg-light')
    }
}