import { DMMF, generatorHandler } from '@prisma/generator-helper';
import * as fs from 'fs/promises';
import * as path from 'path';

generatorHandler({
  onManifest() {
    return {
      prettyName: 'Custom Prisma Generator',
      defaultOutput: './src/_gen', // 기본 출력 폴더
    };
  },
  async onGenerate(options) {
    console.log('Custom Prisma Generator is running...');

    const outputDir = options.generator.output?.value ?? './src/_gen';

    // 예제: 모델 정보를 JSON으로 저장
    const models = options.dmmf.datamodel.models;
    const jsonContent = JSON.stringify(models, null, 2);

    // 출력 폴더가 없으면 생성
    await fs.rm(outputDir, { force: true, recursive: true });

    await fs.mkdir(outputDir, { recursive: true });
    for (const model of models) {
      const output = useTemplate(model);
      console.log(model.name);
      await fs.writeFile(path.join(outputDir, model.name + '.ts'), output);
    }
    await fs.writeFile(path.join(outputDir, 'models.json'), jsonContent);

    console.log(`Generated files in ${outputDir}`);
  },
});

function useTemplate(model: DMMF.Model): string {
  let swaggerImports = new Set(['ApiProperty']);
  let relatedModels = new Set<string>();
  let enumImports = new Set<string>();
  let classDefinition = `export class ${model.name} {\n`;

  model.fields.forEach((field) => {
    const {
      name,
      type,
      isRequired,
      kind,
      isList,
      default: defaultValue,
      relationName,
    } = field;
    const isEnum = kind === 'enum';
    let propertyType = getType(type, isList, isEnum);
    let propertyDefinition = '';
    let isNullable = !isRequired;
    let needsAssertion = true;
    let propertyDecorator = 'ApiProperty';
    let decoratorOptions = isEnum
      ? `{ enum: ${type} }`
      : `{ type: ${getSwaggerType(type, isEnum)} }`;

    // enum 타입이면 import 추가
    if (isEnum) {
      enumImports.add(type);
    }

    // 관계형 모델 처리
    if (relationName) {
      relatedModels.add(type);
      decoratorOptions = isList
        ? `{ isArray: true, type: () => ${type} }`
        : `{ type: () => ${type} }`;
    }

    // 기본값이 있는 경우
    if (
      typeof defaultValue === 'string' ||
      typeof defaultValue === 'number' ||
      typeof defaultValue === 'boolean'
    ) {
      propertyDecorator = 'ApiProperty';
      swaggerImports.add('ApiProperty');
      propertyDefinition = `${name}: ${propertyType}${isNullable ? ' | null' : ''} = ${formatValue(defaultValue, type)};`;
    } else if (
      typeof defaultValue === 'object' &&
      'name' in defaultValue &&
      'args' in defaultValue
    ) {
      propertyDefinition = `${name}!: ${propertyType};`;
    } else {
      // 기본값이 없는 경우
      propertyDefinition = isNullable
        ? `${name}!: ${propertyType} | null;`
        : `${name}!: ${propertyType};`;
    }

    // 데코레이터 추가 (옵션 포함)
    classDefinition += `  @${propertyDecorator}(${decoratorOptions})\n`;
    classDefinition += `  ${propertyDefinition}\n`;
  });

  classDefinition += `}\n`;

  // Swagger import 구문 생성
  const swaggerImportStatement = `import { ${Array.from(swaggerImports).join(', ')} } from '@nestjs/swagger';`;

  // enum import 구문 생성 (여러 enum이 있을 경우 한 줄로)
  const enumImportStatement =
    enumImports.size > 0
      ? `import { ${Array.from(enumImports).join(', ')} } from '@prisma/client';`
      : '';

  // 관계형 모델 import 추가
  const relatedModelImports = Array.from(relatedModels)
    .map(
      (relatedModel) => `import { ${relatedModel} } from './${relatedModel}';`,
    )
    .join('\n');

  return [
    swaggerImportStatement,
    enumImportStatement,
    relatedModelImports,
    classDefinition,
  ]
    .filter(Boolean)
    .join('\n\n');
}

// ✅ Prisma 타입을 TS 타입으로 변환
function getType(prismaType: string, isList: boolean, isEnum = false): string {
  const typeMap: { [key: string]: string } = {
    String: 'string',
    Int: 'number',
    Float: 'number',
    Boolean: 'boolean',
    DateTime: 'Date',
    Bytes: 'Buffer',
  };
  // enum이면 타입 그대로
  const mappedType = isEnum ? prismaType : typeMap[prismaType] || prismaType;
  return isList ? `${mappedType}[]` : mappedType;
}

// ✅ Swagger 타입 변환 (원시 타입을 대문자로)
function getSwaggerType(prismaType: string, isEnum = false): string {
  const typeMap: { [key: string]: string } = {
    String: 'String',
    Int: 'Number',
    Float: 'Number',
    Boolean: 'Boolean',
    DateTime: 'Date',
    Bytes: 'Buffer',
  };
  // enum이면 enum 객체로
  return isEnum ? prismaType : typeMap[prismaType] || prismaType;
}

// ✅ 기본값 포맷팅 함수
function formatValue(value: any, type: string): string {
  if (typeof value === 'string') return `'${value}'`;
  if (type === 'DateTime' && typeof value === 'object') return 'new Date()';
  return String(value);
}
