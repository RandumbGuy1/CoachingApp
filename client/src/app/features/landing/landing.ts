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

  get heroVideoUrl(): SafeResourceUrl | null {
    const heroVideoId = 'XVSdHPxObt8'; // Set a YouTube video ID here to show the embed on the hero (leave empty to hide)
    if (!heroVideoId) return null;

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${heroVideoId}?rel=0&modestbranding=1`
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
    price: 199,
    description: '3 Months of Coaching. Cancel whenever you want.',
    includes: [
      'Jump Start serves as the initial setup',
      'Weekly 30 minute checkup calls and protocol updates based on progress',
      'Progress in all metrics tracked extensively',
      '24/7 text support and form checks',
    ],
    bonuses: [
      'Free access to my Programming and Hydration E-books.',
      'I MAKE videos based on your questions',
      'Exclusive video and early video access',
    ]
  }

  secondaryProduct: Product = {
    id: 'jump-start',
    name: "Jump Start",
    badge: 'Most Value',
    price: 29.99,
    description:
      'A 30 minute consultation call following every step I onboard my clients with to set you up to win.' +
      'Additionally, this sets you up perfectly to also work 1-1 with me if you like what you see.',
    includes: [
      '30-min 1-1 setup call with me (within 48 hrs of purchase)',
      'Full rewrite/revision of your workout program',
      'Structured diet approach and actionable steps for improving sleep',
      'Any other Q/A required',
      'Use of premium tooling to create as detailed of iterations as possible',
      'Discount of $30 off my 1-1 coching package'
    ],
    bonuses: [
      'Free access to my Programming and Hydration E-books.'
    ]
  };

  features = [
    {
      title: 'Jump Start',
      description: "Jump Start serves as the initial setup to get you ready ASAP.",
    },
    {
      title: '24/7 Text Access + Form Checks',
      description: "Message me whenever something comes up. Form question, schedule issue, something feels off. I respond same day, usually faster.",
    },
    {
      title: 'Weekly 30-Min Call',
      description: "We meet up and discuss data. The plan changes when your data says it should. That's the whole point.",
    },
    {
      title: 'Training Plan Built for You',
      description: "Built around your equipment, schedule, and starting point. Not just a copy and pasted template.",
    },
    {
      title: 'Actionable Steps for Diet and Sleep',
      description: "Simple, practical changes based on where you're actually at right now.",
    },
    {
      title: 'No Guesswork',
      description: "You know what you're doing, why you're doing it, and what to change if it stops working.",
    },
  ];

  steps = [
    {
      title: 'Apply',
      description: 'Purchase either the program or Jump start and you will then need to fill out an intake form so I can get to know you better.',
    },
    {
      title: 'Schedule',
      description: 'Schedule your 30 minute onboarding call online whenever is convenient for you.',
    },
    {
      title: 'Setup',
      description: "We lock in your training plan, diet, and sleep strategy, nothing left behind. You can access the bonus E-books afterward.",
    },
    {
      title: 'Track, check in, adjust',
      description: "You log your workouts and record sets, we talk weekly, and the plan gets updated as needed to keep you progressing. No guesswork.",
    },
  ];

  faqs = [
    {
      q: "Are there refunds?",
      a: "For 1-1 coaching, if you cancel within the first 30 days, you get a full refund. Following that period there are NO refunds. You can cancel anytime.",
    },
    {
      q: "What about jump start?",
      a: "If you cancel atleast a day before our call then you will be fully refunded.",
    },
    {
      q: "How can I cancel?",
      a: "It's very easy, just complete the anonymous cancellation form provided to you and you will receive the cancellation link once that's completed.",
    },
    {
      q: "Are there any trial runs?",
      a: "The Jump Start program is the closest thing to a trial run. It gives you a taste of what working with me is like and sets you up for success if you choose to continue.",
    },
    {
      q: "What if I have a question or something comes up?",
      a: "You can message me anytime and I will respond same day, usually faster.",
    },
    {
      q: "What if I don't have a gym or equipment?",
      a: "I can build a plan around whatever you have access to. No gym? No problem. No equipment? No problem.",
    },
    {
      q: 'How much time does this actually take per week?',
      a: "However much time we need. I've used as little as 10 minute sessions 3x a week." +
      "Beyond that it's a few minutes logging your sessions and the weekly call. That's it.",
    },
    {
      q: 'What if my schedule is unpredictable as hell?',
      a: "That's the kind of thing we handle upfront. The plan is built around your actual life.",
    },
    {
      q: "How do I know if I'm a good fit?",
      a: "If you're willing to track your workouts, follow the plan, and actually tell me when something isn't working, you'll do fine. If you want someone to just validate whatever you're already doing, this isn't the right fit.",
    },
  ];

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
