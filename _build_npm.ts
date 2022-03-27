#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env --allow-run
// Copyright 2018-2022 the oak authors. All rights reserved. MIT license.

/**
 * This is the build script for building the oak framework into a Node.js
 * compatible npm package.
 *
 * @module
 */

import { build, emptyDir } from "https://deno.land/x/dnt@0.21.0/mod.ts";

async function start() {
  await emptyDir("./npm");

  await build({
    entryPoints: ["./mod.ts"],
    outDir: "./npm",
    shims: {
      deno: true,
      timers: true,
    },
    test: true,
    compilerOptions: {
      importHelpers: true,
      target: "ES2021",
    },
    package: {
      name: "simple-immutable-record",
      version: Deno.args[0].substring("refs/tags/v".length),
      description:
        "The sole purpose of this immutable record is to simply act as a class factory for immutable types. For this particular implementation, it piggybacks off of immer and adds a with method to the record class.",
      license: "MIT",
      author: "Michael Tyson",
      engines: {
        node: ">=16.5.0 <18",
      },
      repository: {
        type: "git",
        url: "git+https://github.com/myty/immutable-record.git",
      },
      bugs: {
        url: "https://github.com/myty/immutable-record/issues",
      },
      homepage: "https://github.com/myty/immutable-record#readme",
      dependencies: {
        "tslib": "~2.3.1",
      },
      devDependencies: {
        "@types/node": "^16",
      },
    },
  });

  await Deno.copyFile("LICENSE", "npm/LICENSE");
  await Deno.copyFile("README.md", "npm/README.md");
}

start();
