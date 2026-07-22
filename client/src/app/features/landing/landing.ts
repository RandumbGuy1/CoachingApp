import { Component, ViewChildren, QueryList, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserStore } from '../../core/store/user.store';
import { CartService } from '../../core/services/cart.service';
import { CartComponent } from '../../shared/components/cart/cart.component';
import { AuthService } from '../../core/auth/auth.service';
import { UserTier } from '../../core/enums/user-tier.enum';
import { WorkOSService } from '../../core/auth/workos.service';

@Component({
  selector: 'app-landing',
  imports: [AsyncPipe, FormsModule, CartComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingPage {
  readonly UserTier = UserTier;

  homeImgUrl = 'assets/images/logo.png';
  cartOpen = false;
  profileOpen = false;
  faqOpen: number | null = null;
  trialEmail = '';

  // Set a YouTube video ID here to show the embed on the hero (leave empty to hide)
  heroVideoId = 'XVSdHPxObt8';

  get heroVideoUrl(): SafeResourceUrl | null {
    if (!this.heroVideoId) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.heroVideoId}?rel=0&modestbranding=1`
    );
  }

  aboutItems: CarouselItem[] = [
    { type: 'image', src: 'assets/images/testimonials/self-image.png' },
    { type: 'image', src: 'assets/images/testimonials/self-image-2.webp' },
    { type: 'video', src: 'assets/videos/testimonials/415-rdl-me.mp4' },
    { type: 'video', src: 'assets/videos/testimonials/385-squat.mp4' },
    { type: 'video', src: 'assets/videos/testimonials/315-rdl.mp4' },
    { type: 'video', src: 'assets/videos/testimonials/240-bench.mp4' },
    { type: 'video', src: 'assets/videos/testimonials/225-bench.mp4' },
    { type: 'video', src: 'assets/videos/testimonials/225-bench-2.mp4' },
    { type: 'video', src: 'assets/videos/testimonials/pull-ups.mp4' },
    { type: 'image', src: 'assets/images/testimonials/back.avif' },
    { type: 'image', src: 'assets/images/testimonials/cedzilla.avif' },
    { type: 'image', src: 'assets/images/testimonials/koolstool.webp' },
    { type: 'image', src: 'assets/images/testimonials/lowca.avif' },
  ];
  aboutImageIndex = 0;

  @ViewChildren('slide') slides!: QueryList<ElementRef<HTMLDivElement>>;

  private pauseCurrentVideo(): void {
    this.slides?.toArray()[this.aboutImageIndex]?.nativeElement.querySelector('video')?.pause();
  }

  prevImage(): void {
    this.pauseCurrentVideo();
    this.aboutImageIndex = (this.aboutImageIndex - 1 + this.aboutItems.length) % this.aboutItems.length; 
  }

  nextImage(): void {
    this.pauseCurrentVideo();
    this.aboutImageIndex = (this.aboutImageIndex + 1) % this.aboutItems.length; 
  }

  goToSlide(i: number): void {
    this.pauseCurrentVideo();
    this.aboutImageIndex = i;
  }

  coachingProduct: Product = {
    id: 'coaching',
    name: "Randumb's 1-1 Coaching",
    badge: 'Most Return',
    price: 99,
    description: 'Month to month. Cancel whenever you want.',
  }

  featuredProduct: Product = {
    id: 'jump-start',
    name: "Randumb's Jump Start",
    badge: 'Most Value',
    price: 68.99,
    description:
      'All five tools in one package plus a 20-minute setup call. We go through your info together, get everything configured for your situation, and you leave knowing exactly how to use each system.',
    includes: [
      "Get Ready System: Generates a warmup plan built around what you're training that day.",
      'Power Program System: Generates a full lifting program based on your info and goals.',
      'Progression Engine: Tells you exactly what to do next for each exercise.',
      'Macro Maker System: Generates meal plans around your goals. (coming soon)',
      'Body Restoration System: Generates a recovery and rehab plan based on your body. (coming soon)',
      '20-min 1-1 setup call with John (within 48 hrs of purchase)',
    ],
  };

  pairProducts: Product[] = [
    {
      id: 'build-program',
      name: 'Build Your Program',
      price: 34.99,
      guide: 'The Program Manual: How to build a lifting program from scratch. Progressive overload, exercise selection, rep ranges, intensity, and long-term planning.',
      system: 'Power Program: Input your goals, schedule, and equipment. The system builds the program.',
    },
    {
      id: 'nail-nutrition',
      name: 'Nail Your Nutrition',
      price: 34.99,
      comingSoon: true,
      guide: 'The Hydration x Supplement Manual: What to take, what to skip, how much water actually matters.',
      system: 'Macro Maker: Generates a meal plan around your goals and current eating habits. (coming soon)',
    },
    {
      id: 'fix-recovery',
      name: 'Fix Your Recovery',
      price: 19.99,
      comingSoon: true,
      guide: "The Sleep Manual: How to fix a broken sleep schedule, what's worth trying, and what's bullshit.",
      system: 'Body Restoration: Generates a recovery and rehab plan based on what your body needs. (coming soon)',
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
      description: 'Short questionaire, tells me your schedule, equipment, goals, and history. Takes 5 minutes.',
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
    {
      q: "Are there refunds?",
      a: "If you cancel within the first 30 days, you get a full refund. After that, no refunds. You can cancel anytime.",
    },
    {
      q: "How can I cancel?",
      a: "Just complete the annonymous form that will be provided. Basically lets me know why you want to cancel and what I can do better, then you get the cancel link.",
    },
  ];

  //TODO:
  // - Hook up the shopping cart to the user backend so that it persists across sessions and devices
  // - Create first draft of buying programs with a checkout page and Stripe integration
  // - Hook up user entitelements to the backend so that users can only access the programs they have purchased
  // - Add a "My Account" page where users can view their current subscription, change their password, and update their profile info
  // - Use entitlement data as an extra authentication layer to prevent users from accessing programs they haven't purchased

  isWorkOSLoading = false;

  constructor(
    public router: Router,
    public userStore: UserStore,
    public cart: CartService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private workosService: WorkOSService,
  ) {}

  async signInWithWorkOS() {
    this.isWorkOSLoading = true;
    this.cdr.detectChanges();

    try {
      await this.workosService.signIn();

      const user = this.workosService.getUser();
      if (user) this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.cdr.detectChanges();
    } finally {
      this.isWorkOSLoading = false;
      this.cdr.detectChanges();
    }
  }

  async signUpWithWorkOS() {
    this.isWorkOSLoading = true;
    this.cdr.detectChanges();

    try {
      await this.workosService.signUp();

      const user = this.workosService.getUser();
      if (user) this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.cdr.detectChanges();
    } finally {
      this.isWorkOSLoading = false;
      this.cdr.detectChanges();
    }
  }

  logout(): void {
    this.authService.logout();
    this.profileOpen = false;
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
