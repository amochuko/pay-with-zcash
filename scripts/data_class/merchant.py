from dataclasses import dataclass, field
from typing import Optional
from data_class.geo_result import GeoResult


@dataclass
class Merchant:
    """Data clas for the Merchat structure"""

    id: str
    name: str
    category: str
    website: Optional[str]
    geo: GeoResult = field(default_factory=GeoResult)
    raw: dict = field(default_factory=dict)  # original input row
