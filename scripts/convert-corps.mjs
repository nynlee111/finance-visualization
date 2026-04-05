#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

const corpXmlPath = 'C:\\Users\\123\\Downloads\\corp.xml';
const outputPath = path.join(process.cwd(), 'public', 'data', 'corps.json');

if (!fs.existsSync(corpXmlPath)) {
  console.error(`corp.xml 파일을 찾을 수 없습니다: ${corpXmlPath}`);
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

console.log(`✅ 변환 완료: ${corporations.length}개 기업 데이터`);
console.log(`📁 저장 위치: ${outputPath}`);
