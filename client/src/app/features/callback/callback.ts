import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkOSService } from '../../core/auth/workos.service';
import { UserService } from '../../core/services/user.service';
import { firstValueFrom } from 'rxjs';

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
})
export class CallbackPage implements OnInit {
  constructor(
    private workosService: WorkOSService,
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const user = await this.workosService.handleCallback();
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      await firstValueFrom(this.userService.getCurrentUser());
      await firstValueFrom(this.userService.getUserProfile());

      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Callback handling failed:', error);
      this.router.navigate(['/login']);
    }
  }
}
