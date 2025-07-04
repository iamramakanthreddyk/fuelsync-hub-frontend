
/**
 * Authentication Service - Contract Aligned
 * 
 * Implements authentication endpoints exactly as defined in OpenAPI spec
 */

import { contractClient } from '../contract-client';
import type { 
  LoginRequest, 
  LoginResponse 
} from '../api-contract';

export class AuthService {
  /**
   * Regular user authentication (Owner/Manager/Attendant)
   * POST /auth/login
   * Requires x-tenant-id header
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('[AUTH-SERVICE] Regular user login');
    return contractClient.post<LoginResponse>('/auth/login', credentials);
  }

  /**
   * SuperAdmin authentication
   * POST /admin/auth/login
   * No tenant header required
   */
  async adminLogin(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('[AUTH-SERVICE] SuperAdmin login');
    return contractClient.post<LoginResponse>('/admin/auth/login', credentials);
  }

  /**
   * Logout (invalidate token client-side)
   * POST /auth/logout
   */
  async logout(): Promise<void> {
    console.log('[AUTH-SERVICE] User logout');
    return contractClient.post<void>('/auth/logout');
  }

  /**
   * Refresh JWT token
   * POST /auth/refresh
   */
  async refreshToken(): Promise<LoginResponse> {
    console.log('[AUTH-SERVICE] Token refresh');
    return contractClient.post<LoginResponse>('/auth/refresh');
  }
}

export const authService = new AuthService();
