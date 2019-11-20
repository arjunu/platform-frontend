import * as cn from "classnames";
import * as React from "react";

import { TTranslatedString } from "../../../../types";

import * as styles from "./Block.module.scss";

enum EBlockTheme {
  BLUE = styles.themeBlue,
  FLUORESCENT_BLUE = styles.themeFluorescentBlue,
  GREEN = styles.themeGreen,
  GRAY = styles.themeGray,
  SILVER = styles.themeSilver,
  ORANGE = styles.themeOrange,
}

interface IBlockProps {
  theme: EBlockTheme;
  start: number;
  end: number;
  title?: TTranslatedString;
}

interface IBlockTitle {
  title?: TTranslatedString;
  width: number;
}

const BLOCK_HEIGHT = 30;
const BORDER_HEIGHT = 4;
const BACKGROUND_HEIGHT = 18;

const BlockTitle: React.FunctionComponent<IBlockTitle> = ({ title, width }) => (
  <text className={styles.blockText} textAnchor="middle" transform={`translate(${width / 2} 13)`}>
    {title}
  </text>
);

const StartBlock: React.FunctionComponent<IBlockProps> = ({
  title,
  start,
  end,
  theme,
  children,
}) => (
  <g className={cn(styles.block, theme)} transform={`translate(${start})`}>
    <polygon
      className={styles.blockBackground}
      points={`${BLOCK_HEIGHT} 0 ${end} 0 ${end} ${BACKGROUND_HEIGHT} 0 ${BACKGROUND_HEIGHT} 0 ${BACKGROUND_HEIGHT}`}
    />
    <rect
      width={end}
      height={BORDER_HEIGHT}
      y={BACKGROUND_HEIGHT}
      className={styles.blockBorderBottom}
    />
    <BlockTitle title={title} width={end} />

    {children}
  </g>
);

const EndBlock: React.FunctionComponent<IBlockProps> = ({ title, start, end, theme, children }) => (
  <g className={cn(styles.block, theme)} transform={`translate(${start})`}>
    <polygon
      className={styles.blockBackground}
      points={`0 0 ${end -
        BACKGROUND_HEIGHT} 0 ${end} ${BACKGROUND_HEIGHT} ${end} ${BACKGROUND_HEIGHT} 0 ${BACKGROUND_HEIGHT}`}
    />
    <rect
      className={styles.blockBorderBottom}
      width={end}
      height={BORDER_HEIGHT}
      y={BACKGROUND_HEIGHT}
    />
    <BlockTitle title={title} width={end} />

    {children}
  </g>
);

const Block: React.FunctionComponent<IBlockProps> = ({ title, theme, start, end, children }) => (
  <g className={cn(styles.block, theme)} transform={`translate(${start})`}>
    <rect className={styles.blockBackground} width={end} height="19" />
    <rect
      className={styles.blockBorderBottom}
      width={end}
      height={BORDER_HEIGHT}
      y={BACKGROUND_HEIGHT}
    />
    <BlockTitle title={title} width={end} />

    {children}
  </g>
);

export { Block, StartBlock, EndBlock, EBlockTheme };
