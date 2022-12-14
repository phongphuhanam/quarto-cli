/* --------------------------------------------------------------------------------------------
 * Copyright (c) RStudio, PBC. All rights reserved.
 * Copyright (c) 2016 James Yu
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

// based on https://github.com/James-Yu/LaTeX-Workshop/tree/master/src/providers/preview

import type {
  ConvertOption,
  SupportedExtension,
  SvgOption,
  TexOption,
} from "npm:mathjax-full/index.js";
import { mathjax } from "npm:mathjax-full/js/mathjax.js";
import { TeX } from "npm:mathjax-full/js/input/tex.js";
import { SVG } from "npm:mathjax-full/js/output/svg.js";
import { liteAdaptor } from "npm:mathjax-full/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "npm:mathjax-full/js/handlers/html.js";
import type { LiteElement } from "npm:mathjax-full/js/adaptors/lite/Element.js";
import type { MathDocument } from "npm:mathjax-full/js/core/MathDocument.js";
import type { LiteDocument } from "npm:mathjax-full/js/adaptors/lite/Document.js";
import type { LiteText } from "npm:mathjax-full/js/adaptors/lite/Text.js";
import "npm:mathjax-full/js/input/tex/AllPackages.js";

import { MarkupContent, MarkupKind } from "npm:vscode-languageserver-types";

import { Buffer } from "https://deno.land/std@0.166.0/node/buffer.ts";

const baseExtensions: SupportedExtension[] = [
  "ams",
  "base",
  "color",
  "newcommand",
  "noerrors",
  "noundefined",
];

function createHtmlConverter(extensions: SupportedExtension[]) {
  const baseTexOption: TexOption = {
    packages: extensions,
    formatError: (_jax: unknown, error: Error) => {
      throw new Error(error.message);
    },
  };
  const texInput = new TeX<LiteElement, LiteText, LiteDocument>(baseTexOption);
  const svgOption: SvgOption = { fontCache: "local" };
  const svgOutput = new SVG<LiteElement, LiteText, LiteDocument>(svgOption);
  return mathjax.document("", {
    InputJax: texInput,
    OutputJax: svgOutput,
  }) as MathDocument<LiteElement, LiteText, LiteDocument>;
}

// some globals
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
let html = createHtmlConverter(baseExtensions);
let loadedExtensions = baseExtensions;

export function mathjaxLoadExtensions() {
  loadedExtensions = baseExtensions;
  html = createHtmlConverter(loadedExtensions);
}

export function mathjaxLoadedExtensions() {
  return loadedExtensions as string[];
}

export function mathjaxTypesetToMarkdown(tex: string): MarkupContent | null {
  // remove crossref if necessary
  tex = tex.replace(/\$\$\s+\{#eq[\w\-]+\}\s*$/, "");

  const typesetOpts = {
    scale: 1,
    color: getColor(),
  };
  try {
    const svg = typesetToSvg(tex, typesetOpts);
    const md = svgToDataUrl(svg);
    return {
      kind: MarkupKind.Markdown,
      value: `![equation](${md})`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      kind: MarkupKind.Markdown,
      value: "**LaTeX Error**:\n" + message || "Unknown error",
    };
  }
}

function typesetToSvg(
  arg: string,
  opts: { scale: number; color: string },
): string {
  const convertOption: ConvertOption = {
    display: true,
    em: 18,
    ex: 9,
    containerWidth: 80 * 18,
  };
  const node = html.convert(arg, convertOption) as LiteElement;

  const css = `svg {font-size: ${
    100 * opts.scale
  }%;} * { color: ${opts.color} }`;
  let svgHtml = adaptor.innerHTML(node);
  svgHtml = svgHtml.replace(/<defs>/, `<defs><style>${css}</style>`);
  return svgHtml;
}

function getColor() {
  const lightness = "light";
  if (lightness === "light") {
    return "#000000";
  } else {
    return "#ffffff";
  }
}

function svgToDataUrl(xml: string): string {
  // We have to call encodeURIComponent and unescape because SVG can includes non-ASCII characters.
  // We have to encode them before converting them to base64.
  const svg64 = Buffer.from(
    unescape(encodeURIComponent(xml)),
    "binary",
  ).toString("base64");
  const b64Start = "data:image/svg+xml;base64,";
  return b64Start + svg64;
}

console.log(mathjaxTypesetToMarkdown("\\frac{\\pi r^2}{2}"));
