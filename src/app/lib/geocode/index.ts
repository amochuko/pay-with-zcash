import { env } from "../env";
import { Geocoder } from "./geocoder";

export function createGeocoderFromEnv(): Geocoder {
  return new Geocoder({
    userAgent: env.NOMINATIM_USER_AGENT!,
    baseUrl: env.NOMINATIM_BASE_URL,
  });
}
