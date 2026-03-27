import { createClient } from "@osdk/client";
import { createPublicOauthClient } from "@osdk/oauth";
import { $ontologyRid } from "@grid/sdk";

const foundryUrl = import.meta.env.VITE_FOUNDRY_URL;
const clientId = import.meta.env.VITE_FOUNDRY_CLIENT_ID;

export const auth = createPublicOauthClient(clientId, foundryUrl, "http://localhost:5173/auth/callback");

export const client = createClient(foundryUrl, $ontologyRid, auth);
