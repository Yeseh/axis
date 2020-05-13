import {createNamespace} from '@axis/request-state';

async function main() {
    const {namespace} = await createNamespace('test');
    namespace.run(() => {
        const test = namespace.set('test', 'test');
        console.log(`test value is: ${test}`);
    });
}

main();
