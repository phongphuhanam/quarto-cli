/*
* profile.ts
*
* Copyright (C) 2022 by RStudio, PBC
*
*/

import { Args } from "flags/mod.ts";
import { error } from "log/mod.ts";
import { join } from "path/mod.ts";

import { Command } from "cliffy/command/mod.ts";
import { ProjectConfig } from "../project/types.ts";
import { logProgress } from "./log.ts";
import * as ld from "./lodash.ts";
import { readAndValidateYamlFromFile } from "./schema/validated-yaml.ts";
import { mergeProjectMetadata } from "../config/metadata.ts";
import { safeExistsSync } from "./path.ts";
import { Schema } from "./lib/yaml-schema/types.ts";

export const kQuartoProfile = "QUARTO_PROFILE";
export const kQuartoProfileConfig = "profile";
export const kQuartoProfileConfigGroup = "group";
export const kQuartoProfileConfigDefault = "default";

type QuartoProfileConfig = {
  default?: string | string[] | undefined;
  group?: string[] | Array<string[]> | undefined;
};

export function readProfileArg(args: Args) {
  // set profile if specified
  if (args.profile) {
    Deno.env.set(kQuartoProfile, args.profile);
  }
}

// deno-lint-ignore no-explicit-any
export function appendProfileArg(cmd: Command<any>): Command<any> {
  return cmd.option(
    "--profile",
    "Project configuration profile",
    {
      global: true,
    },
  );
}

export function activeProfiles(): string[] {
  return readProfile(Deno.env.get(kQuartoProfile));
}

// cache original QUARTO_PROFILE env var
let baseQuartoProfile: string | undefined;

export async function initializeProfileConfig(
  dir: string,
  config: ProjectConfig,
  schema: Schema,
) {
  // read the original env var once
  if (baseQuartoProfile === undefined) {
    baseQuartoProfile = Deno.env.get(kQuartoProfile) || "";
  }

  // read the config then delete it
  const profileConfig = ld.isObject(config[kQuartoProfileConfig])
    ? config[kQuartoProfileConfig] as QuartoProfileConfig
    : undefined;
  delete config[kQuartoProfileConfig];

  // if there is no profile defined see if the user has provided a default
  let quartoProfile = baseQuartoProfile;
  if (!quartoProfile) {
    if (Array.isArray(profileConfig?.default)) {
      quartoProfile = profileConfig!.default
        .map((value) => String(value)).join(",");
    } else if (typeof (profileConfig?.default) === "string") {
      quartoProfile = profileConfig.default;
    }
  }

  // read any profile defined (could be from base env or from the default)
  const active = readProfile(quartoProfile);
  if (active.length === 0) {
    //  do some smart detection of connect if there are no profiles defined
    if (Deno.env.get("RSTUDIO_PRODUCT") === "CONNECT") {
      active.push("connect");
    }
  }

  // read profile groups -- ensure that at least one member of each group is in the profile
  const groups = readProfileGroups(profileConfig);
  for (const group of groups) {
    if (!group.some((name) => active!.includes(name))) {
      active.push(group[0]);
    }
  }

  // set the environment variable for those that want to read it directly
  Deno.env.set(kQuartoProfile, active.join(","));

  // print profile if not quiet
  if (active.length > 0) {
    logProgress(`Profile: ${active.join(",")}\n`);
  }

  return await mergeProfiles(
    dir,
    config,
    schema,
  );
}

async function mergeProfiles(
  dir: string,
  config: ProjectConfig,
  schema: Schema,
) {
  // config files to return
  const files: string[] = [];

  // merge all active profiles
  for (const profileName of activeProfiles()) {
    const profilePath = [".yml", ".yaml"].map((ext) =>
      join(dir, `_quarto.${profileName}${ext}`)
    ).find(safeExistsSync);
    if (profilePath) {
      try {
        const yaml = await readAndValidateYamlFromFile(
          profilePath,
          schema,
          `Validation of configuration profile file ${profileName} failed.`,
        );
        config = mergeProjectMetadata(config, yaml);
        files.push(profilePath);
      } catch (e) {
        error(
          "\nError reading configuration profile file from " + profileName +
            "\n",
        );
        throw e;
      }
    }
  }

  return { config, files };
}

function readProfile(profile?: string) {
  if (profile) {
    return profile.split(/[ ,]+/);
  } else {
    return [];
  }
}

function readProfileGroups(
  profileConfig?: QuartoProfileConfig,
): Array<string[]> {
  // read all the groups
  const groups: Array<string[]> = [];
  const configGroup = profileConfig?.group as unknown;
  if (Array.isArray(configGroup)) {
    // array of strings is a single group
    if (configGroup.every((value) => typeof (value) === "string")) {
      groups.push(configGroup);
    } else if (configGroup.every(Array.isArray)) {
      groups.push(...configGroup);
    }
  }
  return groups;
}
