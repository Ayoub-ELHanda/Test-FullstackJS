import { writeFileSync, mkdirSync, chmodSync } from 'fs';
import { join } from 'path';

const hookPath = join(process.cwd(), '.git', 'hooks', 'pre-push');

// Exit code 0 = success → push continues.
// Exit code 1 = failure → push is BLOCKED.
const script = `#!/bin/sh

echo ""
echo "Running tests before push..."
echo ""

npm run test:run

EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo ""
  echo "Tests failed. Push blocked."
  echo "Fix the failing tests above, then try again."
  echo ""
  exit 1
fi

echo ""
echo "All tests passed. Pushing..."
echo ""
exit 0
`;

try {
  mkdirSync(join(process.cwd(), '.git', 'hooks'), { recursive: true });
  writeFileSync(hookPath, script);  
  chmodSync(hookPath, '755');      
  console.log('Git pre-push hook installed.');
} catch {
  
}