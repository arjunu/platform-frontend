import * as React from "react";
import * as sanitizeHtml from "sanitize-html";

import { CommonHtmlProps } from "../../types";

/**
 * This options should be in sync with rich text editor
 * Any modification should be taking with care to not end with security vulnerabilities
 */
export const SANITIZER_OPTIONS = {
  allowedTags: [
    "h2",
    "h3",
    "h4",
    "strong",
    "i",
    "a",
    "ul",
    "ol",
    "li",
    "p",
    "img",
    "figure",
    "figcaption",
    "br",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt"],
  },
  allowedSchemes: ["https"],
  allowedClasses: {
    figure: ["image", "image-style-align-left", "image-style-align-right"],
  },
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }),
  },
  exclusiveFilter: (frame: sanitizeHtml.IFrame) => {
    switch (frame.tag) {
      case "img": {
        if (!frame.attribs.src) {
          return true;
        }

        if (process.env.NF_ALLOWED_RTE_IMG_HOSTNAMES) {
          // if value is set to start allow any url (even relative one)
          if (process.env.NF_ALLOWED_RTE_IMG_HOSTNAMES === "*") {
            return false;
          }

          const allowedHostnames = process.env.NF_ALLOWED_RTE_IMG_HOSTNAMES.split(",");

          try {
            const url = new URL(frame.attribs.src);

            return !allowedHostnames.includes(url.hostname);
          } catch {
            // if url is not valid omit the tag
            return true;
          }
        }

        // omit tag if we don't allow any img hostnames
        return true;
      }
      default:
        return false;
    }
  },
};

type TSanitizedHtml = { unsafeHtml: string };

export const SanitizedHtml: React.FunctionComponent<TSanitizedHtml & CommonHtmlProps> = ({
  unsafeHtml,
  className,
}) => (
  <span
    className={className}
    dangerouslySetInnerHTML={{ __html: sanitizeHtml(unsafeHtml, SANITIZER_OPTIONS) }}
  />
);
