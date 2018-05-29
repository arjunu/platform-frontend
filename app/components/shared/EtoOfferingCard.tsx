import * as React from "react";
import { Link } from "react-router-dom";

import { InlineIcon } from "./InlineIcon";
import { Proportion } from "./Proportion";
import { ITag, Tag } from "./Tag";

import * as linkIcon from "../../assets/img/inline_icons/icon_link.svg";
import * as styles from "./EtoOfferingCard.module.scss";
export interface IProps {
  roundName: string;
  tags: ITag[];
  name: string;
  description: string;
  quote: {
    text: string;
    person: string;
    position: string;
  };
  to: string;
  logo: string;
}

interface IPropsRoundLabel {
  text: string | React.ReactNode;
}

const RoundLabel: React.SFC<IPropsRoundLabel> = ({ text }) => {
  return (
    <svg className={styles.roundLabel} viewBox="0 0 170 100">
      <path
        className={styles.curvyBackground}
        d="M0,102 L0,0 L170.694,0 C166.486,25.398 156.794,41.95 141.616,49.655 C128.623,56.253 93.071,57.423 48.428,72.351 C35.003,76.84 18.86,86.723 0,102 Z"
      />
      <text x="25" y="35">
        {text}
      </text>
    </svg>
  );
};

export const EtoOfferingCard: React.SFC<IProps> = props => {
  return (
    <Link to={props.to} className={styles.card}>
      <Proportion width={2} height={1}>
        <div className={styles.top}>
          <RoundLabel text={props.roundName} />
          <img className={styles.logo} src={props.logo} alt={`${props.name} logo`} />
          <div className={styles.tags}>
            {props.tags.map((tag, index) => <Tag {...tag} key={index} />)}
          </div>
        </div>
      </Proportion>
      <div className={styles.bottom}>
        <InlineIcon svgIcon={linkIcon} />
        <h3 className={styles.name}>{props.name}</h3>
        <p className={styles.description}>{props.description}</p>
        <blockquote className={styles.quote}>
          <p>
            {'"'}
            {props.quote.text}
            {'"'}
          </p>
          <p>
            {"- "}
            {props.quote.person}
            {", "}
            {props.quote.position}
            {" @ "}
            {props.name}
          </p>
        </blockquote>
      </div>
    </Link>
  );
};
