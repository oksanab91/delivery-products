import { trigger, animate, transition, style, query, stagger, keyframes } from '@angular/animations';

export const slideListInOutAnimation =
    trigger('slideListInOutAnimation', [
        transition('* => *', [
  
            query(':enter', style({ opacity: 0 }), {optional: true}),
    
            query(':enter', stagger('350ms', [
              animate('1s ease-in', keyframes([
                style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
                style({opacity: .6, transform: 'translateY(15px)',  offset: 0.2}),
                style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
              ]))]), {optional: true})
          ])          
       
    ])

export const slideFormInOutAnimation =
    trigger('slideFormInOutAnimation', [
        transition('* => *', [
            query(':enter', style({ opacity: 0 }), {optional: true}),
    
            query(':enter', stagger('350ms', [
                animate('1s ease-in', keyframes([
                    style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
                    style({opacity: .4, transform: 'translateY(25px)',  offset: 0.2}),
                    style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
                ]))]), {optional: true}),

            query(':leave', style({ opacity: 0 }), {optional: true}),
    
            query(':leave', stagger('150ms', [
                animate('250ms ease-in', keyframes([
                    style({opacity: 1}),
                    style({opacity: 0}),
                ]))]), {optional: true})
        ])
    ])