/**
 * Gateway token storage utilities
 * Stores and retrieves gateway connection tokens from localStorage
 */

const GATEWAY_TOKEN_KEY = 'claw3d_gateway_token';
const GATEWAY_URL_KEY = 'claw3d_gateway_url';

/**
 * Save gateway token to localStorage
 */
export const saveGatewayToken = (token: string, gatewayUrl: string): void => {
  try {
    if (token.trim()) {
      localStorage.setItem(GATEWAY_TOKEN_KEY, token.trim());
    }
    if (gatewayUrl.trim()) {
      localStorage.setItem(GATEWAY_URL_KEY, gatewayUrl.trim());
    }
  } catch (error) {
    console.warn('[gateway-token] Failed to save token to localStorage:', error);
  }
};

/**
 * Load gateway token from localStorage
 */
export const loadGatewayToken = (): { token: string; gatewayUrl: string } => {
  try {
    const token = localStorage.getItem(GATEWAY_TOKEN_KEY) || '';
    const gatewayUrl = localStorage.getItem(GATEWAY_URL_KEY) || '';
    return { token, gatewayUrl };
  } catch (error) {
    console.warn('[gateway-token] Failed to load token from localStorage:', error);
    return { token: '', gatewayUrl: '' };
  }
};

/**
 * Clear gateway token from localStorage
 */
export const clearGatewayToken = (): void => {
  try {
    localStorage.removeItem(GATEWAY_TOKEN_KEY);
    localStorage.removeItem(GATEWAY_URL_KEY);
  } catch (error) {
    console.warn('[gateway-token] Failed to clear token from localStorage:', error);
  }
};

/**
 * Check if gateway token exists in localStorage
 */
export const hasGatewayToken = (): boolean => {
  try {
    const token = localStorage.getItem(GATEWAY_TOKEN_KEY);
    return Boolean(token && token.trim());
  } catch {
    return false;
  }
};
