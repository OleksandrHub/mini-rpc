export declare const api: {
    hello: (name: string) => string;
    users: {
        get: (id: number) => {
            id: number;
            name: string;
        };
        list: () => {
            id: number;
            name: string;
        }[];
        create: (name: string) => {
            id: number;
            name: string;
        };
        remove: (id: number) => {
            id: number;
            name: string;
        };
    };
    posts: {
        get: (id: number) => {
            id: number;
            userId: number;
            title: string;
        };
        listByUser: (userId: number) => {
            id: number;
            userId: number;
            title: string;
        }[];
        create: (userId: number, title: string) => {
            id: number;
            userId: number;
            title: string;
        };
        remove: (id: number) => {
            id: number;
            userId: number;
            title: string;
        };
    };
};
