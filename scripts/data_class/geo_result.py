from dataclasses import dataclass, field
from typing import Optional
from enum import Enum


class GeoStatus(Enum):
    """Enum for Status of geo data"""
    RESOLVED = 1
    PARTIAL = 2
    UNKNOWN = 3


class GeoConfidence(Enum):
    """Enum for Confidence of coordinate data"""
    HIGH = 1
    LOW = 2
    APPROXIMATED = 3
    NONE = 4


class GeoCoordinatesSource(Enum):
    """Enum for Coordinates Source"""
    SCHEME_ORG = 1
    HTML_HEURISTIC = 2
    NOMINATIM = 3
    TLD_FALLBACK = 4
    NONE = 5


class GeoRegion(Enum):
    """Enum for Region"""
    AFRICA = 1
    EUROPE = 2
    AMERICAS = 3
    ASIA = 4
    OCEANIA = 5
    NONE = 6


@dataclass
class GeoResult:
    """Structure of the Geo data sorted for"""
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    country_code: Optional[str] = None
    country_name: Optional[str] = None
    city: Optional[str] = None
    region: Optional[GeoRegion] | Optional[str] = GeoRegion.NONE.name
    geo_status: GeoStatus = GeoStatus.UNKNOWN
    geo_confidence: GeoConfidence = GeoConfidence.NONE
    coordinates_source: GeoCoordinatesSource = GeoCoordinatesSource.NONE
    stage_reached: int = 0
    notes: list = field(default_factory=list)
