/*
 * notebook-contributor-ipynb.ts
 *
 * Copyright (C) 2020-2022 Posit Software, PBC
 */

import { renderFiles } from "../../command/render/render-files.ts";
import {
  ExecutedFile,
  RenderedFile,
  RenderServices,
} from "../../command/render/types.ts";
import {
  kClearHiddenClasses,
  kKeepHidden,
  kOutputFile,
  kRemoveHidden,
  kTo,
  kUnrollMarkdownCells,
} from "../../config/constants.ts";
import { InternalError } from "../../core/lib/error.ts";
import { dirAndStem } from "../../core/path.ts";
import { ProjectContext } from "../../project/types.ts";
import { Notebook, NotebookContributor } from "./notebook-types.ts";

import * as ld from "../../core/lodash.ts";

import { error } from "log/mod.ts";

export const ipynContributor: NotebookContributor = {
  resolve: resolveIpynb,
  render: renderIpynb,
  cleanup: (_notebooks: Notebook[]) => {
  },
};

function resolveIpynb(
  nbAbsPath: string,
  _token: string,
  executedFile: ExecutedFile,
) {
  const resolved = ld.cloneDeep(executedFile);
  resolved.recipe.format.pandoc[kOutputFile] = ipynbOutputFile(
    nbAbsPath,
  );
  resolved.recipe.output = resolved.recipe.format.pandoc[kOutputFile];

  // Configure echo for this rendering
  resolved.recipe.format.execute.echo = false;
  resolved.recipe.format.execute.warning = false;
  resolved.recipe.format.render[kKeepHidden] = true;
  resolved.recipe.format.metadata[kClearHiddenClasses] = "all";
  resolved.recipe.format.metadata[kRemoveHidden] = "none";

  // Configure markdown behavior for this rendering
  resolved.recipe.format.metadata[kUnrollMarkdownCells] = false;
  return resolved;
}
async function renderIpynb(
  nbPath: string,
  _subArticleToken: string,
  services: RenderServices,
  project?: ProjectContext,
): Promise<RenderedFile> {
  const rendered = await renderFiles(
    [{ path: nbPath, formats: ["ipynb"] }],
    {
      services,
      flags: {
        metadata: {
          [kTo]: "ipynb",
          [kOutputFile]: ipynbOutputFile(nbPath),
        },
        quiet: false,
      },
      echo: true,
      warning: true,
      quietPandoc: true,
    },
    [],
    undefined,
    project,
  );

  // An error occurred rendering this subarticle
  if (rendered.error) {
    error("Rendering of output notebook produced an unexpected result");
    throw (rendered.error);
  }

  // There should be only one file
  if (rendered.files.length !== 1) {
    throw new InternalError(
      `Rendering an output notebook should only result in a single file. This attempt resulted in ${rendered.files.length} file(s).`,
    );
  }

  return rendered.files[0];
}

function ipynbOutputFile(nbAbsPath: string) {
  const [_dir, stem] = dirAndStem(nbAbsPath);
  return `${stem}.out.ipynb`;
}
