import * as cn from "classnames";
import { connect, FieldArray, getIn } from "formik";
import { get, isEqual } from "lodash/fp";
import * as React from "react";

import { TSocialChannelsType } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { CommonHtmlProps, TFormikConnect } from "../../types";
import { FormField } from "./forms";
import { InlineIcon } from "./icons";

import * as iconChat from "../../assets/img/inline_icons/icon-menu-help.svg";
import * as facebookIcon from "../../assets/img/inline_icons/social_facebook.svg";
import * as githubIcon from "../../assets/img/inline_icons/social_github.svg";
import * as googleIcon from "../../assets/img/inline_icons/social_google_plus.svg";
import * as instagramIcon from "../../assets/img/inline_icons/social_instagram.svg";
import * as linkedinIcon from "../../assets/img/inline_icons/social_linkedin.svg";
import * as mediumIcon from "../../assets/img/inline_icons/social_medium.svg";
import * as redditIcon from "../../assets/img/inline_icons/social_reddit.svg";
import * as slackIcon from "../../assets/img/inline_icons/social_slack.svg";
import * as telegramIcon from "../../assets/img/inline_icons/social_telegram.svg";
import * as socialTwitter from "../../assets/img/inline_icons/social_twitter.svg";
import * as xingIcon from "../../assets/img/inline_icons/social_xing.svg";
import * as youtubeIcon from "../../assets/img/inline_icons/social_youtube.svg";
import * as styles from "./SocialProfilesEditor.module.scss";

export const SOCIAL_PROFILES_ICONS = [
  {
    name: "twitter",
    placeholder: "Twitter",
    svgIcon: socialTwitter,
    preSelected: true,
  },
  {
    name: "facebook",
    placeholder: "Facebook",
    svgIcon: facebookIcon,
  },
  {
    name: "linkedin",
    placeholder: "LinkedIn",
    svgIcon: linkedinIcon,
  },
  {
    name: "slack",
    placeholder: "Slack",
    svgIcon: slackIcon,
  },
  {
    name: "medium",
    placeholder: "Medium",
    svgIcon: mediumIcon,
  },
  {
    name: "reddit",
    placeholder: "Reddit",
    svgIcon: redditIcon,
  },
  {
    name: "telegram",
    placeholder: "Telegram",
    svgIcon: telegramIcon,
  },
  {
    name: "github",
    placeholder: "Github",
    svgIcon: githubIcon,
  },
  {
    name: "instagram",
    placeholder: "Instagram",
    svgIcon: instagramIcon,
  },
  {
    name: "gplus",
    placeholder: "Google plus",
    svgIcon: googleIcon,
  },
  {
    name: "youtube",
    placeholder: "YoutTube",
    svgIcon: youtubeIcon,
  },
  {
    name: "xing",
    placeholder: "Xing",
    svgIcon: xingIcon,
  },
  {
    name: "bitcointalk",
    placeholder: "Bitcointalk",
    svgIcon: iconChat,
  },
];

export const SOCIAL_PROFILES_PERSON = [
  {
    name: "medium",
    placeholder: "Medium",
    svgIcon: mediumIcon,
  },
  {
    name: "twitter",
    placeholder: "Twitter",
    svgIcon: socialTwitter,
  },
  {
    name: "linkedin",
    placeholder: "LinkedIn",
    svgIcon: linkedinIcon,
  },
];

const SocialMediaTags: React.FunctionComponent<{
  profiles: ISocialProfile[];
  className?: string;
  onClick: (index: number) => void;
  selectedFields: ReadonlyArray<boolean>;
}> = props => {
  const { profiles, className, onClick, selectedFields } = props;
  return (
    <div className={cn(styles.socialProfilesEditor, className)}>
      <div className={styles.tabs}>
        {profiles.map(({ name, svgIcon }, index) => (
          <button
            data-test-id={`social-profiles.profile-button.${name}`}
            onClick={() => onClick(index)}
            className={cn({ "is-selected": Boolean(selectedFields[index]) }, styles.tab)}
            key={name}
            type="button"
          >
            <InlineIcon svgIcon={svgIcon} />
          </button>
        ))}
      </div>
    </div>
  );
};

interface ISingleMediaLinkFieldInternalProps {
  name: string;
  profile: ISocialProfile;
}

const SingleMediaLinkField: React.FunctionComponent<ISingleMediaLinkFieldInternalProps &
  CommonHtmlProps> = props => {
  const { profile, name } = props;

  return (
    <FormField
      name={`${name}.url`}
      placeholder={profile.placeholder || profile.name}
      data-test-id={`social-profiles.profile-input.${profile.name}`}
    />
  );
};

export interface ISocialProfile {
  name: string;
  svgIcon: string;
  placeholder?: string;
  url?: string;
  preSelected?: boolean;
}

interface IProps {
  className?: string;
  profiles: ISocialProfile[];
  name: string;
}

interface IState {
  selectedFields: ReadonlyArray<boolean>;
  filteredFields: boolean[];
}

interface IProfilesWithData {
  selectedFields: boolean[];
  userData: { type: string; url: string }[];
}

class SocialProfilesEditorLayout extends React.Component<IProps & TFormikConnect, IState> {
  state: IState = { selectedFields: [], filteredFields: [] };

  setSelectedFields = () => {
    const {
      profiles,
      name,
      formik: { setFieldValue, values },
    } = this.props;
    const socialMediaValues: TSocialChannelsType = getIn(values, name) || [];

    const profilesWithData = profiles.reduce(
      (acc: IProfilesWithData, profile) => {
        const previousLink = socialMediaValues.find(v => v.type === profile.name);
        const value: string = previousLink ? previousLink.url || "" : "";
        return {
          selectedFields: acc.selectedFields.concat([profile.preSelected ? true : !!value]),
          userData: acc.userData.concat([{ type: profile.name, url: value }]),
        };
      },
      { selectedFields: [], userData: [] },
    );

    setFieldValue(name, profilesWithData.userData);
    this.setState(() => ({ selectedFields: profilesWithData.selectedFields }));
  };

  componentDidMount(): void {
    this.setSelectedFields();
  }

  shouldComponentUpdate(nextProps: IProps & TFormikConnect, nextState: IState): boolean {
    const {
      formik: { values },
      name,
    } = this.props;
    const {
      formik: { values: newValues },
    } = nextProps;

    return !isEqual(get(name, newValues), get(name, values)) || !isEqual(this.state, nextState);
  }

  toggleProfileVisibility = (index: number): void => {
    const {
      formik: { setFieldValue },
      name,
    } = this.props;
    const newSelectedFields = [...this.state.selectedFields];
    newSelectedFields[index] = !this.state.selectedFields[index];
    setFieldValue(`${name}.${index}url`, "");
    this.setState({ selectedFields: newSelectedFields });
  };

  render(): React.ReactNode {
    const { profiles, className, name } = this.props;
    const { selectedFields } = this.state;

    return (
      <section data-test-id={name} className={className}>
        <SocialMediaTags
          profiles={profiles}
          onClick={this.toggleProfileVisibility}
          selectedFields={selectedFields}
        />
        <FieldArray
          name={name}
          render={_ =>
            selectedFields.map(
              (singleField: boolean, index: number) =>
                singleField && (
                  <SingleMediaLinkField
                    key={index}
                    name={`${name}.${index}`}
                    profile={profiles[index]}
                  />
                ),
            )
          }
        />
      </section>
    );
  }
}

export const SocialProfilesEditor = connect<IProps, TSocialChannelsType>(
  SocialProfilesEditorLayout,
);
