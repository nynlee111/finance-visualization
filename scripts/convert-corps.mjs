#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = process.cwd();
const outputPath = path.join(root, 'public', 'data', 'corps.json');

function hasValidCorpsJson() {
  try {
    if (!fs.existsSync(outputPath)) return false;
    const raw = fs.readFileSync(outputPath, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}

if (hasValidCorpsJson()) {
  console.log(`기존 corps.json 사용 (건너뜀): ${outputPath}`);
  process.exit(0);
}

const candidates = [
  process.env.CORP_XML_PATH,
  path.join(root, 'data', 'corp.xml'),
  'C:\\Users\\123\\Downloads\\corp.xml',
].filter(Boolean);

const corpXmlPath = candidates.find((p) => fs.existsSync(p));

if (!corpXmlPath) {
  console.error(
    'corp.xml을 찾을 수 없고 public/data/corps.json도 없습니다. CORP_XML_PATH를 설정하거나 data/corp.xml을 두세요.'
  );
  process.exit(1);
}

const xmlData = fs.readFileSync(corpXmlPath, 'utf8');

const options = {
  ignoreAttributes: false,
  parseTagValue: false,
};

const parser = new XMLParser(options);
const result = parser.parse(xmlData);

const corporations = [];
if (result.result && result.result.list) {
  const list = Array.isArray(result.result.list) ? result.result.list : [result.result.list];

  list.forEach((item) => {
    corporations.push({
      corp_code: item.corp_code || '',
      corp_name: item.corp_name || '',
      corp_eng_name: item.corp_eng_name || '',
      stock_code: item.stock_code || '',
      modify_date: item.modify_date || '',
    });
  });
}

const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(corporations, null, 2), 'utf8');

console.log(`변환 완료: ${corporations.length}개 기업 데이터`);
console.log(`저장 위치: ${outputPath}`);
