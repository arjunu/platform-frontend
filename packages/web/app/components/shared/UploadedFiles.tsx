import * as cn from "classnames";
import * as React from "react";

import { IKycFileInfo } from "../../lib/api/kyc/KycApi.interfaces";

import * as styles from "./UploadedFiles.module.scss";

interface IProps {
  files: ReadonlyArray<IKycFileInfo>;
}

export const UploadedFiles: React.FunctionComponent<IProps> = ({ files }) => (
  <div className={cn("c-uploaded-files", styles.uploadedFiles)}>
    {files.map(({ fileName, preview }, index) => (
      <div data-test-id={`multi-file-upload-file-${fileName}`} key={index} className={styles.file}>
        <span className={styles.text} title={fileName}>
          {fileName} {preview}
        </span>
        {/* TODO Add ability to download and remove file */}
      </div>
    ))}
  </div>
);
