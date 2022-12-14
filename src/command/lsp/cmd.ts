/*
* cmd.ts
*
* Copyright (C) 2020-2022 Posit Software, PBC
*
*/

import { Command } from "cliffy/command/mod.ts";
import { runLspServer } from "../../lsp/lsp.ts";

export const lspCommand = new Command()
  .name("lsp")
  .description(
    "Run the Quarto LSP Server",
  )
  .hidden()
  .action(() => {
    runLspServer();
  });
