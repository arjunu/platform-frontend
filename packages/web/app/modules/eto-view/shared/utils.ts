import { TEtoMediaData } from "../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { DeepReadonly, XOR } from "../../../types";
import { TSocialChannel } from "./types";

export const getTwitterUrl = (socialChannels: DeepReadonly<TSocialChannel[]> | undefined) => {
  if (!socialChannels) {
    return undefined;
  } else {
    const twitterData = socialChannels.find((c: TSocialChannel) => c.type === "twitter");
    return twitterData && twitterData.url;
  }
};

export const getTwitterData = (
  companyData: TEtoMediaData,
): XOR<{ showTwitterFeed: true; twitterUrl: string }, { showTwitterFeed: false }> => {
  const twitterUrl = getTwitterUrl(companyData.socialChannels);

  return !!twitterUrl && !companyData.disableTwitterFeed
    ? { showTwitterFeed: true, twitterUrl }
    : { showTwitterFeed: false };
};
