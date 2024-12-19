// run notebooks in CI: deno run --allow-run=jupyter -R ./test.ts

if (import.meta.main) {
  const files = Deno.readDirSync(".");
  let success = true;

  for (const file of files) {
    if (
      !file.isFile ||
      !file.name.endsWith(".ipynb") ||
      !file.name.match(/^[0-9]+/gi)
    ) {
      continue;
    }

    const command = new Deno.Command("jupyter", {
      args: ["execute", "--kernel_name=deno", file.name],
    });

    const { code, stderr } = await command.output();

    if (code !== 0) {
      console.error(`${file.name} ⛔`);
      console.error(new TextDecoder().decode(stderr));
      success = false;
    } else {
      console.log(`${file.name} ✅`);
    }
  }

  Deno.exit(success ? 0 : 1);
}
