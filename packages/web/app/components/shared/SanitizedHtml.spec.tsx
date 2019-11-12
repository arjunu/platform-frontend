import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { SanitizedHtml } from "./SanitizedHtml";

describe("<SanitizedHtml />", () => {
  let initialEnv: any;

  before(() => {
    initialEnv = process.env.NF_MAY_SHOW_INVESTOR_STATS;
  });

  afterEach(() => {
    process.env.NF_MAY_SHOW_INVESTOR_STATS = initialEnv;
  });

  it("should allow supported basic tags", () => {
    const html = `
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      
      <p>Paragraph first line<br />Paragraph second line</p>
      
      <a href="https://platform.neufund.org">Neufund Platform</a>
      
      <strong>bold text</strong>
      
      <i>italic text</i>
      
      <ul>
        <li>unordered list 1</li>
        <li>unordered list 2</li>
      </ul> 
      
      <ol>
        <li>ordered list 1</li>
        <li>ordered list 2</li>
      </ol>
    `;

    const expectedHtml = `<span>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      
      <p>Paragraph first line<br />Paragraph second line</p>
      
      <a href="https://platform.neufund.org" target="_blank" rel="noopener noreferrer">Neufund Platform</a>
      
      <strong>bold text</strong>
      
      <i>italic text</i>
      
      <ul>
        <li>unordered list 1</li>
        <li>unordered list 2</li>
      </ul> 
      
      <ol>
        <li>ordered list 1</li>
        <li>ordered list 2</li>
      </ol>
    </span>`;

    const component = shallow(<SanitizedHtml unsafeHtml={html} />);

    expect(component.html()).to.be.eq(expectedHtml);
  });

  it("should allow img with valid hostname", () => {
    process.env.NF_ALLOWED_RTE_IMG_HOSTNAMES = "documents.neufund.io,web3.com";

    const html = `
      <img src="https://documents.neufund.io/image-id" alt="Scutums assimilant" />
      
      <img src="https://web3.com/images/image-id" />
      
      <img src="https://documents.neufund.io/images/image-id" onerror="alert('XSS')" />
      
      <img src="http://documents.neufund.io/images/image-id" />
      
      <img src="https://neufund.io/image-id" />
    `;

    const expectedHtml = `<span>
      <img src="https://documents.neufund.io/image-id" alt="Scutums assimilant" />
      
      <img src="https://web3.com/images/image-id" />
      
      <img src="https://documents.neufund.io/images/image-id" />
      
      
      
      
    </span>`;

    const component = shallow(<SanitizedHtml unsafeHtml={html} />);

    expect(component.html()).to.be.eq(expectedHtml);
  });

  it("should allow any img url when hostname is set to * (still block all non https one)", () => {
    process.env.NF_ALLOWED_RTE_IMG_HOSTNAMES = "*";

    const html = `
      <img src="https://fb.io/image-id" alt="Scutums assimilant" />
      
      <img src="/images/image-id" />
      
      <img src="http://documents.neufund.io/images/image-id" />
    `;

    const expectedHtml = `<span>
      <img src="https://fb.io/image-id" alt="Scutums assimilant" />
      
      <img src="/images/image-id" />
      
      
    </span>`;

    const component = shallow(<SanitizedHtml unsafeHtml={html} />);

    expect(component.html()).to.be.eq(expectedHtml);
  });

  it("should drop unsupported tags and attributes", () => {
    const html = `
      <h1>Heading 1</h1>

      <span>span element</span>
      
      <blockquote>blockquote</blockquote>
      
      <strong style="border: 1px red solid">bold text</strong>
      
      <a href="javascript:alert(0)">javascript</a>
      
      <script>alert("ruhroh!");</script>
      
      <iframe src="https://www.youtube.com/embed/c2IlcS7AHxM"></iframe>
      
      <style>.foo { color: blue; }</style>
      
      <textarea>Nifty</textarea>
    `;

    const expectedHtml = `<span>
      Heading 1

      span element
      
      blockquote
      
      <strong>bold text</strong>
      
      <a target="_blank" rel="noopener noreferrer">javascript</a>
      
      
      
      
      
      
      
      
    </span>`;

    const component = shallow(<SanitizedHtml unsafeHtml={html} />);

    expect(component.html()).to.be.eq(expectedHtml);
  });
});
