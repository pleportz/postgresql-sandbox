import Parser from "papaparse";
import fs from "fs";

const parser = new Promise(function(resolve, reject) {
  Parser.parse(
    fs.createReadStream(__dirname + "/kaggle-movies/movies_metadata.csv"),
    {
      header: true,
      complete: ({ data }) => resolve(data),
      error: error => reject(error)
    }
  );
});

const printMovies = async () => {
  const data = await parser;
  const tenThousandFirstRows = data
    .slice(0, 10000)
    .map(({ title, overview }) => ({ title, overview }));
  const stringifiedObject = JSON.stringify(tenThousandFirstRows);
  fs.writeFile(
    __dirname + "/kaggleMovies.json",
    stringifiedObject,
    "utf8",
    () => {
      return null;
    }
  );
  return data;
};

export default printMovies();
