export interface RouteDefinition {
    path: string;
    method: 'get' | 'post' | 'delete' | 'put';
    methodName: string;
}