import { Injectable } from '@angular/core';
import { createClient, type User as WorkOSUser } from '@workos-inc/authkit-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

type WorkOSClient = Awaited<ReturnType<typeof createClient>>;

@Injectable({ providedIn: 'root' })
export class WorkOSService {
  private client: WorkOSClient | null = null;
  private clientReady$ = new BehaviorSubject<boolean>(false);
  private workosUser$ = new BehaviorSubject<WorkOSUser | null>(null);

  constructor() {
    this.initClient();
  }

  private async initClient(): Promise<void> {
    try {
      this.client = await createClient(environment.workosClientId, {
        redirectUri: environment.workosRedirectUri,
      });

      // Check if user is already authenticated
      const user = this.client.getUser();
      this.workosUser$.next(user);
      this.clientReady$.next(true);
    } catch (error) {
      console.error('Failed to initialize WorkOS client:', error);
      this.clientReady$.next(true); // Still mark as ready so app doesn't hang
    }
  }

  /**
   * Wait for the WorkOS client to be initialized
   */
  isReady(): Observable<boolean> {
    return this.clientReady$.asObservable();
  }

  /**
   * Get the current WorkOS user state as an observable
   */
  getWorkOSUser(): Observable<WorkOSUser | null> {
    return this.workosUser$.asObservable();
  }

  /**
   * Get the current WorkOS user synchronously (may be null if not authenticated)
   */
  getUser(): WorkOSUser | null {
    return this.client?.getUser() ?? null;
  }

  /**
   * Trigger sign in via WorkOS AuthKit popup
   * Must be called from a user gesture (click handler)
   */
  async signIn(): Promise<void> {
    if (!this.client) {
      console.error('WorkOS client not initialized');
      return;
    }

    try {
      await this.client.signIn();
      const user = this.client.getUser();
      this.workosUser$.next(user);
    } catch (error) {
      console.error('WorkOS sign in failed:', error);
      throw error;
    }
  }

  /**
   * Trigger sign up via WorkOS AuthKit, landing directly on the sign-up screen
   * Must be called from a user gesture (click handler)
   */
  async signUp(): Promise<void> {
    if (!this.client) {
      console.error('WorkOS client not initialized');
      return;
    }

    try {
      await this.client.signUp();
      const user = this.client.getUser();
      this.workosUser$.next(user);
    } catch (error) {
      console.error('WorkOS sign up failed:', error);
      throw error;
    }
  }

  /**
   * Sign out from WorkOS
   */
  async signOut(): Promise<void> {
    if (!this.client) {
      console.error('WorkOS client not initialized');
      return;
    }

    try {
      await this.client.signOut();
      this.workosUser$.next(null);
    } catch (error) {
      console.error('WorkOS sign out failed:', error);
      throw error;
    }
  }

  /**
   * Get the access token for API calls
   */
  async getAccessToken(): Promise<string | undefined> {
    if (!this.client) {
      console.error('WorkOS client not initialized');
      return undefined;
    }

    try {
      return await this.client.getAccessToken();
    } catch (error) {
      console.error('Failed to get access token:', error);
      return undefined;
    }
  }

  /**
   * Handle the OAuth callback - called when user returns from auth
   */
  async handleCallback(): Promise<WorkOSUser | null> {
    if (!this.client) {
      console.error('WorkOS client not initialized');
      return null;
    }

    const user = this.client.getUser();
    this.workosUser$.next(user);
    return user;
  }
}
