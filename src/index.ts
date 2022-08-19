import * as express from 'express';
import * as fs from 'fs';
import { ILanguage, RunBody } from './models';
import spawnPromise from './spawnPromise';

const app = express();
const port = 8080;
const languagePath = './data/languages.json';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.send('Healthy!');
});

app.get('/languages', async (_req, res) => {
  const languages = await getLanguages();
  res.send(languages);
});

async function getLanguages() {
  const languageJSON = await fs.readFileSync(languagePath, {
    encoding: 'utf8',
  });
  return JSON.parse(languageJSON) as ILanguage[];
}

async function getLanguage(languageId: number) {
  const languages = await getLanguages();
  return languages.find((x) => x.id == languageId);
}

/**
 *
 * @param imports 导入外部资源
 * @param code 代码
 * @param fileName 代码保存文件 eg: code.js/code.ts
 * @param beforInjectionCodeCmd
 * @param afterInjectionCodeCmd
 * @returns
 */
function prepareCodeCommands(
  imports: string,
  code: string,
  fileName: string,
  beforInjectionCodeCmd: string,
  afterInjectionCodeCmd: string
) {
  const commands = `${beforInjectionCodeCmd}
    code="${imports}
    ${code.replace(/"/g, '\\"')}"
    cat <<< "$code" > ${fileName}
    ${afterInjectionCodeCmd}
  `;
  return commands;
}

/**
 *
 * @param languageId 执行语言
 * @param code 代码
 *
 */
app.post('/run', async (req, res) => {
  console.log('body \n', req.body);

  const { languageId, code } = req.body as RunBody;
  const language = await getLanguage(languageId);

  if (!language) {
    res.send({ isSuccess: false, data: 'Language not found.' });
    return;
  }

  if (!code) {
    res.send({ isSuccess: false, data: 'Code cannot be empty.' });
    return;
  }

  console.log('language \n', language);

  const {
    memory,
    cpuset,
    image,
    timeout,
    fileName,
    imports,
    beforInjectionCodeCmd,
    afterInjectionCodeCmd,
  } = language as ILanguage;

  const commands = prepareCodeCommands(
    imports,
    code,
    fileName,
    beforInjectionCodeCmd,
    afterInjectionCodeCmd
  );

  console.log('commands \n', commands);

  console.time('RunTime');
  const data = await spawnPromise(
    'docker',
    [
      'run',
      '--rm',
      '-i',
      `--memory=${memory}m`,
      `--cpuset-cpus=${cpuset}`,
      image,
      '/bin/bash',
      '-c',
      commands,
    ],
    { timeout: timeout * 1000 }
  )
    .then((data) => {
      return { isSuccess: true, data: data };
    })
    .catch((error) => {
      return { isSuccess: false, data: error };
    });
  console.timeEnd('RunTime');

  res.send(data);
});

app.listen(port, () => {
  console.log('Server started at http://localhost:' + port);
});
