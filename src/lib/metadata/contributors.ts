import type { Contributor } from "./types";

type CrossrefPerson = {
  given?: string;
  family?: string;
  name?: string;
};

export function contributorsFromCrossref(people?: CrossrefPerson[]): Contributor[] {
  if (!people?.length) return [];
  return people
    .map((person) => {
      if (person.family || person.given) {
        return {
          given: person.given,
          family: person.family
        };
      }
      if (person.name) return { literal: person.name };
      return undefined;
    })
    .filter(Boolean) as Contributor[];
}

export function contributorsFromGoogleBooks(authors?: string[]): Contributor[] {
  if (!authors?.length) return [];
  return authors.map((author) => contributorFromName(author));
}

export function contributorFromName(name: string): Contributor {
  const clean = name.trim();
  if (!clean) return { literal: "" };

  if (clean.includes(",")) {
    const [family, given] = clean.split(",").map((part) => part.trim());
    return { family, given };
  }

  const parts = clean.split(/\s+/);
  if (parts.length === 1) return { literal: clean };
  return {
    given: parts.slice(0, -1).join(" "),
    family: parts.at(-1)
  };
}

export function contributorsToInputValue(contributors: Contributor[]) {
  return contributors
    .map((person) => {
      if (person.literal) return person.literal;
      return [person.given, person.family].filter(Boolean).join(" ");
    })
    .filter(Boolean)
    .join("; ");
}

export function contributorsFromInput(value: string): Contributor[] {
  return value
    .split(";")
    .map((name) => name.trim())
    .filter(Boolean)
    .map(contributorFromName);
}
