import { storiesOf } from "@storybook/react";
import * as React from "react";
import { object, string } from "yup";

import { Field } from "./Field";

import city from "../../assets/img/eto/city.png";

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

storiesOf("Atoms|Field", module).add("default", () => (
  <Field name="foo" value={html} schema={object({ foo: string().meta({ isWysiwyg: true }) })} />
));
