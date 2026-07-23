const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Dialog isOpen={X} onClose={Y} -> open={X} onOpenChange={(open) => { if (!open) { Y } }}
  content = content.replace(/<Dialog\s+isOpen=\{([^}]+)\}\s+onClose=\{([^}]+)\}/g, '<Dialog open={$1} onOpenChange={(open) => { if (!open) { ($2)(); } }}');
  
  // Dialog with separate props but on same component
  content = content.replace(/isOpen=\{([^}]+)\}/g, 'open={$1}');
  
  // Button variant="success" -> variant="default"
  content = content.replace(/variant="success"/g, 'variant="default"');
  
  // Avatar src={X} fallback={Y} -> <Avatar><AvatarImage src={X} /><AvatarFallback>{Y}</AvatarFallback></Avatar>
  // This is a bit complex for regex, so we'll just fix the type in Avatar to accept src and fallback.

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'apps/web/src'));
files.forEach(replaceInFile);
