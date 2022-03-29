import * as ts from 'ts-morph';

const project = new ts.Project({});
project.addSourceFilesFromTsConfig('./tsconfig.json');

const demoFile = project.getSourceFile('demo.ts');

if (!demoFile) {
    throw new Error();
}

const output = project.createSourceFile('codegen-output.ts', writer => {
    const actionsTypeDecl = demoFile.getTypeAliasOrThrow('Action');
    const actionsType = actionsTypeDecl.getType();
    const actionsTypeType = actionsType.getUnionTypes();

    for (const actionTypeType of actionsTypeType) {
        const actionName = actionTypeType.getAliasSymbol()?.getEscapedName();
        const typeProperty = actionTypeType.getPropertyOrThrow('type');
        const typeValue = typeProperty.getValueDeclarationOrThrow().getType().getLiteralValueOrThrow();

        writer
            .write(
                `function ${typeValue.toString().replace(/_ACTION$/, '')}(payload: Omit<${actionName}, 'type'>)`
            )
            .block(() => {
                writer.writeLine(`dispatch('${typeValue}', payload)`)
            })
    }
}, {overwrite: true});

output.fixMissingImports();
output.save();
