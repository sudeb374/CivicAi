# CivicAI Data Sources

> [!WARNING]
> Due to the 2-day hackathon constraint and the brittleness of downloading/cleaning real data dynamically, the dataset below is synthetically generated to match the exact schema of the Census 2011 and data.gov.in databases. These are DEMO/MOCK values for the MVP and should not be presented as real government data.

## 1. Demographics Data (Mocked Census 2011)

- **Source**: Mocked based on Census 2011 India schema.
- **Dataset Name**: `census_2011_mock.csv`
- **Year**: 2011
- **Fields Used**: `state`, `district`, `population`, `households`, `literacy_rate`, `male_population`, `female_population`
- **Limitations**: Data is generated for a subset of districts (e.g., Howrah, Kolkata) and values are synthetic.

## 2. Infrastructure Data (Mocked data.gov.in)

- **Source**: Mocked based on Government Open Data Platform India schemas.
- **Dataset Name**: `infra_mock.csv`
- **Year**: 2023
- **Fields Used**: `state`, `district`, `category` (roads, healthcare, water, education, electricity, internet, transport, other), `infrastructure_gap_score` (0-100)
- **Limitations**: Values are randomized to simulate realistic infrastructure gaps.
