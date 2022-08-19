import fetch from 'node-fetch';

interface IResult {
  isSuccess: boolean;
  data: any;
}

async function runCode(languageId: string, code: string): Promise<IResult> {
  const res = await fetch('http://localhost:8080/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      languageId: languageId,
      code: code,
    }),
  }).then((res) => res.json());
  return res;
}

describe('run javascript code', () => {
  const javascriptLanguageId = '1';
  it('should return an console.log result', async () => {
    const result = await runCode(javascriptLanguageId, 'console.log(1)');
    expect(result.data).toBe('1\n');
  });

  it('should return an sort result', async () => {
    const result = await runCode(
      javascriptLanguageId,
      `
      function sort(arr){
        return arr.sort();
      }
      console.log(sort([1,3,2]));
    `
    );
    expect(result.data).toBe('[ 1, 2, 3 ]\n');
  });

  it('should return an error', async () => {
    const result = await runCode(javascriptLanguageId, `console.log(a);`);
    expect(result.data).toContain('a is not defined');
  });
});
