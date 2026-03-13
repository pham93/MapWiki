export interface FeatureProperties {
  code: string;
}

export interface WikiDataSiteLinksResponse {
  entities: { [x: string]: WikiDataSiteLinksEntity };
}

export interface WikiDataSiteLinksEntity {
  id: string;
  type: string;
  sitelinks: { [x: string]: SiteLink } & { enwiki: SiteLink };
}

interface SiteLink {
  site: string;
  title: string;
  badges: string[];
}
