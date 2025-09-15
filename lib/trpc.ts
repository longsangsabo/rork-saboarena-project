import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  // Check for environment variable first
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    console.log('📍 Using env variable for base URL:', process.env.EXPO_PUBLIC_RORK_API_BASE_URL);
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  // Use the Rork platform URL for development and production
  const defaultUrl = 'https://greetings-project-scb4vi6.rork.com';
  console.log('📍 Using default base URL:', defaultUrl);
  return defaultUrl;
};

const baseUrl = getBaseUrl();
const trpcUrl = `${baseUrl}/api/trpc`;
console.log('🔗 Full tRPC URL:', trpcUrl);

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: trpcUrl,
      transformer: superjson,
      headers: {
        'Content-Type': 'application/json',
      },
      fetch: (url, options) => {
        console.log('🌐 tRPC Fetch:', String(url), options?.method || 'GET');
        return fetch(url as string, options as RequestInit).then(response => {
          console.log('📡 tRPC Response:', response.status, response.statusText);
          if (!response.ok) {
            console.error('❌ tRPC Error Response:', response.status, response.statusText);
          }
          return response;
        }).catch(error => {
          console.error('🚨 tRPC Network Error:', String(error));
          throw error;
        });
      },
    }),
  ],
});