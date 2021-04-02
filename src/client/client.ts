import { execute } from '../server/server';
import { GetHelloDocument, GetAuthorDocument } from './gen-types';

async function test() {
  const result1 = await execute(GetAuthorDocument, {id: '1'});
  const result2 = await execute(GetHelloDocument);
  console.log('result 1');
  console.log(result1.data!.author);
  console.log('result 2');
  console.log(result2.data!.hello);
}

test();
  
  


