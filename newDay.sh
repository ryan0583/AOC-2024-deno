mkdir solutions/$1
cat <<EOF > solutions/$1/solution.ts
import path from 'node:path';
import { readLines } from '../../fileParser';
import { log } from '../../logger';

const lines = readLines(path.resolve(), 'solutions/$1/input.txt');

log(lines);
EOF
touch solutions/$1/input.txt