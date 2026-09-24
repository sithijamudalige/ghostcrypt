const fs = require('fs');

// 1. Update globals.css
let css = fs.readFileSync('src/app/globals.css', 'utf8');

const responsiveCSS = `
.responsive-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.responsive-grid-2-sm {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
.responsive-grid-2-end {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  align-items: end;
}
.responsive-grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
    height: auto;
  }
  .navbar-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.8rem;
  }
  .responsive-grid-2,
  .responsive-grid-2-sm,
  .responsive-grid-2-end {
    grid-template-columns: 1fr !important;
  }
}
`;

if (!css.includes('.responsive-grid-2')) {
  css += '\n' + responsiveCSS;
  fs.writeFileSync('src/app/globals.css', css);
}

// 2. Update tsx files
function replaceInFile(path, replacements) {
  let content = fs.readFileSync(path, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(path, content);
}

replaceInFile('src/app/page.tsx', [
  ["style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2rem' }}", "className=\"responsive-grid-cards\""]
]);

replaceInFile('src/app/labs/page.tsx', [
  ["style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2rem' }}", "className=\"responsive-grid-cards\""]
]);

replaceInFile('src/app/dashboard/page.tsx', [
  ["style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}", "className=\"responsive-grid-2-end\""]
]);

replaceInFile('src/app/admin/page.tsx', [
  ["style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}", "className=\"responsive-grid-2\" style={{ marginTop: '2rem' }}"],
  ["style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}", "className=\"responsive-grid-2-sm\""],
  ["style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}", "className=\"responsive-grid-2-end\""]
]);

console.log('Responsive updates applied!');
