from dataclasses import dataclass, field
from typing import Optional

# import data_class.geo_result
from data_class import geo_result


@dataclass
class Merchant:
    """Data clas for the Merchat structure"""

    id: str
    name: str
    category: str
    website: Optional[str]
    geo: geo_result.GeoResult = field(default_factory=geo_result.GeoResult)
    raw: dict = field(default_factory=dict)  # original input row
