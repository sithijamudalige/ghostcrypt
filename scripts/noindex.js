const fs = require('fs');
const dirs = ['dashboard', 'admin', 'login', 'encrypt', 'fix-labs', 'quizzes'];
const layoutCode = `import { Metadata } from 'next';
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`;

for (const dir of dirs) {
  const path = 'src/app/' + dir + '/layout.tsx';
  fs.writeFileSync(path, layoutCode);
}
