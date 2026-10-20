import { env } from "../env";
import { Geocoder } from "./geocoder";

export function createGeocoderFromEnv(): Geocoder {
  return new Geocoder({
    userAgent:
      env.NOMINATIM_USER_AGENT ??
      "paywithz.cash-merchant-map/1.0 (https://paywithz.cash)",
    baseUrl: env.NOMINATIM_BASE_URL,
  });
}
