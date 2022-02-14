import Walk from "klaw";
import { ConnectionOptions, createConnection } from "typeorm";

import { File } from "./models/File";

const options: ConnectionOptions = {
  type: "sqlite",
  database: `files.db`,
  entities: [File],
  logging: false,
  synchronize: true,
};

async function main() {
  await createConnection(options);
  const walker = Walk("/run/media/rohan/T1");

  const date = Date.now();
  /*   const file = await File.find();
  for (const { id, path, isDir } of file) console.log(id, path, isDir); */

  for await (const { path, stats } of walker) {
    const file = new File();
    file.path = path;
    file.isDir = stats.isDirectory();

    file.save();
  }
  console.log("Done in", Date.now() - date, "ms");
}

main().catch((err: Error) => {
  console.log(err.name);
});
