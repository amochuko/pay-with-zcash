import { serverEnv } from "../server-env";
import { Geocoder } from "./geocoder";

export function createGeocoderFromEnv(): Geocoder {
  return new Geocoder({
    userAgent: serverEnv.NOMINATIM_USER_AGENT!,
    baseUrl: serverEnv.NOMINATIM_BASE_URL,
  });
}
