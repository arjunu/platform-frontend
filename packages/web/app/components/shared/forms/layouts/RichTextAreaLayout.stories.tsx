import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { RichTextAreaLayoutComponent } from "./RichTextAreaLayout";

import city from "../../../../assets/img/eto/city.png";

const uploadAdapterFactory = () => ({
  upload: () => Promise.resolve({ default: "/image-id" }),
  abort: () => {},
});

const html = `
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>

      <p>Habena Omnias ortum in infernum!</p>

      <a href="https://platform.neufund.org">Neufund Platform</a>

      <strong>bold text</strong>

      <i>italic text</i>

      <ul>
        <li>unordered list 1</li>
        <li>unordered list 2</li>
        <li>unordered list 3</li>
      </ul>

      <ol>
        <li>ordered list 1</li>
        <li>ordered list 2</li>
        <li>ordered list 3</li>
        <li>ordered list 4</li>
      </ol>

      <figure class="image">
        <img src="${city}" alt="" />
        <figcaption>City in the clouds</figcaption>
      </figure>

      <figure class="image image-style-align-left">
        <img src="${city}" alt="" />
      </figure>

      <p>
        Dexter absolutios sensim manifestum de barbatus, bassus acipenser.
        Ferox humani generiss ducunt ad domus. Nunquam pugna devatio. Nix, plasmator, et gemna.
        Cum classis unda, omnes amores convertam bassus, alter orexises.
        Cum demissio persuadere, omnes candidatuses acquirere velox, grandis lubaes.
        Pol, velox itineris tramitem! Eheu, armarium! Mirabilis,
        dexter absolutios sensim manifestum de barbatus, bassus acipenser.
      </p>

      <ol>
        <li>ordered list 1</li>
        <li>ordered list 2</li>
        <li>ordered list 3</li>
        <li>ordered list 4</li>
      </ol>

      <figure class="image image-style-align-right">
        <img src="${city}" alt="" />
      </figure>

      <p>
        Ferox humani generiss ducunt ad domus. Nunquam pugna devatio. Nix, plasmator, et gemna.
        Cum classis unda, omnes amores convertam bassus, alter orexises.
        Cum demissio persuadere, omnes candidatuses acquirere velox, grandis lubaes.
        Pol, velox itineris tramitem! Eheu, armarium! Mirabilis,
        dexter absolutios sensim manifestum de barbatus, bassus acipenser.
        Ferox humani generiss ducunt ad domus. Nunquam pugna devatio. Nix, plasmator, et gemna.
        Cum classis unda, omnes amores convertam bassus, alter orexises.
        Cum demissio persuadere, omnes candidatuses acquirere velox, grandis lubaes.
        Pol, velox itineris tramitem! Eheu, armarium! Mirabilis,
        dexter absolutios sensim manifestum de barbatus, bassus acipenser.
      </p>

      <ul>
        <li>unordered list 1</li>
        <li>unordered list 2</li>
        <li>unordered list 3</li>
      </ul>
    `;

storiesOf("Atoms|RichTextAreaLayout", module)
  .add("default", () => (
    <RichTextAreaLayoutComponent
      name="bmw"
      value={html}
      onChange={action("onClick")}
      uploadAdapterFactory={uploadAdapterFactory}
    />
  ))
  .add("with placeholder", () => (
    <RichTextAreaLayoutComponent
      name="bmw"
      value={undefined}
      placeholder="Provide some text"
      onChange={action("onClick")}
      uploadAdapterFactory={uploadAdapterFactory}
    />
  ))
  .add("disabled", () => (
    <RichTextAreaLayoutComponent
      name="bmw"
      value={"This is a disabled text area"}
      disabled={true}
      onChange={action("onClick")}
      uploadAdapterFactory={uploadAdapterFactory}
    />
  ))
  .add("invalid", () => (
    <RichTextAreaLayoutComponent
      name="bmw"
      value={"This is a invalid text area"}
      invalid={true}
      onChange={action("onClick")}
      uploadAdapterFactory={uploadAdapterFactory}
    />
  ));
