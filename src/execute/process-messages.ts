/*
* process-messages.ts
*
* Copyright (C) 2020-2023 Posit Software, PBC
*
*/

import { asMappedString, MappedString } from "../core/mapped-text.ts";

export function processMessages(
  md: MappedString,
  messages: unknown[],
): MappedString {
  const processCellCaption = (
    md: MappedString,
    cellLabel: string,
    payload: Record<string, unknown> | unknown[],
  ) => {
    if (!Array.isArray(payload) || payload.length === 0) {
      throw new Error(
        "Internal error, set_cell_caption expected array payload of non-zero",
      );
    }
    const caption = payload[0];
    if (typeof caption !== "string") {
      throw new Error(
        "Internal error, set_cell_caption expected string payload",
      );
    }

    // FIXME maintain source map, escape correctly, etc etc.

    return asMappedString(
      md.value.replace(
        new RegExp(`::: \{#${cellLabel} \.cell\}`),
        `::: {#${cellLabel} .cell tbl-cap=${JSON.stringify(caption)}}`,
      ),
    );
  };

  for (const message of messages) {
    if (!(message && typeof message === "object")) {
      // FIXME improve this.
      throw new Error(`Internal Error: messages should be objects`);
    }
    const messageObj = message as Record<string, unknown>;
    const messageName = messageObj.message;
    const cellLabel = messageObj.cell_name;

    if (typeof messageName !== "string") {
      // FIXME improve this.
      throw new Error(
        `Internal Error: messages should have message string key`,
      );
    }
    if (typeof cellLabel !== "string") {
      // FIXME improve this.
      throw new Error(
        `Internal Error: messages should have label string key`,
      );
    }

    const messageContent = messageObj.payload;
    if (!(messageContent && typeof messageContent === "object")) {
      // FIXME improve this.
      throw new Error(`Internal Error: message payload should be object`);
    }

    switch (messageName) {
      case "set_cell_caption":
        md = processCellCaption(md, cellLabel, messageContent as any);
        break;
      default: // pass, ignore unknown messages
    }
  }
  return md;
}
