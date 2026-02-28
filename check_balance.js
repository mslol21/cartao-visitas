const fs = require('fs');
const content = fs.readFileSync('C:/Users/massa/Desktop/Projetos/konnexy/src/components/card/CardPreview.tsx', 'utf8');

function checkBalance(text) {
    let stack = [];
    let lines = text.split('\n');
    let inString = null;
    let inComment = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        for (let j = 0; j < line.length; j++) {
            let char = line[j];
            let next = line[j+1];

            if (inComment) {
                if (char === '*' && next === '/') { inComment = false; j++; }
                continue;
            }
            if (inString) {
                if (char === inString && line[j-1] !== '\\') inString = null;
                continue;
            }
            if (char === '/' && next === '/') break;
            if (char === '/' && next === '*') { inComment = true; j++; continue; }
            if (char === '"' || char === "'" || char === '`') { inString = char; continue; }

            if (char === '{' || char === '(' || char === '[') {
                stack.push({ char, line: i + 1 });
            } if (char === '}' || char === ')' || char === ']') {
                let last = stack.pop();
                if (!last) {
                    console.log(`Extra close: ${char} at line ${i + 1}`);
                    continue;
                }
                if (char === '}' && last.char !== '{') console.log(`Mismatch: { matched by ${char} at line ${i + 1} (opened at ${last.line})`);
                if (char === ')' && last.char !== '(') console.log(`Mismatch: ( matched by ${char} at line ${i + 1} (opened at ${last.line})`);
                if (char === ']' && last.char !== '[') console.log(`Mismatch: [ matched by ${char} at line ${i + 1} (opened at ${last.line})`);
            }
        }
    }
    while (stack.length > 0) {
        let last = stack.pop();
        console.log(`Unclosed: ${last.char} opened at line ${last.line}`);
    }
}

checkBalance(content);
