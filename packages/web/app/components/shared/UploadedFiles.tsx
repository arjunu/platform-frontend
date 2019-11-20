import * as cn from "classnames";
import * as React from "react";

import { IKycFileInfo } from "../../lib/api/kyc/KycApi.interfaces";

import * as confirmIcon from "../../assets/img/notifications/success.svg";
import * as styles from "./UploadedFiles.module.scss";

interface IProps {
  files: ReadonlyArray<IKycFileInfo>;
}

export const UploadedFiles: React.FunctionComponent<IProps> = ({ files }) => (
  <div className={cn("c-uploaded-files", styles.uploadedFiles)}>
    {files.map(({ fileName }, index) => (
      <div data-test-id={`multi-file-upload-file-${fileName}`} key={index} className={styles.file}>
        <img src={confirmIcon} className={styles.icon} alt="Uploaded image" />
        <span className={styles.text} title={fileName}>
          {fileName}
        </span>
        {/* TODO Add ability to download and remove file */}
      </div>
    ))}
  </div>
);
