import { TEtoMediaData, TSocialChannelsType, TSocialChannelType } from "../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { XOR } from "../../../types";

export const getTwitterUrl = (socialChannels: TSocialChannelsType | undefined) => {
  if (!socialChannels) {
    return undefined;
  } else {
    const twitterData = socialChannels.find((c: TSocialChannelType) => c.type === "twitter");
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
