export const schemaOrgMini = {
  "@context": {
    "schema": "https://schema.org/",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  },
  "@graph": [
    {
      "@id": "schema:Thing",
      "@type": "rdfs:Class",
      "rdfs:label": "Thing",
      "rdfs:comment": "The most generic type of item."
    },
    {
      "@id": "schema:CreativeWork",
      "@type": "rdfs:Class",
      "rdfs:label": "CreativeWork",
      "rdfs:comment": "The most generic kind of creative work.",
      "rdfs:subClassOf": { "@id": "schema:Thing" }
    },
    {
      "@id": "schema:Article",
      "@type": "rdfs:Class",
      "rdfs:label": "Article",
      "rdfs:comment": "An article, such as a news article or report.",
      "rdfs:subClassOf": { "@id": "schema:CreativeWork" }
    },
    {
      "@id": "schema:BlogPosting",
      "@type": "rdfs:Class",
      "rdfs:label": "BlogPosting",
      "rdfs:comment": "A blog post.",
      "rdfs:subClassOf": { "@id": "schema:Article" }
    },
    {
      "@id": "schema:Text",
      "@type": "rdfs:Class",
      "rdfs:label": "Text",
      "rdfs:comment": "Data type: text."
    },
    {
      "@id": "schema:Person",
      "@type": "rdfs:Class",
      "rdfs:label": "Person",
      "rdfs:comment": "A person."
    },
    {
      "@id": "schema:headline",
      "@type": "rdf:Property",
      "rdfs:label": "headline",
      "rdfs:comment": "Headline of the article.",
      "schema:domainIncludes": { "@id": "schema:CreativeWork" },
      "schema:rangeIncludes": { "@id": "schema:Text" }
    },
    {
      "@id": "schema:author",
      "@type": "rdf:Property",
      "rdfs:label": "author",
      "rdfs:comment": "The author of this content.",
      "schema:domainIncludes": { "@id": "schema:CreativeWork" },
      "schema:rangeIncludes": [
        { "@id": "schema:Person" },
        { "@id": "schema:Organization" }
      ]
    }
  ]
};
