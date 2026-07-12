import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserStore } from '../../core/store/user.store';
import { CartService } from '../../core/services/cart.service';
import { CartComponent } from '../../shared/components/cart/cart.component';

interface Product {
  id: string;
  name: string;
  price: number;
  badge?: string;
  description?: string;
  includes?: string[];
  guide?: string;
  system?: string;
}

@Component({
  selector: 'app-landing',
  imports: [AsyncPipe, FormsModule, CartComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingPage {
  homeImgUrl = 'assets/images/logo.png';
  cartOpen = false;
  faqOpen: number | null = null;
  trialEmail = '';

  featuredProduct: Product = {
    id: 'jump-start',
    name: "Randumb's Jump Start",
    badge: 'Most Complete',
    price: 89,
    description:
      'All five tools in one package plus a 20-minute setup call. We go through your info together, get everything configured for your situation, and you leave knowing exactly how to use each system. The individual pairs below are a subset of this — if you know you want more than one, this is the better move.',
    includes: [
      "Get Ready System — warmup plan built around what you're training that day.",
      'Power Program System — generates a full lifting program based on your goals.',
      'Progression Engine — tells you exactly what to do next for each exercise.',
      'Macro Maker System — generates meal plans around your goals. (coming soon)',
      'Body Restoration System — generates a recovery plan based on your body. (coming soon)',
      '20-min 1-1 setup call with John (within 48 hrs of purchase)',
    ],
  };

  pairProducts: Product[] = [
    {
      id: 'build-program',
      name: 'Build Your Program',
      price: 29,
      guide: 'Program Creation Guide — how to build a lifting program from scratch. Progressive overload, exercise selection, rep ranges, intensity, and long-term planning.',
      system: 'Power Program System — input your goals, schedule, and equipment. The system builds the program.',
    },
    {
      id: 'nail-nutrition',
      name: 'Nail Your Nutrition',
      price: 29,
      guide: 'Hydration & Supplement Quick Guide — what to take, what to skip, how much water actually matters.',
      system: 'Macro Maker System — generates a meal plan around your goals and current eating habits. (coming soon)',
    },
    {
      id: 'fix-recovery',
      name: 'Fix Your Recovery',
      price: 29,
      guide: "Sleep Guide — how to fix a broken sleep schedule, what's worth trying, and what's just noise.",
      system: 'Body Restoration System — generates a recovery or rehab plan based on what your body needs. (coming soon)',
    },
  ];

  features = [
    {
      title: '24/7 Text Access',
      description:
        'Message me whenever something comes up. Form question, schedule issue, something feels off. I respond same day, usually faster.',
    },
    {
      title: 'Weekly 30-Min Call',
      description:
        'One call per week to go over your numbers and adjust whatever needs adjusting. Scheduled around your week.',
    },
    {
      title: 'Training Plan Built for You',
      description:
        "Built around your equipment, schedule, and starting point. Not a template with your name on it.",
    },
    {
      title: 'Diet and Sleep Action Steps',
      description:
        "Not a meal plan, those don't stick. Simple, practical changes based on where you're actually at right now.",
    },
    {
      title: 'Weekly Adjustments',
      description: "The plan changes when your data says it should. That's the whole point.",
    },
    {
      title: 'No Guesswork',
      description:
        "You know what you're doing, why you're doing it, and what to change if it stops working.",
    },
  ];

  steps = [
    {
      title: 'Apply',
      description: 'Short form, tells me your schedule, equipment, goals, and history. Takes 5 minutes.',
    },
    {
      title: 'Get your plan',
      description:
        "I send you your training plan and action steps for diet and sleep. We start from where you are, not where you wish you were.",
    },
    {
      title: 'Track, check in, adjust',
      description:
        "You log your workouts, we talk weekly, and the plan gets updated based on what the data shows. Not vibes. Not random changes.",
    },
  ];

  faqs = [
    {
      q: 'Do I need to already be going to the gym?',
      a: 'No. We figure out what you have access to and go from there.',
    },
    {
      q: 'How much time does this actually take per week?',
      a: "Workouts run 45–75 minutes depending on where you're at. Beyond that it's a few minutes logging your sessions and the weekly call. That's it.",
    },
    {
      q: 'Why no meal plan?',
      a: "Because meal plans almost never stick. You get realistic action steps based on your current habits, and we build from there over time.",
    },
    {
      q: 'What if my schedule is unpredictable or I travel a lot?',
      a: "That's the kind of thing we handle upfront. The plan is built around your actual life.",
    },
    {
      q: "How do I know if I'm a good fit?",
      a: "If you're willing to track your workouts, follow the plan, and actually tell me when something isn't working, you'll do fine. If you want someone to just validate whatever you're already doing, this isn't the right fit.",
    },
  ];

  constructor(
    public router: Router,
    private userStore: UserStore,
    public cart: CartService,
  ) {
    if (this.userStore.getUser()) {
      this.router.navigate(['/']);
    }
  }

  toggleFaq(i: number): void {
    this.faqOpen = this.faqOpen === i ? null : i;
  }

  addToCart(product: Product): void {
    this.cart.add({ id: product.id, name: product.name, price: product.price, badge: product.badge });
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  navigateToFreeCommunity(): void {
    window.location.href = 'https://www.skool.com/randumbs-garage-gym-4206';
  }
}
