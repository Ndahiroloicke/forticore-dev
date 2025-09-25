const TECH_API_BASE = '/api/tech';

// Helper to normalize URL
const normalizeUrl = (input: string): string => {
  try {
    // If it's already a valid URL, return as is
    new URL(input);
    return input;
  } catch {
    // If not a valid URL, assume it's a domain and add https://
    return `https://${input}`;
  }
};

export interface Technology {
  name: string;
  category: string;
  version: string;
  confidence: number;
  website: string;
  description: string;
}

export interface TechDiscoveryResult {
  url: string;
  total: number;
  technologies: Technology[];
}

export async function discoverTechnologies(url: string): Promise<TechDiscoveryResult> {
  const normalizedUrl = normalizeUrl(url);
  
  const apiUrl = `${TECH_API_BASE}?url=${encodeURIComponent(normalizedUrl)}`;
  
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error: any) {
    console.error('Error discovering technologies:', error);
    throw new Error(`Technology discovery failed: ${error.message}`);
  }
}

