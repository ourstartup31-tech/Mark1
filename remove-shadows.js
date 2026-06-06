const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('.');
let count = 0;
// Regex to match tailwind shadow classes like shadow-sm, hover:shadow-xl, shadow-[5px_5px_0_#0000], drop-shadow-md etc.
const regex = /(^|\s)(?:[a-z-]+:)?(?:drop-)?shadow(?:-[^\s"'`]*)?(?=\s|$|"|'|`)/g;

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (regex.test(content)) {
        const newContent = content.replace(regex, '$1'); // keep the leading space
        fs.writeFileSync(file, newContent);
        count++;
    }
});

console.log('Replaced shadows in ' + count + ' files.');
