import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkOSService } from '../../core/auth/workos.service';

@Component({
  selector: 'app-callback',
  template: `
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  `,
  standalone: true,
})
export class CallbackPage implements OnInit {
  constructor(
    private workosService: WorkOSService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      // Handle the OAuth callback
      const user = await this.workosService.handleCallback();

      if (user) {
        // Successfully authenticated - redirect to dashboard
        this.router.navigate(['/dashboard']);
      } else {
        // No user found - redirect to login
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Callback handling failed:', error);
      this.router.navigate(['/login']);
    }
  }
}
