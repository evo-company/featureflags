export function wrapIO (component: any, promise: Promise<any>) {
    component.$Loading.start();
    return promise
    .then(() => {
        component.$Loading.finish();
    })
    .catch((reason: string) => {
        component.$Loading.error();
        component.$Message.error(reason.toString());
    });
}
