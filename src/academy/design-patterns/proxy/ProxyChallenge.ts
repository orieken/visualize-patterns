export interface Internet {
  connectTo(serverhost: string): string;
}

export class RealInternet implements Internet {
  connectTo(serverhost: string): string {
    return `Connecting to ${serverhost}`;
  }
}

/**
 * CHALLENGE: Implement ProxyInternet to filter banned sites.
 */
export class ProxyInternet implements Internet {
  private realInternet = new RealInternet();
  private bannedSites: string[] = ['banned.com', 'evil.com'];

  connectTo(serverhost: string): string {
    // TODO: Check if host is banned
    // If banned, return "Access Denied"
    // Else delegate to realInternet
    return this.realInternet.connectTo(serverhost); // <-- FIX THIS
  }
}
