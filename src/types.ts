export type RegistryKind = "Class" | "Property" | "Enumeration" | "EnumerationValue" | "DataType" | "Unknown";

export type RegistryEntity = {
  id: string;
  name: string;
  kind: RegistryKind;
  label?: string;
  comment?: string;
  parents: string[];
  children: string[];
  domainIncludes: string[];
  rangeIncludes: string[];
};

export type RegistryIndexes = {
  fetchedAt: string;
  sourceUrl: string;
  entities: Record<string, RegistryEntity>;
  types: Record<string, RegistryEntity>;
  properties: Record<string, RegistryEntity>;
  typeProperties: Record<string, string[]>;
  propertyRanges: Record<string, string[]>;
  parentChildren: Record<string, string[]>;
};
