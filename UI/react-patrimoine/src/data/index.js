import fs from 'node:fs/promises';

async function readFile(path) {
  try {
    const data = await fs.readFile(path, { encoding: 'utf8' });
    return {
      status: "OK",
      data: JSON.parse(data),
    };
  } catch (err) {
    return {
      status: "ERROR",
      error: err,
    };
  }
}


async function writeFile(path, data) {
  try {
    await fs.writeFile(path, JSON.stringify(data), {
      encoding: 'utf8',
    });
    return {
      status: "OK",
    };
  } catch (err) {
    return {
      status: "ERROR",
      error: err,
    };
  }
}

async function getPeopleAndPatrimoines() {
  const result = await readFile('dataBase.json');
  
  if (result.status === "OK") {
    const peopleData = result.data.people;
    const patrimoinesData = result.data.patrimoines;
    
    console.log(peopleData);
    console.log(patrimoinesData);
    return { "people": peopleData,
            "patrimoines" : patrimoinesData };
  } else {
    console.error('Error reading file:', result.error);
  }
}
export { readFile, writeFile, getPeopleAndPatrimoines };