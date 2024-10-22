const fs = require('fs').promises;
const path = require('path');

async function generateTree(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (let entry of entries) {
      const entryPath = path.join(dir, entry.name);
      // 检查是否为 node_modules 目录并跳过
      if (entry.name === 'node_modules' && entry.isDirectory()) {
        continue;
      }
      if (entry.isDirectory()) {
        console.log(`Directory: ${entryPath}`);
        await generateTree(entryPath);
      } else {
        console.log(`File: ${entryPath}`);
      }
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`Directory not found: ${dir}`);
    } else {
      console.error('Error:', err);
    }
  }
}

const projectDirectory = path.resolve(__dirname, './');
generateTree(projectDirectory).catch(console.error);
