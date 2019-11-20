import { TEtoKeyIndividualType } from "../../../lib/api/eto/EtoApi.interfaces.unsafe";

export const selectActiveCarouselTab = (elements: any[]): number => {
  for (let element in elements) {
    const el = elements[parseInt(element, 10)];

    if (!el) {
      return 0;
    }

    if (el.members && el.members.length > 0 && el.members[0].name.length) {
      return parseInt(element, 10);
    }
  }

  return 0;
};

export const areThereIndividuals = (
  individual: TEtoKeyIndividualType | undefined,
): individual is TEtoKeyIndividualType =>
  !!individual &&
  !!individual.members &&
  !!individual.members[0] &&
  // need to check whether name is not empty
  // due to the way key individuals form saved values in past
  !!individual.members[0].name.length;
