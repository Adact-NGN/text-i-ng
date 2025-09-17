"use client";

import { useState, useEffect } from "react";

interface GitHubVersion {
  current: string;
  name: string;
  publishedAt: string;
  url: string;
  body: string;
  isPrerelease: boolean;
  isDraft: boolean;
}

interface UseVersionReturn {
  version: GitHubVersion | null;
  isLoading: boolean;
  error: string | null;
}

export function useVersion(): UseVersionReturn {
  const [version, setVersion] = useState<GitHubVersion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersion = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/version');
        const data = await response.json();
        
        if (data.success) {
          setVersion(data.version);
        } else {
          setError(data.error || 'Failed to fetch version');
        }
      } catch (err) {
        setError('Network error');
        console.error('Failed to fetch GitHub version:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersion();
  }, []);

  return { version, isLoading, error };
}
